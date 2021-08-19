import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenListProvider } from '@solana/spl-token-registry';
import { 
    SOLANA_RPC_ENDPOINT, 
    TOKEN_PROGRAM_PUBKEY,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    LAMPORTS_PER_SOL,
} from './const';
import { TokenType, ProgramAccount } from './types';

export const getSolanaBalance = async (address: string) => {
    return await fetch (SOLANA_RPC_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json', 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'getBalance',
            'params': [address]
        })
    }).then(res => {
        return res.json();
    }).then(balance => {
        // console.log('SOL_BALANCE: ', balance.result.value / LAMPORTS_PER_SOL);
        return balance.result.value / LAMPORTS_PER_SOL;
    }).catch(error => {
        console.log('Error fetching data: ', error);
    });
}

/*
 * The associated token account for a given wallet address is simply a program-derived account consisting of 
 * the wallet address itself and the token mint.
 */
const findAssociatedTokenAddress = async (
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): Promise<PublicKey> => {
    return (await PublicKey.findProgramAddress(
        [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    ))[0];
}

const getProgramAccounts = async (pubkey: PublicKey) => {
    return await fetch(SOLANA_RPC_ENDPOINT, {
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'getProgramAccounts',
            'params': [
                TOKEN_PROGRAM_PUBKEY.toBase58(),
                {
                    'encoding': 'jsonParsed',
                    'filters': [
                        {
                            'dataSize': 165
                        },
                        {
                            'memcmp': {
                                'offset': 32,
                                'bytes': pubkey.toBase58(),
                            }
                        }
                    ]
                }
            ]
        })
    }).then(res => {
        return res.json();
    }).then(programAccounts => {
        return programAccounts.result;
    }).catch(error => {
        console.log('Error fetching data: ', error);
    });
}

const getTokenMap = async (walletAddress: PublicKey, network: string) => {
    const tokenList = await new TokenListProvider().resolve().then(tokens => {
        const tokenList = tokens.filterByClusterSlug(network).getList();
        return tokenList;
    });
    const mapToAssociatedTokenAddress = tokenList.map(async (token) => {
        const mintAddress = new PublicKey(token.address);
        const associatedTokenAddress = await findAssociatedTokenAddress(walletAddress, mintAddress);

        const newTokenObj = {
            ...token,
            associatedTokenAddress: associatedTokenAddress.toBase58(),
        }
        return newTokenObj;
    });

    const tokens = await Promise.all(mapToAssociatedTokenAddress).then(result => {
        return result;
    })

    let tokenMap = new Map();
    tokens.reduce((map, token) => {
        map.set(token.associatedTokenAddress, token);
        return map;
    }, tokenMap);
    return tokenMap;
}

const markDuplicates = (validTokens: TokenType[]) => {
    const lookup = validTokens.reduce((a: any, e: any) => {
        a[e.address] = ++a[e.address] || 0;
        return a;
      }, {});

    const duplicatesList = validTokens.filter((e: TokenType) => lookup[e.address]);
    const markDuplicates = validTokens.map((token: TokenType) => {
        if (duplicatesList.includes(token)) {
            return {
                ...token,
                duplicate: '*There are multiple accounts associated with this mint address.',
            }
        } else {
            return {
                ...token,
            }
        }
    });
    return markDuplicates;
}

export const getTokenList = async (address: string, network: string) => {
    const walletAddress = new PublicKey(address);
    const programAccounts = await getProgramAccounts(walletAddress);
    // console.log('PROGRAM_ACCOUNTS: ', programAccounts);
    const tokenMap = await getTokenMap(walletAddress, network);

    /*
     * Attributes we need from programAccounts:
     * account data, mint address, token
     * 
     * Attributes we need from tokenMap:
     * chainId, logoURI, name, symbol 
     */
    const mapToAssociatedTokenAddress = programAccounts.map(async (account: ProgramAccount) => {
        const accountData = account.account.data.parsed.info;
        
        const mintAddress = new PublicKey(accountData.mint);
        const associatedTokenAddress = await findAssociatedTokenAddress(walletAddress, mintAddress);

        const currToken = tokenMap.get(associatedTokenAddress.toBase58());
        const tokenObj = {
            // IMPORTANT: address here refers to associatedTokenAddress
            address: associatedTokenAddress.toBase58(),
            amount: parseInt(accountData.tokenAmount.amount) / Math.pow(10, accountData.tokenAmount.decimals),
            chainId: currToken?.chainId,
            logoURI: currToken?.logoURI,
            name: currToken?.name,
            symbol: currToken?.symbol,
            tags: currToken?.tags,
        }
        return tokenObj as TokenType;
    });

    const tokenList = await Promise.all(mapToAssociatedTokenAddress).then(result => {
        return result as TokenType[];
    })

    let validTokens = tokenList.filter((token: TokenType) => token.chainId);
    validTokens.sort((t1: TokenType, t2: TokenType) => t2.amount - t1.amount);
    validTokens = markDuplicates(validTokens);
    // There are 4 duplicates: USD Coin, Serum, The Convergence War, and Bonfida

    // These tokens only have associatedAccountAddress and amount
    let undefinedTokens = tokenList.filter((token: TokenType) => !token.chainId);
    // console.log('UNDEFINED_TOKENS: ', undefinedTokens);
    
    // console.log('TOKEN_LIST: ', validTokens);
    return validTokens as TokenType[];
}

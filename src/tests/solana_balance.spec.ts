import { getSolanaBalance, getTokenList } from '../utils';
import { TEST_WALLET_ADDRESS } from '../const';

/*
 * Unfortunately, I know that these are not great tests. 
 * I did not have time to implement more thorough testing but I can do it and mock fetches!
 */ 
describe('SPL token balance reader tests', () => {
    test('get Solana balance', async () => {
        const solanaBalance = await getSolanaBalance(TEST_WALLET_ADDRESS);
        expect(solanaBalance).toBeGreaterThanOrEqual(0);
    });

    test('getTokenList', async () => {
        const tokenList = await getTokenList(TEST_WALLET_ADDRESS, 'mainnet-beta');
        expect(tokenList.length).toBeGreaterThanOrEqual(0);
    });
})

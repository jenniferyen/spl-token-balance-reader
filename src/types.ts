export type TokenType = {
    address: string,
    amount: number,
    chainId?: number,
    logoURI: string,
    name: string,
    symbol: string,
    tags: string[],
    duplicate?: string,
}

export interface ProgramAccount {
    pubkey: string,
    account: {
        data: {
            parsed: {
                info: {
                    isNative: boolean,
                    mint: string,
                    owner: string,
                    state: string,
                    tokenAmount: {
                        amount: string,
                        decimals: number,
                        uiAmount: number,
                        uiAmountString: string,
                    }
                },
                type: string,
            },
            program: string,
            space: number,
        },
        executable: boolean,
        lamports: number,
        owner: string,
        rentEpoch: number,
    }
}

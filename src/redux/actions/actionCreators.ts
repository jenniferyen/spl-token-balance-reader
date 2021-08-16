import { Dispatch } from 'react';
import { getTokenList } from '../../utils';

export interface WalletAction {
    type: string,
    tokens: any,
    error: any
}

export const getTokenBalances = (address: string, network: string) => {
    return async (dispatch: Dispatch<WalletAction>) => {
        try {
            const tokenList = await getTokenList(address, network);
            dispatch({
                type: 'GET_TOKEN_BALANCES_SUCCESS',
                tokens: tokenList,
                error: null,
            });
        } catch (err) {
            // Hide tokens
            dispatch({
                type: 'GET_TOKEN_BALANCES_FAILURE',
                tokens: [],
                error: 'Error: Invalid wallet address. Please try again.',
            });
        }
    }
}

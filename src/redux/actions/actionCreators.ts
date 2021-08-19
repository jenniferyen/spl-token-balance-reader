import { Dispatch } from 'react';
import { getTokenList } from '../../utils';
import { TokenType } from '../../types';

export interface WalletAction {
    type: string,
    tokens: TokenType[],
    error: string
}

export const getTokenBalances = (address: string, network: string) => {
    return async (dispatch: Dispatch<WalletAction>) => {
        try {
            const tokenList = await getTokenList(address, network);
            dispatch({
                type: 'GET_TOKEN_BALANCES_SUCCESS',
                tokens: tokenList,
                error: '',
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

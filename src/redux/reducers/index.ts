import { TokenType } from '../../types';
import { WalletAction } from '../actions/actionCreators';

type WalletState = {
    tokenList: TokenType[],
    error: string | undefined;
}

const initialState = {
    tokenList: [],
    error: '',
}

export const Reducer = (state: WalletState = initialState, action: WalletAction) => {
    switch (action.type) { 
        case 'GET_TOKEN_BALANCES_SUCCESS': 
            return {
                ...state,
                tokenList: action.tokens,
                error: action.error,
            }
        case 'GET_TOKEN_BALANCES_FAILURE': 
            return {
                ...state,
                tokenList: action.tokens,
                error: action.error,
        }
        default:
            return state;
    }
}

export type AppState = ReturnType<typeof Reducer>

const initialState = {
    tokenList: [],
    error: '',
}

export const Reducer = (state: any = initialState, action: any) => {
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

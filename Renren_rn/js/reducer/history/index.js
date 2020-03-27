import Types from '../../action/Types';
const defaultState = {}
export default function onAction(state=defaultState,action) {
    switch (action.type) {
        case Types.LOAD_HISTROY_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            };
        case Types.HISTROY_REFRESH:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: true
                }
            };
        case Types.LOAD_HISTROY_FAIL:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        default:
            return state
    }
}

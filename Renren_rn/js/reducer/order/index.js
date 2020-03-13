import Types from '../../action/Types';
const defaultState = {}

export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_ORDER_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            };
        case Types.ORDER_REFRESH:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: true
                }
            };
        case Types.LOAD_ORDER_FAIL:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        case Types.MORE_ORDER_LOADING:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: false
                }
            };
        case Types.ONLOAD_MOREORDER_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading:false,
                    hideMoreshow: true,
                }
            };
        case Types.ONLOAD_MOREORDER_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: true
                }
            };
        default:
            return state
    }
}

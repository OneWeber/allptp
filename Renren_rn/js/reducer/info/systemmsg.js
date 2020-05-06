import Types from '../../action/Types';
const defaultState = {

}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.ONLOAD_SYSTEMMSG_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false,
                    hideMoreshow: true
                }
            };
        case Types.ONLOAD_SYSTEMMSG:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: true,
                    hideMoreshow: true
                }
            }
        case Types.ONLOAD_SYSTEMMSG_FAIL:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: true
                }
            };
        case Types.ONLOAD_MORESYSTEMMSG:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: false
                }
            };
        case Types.ONLOAD_MORESYSTEMMSG_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading:false,
                    hideMoreshow: true,
                }
            };
        case Types.ONLOAD_MORESYSTEMMSG_FAIL:
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

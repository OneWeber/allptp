import Types from '../../action/Types';
const defaultState = {

}
export default function onAction(state=defaultState, action) {
    switch(action.type) {
        case Types.LOAD_FANS_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items:action.items,
                    isLoading: false
                }
            };
        case Types.FANS_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true
                }
            };
        case Types.LOAD_FANS_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        case Types.MOREFANS_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: false
                }
            };
        case Types.ONLOAD_MOREFANS_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading:false,
                    hideMoreshow: true,
                }
            };
        case Types.ONLOAD_MOREFANS_FAIL:
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

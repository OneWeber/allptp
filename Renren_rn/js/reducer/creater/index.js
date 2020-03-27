import Types from '../../action/Types';
const defaultState = {}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_CREATER_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    dataNum: action.dataNum,
                    isLoading: false
                }
            };
        case Types.CREATER_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true
                }
            };
        case Types.LOAD_CREATER_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        case Types.MORE_CREATER_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: false
                }
            };
        case Types.ONLOAD_MORECREATER_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading:false,
                    hideMoreshow: true,
                }
            };
        case Types.ONLOAD_MORECREATER_FAIL:
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

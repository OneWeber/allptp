import Types from '../../action/Types';
const defaultState = {

}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.ONLOAD_PEVALUATE_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            };
        case Types.ONLOAD_PEVALUATE:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: true
                }
            }
        case Types.ONLOAD_PEVALUATE_FAIL:
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

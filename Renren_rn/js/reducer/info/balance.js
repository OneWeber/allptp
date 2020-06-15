import Types from '../../action/Types';
const defaultState = {

}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.INIT_BALANCE_SUCCESS:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            };
        case Types.INIT_BALANCE:
            return {
                ...state,
                [action.storeName]:{
                    ...state[action.storeName],
                    isLoading: true
                }
            }
        case Types.INIT_BALANCE_SUCCESS:
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

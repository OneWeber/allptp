import Types from '../../action/Types';
const defaultState = {

}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_WISH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            };
        case Types.WISH_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true
                }
            };
        case Types.LOAD_WISH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        default:
            return state
    }
}

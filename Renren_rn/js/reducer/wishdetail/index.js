import Types from '../../action/Types';
const defaultState = {}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_WISHDETAIL_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items:action.items
                }
            };
        case Types.WISHDETAIL_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName]
                }
            };
        case Types.LOAD_WISHDETAIL_FIAL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName]
                }
            };
        default:
            return state
    }
}

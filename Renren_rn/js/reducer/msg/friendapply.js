import Types from '../../action/Types';
const defaultState = {

};
export default function onAction(state=defaultState, action){
    switch (action.type) {
        case Types.ONLOAD_FRIENDAPPLY_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false,
                    applyLength: action.applyLength
                }
            };
        case Types.ONLOAD_FRIENDAPPLY:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    applyLength: []
                }
            };
        case Types.ONLOAD_FRIENDAPPLY_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    applyLength: []
                }
            };
        default:
            return state
    }
}

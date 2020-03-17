import Types from '../../action/Types';
const defaultState = {
    slot: []
}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.SLOT_INIT:
            return {
                ...state,
                slot: action.slot
            };
        default:
            return state
    }
}

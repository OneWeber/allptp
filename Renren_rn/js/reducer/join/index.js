import Types from '../../action/Types';
const defaultState = {
    activity_id: '',
    slot_id: '',
    num: '',
    person: '',
    house: []
}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.JOIN_INIT:
            return {
                ...state,
                join: action.join
            };
        default:
            return state
    }
}

import Types from '../../action/Types';

const defaultState = {
    theme: '#14c5ca'
}

export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.CHANGE_THEME:
            return {
                ...state,
                theme: action.theme
            };
        default:
            return state
    }
}

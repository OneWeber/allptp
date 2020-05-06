import Types from '../../action/Types';
const defaultState = {
    netInfo: {
        type: '',
        isConnected: true
    }
};
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.CHANGE_NET:
            return {
                ...this.state,
                netInfo: action.data
            };
        default:
            return state;
    }
}

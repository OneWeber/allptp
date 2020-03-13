import AsyncStorage from '@react-native-community/async-storage';
import Types from '../../action/Types';
const defaultState = {
    token: ''
}
AsyncStorage.getItem('token', (error, result) => {
    if(result) {
        defaultState.token = JSON.parse(result)
    } else {
        defaultState.token = ''
    }

})
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.TOKEN_INIT:
            return {
                ...state,
                token: action.token
            };
        default:
            return state
    }
}

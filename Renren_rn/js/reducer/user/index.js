import AsyncStorage from '@react-native-community/async-storage';
import Types from '../../action/Types';
const defaultState = {
    user: {
        username: '',
        avatar: ''
    }
}
AsyncStorage.getItem('username', (error, result) => {
    if(result) {
        defaultState.user.username = result
    } else {
        defaultState.user.username = ''
    }
})
AsyncStorage.getItem('avatar', (error, result) => {
    if(result) {
        defaultState.user.avatar = result
    } else {
        defaultState.user.avatar = ''
    }
})
export default function onAction(state= defaultState, action) {
    switch (action.type) {
        case Types.USER_INIT:
            return {
                ...state,
                user: action.user
            };
        default:
            return state
    }
}

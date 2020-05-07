import Types from '../../action/Types';
import AsyncStorage from '@react-native-community/async-storage';

const defaultState = {
    language: 1
};
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.status
            };
        default:
            return state;
    }
}

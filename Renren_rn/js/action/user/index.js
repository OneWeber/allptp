import Types from '../Types';
export function InitUser(user) {
    return {type:Types.USER_INIT, user: user}
}

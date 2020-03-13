import Types from '../Types';
export function InitToken(token) {
    return {type:Types.TOKEN_INIT,token: token}
}

import Types from '../Types';
export function initJoin(join) {
    return {type: Types.JOIN_INIT, join: join}
}
export function changePerson(arr) {
    return {type:Types.CHANGE_PERSON, arr}
}

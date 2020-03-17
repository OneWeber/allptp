import Types from '../Types';
export function initJoin(join) {
    return {type: Types.JOIN_INIT, join: join}
}

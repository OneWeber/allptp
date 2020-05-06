import Types from '../Types';
export function changeTheme(theme) {
    return {type:Types.CHANGE_THEME,theme: theme}
}

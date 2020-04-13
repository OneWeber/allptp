import Types from '../Types';

export function changeDiscount(status) {
    return {type:Types.CHANGE_DISCOUNT, status}
}
export function changeParentChildPackage(data) {
    return {type:Types.CHANGE_PARENTCHILDPACKAGE, data}
}
export function changeAdultStandard(data) {
    return {type:Types.CHANGE_ADULTSTANDARD, data}
}
export function changeChildStandard(data) {
    return {type:Types.CHANGE_CHILDSTANDARD, data}
}
export function changeCustomePackage(data) {
    return {type:Types.CHANGE_CUSTOMEPACKAGE, data}
}
export function changeLongDay(longDay) {
    return dispatch => {
        dispatch({
            type: Types.CHANGE_LONGDAY,
            longDay: longDay
        })
    }
    //return {type:Types.CHANGE_LONGDAY, longDay: longDay}
}
export function changeDifference(data) {
    return {type:Types.CHANGE_DIFFERENCE, data}
}

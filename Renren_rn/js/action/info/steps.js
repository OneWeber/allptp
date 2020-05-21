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
export function changeLanguage(data) {
    return {type:Types.CHANGE_MAINLANGUAGE, data}
}
export function changeOtherLanguage(data) {
    return {type:Types.CHANGE_OTHERLANGUAGE, data}
}
export function changeActivityId(id) {
    return {type:Types.CHANGE_ACTIVITYID, id}
}
export function changeStatus(arr) {
    return {type:Types.CHANGE_STATUS, arr}
}
export function changeFull(arr) {
    return {type:Types.CHANGE_FULL, arr}
}
export function changeAccommodation(arr) {
    return {type:Types.CHANGE_ACCOMMODATION, arr}
}
export function changeAccImageId(arr) {
    return {type:Types.CHANGE_ACCIMAGEID, arr}
}
export function changeDate(arr) {
    return {type:Types.CHANGE_DATE, arr}
}

import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadColWish(storeName, url, data) {
    return dispatch => {
        dispatch({type:Types.ONLOAD_COLWISH, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            handleData(dispatch, storeName, resData)
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_COLWISH_FAIL,
                storeName,
                error
            })
        })
    }
}
function handleData(dispatch, storeName, resData) {
    dispatch({
        type: Types.ONLOAD_COLWISH_SUCCESS,
        items: resData,
        storeName
    })
}

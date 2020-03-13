import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadWishDetail(storeName, url, data) {
    return dispatch => {
        dispatch({type:Types.WISHDETAIL_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            handleData(dispatch, storeName, resData)
        }).catch(error => {
            dispatch({
                type:Types.LOAD_WISHDETAIL_FIAL,
                storeName,
                error
            })
        })
    }
}
function handleData(dispatch, storeName, resData) {
    dispatch({
        type:Types.LOAD_WISHDETAIL_SUCCESS,
        items: resData,
        storeName
    })
}

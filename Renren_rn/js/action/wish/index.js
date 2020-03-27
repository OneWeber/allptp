import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadWish(storeName, url, data, callBack) {
    return dispatch => {
        dispatch({type:Types.WISH_REFRESH, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            handleData(dispatch, storeName, resData)
        }).catch(error => {
            dispatch({
                type:Types.LOAD_WISH_FAIL,
                storeName,
                error
            })
            if(typeof callBack === 'function'){
                callBack(error)
            }
        })
    }
}
function handleData(dispatch, storeName, resData) {
    dispatch({
        type: Types.LOAD_WISH_SUCCESS,
        items: resData,
        storeName
    })
}

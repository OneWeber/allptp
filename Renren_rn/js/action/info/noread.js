import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadNoRead(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_NOREAD, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_NOREAD_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_NOREAD_FAIL,
                storeName,
                error
            })
        })
    }
}

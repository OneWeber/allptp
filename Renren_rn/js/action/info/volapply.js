import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadVolApply(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_VOLAPPLY, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_VOLAPPLY_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_VOLAPPLY_FAIL,
                storeName,
                error
            })
        })
    }
}

import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadPEvaluate(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_PEVALUATE, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_PEVALUATE_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_PEVALUATE_FAIL,
                storeName,
                error
            })
        })
    }
}

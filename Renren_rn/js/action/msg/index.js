import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadMsg(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_MSG, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_MSG_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_MSG_FAIL,
                storeName,
                error
            })
        })
    }
}

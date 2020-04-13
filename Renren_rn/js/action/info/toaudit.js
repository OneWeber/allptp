import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadToAudit(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.TOAUDIT_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_TOAUDIT_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_TOAUDIT_FAIL,
                storeName,
                error
            })
        })
    }
}

import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadHistory(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.HISTROY_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_HISTROY_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_HISTROY_FAIL,
                storeName,
                error
            })
        })
    }
}

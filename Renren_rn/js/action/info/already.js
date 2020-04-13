import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadAlready(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ALREADY_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_ALREADY_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_ALREADY_FAIL,
                storeName,
                error
            })
        })
    }
}

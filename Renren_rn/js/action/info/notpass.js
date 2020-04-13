import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadNotPass(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.NOTPASS_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_NOTPASS_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_NOTPASS_FAIL,
                storeName,
                error
            })
        })
    }
}

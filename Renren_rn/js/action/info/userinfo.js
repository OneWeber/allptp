import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadUserInfo(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_USERINFO, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_USERINFO_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_USERINFO_FAIL,
                storeName,
                error
            })
        })
    }
}

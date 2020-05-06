import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadBanner(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_BANNER, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_BANNER_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_BANNER_FAIL,
                storeName,
                error
            })
        })
    }
}

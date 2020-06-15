import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadPInvite(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_PINVITE, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_PINVITE_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_PINVITE_FAIL,
                storeName,
                error
            })
        })
    }
}

import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadContact(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_CONTACT, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_CONTACT_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_CONTACT_FAIL,
                storeName,
                error
            })
        })
    }
}

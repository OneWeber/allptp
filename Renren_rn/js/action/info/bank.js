import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadBank(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_BANK, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_BANK_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_BANK_FAIL,
                storeName,
                error
            })
        })
    }
}

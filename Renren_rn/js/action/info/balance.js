import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function initBalance(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.INIT_BALANCE, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.INIT_BALANCE_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.INIT_BALANCE_FAIL,
                storeName,
                error
            })
        })
    }
}

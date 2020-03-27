import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadComming(storeName, url, data) {
    return dispatch => {
        dispatch({type:Types.COMMING_REFRESH, storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_COMMING_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_COMMING_FAIL,
                storeName,
                error
            })
        })
    }
}

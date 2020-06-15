import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadRefundApply(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_REFUNDAPPLY, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_REFUNDAPPLY_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_REFUNDAPPLY_FAIL,
                storeName,
                error
            })
        })
    }
}

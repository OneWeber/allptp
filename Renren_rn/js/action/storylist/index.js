import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadStoryList(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.STORYLIST_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_STORYLIST_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_STORYLIST_FAIL,
                storeName,
                error
            })
        })
    }
}

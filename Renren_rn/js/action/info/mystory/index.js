import Types from '../../Types';
import DataStore from '../../../expand/dao/DataStore';
export function onLoadMyStory(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.MYSTORY_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_MYSTORY_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_MYSTORY_FAIL,
                storeName,
                error
            })
        })
    }
}

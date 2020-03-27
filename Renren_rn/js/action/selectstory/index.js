import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadSelectStory(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.SELECTSTORY_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_SELECTSTORY_SUCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_SELECTSTORY_FAIL,
                storeName,
                error
            })
        })
    }
}

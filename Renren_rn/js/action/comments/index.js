import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadActiveComments(storeName, url, data) {
    return dispatch => {
        dispatch({type:Types.ONLOAD_ACTIVE_COMMENTS, storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_ACTIVE_COMMENTS_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_ACTIVE_COMMENTS_FAIL,
                storeName,
                error
            })
        })
    }
}
export function onLoadStoryComments(storeName, url, data) {
    return dispatch => {
        dispatch({type:Types.ONLOAD_STORY_COMMENTS, storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_STORY_COMMENTS_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_STORY_COMMENTS_FAIL,
                storeName,
                error
            })
        })
    }
}

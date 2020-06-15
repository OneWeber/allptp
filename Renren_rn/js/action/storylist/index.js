import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadStoryList(storeName, url, data, isRefresh, oNum ,callBack) {
    return dispatch => {
        dispatch({type: Types.STORYLIST_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            let dataNum = resData.data.data.total - oNum;
            dispatch({
                type: Types.LOAD_STORYLIST_SUCCESS,
                items: resData,
                storeName,
                dataNum: dataNum
            })
            if(isRefresh && (typeof callBack === 'function')){
                callBack(dataNum)
            }
        }).catch(error => {
            dispatch({
                type:Types.LOAD_STORYLIST_FAIL,
                storeName,
                error
            })
        })
    }
}
export function onLoadMoreStory(storeName, url, data, oItems, callBack) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_MORE_STORY, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            console.log(resData)
            if(resData.data.data.data.length > 0){
                let oData = oItems;
                let newData = resData.data.data.data
                oData.data.data.data.push(...newData)

                dispatch({
                    type: Types.ONLOAD_MORE_STORY_SUCCESS,
                    items: oData,
                    storeName
                })
            } else {
                if(typeof callBack === 'function') {
                    callBack('没有更多了')
                }
                dispatch({
                    type: Types.ONLOAD_MORE_STORY_FAIL,
                    storeName,
                    error
                })
            }
        }).catch(error => {
            dispatch({
                type: Types.ONLOAD_MORE_STORY_FAIL,
                storeName,
                error
            })
        })
    }
}

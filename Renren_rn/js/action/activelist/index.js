import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadActiveList(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ACTIVELIST_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_ACTIVELIST_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_ACTIVELIST_FAIL,
                storeName,
                error
            })
        })
    }
}
export function onLoadMoreActive(storeName, url, data, oItems, callBack) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_MORE_ACTIVE, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            console.log(resData)
            if(resData.data.data.data.length > 0){
                let oData = oItems;
                let newData = resData.data.data.data
                oData.data.data.data.push(...newData)

                dispatch({
                    type: Types.ONLOAD_MORE_ACTIVE_SUCCESS,
                    items: oData,
                    storeName
                })
            } else {
                if(typeof callBack === 'function') {
                    callBack('没有更多了')
                }
                dispatch({
                    type: Types.ONLOAD_MORE_ACTIVE_FAIL,
                    storeName,
                    error
                })
            }
        }).catch(error => {
            dispatch({
                type: Types.ONLOAD_MORE_ACTIVE_FAIL,
                storeName,
                error
            })
        })
    }
}

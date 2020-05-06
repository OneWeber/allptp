import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadSystemMsg(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_SYSTEMMSG, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.ONLOAD_SYSTEMMSG_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_SYSTEMMSG_FAIL,
                storeName,
                error
            })
        })
    }
}

export function onLoadMoreSystemMsg(storeName, url, data, oItems) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_MORESYSTEMMSG, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            if(resData.data.data.data.length > 0){
                let oData = oItems;
                let newData = resData.data.data.data
                oData.data.data.data.push(...newData)
                dispatch({
                    type: Types.ONLOAD_MORESYSTEMMSG_SUCCESS,
                    items: oData,
                    storeName
                })
            } else {
                dispatch({
                    type: Types.ONLOAD_MORESYSTEMMSG_FAIL,
                    storeName,
                    error
                })
            }
        }).catch(error => {
            dispatch({
                type: Types.ONLOAD_MORESYSTEMMSG_FAIL,
                storeName,
                error
            })
        })
    }
}

import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';

export function onLoadOrder(storeName, url, data, isRefresh, oNum ,callBack) {
    return dispatch => {
        dispatch({type: Types.ORDER_REFRESH, storeName:storeName})
        let dataStore = new DataStore();
        dataStore.fetchData(url, 'POST', data).then(resData => {
            let dataNum = resData.data.data.total- oNum;
            handleData(dispatch, storeName, resData, dataNum)
            if(isRefresh && (typeof callBack === 'function')){
                callBack(dataNum)
            }
        }).catch(error => {
            dispatch({
                type:Types.LOAD_ORDER_FAIL,
                storeName,
                error
            })
        })
    }
}
function handleData(dispatch, storeName, resData, dataNum) {
    dispatch({
        type: Types.LOAD_ORDER_SUCCESS,
        items: resData,
        storeName: storeName,
        dataNum: dataNum
    })
}

/*
* storeName:页面label
* page:请求的第几页数据
* oItems: 原始数据
* url: 请求路径
* data:请求传的参数
* */

export function onLoadMoreOrder(storeName, url, data, oItems, callBack) {
    return dispatch => {
        dispatch({type: Types.MORE_ORDER_LOADING, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            if(resData.data.data.data.length > 0){
                let oData = oItems;
                let newData = resData.data.data.data
                oData.data.data.data.push(...newData)
                handleDataMore(dispatch, storeName, oData,)
            } else {
                if(typeof callBack === 'function') {
                    callBack('没有更多了')
                }
                dispatch({
                    type: Types.ONLOAD_MOREORDER_FAIL,
                    storeName,
                    error
                })
            }
        }).catch(error => {
            dispatch({
                type: Types.ONLOAD_MOREORDER_FAIL,
                storeName,
                error
            })
        })
    }
}
function handleDataMore(dispatch, storeName, resData) {
    dispatch({
        type: Types.ONLOAD_MOREORDER_SUCCESS,
        items: resData,
        storeName
    })
}

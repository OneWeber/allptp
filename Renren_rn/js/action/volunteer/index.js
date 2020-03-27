import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadVolunteer(storeName, url, data, isRefresh, oNum ,callBack) {
    return dispatch => {
        dispatch({type: Types.VOLUNTEER_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            let dataNum = resData.data.data.total - oNum;
            dispatch({
                type: Types.LOAD_VOLUNTEER_SUCCESS,
                items: resData,
                storeName: storeName,
                dataNum: dataNum
            })
            if(isRefresh && (typeof callBack === 'function')){
                callBack(dataNum)
            }
        }).catch(error => {
            dispatch({
                type:Types.LOAD_VOLUNTEER_FAIL,
                storeName,
                error
            })
        })
    }
}
export function onLoadMoreVolunteer(storeName, url, data, oItems, callBack) {
    return dispatch => {
        dispatch({type: Types.MOREVOLUNTEER_REFRESH, storeName: storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            console.log(resData)
            if(resData.data.data.data.length > 0){
                let oData = oItems;
                let newData = resData.data.data.data
                oData.data.data.data.push(...newData)

                dispatch({
                    type: Types.ONLOAD_MOREVOLUNTEER_SUCCESS,
                    items: oData,
                    storeName
                })
            } else {
                if(typeof callBack === 'function') {
                    callBack('没有更多了')
                }
                dispatch({
                    type: Types.ONLOAD_MOREVOLUNTEER_FAIL,
                    storeName,
                    error
                })
            }
        }).catch(error => {
            dispatch({
                type: Types.ONLOAD_MOREVOLUNTEER_FAIL,
                storeName,
                error
            })
        })
    }
}

import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadFriendApply(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.ONLOAD_FRIENDAPPLY, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            let applyLength = [];
            for(let i=0;i<resData.length; i++) {
                if(resData[i].status == 0) {
                    applyLength.push(resData[i])
                }
            }
            dispatch({
                type: Types.ONLOAD_FRIENDAPPLY_SUCCESS,
                items: resData,
                applyLength: applyLength,
                storeName,

            })
        }).catch(error => {
            dispatch({
                type:Types.ONLOAD_FRIENDAPPLY_FAIL,
                storeName,
                error
            })
        })
    }
}

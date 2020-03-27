import Types from '../Types';
import DataStore from '../../expand/dao/DataStore';
export function onLoadCityItem(storeName, url, data) {
    return dispatch => {
        dispatch({type: Types.CITY_ITEM_REFRESH, storeName:storeName})
        let dataStore = new DataStore()
        dataStore.fetchData(url, 'POST', data).then(resData => {
            dispatch({
                type: Types.LOAD_CITYITEM_SUCCESS,
                items: resData,
                storeName
            })
        }).catch(error => {
            dispatch({
                type:Types.LOAD_CITYITEM_FAIL,
                storeName,
                error
            })
        })
    }
}

import Types from '../../action/Types';

const defaultState = {}

export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_TRAVEL_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    dataNum: action.dataNum,
                    isLoading: false
                }
            };
        case Types.TRAVEL_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true
                }
            };
        case Types.LOAD_TRAVEL_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            };
        case Types.MORE_TRAVEL_LOADING:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: false
                }
            };
        case Types.ONLOAD_MORETRAVEL_SUCCESS:
            return {
              ...state,
              [action.storeName]: {
                  ...state[action.storeName],
                  items: action.items,
                  isLoading:false,
                  hideMoreshow: true,
              }
            };
        case Types.ONLOAD_MORETRAVEL_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideMoreshow: true
                }
            };
        default:
            return state
    }
}

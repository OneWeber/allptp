import Types from '../../action/Types';

const defaultState = {
    step: 0,
    status:[],
    hasDiscount: false,
    parenChildPackage: [],
    adultStandard: {
        standard: 10,
        originalPrice: ''
    },
    childStandard: {
        standard: 10,
        originalPrice: ''
    },
    customePackage: [],
    longDay: [],
    difference: [],
    mainLanguage: -1,
    otherLanguage: [],
    activity_id: '',
    full:[],//满减
    accommodation: [], //住宿,
    acc_imageId: [],
    date: [],
    dateValue: [],
    newDate: [],
    type: 0
}
export default function (state=defaultState, action) {
    switch (action.type) {
        case Types.CHANGE_DISCOUNT:
            return {
                ...state,
                hasDiscount: action.status
            };
        case Types.CHANGE_PARENTCHILDPACKAGE:
            return {
              ...state,
              parenChildPackage: action.data
            };
        case Types.CHANGE_ADULTSTANDARD:
            return {
              ...state,
              adultStandard: action.data
            };
        case Types.CHANGE_CHILDSTANDARD:
            return {
              ...state,
              childStandard: action.data
            };
        case Types.CHANGE_CUSTOMEPACKAGE:
            return {
              ...state,
              customePackage: action.data
            };
        case Types.CHANGE_DIFFERENCE:
            return {
              ...state,
              difference: action.data
            };
        case Types.CHANGE_MAINLANGUAGE:
            return {
              ...state,
              mainLanguage:action.data
            };
        case Types.CHANGE_OTHERLANGUAGE:
            return {
              ...state,
              otherLanguage: action.data
            };
        case Types.CHANGE_ACTIVITYID:
            return {
              ...state,
              activity_id: action.id
            };
        case Types.CHANGE_STATUS:
            return {
              ...state,
              status: action.arr
            };
        case Types.CHANGE_LONGDAY:
            return {
                ...state,
                longDay: action.longDay
            };
        case Types.CHANGE_FULL:
            return {
              ...state,
              full: action.arr
            };
        case Types.CHANGE_ACCOMMODATION:
            return {
                ...state,
                accommodation: action.arr
            };
        case Types.CHANGE_ACCIMAGEID:
            return {
                ...state,
                acc_imageId: action.arr
            };
        case Types.CHANGE_DATE:
            return {
                ...state,
                date: action.arr
            };
        case Types.CHANGE_DATEVALUE:
            return {
              ...state,
              dateValue: action.arr
            };
        case Types.CHANGE_NEWDATE:
            return {
                ...state,
                newDate: action.arr
            };
        case Types.CHANGE_TYPE:
            return {
                ...state,
                type: action.types
            };
        default:
            return state
    }

}

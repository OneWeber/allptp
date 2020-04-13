import Types from '../../action/Types';

const defaultState = {
    step: 0,
    status:[0,0,0,0,0,0,0,0,0,0,0,0,0],
    hasDiscount: false,
    parenChildPackage: [],
    adultStandard: {
        standard: 0,
        originalPrice: 0
    },
    childStandard: {
        standard: 0,
        originalPrice: 0
    },
    customePackage: [],
    longDay: [],
    difference: []
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
              customePackage: action.longDay
            };
        case Types.CHANGE_DIFFERENCE:
            return {
              ...state,
              difference: action.data
            };
        default:
            return state
    }

}

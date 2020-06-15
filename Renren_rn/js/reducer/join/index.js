import Types from '../../action/Types';
const defaultState = {
    join:{
        activity_id: '',
        slot_id: '',
        person: [],
        house: [],
        houseid:[],
        adult_price_origin: '',
        adult_price:'',
        kids_price_origin: '',
        kids_price:'',
        age_limit: '',
        date: '',
        begin_time: '',
        end_time: '',
        is_discount: false,
        combine: [],
        title: '',
        kids_stand_low: '',
        kids_stand_high: '',
        selectCombine: [],
        longday: '',
        begin_date: '',
        end_date: ''
    }
}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.JOIN_INIT:
            return {
                ...state,
                join: action.join
            };
        default:
            return state
    }
}

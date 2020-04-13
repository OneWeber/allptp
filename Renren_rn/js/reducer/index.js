import {combineReducers} from 'redux'
import theme from './theme'
import user from './user'
import token from './token'
import travel from './travel'
import order from './order'
import wish from './wish'
import wishdetail from './wishdetail'
import join from './join'
import slot from './slot'
import comming from './comming'
import hotcity from './hotcity'
import cityitem from './cityitem'
import selectstory from './selectstory'
import history from './history'
import activelist from './activelist'
import storylist from './storylist'
import volunteer from './volunteer'
import creater from './creater'
import focus from './focus'
import fans from './focus/fans'
import trading from './trading'
import reverse from './info/reserve'
import mystory from './info/mystory'
import toaudit from './info/toaudit';
import already from './info/already';
import notpass from './info/notpass';
import uncommit from './info/uncommit';
import steps from './info/steps';
const index = combineReducers({
    theme: theme,
    user: user,
    token: token,
    travel: travel,
    order: order,
    wish: wish,
    wishdetail: wishdetail,
    join: join,
    slot: slot,
    comming: comming,
    hotcity: hotcity,
    cityitem: cityitem,
    selectstory: selectstory,
    history: history,
    activelist: activelist,
    storylist: storylist,
    volunteer: volunteer,
    creater: creater,
    focus: focus,
    fans: fans,
    trading: trading,
    reverse: reverse,
    mystory: mystory,
    toaudit: toaudit,
    already: already,
    notpass: notpass,
    uncommit: uncommit,
    steps: steps
})
export default index

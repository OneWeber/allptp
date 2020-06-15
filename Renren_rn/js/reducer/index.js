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
import netconnect from './netconnect/index'
import colwish from './wish/colwish'
import banner from './banner'
import msg from './msg'
import contact from './msg/contact';
import language from './language'
import bank from './info/bank';
import systemmsg from './info/systemmsg';
import noread from './info/noread';
import userinfo from './info/userinfo';
import comments from './comments'
import volapply from './info/volapply';
import refundapply from './info/refundapply';
import pevaluate from './info/pevaluate';
import pinvite from './info/pinvite';
import balance from './info/balance'
import friendapply from './msg/friendapply';
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
    steps: steps,
    netconnect: netconnect,
    colwish: colwish,
    banner: banner,
    msg: msg,
    contact: contact,
    language: language,
    bank: bank,
    systemmsg: systemmsg,
    noread: noread,
    userinfo: userinfo,
    comments: comments,
    volapply:volapply,
    refundapply: refundapply,
    pevaluate: pevaluate,
    pinvite: pinvite,
    balance: balance,
    friendapply: friendapply
})
export default index

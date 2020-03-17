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
const index = combineReducers({
    theme: theme,
    user: user,
    token: token,
    travel: travel,
    order: order,
    wish: wish,
    wishdetail: wishdetail,
    join: join,
    slot: slot
})
export default index

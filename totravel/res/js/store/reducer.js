import actionTypes from './actionTypes'
const defaultState = { // 初始化state
    data: 'my is redux!!!!'
}

export default (state = defaultState, action) => {
    console.log(action)
    if (action.type == actionTypes.CHANGE) { // 修改state
        const newState = JSON.parse(JSON.stringify(state))
        newState.data = 'change data!!!'
        return newState
    }
    return state
}

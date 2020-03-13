import React, {Component} from 'react';
import {StyleSheet} from 'react-native'
import ViewBotNavigator from '../navigator/ViewBotNavigator';
import NavigatorUtils from '../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import HttpUrl from '../utils/Http';
import HttpUtils from '../expand/dao/Fetch';
import AsyncStorage from '@react-native-community/async-storage';
import InitToken from '../expand/dao/InitToken';
import Fetch from '../expand/dao/Fetch';
import actions from '../action'
class ViewPage extends Component{
    constructor(props) {
        super(props);
        this.InitTokens = new InitToken()
    }
    componentDidMount(){
        this.InitTokens.goInitToken().then(res => {
            let formDataTwo=new FormData();
            formDataTwo.append('','');
            if(!res) {
                const {onInitUser, onInitToken} = this.props
                HttpUtils.post(HttpUrl + 'Index/token', formDataTwo).then(result => {
                    if(result.code === 1) {
                        onInitToken(result.data)
                        AsyncStorage.setItem('token', JSON.stringify(result.data));
                    } else {
                        onInitToken('')
                    }
                })
            }
        })
    }
    //验证用户是否登录
    UserInfo(token) {
        const promise = new Promise((resolve, reject) => {
            let formData=new FormData();
            formData.append('token',token);
            Fetch.post(HttpUrl+'User/get_user',formData).then(res => {
                resolve(res)
            })
        })
        return promise
    }
    render(){
        NavigatorUtils.navigation = this.props.navigation
        return <ViewBotNavigator />
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
const mapStateToProps = state => ({
    user: state.user.user,
    //token: state.token.token?state.token.token:''
})
const mapDispatchToProps = dispatch => ({
    onInitUser: user => dispatch(actions.InitUser(user)),
    onInitToken: token => dispatch(actions.InitToken(token))
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewPage)

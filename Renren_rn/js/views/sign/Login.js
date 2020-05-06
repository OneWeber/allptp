import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TextInput,
    Dimensions,
    TouchableHighlight,
    Image,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import Video from 'react-native-video'
import CommonStyle from '../../../assets/css/Common_css'
import { VibrancyView } from 'react-native-blur';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux'
import action from '../../action'
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import NavigatorUtils from '../../navigator/NavigatorUtils';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export default class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.redirect = this.props.navigation.state.params.redirect?this.props.navigation.state.params.redirect:null
    }

    onAudioBecomingNoisy() {

    }
    onAudioFocusChanged() {

    }
    onLoad() {

    }
    render(){
        return(
            <View style={styles.container}>
                <Video
                    ref={(ref: Video) => { //方法对引用Video元素的ref引用进行操作
                        this.video = ref
                    }}
                    /* source={{ uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__', type: 'mpd' }} */
                    source={require('../../../assets/video/123.mp4')}//设置视频源
                    style={styles.fullScreen}//组件样式
                    rate={1}//播放速率
                    muted={true}//控制音频是否静音
                    resizeMode={'cover'}//缩放模式
                    onLoad={this.onLoad}//加载媒体并准备播放时调用的回调函数。
                    onAudioBecomingNoisy={this.onAudioBecomingNoisy}//音频变得嘈杂时的回调 - 应暂停视频
                    onAudioFocusChanged={this.onAudioFocusChanged}//音频焦点丢失时的回调 - 如果焦点丢失则暂停
                    repeat={true}//确定在到达结尾时是否重复播放视频。
                />
                <View style={styles.login_bg}>
                    <LoginContainerMap redirect={this.redirect} />
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        position: 'relative'
    },
    fullScreen: {
        flex: 1
    },
    login_bg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.3)'
    },
    login_prompt: {
        fontSize: 28,
        color: '#f5f5f5',
        fontWeight: 'bold',
        marginTop: 10,
    },
    input_con: {
        width: '100%',
        height: 55,
        borderRadius: 28,
        position: 'relative',
    },
    inp:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 25,
        paddingLeft: 10,
        fontSize: 16,
        color: '#f5f5f5'
    },
    total_view: {
        width: widthScreen,
        height: heightScreen
    },
    third_txt: {
        color: '#f5f5f5'
    },
    login_btn: {
        height: 55,
        borderRadius: 25,
        marginTop: 25
    },
    btn_txt: {
        fontSize: 16,
        color: '#f5f5f5'
    }
})
//登录页面内容区域
class LoginContainer extends Component{
    render() {
        return (
            <KeyboardAwareScrollView style={[styles.total_view]}>
                <View style={[CommonStyle.spaceCol, styles.total_view]}>
                    <SafeAreaView>
                        <View style={[CommonStyle.commonWidth, {marginTop: 15}]}>
                            <Text style={styles.login_prompt}>享受更多体验</Text>
                            <Text style={styles.login_prompt}>尽在登录后</Text>
                        </View>
                    </SafeAreaView>
                    <MapInputContainer {...this.props}/>
                    <SafeAreaView>
                        <Third {...this.props}/>
                    </SafeAreaView>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}
const mapStateToPropss = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
const mapDispatchToPropss= dispatch => ({
    onInitUser: user => dispatch(action.InitUser(user))
})
const LoginContainerMap = connect(mapStateToPropss, mapDispatchToPropss)(LoginContainer)
//输入账号密码区域
class InputContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tel: '',
            password: ''
        }
    }
    _onChange(text, type) {
        if(type === 'user') {
            this.setState({
                tel: text
            })
        } else {
            this.setState({
                password: text
            })
        }
    }
    //登录
    login_in() {
        let {onInitUser, redirect, refresh} = this.props
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("mobile",this.state.tel);
        formData.append("m_code",86);
        formData.append("password",this.state.password);
        Fetch.post(HttpUrl + 'User/login_psw', formData).then(res => {
            if(res.code === 1) {
                AsyncStorage.setItem('username', res.data.family_name||res.data.middle_name||res.data.name?
                    JSON.stringify(res.data.family_name+res.data.middle_name+res.data.name):'匿名用户')
                AsyncStorage.setItem('avatar', JSON.stringify(res.data.headimage.domain + res.data.headimage.image_url))
                AsyncStorage.setItem('userid', JSON.stringify(res.data.user_id))
                onInitUser({
                    username: res.data.family_name||res.data.middle_name||res.data.name?
                        JSON.stringify(res.data.family_name+res.data.middle_name+res.data.name):'匿名用户',
                    avatar: JSON.stringify(res.data.headimage.domain + res.data.headimage.image_url),
                    userid:res.data.user_id
                });
                if(redirect){
                    NavigatorUtils.goPage({...this.props.navigation.state.params}, redirect)
                } else {
                    NavigatorUtils.goPage({}, 'ViewPage')
                }

            }
        })
    }
    render() {
        const {theme} = this.props
        return(
            <View style={[CommonStyle.commonWidth]}>
                <View style={styles.input_con}>
                    <VibrancyView blurType="light" style={styles.input_con}>
                    </VibrancyView>
                    <TextInput
                        style={styles.inp}
                        placeholder={'手机号'}
                        placeholderTextColor={'#fff'}
                        onChangeText={text => {this._onChange(text, 'user')}}
                        defaultValue={this.state.tel}
                    />
                </View>
                <View style={[styles.input_con, {marginTop: 20}]}>
                    <VibrancyView blurType="light" style={styles.input_con}>
                    </VibrancyView>
                    <TextInput
                        style={styles.inp}
                        placeholder={'密码'}
                        placeholderTextColor={'#fff'}
                        onChangeText={text => {this._onChange(text, 'pass')}}
                        underlineColorAndroid='transparent'
                        enablesReturnKeyAutomatically={true}
                        returnKeyType={'send'}
                        secureTextEntry={true}
                        defaultValue={this.state.password}
                    />
                </View>
                <TouchableHighlight
                    underlayColor='rgba(20,187,202,.9)'
                    style={[styles.login_btn,CommonStyle.flexCenter, {backgroundColor: theme}]}
                    onPress={() =>{this.login_in()}}
                >
                    <Text style={styles.btn_txt}>登录</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
const mapDispatchToProps = dispatch => ({
    onInitUser: user => dispatch(action.InitUser(user))
})
const MapInputContainer = connect(mapStateToProps, mapDispatchToProps)(InputContainer)
//第三方登录
import * as WeChat from 'react-native-wechat';
import NewHttp from '../../utils/NewHttp';
class Third extends Component{
    constructor(props) {
        super(props);
        WeChat.registerApp('wx675e99e19312c085');
        this.state = {
            userInfo: '',
            isLoading: false
        }
    }
    getUserInfo(){
        const {token, redirect, onInitUser} = this.props
        let formData=new FormData();
        formData.append('token', token);
        Fetch.post(HttpUrl+'User/get_user',formData).then(
            res=>{
                if(res.code===1){
                    this.setState({
                        userInfo:res.data[0] || '',
                        isLoading: false
                    },() => {
                        const {userInfo} = this.state;
                        AsyncStorage.setItem('avatar', JSON.stringify(userInfo.headimage.domain+userInfo.headimage.image_url));
                        AsyncStorage.setItem('username', userInfo.family_name||userInfo.middle_name||userInfo.name?
                            JSON.stringify(userInfo.family_name+userInfo.middle_name+userInfo.name):'匿名用户');
                        AsyncStorage.setItem('userid', JSON.stringify(userInfo.user_id));
                        onInitUser({
                            username: userInfo.family_name||userInfo.middle_name||userInfo.name?
                                JSON.stringify(userInfo.family_name+userInfo.middle_name+userInfo.name):'匿名用户',
                            avatar: JSON.stringify(userInfo.headimage.domain + userInfo.headimage.image_url),
                            userid:userInfo.user_id
                        })
                        if(redirect){
                            NavigatorUtils.goPage({...this.props.navigation.state.params}, redirect)
                        } else {
                            NavigatorUtils.goPage({}, 'ViewPage')
                        }
                    })
                }
            }
        )
    }
    _wechatLogin() {
        let scope = 'snsapi_userinfo';
        let state = 'none';
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    //发送授权请求
                    WeChat.sendAuthRequest(scope, state)
                        .then(responseCode => {
                            this.setState({
                                isLoading: true
                            })
                            let formData = new FormData();
                            formData.append("token",this.props.token);
                            formData.append("code",responseCode.code);
                            Fetch.post(NewHttp+'WxcallbackApp',formData).then(
                                res=>{
                                    if(res.code==1){
                                        this.getUserInfo()
                                    }
                                }
                            )
                        })
                        .catch(err => {

                        })
                } else {
                    Platform.OS == 'ios' ?
                        Alert.alert('没有安装微信', '是否安装微信？', [
                            {text: '取消'},
                            {text: '确定', onPress: () => {}}
                        ]) :
                        Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
                            {text: '确定'}
                        ])
                }
            })
    }
    _qqLogin() {

    }
    render() {
        return(
            <View style={[CommonStyle.commonWidth]}>
                <View style={CommonStyle.flexCenter}>
                    <Text style={styles.third_txt}>第三方登录</Text>
                </View>
                <View style={[CommonStyle.spaceRow,{
                    marginTop:20
                }]}>
                    <TouchableOpacity
                        onPress={()=>this._wechatLogin()}
                    >
                        <Image
                            source={require('../../../assets/images/share/wx.png')}
                            style={{width:25,height:25}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>this._qqLogin()}
                    >
                        <Image
                            source={require('../../../assets/images/share/qq.png')}
                            style={{width:25,height:25}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require('../../../assets/images/share/yj.png')}
                            style={{width:25,height:25}}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

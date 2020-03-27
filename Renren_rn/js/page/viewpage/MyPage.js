import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Button
} from 'react-native';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import action from '../../action'
import AsyncStorage from '@react-native-community/async-storage';
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import LinearGradient from "react-native-linear-gradient"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import NewHttp from '../../utils/NewHttp';
const {width, height} = Dimensions.get('window')
class MyPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            balance: ''
        }
    }
    componentDidMount(){
        this.getUserInfo();
    }
    getUserInfo(){
        const {token} = this.props
        let formData=new FormData();
        formData.append('token', token);
        Fetch.post(HttpUrl+'User/get_user',formData).then(
            res=>{
                this.getBalance()
                if(res.code===1){
                    this.setState({
                        userInfo:res.data[0] || ''
                    })
                }
            }
        )
    }
    getBalance(){
        const {token} = this.props
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',1);
        Fetch.post(NewHttp+'balance',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        balance:(parseFloat(result.data.due_balance)+parseFloat(result.data.unpaid_amount?result.data.unpaid_amount:0)).toFixed(2)
                    })
                }
            }
        )
    }
    render(){
        const {initToken, initUser} = this.props
        return (
            <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                {/*
                    {
                    token && user && user.username
                    ?
                        <Button
                            title={'退出'}
                            onPress={() => {
                                initToken('');
                                initUser({
                                    username: '',
                                    avatar: ''
                                });
                                AsyncStorage.setItem('username', '');
                                AsyncStorage.setItem('avatar', '');
                                AsyncStorage.setItem('token', '')
                            }}
                        />
                    :
                        <Button
                            title={'登录'}
                            onPress={() => {
                                NavigatorUtils.goPage({}, 'Login')
                            }}
                        />
                }
                <Text>
                    MyPage
                </Text>

                <Button
                    title={'我的订单'}
                    onPress={() => {
                        NavigatorUtils.goPage({}, 'OrderPage')
                    }}
                />
                */}
                <SafeAreaView style={[CommonStyle.flexCenter]}>

                    <View style={[CommonStyle.flexEnd,CommonStyle.commonWidth,{
                        height:50
                    }]}>
                        <View style={{marginRight: 25}}>
                            <Image source={require('../../../assets/images/home/xtxx.png')} style={{
                                width:15.5,
                                height:19.5
                            }}/>
                        </View>
                        <View>
                            <Image source={require('../../../assets/images/home/sz.png')} style={{
                                width:19.5,
                                height:19.5
                            }}/>
                        </View>
                    </View>
                </SafeAreaView>
                <ScrollView
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                >
                    <InfoHeader {...this.props} {...this.state}/>
                    {/*关注，粉丝，获赞回复，交易中心*/}
                    <AboutMe {...this.props} {...this.state}/>
                    {/*我的订单*/}
                    <MyOrder {...this.props} {...this.state}/>
                    {/*管理体验*/}
                    <ManageActive {...this.props} {...this.state} />
                    {/*创作中心*/}
                    <CreateCenter {...this.props} {...this.state}/>
                    {/*评价我的，我的地址，旅行基金，帮助与反馈*/}
                    <Other {...this.props} {...this.state}/>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    role_item:{
        width:49,
        height:20,
        borderRadius:10
    },
    common_padding:{
        paddingLeft:15.5,
        paddingRight: 15.5
    },
    txt:{
        fontSize:17,
        color:'#333',
        fontWeight:'bold'
    },
    down_txt:{
        color:'#999',
        fontSize: 12,
        marginTop:10,
    },
    title:{
        color:'#333',
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 23
    }
})
const mapStateToProps = state => ({
    token: state.token.token,
    user: state.user.user,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    initToken: token => dispatch(action.InitToken(token)),
    initUser: user => dispatch(action.InitUser(user))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
class InfoHeader extends Component{
    render(){
        const {theme, user, token, userInfo} = this.props
        return(
            <View style={[CommonStyle.flexCenter,{marginTop: 11}]}>
                {
                    token && user.username && user.userid
                    ?
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                            <LazyImage
                                source={user.avatar?{uri:JSON.parse(user.avatar)}:
                                require('../../../assets/images/touxiang.png')}
                                style={{width:60,height:60,borderRadius:30}}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                height:60,
                                width:width*0.94-150,
                                alignItems: 'flex-start',
                            }]}>
                                <Text style={{color:'#333',fontSize:18,fontWeight:'bold'}}>
                                    {user.username?JSON.parse(user.username):null}
                                </Text>
                                <View style={[CommonStyle.flexStart]}>
                                    {
                                        userInfo.isvolunteer && userInfo.audit_idcard == 1
                                        ?
                                            <LinearGradient colors={['#14BBCA', '#14c5ca']} style={[styles.role_item,CommonStyle.flexCenter,{
                                                marginRight: 10
                                            }]}>
                                                <Text style={{color:'#fff',fontSize:11}}>志愿者</Text>
                                            </LinearGradient>
                                        :
                                            null
                                    }
                                    {
                                        userInfo.isplanner && userInfo.audit_face==2
                                        ?
                                            <LinearGradient colors={['#19CBBC', '#1ACBC9']} style={[styles.role_item,CommonStyle.flexCenter,{
                                                marginRight:10
                                            }]}>
                                                <Text style={{color:'#fff',fontSize:11}}>策划者</Text>
                                            </LinearGradient>
                                        :
                                            null
                                    }

                                    <Text style={{
                                        color:theme,
                                        fontSize:12,
                                    }}>
                                        信誉值:10分
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[CommonStyle.flexEnd]}>
                                <Text style={{
                                    color:'#333',fontSize:12
                                }}>个人主页</Text>
                                <AntDesign
                                    name={'right'}
                                    size={12}
                                    style={{color:'#B0B0B0'}}
                                />
                            </TouchableOpacity>

                        </View>
                    :
                        <View style={[CommonStyle.flexCenter,{width:'100%',height:60,flexDirection:'row'}]}>
                            <TouchableOpacity
                                onPress={() => {
                                    NavigatorUtils.goPage({}, 'Login')
                                }}
                            >
                                <LinearGradient colors={['#14BBCA', '#14c5ca']} style={[CommonStyle.flexCenter,{
                                    width:70,
                                    height:30,
                                    borderRadius: 15
                                }]}>
                                    <Text style={{color:'#fff',fontSize:14}}>登录</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <LinearGradient colors={['#fff', '#f5f5f5']} style={[CommonStyle.flexCenter,{
                                    width:70,
                                    height:30,
                                    borderRadius: 15,
                                    marginLeft: 20
                                }]}>
                                    <Text style={{color:'#333',fontSize:14}}>注册</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                }

            </View>
        )
    }
}
class AboutMe extends Component{
    checkLoginRoute(route, data){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            NavigatorUtils.goPage(data?data:{}, route)
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    render(){
        const {userInfo,balance} = this.props
        return(
            <View style={[CommonStyle.commonWidth,styles.common_padding,CommonStyle.spaceRow,{
                backgroundColor:'#fff',
                marginTop:26,
                height:70,
                borderRadius: 6
            }]}>
                <TouchableOpacity style={[CommonStyle.flexCenter]}
                    onPress={() => this.checkLoginRoute('Focus',{
                        user_id: userInfo.user_id,
                        redirect: 'Focus'
                    })}
                >
                    <Text style={styles.txt}>{userInfo.attention_num?userInfo.attention_num:0}</Text>
                    <Text style={styles.down_txt}>关注</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter]}
                    onPress={() => this.checkLoginRoute('Fans',{
                        user_id: userInfo.user_id,
                        redirect: 'Fans'
                    })}
                >
                    <Text style={styles.txt}>{userInfo.fans_num?userInfo.fans_num:0}</Text>
                    <Text style={styles.down_txt}>粉丝</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter]}

                >
                    <Text style={styles.txt}>15</Text>
                    <Text style={styles.down_txt}>获赞与回复</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter]}
                      onPress={() => this.checkLoginRoute('Trading',{
                          balance:balance,
                          redirect: 'Trading'
                      })}
                >
                    <Text style={styles.txt}>{balance?balance:0.00}</Text>
                    <Text style={styles.down_txt}>交易中心</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
import order from '../../json/order'
class MyOrder extends Component{
    constructor(props) {
        super(props);
        this.orders = order
    }
    checkLoginRoute(route, data){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            NavigatorUtils.goPage(data?data:{}, route)
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    render(){
        return(
            <View style={[CommonStyle.commonWidth,styles.common_padding,{
                backgroundColor:'#fff',
                marginTop:10,
                height:136,
                borderRadius: 6,
                alignItems: 'flex-start'
            }]}>
                <Text style={styles.title}>
                    我的订单
                </Text>
                <View style={[CommonStyle.spaceRow,{width:'100%',marginTop:25}]}>
                    {this.orders.map((item,index) => {
                        return <TouchableOpacity key={index} style={CommonStyle.flexCenter}
                        onPress={()=>{this.checkLoginRoute('OrderPage', {initPage: index})}}>
                            <View style={{position:'relative'}}>
                                <Image source={item.icon} style={{width:item.width,height:item.height}}/>
                            </View>
                            <Text style={{color:'#333',fontSize: 12,marginTop:13}}>{item.title}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        )
    }
}
import manage from '../../json/Manage'
class ManageActive extends Component{
    constructor(props) {
        super(props);
        this.manages = manage
    }
    checkLoginRoute(route, data){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            NavigatorUtils.goPage(data?data:{}, route)
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    render(){
        const {userInfo, theme} = this.props
        return <View style={[CommonStyle.commonWidth,styles.common_padding,{
            backgroundColor:'#fff',
            marginTop:10,
            height:136,
            borderRadius: 6,
            alignItems: 'flex-start'
        }]}>
            <Text style={styles.title}>
                管理体验
            </Text>
            <View style={[CommonStyle.spaceRow,{width:'100%',marginTop:25}]}>
                {
                    userInfo.isplanner && userInfo.audit_face==2
                    ?
                        this.manages.map((item,index) => {
                            return <TouchableOpacity key={index} style={CommonStyle.flexCenter}
                            onPress={()=>{this.checkLoginRoute(item.router, {})}}>
                                <View style={{position:'relative'}}>
                                    <Image source={item.icon} style={{width:item.width,height:item.height}}/>
                                </View>
                                <Text style={{color:'#333',fontSize: 12,marginTop:13}}>{item.title}</Text>
                            </TouchableOpacity>
                        })
                   :
                        <View style={[CommonStyle.flexCenter,{width:'100%'}]}>
                            <Text style={{color:'#999'}}>策划者才会有管理的体验哟！</Text>
                            <Text style={{
                                color:theme,
                                fontWeight:'bold',
                                marginTop: 15
                            }}>成为策划者</Text>
                        </View>
                }
            </View>
        </View>
    }
}
import create from '../../json/create'
class CreateCenter extends Component{
    constructor(props) {
        super(props);
        this.creates = create
    }
    checkLoginRoute(route, data){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            NavigatorUtils.goPage(data?data:{}, route)
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    render(){
        return(
            <View style={[CommonStyle.commonWidth,styles.common_padding,{
                backgroundColor:'#fff',
                marginTop:10,
                height:136,
                borderRadius: 6,
                alignItems: 'flex-start'
            }]}>
                <Text style={styles.title}>
                    创作中心
                </Text>
                <View style={[CommonStyle.spaceRow,{width:'100%',marginTop:25}]}>
                    {this.creates.map((item,index) => {
                        return <TouchableOpacity key={index} style={CommonStyle.flexCenter}
                        onPress={()=>{this.checkLoginRoute(item.router, {})}}>
                            <View style={{position:'relative'}}>
                                <Image source={item.icon} style={{width:item.width,height:item.height}}/>
                            </View>
                            <Text style={{color:'#333',fontSize: 12,marginTop:13}}>{item.title}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        )
    }
}
import other from '../../json/other'
class Other extends Component{
    constructor(props) {
        super(props);
        this.others = other
    }
    checkLoginRoute(){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            alert('已登录')
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    render(){
        return(
            <View style={[CommonStyle.commonWidth,styles.common_padding,CommonStyle.spaceRow,{
                backgroundColor:'#fff',
                marginTop:10,
                height:92,
                borderRadius: 6,
                marginBottom: 20
            }]}>
                <View style={[CommonStyle.spaceRow,{width:'100%'}]}>
                    {this.others.map((item,index) => {
                        return <TouchableOpacity key={index} style={CommonStyle.flexCenter}
                        onPress={()=>this.checkLoginRoute()}>
                            <View style={{position:'relative'}}>
                                <Image source={item.icon} style={{width:item.width,height:item.height}}/>
                            </View>
                            <Text style={{color:'#333',fontSize: 12,marginTop:13}}>{item.title}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        )
    }
}

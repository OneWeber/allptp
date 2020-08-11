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
import languageType from '../../json/languageType'
const {width, height} = Dimensions.get('window');
class MyPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
        }
    }
    componentDidMount(){
        this.getUserInfo();
        this.getBalance();
        this.getNoRead();
    }
    getNoRead() {
        const {token, onLoadNoRead} = this.props
        let formData=new FormData();
        this.storeName = 'noread';
        formData.append('token', token);
        onLoadNoRead(this.storeName, HttpUrl+ 'Sysmsg/noread', formData)
    }
    getUserInfo(){
        const {token, onLoadUserInfo} = this.props
        let formData=new FormData();
        this.storeNames='userinfo';
        formData.append('token', token);
        onLoadUserInfo(this.storeNames, HttpUrl+'User/get_user', formData)
    }
    getBalance(){
        const {initBalance} = this.props;
        const {token} = this.props
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',1);
        initBalance('balance', NewHttp+'BalanceTwo', formData)
    }
    toSetting() {
        NavigatorUtils.goPage({},'Setting')
    }
    render(){
        const {token, user,userinfo} = this.props;
        let store = this.props.noread[this.storeName];
        if(!store) {
            store={
                items: [],
                isLoading: false
            }
        }
        let userStore = userinfo[this.storeNames];
        if(!userStore) {
            userStore={
                items: [],
                isLoading: false
            }
        }
        return (

            <View style={[styles.container,{justifyContent: 'flex-start'}]}>
                <View>
                    <SafeAreaView style={[CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.flexEnd,CommonStyle.commonWidth,{
                            height:50
                        }]}>
                            <TouchableOpacity
                                style={{marginRight: 25,position:'relative'}}
                                onPress={()=>{
                                    NavigatorUtils.goPage({}, 'SystemMsg')
                                }}
                            >
                                <Image source={require('../../../assets/images/home/xtxx.png')} style={{
                                    width:15.5,
                                    height:19.5
                                }}/>
                                {
                                    token&&user&&user.username&&user.userid&&store.items&&store.items.data&&store.items.data.data&&store.items.data.data.sys_count
                                        ?
                                        <View style={[CommonStyle.flexCenter,{
                                            width: 17,
                                            height: 17,
                                            backgroundColor: '#ff5353',
                                            borderRadius: 8.5,
                                            position:'absolute',
                                            right:-6,
                                            top:-8,
                                            borderWidth: 1,
                                            borderColor: '#fff'
                                        }]}>
                                            <Text style={{color:'#fff',fontSize: 10}}>{store.items.data.data.sys_count}</Text>
                                        </View>
                                        :
                                        null
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.toSetting()}>
                                <Image source={require('../../../assets/images/home/sz.png')} style={{
                                    width:19.5,
                                    height:19.5
                                }}/>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    <ScrollView
                        style={{flex: 1}}
                        showsVerticalScrollIndicator={false}
                    >
                        <InfoHeader {...this.props} {...this.state} userInfo={
                            userStore.items&&userStore.items.data&&userStore.items.data.data?
                                userStore.items.data.data[0]:''
                        }/>
                        {/*关注，粉丝，获赞回复，交易中心*/}
                        <AboutMe {...this.props} {...this.state} userInfo={
                            userStore.items&&userStore.items.data&&userStore.items.data.data?
                                userStore.items.data.data[0]:''
                        }/>
                        {/*我的订单*/}
                        <MyOrder {...this.props} {...this.state} userInfo={
                            userStore.items&&userStore.items.data&&userStore.items.data.data?
                                userStore.items.data.data[0]:''
                        }/>
                        {/*管理体验*/}
                        <ManageActive {...this.props} {...this.state} userInfo={
                            userStore.items&&userStore.items.data&&userStore.items.data.data?
                                userStore.items.data.data[0]:''
                        }/>
                        {/*创作中心*/}
                        <CreateCenter {...this.props} {...this.state} userInfo={
                            userStore.items&&userStore.items.data&&userStore.items.data.data?
                                userStore.items.data.data[0]:''
                        }/>
                        {/*评价我的，我的地址，旅行基金，帮助与反馈*/}
                        <Other {...this.props} {...this.state} userInfo={
                            userStore.items&&userStore.items.data&&userStore.items.data.data?
                                userStore.items.data.data[0]:''
                        }/>
                    </ScrollView>
                </View>

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
        paddingLeft: 5,
        paddingRight: 5,
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
    theme: state.theme.theme,
    language: state.language.language,
    noread: state.noread,
    userinfo: state.userinfo,
    balance: state.balance
})
const mapDispatchToProps = dispatch => ({
    initToken: token => dispatch(action.InitToken(token)),
    initUser: user => dispatch(action.InitUser(user)),
    onLoadNoRead: (storeName, url, data) => dispatch(action.onLoadNoRead(storeName, url, data)),
    onLoadUserInfo: (storeName, url, data) => dispatch(action.onLoadUserInfo(storeName, url, data)),
    initBalance: (storeName, url, data) => dispatch(action.initBalance(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
class InfoHeader extends Component{
    render(){
        const {theme, user, token, userInfo, language} = this.props
        return(
            <View style={[CommonStyle.flexCenter,{marginTop: 11}]}>
                {
                    token && user.username && user.userid
                    ?
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                            <LazyImage
                                source={user&&user.avatar?{uri:JSON.parse(user.avatar)}:
                                    require('../../../assets/images/touxiang.png')}
                                style={{width:60,height:60,borderRadius:30}}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                height:60,
                                width:width*0.94-150,
                                alignItems: 'flex-start'
                            }]}>
                                <Text style={{color:'#333',fontSize:18,fontWeight:'bold'}}>
                                    {user&&user.username?user.username=='匿名用户'?user.username:JSON.parse(user.username):null}
                                </Text>
                                <View style={[CommonStyle.flexStart]}>
                                    {
                                        userInfo.isvolunteer && userInfo.audit_idcard == 1
                                        ?
                                            <LinearGradient colors={['#14BBCA', '#14c5ca']} style={[styles.role_item,CommonStyle.flexCenter,{
                                                marginRight: 10
                                            }]}>
                                                <Text style={{color:'#fff',fontSize:11}}>
                                                    {
                                                        language===1?languageType.CH.my.volunteer:language===2?languageType.EN.my.volunteer:languageType.JA.my.volunteer
                                                    }
                                                </Text>
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
                                                <Text style={{color:'#fff',fontSize:11}}>
                                                    {
                                                        language===1?languageType.CH.journey.planner:language===2?languageType.EN.journey.planner:languageType.JA.journey.planner
                                                    }
                                                </Text>
                                            </LinearGradient>
                                        :
                                            null
                                    }

                                    <Text style={{
                                        color:theme,
                                        fontSize:12,
                                    }}>
                                        {
                                            language===1?languageType.CH.my.credibility:language===2?languageType.EN.my.credibility:languageType.JA.my.credibility
                                        }:10分
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[CommonStyle.flexEnd]}
                                onPress={()=>{
                                    NavigatorUtils.goPage({}, 'PersonalData')
                                }}
                            >
                                <Text numberOfLines={1} ellipsizeMode={'tail'}
                                    style={{
                                    color:'#333',fontSize:12,
                                    maxWidth: 70
                                }}>
                                    {
                                        language===1?languageType.CH.my.Personal_home:language===2?languageType.EN.my.Personal_home:languageType.JA.my.Personal_home
                                    }
                                </Text>
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
        const {userInfo,balance,language,token, user} = this.props;
        let store = balance['balance'];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
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
                    <Text style={styles.txt}>{token&&user&&user.username&&user.userid?userInfo.attention_num?userInfo.attention_num:0:0}</Text>
                    <Text style={styles.down_txt}>
                        {
                            language===1?languageType.CH.my.focus:language===2?languageType.EN.my.focus:languageType.JA.my.focus
                        }
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter]}
                    onPress={() => this.checkLoginRoute('Fans',{
                        user_id: userInfo.user_id,
                        redirect: 'Fans'
                    })}
                >
                    <Text style={styles.txt}>{token&&user&&user.username&&user.userid?userInfo.fans_num?userInfo.fans_num:0:0}</Text>
                    <Text style={styles.down_txt}>
                        {
                            language===1?languageType.CH.my.fans:language===2?languageType.EN.my.fans:languageType.JA.my.fans
                        }
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter]}
                      onPress={() => this.checkLoginRoute('PraiseAndBack',{
                          user_id: userInfo.user_id,
                          redirect: 'PraiseAndBack'
                      })}
                >
                    <Text style={styles.txt}>{token&&user&&user.username&&user.userid?parseFloat(userInfo.praise_num)+parseFloat(userInfo.leaving_num):0}</Text>
                    <Text style={styles.down_txt}>
                        {
                            language===1?languageType.CH.my.back:language===2?languageType.EN.my.back:languageType.JA.my.back
                        }
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter]}
                      onPress={() => this.checkLoginRoute('Trading',{
                          balance:balance,
                          redirect: 'Trading'
                      })}
                >
                    {
                        store.items&&store.items.data&&store.items.data.data
                        ?
                            <Text style={styles.txt}>
                                {
                                    token&&user&&user.username&&user.userid
                                        ?
                                        (parseFloat(store.items.data.data.due_balance)+parseFloat(store.items.data.data.unpaid_amount?store.items.data.data.unpaid_amount:0)).toFixed(2)
                                        :
                                        0.00
                                }
                            </Text>
                        :
                            <Text style={styles.txt}>0.00</Text>
                    }
                    <Text style={styles.down_txt}>
                        {
                            language===1?languageType.CH.my.trading:language===2?languageType.EN.my.trading:languageType.JA.my.trading
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
class MyOrder extends Component{
    constructor(props) {
        super(props);
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
        this.orders = [
            {
                title:this.props.language===1?'待体验':this.props.language===2?'stay':'体験する',
                icon:require('../../../assets/images/home/dty.png'),
                router:'',
                width:20,
                height:22.5
            },
            {
                title:this.props.language===1?'进行中':this.props.language===2?'ongoing':'進行中',
                icon:require('../../../assets/images/home/jxz.png'),
                router:'',
                width:17,
                height:21
            },
            {
                title:this.props.language===1?'未完成':this.props.language===2?'unfinished':'未完成',
                icon:require('../../../assets/images/home/wwc.png'),
                router:'',
                width:22,
                height:21.5
            },
            {
                title:this.props.language===1?'已完成':this.props.language===2?'complete':'完了した',
                icon:require('../../../assets/images/home/ywc.png'),
                router:'',
                width:21,
                height:22
            },
            {
                title:this.props.language===1?'退款':this.props.language===2?'refund':'払い戻し',
                icon:require('../../../assets/images/home/tk.png'),
                router:'',
                width:24,
                height:22
            }
        ];
        const {language} = this.props
        return(
            <View style={[CommonStyle.commonWidth,styles.common_padding,{
                backgroundColor:'#fff',
                marginTop:10,
                height:136,
                borderRadius: 6,
                alignItems: 'flex-start'
            }]}>
                <Text style={styles.title}>
                    {language===1?languageType.CH.my.order:language===2?languageType.EN.my.order:languageType.JA.my.order}
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
class ManageActive extends Component{
    constructor(props) {
        super(props);
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
        this.manages = [
            {
                title:this.props.language===1?'体验预定':this.props.language===2?'reservation':'体験予定',
                icon:require('../../../assets/images/home/tyyd.png'),
                router:'ActiveReserve',
                width:18,
                height:23
            },
            {
                title:this.props.language===1?'志愿者申请':this.props.language===2?'Volunteer application':'志願者申請',
                icon:require('../../../assets/images/home/zyzsq.png'),
                router:'VolApply',
                width:24.5,
                height:19
            },
            {
                title:this.props.language===1?'已完成':this.props.language===2?'complete':'完了した',
                icon:require('../../../assets/images/home/ywc.png'),
                router:'CompleteActive',
                width:18,
                height:23
            },
            {
                title:this.props.language===1?'退款申请':this.props.language===2?'Refund application':'返金申請',
                icon:require('../../../assets/images/home/tyyd.png'),
                router:'RefundApply',
                width:24,
                height:22
            }
        ];
        const {userInfo, theme, language,token,user} = this.props
        return <View style={[CommonStyle.commonWidth,styles.common_padding,{
            backgroundColor:'#fff',
            marginTop:10,
            height:136,
            borderRadius: 6,
            alignItems: 'flex-start'
        }]}>
            <Text style={styles.title}>
                {
                    language===1?languageType.CH.my.experience:language===2?languageType.EN.my.experience:languageType.JA.my.experience
                }
            </Text>
            <View style={[CommonStyle.spaceRow,{width:'100%',marginTop:25}]}>
                {
                    token&&user&&user.username&&user.userid
                    ?
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
                            <Text style={{color:'#999'}}>
                                {
                                    language===1?languageType.CH.my.experience_propmt:language===2?languageType.EN.my.experience_propmt:languageType.JA.my.experience_propmt
                                }
                            </Text>
                            <Text style={{
                                color:theme,
                                fontWeight:'bold',
                                marginTop: 15
                            }} onPress={()=>{
                                NavigatorUtils.goPage({}, 'CreateActive')
                            }}>
                                {
                                    language===1?languageType.CH.my.be_creater:language===2?languageType.EN.my.be_creater:languageType.JA.my.be_creater
                                }
                            </Text>
                        </View>
                   :
                        <View style={[CommonStyle.flexCenter,{width:'100%'}]}>
                            <Text style={{color:'#999'}}>
                                {
                                    language===1?languageType.CH.my.experience_propmt:language===2?languageType.EN.my.experience_propmt:languageType.JA.my.experience_propmt
                                }
                            </Text>
                            <Text style={{
                                color:theme,
                                fontWeight:'bold',
                                marginTop: 15
                            }} onPress={()=>{
                                NavigatorUtils.goPage({}, 'Login')
                            }}>
                                立即登录
                            </Text>
                        </View>
                }
            </View>
        </View>
    }
}
class CreateCenter extends Component{
    constructor(props) {
        super(props);

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
        this.creates = [
            {
                title: this.props.language===1?'创建体验':this.props.language===2?'Create':'体験をつくる',
                icon:require('../../../assets/images/home/cjty.png'),
                router:'CreateActive',
                width:19,
                height:20
            },
            {
                title:this.props.language===1?'体验日历':this.props.language===2?'calendar':'体験カレンダー',
                icon:require('../../../assets/images/home/tyrl.png'),
                router:'ActiveCalendar',
                width:20,
                height:20.5
            },
            {
                title:this.props.language===1?'发布故事':this.props.language===2?'Publish stories':'リリースストーリー',
                icon:require('../../../assets/images/home/fbgs.png'),
                router:'PublishStory',
                width:26,
                height:21
            },
            {
                title:this.props.language===1?'我的故事':this.props.language===2?'My story':'私の話',
                icon:require('../../../assets/images/home/wdgs.png'),
                router:'MyStory',
                width:18,
                height:22
            }
        ];
        const {language} = this.props
        return(
            <View style={[CommonStyle.commonWidth,styles.common_padding,{
                backgroundColor:'#fff',
                marginTop:10,
                height:136,
                borderRadius: 6,
                alignItems: 'flex-start'
            }]}>
                <Text style={styles.title}>
                    {
                        language===1?languageType.CH.my.center:language===2?languageType.EN.my.center:languageType.JA.my.center
                    }
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
class Other extends Component{
    constructor(props) {
        super(props);
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
        this.others = [
            {
                title:this.props.language===1?'评价':this.props.language===2?'evaluation':'評価',
                icon:require('../../../assets/images/home/pjwd.png'),
                router:'Evaluation',
                width:19,
                height:21
            },
            {
                title:this.props.language===1?'我的地址':this.props.language===2?'My address':'私の住所',
                icon:require('../../../assets/images/home/wddz.png'),
                router:'',
                width:18.5,
                height:21
            },
            {
                title:this.props.language===1?'旅行基金':this.props.language===2?'Travel funds':'旅行基金',
                icon:require('../../../assets/images/home/lxjj.png'),
                router:'TravelFunds',
                width:19,
                height:21.5
            },
            {
                title:this.props.language===1?'帮助与反馈':this.props.language===2?'Help and feedback':'ヘルプとフィードバック',
                icon:require('../../../assets/images/home/bzyfk.png'),
                router:'Feedback',
                width:21,
                height:21
            }
        ];
        const {userInfo} = this.props;
        return( //userInfo.isvolunteer && userInfo.audit_idcard == 1
            <View style={[CommonStyle.commonWidth,styles.common_padding,{
                backgroundColor:'#fff',
                marginTop:10,
                paddingTop: 22.5,
                paddingBottom: 22.5,
                borderRadius: 6,
                marginBottom: 20
            }]}>
                <Text style={[styles.title,{
                    marginTop: 0
                }]}>
                    其他工具
                </Text>
                <View style={[CommonStyle.spaceRow,{width:'100%',marginTop: 22.5}]}>
                    {
                        userInfo.isvolunteer && userInfo.audit_idcard == 1
                        ?
                            <TouchableOpacity style={CommonStyle.flexCenter}
                                              onPress={()=>{
                                                  this.checkLoginRoute('MyVol', {})
                                              }}>
                                <View style={{position:'relative'}}>
                                    <Image
                                        source={require('../../../assets/images/home/zyzsq.png')}
                                        style={{width:24.5,height:19}}
                                    />
                                </View>
                                <Text style={{color:'#333',fontSize: 12,marginTop:13}}>我的志愿</Text>
                            </TouchableOpacity>
                        :
                            null
                    }
                    {this.others.map((item,index) => {
                        return <TouchableOpacity key={index} style={CommonStyle.flexCenter}
                        onPress={()=>this.checkLoginRoute(item.router, {})}>
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

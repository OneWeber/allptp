import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs'
import HomePage from '../page/viewpage/HomePage';
import FavoritePage from '../page/viewpage/FavoritPage';
import TravelPage from '../page/viewpage/TravelPage';
import MsgPage from '../page/viewpage/MsgPage';
import MyPage from '../page/viewpage/MyPage';
import {connect} from 'react-redux'
import {Image, View, StyleSheet, Dimensions, Platform} from 'react-native';
import JPush from "jpush-react-native";
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('window');
const X_WIDTH = 375;
const X_HEIGHT = 812;
const styles = StyleSheet.create({
    icons: {
        width:20,
        height:20
    }
})
class ViewBotNavigator extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isIphoneX: false
        }
        this.TABS = {
            HomePage: {
                screen: HomePage,
                navigationOptions: {
                    tabBarLabel:this.props.language===1?'首页':this.props.language===2?'Home page':'トップページ',
                    tabBarIcon:({tintColor, focused}) => (
                        focused?
                            <Image style={styles.icons} source={require('../../assets/images/bot/sy2.png')}/>
                            :
                            <Image style={styles.icons} source={require('../../assets/images/bot/sy1.png')}/>
                    )
                }
            },
            FavoritePage: {
                screen: FavoritePage,
                navigationOptions: {
                    tabBarLabel:this.props.language===1?'收藏夹':this.props.language===2?'Favorites':'お気に入り',
                    tabBarIcon:({tintColor, focused}) => (
                        focused?
                            <Image style={styles.icons} source={require('../../assets/images/bot/scj2.png')}/>
                            :
                            <Image style={styles.icons} source={require('../../assets/images/bot/scj1.png')}/>
                    )
                }
            },
            TravelPage: {
                screen: TravelPage,
                navigationOptions: {
                    tabBarLabel: this.props.language===1?'旅途':this.props.language===2?'Journey':'旅の途中',
                    tabBarIcon:({tintColor, focused}) => (
                        focused?
                            <Image style={styles.icons} source={require('../../assets/images/bot/lt2.png')}/>
                            :
                            <Image style={styles.icons} source={require('../../assets/images/bot/lt1.png')}/>
                    )
                }
            },
            MsgPage: {
                screen: MsgPage,
                navigationOptions: {
                    tabBarLabel: this.props.language===1?'消息':this.props.language===2?'Message':'ニュース',
                    tabBarIcon:({tintColor, focused}) => (
                        focused?
                            <Image style={styles.icons} source={require('../../assets/images/bot/xx2.png')}/>
                            :
                            <Image style={styles.icons} source={require('../../assets/images/bot/xx1.png')}/>
                    )
                }
            },
            MyPage: {
                screen: MyPage,
                navigationOptions: {
                    tabBarLabel: this.props.language===1?'我的':this.props.language===2?'Mine':'私の',
                    tabBarIcon:({tintColor, focused}) => (
                        focused?
                            <Image style={styles.icons} source={require('../../assets/images/bot/wd2.png')}/>
                            :
                            <Image style={styles.icons} source={require('../../assets/images/bot/wd1.png')}/>
                    )
                }
            }
        };
    }
    isIphoneX(){
        if(Platform.OS === 'ios'&&((height === X_HEIGHT && width === X_WIDTH) || (height === X_WIDTH && width === X_HEIGHT))){
            this.setState({
                isIphoneX:true
            })
        }else{
            this.setState({
                isIphoneX:false
            })
        }
    }
    componentWillMount(): void {
        this.isIphoneX();
        let that = this;
        JPush.init();
        //连接状态
        this.connectListener = result => {
            console.warn("connectListener:" + JSON.stringify(result))
        };
        JPush.addConnectEventListener(this.connectListener);
        //通知回调
        this.notificationListener = result => {
            if (result.notificationEventType == "notificationOpened") {
                // this.props.navigation.navigate('Activitylist')
            }
        };
        JPush.addNotificationListener(this.notificationListener);
        //本地通知回调
        this.localNotificationListener = result => {
            console.warn("localNotificationListener:" + JSON.stringify(result))
        };
        JPush.addLocalNotificationListener(this.localNotificationListener);
        //自定义消息回调
        this.customMessageListener = result => {
            console.warn("customMessageListener:" + JSON.stringify(result))
        };
        JPush.addCustomMessagegListener(this.customMessageListener);
        //tag alias事件回调
        this.tagAliasListener = result => {
            console.warn("tagAliasListener:" + JSON.stringify(result))
        };
        JPush.addTagAliasListener(this.tagAliasListener);
        //手机号码事件回调
        this.mobileNumberListener = result => {
            console.warn("mobileNumberListener:" + JSON.stringify(result))
        };
        JPush.addMobileNumberListener(this.mobileNumberListener);
    }
    componentDidMount(): void {
        JPush.setLoggerEnable(true)
        JPush.getRegistrationID(result =>{
                //alert("registerID:" + JSON.stringify(result))
                console.log('registerID', result);
                AsyncStorage.setItem('registerID',JSON.stringify(result.registerID),(error)=>{
                    if(error){
                        alert('存储失败')
                    }
                })
            }
        )
    }
    _tabNavigator() {
        if(this.Tabs) {
            return this.Tabs
        }
        return this.Tabs = createAppContainer(createBottomTabNavigator(
            this.TABS, {
                tabBarComponent: props => {
                    return <TabBar {...props} />
                }
            }
        ))
    }
    render(){
        const Tab = this._tabNavigator()
        return <View style={{flex: 1,position:'relative'}}>
                <Tab />
            </View>

    }
}
const mapStateToPropsV = state => ({
    language: state.language.language
});
export default connect(mapStateToPropsV)(ViewBotNavigator)
class TabBarComponent extends Component{
    render() {
        return <BottomTabBar
            {...this.props}
            activeTintColor = {this.props.theme}
        />
    }
}
const mapStateToProps = state =>({
    theme: state.theme.theme,
    language: state.language.language
})
const TabBar = connect(mapStateToProps)(TabBarComponent)

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    AsyncStorage,
    Dimensions,
    Platform,
    TouchableHighlight
} from 'react-native';
import commonStyle from "../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign";
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import MyTabBar from "../model/Tabbar"
import Home from "./faceView/Home"
import Trip from './faceView/Trip'
import Mine from "./faceView/Mine"
import JPush from "jpush-react-native";
const X_WIDTH = 375;
const X_HEIGHT = 812;
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
//===============================该平台数据状态管理需用到react-redux
export  default  class Face extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            tabNames: ['首页', '行程', '奇遇','相识','我的'],
            tabIconNames: ['home', 'clock', 'directions','cup', 'user'],
            isShowNav:true,
            isIphoneX:false
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
            console.warn(JSON.stringify(result))
            if (result.notificationEventType == "notificationOpened") {
                this.props.navigation.navigate('Activitylist')
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
            AsyncStorage.setItem('registerID',JSON.stringify(result.registerID),(error)=>{
                if(error){
                    alert('存储失败')
                }
            })
            }
        )
    }
    isIphoneX(){
        if(Platform.OS === 'ios'&&((heightScreen === X_HEIGHT && widthScreen === X_WIDTH) || (heightScreen === X_WIDTH && widthScreen === X_HEIGHT))){
            this.setState({
                isIphoneX:true
            })
        }else{
            this.setState({
                isIphoneX:false
            })
        }
    }
    showNav(isShow){
        this.setState({
            isShowNav:isShow
        })
    }
    render(){
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        return(
            <View style={{flex:1,position:'relative'}}>
                <ScrollableTabView
                    style = {styles.container}
                    renderTabBar={() => <MyTabBar showNav={(isShow)=>this.showNav(isShow)}  navigate={this.props.navigation.navigate} tabNames={tabNames} tabIconNames={tabIconNames}/>}
                    tabBarPosition={'bottom'}
                    locked={true}
                    initialPage={0}
                    prerenderingSiblingsNumber={1}
                    showsVerticalScrollIndicator={false} bounces={true}
                >
                    <View tabLabel="page1" style={styles.center}>
                        <Home navigate={this.props.navigation.navigate}/>
                    </View>
                    <View tabLabel="page2" style={styles.center}>
                        <Trip navigate={this.props.navigation.navigate}/>
                    </View>
                    <View tabLabel="page3" style={styles.center}>

                    </View>
                    <View tabLabel="page4" style={styles.center}>

                    </View>
                    <View tabLabel="page5" style={styles.center}>
                        <Mine navigate={this.props.navigation.navigate}/>
                    </View>

                </ScrollableTabView>
                {
                    !this.state.isShowNav
                    ?
                        <View style={[styles.navView,commonStyle.flexCenter,{bottom:this.state.isIphoneX?120:90}]}>
                            <View style={[
                                commonStyle.contentViewWidth,
                                commonStyle.flexSpace,
                                {
                                    flexDirection:'row'
                                }
                                ]}>
                                <TouchableHighlight
                                    underlayColor='rgba(255,255,255,.3)'
                                    onPress={() =>{this.props.navigation.navigate('Createactive')}}
                                >
                                <View style={commonStyle.flexCenter}>
                                    <View style={[styles.navLiRoll,commonStyle.flexCenter,{backgroundColor:'orange'}]}>
                                        <SimpleLineIcons
                                            name={'flag'}
                                            size={20}
                                            style={{color:'#fff'}}
                                        />
                                    </View>
                                    <Text style={styles.navLiRollTxt}>创建活动</Text>
                                </View>
                                </TouchableHighlight>
                                <View style={commonStyle.flexCenter}>
                                    <View style={[styles.navLiRoll,commonStyle.flexCenter,{backgroundColor:'lightblue'}]}>
                                        <SimpleLineIcons
                                            name={'book-open'}
                                            size={20}
                                            style={{color:'#fff'}}
                                        />
                                    </View>
                                    <Text style={styles.navLiRollTxt}>发布故事</Text>
                                </View>
                                <View style={commonStyle.flexCenter}>
                                    <View style={[styles.navLiRoll,commonStyle.flexCenter,{backgroundColor:'#ff5673'}]}>
                                        <SimpleLineIcons
                                            name={'badge'}
                                            size={20}
                                            style={{color:'#fff'}}
                                        />
                                    </View>
                                    <Text style={styles.navLiRollTxt}>旅行基金</Text>
                                </View>
                            </View>
                            <View style={[styles.navViewBottom]}>
                                <AntDesign
                                    name={'caretdown'}
                                    size={24}
                                    style={{color:'rgba(255,255,255,.9)',marginBottom: -18.7}}

                                />
                            </View>
                        </View>
                     :
                        null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    center: {
        flex: 1,
    },
    centers:{
        justifyContent:'center',
        alignItems:'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    waveView:{
        position:'absolute',
        left:0,
        top:50,
        right:0,
        bottom:0,
    },
    space:{
        width:'100%',
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    start:{
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row'
    },
    navView:{
        position:'absolute',
        left:0,
        right:0,
        bottom:120,
        height:90,
        zIndex:5,
        backgroundColor: 'rgba(255,255,255,.9)'
    },
    navViewBottom:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center'
    },
    navLiRoll:{
        width:40,
        height:40,
        borderRadius:20
    },
    navLiRollTxt:{
        color:'#666',
        marginTop:10,
        fontSize:12
    }
})

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    AsyncStorage,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import { MapView,Initializer } from 'react-native-baidumap-sdk'
import HttpUtils from "../../../https/HttpUtils"
import HttpUrl from "../../../https/HttpUrl"
import Globalm from "./globalmap/Globalm"
import AntDesign from "react-native-vector-icons/AntDesign"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import MapLinking from 'react-native-map-linking';
import Geolocation from 'Geolocation'
import Modal from 'react-native-modalbox';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export default class Globalmap extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            zoomLevel: '',
            token: '',
            activityList: [],
            actCluster: [],
            isGlobal: false,
            gg_lng: '',
            gg_lat: '',
            nowlng: '',
            nowlat: '',
            visible: false
        }
        Initializer.init('eYPcGqYRrvSFqzy0pi9F2o5cGGIHeiDW').catch(e => console.log(e)) //注册百度地图
    }
    componentWillMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getActivityList()
                this.getLocation()
                this.bd_decrypt(this.props.navigation.state.params.set_address_lat, this.props.navigation.state.params.set_address_lng)
            })
        })
    }
    getActivityList() { //获取体验列表
        let formData=new FormData();
        formData.append('token',this.state.token);
        HttpUtils.post(HttpUrl+'Activity/activ_list',formData).then(
            res => {
                if(res.code === 1) {
                    this.setState({
                        activityList: res.data.data
                    },() => {
                        let act_arr = this.state.activityList
                        this.forAct(act_arr).then(
                            res => {
                                this.setState({
                                    actCluster: res
                                })
                            }
                        )
                    })
                }
            }
        )
    }
    getLocation() { //获取当前位置坐标
        Geolocation.getCurrentPosition((location) => {
            let coordinate = [location.coords.longitude, location.coords.latitude]
            this.setState({
                currentLocation: coordinate
            },()=>{
                this.setState({
                    nowlng: coordinate[0],
                    nowlat: coordinate[1]
                })
            })
        })
    }
    forAct(val) {//遍历所有活动转换为点聚合需要的格式
        let actCluster_arr = []
        const promise = new Promise((resolve, reject) => {
            for (let i = 0; i < val.length; i++) {
                actCluster_arr.push({
                    key: parseFloat(i),
                    coordinate: {latitude: val[i].set_address_lat, longitude: val[i].set_address_lng},
                })
            }
            resolve(actCluster_arr)
        })
        return promise
    }
    changeZoom(status) {
        this.setState({
            zoomLevel: status.zoomLevel
        })
    }
    bd_decrypt(lat, lng) { // 百度地图经纬度转换
        const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng - 0.0065,
            y = lat - 0.006,
            z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi),
            theta = Math.atan2(y, x) - 0.00003 * Math.cos(x * x_pi),
            lng_data = z * Math.cos(theta),
            lag_data = z * Math.sin(theta);
        this.setState({
            gg_lng: lng_data,
            gg_lat: lag_data
        })
    }
    onRequestClose(){

    }
    onClose(){

    }
    onOpen(){

    }
    onClosingState() {

    }
    render() {
        let { set_address_lat, set_address_lng, set_address} = this.props.navigation.state.params
        let { isGlobal, gg_lng, gg_lat, nowlng, nowlat } = this.state
        return (
            <View style = {styles.global_map_con}>
                <View style={[styles.global_nav, commonStyle.flexCenter]}>
                    <SafeAreaView style = {{flex: 1}}>
                        <View style={[styles.g_nav_con, commonStyle.flexSpace, commonStyle.contentViewWidth]}>
                            <TouchableHighlight
                                style = {[commonStyle.flexStart, {width: 35, height: 50}]}
                                underlayColor='rgba(255,255,255,.3)'
                                onPress={() => {this.props.navigation.goBack()}}
                            >
                                <AntDesign
                                    name={'left'}
                                    size={22}
                                    style = {{color: '#333'}}
                                />
                            </TouchableHighlight>
                            <View style = {[styles.global_seach, commonStyle.flexStart,commonStyle.commonShadow]}>
                                {
                                    isGlobal
                                    ?
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                            style = {{color: '#999', fontSize: 14}}
                                        >
                                            根据您的要求搜索
                                        </Text>
                                    :
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                            style = {{color: '#999', fontSize: 14}}
                                        >
                                            体验位于{set_address}
                                        </Text>
                                }

                            </View>

                            <TouchableHighlight
                                style = {[styles.global_icon, commonStyle.flexEnd,{flexDirection: 'row'}]}
                                underlayColor='rgba(255,255,255,.3)'
                                onPress={() => { this.setState({isGlobal: !isGlobal}) }}
                            >
                            <AntDesign
                                name={'earth'}
                                size={22}
                                style = {{color: isGlobal ? '#14c5ca' : '#999'}}
                            />
                            </TouchableHighlight>
                        </View>
                        {
                            isGlobal
                            ?
                                <View style = {[commonStyle.flexCenter, {flexDirection: 'row', paddingBottom: 10,marginTop:10}]}>
                                    <TouchableHighlight
                                        style = {[commonStyle.flexStart]}
                                        underlayColor='rgba(255,255,255,.3)'
                                        onPress={() => { this.refs.pnum.open()}}
                                    >
                                        <View  style = {[commonStyle.flexStart]}>
                                            <Text style = {styles.conditions_txt}>人数</Text>
                                            <AntDesign
                                                name={'caretdown'}
                                                size={7}
                                                style = {{color :'#333'}}
                                            />
                                        </View>
                                    </TouchableHighlight>
                                    <View style = {[commonStyle.flexStart,{marginLeft: 90}]}>
                                        <Text style = {styles.conditions_txt}>筛选条件</Text>
                                        <AntDesign
                                            name={'caretdown'}
                                            size={7}
                                            style = {{color :'#333'}}
                                        />
                                    </View>
                                </View>
                            :
                                null
                        }
                    </SafeAreaView>
                </View>
                {
                    isGlobal
                    ?
                        <Globalm {...this.state} {...this.props}/>
                    :
                        <MapView
                            center={{ latitude: set_address_lat, longitude: set_address_lng }}
                            style={ styles.global_map_con }
                            onStatusChange = {(status) => this.changeZoom(status)}
                        >
                            <MapView.Marker coordinate={{ latitude: set_address_lat, longitude: set_address_lng }}>
                                <MapView.Callout>

                                </MapView.Callout>
                            </MapView.Marker>
                        </MapView>
                }
                {
                    isGlobal
                    ?
                        null
                    :
                        <TouchableHighlight
                            style = {[styles.go_nav, commonStyle.flexCenter]}
                            underlayColor='rgba(255,255,255,.3)'
                            onPress = {() => {MapLinking.planRoute(
                                {
                                    lat: nowlat,
                                    lng: nowlng,
                                    title: ''
                                },
                                {
                                    lat: gg_lat,
                                    lng: gg_lng,
                                    title: set_address
                                },
                                'drive'
                            )}}
                        >
                            <EvilIcons
                                name={'sc-telegram'}
                                size={30}
                                style = {{color: '#14c5ca'}}
                            />
                        </TouchableHighlight>
                }
                <Modal
                    style={[commonStyle.flexCenter,{backgroundColor:'rgba(0,0,0,0)'}]}
                    ref={"pnum"}
                    animationDuration={280}
                    position={"top"}
                    backdropColor={'rgba(0,0,0,0.5)'}
                    swipeToClose={true}
                    onClosed={()=>this.onClose()}
                    onOpened={this.onOpen()}
                    backdropPressToClose={true}
                    coverScreen={true}
                    onClosingState={this.onClosingState}>
                    <View style = {[styles.p_con, commonStyle.commonShadow]}></View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    global_map_con: {
        flex: 1,
        position: 'relative'
    },
    global_title: {
        paddingLeft:10,
        paddingRight:10,
        paddingTop:6,
        paddingBottom:6,
        maxWidth: 200,
        backgroundColor: '#fff',
    },
    global_nav: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: '#fff'
    },
    g_nav_con: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    g_act_detail: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,

    },
    g_act_con: {
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    global_icon: {
        width: 40,
        height: 50,
    },
    go_nav: {
        position: 'absolute',
        right: 0,
        bottom: 50,
        height: 50,
        width: 50,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    global_seach: {
        width: widthScreen*0.96 - 90,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingLeft: 10
    },
    conditions_txt: {
        color: '#999',
        marginRight: 5
    },
    p_con: {
        width: widthScreen*0.8,
        height: 180,
        backgroundColor: '#fff',
        borderRadius: 5

    }
})
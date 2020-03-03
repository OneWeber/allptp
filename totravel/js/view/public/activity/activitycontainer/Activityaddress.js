import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import commonStyle from "../../../../../res/js/Commonstyle"
import Ionicons from "react-native-vector-icons/Ionicons";
import { MapView,Initializer } from 'react-native-baidumap-sdk'
import MapLinking from 'react-native-map-linking';
import Geolocation from 'Geolocation'
type Props = {}
const widthScreen = Dimensions.get('window').width;
export default  class Activityaddress extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            nowlng: '',
            nowlat: '',
            currentLocation: '',
            gg_lng: '',
            gg_lat: ''
        }
        Initializer.init('eYPcGqYRrvSFqzy0pi9F2o5cGGIHeiDW').catch(e => console.log(e)) //注册百度地图
    }
    componentDidMount() {
        this.getLocation()
        this.bd_decrypt(this.props.activityInfo.set_address_lat, this.props.activityInfo.set_address_lng)
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
    render() {
        let { activityInfo } = this.props;
        let { nowlng, nowlat, gg_lng, gg_lat } = this.state
        return (
            <View style = {[commonStyle.contentViewWidth, {
                marginTop: 20,
                paddingBottom:20,
                borderBottomColor: '#f5f5f5',
                borderBottomWidth: 1
            }]}>
                <Text style = {{ fontSize:20, color: '#333', fontWeight: 'bold'}}>体验地点</Text>
                <View style = {{marginTop:20}}>
                    <Text style = {styles.userTxt}>
                        体验地点是{ activityInfo.country }
                        { activityInfo.province }
                        { activityInfo.city == '市辖区' ? null : activityInfo.city }
                        { activityInfo.region },
                        另外在体验中我们将还会去到{ activityInfo.go_place }
                    </Text>
                </View>
                <View style = { styles.map_con }>
                    <MapView center={{ latitude:activityInfo.set_address_lat, longitude:activityInfo.set_address_lng }} style={{width:'100%',height:180}}>
                        <MapView.Marker coordinate={{ latitude: activityInfo.set_address_lat, longitude: activityInfo.set_address_lng }}>
                            <MapView.Callout>
                                <Text> </Text>
                            </MapView.Callout>
                        </MapView.Marker>
                    </MapView>
                    <TouchableHighlight
                        style={styles.mapBg}
                        underlayColor='rgba(255,255,255,.3)'
                        onPress={() =>{this.props.navigate('Globalmap',{
                            set_address_lat: activityInfo.set_address_lat,
                            set_address_lng: activityInfo.set_address_lng,
                            set_address: activityInfo.set_address,
                            nowlng: nowlng,
                            nowlat: nowlat
                        })}}
                    >
                        <View></View>
                    </TouchableHighlight>
                    <Text
                        style = {styles.goHere}
                        onPress = {() => {MapLinking.planRoute(
                            {
                                lat: nowlat,
                                lng: nowlng,
                                title: ''
                            },
                            {
                                lat: gg_lat,
                                lng: gg_lng,
                                title: activityInfo.set_address
                            },
                            'drive'
                        )}}
                    >
                        前往这里
                    </Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    userTxt: {
        lineHeight: 23,
        color: '#333',
        fontSize: 16
    },
    map_con: {
        height: 180,
        width: '100%',
        marginTop: 15,
        position: 'relative',
        backgroundColor: "#fff"
    },
    mapBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    goHere: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        color: '#4db6ac',
        fontWeight: 'bold'
    }
})
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    AsyncStorage,
    Dimensions,
    ScrollView,
    Platform
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import { MapView,Initializer } from 'react-native-baidumap-sdk'
import Carousel, { ParallaxImage,Pagination } from 'react-native-snap-carousel';
const widthScreen = Dimensions.get('window').width;
type Props = {}
export default class Globalm extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            isActDetail: false,
            actIndex: '',
            activeSlide: 0,
            t_nowlng: this.props.navigation.state.params.nowlng,
            t_nowlat: this.props.navigation.state.params.nowlat,
        }
    }
    pointAct(index) {
        let { activityList } = this.props
        this.setState({
            isActDetail: true,
            activeSlide: index,
            t_nowlng: activityList[index].set_address_lng,
            t_nowlat: activityList[index].set_address_lat
        })
    }
    _renderItem ({item, index}, parallaxProps) {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.domain + item.image_url }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <Text style={styles.title} numberOfLines={2}>
                    { item.title }
                </Text>
            </View>
        );
    }
    _onSnapToItem(index) {
        let { activityList } = this.props
        this.setState({
            activeSlide: index
        }, () => {
            this.setState({
                t_nowlng: activityList[index].set_address_lng,
                t_nowlat: activityList[index].set_address_lat,
            })
        })
    }
    render() {
        let { set_address_lat, set_address_lng, set_address, nowlat, nowlng } = this.props.navigation.state.params
        let { activityList } = this.props
        let { activeSlide, t_nowlng, t_nowlat } = this.state
        return (
            <View style = {{flex: 1, position: 'relative'}}>
                <MapView
                    style={{flex:1}}
                    zoomLevel={15}
                    center={{ latitude: t_nowlat, longitude: t_nowlng }}
                >
                    <MapView.Marker
                        title={'哈哈哈'}
                        color={'red'}
                        coordinate={{latitude: nowlat, longitude: nowlng}}
                        style={{position: 'relative'}}
                    >
                        <MapView.Callout style={{position:'absolute',left:0,top:-30}}>
                            <View style={{paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6,backgroundColor:'#ffffff',maxWidth:180,borderRadius:5}}>
                                <Text style={{color:'#008489',lineHeight:20}}>您当前的位置</Text>
                            </View>
                        </MapView.Callout>
                    </MapView.Marker>
                    {
                        activityList.map((item, index) => {
                            return <MapView.Marker
                                color={activeSlide == index ? 'orange' : '#14c5ca'}
                                coordinate={{latitude: item.set_address_lat, longitude: item.set_address_lng}}
                                onPress={() => {this.pointAct(index)}}
                            >

                            </MapView.Marker>
                        })
                    }
                </MapView>

                <View style = {[styles.globalm_bot, commonStyle.commonShadow]}>
                    <SafeAreaView>
                        <View style = {{height: 180}}>
                            <Carousel
                                ref={c => {
                                    this._slider1Ref = c;
                                }}
                                sliderWidth={widthScreen}
                                sliderHeight={150}
                                firstItem={ activeSlide }
                                itemWidth={widthScreen - 60}
                                data={activityList}
                                renderItem={this._renderItem}
                                hasParallaxImages={true}
                                onSnapToItem={(index) => {this._onSnapToItem(index)}}
                            />

                        </View>
                    </SafeAreaView>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    globalm_con: {
        flex: 1,
        position: 'relative'
    },
    globalm_bot:{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff'
    },
    item: {
        width: widthScreen - 60,
        height: 150,
        position:'relative',
        marginTop:15
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'relative'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: 5
    },
    title: {
        position: 'absolute',
        left: 5,
        right: 5,
        top: 15,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight:22
    }
})
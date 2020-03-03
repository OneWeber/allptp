import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ImageBackground, TouchableHighlight
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import LazyImage from "animated-lazy-image";
import Citycontainer from "./city/Citycontainer"
import { VibrancyView } from 'react-native-blur';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const SCROLLVIEW_DIRECTION_UP = 0;     //表示ScrollView组件往上滚动
const SCROLLVIEW_DIRECTION_DOWN = 1;   //表示ScrollView组件往下滚动
type Props = {};
export  default  class City extends Component<Props>{
    scrollViewStartOffsetY = 0;         //用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
    scrollViewScrollDirection = 0;      //ScrollView组件滚动的方向：0往上；1往下
    constructor(props) {
        super(props);
        this.state={
            onTouchEnd:0,
            scrollViewScrollDirection:''
        }
    }
    _onScrollBeginDrag = (event) =>{

    };
    _onScroll(event){
        let y = event.nativeEvent.contentOffset.y;
        this.setState({
            onTouchEnd:y,
        })
    }
    _onScrollEndDrag= (event) =>{

    }
    render(){
        return(
            <View style={{flex:1,position:'relative'}}>
                <ParallaxScrollView
                    backgroundColor="#ffffff"
                    contentBackgroundColor="#ffffff"
                    onScroll={(event) => this._onScroll(event)}
                    onScrollBeginDrag={this._onScrollBeginDrag}
                    onScrollEndDrag={this._onScrollEndDrag}
                    //下面渲染背景
                    renderBackground={() =>  <LazyImage style={{
                        width:window.width,
                        height:350,
                    }}
                    source={{uri:'https://p1-q.mafengwo.net/s15/M00/2D/0B/CoUBGV3MDoOANx7vAArrdO-ryho51.jpeg?imageMogr2%2Fstrip'}}/>
                    }
                    //下面是渲染前景
                    renderForeground={() => (
                        <View style={{width:widthScreen,height:350,overflow:'visible'}}>
                            <SafeAreaView style={[commonStyle.flexContent,{position:'relative',justifyContent:'space-between',alignItems:'center'}]}>
                                <View style={[commonStyle.contentViewWidth]}>
                                    <View style={[commonStyle.flexCenter,{marginTop:80}]}>
                                        <Text style={{color:'#fff',fontSize:25,fontWeight: "bold"}}>成都</Text>
                                    </View>
                                    <View style={[commonStyle.flexCenter]}>
                                        <View style={[styles.citySearchBottom,commonStyle.flexStart]}>
                                            <VibrancyView blurType="light" style={[styles.blurCon,commonStyle.flexStart]}>

                                            </VibrancyView>
                                            <View style={[styles.blurCon,commonStyle.flexStart,{zIndex:6}]}>
                                                <AntDesign
                                                    name="search1"
                                                    size={20}
                                                    style={{color:"#fff",marginLeft:10}}
                                                />
                                                <Text style={{color:'#fff',marginLeft:10}}>你想查找什么？</Text>
                                            </View>
                                        </View>
                                    </View>

                                </View>

                            </SafeAreaView>

                        </View>

                    )}
                    //渲染固定头部
                    renderFixedHeader={() => <Text></Text>}
                    renderStickyHeader={
                        () =>  <SafeAreaView key="sticky-header" style={{width:widthScreen}}>
                            <View  style={[commonStyle.flexSpace,{height:50,borderBottomColor:'#f5f5f5',borderBottomWidth:1}]}>
                                <AntDesign
                                    name={'left'}
                                    size={24}
                                    style={{color:'#333',marginLeft:widthScreen*0.03,width:40}}
                                    onPress={()=>this.props.navigation.goBack()}
                                />
                                <View style={[styles.citySearchTop,commonStyle.flexStart]}>
                                    <AntDesign
                                        name="search1"
                                        size={20}
                                        style={{color:"#666666",marginLeft:10}}
                                    />
                                    <Text style={{color:'#666666',marginLeft:10}}>你想查找什么?</Text>
                                </View>
                                <View style={[commonStyle.flexEnd,{width:40,marginRight:widthScreen*0.03}]}>
                                    <Text style={{color:'#999999'}}>成都</Text>
                                </View>

                            </View>
                        </SafeAreaView>
                    }
                    stickyHeaderHeight={94}
                    parallaxHeaderHeight={ 350 }
                >
                    <Citycontainer navigate={this.props.navigation.navigate}/>
                </ParallaxScrollView>
                {
                    this.state.onTouchEnd>0
                    ?
                        <View style={[styles.cityBottom,commonStyle.commonShadow,commonStyle.flexSpace]}>
                            <SimpleLineIcons
                                name={'compass'}
                                size={26}
                                style={{color:'#4db6ac',marginLeft:widthScreen*0.03}}
                            />
                            <SimpleLineIcons
                                name={'hourglass'}
                                size={26}
                                style={{color:'#4db6ac'}}
                            />
                            <SimpleLineIcons
                                name={'people'}
                                size={26}
                                style={{color:'#4db6ac',marginRight:widthScreen*0.03}}
                            />
                        </View>
                    :
                        null
                }


            </View>
        )
    }
}
const styles = StyleSheet.create({
    cityTop:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:10
    },
    cityTopContainer:{
        height:50
    },
    citySearchTop:{
        width:widthScreen*0.96-110,
        height:40,
        backgroundColor:'#f5f5f5',
        borderRadius:5
    },
    citySearchBottom:{
        width:widthScreen*0.96-110,
        height:45,
        position:'relative',
        marginTop:25,
        borderRadius: 10
    },
    blurCon:{
        position:"absolute",
        left:0,
        right:0,
        top:0,
        bottom:0,
        justifyContent: 'flex-start',
        alignItems:'center',
        borderRadius:10,
        zIndex: 5
    },
    cityBottom:{
        position:'absolute',
        left:widthScreen*0.03,
        right:widthScreen*0.03,
        bottom:35,
        height:55,
        backgroundColor: "#fff",
        zIndex:10,
        borderRadius:5
    }
})

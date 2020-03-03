import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    StatusBar,
    Animated,
    Easing, AsyncStorage,
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import Homecontainer from "./home/Homecontainer"
import HttpUtils from "../../../https/HttpUtils"
import HttpUrl from "../../../https/HttpUrl"

type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const SCROLLVIEW_DIRECTION_UP = 0;     //表示ScrollView组件往上滚动
const SCROLLVIEW_DIRECTION_DOWN = 1;   //表示ScrollView组件往下滚动
export  default  class Home extends Component<Props>{
    scrollViewStartOffsetY = 0;         //用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
    scrollViewScrollDirection = 0;      //ScrollView组件滚动的方向：0往上；1往下
    constructor(props) {
        super(props);
        this.state={
            opacity:0,
            touchEnd:0,
            scrollViewScrollDirection:'',
            token:''
        }
    }

    _onScroll(event){
        let y = event.nativeEvent.contentOffset.y;
        this.setState({
            touchEnd:y
        })
        if (this.scrollViewStartOffsetY > y&&this.scrollViewStartOffsetY-y>20) {
            //手势往下滑动，ScrollView组件往上滚动
            //console.log('手势往下滑动，ScrollView组件往上滚动');
            this.scrollViewScrollDirection = SCROLLVIEW_DIRECTION_UP;
            this.setState({
                scrollViewScrollDirection: 'up'
            });

        } else if (this.scrollViewStartOffsetY < y&&this.scrollViewStartOffsetY-y<-20) {
            //手势往上滑动，ScrollView组件往下滚动
            //console.log('手势往上滑动，ScrollView组件往下滚动');
            this.scrollViewScrollDirection = SCROLLVIEW_DIRECTION_DOWN;
            this.setState({
                scrollViewScrollDirection: 'down'
            });
        }
        let opacityPercent = y / (80);
        if (y < 80) {
            this.setState({
                opacity:opacityPercent
            })
        } else {
            //this.setState({
            //    opacity:1
            //})
        }
    }
    render(){
        return(
            <View style={[commonStyle.flexContent,{position:'relative'}]}>
                <View style={[styles.guideView,{backgroundColor:'rgba(255,255,255,1)'}]}>
                    {
                        this.state.scrollViewScrollDirection=='down'&&this.state.touchEnd>=76
                        ?
                            <SafeAreaView >
                                <View style={[commonStyle.flexCenter,{height:55}]}>
                                    <View style={[commonStyle.flexCenter]}>
                                        <View style={[commonStyle.contentViewWidth,commonStyle.commonShadow,commonStyle.flexStart,{backgroundColor:'#ffffff',height:45}]}>
                                            <AntDesign
                                                name="search1"
                                                size={20}
                                                style={{color:"#999999",marginLeft:10}}
                                            />
                                            <Text style={{color:'#999999',marginLeft:10}}>你想去哪儿？</Text>
                                        </View>
                                    </View>
                                </View>
                            </SafeAreaView>
                        :
                            null
                    }

                </View>
                <ScrollView
                    style={{width:'100%'}}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    scrollEventThrottle={16}
                    onScroll={(event) => this._onScroll(event)}
                >
                    <View stylle={{width:'100%'}}>
                        <View style={[styles.homeTop,{backgroundColor:'rgba(77,182,172,'+(1-this.state.opacity)+')'}]}>
                            <SafeAreaView style={[commonStyle.flexContent,commonStyle.flexCenter,{position:'relative'}]}>
                                <View style={[commonStyle.contentViewWidth,commonStyle.flexSpace,{marginTop:-30}]}>
                                    <Text style={{color:'#fff',fontSize:30,fontWeight:'bold'}}>旅人</Text>
                                    <View style={commonStyle.flexCenter}>
                                        <Text style={{fontSize:32}}>☁️</Text>
                                        <Text style={{color:'#fff',fontSize:14}}>多云</Text>
                                    </View>
                                </View>
                                {
                                    this.state.scrollViewScrollDirection=='down'&&this.state.touchEnd>=76
                                    ?
                                        null
                                    :
                                        <View style={[commonStyle.flexCenter,{position:'absolute',left:0,bottom:-20,right:0,zIndex:15}]}>
                                            <View style={[commonStyle.contentViewWidth,commonStyle.commonShadow,commonStyle.flexStart,{backgroundColor:'#ffffff',height:45}]}>
                                                <AntDesign
                                                    name="search1"
                                                    size={20}
                                                    style={{color:"#999999",marginLeft:10}}
                                                />
                                                <Text style={{color:'#999999',marginLeft:10}}>你想去哪儿？</Text>
                                            </View>
                                        </View>
                                }
                            </SafeAreaView>
                        </View>
                        {/*主页内容区域*/}
                        <Homecontainer navigate={this.props.navigate} />
                    </View>
                </ScrollView>



            </View>
        )
    }
}
const styles=StyleSheet.create({
    homeTop:{
        width:widthScreen,
        height:150,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
    },
    guideView:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex: 10,

    }
})

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import LazyImage from "animated-lazy-image";
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Tripphoto from "./mine/Tripphoto"
import Mineservice from "./mine/Mineservice"
import HttpUtils from '../../../https/HttpUtils'
import HttpUrl from "../../../https/HttpUrl"
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Mine extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            opacity:0,
            touchEnd:0,
            scrollViewScrollDirection:'',
            isLogin:false,
            userInfo:''
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getUserinfo();
            })
        })
    }
    getUserinfo(){
        let formData=new FormData();
        formData.append('token',this.state.token);
        HttpUtils.post(HttpUrl+'User/get_user',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        userInfo:result.data[0]
                    })
                }
            }
        )
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
        let opacityPercent = y / (170);
        if (y < 170) {
            this.setState({
                opacity:opacityPercent
            })
        } else {
            //this.setState({
            //    opacity:1
            //})
        }
    }
    toLogin(){
        let _this=this;
        this.props.navigate("Login",{
                backgrounte:"TabNav",
                refresh:function () {
                    _this.componentWillMount();
                }
            },
        );
    }
    render(){
        return(
            <View style={{flex:1,position:'relative',backgroundColor:'#4db6ac'}}>
                <View style={{
                    position:'absolute',
                    left:0,
                    top:0,
                    right:0,
                    zIndex:10,
                    backgroundColor:'rgba(255,255,255,'+(this.state.opacity)+')',
                    borderBottomWidth:1,
                    borderBottomColor:this.state.touchEnd>170?'#f5f5f5':'rgba(0,0,0,0)',
                }}>
                    <SafeAreaView>
                        <View style={[commonStyle.contentViewWidth,commonStyle.flexSpace,{height:50,marginLeft:widthScreen*0.03}]}>
                            <View style={commonStyle.flexStart}>
                                <AntDesign
                                    name={'setting'}
                                    size={24}
                                    style={{color:this.state.touchEnd>0?'rgba(0,0,0,'+this.state.opacity+')':'#fff'}}
                                />
                                <AntDesign
                                    name={'notification'}
                                    size={24}
                                    style={{color:this.state.touchEnd>0?'rgba(0,0,0,'+this.state.opacity+')':'#fff',marginLeft:20}}
                                />
                            </View>
                            <SimpleLineIcons
                                name={'credit-card'}
                                size={24}
                                style={{color:this.state.touchEnd>0?'rgba(0,0,0,'+this.state.opacity+')':'#fff'}}
                            />

                        </View>
                    </SafeAreaView>
                </View>
                <ScrollView
                    style={{width:'100%'}}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    scrollEventThrottle={16}
                    onScroll={(event) => this._onScroll(event)}
                >
                    <View style={{width:widthScreen,height:285,overflow:'visible',backgroundColor:'rgba(77,182,172,'+(1-this.state.opacity)+')'}}>
                        <SafeAreaView style={[commonStyle.flexContent,{position:'relative',justifyContent:'space-between',alignItems:'center'}]}>
                            <View style={[commonStyle.contentViewWidth,{marginTop:65}]}>
                                {
                                    this.state.userInfo
                                    ?
                                        <View style={{width:'100%'}}>
                                            <View style={[commonStyle.flexSpace,{height:70}]}>
                                                <View style={[commonStyle.flexStart,{height:70}]}>
                                                    <LazyImage
                                                        source={
                                                            this.state.userInfo.headimage.domain
                                                            ?
                                                            {uri:this.state.userInfo.headimage.domain+this.state.userInfo.headimage.image_url}
                                                            :
                                                                require('../../../res/image/touxiang.png')
                                                        }
                                                        style={{width:70,height:70,borderRadius:35}}
                                                    />
                                                    <View style={{justifyContent:'space-between',alignItems:'flex-start',height:70,marginLeft:15}}>
                                                        <View style={[commonStyle.flexStart]}>
                                                            <View style={{maxWidth:130}}>
                                                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{
                                                                    fontSize:20,
                                                                    color:'#fff',
                                                                    fontWeight: "bold"
                                                                }}>
                                                                    {
                                                                        this.state.userInfo.family_name||this.state.userInfo.middle_name||this.state.userInfo.name
                                                                            ?
                                                                            <Text >
                                                                                {this.state.userInfo.family_name} {this.state.userInfo.middle_name} {this.state.userInfo.name}
                                                                            </Text>
                                                                            :
                                                                            <Text >匿名用户</Text>
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <AntDesign
                                                                name={'edit'}
                                                                size={20}
                                                                style={{color:'#f5f5f5' ,marginLeft:15}}
                                                            />

                                                        </View>
                                                        <View style={[commonStyle.flexCenter,commonStyle.commonShadow,{
                                                            paddingTop:4,
                                                            paddingBottom:4,
                                                            paddingLeft:5,
                                                            paddingRight:5,
                                                            backgroundColor:'#fff',
                                                            borderRadius:10,
                                                            flexDirection:'row'
                                                        }]}>
                                                            {
                                                                this.state.userInfo.isvolunteer&&this.state.userInfo.audit_idcard==1
                                                                ?
                                                                    <Text style={{color:'#999',fontSize:12}}>志愿者</Text>
                                                                :
                                                                    null
                                                            }
                                                            {
                                                                this.state.userInfo.isvolunteer&&this.state.userInfo.isplanner
                                                                ?
                                                                    <Text style={{color:'#999',fontSize:12,marginLeft:3,marginRight:3}}>/</Text>
                                                                :
                                                                    null
                                                            }
                                                            {
                                                                this.state.userInfo.isplanner&&this.state.userInfo.audit_face==2
                                                                    ?
                                                                    <Text style={{color:"#999",fontSize:12}}>策划者</Text>
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[commonStyle.flexEnd,{height:70}]}>
                                                    <Text style={{color:'#f5f5f5',marginRight:10}}>个人主页</Text>
                                                    <AntDesign
                                                        name={'right'}
                                                        size={24}
                                                        style={{color:'#fff',marginRight:-3}}
                                                    />
                                                </View>
                                            </View>
                                            <View style={commonStyle.flexCenter}>
                                                <View style={[commonStyle.flexSpace,{marginTop:20,width:widthScreen*0.94*0.9}]}>
                                                    <View style={[styles.mineLi,commonStyle.flexCenter,{alignItems:'flex-start'}]}>
                                                        <Text style={styles.mineLiTopTxt}>
                                                            {this.state.userInfo.attention_num?this.state.userInfo.attention_num:0}
                                                        </Text>
                                                        <Text style={styles.mineLiBottomTxt}>关注</Text>
                                                    </View>
                                                    <View style={[styles.mineLi,commonStyle.flexCenter]}>
                                                        <Text style={styles.mineLiTopTxt}>
                                                            {this.state.userInfo.fans_num?this.state.userInfo.fans_num:0}
                                                        </Text>
                                                        <Text style={styles.mineLiBottomTxt}>粉丝</Text>
                                                    </View>
                                                    <View style={[styles.mineLi,commonStyle.flexCenter,{alignItems:'flex-end'}]}>
                                                        <Text style={styles.mineLiTopTxt}>
                                                            {this.state.publishTotal?this.state.publishTotal:0}
                                                        </Text>
                                                        <Text style={styles.mineLiBottomTxt}>发表</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    :
                                        <View style={[{width:'100%'},commonStyle.flexCenter]}>
                                            <View style={[commonStyle.flexSpace,{
                                                width:widthScreen*0.94*0.8,
                                                marginTop:5
                                            }]}>
                                                <View style={[commonStyle.flexCenter,{
                                                    width:45,
                                                    height:45,
                                                    borderRadius:22.5,
                                                    backgroundColor:'#fff'
                                                }]}>
                                                    <AntDesign
                                                        name="QQ"
                                                        size={24}
                                                        style={{color:"#00bfff"}}
                                                    />
                                                </View>
                                                <View style={[commonStyle.flexCenter,{
                                                    width:45,
                                                    height:45,
                                                    borderRadius:22.5,
                                                    backgroundColor:'#fff'
                                                }]}>
                                                    <AntDesign
                                                        name="wechat"
                                                        size={24}
                                                        style={{color:"seagreen"}}
                                                    />
                                                </View>
                                                <View style={[commonStyle.flexCenter,{
                                                    width:45,
                                                    height:45,
                                                    borderRadius:22.5,
                                                    backgroundColor:'#fff'
                                                }]}>
                                                    <AntDesign
                                                        name="weibo"
                                                        size={24}
                                                        style={{color:"orange"}}
                                                    />
                                                </View>
                                            </View>
                                            <TouchableHighlight
                                                underlayColor='rgba(255,255,255,.3)'
                                                style={{marginTop:30,borderRadius:5}}
                                                onPress={() =>{this.toLogin()}}
                                            >
                                            <View style={[commonStyle.flexCenter,{width:90,height:35,backgroundColor:'#fff',borderRadius:5}]}>
                                                <Text style={{color:'#999'}}>立即登录</Text>
                                            </View>
                                            </TouchableHighlight>
                                        </View>
                                }

                            </View>

                        </SafeAreaView>
                    </View>
                    <View style={[commonStyle.flexCenter,{width:widthScreen,backgroundColor:'#fff'}]}>
                        <View style={[commonStyle.contentViewWidth,commonStyle.commonShadow,commonStyle.flexSpace,{
                            height:80,
                            backgroundColor:'#fff',
                            marginTop:-20,
                            borderRadius:10
                        }]}>
                            <View style={[styles.threeLi,commonStyle.flexCenter,{alignItems:'flex-start',marginLeft:15}]}>
                                <EvilIcons
                                    name={'heart'}
                                    size={33}
                                    style={{color:'#ff5673'}}
                                />
                                <Text style={styles.threeLiTxt}>我的收藏</Text>
                            </View>
                            <View style={[styles.threeLi,commonStyle.flexCenter]}>
                                <EvilIcons
                                    name={'archive'}
                                    size={33}
                                    style={{color:'lightblue'}}
                                />
                                <Text style={styles.threeLiTxt}>我的订单</Text>
                            </View>
                            <View style={[styles.threeLi,commonStyle.flexCenter,{alignItems:'flex-end',marginRight:15}]}>
                                <EvilIcons
                                    name={'clock'}
                                    size={33}
                                    style={{color:'orange'}}
                                />
                                <Text style={styles.threeLiTxt}>历史记录</Text>
                            </View>
                        </View>
                        <View style={[commonStyle.contentViewWidth]}>
                            <Tripphoto />
                        </View>
                        <View style={[commonStyle.contentViewWidth]}>
                            <Mineservice />
                        </View>
                        <View style={{width:widthScreen,height:800}}></View>
                    </View>

                </ScrollView>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    mineTop:{
        width:widthScreen,
        height:250,
        backgroundColor:'#4db6ac'
    },
    mineLi:{
        width:widthScreen*0.94*0.9/3,
    },
    mineLiTopTxt:{
        color:'#fff',
        fontSize:16,
        fontWeight: 'bold'
    },
    mineLiBottomTxt:{
        color:'#fff',
        fontSize:14,
        marginTop:5
    },
    threeLi:{
        width:widthScreen*0.94/3-30,
        height:80
    },
    threeLiTxt:{
        color:'#333',
        marginTop:8
    }
})

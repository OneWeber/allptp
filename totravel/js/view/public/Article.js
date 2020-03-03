import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    TouchableHighlight,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import AntDesign from "react-native-vector-icons/AntDesign"
import Articlecontainer from "./article/Articlecontainer"
import HttpUtils from "../../../https/HttpUtils"
import HttpUrl from "../../../https/HttpUrl"
import LazyImage from 'animated-lazy-image';
import Loadingview from "../../model/Loadingview"
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
//=======================================该页面会根据跳转本页面传的参数判断是故事文章还是攻略文章
export  default  class Article extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            token:'',
            userInfo:'',
            articleData:'',
            loading:false
        }
    }
    componentWillMount(){
        this.setState({
            loading:true
        })
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getUserinfo();
                this.getArticle();
            })
        })
    }
    getUserinfo(){//获取用户信息
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
    getArticle(){//获取内容详情
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('story_id',this.props.navigation.state.params.story_id);
        formData.append('visit',1);
        formData.append('praise',1);
        HttpUtils.post(HttpUrl+'Story/get_story',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        articleData:result.data
                    },()=>{
                        this.setState({
                            loading:false
                        })
                    })
                }
            }
        )
    }
    toPersonalcenter(){
        this.props.navigation.navigate('Personalcenter',{user_id:this.props.navigation.state.params.user_id})
    }
    render(){
        const {article_type} = this.props.navigation.state.params
        return(
            <View style={{flex:1,position:'relative'}}>
                <ParallaxScrollView
                    backgroundColor="#ffffff"
                    contentBackgroundColor="#ffffff"
                    //下面渲染背景
                    renderBackground={() =>  <LazyImage style={{
                        width:window.width,
                        height:220,
                    }}
                     source={{uri:this.state.articleData.image
                            ?
                             this.state.articleData.image[0].domain+this.state.articleData.image[0].image_url
                            :
                             null
                     }}/>

                    }
                    //下面是渲染前景
                    renderForeground={() => (
                        <View style={{width:widthScreen,height:220,overflow:'visible'}}>
                            <SafeAreaView style={[commonStyle.flexContent,{position:'relative',justifyContent:'space-between',alignItems:'center'}]}>
                                <View style={[commonStyle.contentViewWidth,commonStyle.flexStart,{height:50}]}>

                                </View>
                                <View style={[styles.headRoll,commonStyle.commonShadow]}>
                                    <TouchableHighlight
                                        underlayColor='rgba(255,255,255,.3)'
                                        onPress={() =>{this.toPersonalcenter()}}
                                    >
                                    <Image
                                        source={{
                                            uri:this.state.articleData.user
                                                ?
                                                this.state.articleData.user.headimage.domain+this.state.articleData.user.headimage.themb_url
                                                :
                                                null
                                        }}
                                        style={{width:70,height:70,borderRadius: 35}}
                                    />
                                    </TouchableHighlight>
                                    <View style={[styles.addRoll,commonStyle.commonShadow,commonStyle.flexCenter]}>
                                        <AntDesign
                                            name={'plus'}
                                            size={18}
                                            style={{color:'#4db6ac'}}
                                        />
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
                                <View style={[{width:180},commonStyle.flexCenter]}>
                                    <Text style={{color:'#333333',fontSize:18}} numberOfLines={1} ellipsizeMode={'tail'}>{this.state.articleData.title}</Text>
                                </View>
                                <TouchableHighlight
                                    underlayColor='rgba(255,255,255,.3)'
                                    onPress={() =>{this.props.navigation.navigate('Personalcenter')}}
                                >
                                <Image style={{width:40,
                                    height:40,
                                    borderRadius:20,
                                    marginRight:widthScreen*0.03
                                }}
                                 source={{uri:this.state.articleData.user
                                     ?
                                     this.state.articleData.user.headimage.domain+this.state.articleData.user.headimage.themb_url
                                     :
                                     null}}
                                />
                                </TouchableHighlight>

                            </View>
                        </SafeAreaView>
                    }
                    stickyHeaderHeight={94}
                    parallaxHeaderHeight={ 260 }
                >
                    {
                        this.state.loading
                        ?
                            <View style={[commonStyle.flexContent,commonStyle.flexCenter]}>
                                <Loadingview />
                            </View>
                        :
                            <Articlecontainer story_id={this.props.navigation.state.params.story_id}  article_type={article_type} articleData={this.state.articleData}/>
                    }
                </ParallaxScrollView>
                <View style={styles.articleBottom}>
                    <SafeAreaView style={[{backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#f5f5f5'},commonStyle.flexCenter]}>
                        <View style={[styles.articleBottomContainer,commonStyle.flexSpace,commonStyle.contentViewWidth]}>
                            <View style={[commonStyle.flexStart,{width:85,height:35}]}>
                                <AntDesign
                                    name="star"
                                    size={22}
                                    style={{color:'#ff5673'}}
                                />
                                <AntDesign
                                    name="export"
                                    size={26}
                                    style={{color:'#999999',marginLeft:15}}
                                />
                            </View>
                            <View style={[styles.articleInput,commonStyle.flexStart]}>
                                <Text style={{color:'#666666',marginLeft:10}}>说点儿什么吧...</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    headRoll:{
        width:70,
        height:70,
        borderRadius:35,
        backgroundColor:'#fff',
        position:'absolute',
        bottom:-15,
        right:widthScreen*0.03,
        zIndex:10
    },
    addRoll:{
        width:25,
        height:25,
        borderRadius:12.5,
        backgroundColor:'#fff',
        position:'absolute',
        left:22.5,right:22.5,bottom:-12.5
    },
    articleBottom:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
    },
    articleBottomContainer:{
        width:widthScreen,
        height:50,
        backgroundColor: "#fff"
    },
    articleInput:{
        width:widthScreen*0.94-85,
        height:35,
        backgroundColor:'#f5f5f5',
        borderRadius:5
    }
})

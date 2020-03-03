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
    AsyncStorage
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import LazyImage from 'animated-lazy-image';
import Swiper from 'react-native-swiper';
import LinearGradient from "react-native-linear-gradient"
import HttpUtils from "../../../https/HttpUtils"
import HttpUrl from "../../../https/HttpUrl"
import NewhttpUrl from "../../../https/Newhttpurl";
import Activitycontainer from './activity/Activitycontainer'
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Activity extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            onTouchEnd: 0,
            opacity: 0,
            userInfo: '',
            token: '',
            activityInfo: '',
            imgSrc: [],
            isImgLoading: false,
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },() => {
                this.getUserinfo()
            })
        })
    }
    getUserinfo() { //获取用户信息
        let formData = new FormData();
        formData.append('token', this.state.token);
        HttpUtils.post(HttpUrl+'User/get_user', formData).then(
            result => {
                if(result.code === 1) {
                    this.setState({
                        userInfo:result.data[0]
                    },() => {
                        //return this.getActivity()
                        this.getActivity()
                    })
                } else {
                    //return this.getActivity()
                    this.getActivity()
                }
            }
        )
    }
    getActivity() { //获取活动信息
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('activity_id',this.props.navigation.state.params.activity_id);
        formData.append('visit',1);
        HttpUtils.post(HttpUrl+'Activity/get_activity', formData).then(
            result => {
                if (result.code === 1) {
                    this.setState({
                        activityInfo: result.data
                    }, () => {
                        //alert(JSON.stringify(this.state.activityInfo))
                       this.forImg(this.state.activityInfo)
                    })
                }
            }
        )
    }
    forImg (data) { //遍历图片
        const imgList = data.image
        let imgSrcBase = this.state.imgSrc
        for (let i = 0; i < imgList.length; i++) {
            if (imgList[i].extension == 'jpeg' || 'jpg' || 'png') {
                imgSrcBase.push({
                    img: imgList[i].domain + imgList[i].image_url
                })
            }
        }
        this.setState({
            imgSrc: imgSrcBase
        })
    }
    _onScroll(event) {
        let y = event.nativeEvent.contentOffset.y;
        this.setState({
            onTouchEnd:y
        })
        let opacityPercent = y / (heightScreen-94);
        if (y < heightScreen-94) {
            this.setState({
                opacity:opacityPercent
            })
        } else {
            this.setState({
                opacity:1
            })
        }
    }
    _onIndexChanged(index) {
        alert(index)
    }
    _onScrollBeginDrag() {
        //this.state.animatedValueImg.setValue(0);
    }
    _onMomentumScrollEnd() {

    }
    render(){
        const baseImage=[];
        const imageList = this.state.imgSrc
        for(let i = 0; i < imageList.length; i++){
            baseImage.push(
                <View style={{ width:widthScreen,height:heightScreen,position:'relative' }} key = {i}>
                    <LazyImage
                        source={{ uri: imageList[i].img }}
                        style={{ width:widthScreen,height:heightScreen }}
                        resizeMode = {'cover'}
                    />
                    <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,.55)', 'rgba(0,0,0,2)']} style={[commonStyle.flexContent, styles.LinearBg]}>

                    </LinearGradient>
                </View>
            )
        }
        let { same_act, activityInfo } = this.state
        return(
            <View style={{flex:1,position:'relative'}}>
                <View style={styles.activityTop}>
                    <SafeAreaView style={[
                        {
                            backgroundColor:"rgba(255,255,255,"+this.state.opacity+")"
                        }
                        ]}>
                        <View style={[commonStyle.contentViewWidth,commonStyle.flexSpace,{height:50,marginLeft:widthScreen*0.03}]}>
                            <AntDesign
                                name={'left'}
                                size={24}
                                style={{
                                    color:this.state.onTouchEnd>heightScreen-130?'rgba(0,0,0,1)':'rgba(255,255,255,1)',
                                    width:85
                                }}
                                onPress={()=>this.props.navigation.goBack()}
                            />
                            <View style={{maxWidth:180}}>
                                <Text style={{
                                    color:this.state.onTouchEnd>heightScreen-130?'rgba(0,0,0,1)':"rgba(255,255,255,"+this.state.opacity+")",
                                    fontSize:18
                                }}
                                numberOfLines={1} ellipsizeMode={'tail'}
                                >{ this.state.activityInfo.title }</Text>
                            </View>
                            <View style={[commonStyle.flexEnd,{width:85}]}>
                                <AntDesign
                                    name="staro"
                                    size={24}
                                    style={{
                                        color:this.state.onTouchEnd>heightScreen-130?'rgba(0,0,0,1)':"rgba(255,255,255,1)",
                                        marginRight:15
                                    }}
                                />
                                <AntDesign
                                    name="export"
                                    size={24}
                                    style={{color:this.state.onTouchEnd>heightScreen-130?'rgba(0,0,0,1)':"rgba(255,255,255,1)"}}
                                />
                            </View>
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
                    <Swiper
                        onScrollBeginDrag = {() => this._onScrollBeginDrag()}
                        onMomentumScrollEnd = {() => this._onMomentumScrollEnd()}
                        autoplayTimeout = {4}
                        showsButtons = {false}
                        autoplay = {true}
                        loop = {false}
                        showsPagination = {false}
                    >
                        {baseImage}
                    </Swiper>
                    <SafeAreaView>
                        {
                            this.state.activityInfo
                            ?
                                <Activitycontainer push = {this.props.navigation.push} activity_id = {this.props.navigation.state.params.activity_id} navigate = {this.props.navigation.navigate} activityInfo={activityInfo || ''} />
                            :
                                null
                        }

                    </SafeAreaView>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    activityTop:{
        width:'100%',
        position:'absolute',
        left:0,
        top:0,
        right:0,
        zIndex:10,
    },
    LinearBg: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
})

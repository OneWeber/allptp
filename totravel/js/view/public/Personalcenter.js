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
    ImageBackground,
    AsyncStorage
} from 'react-native';
import commonStyle from "../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import Photo from "./personalcenter/Photo"
import Story from "./personalcenter/Story"
import Comments from "./personalcenter/Comments"
import Modal from 'react-native-modalbox';
import LinearGradient from "react-native-linear-gradient"
import Viewswiper from "../../model/Viewswiper"
import HttpUtils from "../../../https/HttpUtils";
import HttpUrl from "../../../https/HttpUrl";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Personalcenter extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            userInfo:'',
            token:'',
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getOtherUser();
            })
        })
    }
    getOtherUser(){
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('user_id',this.props.navigation.state.params.user_id);
        HttpUtils.post(HttpUrl+'User/get_otheruser',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        userInfo:result.data
                    },()=>{
                        alert(JSON.stringify(this.state.userInfo))
                    })
                }
            }
        )
    }

    render(){
        return(
            <SafeAreaView style={commonStyle.flexContent}>
                <View style={[commonStyle.contentViewWidth,commonStyle.flexContent,{marginLeft:widthScreen*0.02}]}>
                    <View style={[commonStyle.flexStart,{height:50}]}>
                        <AntDesign
                            name={'left'}
                            size={24}
                            style={{color:'#333'}}
                            onPress={()=>this.props.navigation.goBack()}
                        />
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
                        <View style={[commonStyle.flexSpace,{height:120}]}>
                            <View style={[styles.personalContent,commonStyle.flexCenter]}>
                                <View style={[commonStyle.flexStart,{width:'100%'}]}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{
                                        color:'#333333',
                                        fontWeight:'bold',
                                        fontSize:25
                                    }}>
                                        {
                                            this.state.userInfo.family_name ||this.state.userInfo.middle_name||this.state.userInfo.name
                                            ?
                                                this.state.userInfo.family_name+' '+this.state.userInfo.middle_name+' '+this.state.userInfo.name
                                            :
                                                '匿名用户'
                                        }
                                    </Text>
                                </View>
                                <View style={[commonStyle.flexStart,{width:'100%',marginTop:15}]}>
                                    <View style={commonStyle.flexStart}>
                                        <Text style={{color:'#999'}}>
                                            {this.state.userInfo.isvolunteer&&this.state.userInfo.audit_idcard==1?'志愿者':null}
                                        </Text>
                                        {
                                            this.state.userInfo.isvolunteer&&this.state.userInfo.isplanner
                                            ?
                                                <Text style={{color:'#999',marginLeft:3,marginRight:3}}>/</Text>
                                            :
                                                null
                                        }
                                        <Text style={{color:'#999'}}>
                                            {this.state.userInfo.isplanner&&this.state.userInfo.audit_face==2?' 策划者 ':null}
                                        </Text>
                                    </View>
                                    <SimpleLineIcons
                                        name={'bubble'}
                                        size={20}
                                        style={{color:'#999999',marginLeft:20}}
                                    />
                                </View>

                            </View>
                            <View style={[styles.headRoll,commonStyle.commonShadow]}>
                                <TouchableHighlight
                                    underlayColor='rgba(255,255,255,.3)'
                                    onPress={() =>{this.refs.head.open()}}
                                >
                                <Image
                                    source={
                                        this.state.userInfo.headimage
                                        ?
                                            {uri:this.state.userInfo.headimage.domain+this.state.userInfo.headimage.image_url}
                                        :
                                           require('../../../res/image/touxiang.png')
                                    }
                                    style={[styles.headRoll,{marginRight: 0}]}
                                />
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={[commonStyle.flexSpace,{
                            width:'100%',
                            marginTop:15,
                            borderBottomWidth:1,
                            borderBottomColor:'#f5f5f5',
                            paddingBottom:40
                        }]}>
                            <View style={[styles.personalLi,commonStyle.flexCenter]}>
                                <View style={{width:'100%'}}>
                                    <Text style={styles.personalLiTxt}>
                                        {this.state.userInfo.activ_num?this.state.userInfo.activ_num:0}
                                    </Text>
                                </View>
                                <View style={{width:'100%',marginTop:10}}>
                                    <Text style={{color:'#999999'}}>创建活动</Text>
                                </View>
                            </View>
                            <View style={[styles.personalLi,commonStyle.flexCenter]}>
                                <Text style={styles.personalLiTxt}>
                                    {this.state.userInfo.fans_num?this.state.userInfo.fans_num:0}
                                </Text>
                                <Text style={{color:'#999999',marginTop:10}}>粉丝数</Text>
                            </View>
                            <View style={[styles.personalLi,commonStyle.flexCenter]}>
                                <View style={[commonStyle.flexEnd,{width:'100%'}]}>
                                    <Text style={styles.personalLiTxt}>
                                        {this.state.userInfo.attention_num?this.state.userInfo.attention_num:0}
                                    </Text>
                                </View>
                                <View style={[commonStyle.flexEnd,{width:'100%',marginTop:10}]}>
                                    <Text style={{color:'#999999'}}>他的关注</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[commonStyle.flexSpace,{marginTop:25}]}>
                            <Text style={styles.sameTitle}>相册</Text>
                            <Text style={styles.sameSmallTitle}>展示所有</Text>
                        </View>
                        <Photo />
                        {
                            this.state.userInfo&&this.state.userInfo.story_list.length>0
                            ?
                                <View>
                                    <View style={[commonStyle.flexSpace,{marginTop:25}]}>
                                        <Text style={styles.sameTitle}>故事</Text>
                                        <Text style={styles.sameSmallTitle} onPress={()=>this.props.navigation.navigate('Articlelist')}>展示所有</Text>
                                    </View>
                                    <Story articleList={this.state.userInfo?this.state.userInfo.story_list[0]:[]}/>
                                </View>
                            :
                                null
                        }

                        <View style={{width:'100%',marginTop:25}}>
                            <Viewswiper titleList={['游客评价','策划者评价']}>
                                <View style={{width:widthScreen*0.96,marginTop:20}}>
                                    <Comments />
                                </View>
                                <View style={{width:widthScreen*0.96,marginTop:20}}>
                                    <Comments />
                                </View>
                            </Viewswiper>
                        </View>



                    </ScrollView>
                </View>
                <Modal
                    style={{height:heightScreen,width:'100%'}}
                    ref={"head"}
                    animationDuration={300}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0)'}
                    swipeToClose={false}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    backdropPressToClose={true}
                    coverScreen={true}
                    onClosingState={this.onClosingState}>
                    <View style={[commonStyle.flexContent]}>
                        <ImageBackground
                            style={[commonStyle.flexContent,{position:'relative'}]}
                            source={{uri:this.state.userInfo?this.state.userInfo.headimage.domain+this.state.userInfo.headimage.image_url:null}}
                        >
                            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,.75)', 'rgba(0,0,0,2)']} style={[commonStyle.flexContent]}>

                            </LinearGradient>
                            <View style={[commonStyle.contentViewWidth,{
                                position:'absolute',
                                left:widthScreen*0.03,
                                right:widthScreen*0.03,
                                top:0,
                                bottom:0
                            }]}>
                                <SafeAreaView style={[commonStyle.flexContent,{justifyContent:'space-between',alignItems:'center'}]}>
                                    <View style={[commonStyle.flexStart,{height:50}]}>
                                        <View style={[commonStyle.flexStart,{width:'100%'}]}>
                                            <AntDesign
                                                name={'close'}
                                                size={24}
                                                style={{color:'#fff'}}
                                                onPress={()=>this.refs.head.close()}
                                            />
                                        </View>
                                    </View>
                                    <View style={{width:'100%',marginBottom:50}}>
                                        <View>
                                            <View style={commonStyle.flexSpace}>
                                                <View style={{width:widthScreen*0.94-55}}>
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{
                                                        color:'#fff',
                                                        fontWeight:'bold',
                                                        fontSize:25
                                                    }}>
                                                        {
                                                            this.state.userInfo.family_name ||this.state.userInfo.middle_name||this.state.userInfo.name
                                                            ?
                                                            this.state.userInfo.family_name+' '+this.state.userInfo.middle_name+' '+this.state.userInfo.name
                                                            :
                                                            '匿名用户'
                                                        }
                                                    </Text>
                                                </View>
                                                <View style={[{width:40},commonStyle.flexEnd]}>
                                                    <SimpleLineIcons
                                                        name={'bubble'}
                                                        size={26}
                                                        style={{color:'#fff'}}
                                                    />
                                                </View>

                                            </View>
                                        </View>
                                        <View style={[commonStyle.flexStart,{marginTop:10}]}>
                                            <Text style={{color:'#fff'}}>
                                                {this.state.userInfo.isvolunteer&&this.state.userInfo.audit_idcard==1?'志愿者':null}
                                            </Text>
                                            {
                                                this.state.userInfo.isvolunteer&&this.state.userInfo.isplanner
                                                    ?
                                                    <Text style={{color:'#fff',marginLeft:3,marginRight:3}}>/</Text>
                                                    :
                                                    null
                                            }
                                            <Text style={{color:'#fff'}}>
                                                {this.state.userInfo.isplanner&&this.state.userInfo.audit_face==2?' 策划者 ':null}
                                            </Text>
                                        </View>
                                        <View style={[commonStyle.flexSpace,{
                                            width:'100%',
                                            marginTop:30,
                                        }]}>
                                            <View style={[styles.personalLi,commonStyle.flexCenter]}>
                                                <View style={{width:'100%'}}>
                                                    <Text style={[styles.personalLiTxt,{color:'#fff'}]}>
                                                        {this.state.userInfo.activ_num?this.state.userInfo.activ_num:0}
                                                    </Text>
                                                </View>
                                                <View style={{width:'100%',marginTop:10}}>
                                                    <Text style={{color:'#f5f5f5'}}>创建活动</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.personalLi,commonStyle.flexCenter]}>
                                                <Text style={[styles.personalLiTxt,{color:'#fff'}]}>
                                                    {this.state.userInfo.fans_num?this.state.userInfo.fans_num:0}
                                                </Text>
                                                <Text style={{color:'#f5f5f5',marginTop:10}}>粉丝数</Text>
                                            </View>
                                            <View style={[styles.personalLi,commonStyle.flexCenter]}>
                                                <View style={[commonStyle.flexEnd,{width:'100%'}]}>
                                                    <Text style={[styles.personalLiTxt,{color:'#fff'}]}>
                                                        {this.state.userInfo.attention_num?this.state.userInfo.attention_num:0}
                                                    </Text>
                                                </View>
                                                <View style={[commonStyle.flexEnd,{width:'100%',marginTop:10}]}>
                                                    <Text style={{color:'#f5f5f5'}}>他的关注</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[commonStyle.flexCenter,{width:'100%',
                                            height:45,
                                            backgroundColor: '#4db6ac',
                                            borderRadius: 25,
                                            marginTop:30
                                        }]}>
                                            <Text style={{color:'#fff',fontSize:16}}>关注他</Text>
                                        </View>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </ImageBackground>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    headRoll:{
        width:100,
        height:100,
        backgroundColor:'#fff',
        borderRadius:50,
        marginRight:4,
    },
    personalContent:{
        width:widthScreen*0.96-120,
        height:100,
    },
    personalLi:{
        width:widthScreen*0.94/3
    },
    personalLiTxt:{
        fontSize:18,
        fontWeight: 'bold'
    },
    sameTitle:{
        fontSize:20,
        fontWeight:'bold',
        color:'#333333'
    },
    sameSmallTitle:{
        color:'#4db6ac'
    }
})

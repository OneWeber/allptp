import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ImageBackground, FlatList, TouchableHighlight
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import LazyImage from 'animated-lazy-image';
import Welikeactivity from "../../faceView/home/Welikeactivity"
import Homestrategy from "../../faceView/home/Homestrategy"
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
//===========================================该组件需要请求用户进入平台时是否选择自己的爱好板块
const iLike=[
    {icon:require('../../../../res/image/data/dengshan.png'),title:'登山'},
    {icon:require('../../../../res/image/data/paobu.png'),title:'跑步'},
    {icon:require('../../../../res/image/data/chonglang.png'),title:'冲浪'},
    {icon:require('../../../../res/image/data/tiaosan.png'),title:'跳伞'}
]
export  default  class Citycontainer extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    _renderLike(data){
        return <View style={[
            styles.likeLi,
            commonStyle.commonShadow,
            commonStyle.flexCenter,
            {
                marginLeft: data.index==0?widthScreen*0.03+5:10,
                marginRight:data.index==iLike.length-1?widthScreen*0.03+5:0
            }
            ]}>
            <Image
                source={data.item.icon}
                style={{width:40,height:40}}
            />
        </View>
    }
    render(){
        return(
            <View style={[commonStyle.flexCenter,{marginTop:-45,paddingBottom:120}]}>
                <FlatList
                    data={iLike}
                    horizontal={true}
                    renderItem={(data)=>this._renderLike(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={commonStyle.contentViewWidth}>
                    <View style={[commonStyle.flexSpace,{marginTop:25}]}>
                        <Text style={styles.citySameTitle}>成都的体验</Text>
                        <Text style={styles.citySameSmallTitle}>查看更多</Text>
                    </View>
                    <Welikeactivity navigate={this.props.navigate} noMore={true}/>
                    <View style={[commonStyle.flexSpace,{marginTop:25}]}>
                        <Text style={styles.citySameTitle}>成都的故事</Text>
                        <Text style={styles.citySameSmallTitle}>查看更多</Text>
                    </View>
                    <View style={[commonStyle.contentViewWidth,{marginTop:20}]}>
                        <View style={{width:'100%'}}>
                            <TouchableHighlight
                                style={{width:'100%'}}
                                underlayColor='rgba(255,255,255,.3)'
                                onPress={() =>{this.toArticle()}}
                            >
                                <View style={{width:'100%',height:180,overflow:'hidden',borderRadius: 5}}>
                                    <ImageBackground
                                        source={{uri:'http://b1-q.mafengwo.net/s15/M00/C9/A5/CoUBGV20DveAf02yAC7_nVCKp2k18.jpeg?imageMogr2%2Fstrip'}}
                                        style={[commonStyle.flexBottom,{width:'100%',height:180,alignItems:'flex-start'}]}
                                    >
                                        <Text style={{
                                            paddingLeft:10,
                                            paddingRight:10,
                                            marginBottom:15,
                                            color:'#fff',
                                            fontSize:18,
                                            fontWeight:'bold'
                                        }}
                                              numberOfLines={1} ellipsizeMode={'tail'}
                                        >十年一觉成都梦,百转千回不觉醒</Text>
                                    </ImageBackground>
                                </View>
                            </TouchableHighlight>
                            <View style={[commonStyle.flexStart,{width:'100%',marginTop:10}]}>
                                <View style={[commonStyle.flexStart]}>
                                    <AntDesign
                                        name={'heart'}
                                        size={16}
                                        style={{color:'#ff5673'}}
                                    />
                                    <Text style={{color:'#333333',fontWeight:'bold',marginLeft:3}}>572</Text>
                                </View>
                                <View style={[commonStyle.flexStart,{marginLeft:20}]}>
                                    <SimpleLineIcons
                                        name={'speech'}
                                        size={16}
                                        style={{color:'#999999'}}
                                    />
                                    <Text style={{color:'#333333',fontWeight:'bold',marginLeft:3}}>999+</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[commonStyle.flexSpace,{marginTop:25}]}>
                        <Text style={styles.citySameTitle}>成都的攻略</Text>
                        <Text style={styles.citySameSmallTitle}>查看更多</Text>
                    </View>
                    <Homestrategy noMore={true}/>

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    likeLi:{
        width:90,
        height:110,
        backgroundColor:'#fff',
        marginBottom:10,
        marginLeft:5,
        borderRadius:5
    },
    citySameTitle:{
        fontSize:16,
        color:'#333',
        fontWeight: 'bold'
    },
    citySameSmallTitle:{
        color:'#4db6ac'
    }
})

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    FlatList,
    ImageBackground
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const tjData=[
    {
        title:'三大分类'
    },
    {
        title:'户外活动',
        pNum:'33.4w'
    },
    {
        title:'本土文化',
        pNum:'4.8w'
    },
    {
        title:'少数民族',
        pNum:'88.6w'
    },
]
const iLike=[
    {icon:require('../../../../res/image/data/dengshan.png'),title:'登山'},
    {icon:require('../../../../res/image/data/paobu.png'),title:'跑步'},
    {icon:require('../../../../res/image/data/chonglang.png'),title:'冲浪'},
    {icon:require('../../../../res/image/data/tiaosan.png'),title:'跳伞'}
]
//=====================================喜爱的体验这个取决于用户是否选择自己的爱好
export  default  class Welike extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    _renderTj(data){
        return <View>
            {
                data.index==0
                ?
                    <View style={[styles.tjFirst,commonStyle.flexCenter]}>
                        <Text style={{color:'#fff'}}>{data.item.title}</Text>
                        <AntDesign
                            name="rightcircle"
                            size={16}
                            style={{color:"#ffffff",marginTop:5}}
                        />
                    </View>
                :
                    <View style={[styles.tjLi,{marginRight:data.index==tjData.length-1?widthScreen*0.03:0}]}>
                        <ImageBackground
                            style={[commonStyle.flexContent,{borderRadius:5}]}
                            source={{uri:'https://a0.muscache.com/airbnb/static/global_supply/mentor-hero-960afafb1da53528c3e876cde79d239e.png'}}
                        >
                            <View style={[commonStyle.flexContent,styles.tjLiContainer,{backgroundColor:'rgba(0,0,0,.4)'}]}>
                                <View style={{paddingLeft:10,paddingRight:10,marginTop:7}}>
                                    <Text style={{color:'#fff'}} numberOfLines={1} ellipsizeMode={'tail'}>{data.item.title}</Text>
                                </View>
                                <View style={{paddingLeft:10,paddingRight:10}}>
                                    <Text style={{color:'#fff',fontSize:12,marginBottom:7}} numberOfLines={1} ellipsizeMode={'tail'}>{data.item.pNum}人正在围观</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
            }
        </View>
    }
    _renderLike(data){
        return <View style={[styles.likeLi,commonStyle.flexSpace,{marginLeft:data.index==0?widthScreen*0.03:8,marginRight:data.index==iLike.length-1?widthScreen*0.03:0}]}>
            <View style={[commonStyle.flexCenter,{width:70,height:70}]}>
                <Image source={data.item.icon} style={{width:40,height:40}}/>
            </View>
            <View style={[commonStyle.flexBottom,{width:40,height:70}]}>
                <Text style={{color:'#333333',marginBottom:10}}>{data.item.title}</Text>
            </View>
        </View>
    }
    render(){
        let { activeIndex } = this.props;
        return(
            <View style={{width:'100%'}}>
                {
                    activeIndex==0
                    ?
                        <FlatList
                            data={tjData}
                            horizontal={true}
                            renderItem={(data)=>this._renderTj(data)}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <FlatList
                            data={iLike}
                            horizontal={true}
                            renderItem={(data)=>this._renderLike(data)}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                }
            </View>
        )
    }
}
const styles=StyleSheet.create({
    tjFirst:{
        width:90,
        height:70,
        backgroundColor:'#4db6ac',
        borderRadius:5,
        marginLeft:widthScreen*0.03
    },
    tjLi:{
        width:120,
        height:70,
        marginLeft: 8,
        borderRadius: 5,
        overflow:'hidden'
    },
    tjLiContainer:{
        justifyContent:'space-between',
        alignItems:"flex-start"
    },
    likeLi:{
        width:110,
        height:70,
        borderRadius:5,
        backgroundColor:'#f5f5f5',
    }
})

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
    Platform,
    FlatList,
    ImageBackground,
    TouchableHighlight
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import LazyImage from 'animated-lazy-image';
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const strategy=[
    {
        img:'http://n1-q.mafengwo.net/s15/M00/9E/85/CoUBGV317sGAF4UTAAZwB3fCBoI18.jpeg?imageMogr2%2Fstrip',
        title:'24小时乌克兰和沙漠探险记 | 人生的第一次重装徒步',
        headImage:'https://p1-q.mafengwo.net/s15/M00/D1/2B/CoUBGV3DrquAFChlAAit0UYH5TU218.jpg?imageMogr2%2Fstrip',
        name:'Frank',
        label:["新上攻略"],
        address:'乌克兰',
        comments:18,
        look:240
    },
    {
        img:'http://n1-q.mafengwo.net/s15/M00/B0/37/CoUBGV3kxeWAZ4lFAA3PUt8cMbQ99.jpeg?imageMogr2%2Fstrip',
        title:'南京，闪着文艺的光',
        headImage:'https://p1-q.mafengwo.net/s15/M00/D1/2B/CoUBGV3DrquAFChlAAit0UYH5TU218.jpg?imageMogr2%2Fstrip',
        name:'郑凯元',
        label:["新上攻略"],
        address:'南京',
        comments:18,
        look:240
    }
]
export  default  class Homestrategy extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    _renderStrategy(data){
        return <View style={{width:'100%',borderBottomWidth:data.index==strategy.length-1?0:1,borderBottomColor:'#f5f5f5',paddingBottom:data.index==strategy.length-1?0:15}}>
                <View style={[commonStyle.flexSpace,{width:'100%',marginTop:15}]}>
                    <View style={[styles.strategyContent,{justifyContent:'space-between',alignItems:'flex-start'}]}>
                        <Text style={{
                            color:'#333333',
                            fontWeight:'bold',
                            fontSize:16
                        }}
                              numberOfLines={3} ellipsizeMode={'tail'}
                        >
                            {data.item.title}
                        </Text>
                        <View style={[commonStyle.flexStart,{width:'100%'}]}>
                            <LazyImage source={{uri:data.item.headImage}} style={{width:25,height:25,borderRadius:12.5}}/>
                            <View style={{width:(widthScreen*0.94-10)/2-30,marginLeft:5}}>
                                <Text numberOfLines={3} ellipsizeMode={'tail'} style={{
                                    color:'#333333'
                                }}>
                                    <Text style={{fontWeight:'bold'}}>
                                        {data.item.name}
                                    </Text>
                                    在
                                    <Text style={{fontWeight:'bold'}}>
                                        {data.item.address}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.strategyContent,{borderRadius:3,overflow:'hidden'}]}>
                        <LazyImage
                            source={{uri:data.item.img}}
                            style={{width:'100%',height:120}}
                        />
                    </View>
                </View>
                <View style={[commonStyle.flexSpace,{width:'100%',marginTop:10}]}>
                    <View style={[commonStyle.flexStart,{width:'70%',flexWrap:'wrap'}]}>
                        {
                            data.item.label.map((items,index)=>{
                                return <View style={styles.lableLi}>
                                    <Text style={{color:'#999999',fontSize:12}}>{items}</Text>
                                </View>
                            })
                        }
                    </View>
                    <View style={[commonStyle.flexEnd]}>
                        <View style={[commonStyle.flexStart]}>
                            <EvilIcons
                                name={'eye'}
                                size={22}
                                style={{color:'#999999'}}
                            />
                            <Text style={{color:'#999999',marginLeft:5,marginRight:15}}>{data.item.look}</Text>
                        </View>
                        <View style={[commonStyle.flexStart]}>
                            <SimpleLineIcons
                                name={'bubbles'}
                                size={14}
                                style={{color:'#999999'}}
                            />
                            <Text style={{color:'#999999',marginLeft:5}}>{data.item.comments}</Text>
                        </View>
                    </View>
                </View>

            </View>

    }
    render(){
        const { noMore } = this.props
        return(
            <View style={{width:'100%',marginTop:5}}>
                <FlatList
                    data={strategy}
                    horizontal={false}
                    renderItem={(data)=>this._renderStrategy(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
                {
                    noMore
                    ?
                        null
                    :
                        <View style={[commonStyle.flexCenter,{width:'100%',marginTop:20}]}>
                            <Text style={{color:'#4db6ac'}}>查看更多攻略</Text>
                        </View>
                }
            </View>
        )
    }
}
const styles=StyleSheet.create({
    strategyContent:{
        width:(widthScreen*0.94-10)/2,
        height:120,
    },
    lableLi:{
        paddingTop:3,
        paddingBottom:3,
        paddingLeft:6,
        paddingRight:6,
        borderWidth:1,
        borderColor:'#F5F5F5',
        borderRadius:3
    }
})

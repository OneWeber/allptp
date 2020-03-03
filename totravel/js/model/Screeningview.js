import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,

} from 'react-native';
import commonStyle from "../../res/js/Commonstyle";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const sort=[
    {
        id:'',
        title:'全部'
    },
    {
        id:2,
        title:'点赞降序'
    },
    {
        id:3,
        title:'收藏降序'
    },
    {
        id:5,
        title:'留言降序'
    }
]
const type=[
    {
        id:0,
        title:'户外活动'
    },
    {
        id:1,
        title:'少数民族'
    },
    {
        id:2,
        title:'本土文化'
    },
]
const volunteer=[
    {
        id:"",
        title:'全部'
    },
    {
        id:0,
        title:"不需要"
    },
    {
        id:1,
        title:'需要'
    }
]
const personLimit=[
    {
        id:0,
        title:'<=10人'
    },
    {
        id:1,
        title:'11-30人'
    },
    {
        id:2,
        title:'31-50人'
    },
    {
        id:3,
        title:'51-100人'
    },
    {
        id:4,
        title:'101-150人'
    },
    {
        id:5,
        title:'>=151人'
    },
]
const language=["中文","English","日本語"]
export  default  class Screeningview extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        const { typeLevel } = this.props
        return(
            <View style={{width:'100%'}}>
                <View style={[commonStyle.contentViewWidth,{marginLeft:widthScreen*0.03}]}>
                    {
                        typeLevel==1
                        ?
                            <View style={{width:'100%'}}>
                                <Text style={[styles.screeningTxt]}>
                                    期望价格
                                </Text>
                            </View>
                        :
                            null
                    }
                    <Text style={[styles.screeningTxt]}>
                        排序方式
                    </Text>
                    <View style={[commonStyle.flexStart,{width:'100%',flexDirection:'row',flexWrap:'wrap',marginTop:10}]}>
                        {
                            sort.map((item,index)=>{
                                return <View key={index} style={[commonStyle.flexCenter,{
                                    width:(widthScreen*0.94-20)/3,
                                    height:35,
                                    borderColor:'#f5f5f5',
                                    borderWidth:1,
                                    marginTop:10,
                                    marginLeft:index%3==0?0:10
                                }]}><Text style={{color:'#666'}}>{item.title}</Text></View>
                            })
                        }
                    </View>
                    <Text style={[styles.screeningTxt]}>
                        体验类别
                    </Text>
                    <View style={[commonStyle.flexStart,{width:'100%',flexDirection:'row',flexWrap:'wrap',marginTop:10}]}>
                        {
                            type.map((item,index)=>{
                                return <View key={index} style={[commonStyle.flexCenter,{
                                    width:(widthScreen*0.94-20)/3,
                                    height:35,
                                    borderColor:'#f5f5f5',
                                    borderWidth:1,
                                    marginTop:10,
                                    marginLeft:index%3==0?0:10
                                }]}><Text style={{color:'#666'}}>{item.title}</Text></View>
                            })
                        }
                    </View>
                    {
                        typeLevel==1
                        ?
                            <View>
                                <Text style={[styles.screeningTxt]}>
                                    主要语言
                                </Text>
                                <View style={[commonStyle.flexStart,{width:'100%',flexDirection:'row',flexWrap:'wrap',marginTop:10}]}>
                                    {
                                        language.map((item,index)=>{
                                            return <View key={index} style={[commonStyle.flexCenter,{
                                                width:(widthScreen*0.94-20)/3,
                                                height:35,
                                                borderColor:'#f5f5f5',
                                                borderWidth:1,
                                                marginTop:10,
                                                marginLeft:index%3==0?0:10
                                            }]}><Text style={{color:'#666'}}>{item}</Text></View>
                                        })
                                    }
                                </View>
                                <Text style={[styles.screeningTxt]}>
                                    志愿者
                                </Text>
                                <View style={[commonStyle.flexStart,{width:'100%',flexDirection:'row',flexWrap:'wrap',marginTop:10}]}>
                                    {
                                        volunteer.map((item,index)=>{
                                            return <View key={index} style={[commonStyle.flexCenter,{
                                                width:(widthScreen*0.94-20)/3,
                                                height:35,
                                                borderColor:'#f5f5f5',
                                                borderWidth:1,
                                                marginTop:10,
                                                marginLeft:index%3==0?0:10
                                            }]}><Text style={{color:'#666'}}>{item.title}</Text></View>
                                        })
                                    }
                                </View>
                                <Text style={[styles.screeningTxt]}>
                                    参与人数
                                </Text>
                                <View style={[commonStyle.flexStart,{width:'100%',flexDirection:'row',flexWrap:'wrap',marginTop:10,marginBottom:70}]}>
                                    {
                                        personLimit.map((item,index)=>{
                                            return <View key={index} style={[commonStyle.flexCenter,{
                                                width:(widthScreen*0.94-20)/3,
                                                height:35,
                                                borderColor:'#f5f5f5',
                                                borderWidth:1,
                                                marginTop:10,
                                                marginLeft:index%3==0?0:10
                                            }]}><Text style={{color:'#666'}}>{item.title}</Text></View>
                                        })
                                    }
                                </View>


                            </View>
                        :
                            null
                    }


                </View>

            </View>

        )
    }
}
const styles = StyleSheet.create({
    screeningTxt:{
        color:'#333',
        fontWeight:'bold',
        marginTop:20,
        fontSize:15
    }
})

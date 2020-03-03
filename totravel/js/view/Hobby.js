import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    Dimensions,
    ScrollView,
    TouchableHighlight
} from 'react-native';
type Props = {};
import commonStyle from "../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import {NavigationActions, StackActions} from "react-navigation";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
//==========================此页面需判断该用户是否为第一次登录本平台,并且爱好数据需请求后台数据

//模拟爱好数据
const data=[
    {icon:require('../../res/image/data/qianshuijing.png'),title:'潜水',id:0,isselected:0},
    {icon:require('../../res/image/data/dengshan.png'),title:'登山',id:1,isselected:0},
    {icon:require('../../res/image/data/huaxiangsan.png'),title:'滑翔翼',id:2,isselected:0},
    {icon:require('../../res/image/data/chonglang.png'),title:'冲浪',id:3,isselected:0},
    {icon:require('../../res/image/data/paobu.png'),title:'跑酷',id:4,isselected:0},
    {icon:require('../../res/image/data/tiaosan.png'),title:'跳伞',id:5,isselected:0},
    {icon:require('../../res/image/data/minzu.png'),title:'少数民族',id:6,isselected:0},
    {icon:require('../../res/image/data/yishu.png'),title:'本土文化',id:7,isselected:0},
    {icon:require('../../res/image/data/qianshuijing.png'),title:'潜水',id:8,isselected:0},
    {icon:require('../../res/image/data/dengshan.png'),title:'登山',id:9,isselected:0},
    {icon:require('../../res/image/data/huaxiangsan.png'),title:'滑翔翼',id:10,isselected:0},
    {icon:require('../../res/image/data/chonglang.png'),title:'冲浪',id:11,isselected:0},
    {icon:require('../../res/image/data/paobu.png'),title:'跑酷',id:12,isselected:0},
    {icon:require('../../res/image/data/tiaosan.png'),title:'跳伞',id:13,isselected:0},
    {icon:require('../../res/image/data/minzu.png'),title:'少数民族',id:14,isselected:0},
    {icon:require('../../res/image/data/yishu.png'),title:'本土文化',id:15,isselected:0},
]
const  resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'TabNav'})
    ]
});
export  default  class Hobby extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            hobbyList:[]
        }
    }
    getHobby(i,id){

    }
    render(){
        const hobbyList=[];
        for(let i=0;i<data.length;i++){
            hobbyList.push(
                <TouchableHighlight
                    style={[styles.hobbyListLi,{backgroundColor:'#f5f5f5',marginLeft:(i+1)%2==0?15:0}]}
                    underlayColor='rgba(0,0,0,.1)'
                    onPress={() =>{this.getHobby(i,data[i].id)}}
                >
                <View key={i} style={[commonStyle.flexContent,commonStyle.flexSpace]}>
                    <View style={[styles.hobbyLeftView,{justifyContent:'space-between',alignItems:'center'}]}>
                        <Image source={data[i].icon} style={{marginTop:10}}/>
                        <Text style={{marginBottom:12,color:'#333333'}}>{data[i].title}</Text>
                    </View>
                    <View style={[styles.hobbyRightView,commonStyle.flexBottom]}>
                        <AntDesign
                            name="checkcircle"
                            size={16}
                            style={{color:"#999999",marginBottom:10}}
                        />
                    </View>
                </View>
                </TouchableHighlight>
            )
        }
        return(
            <SafeAreaView style={[commonStyle.flexContent,commonStyle.flexCenter]}>
                <View style={[commonStyle.flexContent,commonStyle.contentViewWidth,{position:'relative'}]}>
                    <View style={[styles.hobbyPass,commonStyle.flexEnd]}>
                        <View style={[styles.hobbyPassBtn,commonStyle.commonBorderStyle,commonStyle.flexCenter]}>
                            <Text style={styles.hobbyPassText} onPress={() =>{this.props.navigation.dispatch(resetAction)}}>跳过</Text>
                        </View>
                    </View>
                    <View style={[styles.GuidelanguageView,commonStyle.flexStart]}>
                        <Text style={styles.GuidelanguageText}>请选择您的爱好</Text>
                    </View>
                    <ScrollView style={{width:'100%'}}>
                        <View style={[{width:'100%',flexWrap:'wrap',marginBottom:70},commonStyle.flexStart]}>
                            {hobbyList}
                        </View>
                    </ScrollView>

                    <View style={[commonStyle.flexCenter,styles.guideBottomContent]}>
                        <View style={[styles.guideBottomView,commonStyle.flexCenter,{backgroundColor:'#4db6ac',borderRadius:25}]}>
                            <TouchableHighlight
                                style={[styles.guideBottomView,commonStyle.flexCenter,{borderRadius:25}]}
                                underlayColor='rgba(0,0,0,.1)'
                                onPress={() =>{this.props.navigation.dispatch(resetAction)}}
                            >
                                <Text style={styles.guideBottomText}>确定</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const styles=StyleSheet.create({
    hobbyPass:{
        width:"100%",
        height:40
    },
    hobbyPassBtn:{
        width:40,
        height:20
    },
    hobbyPassText:{
        color:'#999999',
        fontSize:14
    },
    GuidelanguageView:{
        width:'100%',
        height:30
    },
    GuidelanguageText:{
        color:'#333333',
        fontSize:16
    },
    guideBottomContent:{
      position:'absolute',
      bottom:0,
      left:0,
      right:0,
      height:55
    },
    guideBottomView:{
        width:widthScreen*0.8,
        height:45
    },
    guideBottomText:{
        color:'#fff',
        fontSize:16
    },
    hobbyListLi:{
        width:(widthScreen*0.94-15)/2,
        height:110,
        borderRadius: 5,
        marginTop:15
    },
    hobbyLeftView:{
        width:((widthScreen*0.94-15)/2)*0.8,
        height:110
    },
    hobbyRightView:{
        width:((widthScreen*0.94-15)/2)*0.2,
        height:110
    }
})

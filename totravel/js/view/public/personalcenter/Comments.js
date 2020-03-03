import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions, FlatList,
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import LazyImage from "animated-lazy-image";
import AntDesign from "react-native-vector-icons/AntDesign";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const data=[
    {
        headImage:'https://n1-q.mafengwo.net/s15/M00/41/9B/CoUBGV3Ce8SAEWVbABSSpdCZhu8554.jpg?imageMogr2%2Fstrip',
        name:'郑凯元',
        time:'2020-1-13',
        praiseNum:22,
        content:'洗洗休息下',
        backNum:14
    },
    {
        headImage:'https://p1-q.mafengwo.net/s15/M00/2D/0B/CoUBGV3MDoOANx7vAArrdO-ryho51.jpeg?imageMogr2%2Fstrip',
        name:'刘亦菲',
        time:'2020-1-13',
        praiseNum:22,
        content:'欢迎下次再来哦～',
        backNum:0
    },
    {
        headImage:'https://p1-q.mafengwo.net/s15/M00/D1/2B/CoUBGV3DrquAFChlAAit0UYH5TU218.jpg?imageMogr2%2Fstrip',
        name:'古天乐',
        time:'2020-1-13',
        praiseNum:22,
        content:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
        backNum:0
    }
]
export  default  class Comments extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        let comments=[];
        for (let i=0;i<data.length;i++){
            comments.push(
                <View style={{width:'100%',paddingBottom:15,borderBottomColor:'#f5f5f5',borderBottomWidth:1,marginTop:15}}>
                    <View style={[commonStyle.flexSpace]}>
                        <View style={commonStyle.flexStart}>
                            <LazyImage
                                source={{uri:data[i].headImage}}
                                style={{width:40,height:40,borderRadius:20}}
                            />
                            <View style={{justifyContent:'space-between',alignItems:'flex-start',height:40,marginLeft:5}}>
                                <Text style={{color:'#4db6ac',fontSize:16,fontWeight: "bold"}}>{data[i].name}</Text>
                                <Text style={{color:'#999999',fontSize:12}}>{data[i].time}</Text>
                            </View>
                        </View>
                        <View style={commonStyle.flexEnd}>
                            <Text style={{color:'#999999',marginRight:5}}>13</Text>
                            <AntDesign
                                name="like2"
                                size={15}
                                style={{color:'#999999'}}
                            />
                        </View>
                    </View>
                    <Text style={{color:'#666666',marginTop:15,fontSize:16}}>
                        {data[i].content}
                    </Text>
                    {
                        data[i].backNum
                            ?
                            <Text style={{marginTop:12,fontSize:12,color:'#4db6ac'}}>共{data[i].backNum}条回复 》</Text>
                            :
                            null
                    }

                </View>
            )
        }
        return(
            <View style={{width:'100%',marginBottom:30}}>
                {comments}
            </View>
        )
    }
}
const styles = StyleSheet.create({

})

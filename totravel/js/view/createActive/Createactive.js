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
import commonStyle from "../../../res/js/Commonstyle"
import Swiper from "react-native-swiper";
import AntDesign from "react-native-vector-icons/AntDesign";
import Language from "./Language"
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const stepList=['语言','类别','介绍','内容','提供','标题','照片','地点','时间','住宿','事项','设置','包场','志愿者']
export  default  class Createactive extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            stepIndex:0
        }
    }
    onScrollBeginDrag(){

    }
    onMomentumScrollEnd(){

    }
    onIndexChanged(index){
        this.setState({
            stepIndex:index
        })

    }
    render(){
        return(
            <View style={{flex:1,position:'relative'}}>
                <View style={styles.createRight}>
                    <SafeAreaView style={[styles.createRight,{justifyContent:'space-between', alignItems:'flex-end',}]}>
                        {
                            stepList.map((item,index)=>{
                                return <Text style={{
                                    color:this.state.stepIndex==index?'#4db6ac':'#999',
                                    fontWeight: this.state.stepIndex==index?'bold':'normal',
                                    fontSize:12
                                }} onPress={()=>{this.onIndexChanged(index)}}>{item}</Text>
                            })
                        }
                    </SafeAreaView>
                </View>
                <Swiper
                    onScrollBeginDrag={()=>this.onScrollBeginDrag()}
                    onMomentumScrollEnd={()=>this.onMomentumScrollEnd()}
                    showsButtons={false}
                    showsPagination={false}
                    horizontal={false}
                    onIndexChanged={(index)=>{this.onIndexChanged(index)}}
                    index={this.state.stepIndex}
                >
                    <View style={{flex:1}}>
                        <Language />
                    </View>
                </Swiper>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    createRight:{
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        zIndex:10
    },
    createTop:{
        position:'absolute',
        left:0,
        top:0,
        right:0,
        zIndex:5
    }
})

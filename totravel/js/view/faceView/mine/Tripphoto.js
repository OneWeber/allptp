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
import commonStyle from "../../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Tripphoto extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <View style={[styles.tripPhoto,commonStyle.commonShadow]}>
                <View style={[commonStyle.flexCenter,{width:widthScreen*0.94-30,marginLeft:15}]}>
                    <View style={{width:'100%'}}>
                        <Text style={styles.tripPhotoTitle}>我的旅行</Text>
                    </View>
                    <View style={[styles.tripPhotoBtn,commonStyle.flexCenter,{flexDirection:'row'}]}>
                        <AntDesign
                            name={'plus'}
                            size={24}
                            style={{color:'#fff'}}
                        />
                        <Text style={{color:'#fff',fontSize:16,marginLeft:10}}>上传照片</Text>
                    </View>
                    <Text style={{color:'lightblue',marginTop:15}}>如何用照片记录旅行？</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tripPhoto:{
        width:'100%',
        height:150,
        backgroundColor:'#fff',
        marginTop:15,
        borderRadius:10
    },
    tripPhotoTitle:{
        fontSize:16,
        color:'#333',
        fontWeight: "bold",
        marginTop:15
    },
    tripPhotoBtn:{
        width:widthScreen*0.94*0.65,
        height:50,
        backgroundColor:'#4db6ac',
        marginTop:15,
        borderRadius:25
    }
})

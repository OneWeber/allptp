import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ImageBackground
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import LazyImage from 'animated-lazy-image';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
//===========================================该组件需要判断用户上传相册的照片数为1，2或者大于3
export  default  class Photo extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <View style={{width:'100%',marginTop:25}}>
                <View style={[{width:'100%'},commonStyle.flexSpace]}>
                    <LazyImage
                        source={{uri:'https://p1-q.mafengwo.net/s15/M00/D1/2B/CoUBGV3DrquAFChlAAit0UYH5TU218.jpg?imageMogr2%2Fstrip'}}
                        style={{height:160,width:widthScreen*0.94*0.6-10,borderRadius:5}}
                    />
                    <View style={{
                        width:widthScreen*0.94*0.4,
                        height:160,
                        justifyContent:'space-between',
                        alignItems:'center'
                    }}>
                        <LazyImage
                            source={{uri:'https://p1-q.mafengwo.net/s15/M00/2D/0B/CoUBGV3MDoOANx7vAArrdO-ryho51.jpeg?imageMogr2%2Fstrip'}}
                            style={{height:90,width:widthScreen*0.94*0.4,borderRadius:5}}
                        />
                        <View style={{height:60,width:widthScreen*0.94*0.4,borderRadius:5,overflow:'hidden'}}>
                        <ImageBackground
                            source={{uri:'https://n1-q.mafengwo.net/s15/M00/40/99/CoUBGV3Sb2WAM4fjAAkkmHH50Ac300.jpg?imageMogr2%2Fstrip'}}
                            style={{height:60,width:widthScreen*0.94*0.4,borderRadius:5}}
                        >
                            <View style={[commonStyle.flexCenter,{flex:1,backgroundColor:'rgba(0,0,0,.4)'}]}>
                                <Text style={{color:'#f5f5f5',fontSize:20}}>
                                    + 13
                                </Text>
                            </View>
                        </ImageBackground>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({

})

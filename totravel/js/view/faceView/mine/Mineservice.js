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
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const data=[
    {
        icon:'',

    }
]
export  default  class Mineservice extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <View style={[styles.Mineservice]}>
                <View style={[commonStyle.flexCenter,{width:widthScreen*0.94-30,marginLeft:15}]}>
                    <View style={{width:'100%'}}>
                        <Text style={styles.mineserviceTitle}>更多</Text>
                    </View>

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    Mineservice:{
        width:'100%',
        backgroundColor:'#fff',
        marginTop:15,
        borderRadius:10,
        paddingBottom:15,
    },
    mineserviceTitle:{
        fontSize:16,
        color:'#333',
        fontWeight: "bold",
        marginTop:15
    }
})

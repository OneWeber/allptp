import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import commonStyle from "../../res/js/Commonstyle"
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Loadingview extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <View style={commonStyle.flexCenter}>
                <View style={[commonStyle.flexCenter]}>
                    <ActivityIndicator color="#999" size="small" />
                    <Text style={{fontSize:16,color:'#999',marginTop:10,fontWeight: "bold"}}>人人耍</Text>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({

})

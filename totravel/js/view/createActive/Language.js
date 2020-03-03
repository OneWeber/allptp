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
import AntDesign from "react-native-vector-icons/AntDesign";
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Language extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <View style={{flex:1}}>
                <View style={[{marginTop:44}]}>
                    <View style={[commonStyle.flexSpace,{height:50}]}>
                        <AntDesign
                            name={'left'}
                            size={24}
                            style={{color:'#333',marginLeft:widthScreen*0.03,width:40}}
                            onPress={()=>this.props.navigation.goBack()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({

})

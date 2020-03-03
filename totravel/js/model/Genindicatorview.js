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
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const data=["已登上华山顶峰！",'已到达亚丁！','稻草已是金黄色！']
export  default  class Genindicatorview extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            dIndex:0
        }
    }
    componentWillMount(): void {
        this.setState({
            dIndex:Math.ceil(Math.random()*3)
        })
    }
    componentWillUnmount(): void {
        this.setState({
            dIndex:0
        })
    }

    render(){
        return(
            <View style={{width:widthScreen,alignItems: 'center',justifyContent: 'center'}}>
                <Text style={{paddingTop:3,paddingBottom:3,paddingLeft:5,paddingRight:5,backgroundColor:"#fff",marginTop:-10,fontSize:12,color:"#999"}}>
                   {
                       data[this.state.dIndex]
                   }
                </Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({

})

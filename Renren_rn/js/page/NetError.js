import React,{Component} from 'react';
import CommonStyle from '../../assets/css/Common_css';
import {Image, Text, View} from 'react-native';
export default class NetError extends Component{
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                position:'absolute',
                left: 0,
                right:0,
                bottom: 0,
                top:0,
                backgroundColor: '#fff',
                zIndex: 999
            }]}>
                <Image
                    source={require('../../assets/images/que/wwl.png')}
                    style={{width:180,height:180}}
                />
                <Text style={{color:'#666',marginTop:30}}>当前无网络连接，<Text style={{color:'#14c5ca'}}>请重试</Text></Text>
            </View>
        )
    }
}

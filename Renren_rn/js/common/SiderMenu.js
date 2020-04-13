import React,{Component} from 'react';
import {View, Text} from 'react-native'
import CommonStyle from '../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
export default class SiderMenu extends Component{
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                height:40,
            }]}>
                <View style={[CommonStyle.commonWidth,CommonStyle.flexEnd,{
                    height:40
                }]}>
                    <AntDesign
                        name="bars"
                        size={22}
                        style={{color:'#999'}}
                        onPress={()=>this.props.clickIcon()}
                    />
                </View>
            </View>
        )
    }
}

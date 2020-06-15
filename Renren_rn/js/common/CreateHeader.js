import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../assets/css/Common_css';
const {width} = Dimensions.get('window')
export default class CreateHeader extends Component{
    getLeftButton(){
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                this.props.navigation.goBack()
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    getRightButton() {
        return <TouchableOpacity style={{
            paddingRight: width*0.03
        }}
        onPress={() => {
            NavigatorUtils.goPage({}, 'CreateActive')
        }}
        >
            <Text style={{color:'#333'}}>退出</Text>
        </TouchableOpacity>
    }
    render(){
        return(
            <View>
                <RNEasyTopNavBar
                    title={this.props.title}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
            </View>
        )
    }
}

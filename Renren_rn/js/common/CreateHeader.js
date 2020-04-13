import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../assets/css/Common_css';

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
    render(){
        return(
            <View>
                <RNEasyTopNavBar
                    title={this.props.title}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
            </View>
        )
    }
}

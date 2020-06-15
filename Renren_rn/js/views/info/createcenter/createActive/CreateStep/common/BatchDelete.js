import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScrollViewTab from './ScrollViewTab';
const {width} = Dimensions.get('window')
export default class BatchDelete extends Component{
    getLeftButton(){
        return <View style={CommonStyle.flexStart}>
            <TouchableOpacity
                style={CommonStyle.back_icon}
                onPress={() =>{
                    NavigatorUtils.backToUp(this.props)
                }}
            >
                <AntDesign
                    name={'left'}
                    size={20}
                />
            </TouchableOpacity>
        </View>

    }
    getRightButton() {
        return <TouchableOpacity style={{paddingRight: width*0.03}}>
            <Text style={{color:'#666',fontSize: 16}}>删除全部</Text>
        </TouchableOpacity>
    }
    render(){
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'批量处理'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <View style={[CommonStyle.spaceRow,{
                    height: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f5f5f5'
                }]}>
                    <View style={[CommonStyle.flexCenter,{
                        width: 100
                    }]}>
                        <Text>时间段</Text>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        width: width-100
                    }]}>
                        <Text>体验日期</Text>
                    </View>
                </View>
                <ScrollViewTab />


            </View>
        )
    }
}

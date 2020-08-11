import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../assets/css/Common_css';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextInput from './TextInput';
const {width} = Dimensions.get('window');
export default class Dispute extends Component{
    getLeftButton(){
        return <TouchableOpacity
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
    }
    render(){
        return(
            <View style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>
                <RNEasyTopNavBar
                    title={'提交纠纷'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={[CommonStyle.commonWidth,{
                        marginLeft: width*0.03
                    }]}>
                        <Text style={styles.main_title}>纠纷理由:</Text>
                        <Text style={styles.main_title}>其他原因:</Text>

                        <Text style={styles.main_title}>您的意见:</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main_title: {
        color: '#333',
        fontWeight: 'bold',
        marginTop: 20
    },
    main_textintput: {

    }
})

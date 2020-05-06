import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
const {width, height} = Dimensions.get('window')
export default class Setting extends Component{
    getLeftButton() {
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
    render() {
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'设置'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#f5f5f5'
                    }}
                />
                <ScrollView>
                    <TouchableOpacity
                        style={[CommonStyle.spaceRow,styles.setting_item]}
                        onPress={() => {
                            NavigatorUtils.goPage({},'MainTheme')
                        }}
                    >
                        <Text style={styles.setting_title}>主题颜色</Text>
                        <AntDesign
                            name={'right'}
                            size={16}
                            style={{color:'#999'}}
                        />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setting_item: {
        height: 55,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        paddingLeft: width*0.03,
        paddingRight: width*0.03
    },
    setting_title: {
        color:'#333',
        fontSize: 16
    }
})

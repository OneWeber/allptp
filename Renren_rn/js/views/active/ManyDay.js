import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('window')
export default class ManyDay extends Component{
    constructor(props) {
        super(props);
        this.days=['日','一','二','三','四','五','六']
    }
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
        let Day = <View style={CommonStyle.flexCenter}>
            <View style={[CommonStyle.flexStart,CommonStyle.commonWidth]}>
                {this.days.map((item, index) => {
                    return <View style={[styles.day_item,CommonStyle.flexCenter,{
                        marginLeft:index===0?0:10
                    }]}>
                        <Text style={{color: '#333',fontWeight: 'bold', fontSize: 16}}>{item}</Text>
                    </View>
                })}
            </View>
        </View>
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1,backgroundColor:'#fff',justifyContent:'flex-start',position: 'relative'}]}>
                <RNEasyTopNavBar
                    title={'多天体验'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {Day}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    day_item:{
        width:(width*0.94 - 60) / 7,
        height: 40
    },
    back_icon: {
        paddingLeft: width*0.03
    },
    year_title:{
        fontWeight:'bold',
        color: '#333',
        fontSize: 16,
        marginTop: 20
    },

    day_one:{
        marginTop: 10,
        width:(width*0.94-60)/7,
        borderRadius:(width*0.94-60)/7/2,
        position:'relative',
        height: (width*0.94-60)/7
    },
    day_txt:{
        fontWeight: "bold"
    },
    slot_modal:{
        position:'absolute',
        left: 0,
        right: 0,
        bottom:0,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        minHeight: 150,
        maxHeight: 400
    },
    select_btn: {
        width: 75,
        height: 40,
        borderRadius: 3
    }
})

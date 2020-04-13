import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {exp} from 'react-native-reanimated';
const widthScreen = Dimensions.get('window').width;
const CommonStyle = StyleSheet.create({
    spaceCol: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spaceRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    flexStart: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    flexEnd: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    flexCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    commonWidth: {
        width: widthScreen*0.94
    },
    back_icon: {
        paddingLeft: widthScreen*0.03
    },
    bot_btn:{
        position: 'absolute',
        left:0,
        right:0,
        bottom:0,
        backgroundColor:'#fff'
    },
    btn:{
        width:'100%',
        height:36,
        borderRadius: 6
    },
    long_input:{
        width: widthScreen*0.94,
        minHeight:50,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        textAlignVertical:'top',
        marginTop: 15,
        color:'#666',
        fontSize: 16,
        paddingBottom: 10
    }
})
export default CommonStyle

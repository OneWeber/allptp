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
})
export default CommonStyle

import React, {Component} from 'react';
import { StyleSheet,Dimensions } from 'react-native';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const commonStyle = StyleSheet.create({
    flexContent:{
        flex:1,
    },
    flexStart:{
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row'
    },
    contentViewWidth:{
      width:widthScreen*0.94
    },
    flexTop:{
        justifyContent:'flex-start',
        alignItems:'center'
    },
    flexCenter:{
        justifyContent:'center',
        alignItems:'center'
    },
    flexEnd:{
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection:'row'
    },
    flexSpace:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    flexWidth:{
        width:widthScreen
    },
    flexHeight:{
        height:heightScreen
    },
    commonBorderStyle:{
        borderWidth:1,
        borderColor:'#999999',
        borderRadius:3
    },
    commonShadow:{
        shadowColor: '#000000',
        shadowOffset: {width: 1, height: 0},
        shadowRadius: 2,
        shadowOpacity: 0.2,
    },
    flexBottom:{
        justifyContent:'flex-end',
        alignItems:'center'
    }
})
export default commonStyle;

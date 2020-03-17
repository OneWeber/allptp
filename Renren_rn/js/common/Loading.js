import React, {Component} from 'react';
import  {StyleSheet, View, Text,ActivityIndicator} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
export default class Loading extends Component{
    render(){
        return(
            <View style={[CommonStyle.flexCenter]}>
                <ActivityIndicator
                    size={'small'}
                    style={{marginTop: 30,marginBottom: 15}}
                />
            </View>
        )
    }
}

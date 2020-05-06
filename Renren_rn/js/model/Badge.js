import React,{Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {PropTypes} from 'prop-types'
import CommonStyle from '../../assets/css/Common_css';
export default class Badge extends Component{
    static defaultProps = {
        width: 17,
        height: 17,
        borderRadius: 8.5,
        backgroundColor: '#ff5353',
        num: 0
    }
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                width: this.props.width,
                height: this.props.height,
                borderRadius: this.props.borderRadius,
                backgroundColor: this.props.backgroundColor
            }]}>
                <Text style={{
                    color:'#fff',
                    fontSize: 12
                }}>{this.props.num}</Text>
            </View>
        )
    }
}

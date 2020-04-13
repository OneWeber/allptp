import React,{Component} from 'react';
import {StyleSheet, View, Text} from 'react-native'
import {PropTyps} from 'prop-types'
export default class Prompt extends Component{
    static defaultProps = {
        marginTopNum: 10
    }
    render(){
        return <View style={{
            width:'100%',
            paddingLeft:14.5,
            paddingRight:14.5,
            paddingTop: 20,
            paddingBottom:20,
            backgroundColor:'#f5f5f5',
            borderRadius: 6,
            marginTop:this.props.marginTopNum
        }}>
            {
                this.props.data.map((item, index) => {
                    return <View key={index} style={{
                        marginTop:index===0?0:13
                    }}>
                        <Text style={{
                            color:'#333',
                            fontSize:14
                        }}>{item}</Text>
                    </View>
                })
            }
        </View>
    }
}

import React, {Component} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Tooltip } from 'react-native-elements';
const {width,} = Dimensions.get('window');
export default class Sort extends Component{
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                height:40
            }]}>
                <View style={[CommonStyle.commonWidth,CommonStyle.flexEnd,{
                    height: 40
                }]}>
                    <TouchableOpacity style={CommonStyle.flexStart}>
                        <Text style={{color:'#999'}}>排序</Text>
                        <AntDesign
                            name={'caretdown'}
                            size={10}
                            style={{color:'#999'}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tou_items: {
        paddingTop: 15,
        paddingBottom: 15
    }
})

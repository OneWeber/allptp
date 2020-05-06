import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import LazyImage from "animated-lazy-image";
import {connect} from 'react-redux'
import Process from '../model/Process';
import NavigatorUtils from '../navigator/NavigatorUtils';
const widthScreen = Dimensions.get('window').width;
class OrderItem extends Component{
    render(){
        const {data_o, theme, data_index} = this.props
        return (
            <TouchableOpacity
                style={[CommonStyle.commonWidth,styles.orderItemCon,{marginTop:data_index===0?0:10}]}
            >
                <View>
                    <View style={[CommonStyle.spaceRow]}>
                        <LazyImage
                            source={data_o.cover && data_o.cover.domain?
                                {uri:data_o.cover.domain + data_o.cover.image_url}
                                :require('../../assets/images/error.png')
                            }
                            style={styles.img}
                        />
                        <View style={[styles.o_con,CommonStyle.spaceCol,{alignItems:'flex-start'}]}>
                            <Text numberOfLines={2} ellipsizeMode={'tail'}
                                  style={styles.o_title}>{data_o.title}</Text>
                            <Text style={styles.o_join}>3人参与，共计<Text style={{color: theme}}>¥189</Text></Text>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexEnd, {marginTop: 15}]}>
                        <View style={[styles.o_prompt_con, CommonStyle.spaceRow,{alignItems:'flex-start'}]}>
                            <View style={{width: 80}}>
                                <Process
                                    borderRadius={10}
                                    height={12}
                                />
                            </View>
                            <View style={styles.p_con}>
                                <Text style={[styles.p_txt,{color:theme}]}>同时将已参与8人，体验结束满10人退支付10%</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    orderItemCon:{
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 3,
        elevation: 2,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 3
    },
    img:{
        width: 90,
        height: 67.5,
        borderRadius: 3
    },
    o_con:{
        width: widthScreen*0.94 - 100 -20,
        height: 67.5,
    },
    o_prompt_con:{
        width: widthScreen*0.94 - 100 -20,
    },
    o_title: {
        color: '#333',
        fontWeight: "bold"
    },
    o_join:{
        fontSize:12,
        fontWeight: "bold"
    },
    p_con: {
        width: widthScreen*0.94 - 100 - 20 - 85
    },
    p_txt:{
        fontSize: 12,
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(OrderItem)

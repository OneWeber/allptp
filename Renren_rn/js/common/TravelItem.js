import React,{Component} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableHighlight} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux'
import LazyImage from "animated-lazy-image";
const widthScreen = Dimensions.get('window').width;
/*
*       borderColor: '#ddd',
        borderWidth: 0.5,
        shadowColor:'gray',
        shadowOffset:{width:0.5, height:0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
* */
class TravelItem extends Component{
    render() {
        let {data_t, theme, data_index} = this.props
        return(
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow, {position:'relative',marginTop:data_index===0?15:0}]}>
                <View style={[styles.line]}></View>
                <View>
                    <View style={[styles.action_con,CommonStyle.flexStart]}>
                        <Text style={styles.action_time}>{data_t.activ_begin_time}</Text>
                    </View>
                    <View style={[styles.line_con]}>
                        <Text style={styles.author}>策划人: {
                            data_t.act_user
                            ?
                                data_t.act_user.family_name + data_t.act_user.middle_name + data_t.act_user.name
                            :
                                '匿名用户'
                        }</Text>
                        <TouchableHighlight
                            style={{marginTop: 10}}
                            underlayColor='rgba(0,0,0,0)'
                            onPress={() =>{}}
                        >
                            <View style={[CommonStyle.spaceRow,{alignItems:'flex-start'}]}>
                                <LazyImage
                                    source={data_t.cover&&data_t.cover.domain&&data_t.cover.image_url?
                                        {uri:data_t.cover.domain + data_t.cover.image_url}
                                        :require('../../assets/images/error.jpeg')
                                    }
                                    style={styles.t_img}
                                />
                                <View style={[styles.t_con, CommonStyle.spaceCol,{alignItems:'flex-start'}]}>
                                    <Text
                                        numberOfLines={2} ellipsizeMode={'tail'}
                                        style={styles.t_title}
                                    >{data_t.title}</Text>
                                    {
                                        data_t.total_price
                                        ?
                                            <Text style={{color: '#333',fontSize: 12, fontWeight: 'bold'}}>¥ {data_t.total_price}/人</Text>
                                        :
                                            <Text style={{color: '#999',fontSize: 12, fontWeight: 'bold'}}>已过期</Text>
                                    }

                                </View>

                            </View>
                        </TouchableHighlight>
                        <View style={[CommonStyle.flexEnd,{marginTop: 20,marginBottom: 10}]}>
                            <Text style={styles.do_t}>取消活动</Text>
                            <Text style={styles.do_t}>查看详情</Text>
                            <Text style={[styles.do_t, {color: theme}]}>联系策划人</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.line_ab]}>
                    <View style={[styles.roll_line,CommonStyle.flexCenter,{borderColor: theme}]}>
                        <View style={[styles.roll, {backgroundColor: theme}]}></View>
                    </View>
                    <View style={[styles.line_l, {backgroundColor: theme}]}></View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    line: {
        width: 20
    },
    line_con: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 3,
        borderRadius: 2,
        marginRight:3,
        elevation: 2,
        width: widthScreen*0.94 - 25,
        marginTop:15,
        marginBottom: 25,
        margin:4
    },
    line_ab:{
      position: 'absolute',
      left:0,
      top:0,
      bottom:0
    },
    roll_line:{
        width:16,
        height:16,
        borderRadius: 8,
        borderWidth: 1
    },
    roll: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    line_l: {
        position: 'absolute',
        left:7.5,
        top:16,
        bottom: 0,
        width: 1,
        zIndex: 10
    },
    action_time:{
        color: '#333',
        marginLeft: 4
    },
    action_con:{
        height: 16
    },
    author:{
        fontWeight:'bold',
        color: '#333'
    },
    t_img:{
        width: 90,
        height: 67.5,
        borderRadius: 3
    },
    t_con:{
        width: widthScreen*0.94 - 25 - 120,
        height: 67.5
    },
    right_con:{

    },
    t_title:{
        color: '#333',
        fontWeight: "bold"
    },
    do_t:{
        fontSize: 13,
        marginLeft: 8,
        color: '#666'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(TravelItem)

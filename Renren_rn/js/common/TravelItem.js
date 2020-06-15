import React,{Component} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux'
import LazyImage from "animated-lazy-image";
import languageType from '../json/languageType'
import NavigatorUtils from '../navigator/NavigatorUtils';
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
    goDetail(table_id) {
        NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
    }
    render() {
        let {data_t, theme, data_index,language} = this.props
        return(
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow, {position:'relative',marginTop:data_index===0?15:0}]}>
                <View style={[styles.line]}></View>
                <View>
                    <View style={[styles.action_con,CommonStyle.flexStart]}>
                        <Text style={styles.action_time}>{data_t.activ_begin_time}</Text>
                    </View>
                    <View style={[styles.line_con]}>
                        <View>
                            <LazyImage
                                source={data_t.cover&&data_t.cover.domain&&data_t.cover.image_url?
                                    {uri:data_t.cover.domain + data_t.cover.image_url}
                                    :require('../../assets/images/error.png')
                                }
                                style={styles.t_img}
                            />
                            <Text
                                numberOfLines={2} ellipsizeMode={'tail'}
                                style={styles.t_title}
                            >{data_t.title}</Text>
                            <Text style={styles.author}>{
                                language===1
                                    ?
                                    languageType.CH.journey.planner
                                    :
                                    language===2
                                        ?
                                        languageType.EN.journey.planner
                                        :
                                        languageType.JA.journey.planner
                            }: {
                                data_t.act_user
                                    ?
                                    data_t.act_user.family_name + data_t.act_user.middle_name + data_t.act_user.name
                                    :
                                    '匿名用户'
                            }</Text>
                        </View>
                        <View style={[CommonStyle.flexEnd,{marginTop: 20}]}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                paddingLeft: 10,
                                paddingRight: 10,
                                height:30,
                                borderWidth: 1,
                                borderColor:'#dfe1e4',
                                borderRadius: 4,
                            }]}
                            onPress={() => {this.goDetail(data_t.activity_id || data_t.activity_id==0?data_t.activity_id:data_t.table_id)}}
                            >
                                <Text style={styles.do_t}>
                                    {
                                        language===1
                                        ?
                                            languageType.CH.journey.check_detail
                                        :
                                        language===2
                                        ?
                                            languageType.EN.journey.check_detail
                                        :
                                            languageType.JA.journey.check_detail
                                    }
                                </Text>
                            </TouchableOpacity>
                            {
                                this.props.storeName!='已参加'
                                    ?
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        height:30,
                                        borderWidth: 1,
                                        borderColor:'#dfe1e4',
                                        borderRadius: 4,
                                        marginLeft: 30
                                    }]}>
                                        <Text style={styles.do_t}>
                                            {
                                                language===1
                                                    ?
                                                    languageType.CH.journey.contact
                                                    :
                                                    language===2
                                                        ?
                                                        languageType.EN.journey.contact
                                                        :
                                                        languageType.JA.journey.contact
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
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
        backgroundColor: '#f3f5f7',
        padding: 15,
        borderRadius: 2,
        marginRight:4,
        width: widthScreen*0.94 - 25,
        marginTop:15,
        marginBottom: 25,
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
        color: '#333',
        fontSize: 12,
        marginTop: 10
    },
    t_img:{
        width: '100%',
        height: 155,
        borderRadius: 4
    },
    t_con:{
        width: widthScreen*0.94 - 25 - 120,
        height: 67.5
    },
    right_con:{

    },
    t_title:{
        color: '#333',
        fontWeight: "bold",
        marginTop: 13
    },
    do_t:{
        fontSize: 13,
        color: '#666'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    language: state.language.language
})
export default connect(mapStateToProps)(TravelItem)

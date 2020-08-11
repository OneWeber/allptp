import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux'
import NavigatorUtils from '../navigator/NavigatorUtils';
class Ractive extends Component{
    constructor(props) {
        super(props);
    }
    goDetail(table_id) {
        NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
    }
    render(){
        const {data_r, data_index, theme, isShow} = this.props
        return(
            <TouchableOpacity
                style={[CommonStyle.commonWidth,{
                    marginTop: data_index===0?15:30,
                    marginBottom: data_index===this.props.total-1?isShow?130:25:0
                }]}
                onPress={() => {this.goDetail(data_r.activity_id || data_r.activity_id==0?data_r.activity_id:data_r.table_id)}}
            >
                <LazyImage
                    source={data_r.domain&&data_r.image_url?{
                        uri: data_r.domain + data_r.image_url
                    }:require('../../assets/images/error.png')}
                    style={[CommonStyle.commonWidth,{
                        height: 180,
                        borderRadius: 4,
                    }]}
                />
                <Text style={[styles.common_weight,{
                    color:'#127D80',
                    fontSize: 10,
                    marginTop: 9.5
                }]}>{data_r.province}{data_r.city}{data_r.region}</Text>

                <Text numberOfLines={2} ellipsizeMode={'tail'}
                      style={[styles.common_weight,styles.common_color,{
                          marginTop: 4.5,
                          marginBottom: 5
                      }]}>{data_r.title}</Text>
                <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 2}]}>
                    {
                        data_r.price_discount_concat&&data_r.price_discount_concat.split(',').length>1
                            ?
                            <View style={[styles.tab_item,{
                                backgroundColor:'#EEFFFF',
                            }]}>
                                <Text style={{
                                    fontSize: 10,
                                    color:theme
                                }}>{parseFloat(data_r.price_discount_concat.split(',')[1])}折起</Text>
                            </View>
                            :
                            null
                    }
                    {
                        data_r.is_differ
                            ?
                            <View style={[styles.tab_item,{
                                backgroundColor:'#F5F6F8',
                            }]}>
                                <Text style={{
                                    fontSize: 10,
                                    color:'#626467'
                                }}>返差价</Text>
                            </View>
                            :
                            null
                    }
                    {
                        data_r.is_combine
                            ?
                            <View style={[styles.tab_item,{
                                backgroundColor:'#F5F6F8',
                            }]}>
                                <Text style={{
                                    fontSize: 10,
                                    color:'#626467'
                                }}>含套餐</Text>
                            </View>
                            :
                            null
                    }
                </View>
                <View style={[CommonStyle.spaceRow,{marginTop: 10}]}>
                    <View style={[CommonStyle.spaceCol,{height: 40,alignItems:'flex-start'}]}>
                        <View style={[CommonStyle.flexStart]}>
                            <Image
                                source={parseFloat(data_r.score)>0?
                                    require('../../assets/images/home/pingxing.png'):
                                    require('../../assets/images/home/wpx.png')}
                                style={{width: 10,height:9.5}}
                            />
                            <Text style={[{
                                fontSize:11,marginLeft:3,
                                color:parseFloat(data_r.score)>0?'#333':'#626467',
                                fontWeight:parseFloat(data_r.score)>0?'bold':'normal',
                            }]}>{parseFloat(data_r.score)>0?data_r.score:'暂无评分'}</Text>
                            <Text style={[{color:'#626467',fontSize: 11,marginLeft: 10}]}>
                                {
                                    data_r.comment_num
                                        ?
                                        data_r.comment_num + '点评'
                                        :
                                        '暂无点评'
                                }
                            </Text>
                        </View>
                        <View>
                            {
                                data_r.price
                                    ?
                                    <Text style={[styles.common_color,styles.common_weight]}>
                                        ¥{data_r.price}<Text style={{fontSize: 11,color:'#626467',fontWeight: "normal"}}>/人起</Text>
                                    </Text>
                                    :
                                    <Text style={[{marginTop: 10,color:'#626467',fontSize: 11}]}>
                                        暂未定价或时间
                                    </Text>
                            }
                        </View>
                    </View>
                    <LazyImage
                        source={data_r.user_domain&&data_r.user_image_url?{
                            uri:data_r.user_domain+data_r.user_image_url
                        }:require('../../assets/images/touxiang.png')}
                        style={{width: 40,height:40,borderRadius: 20}}
                    />
                </View>

            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    tab_item:{
        padding: 3,
        marginRight: 15
    },
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Ractive)

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions,ImageBackground} from 'react-native';
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
            <View
                style={[CommonStyle.commonWidth,styles.orderItemCon,{marginTop:data_index===0?0:10}]}

            >
                <View>
                    <TouchableOpacity
                        onPress={()=>{
                            if(this.props.storeName==='退款') {
                                NavigatorUtils.goPage({refund_id: data_o.refund_id,order_id:data_o.order_id}, 'RefundDetail')
                            }else{
                                NavigatorUtils.goPage({order_id: data_o.order_id,storeName:this.props.storeName}, 'OrderDetail')
                            }
                        }}
                    >
                        <View style={[CommonStyle.spaceRow]}>
                            <Text style={{
                                color:'#333',
                                fontWeight: 'bold',
                            }}>策划人:{data_o.activity_user_name}</Text>
                            <Text style={{
                                color:'#333',
                                fontWeight: 'bold',
                            }}>
                                {
                                    this.props.storeName==='退款'
                                    ?
                                        data_o.audit===0?'申请中':data_o.audit===1?'已退款':'已拒绝'
                                    :
                                        this.props.storeName
                                }
                            </Text>
                        </View>
                        <View style={[CommonStyle.spaceRow,{
                            marginTop: 17
                        }]}>
                            <ImageBackground
                                source={require('../../assets/images/error.png')}
                                style={styles.img}
                            >
                                {
                                    this.props.storeName==='退款'
                                    ?
                                        <LazyImage
                                            source={data_o.domain&&data_o.image_url?
                                                {uri:data_o.domain + data_o.image_url}
                                                :require('../../assets/images/error.png')
                                            }
                                            style={styles.img}
                                        />
                                    :
                                        <LazyImage
                                            source={data_o.cover && data_o.cover.domain&&data_o.cover.image_url?
                                                {uri:data_o.cover.domain + data_o.cover.image_url}
                                                :require('../../assets/images/error.png')
                                            }
                                            style={styles.img}
                                        />
                                }

                            </ImageBackground>
                            <View style={[styles.o_con,CommonStyle.spaceCol,{alignItems:'flex-start'}]}>
                                <Text numberOfLines={2} ellipsizeMode={'tail'}
                                      style={styles.o_title}>{data_o.title}</Text>
                                {
                                    this.props.storeName==='退款'
                                    ?
                                        <Text style={{
                                            color:this.props.theme,
                                            fontSize: 13,
                                            fontWeight: 'bold'
                                        }}>
                                            {data_o.audit===0?'申请退款金额:':'退款金额:'}¥{data_o.total_price}
                                        </Text>
                                    :
                                        <Text style={styles.o_join}>{data_o.num}人参与，共计<Text style={{fontWeight: 'bold'}}>¥{data_o.total_price}</Text></Text>
                                }
                            </View>
                        </View>
                        {
                            data_o.no_reach_differ.length ===0 && data_o.reach_differ.length ===0
                            ?
                                null
                            :
                                <View style={[CommonStyle.flexStart, {
                                    marginTop: 22,
                                    paddingBottom: 15,
                                    borderBottomColor: '#f5f5f5',
                                    borderBottomWidt: 1
                                }]}>
                                    {
                                        this.props.storeName!=='退款'
                                            ?
                                            data_o.no_reach_differ.length ===0 && data_o.reach_differ.length ===0
                                                ?
                                                <Text style={{
                                                    color:'#838383',
                                                    fontSize: 12
                                                }}>
                                                    【返差价】当前没有关于返差价的信息
                                                </Text>
                                                :
                                                <Text style={{
                                                    color:'#838383',
                                                    fontSize: 12
                                                }}>
                                                    【返差价】当前同时时间其他用户已参与{data_o.order_effect_num}人，
                                                </Text>
                                            :
                                            null
                                    }

                                </View>
                        }

                    </TouchableOpacity>
                    {
                        this.props.storeName==='已完成'
                        ?
                            <View style={[CommonStyle.flexEnd,{
                                marginTop: 10
                            }]}>
                                {
                                    this.props.storeName==='已完成'
                                        ?
                                        data_o.isevaluate===1
                                            ?
                                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                                width: 75,
                                                height: 30,
                                                borderWidth: 1,
                                                borderColor: this.props.theme,
                                                borderRadius: 15
                                            }]}
                                              onPress={()=>{
                                                  NavigatorUtils.goPage({
                                                      table_id: data_o.activity_id,
                                                      flag: 1,
                                                      t_id: data_o.activity_id,
                                                      order_id: data_o.order_id,
                                                      refresh:() => {
                                                          this.props.initData()
                                                      }
                                                  }, 'TextInput')
                                              }}
                                            >
                                                <Text style={{color:this.props.theme,fontSize: 12}}>
                                                    去评价
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            <View style={[CommonStyle.flexCenter,{
                                                width: 75,
                                                height: 30,
                                                borderWidth: 1,
                                                borderColor: '#999',
                                                borderRadius: 15
                                            }]}>
                                                <Text style={{color:'#999',fontSize: 12}}>
                                                    已评价
                                                </Text>
                                            </View>
                                        :
                                        null
                                }

                            </View>
                        :
                            null
                    }

                </View>
            </View>
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
        height: 70,
        borderRadius: 3
    },
    o_con:{
        width: widthScreen*0.94 - 100 -20,
        height: 70,
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
        color:'#333'
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

import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Linking} from 'react-native';
import {connect} from 'react-redux';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import LazyImage from 'animated-lazy-image';
import Entypo from 'react-native-vector-icons/Entypo'
class InitiativeRefundDetail extends Component{
    constructor(props) {
        super(props);
        this.order_id = this.props.navigation.state.params.order_id;
        this.state = {
            orderInfo: '',
            refundHouse: []
        }
    }
    componentWillMount(){
        this.loadData();
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('order_id', this.order_id);
        Fetch.post(NewHttp+'OrderDTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    orderInfo: res.data
                },() => {
                    let {orderInfo} = this.state;
                    let refundHouseList = [];
                    for(let i=0;i<orderInfo.refund_detail.length;i++){
                        if(orderInfo.refund_detail[i].type===3) {
                            refundHouseList.push(orderInfo.refund_detail[i])
                        }
                    }
                    this.setState({
                        refundHous: refundHouseList
                    })
                })
            }
        })
    }
    render() {
        const {orderInfo} = this.state;
        return(
            <View style={{flex: 1,position: 'relative'}}>
                <SafeAreaView>
                    <View style={[CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{
                            height:50,
                        }]}>
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333'}}
                                onPress={()=>{
                                    NavigatorUtils.backToUp(this.props)
                                }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart]}>
                            <AntDesign
                                name={'checkcircle'}
                                size={30}
                                style={{color:this.props.theme}}
                            />
                            <Text style={{
                                marginLeft: 12,
                                fontSize:18,
                                fontWeight: 'bold',
                                color:'#333'
                            }}>
                                主动退款详情
                            </Text>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter, {
                        marginTop: 15,
                        backgroundColor: '#fff'
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height:62,
                        }]}>
                            <View style={CommonStyle.flexStart}>
                                <LazyImage
                                    source={orderInfo.user&&orderInfo.user.headimage&&orderInfo.user.headimage.domain&&orderInfo.user.headimage.image_url?{
                                        uri:orderInfo.user.headimage.domain+orderInfo.user.headimage.image_url
                                    }:require('../../../../../assets/images/touxiang.png')}
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 21
                                    }}
                                />
                                <Text style={{
                                    marginLeft: 16,
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                }}>
                                    {
                                        orderInfo.user
                                        ?
                                            orderInfo.user.family_name||orderInfo.user.middle_name||orderInfo.user.name
                                            ?
                                            <Text>
                                                {orderInfo.user.family_name?orderInfo.user.family_name+' ':''}
                                                {orderInfo.user.middle_name?orderInfo.user.middle_name+' ':''}
                                                {orderInfo.user.name?orderInfo.user.name:''}
                                            </Text>
                                           :
                                                '匿名用户'
                                            :
                                            '匿名用户'
                                    }
                                </Text>
                            </View>
                            <Entypo
                                name={'phone'}
                                size={20}
                                style={{color:'#333'}}
                                onPress={() => {
                                    Linking.openURL('tel:'+orderInfo.user.mobile)
                                }}
                            />
                        </View>
                    </View>
                    {/*退款方式*/}
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                            height: 50,
                        }]}>
                            <Text style={[styles.order_title]}>退款方式</Text>
                            <Text style={{
                                color:'#666',
                            }}>全款</Text>
                        </View>
                    </View>
                    {/*退订套餐及人数*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={[styles.order_title]}>退订套餐及人数</Text>
                            {
                                orderInfo.refund_detail&&orderInfo.refund_detail.length>0
                                ?
                                    <View>
                                        {
                                            orderInfo.refund_detail.map((item, index) => {
                                                return <View key={index} style={[CommonStyle.spaceRow,{
                                                    marginTop: index===0?19:14
                                                }]}>
                                                    <Text style={{color:'#666',fontSize: 13}}>
                                                        {item.type===1?'亲子':item.type===2?item.name:''}
                                                        {
                                                            item.type===1
                                                                ?
                                                                item.adult+'成人'+item.kids+'儿童'
                                                                :
                                                                item.type===2
                                                            ?
                                                                item.adult+'人'
                                                            :
                                                                (item.adult?item.adult+'标准':'')+(item.kids?item.kids+'儿童':'')
                                                        }
                                                    </Text>
                                                    <Text style={{color:'#333',fontSize: 13}}>¥{parseFloat(item.price)}</Text>
                                                </View>
                                            })
                                        }
                                    </View>
                                :
                                    <View style={[CommonStyle.flexCenter,{
                                        marginTop:15
                                    }]}>
                                        <Text style={{
                                            color:'#999'
                                        }}>暂无相关数据</Text>
                                    </View>
                            }
                        </View>
                    </View>
                    {/*退订住宿*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={[styles.order_title]}>退订住宿</Text>
                            {
                                this.state.refundHouse.length>0
                                ?
                                    <View></View>
                                :
                                    <View style={[CommonStyle.flexCenter,{
                                        marginTop:15
                                    }]}>
                                        <Text style={{
                                            color:'#999'
                                        }}>暂无相关数据</Text>
                                    </View>
                            }
                        </View>
                    </View>
                    {/*退订住宿*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={[styles.order_title]}>其他原因</Text>
                            <Text style={{
                                color:'#666',
                                marginTop: 20
                            }}>无</Text>
                        </View>
                    </View>
                    {/*总退款金额*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        backgroundColor:'#fff'
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height:50,
                        }]}>
                            <Text style={[styles.order_title]}>总退款金额</Text>
                            <Text style={{
                                color:'#F12B2B'
                            }}>¥{parseFloat(orderInfo.refund_total_price)}</Text>
                        </View>
                    </View>
                    {/*其他注释*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        marginBottom: 100
                    }]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <View style={[CommonStyle.spaceRow,{marginTop: 10}]}>
                                <Text style={{color:'#666',fontSize: 12}}>下单时间</Text>
                                <Text style={{color:'#666',fontSize: 12}}>{orderInfo.pay_time}</Text>
                            </View>
                            <View style={[CommonStyle.spaceRow,{marginTop: 10}]}>
                                <Text style={{color:'#666',fontSize: 12}}>订单编号</Text>
                                <Text style={{color:'#666',fontSize: 12}}>{orderInfo.order_no}</Text>
                            </View>
                            <View style={[CommonStyle.spaceRow,{marginTop: 10}]}>
                                <Text style={{color:'#666',fontSize: 12}}>基金退款</Text>
                                <Text style={{color:'#666',fontSize: 12}}>{orderInfo.refund_balance}</Text>
                            </View>
                            <View style={[CommonStyle.spaceRow,{marginTop: 10}]}>
                                <Text style={{color:'#666',fontSize: 12}}>其他支付方式退款</Text>
                                <Text style={{color:'#666',fontSize: 12}}>{orderInfo.refund_pay_price}</Text>
                            </View>

                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView style={{
                    position:'absolute',
                    left:0,
                    right:0,
                    bottom:0,
                    backgroundColor: '#fff'
                }}>
                    <View style={[CommonStyle.flexCenter,{
                        height:50,
                    }]}>
                        <Text style={{color:'#F12B2B'}}>已主动退款</Text>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    order_title: {
        color: '#333',
        fontSize: 15,
        fontWeight: 'bold'
    }
})
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(InitiativeRefundDetail)

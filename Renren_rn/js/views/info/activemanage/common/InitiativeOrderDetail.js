import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Linking, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import LazyImage from 'animated-lazy-image';
import Entypo from 'react-native-vector-icons/Entypo';
const {width} = Dimensions.get('window');
class InitiativeOrderDetail extends Component{
    constructor(props) {
        super(props);
        this.order_id = this.props.navigation.state.params.order_id;
        this.storeName = this.props.navigation.state.params.storeName;
        this.state = {
            orderInfo: ''
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
                })
            }
        })
    }
    render(){
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
                                name={this.storeName==='已支付'?'checkcircle':'exclamationcircle'}
                                size={30}
                                style={{color:this.storeName==='已支付'?this.props.theme:'#999'}}
                            />
                            <Text style={{
                                marginLeft: 12,
                                fontSize:18,
                                fontWeight: 'bold',
                                color:'#333'
                            }}>
                                {this.storeName}
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
                            {
                                orderInfo.user&&orderInfo.user.mobile
                                ?
                                    <Entypo
                                        name={'phone'}
                                        size={20}
                                        style={{color:'#333'}}
                                        onPress={() => {
                                            Linking.openURL('tel:'+orderInfo.user.mobile)
                                        }}
                                    />
                                :
                                    null
                            }

                        </View>
                    </View>
                    {/*体验详情*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                            <LazyImage
                                source={orderInfo.cover&&orderInfo.cover.domain&&orderInfo.cover.image_url?{
                                    uri: orderInfo.cover.domain + orderInfo.cover.image_url
                                }:require('../../../../../assets/images/error.png')}
                                style={{
                                    width: 90,
                                    height: 60,
                                    borderRadius: 4
                                }}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                width: width*0.94-100,
                                alignItems:'flex-start',
                                height: 60
                            }]}>
                                <Text
                                    numberOfLines={2} ellipsizeMode={'tail'}
                                    style={{color:'#333',fontWeight:'bold',fontSize: 15}}
                                >
                                    {orderInfo.title}
                                </Text>
                                <Text style={{
                                    color:'#666',
                                    fontSize: 12
                                }}>¥{orderInfo.act_union_price}/人</Text>
                            </View>
                        </View>
                    </View>
                    {/*参与人数*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        backgroundColor: '#fff'
                    }]}>
                        <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                            height:50
                        }]}>
                            <Text style={styles.order_title}>参与人数</Text>
                            <Text style={{color:'#666'}}>{orderInfo.num}人</Text>
                        </View>
                    </View>
                    {/*参与时间*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <Text style={styles.order_title}>参与时间</Text>
                            <Text style={{
                                marginTop: 17,
                                color:'#666'
                            }}>{orderInfo.activ_begin_time} - {orderInfo.activ_end_time}</Text>
                        </View>
                    </View>
                    {/*参与时间*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <Text style={styles.order_title}>游客信息</Text>
                            <View style={[CommonStyle.flexStart,{
                                height:40,
                                marginTop: 15,
                                backgroundColor: '#f5f7fa',
                                borderRadius: 6,
                                paddingLeft: 14.5,
                                paddingRight: 14.5
                            }]}>
                                <Text style={{
                                    color:'#666',
                                    fontSize: 14,
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
                                <Text style={{
                                    marginLeft: 25,
                                    color:'#666'
                                }}>{orderInfo.user&&orderInfo.user.mobile?orderInfo.user.mobile:''}</Text>
                            </View>
                            {
                                orderInfo.person&&orderInfo.person.length>0
                                ?
                                    orderInfo.person.map((item, index) => {
                                        return <View key={index} style={[CommonStyle.flexStart,{
                                            height:40,
                                            marginTop: 15,
                                            backgroundColor: '#f5f7fa',
                                            borderRadius: 6,
                                            paddingLeft: 14.5,
                                            paddingRight: 14.5
                                        }]}>
                                            <Text style={{
                                                color:'#666',
                                                fontSize: 14,
                                            }}>
                                                {item.name}
                                            </Text>
                                            <Text style={{
                                                marginLeft: 25,
                                                color:'#666'
                                            }}>
                                                {item.mobile}
                                            </Text>
                                        </View>
                                    })
                                :
                                    null
                            }
                        </View>
                    </View>
                    {/*价格信息*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <Text style={styles.order_title}>价格信息</Text>
                            {
                                orderInfo.detail&&orderInfo.detail.length>0
                                    ?
                                    <View>
                                        {
                                            orderInfo.detail.map((item, index) => {
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
                    {/*住宿信息*/}
                    {
                        orderInfo.house&&orderInfo.house.length>0
                        ?
                            <View style={[CommonStyle.flexCenter,{
                                paddingTop: 16,
                                paddingBottom: 16,
                                backgroundColor:'#fff',
                                marginTop: 10
                            }]}>
                                <View style={[CommonStyle.commonWidth]}>
                                    <Text style={styles.order_title}>住宿信息</Text>
                                    {
                                        orderInfo.house.map((item, index) => {
                                            return <View key={index} style={[CommonStyle.spaceRow,{
                                                marginTop: index===0?19:14
                                            }]}>
                                                <View style={CommonStyle.flexStart}>
                                                    <Text style={{color:'#666',fontSize: 13}}>
                                                        {item.title}
                                                    </Text>
                                                    <Text style={{
                                                        color:'#666',
                                                        fontSize: 13,
                                                        marginLeft: 9
                                                    }}>
                                                        房数x{item.num}
                                                    </Text>
                                                </View>
                                                <Text style={{color:'#333',fontSize: 13}}>¥{item.price}</Text>
                                            </View>
                                        })
                                    }
                                </View>
                            </View>
                        :
                            null
                    }
                    {/*退款信息*/}
                    {
                        orderInfo.is_refund
                        ?
                            <View style={[CommonStyle.flexCenter,{
                                paddingTop: 16,
                                paddingBottom: 16,
                                backgroundColor:'#fff',
                                marginTop: 10
                            }]}>
                                <View style={[CommonStyle.commonWidth]}>
                                    <Text style={styles.order_title}>退款信息</Text>
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
                        :
                            null
                    }
                    {/*退款原因*/}
                    {
                        orderInfo.is_refund
                        ?
                            <View style={[CommonStyle.flexCenter,{
                                paddingTop: 16,
                                paddingBottom: 16,
                                backgroundColor:'#fff',
                                marginTop: 10
                            }]}>
                                <View style={[CommonStyle.commonWidth]}>
                                    <Text style={styles.order_title}>退款原因</Text>
                                    <Text style={{
                                        color:'#666',
                                        marginTop: 20
                                    }}>无</Text>
                                </View>
                            </View>
                        :
                        null
                    }
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10,
                        marginBottom: 100
                    }]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <View style={[CommonStyle.spaceRow]}>
                                <Text style={{color:'#666',fontSize: 13}}>
                                    总支付金额
                                </Text>
                                <Text style={{color:'#333',fontSize: 13}}>
                                    ¥{parseFloat(orderInfo.total_price)}
                                </Text>
                            </View>
                            {
                                this.storeName==='待支付'
                                ?
                                    null
                                :
                                    <View style={[CommonStyle.spaceRow,{marginTop: 14}]}>
                                        <Text style={{color:'#666',fontSize: 13}}>
                                            下单时间
                                        </Text>
                                        <Text style={{color:'#333',fontSize: 13}}>
                                            {orderInfo.pay_time}
                                        </Text>
                                    </View>
                            }

                            {
                                orderInfo.is_refund
                                ?
                                    <View>
                                        <View style={[CommonStyle.spaceRow,{marginTop: 14}]}>
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                申请退款
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                {orderInfo.refund_audit_price}
                                            </Text>
                                        </View>
                                        <View style={[CommonStyle.spaceRow,{marginTop: 14}]}>
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                实际退款
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                {orderInfo.refund_total_price}
                                            </Text>
                                        </View>
                                        <View style={[CommonStyle.spaceRow,{marginTop: 14}]}>
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                实际支付
                                            </Text>
                                            <Text style={{color:'#F84949',fontSize: 13}}>
                                                ¥{parseFloat(orderInfo.total_price)-parseFloat(orderInfo.refund_total_price)}
                                            </Text>
                                        </View>
                                    </View>
                                :
                                    null
                            }
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
                    <View style={CommonStyle.flexCenter}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexEnd,{
                            height:50
                        }]}>
                            {
                                this.storeName==='待支付'
                                ?
                                    null
                                :
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width:100,
                                        height:30,
                                        borderWidth: 1,
                                        borderColor: '#b0b0b0',
                                        borderRadius: 15,
                                        marginRight: 23
                                    }]}
                                    onPress={()=>{
                                        NavigatorUtils.goPage({
                                            order_id: orderInfo.order_id,
                                            refresh: function () {
                                                NavigatorUtils.backToUp(this.props)
                                            }
                                        }, 'InitiativeRefund')
                                    }}
                                    >
                                        <Text style={{color:'#999',fontSize: 13}}>主动退款</Text>
                                    </TouchableOpacity>
                            }

                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width:100,
                                height:30,
                                borderWidth: 1,
                                borderColor: '#b0b0b0',
                                borderRadius: 15
                            }]}>
                                <Text style={{color:'#999',fontSize: 13}}>私信</Text>
                            </TouchableOpacity>
                        </View>
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
export default connect(mapStateToProps)(InitiativeOrderDetail)

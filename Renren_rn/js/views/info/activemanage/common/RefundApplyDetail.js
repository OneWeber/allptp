import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Linking, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import LazyImage from 'animated-lazy-image';
import Entypo from 'react-native-vector-icons/Entypo';
const {width} = Dimensions.get('window');
class RefundApplyDetail extends Component{
    constructor(props) {
        super(props);
        this.refund_id = this.props.navigation.state.params.refund_id;
        this.state = {
            refundInfo: ''
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('refund_id', this.refund_id);
        Fetch.post(NewHttp+'RefundDTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    refundInfo: res.data
                })
            }
        })
    }
    render(){
        const {refundInfo} = this.state;
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
                                name={'exclamationcircle'}
                                size={30}
                                style={{color:this.props.theme}}
                            />
                            <Text style={{
                                marginLeft: 12,
                                fontSize:18,
                                fontWeight: 'bold',
                                color:'#333'
                            }}>
                                退款申请详情
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
                                    source={refundInfo.user&&refundInfo.user.headimage&&refundInfo.user.headimage.domain&&refundInfo.user.headimage.image_url?{
                                        uri:refundInfo.user.headimage.domain+refundInfo.user.headimage.image_url
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
                                        refundInfo.user
                                            ?
                                            refundInfo.user.family_name||refundInfo.user.middle_name||refundInfo.user.name
                                                ?
                                                <Text>
                                                    {refundInfo.user.family_name?refundInfo.user.family_name+' ':''}
                                                    {refundInfo.user.middle_name?refundInfo.user.middle_name+' ':''}
                                                    {refundInfo.user.name?refundInfo.user.name:''}
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
                                    Linking.openURL('tel:'+refundInfo.user.mobile)
                                }}
                            />
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
                                source={refundInfo.cover&&refundInfo.cover.domain&&refundInfo.cover.image_url?{
                                    uri: refundInfo.cover.domain + refundInfo.cover.image_url
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
                                    {refundInfo.title}
                                </Text>
                                <Text style={{
                                    color:'#666',
                                    fontSize: 12
                                }}>¥{refundInfo.act_union_price}/人</Text>
                            </View>
                        </View>
                    </View>
                    {/*参与时间*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>参与时间</Text>
                            <Text style={{
                                marginTop: 20,
                                color:'#666'
                            }}>
                                {refundInfo.activ_begin_time} -- {refundInfo.activ_end_time}
                            </Text>

                        </View>
                    </View>
                    {/*参与人数*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        backgroundColor: '#fff'
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height: 50
                        }]}>
                            <Text style={styles.order_title}>参与人数</Text>
                            <Text style={{color:'#333'}}>{refundInfo.num}人</Text>
                        </View>
                    </View>
                    {/*已订套餐及人数*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>已订套餐及人数</Text>
                            {
                                refundInfo.detail&&refundInfo.detail.length>0
                                ?
                                    refundInfo.detail.map((item, index) => {
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
                    {/*已订住宿*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>已订住宿</Text>
                            {
                                refundInfo.house&&refundInfo.house.length>0
                                ?
                                    refundInfo.house.map((item, index) => {
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
                    {/*参与人数*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        backgroundColor: '#fff'
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height: 50
                        }]}>
                            <Text style={styles.order_title}>退款方式</Text>
                            <Text style={{color:'#333'}}>{refundInfo.flag?'全款':'非全款'}</Text>
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
                            <Text style={styles.order_title}>退订详情</Text>
                            {
                                refundInfo.refund_detail&&refundInfo.refund_detail.length>0
                                ?
                                    refundInfo.refund_detail.map((item, index) => {
                                        return <View key={index} style={[{
                                            marginTop: index===0?19:14
                                        }]}>
                                            {
                                                item.type===3
                                                ?
                                                    <View style={CommonStyle.spaceRow}>
                                                        <Text style={{color:'#666',fontSize: 13}}>
                                                            住宿:{item.name} x{item.pereson_num}
                                                        </Text>
                                                        <Text style={{color:'#333',fontSize: 13}}>¥{parseFloat(item.price)}</Text>
                                                    </View>
                                                :
                                                    <View style={CommonStyle.spaceRow}>
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
                                            }

                                        </View>
                                    })
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
                    {/*其他原因*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 16,
                        paddingBottom: 16,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>退款原因</Text>
                            <Text style={{
                                marginTop: 20,
                                color:'#666'
                            }}>
                                {refundInfo.refund_reason}
                            </Text>
                        </View>
                    </View>
                    {/*总退款金额*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        backgroundColor: '#fff',
                        marginBottom: 100
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height: 50
                        }]}>
                            <Text style={styles.order_title}>总退款金额</Text>
                            <Text style={{color:'#F12B2B'}}>¥{parseFloat(refundInfo.refund_total_price)}</Text>
                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView style={{
                    position:'absolute',
                    left:0,
                    right:0,
                    bottom:0,
                    backgroundColor:'#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f5f5f5'
                }}>
                    <View style={CommonStyle.flexCenter}>
                        {
                            refundInfo.audit===0
                            ?
                                <View style={[CommonStyle.commonWidth,{
                                    height: 50
                                }]}>

                                </View>
                            :
                                <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                                    height: 50
                                }]}>
                                    <Text style={{
                                        color:'#666'
                                    }}>
                                        {refundInfo.audit===1?'已同意':'已拒绝'}
                                    </Text>
                                </View>
                        }

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
export default connect(mapStateToProps)(RefundApplyDetail)

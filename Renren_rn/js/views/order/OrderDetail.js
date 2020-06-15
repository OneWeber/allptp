import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    ImageBackground, SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window')
class OrderDetail extends Component{
    constructor(props) {
        super(props);
        this.order_id = this.props.navigation.state.params.order_id;
        this.storeName = this.props.navigation.state.params.storeName;
        this.state = {
            orderInfo: {},
            isLoading: false
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        this.setState({
            isLoading: true
        });
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('order_id', this.order_id);
        Fetch.post(NewHttp+'OrderDTwo', formData).then(res => {
            if(res.code === 1) {
                console.log(res);
                this.setState({
                    orderInfo: res.data,
                    isLoading: false
                })
            }
        })
    }
    getLeftButton() {
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                NavigatorUtils.backToUp(this.props)
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    telType(tel) {
        let reg = /^(\d{3})\d*(\d{4})$/;
        return tel.replace(reg,'$1****$2')
    }
    render() {
        const {isLoading, orderInfo} = this.state;
        const {userinfo, user} = this.props;
        let store = userinfo['userinfo'];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'订单详情'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    isLoading
                    ?
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <ActivityIndicator size={'small'} color={'#999'}/>
                        </View>
                    :
                        <View style={{flex: 1}}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                bounces={true}
                                removeClippedSubviews
                                scrollEventThrottle={16}
                            >
                                <View style={[CommonStyle.flexCenter,{
                                    marginTop: 10,
                                    paddingTop: 16.5,
                                    paddingBottom: 16.5,
                                    backgroundColor: '#fff'
                                }]}>
                                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                        <ImageBackground
                                            source={require('../../../assets/images/error.png')}
                                            style={{width:90,height:60,borderRadius: 4}}
                                        >
                                            <LazyImage
                                                source={orderInfo.cover&&orderInfo.cover.domain&&orderInfo.cover.image_url?
                                                    {uri:orderInfo.cover.domain+orderInfo.cover.image_url}:
                                                    require('../../../assets/images/error.png')
                                                }
                                                style={{width:90,height:60,borderRadius: 4}}
                                            />
                                        </ImageBackground>
                                        <View style={[CommonStyle.spaceCol,{
                                            height: 60,
                                            width: width*0.94-100,
                                            alignItems:'flex-start'
                                        }]}>
                                            <Text numberOfLines={2} ellipsizeMode={'tail'}
                                                style={{
                                                color:'#333',
                                                fontSize: 15,
                                                fontWeight:'bold'
                                            }}>{orderInfo.title}</Text>
                                            <Text style={{
                                                color:'#666',
                                                fontSize: 12
                                            }}>共¥{orderInfo.pay_price}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[CommonStyle.flexCenter,{
                                    marginTop: 10,
                                    backgroundColor: '#fff'
                                }]}>
                                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                        height: 50
                                    }]}>
                                        <Text style={styles.order_title}>参与人数</Text>
                                        <Text style={{color:'#666'}}>{orderInfo.num}人</Text>
                                    </View>
                                </View>
                                 <View style={[CommonStyle.flexCenter,{
                                     paddingTop: 15,
                                     paddingBottom: 15,
                                     backgroundColor: '#fff',
                                     marginTop: 10
                                 }]}>
                                     <View style={[CommonStyle.commonWidth]}>
                                         <Text style={styles.order_title}>参与时间</Text>
                                         <Text style={{marginTop: 17,color:'#666'}}>
                                             {orderInfo.activ_begin_time} -- {orderInfo.activ_end_time}
                                         </Text>
                                     </View>
                                 </View>
                                <View style={[CommonStyle.flexCenter,{
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    backgroundColor: '#fff',
                                    marginTop: 10
                                }]}>
                                    <View style={[CommonStyle.commonWidth]}>
                                        <Text style={styles.order_title}>游客信息</Text>
                                        {
                                            store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                                            ?
                                                <View style={[CommonStyle.flexStart,{
                                                    height: 40,
                                                    backgroundColor: '#f5f7fa',
                                                    marginTop: 15,
                                                    paddingLeft: 14.5
                                                }]}>
                                                    <Text style={{color:'#666'}}>
                                                        {store.items.data.data[0].family_name?store.items.data.data[0].family_name+' ':null}
                                                        {store.items.data.data[0].middle_name?store.items.data.data[0].middle_name+' ':null}
                                                        {store.items.data.data[0].name?store.items.data.data[0].name:null}
                                                    </Text>
                                                    <Text style={{marginLeft: 20,color:'#666'}}>
                                                        {this.telType(store.items.data.data[0].mobile)}
                                                    </Text>
                                                </View>
                                            :
                                                null
                                        }
                                        {
                                            orderInfo.person&&orderInfo.person.length>0
                                            ?
                                                orderInfo.person.map((item, index) => {
                                                    return <View key={index} style={[CommonStyle.flexStart,{
                                                        height: 40,
                                                        backgroundColor: '#f5f7fa',
                                                        marginTop: 15,
                                                        paddingLeft: 14.5
                                                    }]}>
                                                        <Text style={{color:'#666'}}>
                                                            {item.name}
                                                        </Text>
                                                        <Text style={{marginLeft: 20,color:'#666'}}>
                                                            {this.telType(item.mobile)}
                                                        </Text>
                                                    </View>
                                                })
                                            :
                                                null
                                        }
                                    </View>
                                </View>
                                <View style={[CommonStyle.flexCenter,{
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    backgroundColor: '#fff',
                                    marginTop: 10
                                }]}>
                                    <View style={[CommonStyle.commonWidth]}>
                                        <Text style={styles.order_title}>价格信息</Text>
                                        <View style={[CommonStyle.spaceRow,{marginTop: 15}]}>
                                            <Text style={{color:'#666',fontSize: 13}}>标准1人</Text>
                                            <Text style={{color:'#333',fontSize: 13}}>¥{orderInfo.act_union_price}</Text>
                                        </View>
                                        {
                                            orderInfo.house&&orderInfo.house.length>0
                                            ?
                                                orderInfo.house.map((item, index) => {
                                                    return <View
                                                        key={index}
                                                        style={[CommonStyle.spaceRow,{marginTop: 15}]}
                                                    >
                                                        <Text style={{color:'#666',fontSize: 13}}>{item.title} 房数x{item.num}</Text>
                                                        <Text style={{color:'#333',fontSize: 13}}>¥{item.price}</Text>
                                                    </View>
                                                })
                                            :
                                                null
                                        }
                                    </View>
                                </View>
                                {
                                    orderInfo.is_refund
                                    ?
                                        <View style={[CommonStyle.flexCenter,{
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            backgroundColor: '#fff',
                                            marginTop: 10
                                        }]}>
                                            <View style={[CommonStyle.commonWidth]}>
                                                <Text style={styles.order_title}>退款信息</Text>

                                            </View>
                                        </View>
                                    :
                                        null
                                }
                                <View style={[CommonStyle.flexCenter,{
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    backgroundColor: '#fff',
                                    marginTop: 10,
                                    marginBottom: 100
                                }]}>
                                    <View style={[CommonStyle.commonWidth]}>
                                        <View
                                            style={[CommonStyle.spaceRow]}
                                        >
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                订单总额
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                ¥{orderInfo.total_price}
                                            </Text>
                                        </View>
                                        <View
                                            style={[CommonStyle.spaceRow,{marginTop: 15}]}
                                        >
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                基金抵扣
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                ¥{orderInfo.balance}
                                            </Text>
                                        </View>
                                        <View
                                            style={[CommonStyle.spaceRow,{marginTop: 15}]}
                                        >
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                实际支付
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                ¥{(parseFloat(orderInfo.total_price) - parseFloat(orderInfo.balance)).toFixed(2)}
                                            </Text>
                                        </View>
                                        <View
                                            style={[CommonStyle.spaceRow,{marginTop: 15}]}
                                        >
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                支付方式
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                {orderInfo.pay_type===1?'微信支付':orderInfo.pay_type===2?'支付宝支付':orderInfo.pay_type===3?'银行卡支付':'基金支付'}
                                            </Text>
                                        </View>
                                        <View
                                            style={[CommonStyle.spaceRow,{marginTop: 15}]}
                                        >
                                            <Text style={{color:'#666',fontSize: 13}}>
                                               下单时间
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                {orderInfo.create_time}
                                            </Text>
                                        </View>
                                        <View
                                            style={[CommonStyle.spaceRow,{marginTop: 15}]}
                                        >
                                            <Text style={{color:'#666',fontSize: 13}}>
                                                订单编号
                                            </Text>
                                            <Text style={{color:'#333',fontSize: 13}}>
                                                {orderInfo.order_no}
                                            </Text>
                                        </View>

                                    </View>
                                </View>

                            </ScrollView>
                            <SafeAreaView style={{
                                position:'absolute',
                                left: 0,
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                borderTopWidth: 1,
                                borderTopColor: '#f5f5f5'
                            }}>
                                <View style={[CommonStyle.flexCenter]}>
                                    <View style={[CommonStyle.commonWidth,CommonStyle.flexEnd,{
                                        height: 50
                                    }]}>
                                        {
                                            this.storeName !== '待体验'
                                                ?
                                                <TouchableOpacity style={[CommonStyle.flexCenter,{
                                                    width: 100,
                                                    height: 30,
                                                    borderWidth: 1,
                                                    borderColor: '#999',
                                                    borderRadius: 15
                                                }]}>
                                                    <Text style={{color: '#999', fontSize: 13}}>提交纠纷</Text>
                                                </TouchableOpacity>
                                                :
                                                null
                                        }
                                        {
                                            this.storeName !== '已完成'
                                                ?
                                                <TouchableOpacity style={[CommonStyle.flexCenter,{
                                                    width: 100,
                                                    height: 30,
                                                    borderWidth: 1,
                                                    borderColor: '#999',
                                                    borderRadius: 15,
                                                    marginLeft: 15
                                                }]}>
                                                    <Text style={{color: '#999', fontSize: 13}}>申请退款</Text>
                                                </TouchableOpacity>
                                                :
                                                null
                                        }
                                        {
                                            this.storeName === '已完成'
                                            ?
                                                orderInfo.isevaluate === 1
                                                ?
                                                    <View style={[CommonStyle.flexCenter,{
                                                        width: 100,
                                                        height: 30,
                                                        borderWidth: 1,
                                                        borderColor: this.props.theme,
                                                        borderRadius: 15,
                                                        marginLeft: 15
                                                    }]}>
                                                        <Text style={{color: this.props.theme, fontSize: 13}}>去评价</Text>
                                                    </View>
                                                :
                                                    <View style={[CommonStyle.flexCenter,{
                                                        width: 100,
                                                        height: 30,
                                                        borderWidth: 1,
                                                        borderColor: '#999',
                                                        borderRadius: 15,
                                                        marginLeft: 15
                                                    }]}>
                                                        <Text style={{color: '#999', fontSize: 13}}>已评价</Text>
                                                    </View>
                                            :
                                                null
                                        }

                                    </View>
                                </View>
                            </SafeAreaView>

                        </View>
                }

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
    userinfo: state.userinfo,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(OrderDetail)

import React,{Component} from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ScrollView, ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window')
class RefundDetail extends Component{
    constructor(props) {
        super(props);
        this.refund_id = this.props.navigation.state.params.refund_id;
        this.state = {
            refundInfo: {},
            isLoading: false
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        this.setState({
            isLoading: true
        })
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('refund_id', this.refund_id);
        Fetch.post(NewHttp+'RefundDTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    refundInfo: res.data,
                    isLoading: false
                },() => {
                    console.log('refundInfo', this.state.refundInfo)
                })
            }
        })
    }
    render() {
        const {isLoading, refundInfo} = this.state;
        return(
            <View style={{flex: 1}}>
                <SafeAreaView>
                    <View style={[CommonStyle.flexStart,{
                        height: 50
                    }]}>
                        <TouchableOpacity style={{
                            paddingLeft: width*0.03
                        }}
                         onPress={()=>{
                             NavigatorUtils.backToUp(this.props)
                         }}
                        >
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333'}}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                {
                    isLoading
                    ?
                        <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                            <ActivityIndicator size={'small'} color={'#999'}/>
                        </View>
                    :
                        <View style={{flex: 1}}>
                            <ScrollView>
                                <View style={[CommonStyle.flexCenter]}>
                                    <View style={[CommonStyle.commonWidth,CommonStyle.flexStart]}>
                                        <AntDesign
                                            name={refundInfo.audit===0?'exclamationcircle':refundInfo.audit===1?'checkcircle':'closecircle'}
                                            size={30}
                                            style={{color:refundInfo.audit===0?'#999':refundInfo.audit===1?this.props.theme:'#ee395b'}}
                                        />
                                        <Text style={{
                                            marginLeft: 12,
                                            fontSize:18,
                                            fontWeight: 'bold',
                                            color:'#333'
                                        }}>
                                            {
                                                refundInfo.audit===0
                                                ?
                                                    '退款申请中'
                                                :
                                                    refundInfo.audit===1
                                                ?
                                                    '退款成功'
                                                :
                                                    '退款被拒绝'
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <View style={[CommonStyle.flexCenter,{
                                    paddingTop: 16.5,
                                    paddingBottom: 16.5,
                                    backgroundColor: '#fff',
                                    marginTop: 14.5
                                }]}>
                                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                        <ImageBackground
                                            source={require('../../../assets/images/error.png')}
                                            style={{width:90,height:60,borderRadius: 4}}
                                        >
                                            <LazyImage
                                                source={refundInfo.cover&&refundInfo.cover.domain&&refundInfo.cover.image_url?{
                                                    uri: refundInfo.cover.domain + refundInfo.cover.image_url
                                                }:require('../../../assets/images/error.png')}
                                                style={{width:90,height:60,borderRadius: 4}}
                                            />
                                        </ImageBackground>
                                        <View style={[CommonStyle.spaceCol,{
                                            width: width*0.94-100,
                                            height: 60,
                                            alignItems:'flex-start'
                                        }]}>
                                            <Text
                                                style={{color:'#333',fontWeight:'bold',fontSize: 15}}
                                                numberOfLines={2} ellipsizeMode={'tail'}
                                            >{refundInfo.title}</Text>
                                            <Text style={{
                                                color:'#666',
                                                fontSize: 12
                                            }}>共¥{refundInfo.total_price}</Text>
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
                                        <Text style={styles.order_title}>退款方式</Text>
                                        <Text style={{color:'#666'}}>{refundInfo.flag?'全款':'非全款'}</Text>
                                    </View>
                                </View>
                                {/*需要判断用户退款是全款还是非全款*/}
                                {/*退订套餐及人数*/}
                                <View style={[CommonStyle.flexCenter,{
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    backgroundColor:'#fff',
                                    marginTop: 10
                                }]}>
                                    <View style={CommonStyle.commonWidth}>
                                        <Text style={[styles.order_title]}>退订详情</Text>
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
                                <View style={[CommonStyle.flexCenter,{
                                    height: 50
                                }]}>
                                    <Text style={{color:'#666'}}>提交纠纷</Text>
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
    theme: state.theme.theme
})
export default connect(mapStateToProps)(RefundDetail)

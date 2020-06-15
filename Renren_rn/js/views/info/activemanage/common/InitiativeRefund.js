import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Linking, TextInput, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import {connect} from 'react-redux';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import Entypo from 'react-native-vector-icons/Entypo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast';
class InitiativeRefund extends Component{
    constructor(props) {
        super(props);
        this.order_id = this.props.navigation.state.params.order_id;
        this.state = {
            orderInfo: '',
            reason: ''
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
    goRefund() {
        if(!this.state.reason) {
            this.refs.toast.show('请填写退款原因')
        }else{
            let house = [];
            let hData = this.state.orderInfo.house;
            if(hData.length>0) {
                for(let i=0; i<hData.length; i++) {
                    house.push({
                        oh_id: hData[i].oh_id,
                        num: hData[i].num
                    })
                }
            }
            let formData = new FormData();
            formData.append('token', this.props.token);
            formData.append('order_id', this.state.orderInfo.order_id);
            formData.append('person_num', this.state.orderInfo.num);
            formData.append('house', JSON.stringify(house));
            formData.append('reason', this.state.reason);
            formData.append('flag', 1);
            formData.append('type', 1);
            Fetch.post(NewHttp+'RefundSTwo', formData).then(res => {
                if(res.code === 1) {
                    NavigatorUtils.backToUp(this.props, true)
                }else{
                    console.log(res.msg)
                }
            })
        }
    }
    render(){
        const {orderInfo} = this.state;
        return(
            <View style={{flex: 1,position: 'relative'}}>
                <Toast ref="toast" position='center' positionValue={0}/>
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
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={CommonStyle.flexCenter}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexStart]}>
                                <AntDesign
                                    name={'exclamationcircle'}
                                    size={30}
                                    style={{color: this.props.theme}}
                                />
                                <Text style={{
                                    marginLeft: 12,
                                    fontSize:18,
                                    fontWeight: 'bold',
                                    color:'#333'
                                }}>
                                   您正在退款给用户
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
                        {/*退订套餐*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor:'#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <Text style={styles.order_title}>退订套餐及人数</Text>
                                <View style={[CommonStyle.spaceRow,{
                                    marginTop: 19
                                }]}>
                                    <Text style={{color:'#666',fontSize: 13}}>
                                        标准1人
                                    </Text>
                                    <Text style={{color:'#333',fontSize: 13}}>¥{parseFloat(orderInfo.act_union_price)}</Text>
                                </View>
                                {
                                    orderInfo.detail&&orderInfo.detail.length>0
                                        ?
                                        <View>
                                            {
                                                orderInfo.detail.map((item, index) => {
                                                    return <View key={index} style={[CommonStyle.spaceRow,{
                                                        marginTop: 14
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
                                        null
                                }
                            </View>
                        </View>
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
                                        <Text style={styles.order_title}>退订住宿</Text>
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
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor:'#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <Text style={styles.order_title}>退款原因</Text>
                                <TextInput
                                    multiline={true}
                                    defaultValue={this.state.reason}
                                    onChangeText={(text) => {
                                        this.setState({
                                            reason: text
                                        })
                                    }}
                                    style={{
                                        width:'100%',
                                        minHeight:85,
                                        borderWidth: 1,
                                        borderColor:'#dfe1e4',
                                        marginTop: 18,
                                        textAlignVertical:'top',
                                    }}
                                >
                                </TextInput>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            marginTop: 10,
                            backgroundColor:'#fff',
                            marginBottom: 100
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height: 50
                            }]}>
                                <Text style={styles.order_title}>总退款金额</Text>
                                <Text style={{color:'#F12B2B',fontSize: 13}}>¥{parseFloat(orderInfo.total_price)}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <SafeAreaView style={{
                    position:'absolute',
                    left:0,
                    right:0,
                    bottom:0,
                    backgroundColor:'#fff'
                }}>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        height:50
                    }]}
                    onPress={() => {
                        this.goRefund()
                    }}
                    >
                        <Text style={{
                            color:'#666',
                            fontSize: 15
                        }}>确认退款</Text>
                    </TouchableOpacity>
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
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(InitiativeRefund)

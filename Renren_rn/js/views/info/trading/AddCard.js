import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import card from '../../../utils/card'
import Fetch from '../../../expand/dao/Fetch';
import HttpUrl from '../../../utils/Http';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux'
import NewHttp from '../../../utils/NewHttp';
import action from '../../../action';
const {width} = Dimensions.get('window')
class AddCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bank_name: '',
            card_number: '',
            user_name: '',
            idcard: '',
            mobile: '',
            m_code: '',
            sms_code: '',
            bank_info: '',
            isSms: false,
            smsTime: 60
        }
    }
    getLeftButton(){
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
    changeCardNum(text) {
        this.setState({
            card_number: text
        }, () => {
            if(card(text) != 'error') {
                this.setState({
                    bank_info: card(text)
                })
            }
        })
    }
    sendSms() {
        this.setState({
            isSms: true
        },() => {
            let time = this.state.smsTime;
            this.timer = setInterval(()=>{
                if(time>0) {
                    time--
                }else {
                    clearInterval(this.timer)
                    this.setState({
                        isSms: false
                    })
                }
                this.setState({
                    smsTime: time
                })
            }, 1000)
        })
        let formData = new FormData();
        formData.append('m_code', 86);
        formData.append('token', this.props.token);
        formData.append('mobile', this.state.mobile);
        formData.append('flag', 7);
        Fetch.post(HttpUrl+'User/send_msg', formData).then(res => {
            console.log(res)
            if(res.code === 1) {
                this.refs.toast.show('验证码已发送')
            }
        })
    }
    saveBankCard() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('bank_name', this.state.bank_info.bankName);
        formData.append('card_number', this.state.card_number);
        formData.append('user_name', this.state.user_name);
        formData.append('idcard', this.state.idcard);
        formData.append('mobile', this.state.mobile);
        formData.append('m_code', 86);
        formData.append('sms_code', this.state.sms_code);
        Fetch.post(NewHttp+'BankSTwo', formData).then(res => {
            if(res.code === 1) {
                this.initBank();
                NavigatorUtils.backToUp(this.props);
            }else{
                this.refs.toast.show(res.msg)
            }
        })
    }
    initBank() {
        const {onLoadBank, token} = this.props;
        this.storeName = 'bank';
        let formData = new FormData();
        formData.append('token', token);
        onLoadBank(this.storeName, NewHttp+'bankl', formData)
    }
    render(){
        const {isSms,card_number,user_name,idcard,mobile,sms_code} = this.state;
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'添加银行卡'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <Toast ref="toast" position='center' positionValue={0}/>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={CommonStyle.flexCenter}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 18,
                                    fontWeight:'bold',
                                    marginTop: 15
                                }}>请绑定持卡人本人的银行卡</Text>
                                <View style={[CommonStyle.spaceRow,styles.card_item,{
                                    marginTop: 15
                                }]}>
                                    <Text style={styles.card_item_title}>持卡人</Text>
                                    <TextInput
                                        defaultValue={this.state.user_name}
                                        onChangeText={(text)=>this.setState({
                                            user_name: text
                                        })}
                                        placeholder="输入持卡人姓名"
                                        style={styles.card_input}
                                    />
                                </View>
                                <View style={[CommonStyle.spaceRow,styles.card_item]}>
                                    <Text style={styles.card_item_title}>身份证</Text>
                                    <TextInput
                                        defaultValue={this.state.idcard}
                                        onChangeText={(text)=>this.setState({
                                            idcard: text
                                        })}
                                        placeholder="输入持卡人身份证号"
                                        style={styles.card_input}
                                    />
                                </View>
                                <View style={[CommonStyle.spaceRow,styles.card_item]}>
                                    <Text style={styles.card_item_title}>卡号</Text>
                                    <TextInput
                                        keyboardType={"number-pad"}
                                        placeholder="银行卡号"
                                        defaultValue={this.state.card_number}
                                        onChangeText={(text)=>this.changeCardNum(text)}
                                        style={styles.card_input}
                                    />
                                </View>
                                {
                                    this.state.card_number != ''
                                    ?
                                        <View style={[CommonStyle.spaceRow,styles.card_item]}>
                                            <Text style={styles.card_item_title}>银行卡</Text>
                                            <View style={[styles.card_input,CommonStyle.flexStart,{
                                                height: 53
                                            }]}>
                                                <Text style={{
                                                    color:'#999'
                                                }}>
                                                    {
                                                        this.state.bank_info
                                                        ?
                                                            this.state.bank_info.bankName+this.state.bank_info.cardTypeName
                                                        :
                                                            '请输入正确的银行卡号'
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    :
                                        null
                                }
                                {
                                    this.state.card_number != ''
                                    ?
                                        <View>
                                            <View style={[CommonStyle.spaceRow,styles.card_item]}>
                                                <Text style={styles.card_item_title}>手机号</Text>
                                                <TextInput
                                                    defaultValue={this.state.mobile}
                                                    onChangeText={(text)=>{this.setState({
                                                        mobile: text
                                                    })}}
                                                    keyboardType={"number-pad"}
                                                    placeholder="输入预留手机号"
                                                    style={styles.card_input}
                                                />
                                            </View>
                                            <View style={[CommonStyle.spaceRow,styles.card_item]}>
                                                <Text style={styles.card_item_title}>验证码</Text>
                                                <TextInput
                                                    defaultValue={this.state.sms_code}
                                                    onChangeText={(text)=>{this.setState({
                                                        sms_code: text
                                                    })}}
                                                    keyboardType={"number-pad"}
                                                    placeholder="短信验证码"
                                                    style={[styles.card_input,{
                                                        width: width*0.94 - 60 - 90
                                                    }]}
                                                />
                                                {
                                                    mobile
                                                    ?
                                                        isSms
                                                        ?
                                                            <Text style={{color:'#999'}}>已发送({this.state.smsTime})</Text>
                                                        :
                                                        <Text style={{color:this.props.theme}} onPress={()=>{
                                                            this.sendSms()
                                                        }}>发送验证码</Text>
                                                    :
                                                        <Text style={{color:'#999'}}>发送验证码</Text>
                                                }

                                            </View>
                                        </View>
                                    :
                                        null
                                }
                                {
                                    card_number&&user_name&&idcard&&mobile&&sms_code
                                    ?
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height: 45,
                                            backgroundColor:this.props.theme,
                                            borderRadius: 5,
                                            marginTop: 45
                                        }]} onPress={()=>{
                                            this.saveBankCard()
                                        }}>
                                            <Text style={{color:'#fff'}}>确认并验证</Text>
                                        </TouchableOpacity>
                                    :
                                        <View style={[CommonStyle.flexCenter,{
                                            height: 45,
                                            backgroundColor:'#e9e9e9',
                                            borderRadius: 5,
                                            marginTop: 45
                                        }]}>
                                            <Text style={{color:'#fff'}}>确认并验证</Text>
                                        </View>
                                }

                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    card_item: {
        height:53,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1
    },
    card_item_title: {
        color:'#333',
        fontWeight: 'bold'
    },
    card_input: {
        width: width*0.94 - 60,
        height:53,
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
const mapDispatchToProps = dispatch => ({
    onLoadBank: (storeName, url, data) => dispatch(action.onLoadBank(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(AddCard)

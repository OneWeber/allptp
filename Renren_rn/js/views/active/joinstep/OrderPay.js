import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, SafeAreaView} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import LazyImage from 'animated-lazy-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import Toast from 'react-native-easy-toast';
import * as WeChat from 'react-native-wechat';
const {width, height} = Dimensions.get('window');
class OrderPay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            due_balance: '',
            balance: 0,
            payWay: 0,
            prepayId:'',
            nonceStr:'',
            timeStamp:'',
            wxpackage:'Sign=WXPay',
            sign:'',
            appId:'',
            partnerId:'',
            package:''
        };
        this.isEnjoy = this.props.navigation.state.params.isEnjoy;
        WeChat.registerApp('wx675e99e19312c085');
    }
    componentDidMount(){
        this.getBalance()
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
    getBalance() {
        let formDate = new FormData();
        formDate.append('token', this.props.token);
        formDate.append('page', 1);
        Fetch.post(NewHttp+'balance', formDate).then(res => {
            if(res.code === 1) {
                this.setState({
                    due_balance: res.data.due_balance
                })
            }
        })
    }
    changeBalance(text) {
        if(!text) {
            this.setState({
                balance: 0
            })
        }else if(parseFloat(text)<0) {
            this.setState({
                balance: 0
            })
        }else if(parseFloat(text)>parseFloat(this.state.due_balance)) {
            this.setState({
                balance: this.state.due_balance
            })
        }else {
            this.setState({
                balance: text
            })
        }

    }
    // 支付
    getPay() {
        const {join} = this.props;
        let pData = this.props.join.person;
        let people = [];
        let num = 0;
        let kids_num = 0;
        for(let i=0;i<pData.length;i++) {
            if(pData[i].type===1) {
                num++
            }else{
                kids_num++
            }
            people.push({
                name: pData[i].name,
                idcard: pData[i].idCard,
                mobile: pData[i].tel
            })
        }
        let house = [];
        for(let i=0;i<join.houseid.length;i++){
            house.push({
                house_id: join.houseid[i].house_id,
                num: join.houseid[i].choiceNum,
            })
        }
        if(this.state.payWay === 0) {
            this.refs.toast.show('请选择支付方式')
        }else{
            if(this.state.payWay===1) {
                this.wechatPay(num, kids_num, people, house);
            }
        }

    }
    wechatPay(num, kids_num, people, house) {
        const {join} = this.props;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('activity_id', JSON.stringify(join.activity_id));
        formData.append('slot_id', join.slot_id);
        formData.append('num', this.isEnjoy?num:num+1);
        formData.append('person', JSON.stringify(people));
        formData.append('pay_type', this.state.payWay);
        formData.append('isstay', join.houseid.length>0?1:0);
        formData.append('is_book_whole', 0);
        formData.append('balance', parseFloat(this.state.balance));
        formData.append('house', JSON.stringify(house));
        formData.append('isapp', 1);
        formData.append('combine', JSON.stringify(join.selectCombine));
        formData.append('kids_num', kids_num);
        Fetch.post(NewHttp+'OrderAddTwo', formData).then(res => {
            if(res.code === 0) {
                this.refs.toast.show(res.msg)
            }else{
                this.setState({
                    prepayId:JSON.parse(res).prepayid,
                    nonceStr:JSON.parse(res).noncestr,
                    timeStamp:JSON.parse(res).timestamp,
                    wxpackage:'Sign=WXPay',
                    sign:JSON.parse(res).paysign,
                    appId:JSON.parse(res).appid,
                    partnerId:JSON.parse(res).partnerid,
                    package:JSON.parse(res).package
                },()=>{
                    console.log(res)
                    WeChat.isWXAppInstalled().then((isInstalled) => {
                        if(isInstalled) {
                            WeChat.pay({
                                appId:this.state.appId,
                                partnerId:this.state.partnerId,  // 商家向财付通申请的商家id
                                prepayId: this.state.prepayId,   // 预支付订单
                                nonceStr:this.state.nonceStr,   // 随机串，防重发
                                timeStamp:this.state.timeStamp,  // 时间戳，防重发.
                                package:this.state.package,    // 商家根据财付通文档填写的数据和签名
                                sign:this.state.sign    // 商家根据微信开放平台文档对数据做的签名
                            }) .then((requestJson) => {
                                if(requestJson.errCode == '0') {

                                }else{

                                }
                            })
                        }else{
                            this.refs.toast.show('请先安装微信客户端')
                        }
                    })
                })
            }
        })
    }
    render() {
        const {join, user} = this.props;
        let adult = [];
        let kids = [];
        for(let i=0;i<join.person.length; i++) {
            if(join.person[i].type===1) {
                adult.push(join.person[i])
            }else{
                kids.push(join.person[i])
            }
        }

        let combinePrice = 0;
        let showCombine = [];
        if(join.selectCombine.length>0) {
            for(let i=0;i<join.combine.length;i++) {
                for(let j=0;j<join.selectCombine.length;j++) {
                    if(join.combine[i].combine_id === join.selectCombine[j]) {
                        combinePrice += parseFloat(join.combine[i].price);
                        showCombine.push(join.combine[i])
                    }
                }
            }
        }
        let housePrice = 0;
        if(join.houseid.length>0) {
            for(let i=0;i<join.houseid.length;i++) {
                housePrice += parseFloat(join.houseid[i].price)*join.houseid[i].choiceNum
            }
        }
        let personPrice = 0;
        for(let i=0;i<join.person.length; i++) {
            if(join.is_discount) {
                if(join.person[i].type===1) {
                    personPrice+=parseFloat(join.adult_price)
                }else{
                    personPrice+=parseFloat(join.kids_price)
                }
            }else{
                if(join.person[i].type===1) {
                    personPrice+=parseFloat(join.adult_price_origin)
                }else{
                    personPrice+=parseFloat(join.kids_price_origin)
                }
            }
        }
        let combinePerson = 0;
        for(let i=0;i<join.combine.length;i++) {
            for(let j=0;j<join.selectCombine.length;j++) {
                if(join.combine[i].combine_id === join.selectCombine[j]) {
                    combinePerson += (join.combine[i].adult+join.combine[i].kids)
                    continue
                }
            }
        }

        return(
            <View style={{flex: 1,position:'relative'}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <RNEasyTopNavBar
                    title={'核对体验款项目'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <KeyboardAwareScrollView>
                    <ScrollView>
                        {/*标题*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor:'#fff',
                            marginTop: 10
                        }]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                }}>{join.title}</Text>
                                {
                                    join.longday===1
                                    ?
                                        <Text style={{
                                            marginTop: 18,
                                            color:'#999',
                                            fontSize: 13
                                        }}>
                                            参与时间：<Text style={{
                                            color:'#333'
                                        }}>{join.date} {join.begin_time} -- {join.end_time}</Text>
                                        </Text>
                                    :
                                        <Text style={{
                                            marginTop: 18,
                                            color:'#999',
                                            fontSize: 13
                                        }}>
                                            参与时间：<Text style={{
                                            color:'#333'
                                        }}>{join.begin_date} {join.begin_time} -- {join.end_date} {join.end_time}</Text>
                                        </Text>
                                }

                                {
                                    this.isEnjoy
                                    ?
                                        <Text style={{
                                            marginTop: 13,
                                            color:'#999',
                                            fontSize: 13
                                        }}>
                                            参与游客：<Text style={{
                                            color:'#333'
                                        }}>{join.person.length +combinePerson}位游客</Text>
                                        </Text>
                                    :
                                        <Text style={{
                                            marginTop: 13,
                                            color:'#999',
                                            fontSize: 13
                                        }}>
                                            参与游客：<Text style={{
                                            color:'#333'
                                        }}>{join.person.length +combinePerson + 1}位游客</Text>
                                        </Text>
                                }

                            </View>
                        </View>
                        {/*游客信息*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor:'#fff',
                            marginTop: 10
                        }]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight:'bold'
                                }}>游客信息</Text>
                                <View style={[CommonStyle.flexStart,{
                                    height:40,
                                    marginTop: 20.5,
                                    backgroundColor: '#f5f7fa',
                                    paddingLeft: 14.5,
                                    paddingRight: 14.5
                                }]}>
                                    <Text style={{
                                        color:'#333'
                                    }}>{user.username?JSON.parse(user.username):''}</Text>
                                    <Text style={{color:this.props.theme}}>(我)</Text>
                                </View>
                                {
                                    join&&join.person&&join.person.length>0
                                    ?
                                        join.person.map((item, index) => {
                                            return <View
                                                key={index}
                                                style={[CommonStyle.spaceRow,{
                                                    height:40,
                                                    marginTop: 10,
                                                    backgroundColor: '#f5f7fa',
                                                    paddingLeft: 14.5,
                                                    paddingRight: 14.5
                                                }]}
                                            >
                                                <View style={CommonStyle.flexStart}>
                                                    <Text style={{
                                                        color:'#333'
                                                    }}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={{
                                                        color:'#333',
                                                        marginLeft: 25
                                                    }}>
                                                        {item.tel?item.tel:''}
                                                    </Text>
                                                </View>
                                                <Text style={{
                                                    color:'#999'
                                                }}>编辑</Text>
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
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight:'bold'
                                }}>价格信息</Text>
                                <View style={{marginTop: 5}}>
                                    {
                                        showCombine&&showCombine.length>0
                                        ?
                                            showCombine.map((item, index) => {
                                                return <View
                                                    key={index}
                                                    style={[CommonStyle.spaceRow,{
                                                        marginTop: 14
                                                    }]}
                                                >
                                                    <Text style={{
                                                        color:'#666',
                                                        fontSize: 13
                                                    }}>
                                                        {showCombine[index].type===1?'亲子':showCombine[index].name}
                                                        {
                                                            showCombine[index].type===1
                                                                ?
                                                                showCombine[index].adult+'成人'+showCombine[index].kids+'儿童'
                                                            :
                                                                showCombine[index].adult+'人'
                                                        }
                                                    </Text>
                                                    <Text style={{
                                                        color: this.props.theme,
                                                        fontSize: 13
                                                    }}>¥{parseFloat(showCombine[index].price)}</Text>
                                                </View>
                                            })
                                        :
                                            null
                                    }
                                </View>
                                <View style={[CommonStyle.spaceRow,{
                                    marginTop: 14
                                }]}>
                                    <Text style={{
                                        color:'#666',
                                        fontSize: 13
                                    }}>标准{this.isEnjoy?adult.length:adult.length+1}人</Text>
                                    <Text style={{
                                        color: this.props.theme,
                                        fontSize: 13
                                    }}>¥
                                        {
                                            join.is_discount?parseFloat(join.adult_price)*(this.isEnjoy?adult.length:adult.length+1):parseFloat(join.adult_price_origin)*(this.isEnjoy?adult.length:adult.length+1)
                                        }
                                    </Text>
                                </View>
                                {
                                    kids.length>0
                                    ?
                                        <View style={[CommonStyle.spaceRow,{
                                            marginTop: 14
                                        }]}>
                                            <Text style={{
                                                color:'#666',
                                                fontSize: 13
                                            }}>儿童{kids.length}人</Text>
                                            <Text style={{
                                                color: this.props.theme,
                                                fontSize: 13
                                            }}>¥{join.is_discount?parseFloat(join.kids_price)*(kids.length):parseFloat(join.kids_price_origin)*(kids.length)}</Text>
                                        </View>
                                    :
                                        null
                                }
                            </View>
                        </View>
                        {/*住宿信息*/}
                        {
                            join&&join.houseid&&join.houseid.length>0
                            ?
                                <View style={[CommonStyle.flexCenter,{
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    backgroundColor:'#fff',
                                    marginTop: 10
                                }]}>
                                    <View style={CommonStyle.commonWidth}>
                                        <Text style={{
                                            color:'#333',
                                            fontSize: 15,
                                            fontWeight:'bold'
                                        }}>住宿信息</Text>
                                        {
                                            join.houseid.map((item, index) => {
                                                return <View
                                                    key={index}
                                                    style={[CommonStyle.spaceRow,{
                                                        marginTop: index===0?20:14
                                                    }]}
                                                >
                                                    <LazyImage
                                                        source={item.image&&item.image.length>0&&item.image[0].domain&&item.image[0].image_url?{
                                                            uri:item.image[0].domain + item.image[0].image_url
                                                        }:require('../../../../assets/images/error.png')}
                                                        style={{
                                                            width: 80,
                                                            height:60,
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                    <View style={[CommonStyle.spaceRow,{
                                                        width: width*0.94-90,
                                                        height: 60
                                                    }]}>
                                                        <View style={[CommonStyle.spaceCol,{
                                                            height:60,
                                                            alignItems: 'flex-start'
                                                        }]}>
                                                            <Text style={{
                                                                color:'#333',
                                                                fontSize: 13
                                                            }}>{item.flag===1?'露营':item.flag===2?'民宿':'酒店'}</Text>
                                                            <Text style={{
                                                                color:'#999',
                                                                fontSize: 12
                                                            }}>
                                                                房数x{item.choiceNum}
                                                            </Text>
                                                        </View>
                                                        <Text style={{
                                                            color:this.props.theme,
                                                            fontSize: 13
                                                        }}>¥{parseFloat(item.price)*item.choiceNum}</Text>
                                                    </View>
                                                </View>
                                            })
                                        }
                                    </View>
                                </View>
                            :
                                null
                        }
                        {/*是否包场*/}

                        {/*金额*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor:'#fff',
                            marginTop: 10
                        }]}>
                            <View style={CommonStyle.commonWidth}>
                                <View style={CommonStyle.spaceRow}>
                                    <Text style={{
                                        color:'#333',
                                        fontSize: 15,
                                        fontWeight:'bold'
                                    }}>支付金额</Text>
                                    {
                                        this.isEnjoy
                                        ?
                                            <Text style={{
                                                color: this.props.theme,
                                                fontSize: 13
                                            }}>
                                                ¥{combinePrice+housePrice+personPrice}
                                            </Text>
                                        :
                                            <Text style={{
                                                color: this.props.theme,
                                                fontSize: 13
                                            }}>
                                                ¥{(combinePrice+housePrice+personPrice+(join.is_discount?parseFloat(join.adult_price):parseFloat(join.adult_price_origin)))}
                                            </Text>
                                    }

                                </View>
                                <View style={[CommonStyle.spaceRow,{
                                    marginTop: 25
                                }]}>
                                    <Text style={{
                                        color:'#333',
                                        fontSize: 15,
                                        fontWeight:'bold',
                                    }}>基金抵扣</Text>
                                    <View>
                                        <TextInput
                                            defaultValue={this.state.balance}
                                            onChangeText={(text)=>{
                                                this.changeBalance(text)
                                            }}
                                            style={{
                                                width: 61,
                                                height:30,
                                                backgroundColor: '#f5f7fa'
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={[CommonStyle.flexEnd,{
                                    marginTop: 6.5
                                }]}>
                                    <Text style={{
                                        color:this.props.theme,
                                        fontSize: 11
                                    }}>可用基金余额:{this.state.due_balance}</Text>
                                </View>

                            </View>
                        </View>
                        {/*付款方式*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor:'#fff',
                            marginTop: 10
                        }]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight:'bold'
                                }}>付款方式</Text>
                                <TouchableOpacity style={[CommonStyle.spaceRow,{
                                    marginTop: 30
                                }]}
                                onPress={()=>{
                                    this.setState({
                                        payWay: 1
                                    })
                                }}
                                >
                                    <View style={CommonStyle.flexStart}>
                                        <AntDesign
                                            name={'wechat'}
                                            size={24}
                                            style={{color:'green'}}
                                        />
                                        <Text style={{
                                            marginLeft: 15,
                                            color:'#333'
                                        }}>微信支付</Text>
                                    </View>
                                    <View style={[CommonStyle.flexCenter,{
                                        width:18,
                                        height: 18,
                                        borderWidth: 1,
                                        borderColor: this.state.payWay===1?this.props.theme:'#999',
                                        borderRadius: 9
                                    }]}>
                                        {
                                            this.state.payWay===1
                                            ?
                                                <View style={{
                                                    width:15,
                                                    height:15,
                                                    borderRadius:7.5,
                                                    backgroundColor: this.props.theme
                                                }}></View>
                                            :
                                                null
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[CommonStyle.spaceRow,{
                                    marginTop: 30
                                }]}
                                  onPress={()=>{
                                      this.setState({
                                          payWay: 2
                                      })
                                  }}
                                >
                                    <View style={CommonStyle.flexStart}>
                                        <AntDesign
                                            name={'alipay-square'}
                                            size={24}
                                            style={{color:'lightblue'}}
                                        />
                                        <Text style={{
                                            marginLeft: 15,
                                            color:'#333'
                                        }}>支付宝支付</Text>
                                    </View>
                                    <View style={[CommonStyle.flexCenter,{
                                        width:18,
                                        height: 18,
                                        borderWidth: 1,
                                        borderColor: this.state.payWay===2?this.props.theme:'#999',
                                        borderRadius: 9
                                    }]}>
                                        {
                                            this.state.payWay===2
                                                ?
                                                <View style={{
                                                    width:15,
                                                    height:15,
                                                    borderRadius:7.5,
                                                    backgroundColor: this.props.theme
                                                }}></View>
                                                :
                                                null
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[CommonStyle.commonWidth,{
                            marginTop: 25,
                            marginLeft: width*0.03,
                            marginBottom: 110
                        }]}>
                            <Text style={{
                                fontSize: 12,
                                color:'#666'
                            }}>请在支付订单前确保您已阅读<Text style={{color:'#1193E6'}}>退订政策</Text></Text>
                        </View>


                    </ScrollView>
                </KeyboardAwareScrollView>
                <SafeAreaView style={{
                    position:'absolute',
                    left:0,
                    right:0,
                    bottom:0,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f5f5f5'
                }}>
                    <View style={[CommonStyle.flexCenter,{
                        height: 60
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>
                                需支付
                                {
                                    this.isEnjoy
                                    ?
                                        <Text style={{
                                            color:this.props.theme,
                                        }}> ¥{(combinePrice+housePrice+personPrice)-(parseFloat(this.state.balance))}</Text>
                                    :
                                        <Text style={{
                                            color:this.props.theme,
                                        }}> ¥{(combinePrice+housePrice+personPrice+(join.is_discount?parseFloat(join.adult_price):parseFloat(join.adult_price_origin)))-(parseFloat(this.state.balance))}</Text>
                                }

                            </Text>
                            <TouchableOpacity
                                style={[CommonStyle.flexCenter,{
                                    width:130,
                                    height:40,
                                    borderRadius: 6,
                                    backgroundColor: this.props.theme
                                }]}
                                onPress={()=>{
                                    this.getPay()
                                }}
                            >
                                <Text style={{
                                    color:'#fff'
                                }}>确认支付</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    join: state.join.join,
    user:state.user.user,
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(OrderPay)

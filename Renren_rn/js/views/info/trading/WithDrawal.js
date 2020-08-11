import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    RefreshControl, FlatList,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import {connect} from 'react-redux'
import action from '../../../action';
import Toast from 'react-native-easy-toast';
import Modal from 'react-native-modalbox';
const {width} = Dimensions.get('window')
class WithDrawal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            card: [],
            balanceData: '',
            money: '',
            Msg: '',
            bank_id: '',
            bankIndex: 0
        }
    }
    componentDidMount() {
        this.getBalance();
        this.initBankId()
    }
    initBankId() {
        const {bank} = this.props;
        let store = bank['bank'];
        if(!store) {
            store={
                items: [],
                isLoading: false
            }
        }
        if(store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0) {
            this.setState({
                bank_id: store.items.data.data[this.state.bankIndex].bank_id
            })
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
    getBalance(){
        const {token} = this.props
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',1);
        Fetch.post(NewHttp+'balance',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        balanceData: result.data
                    })
                }
            }
        )
    }
    regCard(val) {
        var reg = /^(\d{4})\d+(\d{4})$/;
        return val.replace(reg, "$1 **** **** $2")
    }
    changeMoney(text) {
        const {balanceData} = this.state;
        const due_balance = parseFloat(balanceData.due_balance?balanceData.due_balance:0).toFixed(2);
        if(parseFloat(text) > due_balance) {
            this.refs.toast.show('提现金额已超过最大可提现余额');
            this.setState({
                money: due_balance
            })
        }else {
            this.setState({
                money: text
            })
        }
    }
    drawalAll() {
        const {balanceData} = this.state;
        const due_balance = parseFloat(balanceData.due_balance?balanceData.due_balance:0).toFixed(2);
        this.setState({
            money: due_balance
        })
    }
    goDrawal() {
        if(parseFloat(this.state.money) >= 200) {
            this.refs.drawal.open()
        }else {
            this.refs.toast.show('最低提现额度为200');
        }

    }
    _getInputItem(){
        let inputItem=[];
        let Msg=this.state.Msg;
        //理论上TextInput的长度是多少，这个i就小于它
        for (let i = 0; i < 6; i++) {
            inputItem.push(
                //i是从0开始的所以到最后一个框i的值是5
                //前面的框的右边框设置为0，最后一个边框再将右边框加上
                <View key={i} style={i===5?[styles.textInputView,{borderRightWidth:1}]:[styles.textInputView,{borderRightWidth:0}]}>
                    {i < Msg.length
                        ? <View style={{width: 16,
                            height: 16,
                            backgroundColor: '#222',
                            borderRadius: 8}} />
                        : null}
                </View>)
        }
        return inputItem;
    };
    onEnd() {
        // this.refs.drawal.close();
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('bank_id', this.state.bank_id);
        formData.append('amount', this.state.money);
        formData.append('pay_password', this.state.Msg);
        Fetch.post(NewHttp+'Draw', formData).then(res => {
            this.refs.drawal.close();
            if(res.code === 1) {
                NavigatorUtils.backToUp(this.props, true)
            }else{
                this.refs.toast.show('提现失败,'+res.msg)
            }
        })
    }
    _onClose() {
        this.setState({
            Msg: ''
        })
    }
    clickBank(index, bank_id) {
        this.setState({
            bank_id: bank_id,
            bankIndex: index
        },() => {
            this.refs.bank.close()
        })
    }
    renderBank(data) {
        return <TouchableOpacity style={[CommonStyle.spaceRow,{
            paddingBottom: 23,
            paddingTop: 23,
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f5',
            paddingLeft: width*0.03,
            paddingRight: width*0.03
        }]}
         onPress={() => {
             this.clickBank(data.index, data.item.bank_id)
         }}
        >
            <View style={CommonStyle.flexStart}>
                <View style={{
                    width:18,
                    height:18,
                    borderRadius: 9,
                    backgroundColor:'blue'}}></View>
                <Text style={{
                    marginLeft: 13,
                    color:'#333',
                    fontWeight: 'bold'
                }}>{data.item.bank_name}({this.regCard(data.item.card_number).split(' ')[this.regCard(data.item.card_number).split(' ').length-1]})</Text>
            </View>
            <AntDesign
                name={'right'}
                size={14}
                style={{color:'#666'}}
            />
        </TouchableOpacity>
    }
    render(){
        const {bank} = this.props;
        let store = bank['bank'];
        if(!store) {
            store={
                items: [],
                isLoading: false
            }
        }
        const {balanceData, money, bankIndex} = this.state;
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'余额提现'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <Toast ref="toast" position='center' positionValue={0}/>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={CommonStyle.commonWidth}>
                            {
                                store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                                ?
                                    <TouchableOpacity style={[CommonStyle.spaceRow,{
                                        paddingBottom: 23,
                                        paddingTop: 23,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f5f5f5'
                                    }]}
                                    onPress={() => {
                                        this.refs.bank.open()
                                    }}
                                    >
                                        <View style={CommonStyle.flexStart}>
                                            <View style={{
                                                width:18,
                                                height:18,
                                                borderRadius: 9,
                                                backgroundColor:'blue'}}></View>
                                            <Text style={{
                                                marginLeft: 13,
                                                color:'#333',
                                                fontWeight: 'bold'
                                            }}>{store.items.data.data[bankIndex].bank_name}({this.regCard(store.items.data.data[bankIndex].card_number).split(' ')[this.regCard(store.items.data.data[bankIndex].card_number).split(' ').length-1]})</Text>
                                        </View>
                                        <AntDesign
                                            name={'right'}
                                            size={14}
                                            style={{color:'#666'}}
                                        />
                                    </TouchableOpacity>
                                :
                                    null
                            }
                            <Text style={{
                                color:'#333',
                                fontWeight: 'bold',
                                marginTop: 19.5
                            }}>提现金额</Text>
                            <View style={[CommonStyle.spaceRow,{
                                paddingBottom: 11,
                                paddingTop: 11,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }]}>
                                <Text style={{color:'#333',fontWeight: 'bold'}}>¥</Text>
                                <TextInput
                                    placeholder={'>=200.00'}
                                    keyboardType='numeric'
                                    style={{
                                        width: width*0.94 - 100
                                    }}
                                    defaultValue={this.state.money}
                                    onChangeText={(text)=>{
                                        this.changeMoney(text)
                                    }}
                                />
                                <Text style={{
                                    color:'#1D679F'
                                }} onPress={()=>{
                                    this.drawalAll()
                                }}>全部提现</Text>
                            </View>
                            <Text style={{
                                color:'#666',
                                fontSize: 12,
                                marginTop: 13.5
                            }}>建设银行免手续费，非建设银行收取5元手续费，可提现余额¥{parseFloat(balanceData.due_balance?balanceData.due_balance:0).toFixed(2)}</Text>
                            {
                                store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                                ?
                                    money
                                    ?
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height: 45,
                                            backgroundColor:this.props.theme,
                                            borderRadius: 5,
                                            marginTop: 45
                                        }]} onPress={()=>{
                                            this.goDrawal()
                                        }}>
                                            <Text style={{color:'#fff'}}>预计1到3个工作日到账，确认提现</Text>
                                        </TouchableOpacity>
                                    :
                                        <View style={[CommonStyle.flexCenter,{
                                            height: 45,
                                            backgroundColor:'#dadada',
                                            borderRadius: 5,
                                            marginTop: 45
                                        }]}>
                                            <Text style={{color:'#fff'}}>预计1到3个工作日到账，确认提现</Text>
                                        </View>
                                :
                                    money
                                        ?
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height: 45,
                                            backgroundColor:this.props.theme,
                                            borderRadius: 5,
                                            marginTop: 45
                                        }]}>
                                            <Text style={{color:'#fff'}}>提现到新卡</Text>
                                        </TouchableOpacity>
                                        :
                                        <View style={[CommonStyle.flexCenter,{
                                            height: 45,
                                            backgroundColor:'#dadada',
                                            borderRadius: 5,
                                            marginTop: 45
                                        }]}>
                                            <Text style={{color:'#fff'}}>提现到新卡</Text>
                                        </View>
                            }
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    style={{height:300,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"bank"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.5)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height:300,
                        backgroundColor: '#fff'
                    }}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5'
                        }]}
                        onPress={() => {
                            this.refs.bank.close();
                            NavigatorUtils.goPage({}, 'AddCard')
                        }}
                        >
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{
                                height: 50
                            }]}>
                                <AntDesign
                                    name={'plus'}
                                    size={20}
                                    style={{color:this.props.theme}}
                                />
                                <Text style={{color:this.props.theme}}>添加银行卡</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                            ?
                                <FlatList
                                    data={store.items.data.data}
                                    showsVerticalScrollIndicator = {false}
                                    renderItem={data=>this.renderBank(data)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            :
                                null
                        }

                    </View>
                </Modal>
                <Modal
                    style={{height:210,borderRadius:5,width:'85%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"drawal"}
                    animationDuration={200}
                    position={"center"}
                    backdropColor={'rgba(0,0,0,.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    onClosed={()=>this._onClose()}
                    coverScreen={true}>
                    <View style={{
                        height: 210,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        justifyContent:'flex-start',
                        alignItems:'center'
                    }}>
                        <View style={[CommonStyle.flexCenter,{
                            height:50,
                            width:'100%',
                            borderBottomWidth:1,
                            borderBottomColor:'#f5f5f5'
                        }]}>
                            <Text style={{fontSize:15,color:'#333333'}}>请输入支付密码</Text>
                        </View>
                        <View style={{marginTop:15}}>
                            <Text style={{color:'#333'}}>基金提现</Text>
                        </View>
                        <View style={{marginTop:15}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:'#333'}}>￥ {this.state.money}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',position:'relative',marginTop:15}}>
                            <TextInput
                                style={styles.textInputMsg}
                                ref={ (ref)=>this.textInput = ref }
                                maxLength={7}
                                autoFocus={true}
                                keyboardType="number-pad"
                                defaultValue={this.state.Msg}
                                onChangeText={
                                    (text) => {
                                        this.setState({
                                            Msg:text
                                        },()=>{
                                            if (text.length==6) {
                                                //alert(this.state.Msg)
                                                //this.onEnd(text);
                                                this.onEnd(this.state.Msg,'in')
                                            }
                                        });

                                    }
                                }/>
                            {
                                this._getInputItem()
                            }

                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInputMsg:{
        position:'absolute',
        left:0,right:0,top:0,bottom:0,
        zIndex:5,
        fontSize:1,
        opacity:0
    },
    textInputView:{
        height:85/2,
        width:85/2,
        borderWidth:0.5,
        borderColor:'#f5f5f5',
        justifyContent:'center',
        alignItems:'center',
    },
})
const mapStateToProps = state => ({
    token: state.token.token,
    bank: state.bank,
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    onLoadBank: (storeName, url, data) => dispatch(action.onLoadBank(storeName, url, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(WithDrawal)

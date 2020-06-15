import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    SafeAreaView,
    TextInput,
    AsyncStorage,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Toast, {DURATION} from 'react-native-easy-toast';
import {connect} from 'react-redux';
import Fetch from '../../../../expand/dao/Fetch';
import HttpUrl from '../../../../utils/Http';
import NewHttp from '../../../../utils/NewHttp';
const widthScreen = Dimensions.get('window').width;
type Props = {};
class Settelsecurity extends Component<Props>{
    constructor(props) {
        super(props);
        var newbCodeInter=null;
        this.state={
            token:'',
            userInfo: "",
            bCodeTel:false,
            bCodeTime:60,
            bCode:'',
            password:'',
            repassword:'',
            isLoading:false
        }
    }
    componentWillMount(){
        this.getUserinfo();
    }
    getUserinfo(){
        this.setState({
            isLoading:true
        })
        let formData=new FormData();
        formData.append('token',this.props.token);
        Fetch.post(HttpUrl+'User/get_user',formData).then(
            result=>{
                this.setState({
                    isLoading:false
                })
                if(result.code==1){
                    this.setState({
                        userInfo:result.data[0]
                    })
                }
            }
        )
    }
    sendbCode(){
        this.setState({
            bCodeTel:true
        },()=>{
            let time=this.state.bCodeTime;
            this.newbCodeInter=setInterval(()=>{
                time--;
                this.setState({
                    bCodeTime:time
                })
                if(time==0){
                    this.setState({
                        bCodeTel:false,
                        bCodeTime:60
                    })
                    clearInterval(this.newbCodeInter)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("m_code",86);
        formData.append("mobile",this.state.userInfo.mobile_link);
        formData.append("flag",6);
        //alert(JSON.stringify(formData))
        Fetch.post(HttpUrl+'User/send_msg',formData).then(

        )
    }
    surePassword(){
        if(this.state.password!=this.state.repassword){
            this.refs.toast.show('两次密码输入不相同')
        }else if(this.state.password.length<6||this.state.repassword.length<6){
            this.refs.toast.show('支付密码必须为6位数')
        } else{
            this.setState({
                isLoading:true
            },()=>{
                let formData = new FormData();
                formData.append("token",this.props.token);
                formData.append("m_code",86);
                formData.append("mobile",this.state.userInfo.mobile_link);
                formData.append("sms_code",this.state.bCode);
                formData.append("password",this.state.password);
                formData.append("re_password",this.state.repassword);
                Fetch.post(NewHttp+'PaywordEditCode',formData).then(
                    result=>{
                        if(result.code==1){
                            this.refs.toast.show('修改安全密码成功');
                            let _this=this;
                            this.newbCodeInter=setInterval(()=>{
                                _this.props.navigation.navigate('Securitycenter')
                            },1000)
                        }
                    }
                )
            })
        }
    }
    componentWillUnmount(){
        clearInterval(this.newbCodeInter)
    }
    render(){
        return(
            <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
                <View style={{flex:1,position:'relative'}}>
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <View style={styles.calendarHeader}>
                        <View style={styles.calendarHeaderCon}>
                            <AntDesign
                                name="left"
                                size={19}
                                style={{color:"#333333",width:40}}
                                onPress={()=>{this.props.navigation.state.params.refresh();this.props.navigation.goBack();}}
                            />
                            <Text style={{fontSize:16,color:"#333333"}}>手机号修改安全密码</Text>
                            <View style={{width:40}}></View>
                        </View>
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} bounces={true} >
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:'92%'}}>
                                <View style={{width:'100%',marginTop:25}}>
                                    <View style={{width:'100%',justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                                        <Text style={{color:'#333333',fontSize:16}}>已绑定手机号:</Text>
                                        <View style={{marginLeft:15}}>
                                            <Text style={{fontSize:16,color:'#666666'}}>{this.state.userInfo.mobile_link}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:20}}>
                                    <Text style={{color:'#333333'}}>验证码:</Text>
                                    <View style={{height:40,width:widthScreen*0.92-70-120,backgroundColor:'#ffffff',borderRadius:5}}>
                                        <TextInput
                                            placeholder="请输入验证码"
                                            placeholderTextColor={'#666666'}
                                            editable={true}//是否可编辑
                                            onChangeText={(text)=>this.setState({bCode:text})}//输入框改变触发的函数
                                            keyboardType="number-pad"
                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                        />
                                    </View>
                                    <View style={{width:100,height:40,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                        {
                                            !this.state.bCodeTel
                                                ?
                                                <TouchableHighlight
                                                    underlayColor='rgba(255,255,255,.1)'
                                                    style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                    onPress={() =>{this.sendbCode()}}
                                                >
                                                    <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                </TouchableHighlight>
                                                :
                                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                    {
                                                        this.state.bCodeTel
                                                            ?
                                                            <Text style={{color:'#ffffff'}}>已发送({this.state.bCodeTime})</Text>
                                                            :
                                                            <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                    }

                                                </View>
                                        }

                                    </View>
                                </View>
                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                    <Text style={{color:'#333333'}}>新密码:</Text>
                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                        <TextInput
                                            placeholder="请输入新密码"
                                            placeholderTextColor={'#666666'}
                                            editable={true}//是否可编辑
                                            onChangeText={(text)=>this.setState({password:text})}//输入框改变触发的函数
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            enablesReturnKeyAutomatically={true}
                                            returnKeyType={'send'}
                                            secureTextEntry={true}
                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                        />
                                    </View>
                                </View>
                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                    <Text style={{color:'#333333'}}>确认密码:</Text>
                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                        <TextInput
                                            placeholder="请确认密码"
                                            placeholderTextColor={'#666666'}
                                            editable={true}//是否可编辑
                                            onChangeText={(text)=>this.setState({repassword:text})}//输入框改变触发的函数
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            enablesReturnKeyAutomatically={true}
                                            returnKeyType={'send'}
                                            secureTextEntry={true}
                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                        />
                                    </View>
                                </View>

                                <View style={{width:'100%',height:40,backgroundColor:this.props.theme,marginTop:25,justifyContent:'center',alignItems:'center',position:'relative'}}>

                                    {
                                        this.state.bCode&&this.state.password&&this.state.repassword
                                            ?
                                            <TouchableHighlight
                                                underlayColor='rgba(255,255,255,.1)'
                                                style={{width:'100%',height:40,justifyContent:'center',alignItems:'center'}}
                                                onPress={() =>{this.surePassword()}}
                                            >
                                                <Text style={{color:'#ffffff'}}>确定</Text>
                                            </TouchableHighlight>
                                            :
                                            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(255,255,255,.4)'}}>
                                                <Text style={{color:'#ffffff'}}>确定</Text>
                                            </View>
                                    }
                                </View>

                            </View>
                        </View>
                    </ScrollView>
                    {
                        this.state.isLoading
                            ?
                            <View style={{position:'absolute',left:0,top:0,right:0,bottom:0,justifyContent:'center',alignItems:'center'}}>
                                <ActivityIndicator color="#999" size="small"/>
                            </View>
                            :
                            null
                    }

                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    calendarHeader:{
        height:50,
        width:widthScreen,
        backgroundColor:"#ffffff",
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor: "#f5f5f5",
        borderBottomWidth:1
    },
    calendarHeaderCon:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        width:widthScreen*0.92
    },

});
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Settelsecurity)

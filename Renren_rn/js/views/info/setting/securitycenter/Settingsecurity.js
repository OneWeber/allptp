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
import Fetch from '../../../../expand/dao/Fetch';
import HttpUrl from '../../../../utils/Http';
import NewHttp from '../../../../utils/NewHttp';
import {connect} from 'react-redux';
const widthScreen = Dimensions.get('window').width;
type Props = {};
class Settingsecurity extends Component<Props>{
    constructor(props) {
        super(props);
        var codingTelInter=null;
        var codingEmailInter=null
        this.state={
            userInfo:'',
            token:'',
            isTeling:false,
            isEmailing:false,
            isBoth:false,
            codingTelTime:60,
            codingEmailTime:60,
            isTelCoding:false,
            isEmailCoding:false,
            isPass:false,
            code:'',
            isChecking:false,
            emailcode:'',

        }
    }
    componentWillMount(){
        this.getUserinfo();
        if(this.props.navigation.state.params.check){
            this.setState({
                isPass:false
            })
        }else{
            this.setState({
                isPass:true
            })
        }

    }
    getUserinfo(){
        let formData=new FormData();
        formData.append('token',this.props.token);
        Fetch.post(HttpUrl+'User/get_user',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        userInfo:result.data[0]
                    },()=>{
                        if(this.state.userInfo.mobile_link&&!this.state.userInfo.email_link){
                            this.setState({
                                isTeling:true,
                                isEmailing:false,
                                isBoth:false
                            },()=>{
                                if(this.props.navigation.state.params.check){
                                    this.telCoding();
                                }
                            })
                        }else if(!this.state.userInfo.mobile_link&&this.state.userInfo.email_link){
                            this.setState({
                                isTeling:false,
                                isEmailing:true,
                                isBoth:false
                            },()=>{
                                if(this.props.navigation.state.params.check){
                                    this.emailCoding();
                                }

                            })
                        }else if(this.state.userInfo.mobile_link&&this.state.userInfo.email_link){
                            this.setState({
                                isTeling:true,
                                isEmailing:false,
                                isBoth:true
                            },()=>{
                                if(this.props.navigation.state.params.check){
                                    this.telCoding();
                                }

                            })
                        }
                    })
                }
            }
        )
    }
    telCoding(){
        this.setState({
            isTelCoding:true
        },()=>{
            let time=this.state.codingTelTime;
            this.codingTelInter=setInterval(()=>{
                time--;
                this.setState({
                    codingTelTime:time
                })
                if(time==0){
                    this.setState({
                        codingTelTime:60,
                        isTelCoding:false
                    })
                    clearInterval(this.codingTelInter)
                }
            },1000)
        })

        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("m_code",86);
        formData.append("mobile",this.state.userInfo.mobile_link);
        formData.append("flag",6);
        Fetch.post(HttpUrl+'User/send_msg',formData).then(

        )
    }
    emailCoding(){
        this.setState({
            isEmailCoding:true
        },()=>{
            let time=this.state.codingEmailTime;
            this.codingEmailInter=setInterval(()=>{
                time--;
                this.setState({
                    codingEmailTime:time
                })
                if(time==0){
                    this.setState({
                        codingEmailTime:60,
                        isEmailCoding:false
                    })
                    clearInterval(this.codingEmailInter)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("toemail",this.state.userInfo.email_link);
        formData.append("flag",5);
        Fetch.post(NewHttp+'email',formData).then(

        )
    }
    checkCode(){
        this.setState({
            isChecking:true
        },()=>{
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("m_code",86);
            formData.append("mobile",this.state.userInfo.mobile_link);
            formData.append("sms_code",this.state.code);
            Fetch.post(NewHttp+'VeriMobileCode',formData).then(
                result=>{
                    this.setState({
                        isChecking:false
                    })
                    if(result.code==1){
                        this.setState({
                            isPass:true
                        })
                    }
                }
            )
        })
    }
    toSet(){
        if(this.state.userInfo.is_setpwd==1){
            this.refs.toast.show('已设置安全密码，可修改安全密码');
        }else{
            let _this=this;
            this.props.navigation.navigate('Setsecurity',{
                refresh: function () {
                    _this.getUserinfo();
                }
            })
        }

    }
    toChange(){
        if(this.state.userInfo.is_setpwd==1){
            let _this=this;
            this.props.navigation.navigate('Changesecurity',{
                refresh: function () {
                    _this.getUserinfo();
                }
            });
        }else{
            this.refs.toast.show('请先设置安全密码');
        }
    }
    toChangeTel(){
        if(this.state.userInfo.is_setpwd==1){
            let _this=this;
            this.props.navigation.navigate('Settelsecurity',{
                refresh: function () {
                    _this.getUserinfo();
                }
            });
        }else{
            this.refs.toast.show('请先设置安全密码');
        }
    }
    toEmailChange(){
        if(this.state.userInfo.is_setpwd==1){
            let _this=this;
            this.props.navigation.navigate('Emailchangesecurity',{
                refresh: function () {
                    _this.getUserinfo();
                }
            });
        }else{
            this.refs.toast.show('请先设置安全密码');
        }
    }
    checkEmailCode(){
        this.setState({
            isChecking:true,
        },()=>{
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("email",this.state.userInfo.email_link);
            formData.append("sms_code",this.state.emailcode);
            Fetch.post(NewHttp+'VeriEmailCode',formData).then(
                result=>{
                    this.setState({
                        isChecking:false
                    })
                    if(result.code==1){
                        this.setState({
                            isPass:true
                        })
                    }
                }
            )
        })
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor: '#fff'}}>
                <View style={{flex:1,position:'relative'}}>
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <View style={styles.calendarHeader}>
                        <View style={styles.calendarHeaderCon}>
                            <AntDesign
                                name="left"
                                size={19}
                                style={{color:"#333333",width:40}}
                                onPress={()=>{this.props.navigation.goBack()}}
                            />
                            <Text style={{fontSize:16,color:"#333333"}}>设置/修改安全密码</Text>
                            <View style={{width:40}}></View>
                        </View>
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} bounces={true} >
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                            {
                                this.state.isPass
                                    ?
                                    <View style={{width:'100%'}}>
                                        <TouchableHighlight
                                            underlayColor='rgba(255,255,255,.1)'
                                            style={{width:'100%',height:55,justifyContent:'center',alignItems:'center'}}
                                            onPress={() =>{this.toSet()}}
                                        >
                                            <View style={{width:'100%',height:55,borderBottomWidth:1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                                <Text style={{marginLeft:widthScreen*0.04,color:'#333333'}}>设置安全密码</Text>
                                                <AntDesign
                                                    name="right"
                                                    size={14}
                                                    style={{color:"#999999",marginRight:widthScreen*0.04}}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor='rgba(255,255,255,.1)'
                                            style={{width:'100%',height:55,justifyContent:'center',alignItems:'center'}}
                                            onPress={() =>{this.toChange()}}
                                        >
                                            <View style={{width:'100%',height:55,borderBottomWidth:1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                                <Text style={{marginLeft:widthScreen*0.04,color:'#333333'}}>原始密码修改安全密码</Text>
                                                <AntDesign
                                                    name="right"
                                                    size={14}
                                                    style={{color:"#999999",marginRight:widthScreen*0.04}}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor='rgba(255,255,255,.1)'
                                            style={{width:'100%',height:55,justifyContent:'center',alignItems:'center'}}
                                            onPress={() =>{this.toChangeTel()}}
                                        >
                                            <View style={{width:'100%',height:55,borderBottomWidth:1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                                <Text style={{marginLeft:widthScreen*0.04,color:'#333333'}}>手机号修改安全密码</Text>
                                                <AntDesign
                                                    name="right"
                                                    size={14}
                                                    style={{color:"#999999",marginRight:widthScreen*0.04}}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor='rgba(255,255,255,.1)'
                                            style={{width:'100%',height:55,justifyContent:'center',alignItems:'center'}}
                                            onPress={() =>{this.toEmailChange()}}
                                        >
                                            <View style={{width:'100%',height:55,borderBottomWidth:1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                                <Text style={{marginLeft:widthScreen*0.04,color:'#333333'}}>邮箱修改安全密码</Text>
                                                <AntDesign
                                                    name="right"
                                                    size={14}
                                                    style={{color:"#999999",marginRight:widthScreen*0.04}}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    :
                                    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                        {
                                            this.state.isTeling
                                                ?
                                                <View style={{width:'92%'}}>
                                                    <Text style={{color:'#333333',marginTop:15,lineHeight:20}}>为确认您的账号安全，请填写您当前绑定的手机号获取的验证码。</Text>
                                                    <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:20}}>
                                                        <Text style={{color:'#333333'}}>验证码:</Text>
                                                        <View style={{height:40,width:widthScreen*0.92-70-100,backgroundColor:'#ffffff',borderRadius:5}}>
                                                            <TextInput
                                                                placeholder="请输入验证码"
                                                                placeholderTextColor={'#666666'}
                                                                editable={true}//是否可编辑
                                                                onChangeText={(text)=>this.setState({code:text})}//输入框改变触发的函数
                                                                keyboardType="number-pad"
                                                                style={{width:'100%',height:40,borderRadius:5,backgroundColor:'#ffffff',color:'#666666',paddingLeft:5,borderStyle:'solid',borderWidth:1,borderColor:'#f5f5f5'}}
                                                            />
                                                        </View>
                                                        <View style={{width:80,height:40,backgroundColor:'#ffffff',borderRadius:5,justifyContent:'flex-end',alignItems:'center',flexDirection:'row',position:'relative'}}>
                                                            {
                                                                !this.state.isTelCoding
                                                                    ?
                                                                    <TouchableHighlight
                                                                        underlayColor='rgba(255,255,255,.1)'
                                                                        style={{width:'100%',height:40,borderRadius:5,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}
                                                                        onPress={() =>{this.telCoding()}}
                                                                    >
                                                                        <Text style={{color:this.props.theme}}>发送验证码</Text>
                                                                    </TouchableHighlight>
                                                                    :
                                                                    <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                                                                        {
                                                                            this.state.isTelCoding
                                                                                ?
                                                                                <Text style={{color:this.props.theme}}>已发送({this.state.codingTelTime})</Text>
                                                                                :
                                                                                <Text style={{color:this.props.theme}}>发送验证码</Text>
                                                                        }

                                                                    </View>
                                                            }

                                                        </View>
                                                    </View>
                                                    <View style={{width:'100%',height:40,backgroundColor:this.props.theme,marginTop:30,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                        {
                                                            this.state.code
                                                                ?
                                                                <TouchableHighlight
                                                                    underlayColor='rgba(255,255,255,.1)'
                                                                    style={{width:'100%',height:40,justifyContent:'center',alignItems:'center'}}
                                                                    onPress={() =>{this.checkCode()}}
                                                                >
                                                                    <Text style={{color:'#ffffff'}}>确定</Text>
                                                                </TouchableHighlight>
                                                                :
                                                                <View style={{position:'absolute',left:0,right:0,bottom:0,top:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(255,255,255,.4)'}}>
                                                                    <Text style={{color:'#ffffff'}}>确定</Text>
                                                                </View>
                                                        }

                                                    </View>

                                                </View>
                                                :
                                                <View style={{width:'92%'}}>
                                                    <Text style={{color:'#333333',marginTop:15,lineHeight:20}}>为确认您的账号安全，请填写您当前绑定的邮箱获取的验证码。</Text>
                                                    <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:20}}>
                                                        <Text style={{color:'#333333'}}>验证码:</Text>
                                                        <View style={{height:40,width:widthScreen*0.92-70-100,backgroundColor:'#ffffff',borderRadius:5}}>
                                                            <TextInput
                                                                placeholder="请输入验证码"
                                                                placeholderTextColor={'#666666'}
                                                                editable={true}//是否可编辑
                                                                onChangeText={(text)=>this.setState({emailcode:text})}//输入框改变触发的函数
                                                                keyboardType="number-pad"
                                                                style={{width:'100%',height:40,borderRadius:5,backgroundColor:'#ffffff',color:'#666666',paddingLeft:5,borderStyle:'solid',borderWidth:1,borderColor:'#f5f5f5'}}
                                                            />
                                                        </View>
                                                        <View style={{width:80,height:40,backgroundColor:'#ffffff',borderRadius:5,justifyContent:'flex-end',alignItems:'center',flexDirection:'row',position:'relative'}}>
                                                            {
                                                                !this.state.isemailCoding
                                                                    ?
                                                                    <TouchableHighlight
                                                                        underlayColor='rgba(255,255,255,.1)'
                                                                        style={{width:'100%',height:40,borderRadius:5,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}
                                                                        onPress={() =>{this.emailCoding()}}
                                                                    >
                                                                        <Text style={{color:this.props.theme}}>发送验证码</Text>
                                                                    </TouchableHighlight>
                                                                    :
                                                                    <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                                                                        {
                                                                            this.state.isTelCoding
                                                                                ?
                                                                                <Text style={{color:this.props.theme}}>已发送({this.state.codingEmailTime})</Text>
                                                                                :
                                                                                <Text style={{color:this.props.theme}}>发送验证码</Text>
                                                                        }

                                                                    </View>
                                                            }

                                                        </View>

                                                        <View style={{width:'100%',height:40,backgroundColor:this.props.theme,marginTop:30,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                            {
                                                                this.state.emailcode
                                                                    ?
                                                                    <TouchableHighlight
                                                                        underlayColor='rgba(255,255,255,.1)'
                                                                        style={{width:'100%',height:40,justifyContent:'center',alignItems:'center'}}
                                                                        onPress={() =>{this.checkEmailCode()}}
                                                                    >
                                                                        <Text style={{color:'#ffffff'}}>确定</Text>
                                                                    </TouchableHighlight>
                                                                    :
                                                                    <View style={{position:'absolute',left:0,right:0,bottom:0,top:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(255,255,255,.4)'}}>
                                                                        <Text style={{color:'#ffffff'}}>确定</Text>
                                                                    </View>
                                                            }

                                                        </View>


                                                    </View>
                                                </View>
                                        }
                                    </View>
                            }

                        </View>
                    </ScrollView>
                    {
                        this.state.isChecking
                            ?
                            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,justifyContent:'center',alignItems:'center'}}>
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
})
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Settingsecurity)

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    SafeAreaView,
    TextInput, AsyncStorage, TouchableHighlight, Image, ActivityIndicator,
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Fetch from '../../../../expand/dao/Fetch';
import HttpUrl from '../../../../utils/Http';
import NewHttp from '../../../../utils/NewHttp';
import {connect} from 'react-redux';
const widthScreen = Dimensions.get('window').width;
type Props = {};
class Bindemail extends Component<Props>{
    constructor(props) {
        super(props);
        let timeInterEmail=null;
        let newtTimeInterEmail=null;
        let btTimeInterEmail = null
        this.state={
            token:'',
            isLoading:false,
            userInfo:'',
            isChange:false,
            emailCode:'',
            smsCodeEmail:false,
            newEmailVal:'',
            newSmsCodeEmail:false,
            emailSmsTime:60,
            newEmailSmsTime:60,
            newEmailCode:'',
            bEmailVal:'',
            bEmailCode:'',
            bSmsCodeEmail:false,
            bEmailSmsTime:60,
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
    emailSmsCode(){
        this.setState({
            smsCodeEmail:true
        },()=>{
            let time=this.state.emailSmsTime;
            this.timeInterEmail=setInterval(()=>{
                time--;
                this.setState({
                    emailSmsTime:time
                })
                if(time==0){
                    this.setState({
                        smsCodeEmail:false,
                        emailSmsTime:60
                    })
                    clearInterval(this.timeInterEmail)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("toemail",this.state.userInfo.email_link);
        formData.append("flag",3);
        Fetch.post(NewHttp+'email',formData).then(

        )
    }
    newEmailSmsCode(){
        this.setState({
            newSmsCodeEmail:true
        },()=>{
            let time=this.state.emailSmsTime;
            this.btTimeInterEmail=setInterval(()=>{
                time--;
                this.setState({
                    newEmailSmsTime:time
                })
                if(time==0){
                    this.setState({
                        newSmsCodeEmail:false,
                        newEmailSmsTime:60
                    })
                    clearInterval(this.newtTimeInterEmail)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("toemail",this.state.newEmailVal);
        formData.append("flag",4);
        Fetch.post(NewHttp+'email',formData).then(

        )
    }
    bEmailSmsCode() {
        this.setState({
            bSmsCodeEmail:true
        },()=>{
            let time=this.state.emailSmsTime;
            this.btTimeInterEmail=setInterval(()=>{
                time--;
                this.setState({
                    bEmailSmsTime:time
                })
                if(time==0){
                    this.setState({
                        bSmsCodeEmail:false,
                        bEmailSmsTime:60
                    })
                    clearInterval(this.btTimeInterEmail)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("toemail",this.state.bEmailVal);
        formData.append("flag",4);
        Fetch.post(NewHttp+'email',formData).then(

        )
    }
    bindEmail() {
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("email",this.state.bEmailVal);
        formData.append("sms_code",this.state.bEmailCode);
        Fetch.post(NewHttp+ 'BindEmail', formData).then(res => {
            if(res.code === 1) {
                this.getUserinfo();
                this.setState({
                    isChange:false
                })
            }else{
                console.log(res.msg)
            }
        })
    }
    changeEmail(){
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("email_original",this.state.userInfo.email_link);
        formData.append("sms_code_original",this.state.emailCode);
        formData.append("email",this.state.newEmailVal);
        formData.append("sms_code",this.state.newEmailCode);
        Fetch.post(NewHttp+'BindEditEmail',formData).then(
            result=>{
                if(result.code==1){
                    this.getUserinfo();
                    this.setState({
                        isChange:false
                    })
                }
            }
        )
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <View style={{flex:1,position:'relative'}}>
                    <View style={styles.calendarHeader}>
                        <View style={styles.calendarHeaderCon}>
                            <AntDesign
                                name="left"
                                size={19}
                                style={{color:"#333333",width:40}}
                                onPress={()=>{this.props.navigation.state.params.refresh();this.props.navigation.goBack()}}
                            />
                            <Text style={{fontSize:16,color:"#333333"}}>绑定邮箱</Text>
                            <View style={{width:40}}></View>
                        </View>
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} bounces={true} >
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:widthScreen*0.92,justifyContent:'center',alignItems:'center'}}>
                                {
                                    this.state.userInfo.email_link&&!this.state.isChange
                                        ?
                                        <View style={{width:'100%',marginTop:25}}>
                                            <View style={{width:'100%',justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                                                <Text style={{color:'#333333',fontSize:16}}>已绑定邮箱:</Text>
                                                <View style={{marginLeft:15}}>
                                                    <Text style={{color:'#666666',fontSize:16}}>{this.state.userInfo.email_link}</Text>
                                                </View>
                                            </View>
                                            <View style={{width:'100%',height:40,marginTop:20,backgroundColor:'#ff5a5f',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                                <TouchableHighlight
                                                    style={{ height:40,width:'100%',alignItems:'center',justifyContent:'center'}}
                                                    underlayColor='rgba(0,0,0,.1)'
                                                    onPress={() =>{this.setState({isChange:true})}}
                                                >
                                                    <Text style={{color:'#ffffff'}}>更换邮箱绑定</Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        :
                                        this.state.userInfo.email_link&&this.state.isChange
                                            ?
                                            <View style={{width:'100%',marginTop:25}}>
                                                <View style={{width:'100%',justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                                                    <Text style={{color:'#333333',fontSize:16}}>已绑定邮箱:</Text>
                                                    <View style={{marginLeft:15}}>
                                                        <Text style={{color:'#666666',fontSize:16}}>{this.state.userInfo.email_link}</Text>
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>旧验证码:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70-120,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入邮箱验证码"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({emailCode:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                    <View style={{width:100,height:40,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                        {
                                                            !this.state.smsCodeEmail
                                                                ?
                                                                <TouchableHighlight
                                                                    underlayColor='rgba(255,255,255,.1)'
                                                                    style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                    onPress={() =>{this.emailSmsCode()}}
                                                                >
                                                                    <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                </TouchableHighlight>
                                                                :
                                                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                    {
                                                                        this.state.smsCodeEmail
                                                                            ?
                                                                            <Text style={{color:'#ffffff'}}>已发送({this.state.emailSmsTime})</Text>
                                                                            :
                                                                            <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                    }

                                                                </View>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>新邮箱:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入新邮箱地址"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({newEmailVal:text})}//输入框改变触发的函数
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>新验证码:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70-120,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入邮箱验证码"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({newEmailCode:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                    <View style={{width:100,height:40,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                        {
                                                            this.state.newEmailVal&&!this.state.newSmsCodeEmail
                                                                ?
                                                                <TouchableHighlight
                                                                    underlayColor='rgba(255,255,255,.1)'
                                                                    style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                    onPress={() =>{this.newEmailSmsCode()}}
                                                                >
                                                                    <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                </TouchableHighlight>
                                                                :
                                                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                    {
                                                                        this.state.newSmsCodeEmail
                                                                            ?
                                                                            <Text style={{color:'#ffffff'}}>已发送({this.state.newEmailSmsTime})</Text>
                                                                            :
                                                                            <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                    }

                                                                </View>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',height:40,marginTop:20,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                    {
                                                        this.state.emailCode&&this.state.newEmailCode&&this.state.newEmailVal
                                                            ?
                                                            <TouchableHighlight
                                                                underlayColor='rgba(255,255,255,.1)'
                                                                style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                onPress={() =>{this.changeEmail()}}
                                                            >
                                                                <Text style={{color:'#ffffff'}}>确认绑定</Text>
                                                            </TouchableHighlight>
                                                            :
                                                            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                <Text style={{color:'#ffffff'}}>确认绑定</Text>
                                                            </View>
                                                    }

                                                </View>


                                            </View>
                                            :
                                            <View style={{width:'100%',marginTop:25}}>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40}}>
                                                    <Text style={{color:'#333333'}}>邮箱地址:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入邮箱地址"
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({bEmailVal:text})}//输入框改变触发的函数
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>验证码:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70-120,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入邮箱验证码"
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({bEmailCode:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                    <View style={{width:100,height:40,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                        {
                                                            this.state.bEmailVal&&!this.state.bSmsCodeEmail
                                                                ?
                                                                <TouchableHighlight
                                                                    underlayColor='rgba(255,255,255,.1)'
                                                                    style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                    onPress={() =>{this.bEmailSmsCode()}}
                                                                >
                                                                    <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                </TouchableHighlight>
                                                                :
                                                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                    {
                                                                        this.state.bSmsCodeEmail
                                                                            ?
                                                                            <Text style={{color:'#ffffff'}}>已发送({this.state.bEmailSmsTime})</Text>
                                                                            :
                                                                            <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                    }

                                                                </View>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',height:40,marginTop:20,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                    {
                                                        this.state.bEmailVal&&this.state.bEmailCode
                                                            ?
                                                            <TouchableHighlight
                                                                underlayColor='rgba(255,255,255,.1)'
                                                                style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                onPress={() =>{this.bindEmail()}}
                                                            >
                                                                <Text style={{color:'#ffffff'}}>确认绑定</Text>
                                                            </TouchableHighlight>
                                                            :
                                                            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                <Text style={{color:'#ffffff'}}>确认绑定</Text>
                                                            </View>
                                                    }

                                                </View>

                                            </View>
                                }
                            </View>
                        </View>
                    </ScrollView>
                    {
                        this.state.isLoading
                            ?
                            <View style={{position:'absolute',left:0,right:0,top:50,bottom:0,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
                                <ActivityIndicator size={'small'} color={'#999'}/>
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
export default connect(mapStateToProps)(Bindemail)

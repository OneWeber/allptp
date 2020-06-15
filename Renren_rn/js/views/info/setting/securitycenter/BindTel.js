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
import {connect} from 'react-redux'
const widthScreen = Dimensions.get('window').width;
type Props = {};
class Bindtel extends Component<Props>{
    constructor(props) {
        super(props);
        var timeInter=null;
        var bCodeInter=null;
        var newbCodeInter=null
        this.state={
            token:'',
            userInfo:'',
            isChange:false,
            codeVal:'',
            telVal:'',
            telCode:'',
            smsTime:60,
            smscodeTel:false,
            isLoading:false,
            newTel:'',
            bCode:'',
            bCodeTel:false,
            bCodeTime:60,
            bCodeVal:'',
            newbCodeTel:false,
            newbCodeTime:60,
            bcodetelCode:''
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
    bCodes(){
        this.setState({
            bCodeTel:true
        },()=>{
            let time=this.state.bCodeTime;
            this.bCodeInter=setInterval(()=>{
                time--;
                this.setState({
                    bCodeTime:time
                })
                if(time==0){
                    this.setState({
                        bCodeTel:false,
                        bCodeTime:60
                    })
                    clearInterval(this.bCodeInter)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("m_code",86);
        formData.append("mobile",this.state.userInfo.mobile_link);
        formData.append("flag",5);
        Fetch.post(HttpUrl+'User/send_msg',formData).then(

        )
    }
    telSmscode(){
        this.setState({
            smscodeTel:true
        },()=>{
            let time=this.state.smsTime;
            this.timeInter=setInterval(()=>{
                time--;
                this.setState({
                    smsTime:time
                })
                if(time==0){
                    this.setState({
                        smscodeTel:false,
                        smsTime:60
                    })
                    clearInterval(this.timeInter)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("m_code",86);
        formData.append("mobile",this.state.telVal);
        formData.append("flag",5);
        Fetch.post(HttpUrl+'User/send_msg',formData).then(

        )
    }
    bindTel(){
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('m_code',this.state.codeVal);
        formData.append('mobile',this.state.telVal);
        formData.append('sms_code',this.state.telCode);
        Fetch.post(NewHttp+'BindMobile',formData).then(
            result=>{
                if(result.code==1){
                    this.refs.toast.show('绑定手机号成功')
                    this.getUserinfo();
                    this.setState({
                        isChange:false
                    })
                }else{
                    this.refs.toast.show(result.msg)
                }
            }
        )
    }
    newTelSmscode(){
        this.setState({
            newbCodeTel:true
        },()=>{
            let time=this.state.newbCodeTime;
            this.newbCodeInter=setInterval(()=>{
                time--;
                this.setState({
                    newbCodeTime:time
                })
                if(time==0){
                    this.setState({
                        newbCodeTel:false,
                        newbCodeTime:60
                    })
                    clearInterval(this.newbCodeInter)
                }
            },1000)
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("m_code",86);
        formData.append("mobile",this.state.newTel);
        formData.append("flag",4);
        Fetch.post(HttpUrl+'User/send_msg',formData).then(

        )
    }
    changebindTel(){
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("m_code_original",86);
        formData.append("mobile_original",this.state.userInfo.mobile_link);
        formData.append("sms_code_original",this.state.bCode);
        formData.append("m_code",86);
        formData.append("mobile",this.state.newTel);
        formData.append("sms_code",this.state.bcodetelCode);
        Fetch.post(NewHttp+'BindEditMobile',formData).then(
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
                <Toast ref="toast" position='center' positionValue={0} />
                <View style={{flex:1,position:'relative'}}>
                    <View style={styles.calendarHeader}>
                        <View style={styles.calendarHeaderCon}>
                            <AntDesign
                                name="left"
                                size={19}
                                style={{color:"#333333",width:40}}
                                onPress={()=>{this.props.navigation.state.params.refresh();this.props.navigation.goBack()}}
                            />
                            <Text style={{fontSize:16,color:"#333333"}}>绑定手机号</Text>
                            <View style={{width:40}}></View>
                        </View>
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} bounces={true} >
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:widthScreen*0.92,justifyContent:'center',alignItems:'center'}}>
                                {
                                    this.state.userInfo.mobile_link&&!this.state.isChange
                                        ?
                                        <View style={{width:'100%',marginTop:25}}>
                                            <View style={{width:'100%',justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                                                <Text style={{color:'#333333',fontSize:16}}>已绑定手机号:</Text>
                                                <View style={{marginLeft:15}}>
                                                    <Text style={{fontSize:16,color:'#666666'}}>{this.state.userInfo.mobile_link}</Text>
                                                </View>
                                            </View>
                                            <View style={{width:'100%',height:40,marginTop:20,backgroundColor:'#ff5a5f',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                                <TouchableHighlight
                                                    style={{ height:40,width:'100%',alignItems:'center',justifyContent:'center'}}
                                                    underlayColor='rgba(0,0,0,.1)'
                                                    onPress={() =>{this.setState({isChange:true})}}
                                                >
                                                    <Text style={{color:'#ffffff'}}>更换手机号绑定</Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        :
                                        this.state.userInfo.mobile_link&&this.state.isChange
                                            ?
                                            <View style={{width:'100%'}}>
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
                                                                    onPress={() =>{this.bCodes()}}
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
                                                    <Text style={{color:'#333333'}}>区号:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入区号"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({bCodeVal:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>新手机号:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入新的手机号"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({newTel:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:20}}>
                                                    <Text style={{color:'#333333'}}>验证码:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70-120,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入验证码"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({bcodetelCode:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                    <View style={{width:100,height:40,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                        {
                                                            this.state.bCodeVal&&this.state.newTel&&this.state.bCode&&!this.state.newbCodeTel
                                                                ?
                                                                <TouchableHighlight
                                                                    underlayColor='rgba(255,255,255,.1)'
                                                                    style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                    onPress={() =>{this.newTelSmscode()}}
                                                                >
                                                                    <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                </TouchableHighlight>
                                                                :
                                                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                    {
                                                                        this.state.newTel
                                                                            ?
                                                                            <Text style={{color:'#ffffff'}}>已发送({this.state.newbCodeTime})</Text>
                                                                            :
                                                                            <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                    }

                                                                </View>
                                                        }

                                                    </View>
                                                </View>
                                                <View style={{width:'100%',height:40,marginTop:20,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                    {
                                                        this.state.bCode&&this.state.bCodeVal&&this.state.newTel&&this.state.bcodetelCode
                                                            ?
                                                            <TouchableHighlight
                                                                underlayColor='rgba(255,255,255,.1)'
                                                                style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                onPress={() =>{this.changebindTel()}}
                                                            >
                                                                <Text style={{color:'#ffffff'}}>确认换绑</Text>
                                                            </TouchableHighlight>
                                                            :
                                                            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                <Text style={{color:'#ffffff'}}>确认换绑</Text>
                                                            </View>
                                                    }

                                                </View>

                                                <View style={{width:'100%',height:40,marginTop:20,backgroundColor:'#f5f5f5',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                                    <TouchableHighlight
                                                        style={{ height:40,width:'100%',alignItems:'center',justifyContent:'center'}}
                                                        underlayColor='rgba(0,0,0,.1)'
                                                        onPress={() =>{this.setState({isChange:false})}}
                                                    >
                                                        <Text style={{color:'#333333'}}>取消</Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                            :
                                            <View style={{width:'100%'}}>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40}}>
                                                    <Text style={{color:'#333333'}}>区号:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入区号"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({codeVal:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>手机号:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入手机号"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({telVal:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                                    <Text style={{color:'#333333'}}>验证码:</Text>
                                                    <View style={{height:40,width:widthScreen*0.92-70-120,backgroundColor:'#ffffff',borderRadius:5}}>
                                                        <TextInput
                                                            placeholder="请输入验证码"
                                                            placeholderTextColor={'#666666'}
                                                            editable={true}//是否可编辑
                                                            onChangeText={(text)=>this.setState({telCode:text})}//输入框改变触发的函数
                                                            keyboardType="number-pad"
                                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5}}
                                                        />
                                                    </View>
                                                    <View style={{width:100,height:40,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                        {
                                                            this.state.codeVal&&this.state.telVal&&!this.state.smscodeTel
                                                                ?
                                                                <TouchableHighlight
                                                                    underlayColor='rgba(255,255,255,.1)'
                                                                    style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                    onPress={() =>{this.telSmscode()}}
                                                                >
                                                                    <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                </TouchableHighlight>
                                                                :
                                                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:5,backgroundColor:'rgba(255,255,255,.5)',justifyContent:'center',alignItems:'center'}}>
                                                                    {
                                                                        this.state.smscodeTel
                                                                            ?
                                                                            <Text style={{color:'#ffffff'}}>已发送({this.state.smsTime})</Text>
                                                                            :
                                                                            <Text style={{color:'#ffffff'}}>发送验证码</Text>
                                                                    }

                                                                </View>
                                                        }

                                                    </View>
                                                </View>
                                                <View style={{width:'100%',height:40,marginTop:20,backgroundColor:this.props.theme,borderRadius:5,justifyContent:'center',alignItems:'center',position:'relative'}}>
                                                    {
                                                        this.state.codeVal&&this.state.telVal&&this.state.telCode
                                                            ?
                                                            <TouchableHighlight
                                                                underlayColor='rgba(255,255,255,.1)'
                                                                style={{width:'100%',height:40,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                                onPress={() =>{this.bindTel()}}
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
                            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
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
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(Bindtel)

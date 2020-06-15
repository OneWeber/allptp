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
import NewHttp from '../../../../utils/NewHttp';
const widthScreen = Dimensions.get('window').width;
type Props = {};
class Changesecurity extends Component<Props>{
    constructor(props) {
        super(props);
        var newbCodeInter=null;
        this.state={
            token:'',
            oldPassword:'',
            newPassword:'',
            re_password:'',
            isLoading:false
        }
    }
    sureChange(){
        if(this.state.newPassword!=this.state.re_password){
            this.refs.toast.show('两次密码输入不相同~')
        }else if(this.state.newPassword.length<6||this.state.re_password.length<6){
            this.refs.toast.show('支付密码必须为6位数')
        }else{
            this.setState({
                isLoading:true
            },()=>{
                let formData = new FormData();
                formData.append("token",this.props.token);
                formData.append("ori_password",this.state.oldPassword);
                formData.append("password",this.state.newPassword);
                formData.append("re_password",this.state.re_password);
                Fetch.post(NewHttp+'PaywordEdit',formData).then(
                    result=>{
                        this.setState({
                            isLoading:false
                        })
                        if(result.code==1){
                            this.refs.toast.show('修改安全密码成功');
                            let _this=this;
                            _this.newbCodeInter=setInterval(()=>{
                                _this.props.navigation.navigate('Securitycenter')
                            },1000)
                        }else{
                            this.refs.toast.show(result.msg);
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
            <SafeAreaView style={{flex:1,backgroundColor: '#fff'}}>
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
                            <Text style={{fontSize:16,color:"#333333"}}>原始密码修改安全密码</Text>
                            <View style={{width:40}}></View>
                        </View>
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} bounces={true} >
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:'92%'}}>
                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                    <Text style={{color:'#333333'}}>原始密码:</Text>
                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                        <TextInput
                                            placeholder="请输入原始密码"
                                            placeholderTextColor={'#666666'}
                                            editable={true}//是否可编辑
                                            onChangeText={(text)=>this.setState({oldPassword:text})}//输入框改变触发的函数
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            underlineColorAndroid='transparent'
                                            enablesReturnKeyAutomatically={true}
                                            returnKeyType={'send'}
                                            secureTextEntry={true}
                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5,borderWidth:1,borderColor:'#f5f5f5'}}
                                        />
                                    </View>
                                </View>
                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                    <Text style={{color:'#333333'}}>新密码:</Text>
                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                        <TextInput
                                            placeholder="请输入新密码"
                                            placeholderTextColor={'#666666'}
                                            editable={true}//是否可编辑
                                            onChangeText={(text)=>this.setState({newPassword:text})}//输入框改变触发的函数
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            underlineColorAndroid='transparent'
                                            enablesReturnKeyAutomatically={true}
                                            returnKeyType={'send'}
                                            secureTextEntry={true}
                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5,borderWidth:1,borderColor:'#f5f5f5'}}
                                        />
                                    </View>
                                </View>
                                <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:40,marginTop:15}}>
                                    <Text style={{color:'#333333'}}>确认密码:</Text>
                                    <View style={{height:40,width:widthScreen*0.92-70,backgroundColor:'#ffffff',borderRadius:5}}>
                                        <TextInput
                                            placeholder="请确认新密码"
                                            placeholderTextColor={'#666666'}
                                            editable={true}//是否可编辑
                                            onChangeText={(text)=>this.setState({re_password:text})}//输入框改变触发的函数
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            underlineColorAndroid='transparent'
                                            enablesReturnKeyAutomatically={true}
                                            returnKeyType={'send'}
                                            secureTextEntry={true}
                                            style={{width:'100%',height:40,borderRadius:5,backgrundColor:'#ffffff',color:'#666666',paddingLeft:5,borderWidth:1,borderColor:'#f5f5f5'}}
                                        />
                                    </View>
                                </View>
                                <View style={{width:'100%',height:40,backgroundColor:this.props.theme,marginTop:25,justifyContent:'center',alignItems:'center'}}>
                                    {
                                        this.state.oldPassword&&this.state.newPassword&&this.state.re_password
                                            ?
                                            <TouchableHighlight
                                                underlayColor='rgba(255,255,255,.1)'
                                                style={{width:'100%',height:40,justifyContent:'center',alignItems:'center'}}
                                                onPress={() =>{this.sureChange()}}
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
export default connect(mapStateToProps)(Changesecurity)

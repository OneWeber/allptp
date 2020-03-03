import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HttpUtils from "../../../../https/HttpUtils"
import HttpUrl from "../../../../https/HttpUrl"
import Newhttpurl from "../../../../https/Newhttpurl"
import {NavigationActions, StackActions} from "react-navigation";
import Toast, {DURATION} from 'react-native-easy-toast';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const  resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'TabNav'})
    ]
});
export  default  class Login extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            token:'',
            tel:'',
            password:'',
            isLoading:false,
            registerID:''
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            if (!error) {
                this.setState({
                    token:result
                })
            }
        })
        AsyncStorage.getItem('registerID',(error,result)=>{
            if (!error) {
                this.setState({
                    registerID: JSON.parse(result)
                })
            }
        })
    }
    logining(){//手机号登录
        this.setState({
            isLoading:true
        })
        let formData = new FormData();
        formData.append("token",this.state.token);
        formData.append("mobile",this.state.tel);
        formData.append("m_code",86);
        formData.append("password",this.state.password);
        HttpUtils.post(HttpUrl+'User/login_psw',formData).then(
            result=>{
                this.setState({
                    isLoading:false
                },()=>{
                    this.setAlias();
                    if(result.code==1){
                        if(this.props.navigation.state.params.backgrounte){
                            this.props.navigation.state.params.refresh();
                            this.props.navigation.goBack()
                        }else{
                            //this.props.navigation.replace('TabNav')
                            this.props.navigation.dispatch(resetAction);
                        }
                    }else{
                        this.refs.toast.show(result.msg)
                    }
                })
            }
        )
    }
    setAlias() {
        let formData = new FormData();
        formData.append("token",this.state.token);
        formData.append("register_id",this.state.registerID);
        HttpUtils.post(Newhttpurl+'SetAlias',formData).then(res => {
            //alert(JSON.stringify(JSON.stringify(res)))
        })

    }
    render(){
        return(
            <KeyboardAwareScrollView style={{backgroundColor:'#f5f5f5'}}>
                <Toast ref="toast" position='center' positionValue={0} />
                <View style={{width:widthScreen,height:heightScreen,position:'relative',backgroundColor:'#f5f5f5'}}>
                    <SafeAreaView style={{flex:1,justifyContent:'space-between',alignItems:'flex-start'}}>
                        <View style={[commonStyle.flexCenter,{width:widthScreen*0.94,marginLeft:widthScreen*0.03}]}>
                            <View style={[commonStyle.flexStart,{height:50,width:'100%'}]}>
                                <AntDesign
                                    name={'left'}
                                    size={24}
                                    style={{color:'#333'}}
                                />
                            </View>
                            <Image
                                source={require('../../../../res/image/1024.png')}
                                style={{width:90,height:90,marginTop:-15}}
                            />
                            <Text style={styles.loginTitle}>欢迎来到人人耍</Text>

                            <View style={{width:'100%',marginTop:55}}>
                                <View style={{
                                    width:'100%',
                                    height:130,
                                    backgroundColor: "#fff",
                                    shadowColor: '#000000',
                                    shadowOffset: {w: 10, h: 10},
                                    shadowRadius: 5,
                                    shadowOpacity: 0.1,
                                    borderRadius: 5,
                                    paddingLeft:15,
                                    paddingRight:15
                                }}>
                                    <View style={[styles.loginInputBtn,commonStyle.flexSpace,{borderBottomColor:'#f5f5f5',borderBottomWidth:1}]}>
                                        <View style={[commonStyle.flexStart,{width:60,height:60}]}>
                                            <Text style={{fontSize: 16,color:'#666'}}>手机号</Text>
                                        </View>
                                        <TextInput
                                            placeholder = {'请输入手机号'}
                                            placeholderTextColor={'#999999'}
                                            style={{
                                                width:widthScreen*0.94-30-75,
                                                height:50
                                            }}
                                            onChangeText={(text)=>this.setState({tel:text})}
                                            defaultValue={this.state.tel}
                                            keyboardType={"number-pad"}
                                        />
                                    </View>
                                    <View style={[styles.loginInputBtn,commonStyle.flexSpace,{borderBottomColor:'#f5f5f5',borderBottomWidth:1}]}>
                                        <View style={[commonStyle.flexStart,{width:60,height:60}]}>
                                            <Text style={{fontSize: 16,color:'#666'}}>密码</Text>
                                        </View>
                                        <TextInput
                                            placeholder = {'请输入密码'}
                                            placeholderTextColor={'#999999'}
                                            style={{
                                                width:widthScreen*0.94-30-75,
                                                height:50
                                            }}
                                            underlineColorAndroid={'transparent'}
                                            enablesReturnKeyAutomatically={true}
                                            returnKeyType={'send'}
                                            secureTextEntry={true}
                                            onChangeText={(text)=>this.setState({password:text})}
                                            defaultValue={this.state.password}
                                        />
                                    </View>
                                </View>
                            </View>
                            {
                                this.state.tel&&this.state.password
                                ?
                                    <TouchableHighlight
                                        style={{width:"100%",marginTop:60}}
                                        underlayColor='rgba(255,255,255,.2)'
                                        onPress={()=>{this.logining()}}
                                    >
                                        <View style={[styles.loginBtn,commonStyle.commonShadow,commonStyle.flexCenter]}>
                                            <Text style={{color:'#fff',fontSize:16}}>登录</Text>
                                        </View>
                                    </TouchableHighlight>
                                :
                                    <View style={[styles.loginBtn,commonStyle.commonShadow,commonStyle.flexCenter,{marginTop:60}]}>
                                        <View style={[commonStyle.flexCenter,{
                                            width:'100%',
                                            height:55,
                                            backgroundColor:'rgba(255,255,255,.4)',
                                            borderRadius:25
                                        }]}>
                                            <Text style={{color:'#fff',fontSize:16}}>登录</Text>
                                        </View>
                                    </View>
                            }

                            <View style={[commonStyle.flexSpace,{width:'100%',paddingLeft:10,paddingRight:10,marginTop:10}]}>
                                <Text style={{
                                    color:'#999'
                                }}>找回密码</Text>
                                <View style={[commonStyle.flexStart]}>
                                    <Text style={{color:'#999'}}>验证码登录 <Text>|</Text> 注册账号</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[commonStyle.contentViewWidth,commonStyle.flexCenter,{marginLeft:widthScreen*0.03}]}>
                            <View style={[commonStyle.flexCenter,{width:widthScreen*0.5}]}>
                                <View style={{width:'100%',borderBottomWidth:1,borderBottomColor:'#999'}}></View>
                                <View style={[commonStyle.flexCenter,{width:120,height:20,backgroundColor:'#f5f5f5',marginTop:-10}]}>
                                    <Text style={{color:'#333'}}>第三方账号登录</Text>
                                </View>
                            </View>
                            <View style={[commonStyle.flexSpace,{width:'100%',marginTop:15}]}>
                                <View style={[styles.thirdRoll,commonStyle.flexCenter]}>
                                    <AntDesign
                                        name="QQ"
                                        size={18}
                                        style={{color:"#fff"}}
                                    />
                                </View>
                                <View style={[styles.thirdRoll,commonStyle.flexCenter]}>
                                    <AntDesign
                                        name="wechat"
                                        size={18}
                                        style={{color:"#fff"}}
                                    />
                                </View>
                                <View style={[styles.thirdRoll,commonStyle.flexCenter]}>
                                    <AntDesign
                                        name="mail"
                                        size={18}
                                        style={{color:"#fff"}}
                                    />
                                </View>
                            </View>
                            <Text style={{color:'#999',marginTop:20,marginBottom:15,fontSize:12}}>
                                登录即同意<Text style={{fontWeight: "bold",color:'#333'}}>用户协议</Text>
                            </Text>

                        </View>
                    </SafeAreaView>
                    {
                        this.state.isLoading
                        ?
                            <View style={[commonStyle.flexCenter,{
                                position:'absolute',
                                left:0,
                                right:0,
                                top:0,
                                bottom:0
                            }]}>
                                <View style={[styles.loadingView,commonStyle.flexCenter]}>
                                    <ActivityIndicator
                                        size={'large'}
                                        color={'#fff'}
                                        animating={true}
                                    />
                                </View>
                            </View>
                        :
                            null
                    }


                </View>
            </KeyboardAwareScrollView>
        )
    }
}
const styles = StyleSheet.create({
    loginTitle:{
        color:'#333',
        fontWeight: 'bold',
        fontSize:20,
        marginTop:5
    },
    loginInputBtn:{
        width:'100%',
        height:60,
        backgroundColor:'#fff'
    },
    loginBtn:{
        width:'100%',
        height:50,
        backgroundColor:'#4db6ac',
        borderRadius: 25
    },
    thirdRoll:{
        width:30,
        height:30,
        borderRadius:15,
        backgroundColor:'#4db6ac'
    },
    loadingView:{
        width:100,
        height:100,
        backgroundColor:'rgba(0,0,0,.3)',
        borderRadius:5
    }
})

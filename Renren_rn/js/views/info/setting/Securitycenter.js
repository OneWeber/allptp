import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    SafeAreaView,
    AsyncStorage, TouchableHighlight
} from 'react-native';

import AntDesign from "react-native-vector-icons/AntDesign";
import Toast, {DURATION} from 'react-native-easy-toast';
import Fetch from '../../../expand/dao/Fetch';
import HttpUrl from '../../../utils/Http';
import {connect} from 'react-redux';
const widthScreen = Dimensions.get('window').width;
type Props = {};
class Securitycenter extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            token:'',
            userInfo:''
        }
    }
    componentWillMount(){
        this.getUserinfo();
    }
    getUserinfo(){
        let formData=new FormData();
        formData.append('token',this.props.token);
        Fetch.post(HttpUrl+'User/get_user',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        userInfo:result.data[0]
                    })
                }
            }
        )
    }
    toBindtel(){
        let _this=this;
        this.props.navigation.navigate('BindTel',{
            refresh: function () {
                _this.getUserinfo();
            }
        })
    }
    toBindemail(){
        let _this=this;
        this.props.navigation.navigate('BindEmail',{
            refresh: function () {
                _this.getUserinfo();
            }
        })
    }
    toSet(){
        if(this.state.userInfo.mobile_link||this.state.userInfo.email_link){
            this.props.navigation.navigate('Settingsecurity',{check:true})
        }else{
            this.refs.toast.show('请先绑定手机或者邮箱');
        }

    }
    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <Toast ref="toast" position='center' positionValue={0} />
                <View style={{flex:1}}>
                    <View style={styles.calendarHeader}>
                        <View style={styles.calendarHeaderCon}>
                            <AntDesign
                                name="left"
                                size={19}
                                style={{color:"#333333",width:40}}
                                onPress={()=>this.props.navigation.goBack()}
                            />
                            <Text style={{fontSize:16,color:"#333333"}}>安全中心</Text>
                            <View style={{width:40}}></View>
                        </View>
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} bounces={true} >
                        <View style={{width:'100%'}}>
                            <TouchableHighlight
                                style={{ height:55,width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='rgba(0,0,0,.1)'
                                onPress={() =>{this.toBindtel()}}
                            >
                                <View style={{width:'100%',height:55,borderBottomWidth: 1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{marginLeft:widthScreen*0.04,color:'#666666'}}>手机号绑定</Text>
                                    <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                                        {
                                            this.state.userInfo.mobile_link
                                                ?
                                                <Text  style={{color:'#008489',fontSize:14}}>已绑定</Text>
                                                :
                                                <Text  style={{color:'#666666',fontSize:14}}>未绑定</Text>
                                        }

                                        <AntDesign
                                            name="right"
                                            size={14}
                                            style={{color:"#999999",marginRight:widthScreen*0.04}}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ height:55,width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='rgba(0,0,0,.1)'
                                onPress={() =>{this.toBindemail()}}
                            >
                                <View style={{width:'100%',height:55,borderBottomWidth: 1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{marginLeft:widthScreen*0.04,color:'#666666'}}>邮箱绑定</Text>
                                    <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}>
                                        {
                                            this.state.userInfo.email_link
                                                ?
                                                <Text  style={{color:'#008489',fontSize:14}}>已绑定</Text>
                                                :
                                                <Text  style={{color:'#666666',fontSize:14}}>未绑定</Text>
                                        }
                                        <AntDesign
                                            name="right"
                                            size={14}
                                            style={{color:"#999999",marginRight:widthScreen*0.04}}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ height:55,width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='rgba(0,0,0,.1)'
                                onPress={() =>{this.toSet()}}
                            >
                                <View style={{width:'100%',height:55,borderBottomWidth: 1,borderBottomColor: "#f5f5f5",justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{marginLeft:widthScreen*0.04,color:'#666666'}}>设置/修改安全密码</Text>
                                    <AntDesign
                                        name="right"
                                        size={14}
                                        style={{color:"#999999",marginRight:widthScreen*0.04}}
                                    />
                                </View>
                            </TouchableHighlight>




                        </View>
                    </ScrollView>
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
    token: state.token.token
})
export default connect(mapStateToProps)(Securitycenter)

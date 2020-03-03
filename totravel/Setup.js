import React, { Component } from "react";
import App from "./App";
import {
    View,
    Text,
    SafeAreaView,
    NetInfo,
    AsyncStorage,
    Button,
    Platform,
    NativeModules,
    NativeAppEventEmitter
} from "react-native";
import HttpUtils from "./https/HttpUtils";
import HttpUrl from "./https/HttpUrl";
import JPush from 'jpush-react-native'
import Activitylist from './js/view/public/activity/Activitylist'
let subscription;
export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.state={
            isConnection:true,
            token:'',
            registryId:''
        }
    }
    componentWillMount(): void {//判断是否有token

        AsyncStorage.getItem('token',(error,result) => {
            if(!result){
                this.getNewToken()
            }else{
                this.setState({
                    token:result
                },()=>{
                    let formData=new FormData();
                    formData.append('token',this.state.token);
                    formData.append('flag',0);
                    HttpUtils.post(HttpUrl+'Banner/bannerlist',formData).then(
                        result=>{
                            if(result.code==1){
                                this.setState({
                                    token:this.state.token
                                },()=>{
                                    AsyncStorage.setItem('token',this.state.token,(error)=>{
                                        if(error){
                                            alert('存储失败')
                                        }
                                    })
                                })
                            }else if(result.code==3 || result.code==0){
                                this.getNewToken()
                            }
                        }
                    )
                })
            }
        })
    }



    componentWillUnmount() {
        console.log("Will clear all notifications");
        JPush.clearAllNotifications();
    }
    getNewToken(){
        let formDataTwo=new FormData();
        formDataTwo.append('','');
        HttpUtils.post(HttpUrl+"Index/token",formDataTwo).then(
            result=>{
                this.setState({
                    token:result.data
                },()=>{
                    AsyncStorage.setItem('token',this.state.token,(error)=>{
                        if(error){
                            alert('存储失败')
                        }
                    })
                })
            }
        )
    }
    render() {
        return (
            <View
                style={{
                    flex : 1,
                }}
            >
                <App />

            </View>
        );
    }

}

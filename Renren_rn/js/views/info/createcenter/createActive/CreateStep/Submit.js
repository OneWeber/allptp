import React,{Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import Toast from 'react-native-easy-toast';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import action from '../../../../../action';
class Submit extends Component{
    _submitActive() {
        const {userinfo} = this.props;
        let store = userinfo['userinfo'];
        let info = store.items&&store.items.data&&store.items.data.data?store.items.data.data[0]:'';
        if(info.audit_face!=2) {
            this.refs.prompt.open()
        } else {
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("complete",1);
            formData.append("activity_id",this.props.activity_id);
            Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
                if(res.code === 1) {
                    this.initDate();
                    this.initUn();
                    this.initAl();
                    this.initNot();
                    NavigatorUtils.goPage({}, 'CreateActive')
                }
            })
        }
    }
    initDate() {
        const {token, onLoadToAudit} = this.props;
        this.storeName = 'toaudit';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',2);
        onLoadToAudit(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    initUn() {
        const {token, onLoadUncommit} = this.props;
        this.storeName = 'uncommit';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',1);
        onLoadUncommit(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    initAl(){
        const {token, onLoadAlready} = this.props;
        this.storeName = 'already';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',3);
        onLoadAlready(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    initNot(){
        const {token, onLoadNotPass} = this.props;
        this.storeName = 'notpass';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',4);
        onLoadNotPass(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    goCheck() {
        this.refs.prompt.close();
        NavigatorUtils.goPage({identity:'planner', activity_id: this.props.activity_id}, 'Authenticate')
    }
    render(){
        return(
            <SafeAreaView style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                <View style={CommonStyle.flexCenter}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{
                        height: 50
                    }]}>
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{
                                color:'#333'
                            }}
                            onPress={()=>{
                                NavigatorUtils.backToUp(this.props)
                            }}
                        />
                    </View>
                </View>
                <Toast ref="toast" position='center' positionValue={0}/>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={[styles.main_title,{
                                marginTop: 10
                            }]}>提交体验前，请先查看相关政策</Text>
                            <Text style={{
                                color:'#333',
                                marginTop: 15,
                                lineHeight: 20
                            }}>
                                人人耍会审查您将提交的版本内容，所以请务必确保您对提交内容确认无误。 您可以随时返回并修改描述。
                            </Text>
                            <Text style={{
                                color:'#333',
                                marginTop: 15,
                                lineHeight: 20
                            }}>
                                人人耍体验参与者人数最少可为一人。 也就是说，即便只有一人预订，您仍然需要开展体验。
                            </Text>
                            <Text style={{
                                color:'#333',
                                marginTop: 15,
                                lineHeight: 20
                            }}>
                                人人耍对每笔预订收取10%的费用。
                            </Text>
                            <Text style={{
                                color:'#333',
                                marginTop: 15,
                                lineHeight: 20
                            }}>
                                在人人耍上安排的各体验日期，您只能接待爱彼迎的参与者。 请您安排其他时间接待通过其他平台预订和支付的活动参与者。
                            </Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                height: 40,
                                marginTop: 40,
                                backgroundColor: this.props.theme,
                                borderRadius: 5
                            }]} onPress={()=>{
                                this._submitActive()
                            }}>
                                <Text style={{color: '#fff'}}>{this.props.type?'保存':'确认提交审核'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    style={[CommonStyle.flexCenter,{height:145,width:'100%',backgroundColor:'rgba(0,0,0,0)'}]}
                    ref={"prompt"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.5)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        width: '100%',
                        height: 145,
                        backgroundColor: '#fff',
                        padding: 15
                    }}>
                        <Text style={{
                            lineHeight: 24,
                            color:'#333',
                            marginTop: 5
                        }}><Text style={{color:'red'}}>*</Text>当前您还未验证策划者身份信息，为保证您的体验能成功通过审核请前往验证策划者身份信息。</Text>
                        <View style={[CommonStyle.spaceRow,{
                            marginTop: 20
                        }]}>
                            <Text style={{
                                color:'#666'
                            }} onPress={()=>{
                                this.refs.prompt.close()
                            }}>不用了</Text>
                            <Text style={{
                                color:this.props.theme,
                                fontWeight: 'bold'
                            }} onPress={()=>{
                                this.goCheck()
                            }}>前往验证</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
        lineHeight:20
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
})
const mapStateToProps = state => ({
    token:state.token.token,
    theme: state.theme.theme,
    userinfo: state.userinfo,
    activity_id: state.steps.activity_id,
    type: state.steps.type
})
const mapDispatchToProps = dispatch => ({
    onLoadToAudit: (storeName, url, data) => dispatch(action.onLoadToAudit(storeName, url, data)),
    onLoadUncommit:(storeName, url, data) => dispatch(action.onLoadUncommit(storeName, url, data)),
    onLoadAlready: (storeName, url, data) => dispatch(action.onLoadAlready(storeName, url, data)),
    onLoadNotPass: (storeName, url, data) => dispatch(action.onLoadNotPass(storeName, url, data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Submit)

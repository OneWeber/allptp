import React,{Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import Toast from 'react-native-easy-toast';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
class Submit extends Component{
    _submitActive() {
        const {userinfo} = this.props;
        let store = userinfo['userinfo'];
        let info = store.items&&store.items.data&&store.items.data.data?store.items.data.data[0]:'';
        if(info.audit_face!=1&&info.audit_face!=2) {
            this.refs.prompt.open()
        }
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
                                color:'3333'
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
                                <Text style={{color: '#fff'}}>确认提交审核</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    style={[CommonStyle.flexCenter,{height:140,width:'100%',backgroundColor:'rgba(0,0,0,0)'}]}
                    ref={"prompt"}
                    animationDuration={200}
                    position={"center"}
                    backdropColor={'rgba(0,0,0,0.5)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        width: '80%',
                        height: 140,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        padding: 15
                    }}>
                        <Text style={{
                            lineHeight: 24,
                            color:'#333',
                            marginTop: 5
                        }}>当前您还未验证策划者身份信息，威保证您的体验能成功通过审核请前往验证策划者身份信息。</Text>
                        <View style={[CommonStyle.spaceRow,{
                            marginTop: 30
                        }]}>
                            <Text style={{
                                color:'#666'
                            }} onPress={()=>{
                                this.refs.prompt.close()
                            }}>不用了</Text>
                            <Text style={{
                                color:this.props.theme,
                                fontWeight: 'bold'
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
    theme: state.theme.theme,
    userinfo: state.userinfo
})
export default connect(mapStateToProps)(Submit)

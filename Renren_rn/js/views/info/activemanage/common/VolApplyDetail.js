import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import {connect} from 'react-redux';
import LazyImage from 'animated-lazy-image';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
import action from '../../../../action';
const {width} = Dimensions.get('window');
class VolApplyDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.navigation.state.params.storeName==='待处理'?0:this.props.navigation.state.params.storeName==='已同意'?1:2
        }
        this.data = this.props.navigation.state.params.data;
    }
    disposeApply(val) {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('enroll_id', this.data.enroll_id);
        formData.append('flag', val);
        Fetch.post(NewHttp+'ErollA', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    status: val===1?1:2
                },() => {
                    this.initStay();
                    this.initAgreen();
                    this.initRefund();
                })
            }
        })
    }
    initStay(){
        const {onLoadVolApply} = this.props;
        let formData = new FormData();
        this.storeName = '待处理';
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', 0)
        onLoadVolApply(this.storeName, NewHttp+'ErollL', formData)
    }
    initAgreen(){
        const {onLoadVolApply} = this.props;
        let formData = new FormData();
        this.storeName = '已同意';
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', 1)
        onLoadVolApply(this.storeName, NewHttp+'ErollL', formData)
    }
    initRefund(){
        const {onLoadVolApply} = this.props;
        let formData = new FormData();
        this.storeName = '已谢绝';
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', 2)
        onLoadVolApply(this.storeName, NewHttp+'ErollL', formData)
    }
    render(){
        const {status} = this.state;
        return(
            <View style={{flex: 1,position: 'relative'}}>
                <SafeAreaView>
                    <View style={[CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{
                            height:50,
                        }]}>
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333'}}
                                onPress={()=>{
                                    NavigatorUtils.backToUp(this.props)
                                }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart]}>
                            <AntDesign
                                name={status===0?'exclamationcircle':status===1?'checkcircle':'closecircle'}
                                size={30}
                                style={{color: status===0?'#999':status===1?this.props.theme:'#ff5673'}}
                            />
                            <Text style={{
                                marginLeft: 12,
                                fontSize:18,
                                fontWeight: 'bold',
                                color:'#333'
                            }}>
                                {
                                    status===0?'申请待处理':status===1?'申请已同意':'申请已谢绝'
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 17,
                        paddingBottom: 17,
                        backgroundColor:'#fff',
                        marginTop: 20
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <View style={CommonStyle.flexStart}>
                                <LazyImage
                                    source={this.data.user&&this.data.user.headimage&&this.data.user.headimage.domain&&this.data.user.headimage.image_url?{
                                        uri: this.data.user.headimage.domain+this.data.user.headimage.image_url
                                    }:require('../../../../../assets/images/error.png')}
                                    style={{
                                        width:42,
                                        height:42,
                                        borderRadius: 21
                                    }}
                                />
                                <Text style={{
                                    marginLeft: 9,
                                    color:'#333',
                                    fontWeight: 'bold'
                                }}>
                                    {
                                        this.data.user
                                            ?
                                            this.data.user.family_name||this.data.user.middle_name||this.data.user.name
                                                ?
                                                <Text>
                                                    {this.data.user.family_name?this.data.user.family_name+' ':''}
                                                    {this.data.user.middle_name?this.data.user.middle_name+' ':''}
                                                    {this.data.user.name?this.data.user.name:''}
                                                </Text>
                                                :
                                                '匿名用户'
                                            :
                                            '匿名用户'
                                    }
                                </Text>
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                marginTop: 15.5
                            }]}>
                                <LazyImage
                                    source={this.data.activity&&this.data.activity.cover&&this.data.activity.cover.domain&&this.data.activity.cover.image_url?{
                                        uri: this.data.activity.cover.domain + this.data.activity.cover.image_url
                                    }:require('../../../../../assets/images/error.png')}
                                    style={{
                                        width:90,
                                        height:60,
                                        borderRadius: 4
                                    }}
                                />
                                <View style={[CommonStyle.spaceCol,{
                                    height: 60,
                                    width: width*0.94-100,
                                    alignItems:'flex-start'
                                }]}>
                                    <Text
                                        numberOfLines={2} ellipsizeMode={'tail'}
                                        style={{
                                            color:'#333',
                                            fontWeight: 'bold'
                                        }}
                                    >{this.data.activity.title}</Text>
                                    <Text style={{color:'#222',fontSize: 13}}>¥/人</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/*申请时间*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 17,
                        paddingBottom: 17,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>申请志愿时间</Text>
                            {
                                this.data.slot_id.map((item, index) => {
                                    return <Text key={index} style={{
                                        fontSize: 13,
                                        marginTop:index===0?19:10,
                                        color:'#666'
                                    }}>
                                        {item.begin_time} -- {item.end_time}
                                    </Text>
                                })
                            }
                        </View>
                    </View>
                    {/*主要语言*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 17,
                        paddingBottom: 17,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>主要语言</Text>
                            <Text style={{color:'#666',fontSize:13,marginTop: 20}}>
                                {this.data.main_language===0?'中文':this.data.main_language===1?'English':'日本語'}
                            </Text>
                            {
                                this.data.language.length>0
                                ?
                                    <View>
                                        <Text style={[styles.order_title,{
                                            marginTop: 25
                                        }]}>其他所会语言</Text>
                                        <View style={[CommonStyle.flexStart,{
                                            flexDirection:'row',
                                            marginTop: 10
                                        }]}>
                                            {
                                                this.data.language.map((item, index) => {
                                                    return <Text key={index} style={{
                                                        marginTop: 10,
                                                        marginRight: 10,
                                                        color:'#666',
                                                        fontSize:13
                                                    }}>
                                                        {item==0?'中文':item==1?'English':'日本語'}
                                                    </Text>
                                                })
                                            }
                                        </View>

                                    </View>
                                :
                                    null
                            }
                        </View>
                    </View>
                    {/*技能*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 17,
                        paddingBottom: 17,
                        backgroundColor:'#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>技能</Text>
                            <Text style={{
                                color:'#666',
                                fontSize: 13,
                                marginTop: 20
                            }}>{this.data.skill?this.data.skill:'无'}</Text>
                        </View>
                    </View>
                    {/*备注*/}
                    <View style={[CommonStyle.flexCenter,{
                        paddingTop: 17,
                        paddingBottom: 17,
                        backgroundColor:'#fff',
                        marginTop: 10,
                        marginBottom: 100
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.order_title}>备注</Text>
                            <Text style={{
                                color:'#666',
                                fontSize: 13,
                                marginTop: 20
                            }}>{this.data.introduce?this.data.introduce:'无'}</Text>
                        </View>
                    </View>
                </ScrollView>
                {
                    this.state.status === 0
                    ?
                        <SafeAreaView style={{
                            position:'absolute',
                            left:0,
                            right:0,
                            bottom:0,
                            backgroundColor:'#fff'
                        }}>
                            <View style={CommonStyle.flexCenter}>
                                <View style={[CommonStyle.commonWidth,CommonStyle.flexEnd,{
                                    height: 50
                                }]}>
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width: 100,
                                        height:30,
                                        borderWidth: 1,
                                        borderColor:'#b0b0b0',
                                        borderRadius: 15
                                    }]} onPress={()=>{
                                        this.disposeApply(2)
                                    }}>
                                        <Text style={{
                                            color:'#999',
                                            fontSize: 13
                                        }}>谢绝</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width: 100,
                                        height:30,
                                        borderWidth: 1,
                                        borderColor:this.props.theme,
                                        borderRadius: 15,
                                        marginLeft: 23
                                    }]} onPress={()=>{
                                        this.disposeApply(1)
                                    }}>
                                        <Text style={{
                                            color:this.props.theme,
                                            fontSize: 13
                                        }}>同意</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    :
                        null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    order_title: {
        color: '#333',
        fontSize: 15,
        fontWeight: 'bold'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
});
const mapDispatchToProps = dispatch => ({
    onLoadVolApply: (storeName, url, data) => dispatch(action.onLoadVolApply(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(VolApplyDetail)

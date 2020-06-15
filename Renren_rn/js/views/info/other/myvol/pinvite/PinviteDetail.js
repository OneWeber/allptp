import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import CommonStyle from '../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import {connect} from 'react-redux';
import LazyImage from 'animated-lazy-image';
import StarRating from'react-native-star-rating';
import Fetch from '../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../utils/NewHttp';
import action from '../../../../../action';
const {width} = Dimensions.get('window');
class PinviteDetail extends Component{
    constructor(props) {
        super(props);
        this.storeName = this.props.navigation.state.params.storeName;
        this.data = this.props.navigation.state.params.data;
        this.state = {
            status: this.storeName==='待处理'?0:this.storeName==='已同意'?1:2
        }
    }
    doInvite(val) {
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('invite_id', this.data.invite_id);
        formData.append('flag', val);
        Fetch.post(NewHttp+'InviteA', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    status: val
                },() => {
                    this.loadStay();
                    this.loadAgreen();
                    this.loadRefund();
                })
            }
        })
    }
    loadStay() {
        const {onLoadPInvite} = this.props;
        let formData = new FormData();
        this.storeName = this.props.tabLabel;
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', 0);
        onLoadPInvite('待处理', NewHttp+'InviteL', formData)
    }
    loadAgreen() {
        const {onLoadPInvite} = this.props;
        let formData = new FormData();
        this.storeName = this.props.tabLabel;
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', 1);
        onLoadPInvite('已同意', NewHttp+'InviteL', formData)
    }
    loadRefund() {
        const {onLoadPInvite} = this.props;
        let formData = new FormData();
        this.storeName = this.props.tabLabel;
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', 2);
        onLoadPInvite('已谢绝', NewHttp+'InviteL', formData)
    }
    render(){
        const {status} = this.state;
        return(
            <View style={{flex: 1,position:'relative'}}>
                <SafeAreaView>
                    <View style={[CommonStyle.flexStart,{
                        height: 50
                    }]}>
                        <TouchableOpacity style={{
                            paddingLeft: width*0.03
                        }}
                        onPress={()=>{
                            NavigatorUtils.backToUp(this.props)
                        }}
                        >
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333'}}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart]}>
                            <AntDesign
                                name={status===1?'checkcircle':'exclamationcircle'}
                                size={30}
                                style={{color:status===2?'#ee385b':this.props.theme}}
                            />
                            <Text style={{
                                marginLeft: 12,
                                fontSize:18,
                                fontWeight: 'bold',
                                color:'#333'
                            }}>
                                {status===0?'待处理':status===1?'已同意':'已谢绝'}邀请
                            </Text>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor: '#fff',
                        marginTop: 15
                    }]}>
                        <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                            height: 75,
                        }]}>
                            <LazyImage
                                source={this.data.invuser&&this.data.invuser.headimage&&this.data.invuser.headimage.domain&&this.data.invuser.headimage.image_url?{
                                    uri:this.data.invuser.headimage.domain+this.data.invuser.headimage.image_url
                                }:require('../../../../../../assets/images/touxiang.png')}
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 21
                                }}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                height:42,
                                width: width*0.94 - 52,
                                alignItems:'flex-start'
                            }]}>
                                <View>
                                    {
                                        this.data.invuser
                                            ?
                                            <Text style={{
                                                color:'#333',
                                                fontWeight: 'bold'
                                            }}>
                                                {this.data.invuser.family_name?this.data.invuser.family_name+' ':''}
                                                {this.data.invuser.middle_name?this.data.invuser.middle_name+' ':''}
                                                {this.data.invuser.name?this.data.invuser.name+' ':''}
                                            </Text>
                                            :
                                            <Text style={{
                                                color:'#333',
                                                fontWeight: 'bold'
                                            }}>匿名用户</Text>
                                    }
                                </View>
                                <View style={[CommonStyle.flexStart]}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starSize={16}
                                        rating={this.data.score}
                                        halfStarEnabled={true}
                                        fullStarColor={this.props.theme}
                                    />
                                    <Text style={{
                                        marginLeft: 5,
                                        color:parseFloat(this.data.score)>0?this.props.theme:'#666'
                                    }}>{this.data.score}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/*活动内容*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop:10,
                        backgroundColor: '#fff',
                        paddingTop: 15,
                        paddingBottom: 15
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>体验内容</Text>
                            <View style={[CommonStyle.spaceRow,{
                                marginTop: 17.5
                            }]}>
                                <LazyImage
                                    source={this.data.cover&&this.data.cover.domain&&this.data.cover.image_url?{
                                        uri: this.data.cover.domain + this.data.cover.image_url
                                    }:require('../../../../../../assets/images/error.png')}
                                    style={{
                                        width: 90,
                                        height: 60,
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
                                    >{this.data.title}</Text>
                                    <Text style={{color:'#333',fontSize: 13}}>¥{this.data.price}/人</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/*邀请志愿时间*/}
                    <View style={[CommonStyle.flexCenter,{
                        marginTop:10,
                        backgroundColor: '#fff',
                        paddingTop: 15,
                        paddingBottom: 15
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>邀请志愿时间</Text>
                            {
                                this.data.slot.map((item, index) => {
                                    return <View key={index} style={{
                                        marginTop: index===0?19:10
                                    }}>
                                        <Text style={{color:'#656565',fontSize: 13}}>
                                            {item.begin_time}至{item.end_time}
                                        </Text>
                                    </View>
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
                {
                    status===0
                        ?
                        <SafeAreaView style={{
                            position:'absolute',
                            left:0,
                            right:0,
                            bottom:0,
                            backgroundColor:'#fff',
                            borderTopWidth: 1,
                            borderTopColor: '#f5f5f5'
                        }}>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor: '#fff',
                            }]}>
                                <View style={[CommonStyle.commonWidth,CommonStyle.flexEnd,{
                                    height: 50
                                }]}>
                                   <TouchableOpacity style={[CommonStyle.flexCenter,{
                                       width: 100,
                                       height: 30,
                                       borderRadius: 15,
                                       borderWidth: 1,
                                       borderColor: '#999'
                                   }]}
                                   onPress={()=>{
                                       this.doInvite(2)
                                   }}
                                   >
                                        <Text style={{
                                            color:'#999'
                                        }}>谢绝</Text>
                                   </TouchableOpacity>
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width: 100,
                                        height: 30,
                                        borderRadius: 15,
                                        borderWidth: 1,
                                        borderColor: this.props.theme,
                                        marginLeft: 15
                                    }]}
                                      onPress={()=>{
                                          this.doInvite(1)
                                      }}
                                    >
                                        <Text style={{
                                            color:this.props.theme
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
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
});
const mapDispatchToProps = dispatch =>({
    onLoadPInvite: (storeName, url, data) => dispatch(action.onLoadPInvite(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(PinviteDetail)

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../../model/CustomeTabBar'
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../../assets/css/Common_css';
import {connect} from 'react-redux';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import Modal from 'react-native-modalbox';
const {width} = Dimensions.get('window');
class MyInvite extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [ '待处理', '已同意', '已拒绝']
    }
    getLeftButton() {
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                NavigatorUtils.backToUp(this.props)
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    render() {
        const {theme} = this.props;
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'我的邀请'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollableTabView
                    renderTabBar={() => (<CustomeTabBar
                        backgroundColor={'rgba(0,0,0,0)'}
                        locked={true}
                        sabackgroundColor={'#fff'}
                        scrollWithoutAnimation={true}
                        tabUnderlineDefaultWidth={25}
                        tabUnderlineScaleX={6} // default 3
                        activeColor={theme}
                        isWishLarge={true}
                        inactiveColor={'#999'}
                    />)}>
                    {
                        this.tabNames.map((item, index) => {
                            return <InviteItem
                                tabLabel={item}
                                index={index}
                                {...this.props}
                                activity_id={this.props.navigation.state.params.activity_id}
                            />
                        })
                    }
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(MyInvite)
class InviteItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inviteArr: [],
            invite_id: ''
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('activity_id',this.props.activity_id);
        formData.append('audit',this.props.index);
        formData.append('page',1);
        Fetch.post(NewHttp+'InviteListMy', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    inviteArr: res.data.data
                })
            }
        })
    }
    showModal(invite_id) {
        this.setState({
            invite_id: invite_id
        },() => {
            this.refs.doing.open()
        })
    }
    _renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.flexCenter,{
            paddingTop: 15,
            paddingBottom: 15
        }]}
        onLongPress={()=>{
            this.showModal(data.item.invite_id)
        }}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
               <View style={[CommonStyle.flexStart]}>
                   <LazyImage
                       source={data.item.domain&&data.item.image_url?{
                           uri:data.item.domain+data.item.image_url
                       }:require('../../../../../assets/images/touxiang.png')}
                       style={{width:40,height:40,borderRadius: 20}}
                   />
                   {
                       data.item.family_name||data.item.middle_name||data.item.name
                           ?
                           <Text style={{color:'#666666',marginLeft:10}}>
                               {data.item.family_name?data.item.family_name+' ':null}
                               {data.item.middle_name?data.item.middle_name+' ':null}
                               {data.item.name?data.item.name:null}</Text>
                           :
                           <Text style={{color:'#666666',marginLeft:10}}>匿名用户</Text>
                   }
               </View>
                <Text style={{color:'#333'}}>{this.props.tabLabel}</Text>
            </View>

        </TouchableOpacity>
    }
    backInvite() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('invite_id', this.state.invite_id);
        Fetch.post(NewHttp+'InviteD', formData).then(res => {
            if(res.code === 1) {
                this.refs.doing.close();
                this.loadData()
            }
        })

    }
    render() {
        const {inviteArr} = this.state;
        return (
            <View style={{flex: 1}}>
                {
                    inviteArr.length > 0
                    ?
                        <FlatList
                            data={inviteArr}
                            horizontal={false}
                            renderItem={(data)=>this._renderItem(data)}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <Text style={{color:'#666'}}>暂无数据</Text>
                        </View>
                }
                <Modal
                    style={{height:this.props.tabLabel==='待处理'?140:70,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"doing"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.4)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: this.props.tabLabel==='待处理'?140:70
                    }}>
                        <View style={CommonStyle.flexCenter}>
                            <View style={[CommonStyle.commonWidth]}>
                                <TouchableOpacity style={[CommonStyle.flexCenter,{
                                    height: 60,
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    marginBottom: 10,
                                }]}>
                                    <Text style={{color:'#333'}}>查看志愿者详情</Text>
                                </TouchableOpacity>
                                {
                                    this.props.tabLabel==='待处理'
                                    ?
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height: 60,
                                            backgroundColor: '#fff',
                                            marginBottom: 10,
                                            borderRadius: 5
                                        }]}
                                        onPress={()=>{
                                            this.backInvite()
                                        }}
                                        >
                                            <Text style={{color:'#333'}}>撤回邀请</Text>
                                        </TouchableOpacity>
                                    :
                                        null
                                }

                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

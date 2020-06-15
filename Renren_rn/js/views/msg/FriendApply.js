import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, RefreshControl, FlatList, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import action from '../../action'
import HttpUrl from '../../utils/Http';
import NoData from '../../common/NoData';
import LazyImage from 'animated-lazy-image';
import Fetch from '../../expand/dao/Fetch';
const {width, height} = Dimensions.get('window')
class FriendApply extends Component{
    getLeftButton(){
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
    componentDidMount(){
        this.loadData();
    }
    loadData() {
        const {onLoadFriendApply} = this.props;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        onLoadFriendApply('friendapply', HttpUrl+'Friend/getlist', formData)
    }
    _dealApply(notice_id, val) {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('notice_id',notice_id);
        formData.append('status',val);
        console.log(formData)
        Fetch.post(HttpUrl+'Friend/agree', formData).then(res => {
            if(res.code === 1) {
                this.loadData()
            }
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
            marginLeft: width*0.03,
            marginTop: data.index===0?15:30
        }]}>
            <View style={CommonStyle.flexStart}>
                <LazyImage
                    source={data.item.fuser&&data.item.fuser.headimage?{
                        uri: data.item.fuser.headimage.domain+data.item.fuser.headimage.image_url
                    }:require('../../../assets/images/touxiang.png')}
                    style={{
                        width: 40,
                        height:40,
                        borderRadius: 20
                    }}
                />
                <Text
                    numberOfLines={1} ellipsizeMode={'tail'}
                    style={{
                    marginLeft: 10,
                    color:'#333',
                    fontWeight: 'bold',
                    maxWidth: 130
                }}>
                    {
                        data.item.fuser&&(data.item.fuser.family_name||data.item.fuser.middle_name||data.item.fuser.name)
                        ?
                            <Text>
                                {data.item.fuser.family_name?data.item.fuser.family_name+' ':''}
                                {data.item.fuser.middle_name?data.item.fuser.middle_name+' ':''}
                                {data.item.fuser.name?data.item.fuser.name+' ':''}
                            </Text>
                        :
                            '匿名用户'
                    }
                </Text>
            </View>
            {
                data.item.status==0
                ?
                    <View style={CommonStyle.flexEnd}>
                        <Text style={{
                            color:this.props.theme,
                            fontWeight: 'bold'
                        }} onPress={()=>{this._dealApply(data.item.notice_id, 1)}}>同意</Text>
                        <Text style={{
                            marginLeft: 15,
                            color:'red',
                            fontWeight: 'bold'
                        }} nPress={()=>{this._dealApply(data.item.notice_id, 2)}}>拒绝</Text>
                        <Text style={{
                            marginLeft: 15,
                            color:'#999',
                            fontWeight: 'bold'
                        }} nPress={()=>{this._dealApply(data.item.notice_id, 3)}}>忽略</Text>
                    </View>
                 :
                    data.item.status==1
                ?
                        <Text style={{
                            color:this.props.theme,
                            fontWeight: 'bold'
                        }}>已同意</Text>
                :
                        <Text style={{
                            color:this.props.theme,
                            fontWeight: 'bold'
                        }}>已拒绝</Text>
            }


        </View>
    }
    render(){
        const {friendapply} = this.props;
        let store = friendapply['friendapply'];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'好友申请'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                    ?
                        <FlatList
                            data={store.items.data.data.data}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <NoData />
                        </View>
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    friendapply: state.friendapply,
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    onLoadFriendApply: (storeName, url, data) => dispatch(action.onLoadFriendApply(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(FriendApply)

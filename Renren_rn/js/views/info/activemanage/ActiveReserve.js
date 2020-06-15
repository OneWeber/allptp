import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
class ActiveReserve extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['已支付','待支付','已主动退款'];

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
    render(){
        const {theme} = this.props
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'体验预定'}
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
                            return <ActiveReserveContent tabLabel={item} key={index} {...this.props} {...this.state}/>
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
export default connect(mapStateToProps)(ActiveReserve)
import Sort from './common/Sort';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window');
class ActiveReserveContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeList: [],
            isEnd: false
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        this.step = 1;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('flag', this.props.tabLabel==='待支付'?0:1);
        formData.append('page', 1);
        formData.append('version', '2.0');
        formData.append('status', this.props.tabLabel==='已主动退款'?2:0);
        if(this.props.tabLabel==='已主动退款') {
            formData.append('type', 1);
        }
        if(this.props.tabLabel==='已完成') {
            formData.append('iscomplete', 2);
        }
        formData.append('per_page', 10);
        formData.append('sort', 1)
        Fetch.post(NewHttp+'OrderLPlannerTwo', formData).then(res => {
            if(res.code === 1) {
                console.log(res.data.data)
                this.setState({
                    activeList: res.data.data
                })
            }
        })
    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.commonWidth,{
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: '#fff',
            marginTop: 15,
            marginLeft: width*0.03,
            borderRadius: 6
        }]}
        onPress={()=>{
            if(this.props.tabLabel==='已主动退款') {
                NavigatorUtils.goPage({
                    order_id: data.item.order_id,
                    refresh: function () {
                        this.loadData()
                    }
                }, 'InitiativeRefundDetail')
            }else{
                NavigatorUtils.goPage({order_id: data.item.order_id, storeName: this.props.tabLabel}, 'InitiativeOrderDetail')
            }
        }}
        >
            <View style={[CommonStyle.spaceRow]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.user&&data.item.user.headimage&&data.item.user.headimage.domain&&data.item.user.headimage.image_url?{
                            uri: data.item.user.headimage.domain+data.item.user.headimage.image_url
                        }:require('../../../../assets/images/touxiang.png')}
                        style={{
                            width: 40,
                            height:40,
                            borderRadius: 20
                        }}
                    />
                    <Text style={{color:'#333',fontWeight: 'bold',marginLeft: 10}}>
                        {
                            data.item.user.family_name||data.item.user.middle_name||data.item.user.name
                            ?
                                data.item.user.family_name+data.item.user.middle_name+data.item.user.name
                            :
                                '匿名用户'
                        }
                    </Text>
                </View>
                <Text style={{color:'#333',fontWeight: 'bold'}}>{this.props.tabLabel}</Text>
            </View>
            <View style={[CommonStyle.spaceRow,{
                marginTop: 15
            }]}>
                <LazyImage
                    source={data.item.cover&&data.item.cover.domain&&data.item.cover.image_url?{
                        uri:data.item.cover.domain+data.item.cover.image_url
                    }:require('../../../../assets/images/error.png')}
                    style={{
                        width:90,
                        height:70,
                        borderRadius: 4
                    }}
                />
                <View style={[CommonStyle.spaceCol,{
                    height:70,
                    width: width*0.94-100-30,
                    alignItems:'flex-start'
                }]}>
                    <Text
                        numberOfLines={2} ellipsizeMode={'tail'}
                        style={{color:'#333',fontWeight: 'bold'}}
                    >{data.item.title}</Text>
                    <Text style={{
                        color:'#333',
                        fontSize: 13
                    }}>购买{data.item.num}人,共计<Text style={{fontWeight:'bold'}}>¥{parseFloat(data.item.total_price)}</Text></Text>
                </View>
            </View>
            {
                data.item.no_reach_differ.length>0||data.item.reach_differ.length>0
                ?
                    <View style={{
                        marginTop: 20
                    }}>
                        <Text>
                            【返差价】体验结束时
                        </Text>
                        {
                            data.item.reach_differ.length>0
                            ?
                                data.item.reach_differ.map((item, index) => {
                                    return <Text key={index}>
                                        满{item.num}人退支付{parseFloat(data.item.refund_rate)}%;
                                    </Text>
                                })
                            :
                                null
                        }
                        {
                            data.item.no_reach_differ.length>0
                                ?
                                data.item.no_reach_differ.map((item, index) => {
                                    return <Text key={index}>
                                        未满足满{item.num}人退支付{parseFloat(data.item.refund_rate)}%;
                                    </Text>
                                })
                                :
                                null
                        }
                    </View>
                :
                    null
            }
        </TouchableOpacity>
    }
    genIndicator(){
        return this.state.isEnd||this.state.activeList.length<10?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        this.step++;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('flag', this.props.tabLabel==='待支付'?0:1);
        formData.append('page', this.step);
        formData.append('version', '2.0');
        formData.append('status', this.props.tabLabel==='已主动退款'?2:0);
        if(this.props.tabLabel==='已主动退款') {
            formData.append('type', 1);
        }
        if(this.props.tabLabel==='已完成') {
            formData.append('iscomplete', 2);
        }
        // if(this.props.tabLabel!=='已主动退款') {
        //     formData.append('iscomplete', this.props.tabLabel==='已完成'?2:0);
        // }
        formData.append('per_page', 10);
        formData.append('sort', 1)
        Fetch.post(NewHttp+'OrderLPlannerTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    activeList: this.state.activeList.concat(res.data.data)
                },() => {
                    if(res.data.data.length>0) {
                        this.setState({
                            isEnd: false
                        })
                    }else{
                        this.setState({
                            isEnd: true
                        })
                    }
                })
            }
        })
    }
    render(){
        const {activeList} = this.state
        return(
            <View style={{flex: 1}}>
                {/*<Sort />*/}
                {
                    activeList.length>0
                    ?
                        <FlatList
                            data={activeList}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={() => this.genIndicator()}
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                if(this.canLoadMore) {
                                    this.onLoadMore();
                                    this.canLoadMore = false;
                                }
                            }}
                            onMomentumScrollBegin={() => {
                                this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                            }}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                            <NoData></NoData>
                        </View>
                }
            </View>
        )
    }
}

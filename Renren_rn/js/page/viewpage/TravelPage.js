import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, Image} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../model/CustomeTabBar';
import {connect} from 'react-redux'
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import CommonStyle from '../../../assets/css/Common_css';
import TravelItem from '../../common/TravelItem';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NoData from '../../common/NoData';
import languageType from '../../json/languageType'
class TravelPage extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            this.props.language===1?'未开始':this.props.language===2?"Not started":'未開始',
            this.props.language===1?'进行中':this.props.language===2?"ongoing":'進行中',
            this.props.language===1?'已参加':this.props.language===2?"Have to attend":'参加した',
        ];
        this.state = {
            viewIndex: 0
        }
    }
    _showFlash(data) {
        showMessage(data);
    }
    _onChangeTab(i) {
        this.setState({
            viewIndex: i.i
        })
    }
    render(){
        let {theme,language} = this.props
        return <View style={{flex: 1,backgroundColor:'#fff'}}>
                    <RNEasyTopNavBar
                        title={language===1?languageType.CH.journey.title:language===2?languageType.EN.journey.title:languageType.JA.journey.title}
                        backgroundTheme={'#fff'}
                        titleColor={'#333'}
                    />
                    <ScrollableTabView
                        onChangeTab={(i)=>this._onChangeTab(i)}
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
                            style={{borderBottomColor:'#f5f5f5',borderBottomWidth: 1}}
                        />)}>
                        {
                            this.tabNames.map((item, index) => {
                                return <TravelComMap
                                    showFlash={(data)=>this._showFlash(data)}
                                    name={index===0?'未开始':index===1?'进行中':'已参加'}
                                    {...this.state}
                                    tabLabel={item}
                                    key={index}/>
                            })
                        }
                    </ScrollableTabView>
                    <FlashMessage position="top" />
            </View>
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    language: state.language.language
})
export default connect(mapStateToProps)(TravelPage)
class TravelComponent extends Component{
    constructor(props) {
        super(props);
        this.storeName = this.props.name;
        this.viewIndex = this.props.viewIndex;
        this.step = 1
    }
    componentDidMount(){
        const {token} = this.props
        if(token) {
            this.loadData()
        }
    }
    loadData(val) {
        const {token, theme} = this.props
        const {onLoadTravel} = this.props
        const {travel} = this.props
        let store = travel[this.storeName]
        this.step = 1
        let refreshType = false;
        if(val) {
            refreshType = true
        } else {
            refreshType = false
        }
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('iscomplete',this.storeName==='未开始'?0:this.storeName==='进行中'?1:2);
        formData.append('page', 1);
        if(val) {
            onLoadTravel(this.storeName, NewHttp + 'vipact', formData, refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadTravel(this.storeName, NewHttp + 'vipact', formData, refreshType, 0)
    }
    renderItem(data) {
        return <TravelItem storeName={this.storeName} data_t={data.item} data_index={data.index}/>
    }
    onLoadMore() {
        const {token} = this.props
        const {onLoadMoreTravelData} = this.props;
        const {travel} = this.props
        let store = travel[this.storeName]
        this.step ++;
        let formData = new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('iscomplete',this.storeName==='未开始'?0:this.storeName==='进行中'?1:2);
        formData.append('page',this.step);
        onLoadMoreTravelData(this.storeName, NewHttp + 'vipact', formData , store.items, callback => {

        })
    }
    genIndicator() {
        const {travel} = this.props
        let store = travel[this.storeName]
        return store.hideMoreshow?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',paddingTop: 10,paddingBottom: 10}]}>
               <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    render() {
        const {travel} = this.props
        let store = travel[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        const {theme} = this.props
        return (
            <View tabLabel={this.props.tabLabel} style={[CommonStyle.flexCenter, {justifyContent:'flex-start', flex: 1}]}>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <FlatList
                            data={store.items.data.data.data}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={
                                <RefreshControl
                                    title={'loading'}
                                    titleColor={theme}
                                    colors={[theme]}
                                    refreshing={store.isLoading}
                                    onRefresh={() => {this.loadData(true)}}
                                    tintColor={theme}
                                />
                            }
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
                            <Image
                                source={require('../../../assets/images/que/wlt.png')}
                                style={{width:180,height:180}}
                            />
                        </View>
                }
            </View>
        )
    }
}
const mapStateToPropst = state => ({
    travel: state.travel,
    token: state.token.token,
    theme: state.theme.theme,
})
const mapDispatchToPropst = dispatch => ({
    onLoadTravel: (storeName, url, data, refreshType, oNum, callback) => dispatch(action.onLoadTravel(storeName, url, data, refreshType, oNum, callback)),
    onLoadMoreTravelData: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreTravel(storeName, url, data, oItems, callback)),
})
const TravelComMap = connect(mapStateToPropst, mapDispatchToPropst)(TravelComponent)

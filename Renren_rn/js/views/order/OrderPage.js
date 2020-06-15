import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../model/CustomeTabBar';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import CommonStyle from '../../../assets/css/Common_css';
import RNEasyDialog from 'react-native-easy-dialog';
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import OrderItem from '../../common/OrderItem';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import NoData from '../../common/NoData';
import {connect} from 'react-redux'
const widthScreen = Dimensions.get('window').width;
class OrderPage extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [ '待体验', '进行中', '未完成','已完成', '退款']
    }
    _showFlash(data) {
        showMessage(data);
    }
    getLeftButton() {
        return <TouchableOpacity
            style={styles.back_icon}
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
        return (
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'我的订单'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollableTabView
                    initialPage={this.props.navigation.state.params.initPage?this.props.navigation.state.params.initPage:0}
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
                            return <OrderMap showFlash={(data)=>this._showFlash(data)} tabLabel={item} key={index} />
                        })
                    }
                </ScrollableTabView>
                <FlashMessage position="top" />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(OrderPage)
const NAV_BAR_HEIGHT_IOS = 44;//导航栏在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50;//导航栏在Android中的高度
const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID;
class OrderComponent extends Component{
    constructor(props) {
        super(props);
        this.state={
            layVal: 0
        }
        this.storeName = this.props.tabLabel
    }

    componentDidMount(){
        this.loadData()
    }
    loadData(val){
        const {token, order, theme} = this.props
        const {onLoadOrder} = this.props;
        let store = order[this.storeName]
        this.step = 1
        let refreshType = false;
        if(val) {
            refreshType = true
        } else {
            refreshType = false
        }
        let url = this.storeName !== '退款'? NewHttp + 'OrderLTwo' : NewHttp + 'RefundLUserTwo'
        let formData=new FormData();
        if(this.storeName !== '退款') {
            formData.append('token',token);
            formData.append('page',1);
            formData.append('flag',this.storeName === '未完成'?0:1);
            if(this.storeName !== '未完成'){
                formData.append('iscomplete',this.storeName==='待体验'?0:this.storeName==='进行中'?1:2);
            }
            if(this.storeName==='进行中'){
                formData.append('isevaluate', 1)
            }
        } else {
            formData.append('token',token);
            formData.append('page',1);
        }
        formData.append('version', '2.0')
        if(val){
            onLoadOrder(this.storeName, url, formData, refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadOrder(this.storeName, url, formData, refreshType, 0)
    }
    getContent() {
        return <View style={[styles.sort_dialog,CommonStyle.flexCenter]}>
            <Text style={{color: '#999'}}>支付时间</Text>
        </View>
    }
    layout(e) {
        this.setState({
            layVal: parseInt(e.layout.y)
        })
        console.log(e.layout.y)
    }
    renderItem(data){
        return <OrderItem initData={()=>this.loadData()} storeName={this.storeName} data_o={data.item} data_index={data.index}/>
    }
    genIndicator() {
        const {order} = this.props
        let store = order[this.storeName]
        return store.hideMoreshow?null:
            <View style={[CommonStyle.flexCenter, {width: '100%'}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        const {token} = this.props
        const {onLoadMoreOrderData} = this.props
        const {order} = this.props
        let store = order[this.storeName]
        this.step ++;
        let url = this.storeName != '退款'? NewHttp + 'OrderLTwo' : NewHttp + 'RefundLUserTwo'
        let formData=new FormData();
        if(this.storeName !== '退款') {
            formData.append('token',token);
            formData.append('page',this.step);
            formData.append('flag',this.storeName === '未完成'?0:1);
            if(this.storeName !== '未完成'){
                formData.append('iscomplete',this.storeName==='待体验'?0:this.storeName==='进行中'?1:2);
            }
            if(this.storeName==='进行中'){
                formData.append('isevaluate', 1)
            }
        } else {
            formData.append('token',token);
            formData.append('page',this.step);
        }
        onLoadMoreOrderData(this.storeName, url, formData, store.items, callback => {

        })
    }
    render() {
        const {tabLabel, theme} = this.props
        const {order} = this.props
        let store = order[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return <View tabLabel={tabLabel} style={[CommonStyle.flexCenter, {flex: 1,justifyContent:'flex-start'}]}>
            {
                store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                ?
                    <View>
                        <View style={[styles.sort_con, CommonStyle.flexEnd,CommonStyle.commonWidth]}>
                            <View onLayout={({nativeEvent:e})=> this.layout(e)}>
                                <RNEasyDialog
                                    layoutVal={this.state.layVal + NAV_BAR_HEIGHT + 40 + 30}
                                    interval={20}
                                    content={this.getContent()}
                                    positionStyle={'center'}
                                    paddingInterval={5}
                                    maxWidth={250}
                                    backdropColor={'rgba(0,0,0,.2)'}
                                    positionStyle={'right'}
                                >
                                    <View
                                        style={CommonStyle.flexEnd}
                                        onPress={()=>{}}
                                    >
                                        <Text style={styles.sort_txt}>排序</Text>
                                        <AntDesign
                                            name={'down'}
                                            size={12}
                                            style={{color:'#999'}}
                                        />
                                    </View>
                                </RNEasyDialog>
                            </View>
                        </View>
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
                    </View>
                :
                    <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                        <NoData></NoData>
                    </View>
            }


        </View>
    }
}
const mapStateToPropsO = state => ({
    order: state.order,
    token: state.token.token,
    theme: state.theme.theme
})
const mapDispatchToPropsO = dispatch => ({
    onLoadOrder: (storeName, url, data, refreshType, oNum, callback) => dispatch(action.onLoadOrder(storeName, url, data, refreshType, oNum, callback)),
    onLoadMoreOrderData:(storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreOrder(storeName, url, data, oItems, callback))
})
const OrderMap = connect(mapStateToPropsO, mapDispatchToPropsO)(OrderComponent)

const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: widthScreen*0.03
    },
    sort_con: {
        height: 35,
    },
    sort_txt:{
        color: '#999',
    },
    sort_dialog:{
        width:80,
        height:30
    }
})

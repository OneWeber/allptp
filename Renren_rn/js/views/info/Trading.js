import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    FlatList,
    ActivityIndicator, SafeAreaView, ScrollView,
} from 'react-native';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import NoData from '../../common/NoData';
import CommonStyle from '../../../assets/css/Common_css';
import Fetch from '../../expand/dao/Fetch';
import Toast from 'react-native-easy-toast';
const {width, height} = Dimensions.get('window')
class Trading extends Component{
    constructor(props) {
        super(props);
        this.balance = this.props.navigation.state.params.balance;
        this.tabNames = ['全部', '收入', '支出'];
        this.state = {
            balanceData: '',
            tabIndex: 0,
            currentPage: 1
        }
    }
    componentDidMount() {
        this.getBalance();
        this.loadCard()
    }
    loadCard() {
        const {token, onLoadBank} = this.props;
        this.storeName = 'bank';
        let formData = new FormData();
        formData.append('token', token);
        onLoadBank(this.storeName, NewHttp+'bankl', formData)
    }
    getBalance(){
        const {token} = this.props
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',1);
        Fetch.post(NewHttp+'BalanceTwo',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        balanceData: result.data
                    })
                }
            }
        )
    }
    _onScrollEndDrag() {

    }
    _onAnimationEnd(e){
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor((offsetX/0.96) / (width*0.96))+1;
        if(pageIndex> 3 || pageIndex<0.93)pageIndex=0;
        this.setState({
            currentPage:pageIndex,
            tabIndex:pageIndex-1
        })
    }
    _startTimer(){
        clearTimeout(this.timer);
        let scrollView = this.refScrollView;
        this.timer = setTimeout(()=>{
            let imageCount = 3;
            let activePage = 1;
            activePage = this.state.currentPage;
            let offsetX = (activePage - 1)*width;
            let allWidth = width*(imageCount-1);
            if(offsetX>allWidth)offsetX=0;
            scrollView.scrollResponderScrollTo({x:offsetX,y:0,animated:true});
            this.setState({
                currentPage:activePage
            },()=>{
                clearTimeout(this.timer)
            })
        })
    }
    changeTitle(index) {
        this.setState({
            tabIndex: index,
            currentPage:index+1
        },() => {
            this._startTimer()
        })
    }
    goWithDrawal() {
        let _this = this;
        NavigatorUtils.goPage({
            refresh: function () {
                _this.getBalance();
                _this.refs.toast.show('提现成功')
            }
        }, 'WithDrawal')
    }
    render(){
        const {theme,bank} = this.props;
        const {balanceData} = this.state;
        let store = bank[this.storeName];
        if(!store) {
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <SafeAreaView style={styles.container}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <View style={CommonStyle.flexCenter}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                        height:50
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
                <ScrollView>
                    <View >
                        <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                            height:100,
                            backgroundColor: this.props.theme,
                            borderRadius: 5,
                            paddingLeft: 15,
                            paddingRight: 15,
                            marginLeft: width*0.03
                        }]}>
                            <View style={[CommonStyle.spaceCol,{
                                alignItems:'flex-start'
                            }]}>
                                <Text style={{color:'#fff',fontSize: 12}}>可用余额(元)</Text>
                                <Text style={{
                                    color:'#fff',
                                    fontSize: 24,
                                    marginTop: 10,
                                    fontWeight: 'bold'
                                }}>{parseFloat(balanceData.due_balance?balanceData.due_balance:0).toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width:55,
                                height:24.5,
                                borderRadius: 12.25,
                                borderWidth: 1,
                                borderColor:'#f3f5f8'
                            }]} onPress={()=>{
                                this.goWithDrawal()
                            }}>
                                <Text style={{color:'#fff',fontWeight:'bold',fontSize:12}}>提现</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                            marginTop: 10,
                            marginLeft: width*0.03
                        }]}>
                            <View style={[CommonStyle.flexCenter,{
                                width:(width*0.94-11)/2,
                                height:82.5,
                                backgroundColor:'#fff',
                                borderRadius: 4,
                                shadowColor:'#C1C7CF',
                                shadowOffset:{width:1, height:1},
                                shadowOpacity: 0.6,
                                shadowRadius: 2,
                                paddingLeft:20,
                                paddingRight:20,
                                alignItems:'flex-start'
                            }]}>
                                <View style={CommonStyle.flexStart}>
                                    <Text style={{color:'#666',fontSize: 12}}>未到账金额(元)</Text>
                                </View>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 21,
                                    marginTop: 10,
                                    fontWeight: 'bold'
                                }}>{parseFloat(balanceData.unpaid_amount?balanceData.unpaid_amount:0).toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width:(width*0.94-11)/2,
                                height:82.5,
                                backgroundColor:'#fff',
                                borderRadius: 4,
                                shadowColor:'#C1C7CF',
                                shadowOffset:{width:1, height:1},
                                shadowOpacity: 0.6,
                                shadowRadius: 2,
                                paddingLeft:20,
                                paddingRight:20,
                                alignItems:'flex-start'
                            }]} onPress={()=>{
                                NavigatorUtils.goPage({}, 'BankList')
                            }}>
                                <View style={[CommonStyle.spaceRow,{
                                    width:'100%'
                                }]}>
                                    <Text style={{color:'#666',fontSize: 12}}>我的银行卡(张)</Text>
                                    <AntDesign
                                        name={'right'}
                                        size={14}
                                        style={{color:'#999'}}
                                    />
                                </View>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 21,
                                    marginTop: 10,
                                    fontWeight: 'bold'
                                }}>
                                    {
                                        store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                                        ?
                                            store.items.data.data.length
                                        :
                                            0
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStyle.spaceRow,{
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5',
                            width: '100%',
                            paddingLeft: width*0.03 + 50,
                            paddingRight: width*0.03 + 50,
                            marginTop: 15
                        }]}>
                            {
                                this.tabNames.map((item, index) => {
                                    return <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        height: 45,
                                        position:'relative'
                                    }]} key={index} onPress={()=>{
                                        this.changeTitle(index)
                                    }}>
                                        <Text style={{color:'#333',fontWeight: 'bold'}}>{item}</Text>
                                        {
                                            this.state.tabIndex === index
                                            ?
                                                <View style={{
                                                    position:'absolute',
                                                    left:5,
                                                    right:5,
                                                    bottom:1,
                                                    height:2,
                                                    backgroundColor:this.props.theme
                                                }}></View>
                                            :
                                                null
                                        }
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <ScrollView
                            ref={refScrollView=>this.refScrollView=refScrollView}
                            horizontal = {true}
                            showsHorizontalScrollIndicator = {false}
                            pagingEnabled = {true}
                            onScrollEndDrag = {()=>{
                                this._onScrollEndDrag()
                            }}
                            onMomentumScrollEnd = {(e) => {
                                this._onAnimationEnd(e)
                            }}
                        >
                            {
                                this.tabNames.map((item, index) => {
                                    return <TradingContainerMap key={index} tabLabel={item}/>
                                })
                            }
                        </ScrollView>



                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    back_icon: {
        paddingLeft: width*0.03
    },
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    bank: state.bank
});
const mapDispatchToProps = dispatch => ({
    onLoadBank: (storeName, url, data) => dispatch(action.onLoadBank(storeName, url, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Trading)

class TradingContainer extends Component{

    componentDidMount(){
        this.loadData()
    }
    loadData(val){
        const {token, onLoadTrading, trading} = this.props
        this.storeName = this.props.tabLabel;
        this.step = 1
        let store = trading[this.storeName]
        let refreshType = false;
        if(val) {
            refreshType = true
        } else {
            refreshType = false
        }
        let formData=new FormData();
        formData.append('token', token);
        formData.append('page',1);
        if(this.storeName !== '全部') {
            formData.append('type',this.storeName === '收入'?1:2);
        }
        formData.append('begin_time',"");
        formData.append('end_time',"");
        if(val){
            onLoadTrading(this.storeName, NewHttp + 'TradCenter', formData, refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadTrading(this.storeName, NewHttp + 'TradCenter', formData, refreshType, 0)
    }
    genIndicator(){
        const {trading} = this.props
        let store = trading[this.storeName]
        return store.hideMoreshow?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',paddingTop: 10,paddingBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore(){
        const {token, onLoadMoreTrading} = this.props
        const {trading} = this.props
        let store = trading[this.storeName]
        this.step ++;
        let formData = new FormData();
        formData.append('token', token);
        formData.append('page',this.step);
        if(this.storeName !== '全部') {
            formData.append('type',this.storeName === '收入'?1:2);
        }
        formData.append('begin_time',"");
        formData.append('end_time',"");
        onLoadMoreTrading(this.storeName, NewHttp + 'TradCenter', formData , store.items, callback => {


        })
    }
    renderItem(data){
        const {theme} = this.props
        return <View style={[CommonStyle.spaceRow,{
            width:'100%',
            paddingTop:20,
            paddingBottom:20,
            borderBottomWidth:1,
            borderBottomColor:'#f5f5f5',
            paddingLeft:'3%',
            paddingRight:'3%'}]}>
            <Text style={{
                color:data.item.flag==1?theme:'#333',
                fontSize: 17
            }}>{data.item.flag==1?'+':'-'} {data.item.amount}</Text>
            <View style={[CommonStyle.spaceCol,{
                width:'65%',
                alignItems:'flex-end'
            }]}>
                <Text style={{color:'#333333',fontSize:13}}>{data.item.title}</Text>
                <Text style={{
                    color:'#999',
                    fontSize:10,
                    marginTop: 10
                }}>{data.item.create_time.split(' ')[0]}</Text>
            </View>
            {/*
            <View style={{width:'70%'}}>
                <View><Text style={{color:'#333333',fontSize:15,fontWeight:'bold'}}>{data.item.title}</Text></View>
                <View style={{marginTop:15,fontSize:12}}><Text style={{
                    color:'#666',
                }}>{data.item.type}</Text></View>
            </View>
            <View>
                <View><Text style={{color:'#999',fontSize:12}}>{data.item.create_time}</Text></View>
                <View style={{marginTop:15,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{color:data.item.flag==1?theme:'#E85461',fontWeight:'bold'}}>{data.item.flag==1?'+':'-'} {data.item.amount}</Text>
                </View>
            </View>
            */}

        </View>
    }
    render(){
        const {trading, theme} = this.props
        let store = trading[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return <View style={{width:width}}>
            {
                store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                ?
                    <View>
                        <FlatList
                            scrollEnabled={false}
                            data={store.items.data.data.data}
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
                    </View>
                :
                    <NoData></NoData>
            }
        </View>
    }
}
const mapStateToPropsT = state => ({
    trading: state.trading,
    token: state.token.token,
    theme: state.theme.theme
})
const mapDispatchToPropsT = dispatch => ({
    onLoadTrading: (storeName, url, data, refreshType, oNum, callback) => dispatch(action.onLoadTrading(storeName, url, data,refreshType, oNum, callback)),
    onLoadMoreTrading: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreTrading(storeName, url, data, oItems, callback))
})
const TradingContainerMap = connect(mapStateToPropsT, mapDispatchToPropsT)(TradingContainer)

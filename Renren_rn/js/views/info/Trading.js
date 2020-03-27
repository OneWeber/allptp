import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../model/CustomeTabBar';
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import NoData from '../../common/NoData';
import CommonStyle from '../../../assets/css/Common_css';
const {width, height} = Dimensions.get('window')
class Trading extends Component{
    constructor(props) {
        super(props);
        this.balance = this.props.navigation.state.params.balance;
        this.tabNames = ['全部', '收入', '支出']
    }
    getLeftButton(){
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
    getRightButton(){
        const {theme} = this.props
        return <TouchableOpacity style={{paddingRight:width*0.03}}>
            <Text style={{fontWeight:'bold',color:theme}}>
                余额: {this.balance?this.balance:'0.00'}
            </Text>
        </TouchableOpacity>
    }
    render(){
        const {theme} = this.props
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'交易中心'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                    style={{
                        borderBottomColor:'#f5f5f5',
                        borderBottomWidth: 1
                    }}
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
                            return <TradingContainerMap key={index} tabLabel={item}/>
                        })
                    }
                </ScrollableTabView>
            </View>
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
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Trading)

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
        return <View style={{flex: 1}}>
            {
                store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                ?
                    <View style={{flex: 1}}>
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

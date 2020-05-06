import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    FlatList, ActivityIndicator,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux';
import action from '../../../action'
import NewHttp from '../../../utils/NewHttp';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import Screening from '../../../model/screen';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
const {width} = Dimensions.get('window')
export default class Creater extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'排序',
                data:[{title:'评分优先'},{title:'点赞优先'},{title:'留言优先'},{title:'粉丝优先'}],
                type: 1
            },
            {
                title:'语言',
                data:[{title:'中文',id: 1},{title:'English',id: 2},{title:'日本語', id:3}],
                type: 1
            },
            {
                title:'地区',
                data:[],
                type: 2
            },
        ];
        this.state = {
            screenIndex: ''
        }
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
    _showFlash(data) {
        showMessage(data);
    }
    getCustom() {

    }
    _itemOnpress() {

    }
    render(){
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'策划者'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <Screening
                    ref={screen => this.screen = screen}
                    screenData={this.tabNames}
                    selectHeader={(data, index) => {
                        this.setState({
                            screenIndex: index
                        })
                    }}
                    selectIndex={[0,0,0]}
                    customContent={this.getCustom()}
                    customData={[]}
                    customFunc={()=>{
                        this.picker.showPicker()
                    }}
                    itemOnpress={(tIndex, index, data) => {
                        this._itemOnpress(tIndex, index, data)
                    }}
                >
                    <View style={{flex: 1}}>
                        <CreaterContentMap showFlash={(data)=>this._showFlash(data)} />
                        <RNEasyAddressPicker
                            hasCountry={true}
                            ref={picker => this.picker = picker}
                            selectCountry={(index) => {}}
                            selectCity={(index) => {}}
                            clickConfirmBtn={(data) => {this._clickConfirmBtn(data)}}
                        />
                        <FlashMessage position="top" />
                    </View>
                </Screening>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    tab_item:{
        padding: 3,
        marginRight: 15
    },
})
class CreaterContent extends Component{
    componentDidMount(){
        this.loadData()
    }
    loadData(val){
        const {token, onLoadCreater, onLoadMoreCreater, theme, creater} = this.props
        this.storeName='creater'
        let store = creater[this.storeName]
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
        formData.append('sort','');
        formData.append('page',1);
        formData.append('country','');
        formData.append('province',"");
        formData.append('city', "");
        formData.append('region', "");
        formData.append('language', "");
        if(val) {
            onLoadCreater(this.storeName, NewHttp + 'Planner', formData, refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadCreater(this.storeName, NewHttp + 'Planner', formData, refreshType, 0)
    }
    onLoadMore(){
        const {token} = this.props
        const {onLoadMoreCreater} = this.props;
        const {creater} = this.props
        let store = creater[this.storeName]
        this.step ++;
        let formData = new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort','');
        formData.append('page',this.step);
        formData.append('country','');
        formData.append('province',"");
        formData.append('city', "");
        formData.append('region', "");
        formData.append('language', "");
        onLoadMoreCreater(this.storeName, NewHttp + 'Planner', formData , store.items, callback => {


        })
    }
    genIndicator(){
        const {creater} = this.props
        let store = creater[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined  ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    renderItem(data){
        const {theme} = this.props
        return <View style={[CommonStyle.flexCenter,{
            width: (width*0.94-15) /2,
            marginLeft: data.index%2===0?width*0.03:15,
            marginTop: 15
        }]}>
            <LazyImage
                source={data.item.headimage?{uri:data.item.headimage.domain + data.item.headimage.image_url}:
                    require('../../../../assets/images/touxiang.png')}
                style={{
                    width:(width*0.94-15) /2,
                    height:180,
                    borderRadius: 5,
                }}
            />
            <Text style={{color:'#333',fontWeight:'bold',fontSize:15,width:'100%',marginTop: 8.5}}>{
                data.item.family_name||data.item.middle_name||data.item.name
                    ?
                    data.item.family_name+data.item.middle_name+data.item.name
                    :
                    '匿名用户'
            }</Text>
            <Text style={{
                width:'100%',
                marginTop: 10,
                color:'#333',
                fontSize: 12
            }}>志愿{data.item.activ_num}个活动</Text>
        </View>
    }
    render(){
        const {creater, theme} = this.props
        let store=creater[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                        ?
                        <View>
                            <FlatList
                                data={store.items.data.data.data}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                horizontal={false}
                                numColumns={2}
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
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    creater: state.creater,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadCreater: (storeName, url, data, oNum, callback) => dispatch(action.onLoadCreater(storeName, url, data, oNum, callback)),
    onLoadMoreCreater: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreCreater(storeName, url, data, oItems, callback))
})
const CreaterContentMap = connect(mapStateToProps, mapDispatchToProps)(CreaterContent)

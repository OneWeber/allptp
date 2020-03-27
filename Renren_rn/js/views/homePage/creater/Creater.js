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
const {width} = Dimensions.get('window')
export default class Creater extends Component{
    constructor(props) {
        super(props);
        this.tabNames=['排序', '评分', '语言', '地区']
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
    getRightButton(){
        return <TouchableOpacity
            style={{paddingRight:width*0.03}}
            onPress={() =>{

            }}
        >
            <AntDesign
                name={'search1'}
                size={20}
            />
        </TouchableOpacity>
    }
    render(){
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'策划者列表'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <View style={[CommonStyle.flexCenter,{
                    width:width,
                    borderBottomColor:'#f5f5f5',
                    borderBottomWidth: 1
                }]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                        marginTop: 18,
                        paddingBottom: 18,
                    }]}>
                        {
                            this.tabNames.map((item, index) => {
                                return <TouchableOpacity style={CommonStyle.flexStart} key={index}>
                                    <Text style={{color:'#333',fontWeight:'bold',fontSize: 13}}>{item}</Text>
                                    <AntDesign
                                        name={'caretdown'}
                                        size={8}
                                        style={{color:'#999',marginLeft: 3}}
                                    />
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <CreaterContentMap showFlash={(data)=>this._showFlash(data)} />
                </View>
                <FlashMessage position="top" />
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
                if(callback) {
                    this.props.showFlash({
                        message: '已为您更新'+callback+'个体验',
                        type: 'success',
                        backgroundColor: theme
                    })
                } else {
                    this.props.showFlash({
                        message: '当前体验没有新增',
                        type: 'success',
                        backgroundColor: theme
                    })
                }
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
            this.props.showFlash({
                message: '暂无更多策划者',
                type: 'info',
                backgroundColor: '#999'
            })

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
            width:'100%',
            paddingBottom: 15,
            paddingTop: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f5'
        }]}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.headimage?{uri:data.item.headimage.domain + data.item.headimage.image_url}:
                            require('../../../../assets/images/touxiang.png')}
                        style={{width:60,height:60,borderRadius: 30}}
                    />
                    <View style={[CommonStyle.spaceCol,{
                        height:60,
                        marginLeft: 15,
                        maxWidth: 180,
                        alignItems:'flex-start'
                    }]}>
                        <Text style={{color:'#333',fontWeight:'bold',fontSize:15}}>{
                            data.item.family_name||data.item.middle_name||data.item.name
                                ?
                                data.item.family_name+' '+data.item.middle_name+' '+data.item.name
                                :
                                '匿名用户'
                        }</Text>
                        <View style={CommonStyle.flexStart}>
                            <Text style={{color:'#999',fontSize: 12}}>粉丝数:{data.item.fans_num}</Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'}
                              style={{color:'#999',fontSize: 12}}>{data.item.introduce?data.item.introduce:'这个人很懒,什么都没有说'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    width:65,
                    height:25,
                    borderWidth: 1,
                    borderColor:theme,
                    borderRadius: 15,
                    flexDirection:'row'
                }]}>
                    <AntDesign
                        name={'plus'}
                        size={14}
                        style={{color: theme}}
                    />
                    <Text style={{color: theme}}>关注</Text>
                </TouchableOpacity>
            </View>
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
            <View style={{flex: 1}}>
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

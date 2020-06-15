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
import {connect} from 'react-redux'
import action from '../../../action'
import HttpUrl from '../../../utils/Http';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import Screening from '../../../model/screen';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
const {width} = Dimensions.get('window')
class Volunteer extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'排序',
                data:[{title:'全部', id:0},{title:'评分降序',id:1},{title:'点赞降序',id:2},{title:'留言降序',id:5},{title:'粉丝总数降序',id:6}],
                type: 1
            },
            {
                title:'语言',
                data:[{title:'全部',id: 0},{title:'中文',id: 1},{title:'English',id: 2},{title:'日本語', id:3}],
                type: 1
            },
            {
                title:'地区',
                data:[],
                type: 2
            },
        ];
        this.state = {
            screenIndex: '',
            customData: '',
            sort: '',
            language: '',
            country: '',
            province: '',
            city: '',
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
    _itemOnpress(tIndex, index, data) {
        if(tIndex===0) {
            this.setState({
                sort: data.id
            },() => {
                this.loadData()
            })
        }else if(tIndex===1) {
            this.setState({
                language: data.id
            },() => {
                this.loadData()
            })
        }
    }
    _clickCancelBtn() {
        this.screen.openOrClosePanel(this.state.screenIndex)
    }
    _clickConfirmBtn(data) {
        this.screen.openOrClosePanel(this.state.screenIndex);
        this.setState({
            country: data.country,
            province: data.province,
            city: data.city,
            customData: data.country+data.province+data.city
        },() => {
            this.loadData();
        })
    }
    _initCustomData() {
        this.setState({
            customData: '',
            country: '',
            province: '',
            city: '',
        },() => {
            this.loadData()
        })
    }
    loadData() {
        const {onLoadVolunteer} = this.props;
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords','');
        formData.append('sort', this.state.sort);
        formData.append('page',1);
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('region', "");
        formData.append('language', this.state.language);
        formData.append('score', "");
        onLoadVolunteer('volunteer', HttpUrl + 'User/user_list', formData, false, 0)
    }
    render(){
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'志愿者'}
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
                    initCustomData={() => {this._initCustomData()}}
                    selectIndex={[0,0,0]}
                    customContent={this.getCustom()}
                    customData={this.state.customData}
                    customFunc={()=>{
                        this.picker.showPicker()
                    }}
                    itemOnpress={(tIndex, index, data) => {
                        this._itemOnpress(tIndex, index, data)
                    }}
                >
                    <View style={[CommonStyle.flexCenter,{flex: 1,justifyContent:'flex-start'}]}>
                        <VolunteerContentMap  showFlash={(data)=>this._showFlash(data)} {...this.state}/>
                        <RNEasyAddressPicker
                            hasCountry={true}
                            ref={picker => this.picker = picker}
                            selectCountry={(index) => {}}
                            selectCity={(index) => {}}
                            clickConfirmBtn={(data) => {this._clickConfirmBtn(data)}}
                            clickCancelBtn={() => {this._clickCancelBtn()}}
                        />
                        <FlashMessage position="top" />
                    </View>
                </Screening>
            </SafeAreaView>
        )
    }
}
const mapState = state => ({
    token: state.token.token
});
const mapDispatch = dispatch => ({
    onLoadVolunteer: (storeName, url, data,refreshType, oNum, callback) => dispatch(action.onLoadVolunteer(storeName, url, data,refreshType, oNum, callback)),
})
export default connect(mapState, mapDispatch)(Volunteer)
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
class VolunteerContent extends Component{
    componentDidMount(){
        this.loadData()
    }
    loadData(val){
        const {token, onLoadVolunteer,volunteer} = this.props
        this.storeName='volunteer'
        let store = volunteer[this.storeName]
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
        formData.append('sort', this.props.sort);
        formData.append('page',1);
        formData.append('country',this.props.country);
        formData.append('province', this.props.province);
        formData.append('city', this.props.city);
        formData.append('region', "");
        formData.append('language', this.props.language);
        formData.append('score', "");
        if(val){
            onLoadVolunteer(this.storeName, HttpUrl + 'User/user_list', formData, refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadVolunteer(this.storeName, HttpUrl + 'User/user_list', formData, refreshType, 0)
    }
    onLoadMore(){
        const {token, onLoadMoreVolunteer, volunteer} = this.props
        let store = volunteer[this.storeName]
        this.step ++;
        let formData = new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort', this.props.sort);
        formData.append('page',this.step);
        formData.append('country',this.props.country);
        formData.append('province', this.props.province);
        formData.append('city', this.props.city);
        formData.append('region', "");
        formData.append('language', this.props.language);
        formData.append('score', "");
        onLoadMoreVolunteer(this.storeName, HttpUrl + 'User/user_list', formData , store.items, callback => {


        })
    }
    genIndicator(){
        const {volunteer} = this.props
        let store = volunteer[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    renderItem(data){
        const {theme} = this.props
        return <TouchableOpacity style={[CommonStyle.flexCenter,{
                width: (width*0.94-15) /2,
                marginLeft: data.index%2===0?0:15,
                marginTop: 15
            }]} onPress={()=>{
            NavigatorUtils.goPage({user_id: data.item.user_id},'UserInfo')
        }}>
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
                }}>志愿{data.item.volun_num}个活动</Text>
            </TouchableOpacity>
    }
    render(){
        const {volunteer, theme} = this.props
        let store=volunteer[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View >
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View>
                            <FlatList
                                data={store.items.data.data.data}
                                horizontal={false}
                                numColumns={2}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                                // refreshControl={
                                //     <RefreshControl
                                //         title={'loading'}
                                //         titleColor={theme}
                                //         colors={[theme]}
                                //         refreshing={store.isLoading}
                                //         onRefresh={() => {this.loadData(true)}}
                                //         tintColor={theme}
                                //     />
                                // }
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
    volunteer: state.volunteer,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadVolunteer: (storeName, url, data,refreshType, oNum, callback) => dispatch(action.onLoadVolunteer(storeName, url, data,refreshType, oNum, callback)),
    onLoadMoreVolunteer: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreVolunteer(storeName, url, data, oItems, callback))
})
const VolunteerContentMap = connect(mapStateToProps, mapDispatchToProps)(VolunteerContent)

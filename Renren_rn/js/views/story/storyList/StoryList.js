import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView, ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import action from '../../../action';
import {connect} from 'react-redux';
import HttpUrl from '../../../utils/Http';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
import Loading from '../../../common/Loading';
import Screening from '../../../model/screen';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
const {width} = Dimensions.get('window')
class StoryList extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'排序',
                data:[{title:'全部', id: 0},{title:'点赞降序', id: 2},{title:'收藏降序', id: 3},{title:'留言降序', id: 5}],
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
            country: '',
            province: '',
            city: '',
            keywords: ''
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
    getCustom() {

    }
    _itemOnpress(tIndex, index, data) {
        if(tIndex===0) {
            this.setState({
                sort: data.id
            },() => {
                this.loadData()
            })
        }
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
        const {onLoadStoryList} = this.props;
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords',this.state.keywords);
        formData.append('sort',this.state.sort);
        formData.append('page',1);
        formData.append('kind_id','');
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('region', '');
        onLoadStoryList('storylist', HttpUrl + 'Story/story_list', formData)
    }
    render(){
        return(
            <SafeAreaView style={[CommonStyle.flexCenter,{flex: 1,justifyContent:'flex-start',backgroundColor:'#fff'}]}>
                <View style={[CommonStyle.spaceRow,{
                    height: 50,
                    width: width
                }]}>
                    <TouchableOpacity
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
                    <TextInput
                        placeholder={'搜索故事'}
                        style={[CommonStyle.flexCenter,{
                        height:36,
                        width: width*0.94 - 30,
                        marginRight: width*0.03,
                        backgroundColor:'#f5f7fa',
                        flexDirection: 'row',
                        borderRadius: 4,
                        paddingLeft: 10,
                        paddingRight: 10
                    }]}
                     defaultValue={this.state.keywords}
                     onChangeText={(text) => {
                         this.setState({
                             keywords: text
                         })
                     }}
                     onBlur={() => {
                         this.loadData()
                     }}
                    >
                    </TextInput>
                </View>
                <Screening
                    ref={screen => this.screen = screen}
                    screenData={this.tabNames}
                    selectHeader={(data, index) => {
                        this.setState({
                            screenIndex: index
                        })
                    }}
                    selectIndex={[0,0]}
                    customContent={this.getCustom()}
                    customData={this.state.customData}
                    customFunc={()=>{
                        this.picker.showPicker()
                    }}
                    initCustomData={() => {this._initCustomData()}}
                    itemOnpress={(tIndex, index, data) => {
                        this._itemOnpress(tIndex, index, data)
                    }}
                >
                    <View style={[CommonStyle.flexCenter,{flex: 1,justifyContent:'flex-start'}]}>
                        <ActiveListContentMap  {...this.state}/>
                        <RNEasyAddressPicker
                            hasCountry={true}
                            ref={picker => this.picker = picker}
                            selectCountry={(index) => {}}
                            selectCity={(index) => {}}
                            clickConfirmBtn={(data) => {this._clickConfirmBtn(data)}}
                            clickCancelBtn={() => {this._clickCancelBtn()}}
                        />
                    </View>
                </Screening>
            </SafeAreaView>
        )
    }
}
const mapState = state => ({
    token: state.token.token
})
const mapDispatch = dispatch => ({
    onLoadStoryList: (storeName, url, data) => dispatch(action.onLoadStoryList(storeName, url, data)),
})
export default connect(mapState, mapDispatch)(StoryList)
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    cityitem_img:{
        width: '100%',
        height: 126,
        borderRadius: 3
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
class StoryListContent extends Component{
    componentDidMount() {
        this.loadData()
    }
    loadData(val){
        const {token, onLoadStoryList, storylist} = this.props
        this.storeName='storylist';
        let store = storylist[this.storeName]
        this.step = 1;
        let refreshType = false;
        if(val) {
            refreshType = true
        } else {
            refreshType = false
        }
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords',this.props.keywords);
        formData.append('sort',this.props.sort);
        formData.append('page',1);
        formData.append('kind_id','');
        formData.append('country',this.props.country);
        formData.append('province', this.props.province);
        formData.append('city', this.props.city);
        formData.append('region', '');
        if(val){
            onLoadStoryList(this.storeName, HttpUrl + 'Story/story_list', formData, refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadStoryList(this.storeName, HttpUrl + 'Story/story_list', formData)
    }
    _renderStory(data){
        return <TouchableOpacity
            style={{
                width: (width*0.94-14) / 2,
                marginLeft: data.index%2===0?0: 14,
                marginTop: data.index===1||2?15:25
            }}
            onPress={()=>{
                NavigatorUtils.goPage({story_id: data.item.story_id}, 'StoryDetail')
            }}
        >
            <LazyImage
                source={data.item.cover&&data.item.cover.domain&&data.item.cover.image_url?{
                    uri: data.item.cover.domain + data.item.cover.image_url
                }:require('../../../../assets/images/error.png')}
                style={styles.cityitem_img}
            />
            {
                data.item.region
                    ?
                    <Text style={[styles.common_weight,{
                        color:'#127D80',
                        fontSize: 10,
                        marginTop: 5.5
                    }]}>{data.item.region}</Text>
                    :
                    null
            }
            <Text numberOfLines={1} ellipsizeMode={'tail'}
                  style={[styles.common_weight,styles.common_color,{
                      marginTop: 4.5
                  }]}>{data.item.title}</Text>
            <View style={[CommonStyle.spaceRow,{marginTop: 8}]}>
                <View style={[CommonStyle.flexStart]}>
                    <TouchableOpacity style={[CommonStyle.flexStart]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.praise_num}</Text>
                        <Image source={require('../../../../assets/images/home/xqdz.png')} style={{
                            width:11,
                            height:13,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexStart,{marginLeft: 24}]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.leaving_num}</Text>
                        <Image source={require('../../../../assets/images/home/pinglun.png')} style={{
                            width:14,
                            height:14,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                </View>
                <LazyImage
                    source={{uri: data.item.user.headimage.domain + data.item.user.headimage.image_url}}
                    style={{width:20,height:20,borderRadius: 10}}
                />
            </View>
        </TouchableOpacity>
    }
    genIndicator(){
        const {storylist} = this.props
        let store = storylist[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        const {token, onLoadMoreStory, storylist} = this.props;
        const store = storylist[this.storeName]
        this.step++;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords',this.props.keywords);
        formData.append('sort',this.props.sort);
        formData.append('page',this.step);
        formData.append('kind_id','');
        formData.append('country',this.props.country);
        formData.append('province', this.props.province);
        formData.append('city', this.props.city);
        formData.append('region', '');
        onLoadMoreStory(this.storeName, HttpUrl + 'Story/story_list', formData, store.items, callback => {
        })
    }
    render(){
        const {storylist, theme} = this.props
        let store = storylist[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={CommonStyle.commonWidth}>
                {
                    store.isLoading
                    ?
                        <Loading />
                    :
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View>
                            <FlatList
                                data={store.items.data.data.data}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this._renderStory(data)}
                                showsHorizontalScrollIndicator = {false}
                                showsVerticalScrollIndicator = {false}
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
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    storylist: state.storylist,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadStoryList: (storeName, url, data) => dispatch(action.onLoadStoryList(storeName, url, data)),
    onLoadMoreStory: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreStory(storeName, url, data, oItems, callback))
})
const ActiveListContentMap = connect(mapStateToProps, mapDispatchToProps)(StoryListContent)

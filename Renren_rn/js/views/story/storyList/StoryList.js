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
    ScrollView,
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
export default class StoryList extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'排序',
                data:[{title:'价格低到高',},{title:'评分优先'},{title:'评论优先'},{title:'收藏优先'}],
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
    _clickConfirmBtn() {
        this.screen.openOrClosePanel(this.state.screenIndex)
    }
    getCustom() {

    }
    _itemOnpress() {

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
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        height:36,
                        width: width*0.94 - 30,
                        marginRight: width*0.03,
                        backgroundColor:'#f5f7fa',
                        flexDirection: 'row',
                        borderRadius: 4
                    }]}>
                        <AntDesign
                            name={'search1'}
                            size={14}
                            style={{color:'#999'}}
                        />
                        <Text style={{
                            marginLeft:5,
                            color:'#999'
                        }}>搜索故事</Text>
                    </TouchableOpacity>
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
                    customData={[]}
                    customFunc={()=>{
                        this.picker.showPicker()
                    }}
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
                        />
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
    loadData(){
        const {token, onLoadStoryList} = this.props
        this.storeName='storylist'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort','');
        formData.append('page',1);
        formData.append('kind_id','');
        formData.append('country','');
        formData.append('province', '');
        formData.append('city', '');
        formData.append('region', '');
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
                source={{uri: data.item.cover.domain + data.item.cover.image_url}}
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
    render(){
        const {storylist} = this.props
        let store = storylist[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View>
                {
                    store.isLoading
                    ?
                        <Loading />
                    :
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View style={{flex: 1}}>
                            <FlatList
                                data={store.items.data.data.data}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this._renderStory(data)}
                                showsHorizontalScrollIndicator = {false}
                                showsVerticalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
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
    onLoadStoryList: (storeName, url, data) => dispatch(action.onLoadStoryList(storeName, url, data))
})
const ActiveListContentMap = connect(mapStateToProps, mapDispatchToProps)(StoryListContent)

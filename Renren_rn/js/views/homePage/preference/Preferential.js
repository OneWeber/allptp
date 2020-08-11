import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import {connect} from 'react-redux'
import holiday from '../../../json/holiday';
import CommonStyle from '../../../../assets/css/Common_css';
import Screening from '../../../model/screen';
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import {removeDuplicatedItem, objRemoveDuplicated} from '../../../utils/auth';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
const {width, height} = Dimensions.get('window')
class Preferential extends Component{
    constructor(props) {
        super(props);
        this.state = {
            discount: [],
            tabNames: []
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0')
        Fetch.post(NewHttp+'DiscountTwo', formData).then(res => {
            if(res.code === 1) {
                let data = res.data;
                let disData = this.state.discount;
                for(let i=0;i<data.length;i++){
                    disData.push(parseFloat(data[i].price_discount))
                }
                disData = removeDuplicatedItem(disData)
                this.setState({
                    discount: disData.sort()
                },() => {
                    const {discount} = this.state;
                    let data = this.state.tabNames;
                    if(discount.length===1) {
                        data.push(discount[0]);
                    }else if(discount.length===2) {
                        data.push(discount[0]);
                        data.push(discount[1]);
                    }else{
                        data.push(discount[0]);
                        data.push(discount[discount.length/2]);
                        data.push(discount[discount.length-1]);
                    }
                    this.setState({
                        tabNames: data
                    })
                })
            }
        })
    }
    render(){
        const {theme} = this.props;
        return(
            <View style={{flex: 1,backgroundColor:'#fff'}}>
                {
                    this.state.tabNames.length>0
                    ?
                        <ScrollableTabView
                            initialPage={this.props.navigation.state.params.initPage?this.props.navigation.state.params.initPage:0}
                            renderTabBar={() => (<CustomeTabBar
                                backgroundColor={'rgba(0,0,0,0)'}
                                locked={true}
                                sabackgroundColor={'#fff'}
                                scrollWithoutAnimation={true}
                                tabUnderlineDefaultWidth={25}
                                tabUnderlineScaleX={6} // default 3
                                activeColor={'#333'}
                                isWishLarge={true}
                                navigation={this.props.navigation}
                                inactiveColor={'#b5b5b5'}
                                isPreferential={true}
                                lineColor={theme}
                            />)}>
                            {
                                this.state.tabNames.map((item, index) => {
                                    return <PreferentialItem
                                        key={index}
                                        tabLabel={'低至'+JSON.stringify(item)+'折'}
                                        item={item}
                                        {...this.props}
                                    />
                                })
                            }
                        </ScrollableTabView>
                    :
                        null
                }

            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(Preferential)
class PreferentialItem extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'类型',
                data:[{title:'户外活动',id: 1},{title:'少数民族',id: 2},{title:'本土文化', id:3}],
                type: 1
            },
            {
                title:'排序',
                data:[{title:'价格低到高',},{title:'评分优先'},{title:'评论优先'},{title:'收藏优先'}],
                type: 1
            },
            {
                title:'地区',
                data:[],
                type: 2
            }
        ];
        this.state = {
            customData: '',
            kind_id: '',
            sort: 1,
            country: '',
            province: '',
            city: '',
            region: '',
            activeList: [],
            isEnd: false,
            screenIndex: '',
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const {item} = this.props;
        this.step = 1;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('sort', this.state.sort);
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        formData.append('discount', item.toFixed(1));
        formData.append('per_page', 9);
        Fetch.post(NewHttp+'ActivityListUserTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    activeList: res.data.data
                })
            }
        })
    }
    getCustom(){

    }
    goDetail(activity_id) {
        NavigatorUtils.goPage({table_id: activity_id}, 'ActiveDetail')
    }
    _renderActivty(data) {
        const {theme} = this.props
        return <TouchableOpacity style={{
            width: (width*0.94-14) / 2,
            marginLeft: data.index%2===0?width*0.03: 14,
            marginTop: data.index===1||2?15:25
        }}
             onPress={() => {this.goDetail(data.item.activity_id)}}
        >
            <LazyImage
                source={{uri: data.item.domain + data.item.image_url}}
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
            <Text numberOfLines={2} ellipsizeMode={'tail'}
                  style={[styles.common_weight,styles.common_color,{
                      marginTop: 4.5
                  }]}>{data.item.title}</Text>
            <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 5}]}>
                {
                    data.item.price_discount_concat&&data.item.price_discount_concat.split(',').length>1
                        ?
                        <View style={[styles.tab_item,{
                            backgroundColor:'#EEFFFF',
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:theme
                            }}>{parseFloat(data.item.price_discount_concat.split(',')[1])}折起</Text>
                        </View>
                        :
                        null
                }
                {
                    data.item.is_differ
                        ?
                        <View style={[styles.tab_item,{
                            backgroundColor:'#F5F6F8',
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:'#626467'
                            }}>返差价</Text>
                        </View>
                        :
                        null
                }
                {
                    data.item.is_combine
                        ?
                        <View style={[styles.tab_item,{
                            backgroundColor:'#F5F6F8',
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:'#626467'
                            }}>含套餐</Text>
                        </View>
                        :
                        null
                }
            </View>
            <View style={[CommonStyle.flexStart,{marginTop: 8}]}>
                <Image
                    source={parseFloat(data.item.score)>0?
                        require('../../../../assets/images/home/pingxing.png'):
                        require('../../../../assets/images/home/wpx.png')}
                    style={{width: 10,height:9.5}}
                />
                <Text style={[{
                    fontSize:11,marginLeft:3,
                    color:parseFloat(data.item.score)>0?'#333':'#626467',
                    fontWeight:parseFloat(data.item.score)>0?'bold':'normal',
                }]}>{parseFloat(data.score)>0?data.item.score:'暂无评分'}</Text>
                <Text style={[{color:'#626467',fontSize: 11,marginLeft: 10}]}>
                    {
                        data.item.leaving_num
                            ?
                            data.item.leaving_num + '点评'
                            :
                            '暂无点评'
                    }
                </Text>
            </View>
            {
                data.item.price
                    ?
                    <Text style={[styles.common_color,styles.common_weight,{marginTop: 8}]}>
                        ¥{data.item.price}<Text style={{fontSize: 11,color:'#626467',fontWeight: "normal"}}>/人起</Text>
                    </Text>
                    :
                    <Text style={[{marginTop: 10,color:'#626467',fontSize: 11}]}>
                        暂未定价或时间
                    </Text>
            }
        </TouchableOpacity>
    }
    genIndicator() {
        return this.state.isEnd || this.state.activeList.length<10 ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        this.step ++;
        const {item} = this.props;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('sort', this.state.sort);
        formData.append('page', this.step);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        formData.append('discount', item.toFixed(1));
        formData.append('per_page', 9);
        Fetch.post(NewHttp+'ActivityListUserTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    activeList:this.state.activeList.concat(res.data.data)
                },() => {
                    if(res.data.data.length>0) {
                        this.setState({
                            isEnd: true
                        })
                    }else{
                        this.setState({
                            isEnd: false
                        })
                    }
                })
            }
        })
    }
    _clickConfirmBtn(data){
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
    _clickCancelBtn() {
        this.screen.openOrClosePanel(this.state.screenIndex)
    }
    _itemOnpress(tIndex, index, data){
        if(tIndex==0) {
            this.setState({
                kind_id: data.id
            },() => {
                this.loadData();
            })
        }else if(tIndex==1) {
            this.setState({
                sort: data.id
            },() => {
                this.loadData();
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
    render(){
        const {tabLabel} = this.props
        return <View style={{flex: 1}}>
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
                initCustomData={() => {this._initCustomData()}}
                customData={this.state.customData}
                customFunc={()=>{
                    this.picker.showPicker()
                }}
                itemOnpress={(tIndex, index, data) => {
                    this._itemOnpress(tIndex, index, data)
                }}
                style={{
                    borderBottomWidth:1,
                    borderBottomColor:'#f5f5f5',
                    marginTop:10
                }}
            >
                <View style={{flex: 1}}>
                    {
                        this.state.activeList.length > 0
                        ?
                            <FlatList
                                data={this.state.activeList}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this._renderActivty(data)}
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
                        :
                            <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                                <Text style={{color:'#999'}}>暂无体验</Text>
                            </View>
                    }

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
        </View>
    }
}
const styles = StyleSheet.create({
    calendarItem: {
        height:35,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F5F7FA',
        borderRadius: 4
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
    screen_title:{
        color:'#333',
        fontSize: 13,
        marginTop: 20,
        fontWeight: "bold"
    },
    addRoll:{
        width: 34,
        height:34,
        borderRadius: 17,
        borderWidth: 1
    }
})

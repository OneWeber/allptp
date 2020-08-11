import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    SafeAreaView,
    Image,
    RefreshControl,
    ActivityIndicator,
    ScrollView, TextInput,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../../action'
import HttpUrl from '../../../utils/Http';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image'
import Loading from '../../../common/Loading';
import Screening from '../../../model/screen';
import PriceRange from '../../../model/range';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
import NewHttp from '../../../utils/NewHttp';
const {width, height} = Dimensions.get('window')
class ActiveList extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'类型',
                data:[{title:'全部',id: 1},{title:'户外活动',id: 1},{title:'少数民族',id: 2},{title:'本土文化', id:3}],
                type: 1
            },
            {
                title:'排序',
                data:[{title:'全部',id: 0},{title:'价格低到高',id: 6},{title:'评分优先', id: 1},{title:'评论优先', id: 4},{title:'收藏优先', id: 3}],
                type: 1
            },
            {
                title:'地区',
                data:[],
                type: 2
            },
            {
                title:'筛选',
                data:[],
                type: 3
            }
        ];
        this.state = {
            screenIndex: '',
            kind_id: '',
            sort: '',
            country: '',
            province: '',
            city: '',
            region: '',
            customData: '',
            languageIndex: -1,
            needVol: -1,
            peopleNum: 0,
            startPrice: 0,
            endPrice: 800,
            keywords: ''
        }
    }
    getCustom(){
        return(
            <CustomContent
                {...this.props}
                {...this.state}
                changeLan={(data) => {
                    this.setState({
                        languageIndex: data
                    })
                }}
                changeNeedVol={(data) => {
                    this.setState({
                        needVol: data
                    })
                }}
                changeNum={(data) => {
                    this.setState({
                        peopleNum: data
                    })
                }}
                cleanCon = {() => {
                    this._cleanCon()
                }}
                showEnd={() => {
                    this._showEnd()
                }}
            />
        )
    }
    _cleanCon() {
        this.setState({
            languageIndex: -1,
            needVol: -1,
            peopleNum: '',
        })
    }
    _showEnd() {
        const {onLoadActiveList} = this.props;
        this.storeName = 'activelist'
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords', this.state.keywords);
        formData.append('sort', this.state.sort);
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('region', '');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('laguage', this.state.languageIndex>-1?this.state.languageIndex:'');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', this.state.needVol>-1?this.state.needVol:'');
        formData.append('max_person_num', this.state.peopleNum?this.state.peopleNum:'');
        onLoadActiveList(this.storeName, NewHttp + 'ActivityListUserTwo', formData)
        this._clickCancelBtn();
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
    loadData() {
        const {onLoadActiveList} = this.props;
        this.storeName = 'activelist'
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords', this.state.keywords);
        formData.append('sort', this.state.sort);
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('region', '');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('laguage', this.state.languageIndex>-1?this.state.languageIndex:'');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', this.state.needVol>-1?this.state.needVol:'');
        formData.append('max_person_num', this.state.peopleNum?this.state.peopleNum:'');
        onLoadActiveList(this.storeName, NewHttp + 'ActivityListUserTwo', formData)
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
        const {theme} = this.props
        return(
            <SafeAreaView style={[{flex: 1,justifyContent:'flex-start',backgroundColor:'#fff',position:'relative'}]}>
                <View style={[CommonStyle.spaceRow,{
                    height: 50
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
                        placeholder={'探索体验'}
                        defaultValue={this.state.keywords}
                        onChangeText={(text) => {
                            this.setState({
                                keywords: text
                            })
                        }}
                        onBlur={() => {
                            this.loadData();
                        }}
                    >
                        {/*<AntDesign*/}
                        {/*    name={'search1'}*/}
                        {/*    size={14}*/}
                        {/*    style={{color:'#999'}}*/}
                        {/*/>*/}
                        {/*<Text style={{*/}
                        {/*    marginLeft:5,*/}
                        {/*    color:'#999'*/}
                        {/*}}>探索体验</Text>*/}
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
                    selectIndex={[0,0,0,0]}
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
                        <ActiveListContentMap  {...this.state} {...this.props}/>
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
const mapState = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
const mapDispatch = dispatch => ({
    onLoadActiveList: (storeName, url, data) => dispatch(action.onLoadActiveList(storeName, url, data))
})
export default connect(mapState, mapDispatch)(ActiveList)
class ActiveListContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            languageIndex: -1,
            needVol: -1,
            peopleNum: 0
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadActiveList} = this.props
        this.storeName = 'activelist'
        this.step = 1;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords', this.props.keywords);
        formData.append('sort', this.props.sort);
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.props.country);
        formData.append('province', this.props.province);
        formData.append('city', this.props.city);
        formData.append('region', '');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('laguage', this.props.languageIndex>-1?this.props.languageIndex:'');
        formData.append('kind_id',this.props.kind_id);
        formData.append('is_volunteen', this.props.needVol>-1?this.props.needVol:'');
        formData.append('max_person_num', this.props.peopleNum?this.props.peopleNum:'');
        onLoadActiveList(this.storeName, NewHttp + 'ActivityListUserTwo', formData)
    }
    goDetail(activity_id) {
        NavigatorUtils.goPage({table_id: activity_id}, 'ActiveDetail')
    }
    _renderActivty(data){
        const {theme} = this.props
        return <TouchableOpacity style={{
            width: (width*0.94-14) / 2,
            marginLeft: data.index%2===0?0: 14,
            marginTop: data.index===1||2?15:25
        }}
        onPress={() => {this.goDetail(data.item.activity_id)}}
        >
            <LazyImage
                source={data.item.domain&&data.item.image_url?
                    {uri: data.item.domain + data.item.image_url}:
                require('../../../../assets/images/error.png')}
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
    genIndicator(){
        const {activelist} = this.props
        let store = activelist[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        const {onLoadMoreActive, token,activelist} = this.props;
        let store = activelist[this.storeName]
        this.step ++;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords', this.props.keywords);
        formData.append('sort', this.props.sort);
        formData.append('page', this.step);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.props.country);
        formData.append('province', this.props.province);
        formData.append('city', this.props.city);
        formData.append('region', '');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('laguage', this.props.languageIndex>-1?this.props.languageIndex:'');
        formData.append('kind_id',this.props.kind_id);
        formData.append('is_volunteen', this.props.needVol>-1?this.props.needVol:'');
        formData.append('max_person_num', this.props.peopleNum?this.props.peopleNum:'');
        onLoadMoreActive(this.storeName, NewHttp + 'ActivityListUserTwo', formData, store.items, callback => {

        })

    }
    render(){
        const {activelist} = this.props
        let store = activelist[this.storeName]
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
    activelist: state.activelist,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadActiveList: (storeName, url, data) => dispatch(action.onLoadActiveList(storeName, url, data)),
    onLoadMoreActive: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreActive(storeName, url, data, oItems, callback))
})
const ActiveListContentMap = connect(mapStateToProps, mapDispatchToProps)(ActiveListContent)
class CustomContent extends Component{
    constructor(props) {
        super(props);
        this.languages = ['中文', 'English', '日本語']
        this.volunteer = ['不需要', '需要'];
        this.state = {
            languageIndex: this.props.languageIndex,
            needVol: this.props.needVol,
            peopleNum: this.props.peopleNum,
            startPrice: this.props.startPrice,
            endPrice: this.props.endPrice
        }
    }
    delNum() {
        let num = this.state.peopleNum;
        if(num>0) {
            num--;
        }
        this.setState({
            peopleNum: num
        },() => {
            this.props.changeNum(num)
        })
    }
    addNum() {
        let num = this.state.peopleNum;
        num ++;
        this.setState({
            peopleNum: num
        },() => {
            this.props.changeNum(num)
        })
    }
    cleanCon() {
        if(this.state.languageIndex>-1||this.state.needVol>-1||this.state.peopleNum?this.props.theme:'#999') {
            this.setState({
                languageIndex: -1,
                needVol: -1,
                peopleNum: '',
            })
            this.props.cleanCon();
        }
    }
    render(){
        const {languageIndex, needVol} = this.state;
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1,position:'relative'}]}>
                <ScrollView
                    showsHorizontalScrollIndicator = {false}
                    scrollEventThrottle={16}
                >
                    <View style={[CommonStyle.commonWidth]}>
                        <Text style={styles.screen_title}>语言</Text>
                        <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 19}]}>
                            {
                                this.languages.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        width:70,
                                        height:36,
                                        backgroundColor:languageIndex==index?this.props.theme:'#F5F7FA',
                                        marginRight: 22
                                    }]}
                                        onPress={() => {
                                            this.setState({
                                                languageIndex: index
                                            },() => {
                                                this.props.changeLan(index)
                                            })
                                        }}
                                    >
                                        <Text style={{color:languageIndex==index?'#fff':'#333',fontSize: 13}}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        {/*<Text style={styles.screen_title}>价格</Text>*/}
                        {/*<View style={{marginTop: 15}}>*/}
                        {/*    <PriceRange range={1000} startPrice={this.state.startPrice} endPrice={this.state.endPrice}/>*/}
                        {/*</View>*/}
                        {/*<Text style={styles.screen_title}>日期</Text>*/}
                        {/*<View style={{*/}
                        {/*    width:'100%',*/}
                        {/*    height:49,*/}
                        {/*    backgroundColor:'#f5f7fa',*/}
                        {/*    marginTop: 19*/}
                        {/*}}>*/}

                        {/*</View>*/}
                        <Text style={styles.screen_title}>志愿者</Text>
                        <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 19}]}>
                            {
                                this.volunteer.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        width:70,
                                        height:36,
                                        backgroundColor:needVol==index?this.props.theme:'#F5F7FA',
                                        marginRight: 22
                                    }]}
                                         onPress={() => {
                                             this.setState({
                                                 needVol: index
                                             },() => {
                                                 this.props.changeNeedVol(index)
                                             })
                                         }}
                                    >
                                        <Text style={{color:needVol==index?'#fff':'#333',fontSize: 13}}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <Text style={styles.screen_title}>参与人数</Text>
                        <View style={[CommonStyle.flexStart,{marginTop: 19,marginBottom: 70}]}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.addRoll,{
                                borderColor:'#D6D6D6'
                            }]}
                            onPress={() => {
                                this.delNum()
                            }}
                            >
                                <AntDesign
                                    name={'minus'}
                                    size={18}
                                    style={{color:'#BFBFBF'}}
                                />
                            </TouchableOpacity>
                            <Text style={{marginLeft: 25,fontSize: 18,color:'#666'}}>{this.state.peopleNum?this.state.peopleNum:0}</Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.addRoll,{
                                borderColor:'#14c5ca',
                                marginLeft: 25
                            }]}
                              onPress={() => {
                                  this.addNum()
                              }}
                            >
                                <AntDesign
                                    name={'plus'}
                                    size={18}
                                    style={{color:'#14c5ca'}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View style={[CommonStyle.flexStart,{
                    position: 'absolute',
                    left:0,
                    right:0,
                    bottom: 0,
                    height:50,
                    backgroundColor: '#fff'
                }]}>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        width:100,
                        height:40,
                        marginLeft: width*0.03
                    }]}
                          onPress={() => {
                              this.cleanCon()
                          }}
                    >
                        <Text style={{
                            color: this.state.languageIndex>-1||this.state.needVol>-1||this.state.peopleNum?this.props.theme:'#999'
                        }}>清除全部</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        height:40,
                        backgroundColor:'#14c5ca',
                        borderRadius: 4,
                        width: width*0.94-120,
                        marginLeft: 20
                    }]}
                      onPress={() => {
                          this.props.showEnd()
                      }}
                    >
                        <Text style={{color:'#fff',fontSize: 15,fontWeight:'bold'}}>显示结果</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

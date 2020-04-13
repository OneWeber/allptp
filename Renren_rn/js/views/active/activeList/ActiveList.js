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
    ScrollView,
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
const {width, height} = Dimensions.get('window')
class ActiveList extends Component{
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
            },
            {
                title:'筛选',
                data:[],
                type: 3
            }
        ]
        this.state = {
            screenIndex: '',
            kind_id: ''
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
    getCustom(){
        return(
            <CustomContent />
        )
    }
    _clickConfirmBtn(data){
        this.screen.openOrClosePanel(this.state.screenIndex)
    }
    _itemOnpress(tIndex, index, data){
        this.setState({
            kind_id: data.id
        },() => {
            const {onLoadActiveList} = this.props;
            this.storeName = 'activelist'
            let formData=new FormData();
            formData.append('token', this.props.token);
            formData.append('keywords', '');
            formData.append('sort', '');
            formData.append('page', 1);
            formData.append('price_low', '');
            formData.append('price_high','');
            formData.append('country','');
            formData.append('province', '');
            formData.append('city', '');
            formData.append('region', '');
            formData.append('activ_begin_time', '');
            formData.append('activ_end_time', '');
            formData.append('laguage', '');
            formData.append('kind_id',this.state.kind_id);
            formData.append('is_volunteen', '');
            formData.append('max_person_num', '');
            onLoadActiveList(this.storeName, HttpUrl + 'Activity/activ_list', formData)
        })
    }
    render(){
        const {theme} = this.props
        return(
            <SafeAreaView style={[{flex: 1,justifyContent:'flex-start',backgroundColor:'#fff',position:'relative'}]}>
                <RNEasyTopNavBar
                    title={'体验列表'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
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
        this.tabs=['3折起','返差价','多套餐']
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadActiveList} = this.props
        this.storeName = 'activelist'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords', '');
        formData.append('sort', '');
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country','');
        formData.append('province', '');
        formData.append('city', '');
        formData.append('region', '');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('laguage', '');
        formData.append('kind_id','');
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        onLoadActiveList(this.storeName, HttpUrl + 'Activity/activ_list', formData)
    }
    _renderActivty(data){
        const {theme} = this.props
        return <TouchableOpacity style={{
            width: (width*0.94-14) / 2,
            marginLeft: data.index%2===0?0: 14,
            marginTop: 25
        }}>
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
                {this.tabs.map((item, index) => {
                    return <View key={index} style={[styles.tab_item,{
                        backgroundColor:index===0?'#EEFFFF':'#F5F6F8',
                        marginTop: 5
                    }]}>
                        <Text style={{
                            fontSize: 10,
                            color:index===0?theme:'#626467'
                        }}>{item}</Text>
                    </View>
                })}
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
    onLoadActiveList: (storeName, url, data) => dispatch(action.onLoadActiveList(storeName, url, data))
})
const ActiveListContentMap = connect(mapStateToProps, mapDispatchToProps)(ActiveListContent)
class CustomContent extends Component{
    constructor(props) {
        super(props);
        this.languages = ['中文', 'English', '日本語']
        this.volunteer = ['需要', '不需要']
    }
    render(){
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
                                        backgroundColor:'#F5F7FA',
                                        marginRight: 22
                                    }]}>
                                        <Text style={{color:'#333',fontSize: 13}}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <Text style={styles.screen_title}>价格</Text>
                        <View style={{marginTop: 15}}>
                            <PriceRange range={1000} startPrice={0} endPrice={500}/>
                        </View>
                        <Text style={styles.screen_title}>日期</Text>
                        <View style={{
                            width:'100%',
                            height:49,
                            backgroundColor:'#f5f7fa',
                            marginTop: 19
                        }}>

                        </View>
                        <Text style={styles.screen_title}>志愿者</Text>
                        <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 19}]}>
                            {
                                this.volunteer.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        width:70,
                                        height:36,
                                        backgroundColor:'#F5F7FA',
                                        marginRight: 22
                                    }]}>
                                        <Text style={{color:'#333',fontSize: 13}}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <Text style={styles.screen_title}>参与人数</Text>
                        <View style={[CommonStyle.flexStart,{marginTop: 19,marginBottom: 70}]}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.addRoll,{
                                borderColor:'#D6D6D6'
                            }]}>
                                <AntDesign
                                    name={'minus'}
                                    size={18}
                                    style={{color:'#BFBFBF'}}
                                />
                            </TouchableOpacity>
                            <Text style={{marginLeft: 25,fontSize: 18,color:'#666'}}>0</Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.addRoll,{
                                borderColor:'#14c5ca',
                                marginLeft: 25
                            }]}>
                                <AntDesign
                                    name={'plus'}
                                    size={18}
                                    style={{color:'#14c5ca'}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View style={[CommonStyle.flexCenter,{
                    position: 'absolute',
                    left:0,
                    right:0,
                    bottom: 0,
                    height:50,
                    backgroundColor: '#fff'
                }]}>
                    <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                        height:40,
                        backgroundColor:'#14c5ca',
                        borderRadius: 4
                    }]}>
                        <Text style={{color:'#fff',fontSize: 15,fontWeight:'bold'}}>显示结果</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

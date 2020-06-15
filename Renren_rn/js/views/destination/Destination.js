import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Screening from '../../model/screen';
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch';
const {width, height} = Dimensions.get('window')
class Destination extends Component{
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
            customData: '',
            cityList: [],
            isShow: true,
            sort: '',
            country: '',
            province: '',
            city: '',
            kind_id: ''
        }
    }
    componentDidMount() {
        this.loadPopCity();
    }
    loadPopCity() {
        let formData = new FormData();
        formData.append('token', this.props.token)
        Fetch.post(NewHttp+'PopularCity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    cityList: res.data
                })
            }
        })
    }
    getCustom() {
        return(
            <CustomContent />
        )
    }
    _itemOnpress(tIndex, index, data) {
        if(tIndex===0) {
            this.setState({
                kind_id: data.id
            },() => {
                this.loadData()
            })
        }else if(tIndex===1) {
            this.setState({
                sort: data.id
            },() => {
                this.loadData()
            })
        }
    }
    loadData() {
        const {onLoadActiveList} = this.props;
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords', '');
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
        formData.append('laguage', '');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        onLoadActiveList('activelist', NewHttp + 'ActivityListUserTwo', formData)
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
    _clickCancelBtn() {
        this.screen.openOrClosePanel(this.state.screenIndex)
    }
    render(){
        return(
            <SafeAreaView style={[styles.container, CommonStyle.flexCenter,{justifyContent:'flex-start', position:'relative'}]}>
                <SafeAreaView>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height: 50}]}>
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{color: '#333'}}
                            onPress={()=>NavigatorUtils.backToUp(this.props)}
                        />
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height: 36,
                            width:width*0.94-30,
                            backgroundColor: '#f5f7fa',
                            borderRadius: 4
                        }]}>
                            <Text style={{color:'#999',fontSize: 13}}>目的地或体验</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
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
                    <View style={[CommonStyle.flexCenter,{justifyContent:'flex-start',flex: 1}]}>

                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            marginTop: 20,
                        }]}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight:'bold'
                            }}>为您推荐</Text>
                            <Text style={{
                                color:'#333'
                            }}
                            onPress={()=>{
                                this.setState({
                                    isShow: !this.state.isShow
                                })
                            }}
                            >
                                {this.state.isShow?'收起':'展开'}
                            </Text>
                        </View>
                        {
                            this.state.isShow
                            ?
                                <View>
                                    <DestinationCity {...this.props} {...this.state}/>
                                </View>
                            :
                                null
                        }
                        <DestinationActive
                            {...this.props}
                            {...this.state}
                            isShow = {this.state.isShow}
                        />
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
    token: state.token.token,
    activelist: state.activelist
});
const mapDispatch = dispatch => ({
    onLoadActiveList: (storeName, url, data) => dispatch(action.onLoadActiveList(storeName, url, data)),
    onLoadMoreActive: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreActive(storeName, url, data, oItems, callback))
})
export default connect(mapState, mapDispatch)(Destination)
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    city_item: {
        width: 80,
        height:90,
        borderRadius: 4,
        overflow:'hidden',
    }
})
class DestinationCity extends Component{
    constructor(props) {
        super(props);
        this.citys = this.props.cityList
    }
    _renderCity(data){
        return <TouchableOpacity style={[styles.city_item,{
            marginLeft:data.index===0?width*0.03:10,
            marginRight:data.index===this.citys.length-1?width*0.03:0
        }]}
        onPress={() => {
            NavigatorUtils.goPage({city: data.item.city}, 'DesCity')
        }}
        >
            <ImageBackground
                source={{uri:data.item.top_image_url}}
                style={styles.city_item}
            >
                <View style={[CommonStyle.flexCenter,styles.city_item,{backgroundColor:'rgba(0,0,0,.5)'}]}>
                    <Text style={{
                        color:'#fff',
                        fontSize: 13,
                        fontWeight:'bold'
                    }}>{data.item.city}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    }
    render(){
        return(
            <View style={{marginTop: 15, height:90}}>
                <FlatList
                    data={this.props.cityList}
                    horizontal={true}
                    renderItem={(data)=>this._renderCity(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
import Ractive from '../../common/Ractive';
import NewHttp from '../../utils/NewHttp';
import action from '../../action';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
class DestinationActive extends Component{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        const {onLoadActiveList} = this.props;
        this.storeName = 'activelist';
        this.step = 1;
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords', '');
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
        formData.append('laguage', '');
        formData.append('kind_id',this.props.kind_id);
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        onLoadActiveList(this.storeName, NewHttp + 'ActivityListUserTwo', formData)
    }

    _renderItem(data){
        const {activelist} = this.props
        let store = activelist[this.storeName]
        return <Ractive
            total={store.items.data.data.data.length}
            data_r={data.item}
            data_index={data.index}
            isShow={this.props.isShow}
        />
    }
    onLoadMore() {
        const {onLoadMoreActive, token,activelist} = this.props;
        let store = activelist[this.storeName]
        this.step ++;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords', '');
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
        formData.append('laguage', '');
        formData.append('kind_id',this.props.kind_id);
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
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
            <SafeAreaView style={[{marginTop: 17}]}>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <FlatList
                            data={store.items.data.data.data}
                            renderItem={(data)=>this._renderItem(data)}
                            showsVerticalScrollIndicator = {false}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
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
                        null
                }

            </SafeAreaView>
        )
    }
}
class CustomContent extends Component{
    render(){
        return(
            <View></View>
        )
    }
}

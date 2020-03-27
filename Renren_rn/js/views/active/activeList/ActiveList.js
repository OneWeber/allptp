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
import Screen from '../../../common/Screen';
const {width} = Dimensions.get('window')
export default class ActiveList extends Component{
    constructor(props) {
        super(props);
        this.tabNames=[
            {
                title:'类型',
                screenType: 1,
                data:[
                    {title:'户外运动',value:1},
                    {title:'本土文化',value:2},
                    {title:'少数民族',value:3}
                ]
            },
            {
                title:'排序',
                screenType: 1,
                data:[
                    {title:'价格由低到高',value:1},
                    {title:'评分优先',value:2},
                    {title:'评论优先',value:3},
                    {title:'收藏优先',value:3}
                ]
            },
            {
                title:'地区',
                screenType: 2
            },
            {
                title:'筛选',
                screenType: 3
            },
        ]
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
    _selectScreen(index){

    }
    _selectItem(screenIndex, index, val){

    }
    _closeScreen(){
        this.screen.closeScreen()
    }
    render(){
        return(
            <SafeAreaView style={[CommonStyle.flexCenter,{flex: 1,justifyContent:'flex-start',backgroundColor:'#fff'}]}>
                <RNEasyTopNavBar
                    title={'体验列表'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <Screen
                    ref={screen=>this.screen=screen}
                    tabNames={this.tabNames}
                    _selectScreen={(index)=>this._selectScreen(index)}
                    selectItem={(screenIndex, index, val) => {this._selectItem(screenIndex, index, val)}}
                >
                    <ScreenContent closeScreen={()=>this._closeScreen()}/>
                </Screen>
                <View style={{flex: 1}}>
                    <ActiveListContentMap />
                </View>
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
    }
})
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
                    return <View style={[styles.tab_item,{
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
            <View >
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

class ScreenContent extends Component{
    constructor(props) {
        super(props);
        this.languages = [
            {
                title:'中文',
            },
            {
                title:'日本語',
            },
            {
                title:'English',
            }
        ]
    }
    render(){
        return(
            <View style={{position:'relative'}}>
                <ScrollView>
                    <View style={[CommonStyle.flexCenter,{width: width,justifyContent:'flex-start'}]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <Text style={styles.screen_title}>语言</Text>
                            <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 5}]}>
                                {
                                    this.languages.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                            width:70,
                                            height:36,
                                            backgroundColor:'#F5F7FA',
                                            borderRadius: 4,
                                            marginTop: 15,
                                            marginRight: 22
                                        }]}>
                                            <Text style={{
                                                color:'#333',
                                                fontSize:13
                                            }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView style={[CommonStyle.flexCenter,{
                    position:'absolute',
                    left:0,
                    right:0,
                    bottom:0,
                }]}>
                    <TouchableOpacity
                        style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:40,backgroundColor:'#14c5ca'}]}
                        onPress={()=>{this.props.closeScreen()}}
                    >
                        <Text style={{color:'#fff',fontWeight:'bold',fontSize: 15}}>显示结果</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        )
    }
}

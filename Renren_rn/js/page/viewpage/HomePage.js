import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
    SafeAreaView,
    Image,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import {connect} from 'react-redux'
import Parallax from '../../common/parallax'
import LazyImage from 'animated-lazy-image';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonStyle from '../../../assets/css/Common_css';
import CommingActive from '../../views/homePage/CommingActive';
import Preference from '../../views/homePage/Preference';
import TopScoreActive from '../../views/homePage/TopScoreActive';
import Swiper from 'react-native-swiper'
import SelectStory from '../../views/homePage/SelectStory';
import History from '../../views/homePage/History';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Modal from 'react-native-modalbox';
import Search from '../../views/homePage/Search';
import action from '../../action'
import languageType from '../../json/languageType'
import HttpUrl from '../../utils/Http';
const {width, height} = Dimensions.get('window')
class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state={
            scrollY:new Animated.Value(0),
            touchEnd:0,
            opacity: 0,
            isFetching: false
        }
    }
    componentDidMount() {
        const {token, onLoadUserInfo} = this.props
        let formData=new FormData();
        this.storeNames='userinfo';
        formData.append('token', token);
        onLoadUserInfo(this.storeNames, HttpUrl+'User/get_user', formData)
    }
    _onScroll(e){
        let y = e.nativeEvent.contentOffset.y;
        this.setState({
            touchEnd:y
        })
        let opacityPercent = (y-234) / (80);
        this.setState({
            opacity:opacityPercent
        })
    }
    onRefresh() {

    }
    _showSearch(){
        this.refs.search.open()
    }
    _closeSearch() {
        this.refs.search.close()
    }
    render(){
        this.navs=[
            {
                title:this.props.language===1?'志愿者':this.props.language===2?'volunteers':'ボランティア',
                router:'Volunteer',
                icon: require('../../../assets/images/home/zyz.png')
            },
            {
                title:this.props.language===1?'策划者':this.props.language===2?'planners':'企画者',
                router:'Creater',
                icon: require('../../../assets/images/home/chz.png')
            },
            {
                title:this.props.language===1?'体验':this.props.language===2?'experience':'体験',
                router:'ActiveList',
                icon: require('../../../assets/images/home/tiyan.png')
            },
            {
                title:this.props.language===1?'故事':this.props.language===2?'story':'ストーリー',
                router:'StoryList',
                icon: require('../../../assets/images/home/gushi.png')
            },
            {
                title:this.props.language===1?'热搜':this.props.language===2?'Hot search':'暑い狩り',
                router:'TopSearch',
                icon: require('../../../assets/images/home/resou.png')
            },
        ]
        const {scrollY} = this.state
        let nav = <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{marginTop: 30}]}>
            {this.navs.map((item, index) => {
                return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                    maxWidth: width*0.94/5
                }]}
                    onPress={()=>{
                        NavigatorUtils.goPage({},item.router,'navigate')
                    }}
                >
                    <Image source={item.icon} style={{
                        width: 41,
                        height:34
                    }}/>
                    <Text numberOfLines={1} ellipsizeMode={'tail'}
                        style={[styles.common_weight,styles.common_color,{
                            fontSize: 12,
                            marginTop: 12
                        }]}
                    >{item.title}</Text>
                </TouchableOpacity>
            })}
        </View>
        const {touchEnd, opacity} = this.state
        const {theme} = this.props
        return (

            <View style={[styles.container,{justifyContent: 'flex-start',position:'relative'}]}>
                <Modal
                    style={{
                        height:height,
                        width:'100%',
                        backgroundColor:'rgba(255,255,255,1)',
                    }}
                    ref={"search"}
                    animationDuration={400}
                    position={"bottom"}
                    backdropColor={'rgba(255,255,255,1)'}
                    swipeToClose={false}
                    backdropPressToClose={false}
                    coverScreen={true}>
                    <View style={{
                        height: height,
                        backgroundColor: '#fff',
                    }}>
                        <Search closeSearch={()=>this._closeSearch()}/>
                    </View>
                </Modal>
                {
                    touchEnd >=234
                    ?
                        <SafeAreaView style={{
                            position:'absolute',
                            left:0,
                            top:0,
                            right:0,
                            backgroundColor:'#fff',
                            zIndex: 999,
                            opacity:opacity
                        }}>
                            <NavBar showSearch={()=>this._showSearch()} style={{marginTop: 0,marginLeft:width*0.03}} {...this.props}/>
                        </SafeAreaView>
                    :
                        null
                }


                <Parallax
                    backgroundColor="#ffffff"
                    contentBackgroundColor="#ffffff"
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isFetching}
                            onRefresh={()=>{this.onRefresh()}}
                            tintColor={"#999"}
                            title={"刷新中..."}
                            titleColor={['#999']}
                        />
                    }
                    //下面渲染背景
                    renderBackground={() =>  <View style={{width:width,height:234}}>

                    </View>}
                    renderForeground={()=>(
                        <BannerMap {...this.props}/>
                    )}
                    stickyHeaderHeight={0}
                    parallaxHeaderHeight={ 234 }
                    onScroll={(event)=>this._onScroll(event)}
                >
                    <View style={[styles.content_con,CommonStyle.flexCenter]}>
                        <NavBar showSearch={()=>this._showSearch()} {...this.props}/>
                        {nav}
                        {/*即将开展的体验*/}
                        <CommingActive styles={styles} {...this.props}/>
                        {/*特惠体验*/}
                        <Preference styles={styles} {...this.props}/>
                        {/*高分目的地体验*/}
                        <TopScoreActive styles={styles} {...this.props}/>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 40,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor:'#484A4D',
                            marginTop: 30
                        }]} onPress={()=>NavigatorUtils.goPage({}, 'Destination', 'navigate')}>
                            <Text style={[styles.common_weight,styles.common_color]}>
                                {
                                    this.props.language===1?
                                        languageType.CH.home.more_destination_btn:
                                        this.props.language===2?
                                            languageType.EN.home.more_destination_btn:
                                            languageType.JA.home.more_destination_btn
                                }
                            </Text>
                        </TouchableOpacity>
                        {/*精选体验故事*/}
                        <SelectStory styles={styles} {...this.props}/>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 40,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor:'#484A4D',
                            marginTop: 30
                        }]}
                        onPress={() => {
                            NavigatorUtils.goPage({}, 'StoryList')
                        }}
                        >
                            <Text style={[styles.common_weight,styles.common_color]}>
                                {
                                    this.props.language===1?
                                        languageType.CH.home.more_story_btn:
                                        this.props.language===2?
                                            languageType.EN.home.more_story_btn:
                                            languageType.JA.home.more_story_btn
                                }
                            </Text>
                        </TouchableOpacity>
                        {/*历史记录*/}
                        <History styles={styles} {...this.props}/>
                        <View style={{width: '100%',marginTop:50,marginBottom: 50}}>
                            <View style={[styles.home_bot,CommonStyle.spaceRow,{alignItems:'flex-start'}]}>
                                <Image source={require('../../../assets/images/home/deng.png')} style={{width:26.5,height:30}}/>
                                <View style={{
                                    width:width*0.94-20-45
                                }}>
                                    <Text style={[styles.common_color]}>
                                        {
                                            this.props.language===1?
                                                languageType.CH.home.propmt:
                                                this.props.language===2?
                                                    languageType.EN.home.propmt:
                                                    languageType.JA.home.propmt
                                        }
                                    </Text>
                                    <Text style={[styles.common_color,styles.common_weight,{
                                        marginTop: 12
                                    }]}>{
                                        this.props.language===1?
                                            languageType.CH.home.tel:
                                            this.props.language===2?
                                                languageType.EN.home.tel:
                                                languageType.JA.home.tel
                                    }: 028-8888888</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Parallax>


            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    common_color:{
      color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    content_con:{
        flex: 1,
        borderTopRightRadius:15,
        borderTopLeftRadius:15,
        marginTop: -15,
        backgroundColor: "#fff"
    },
    backgroundImage: {
        position: 'absolute',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        top: 0
    },
    h_input:{
        height:48,
        shadowColor:'#C1C7CF',
        shadowOffset:{width:1, height:1},
        shadowOpacity: 0.6,
        shadowRadius: 2,
        backgroundColor:'#fff',
        margin: 8,
        borderRadius: 6,
        marginTop: 30,
        padding: 10
    },
    home_bot:{
        padding:10,
        backgroundColor:'#fff',
        margin: 8,
        borderRadius: 4,
        shadowColor:'#C1C7CF',
        shadowOffset:{width:1, height:1},
        shadowOpacity: 0.6,
        shadowRadius: 2,
    },
    input:{
        height: 48,
        width:width*0.94 - 20 - 70,
        textAlign:'center',
        color:'#333'
    },
    component_title:{
        fontSize: 18,
        marginTop: 40
    }
});
const mapStateToProps = state => ({
    user: state.user.user,
    token: state.token.token,
    theme:state.theme.theme,
    language: state.language.language
})
const mapDispatchToProps = dispatch => ({
    onLoadUserInfo: (storeName, url, data) => dispatch(action.onLoadUserInfo(storeName, url, data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
class NavBar extends Component{
    render(){
        const {theme, language} = this.props
        return (
            <View style={[styles.h_input,CommonStyle.commonWidth,CommonStyle.spaceRow,this.props.style]}>
                <View style={CommonStyle.flexStart}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'}
                        style={[styles.common_color,styles.common_weight,{
                        fontSize: 15,
                        maxWidth: 40
                    }]}>
                        {
                            language===1?languageType.CH.home.rec:language===2?languageType.EN.home.rec:languageType.JA.home.rec
                        }

                    </Text>
                    <AntDesign
                        name={'caretdown'}
                        size={10}
                        style={{color:'#333',marginLeft: 5}}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.input,CommonStyle.flexCenter,{flexDirection:'row'}]}
                    onPress={()=>{this.props.showSearch()}}
                >
                    <AntDesign
                        name={'search1'}
                        size={20}
                        style={{color:'#cacaca',marginRight: 10}}
                    />
                    <Text style={[styles.common_weight,{color:'#cacaca',fontSize: 15}]}>
                        {
                            language===1?languageType.CH.home.search:language===2?languageType.EN.home.search:languageType.JA.home.search
                        }
                    </Text>
                </TouchableOpacity>
                <AntDesign
                    name={'earth'}
                    size={18}
                    style = {{color: theme}}
                    onPress={()=>{
                        NavigatorUtils.goPage({},'GlobalMap', 'navigate')
                    }}
                />
            </View>
        )
    }
}
class Banner extends Component{
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        const {onLoadBanner} = this.props;
        this.storeName = 'banner';
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',0);
        onLoadBanner(this.storeName, HttpUrl+'Banner/bannerlist', formData)
    }
    render(){
        const {banner} = this.props
        let store = banner[this.storeName]
        if(!store) {
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{height: 234,backgroundColor:'#f5f5f5'}}>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.length > 0
                    ?
                        <Swiper
                            showsButtons={false}
                            horizontal={true}
                            loop={true}
                            showsPagination={true}
                            autoplay={true}
                            autoplayTimeout={6}
                            activeDotColor={this.props.theme}
                            style={{backgroundColor: '#f5f5f5'}}
                        >
                            {
                                store.items.data.data.map((item, index) => {
                                    return <LazyImage
                                        key={index}
                                        source={{uri: item.image.domain + item.image.image_url}}
                                        style={{width:width,height:234}}
                                    />
                                })
                            }
                        </Swiper>
                    :
                        null
                }

            </View>
        )
    }
}
const mapStateToPropBanner = state => ({
    banner: state.banner
});
const mapDispatchToPropBanner = dispatch => ({
    onLoadBanner: (storeName, url, data) => dispatch(action.onLoadBanner(storeName, url, data))
})
const BannerMap = connect(mapStateToPropBanner, mapDispatchToPropBanner)(Banner)

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    ScrollView, Image, FlatList,
    Alert
} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../../assets/css/Common_css';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Swiper from "react-native-swiper";
import Comment from '../../common/Comment';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import NewHttp from '../../utils/NewHttp';
import Modal from 'react-native-modalbox';
import action from '../../action'
import Toast from 'react-native-easy-toast';
import Share from '../../common/Share';
const {width, height} = Dimensions.get('window')
class StoryDetail extends Component{
    constructor(props) {
        super(props);
        this.story_id = this.props.navigation.state.params.story_id;
        this.state = {
            storyData: '',
            isLoading: false,
            opacity: 0,
            onTouchEnd: 0,
            praiseList: []
        }
    }
    componentDidMount() {
        this.getStoryData();
        this.getWishList()
    }
    getStoryData(val) {
        if(!val) {
            this.showLoading()
        }
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('story_id',this.story_id);
        formData.append('visit',1);
        formData.append('praise',1);
        Fetch.post(HttpUrl + 'Story/get_story', formData).then(
            res => {
                if(res.code === 1) {
                    this.setState({
                        storyData: res.data
                    },() => {
                        if(!val) {
                            this.closeLoading()
                        }
                    })
                }
            }
        )
    }
    getWishList(){
        const {onLoadColWish} = this.props;
        this.storeName = 'colwish';
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',2);
        formData.append('table_id',this.story_id);
        onLoadColWish(this.storeName, HttpUrl+'Comment/collegroup_list', formData)
    }
    closeLoading() {
        this.setState({
            isLoading: false
        })
    }
    showLoading() {
        this.setState({
            isLoading: true
        })
    }
    _onScroll (e){
        let y = e.nativeEvent.contentOffset.y;
        let opacityPercent = (y-150) / (80);
        this.setState({
            onTouchEnd: y
        })
        if(y > 150) {
            this.setState({
                opacity: opacityPercent
            })
        } else if(y>230) {
            this.setState({
                opacity: 1
            })
        } else {
            this.setState({
                opacity: opacityPercent
            })
        }

    };
    _changePraise(data){
        this.setState({
            praiseList: data
        })
    }
    chanegCollection(group_id, is_this_colle){
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',2);
        formData.append('table_id',this.story_id);
        formData.append('group_id',group_id);
        formData.append('type',is_this_colle===1?2:1);
        Fetch.post(HttpUrl+'Comment/collection', formData).then(res => {
            if(res.code === 1) {
                this.getWishList();
                this.getStoryData('init')
            }
        })
    }
    goAddWishList(){
        this.refs.wishList.close()
        NavigatorUtils.goPage({table_id:this.story_id, flag: 2}, 'AddWishList')
    }
    _closeModal() {
        this.refs.share.close()
    }
    _showToast(data) {
        this.refs.toast.show(data)
    }
    render(){
        const {colwish} = this.props;
        let store = colwish[this.storeName];
        if(!store) {
            store={
                items:[],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: '#fff'}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <SafeAreaView style={[CommonStyle.flexCenter,{
                    position:'absolute',
                    left:0,
                    right:0,
                    top:0,
                    zIndex:999,
                    backgroundColor:'rgba(255,255,255,'+this.state.opacity+')',
                    borderBottomWidth: this.state.onTouchEnd>250?1:0,
                    borderBottomColor:'#f5f5f5'
                }]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                        height: 50
                    }]}>
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{color:this.state.onTouchEnd>230?'#333':'#fff'}}
                            onPress={() => {
                                NavigatorUtils.backToUp(this.props)
                            }}
                        />
                        <View style={CommonStyle.flexEnd}>
                            <AntDesign
                                name={'export'}
                                size={20}
                                style={{color: this.state.onTouchEnd>230?'#333':'#fff',marginRight: 20}}
                                onPress={()=>{
                                    this.refs.share.open()
                                }}
                            />
                            {
                                this.state.storyData.is_collection
                                ?
                                    <AntDesign
                                        name={'heart'}
                                        size={20}
                                        style={{color: this.props.theme}}
                                        onPress={()=>{
                                            this.refs.wishList.open()
                                        }}
                                    />
                                :
                                    <AntDesign
                                        name={'hearto'}
                                        size={20}
                                        style={{color: this.state.onTouchEnd>230?'#333':'#fff'}}
                                        onPress={()=>{
                                            this.refs.wishList.open()
                                        }}
                                    />
                            }

                        </View>
                    </View>
                </SafeAreaView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    removeClippedSubviews
                    scrollEventThrottle={16}
                    onScroll={(event)=>this._onScroll(event)}
                >
                    {
                        this.state.isLoading
                            ?
                            <View style={[CommonStyle.flexCenter,{marginTop: 20,height:height}]}>
                                <ActivityIndicator color="#999" size="small" />
                            </View>
                            :
                            <StoryContent
                                initStatus={(val)=>{this.getStoryData(val)}}
                                story_id={this.story_id}
                                {...this.state}
                                {...this.props}/>
                    }
                </ScrollView>
                <Bot
                    initStatus={(val)=>{this.getStoryData(val)}}
                    changePraise={(data)=>{this._changePraise(data)}}
                    story_id={this.story_id}
                    {...this.state}
                    {...this.props}/>
                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"share"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 180,
                        backgroundColor:'#F3F5F8'
                    }}>
                        <Share closeModal={()=>this._closeModal()} flag={2} showToast={(data)=>this._showToast(data)} {...this.state}/>
                    </View>
                </Modal>
                <Modal
                    style={{height:height*0.5,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"wishList"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={styles.wishModal}>
                        <View style={[CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height: 50,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f3f5f8'
                            }]}>
                                <TouchableOpacity
                                    onPress={()=>this.refs.wishList.close()}
                                >
                                    <Image
                                        source={require('../../../assets/images/collection/sc.png')}
                                        style={{width:15.5,height:15.5}}
                                    />
                                </TouchableOpacity>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight:'bold'
                                }}>选择收藏夹</Text>
                            </View>
                            <ScrollView style={{height:height*0.5-50,width:'100%'}}>
                                <View style={CommonStyle.flexCenter}>
                                    <TouchableOpacity style={[CommonStyle.flexStart,CommonStyle.commonWidth,{
                                        height: 50,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f3f5f8'
                                    }]} onPress={()=>{this.goAddWishList()}}>
                                        <Image
                                            source={require('../../../assets/images/collection/tccjsc.png')}
                                            style={{width:14,height:14}}
                                        />
                                        <Text style={{
                                            color:this.props.theme,
                                            fontSize: 15,
                                            marginLeft: 5,
                                            fontWeight:'bold'
                                        }}>创建新的收藏夹</Text>
                                    </TouchableOpacity>
                                    {
                                        store.items && store.items.data && store.items.data.data && store.items.data.data.length > 0
                                        ?
                                            <View style={CommonStyle.commonWidth}>
                                                {
                                                    store.items.data.data.map((item, index) => {
                                                        return <TouchableOpacity key={index} style={[CommonStyle.spaceRow,{
                                                            paddingTop:19,
                                                            paddingBottom:19,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: '#f3f5f8'
                                                        }]} onPress={()=>this.chanegCollection(item.group_id, item.is_this_colle)}>
                                                            <View style={CommonStyle.flexStart}>
                                                                <View style={[CommonStyle.spaceCol,{
                                                                    maxWidth: 200,
                                                                    alignItems: 'flex-start'
                                                                }]}>
                                                                    <Text style={{color:'#333',fontWeight: 'bold',fontSize: 15}}>
                                                                        {item.group_name}
                                                                    </Text>
                                                                    <Text style={{
                                                                        color:'#999',
                                                                        fontSize: 13,
                                                                        marginTop: 10
                                                                    }}>{item.count}个收藏</Text>
                                                                </View>
                                                            </View>
                                                            {
                                                                item.is_this_colle === 1
                                                                ?
                                                                    <AntDesign
                                                                        name={'checkcircle'}
                                                                        size={15}
                                                                        style={{color:this.props.theme}}
                                                                    />
                                                                :
                                                                    <AntDesign
                                                                        name={'checkcircle'}
                                                                        size={15}
                                                                        style={{color:'#f3f5f8'}}
                                                                    />
                                                            }


                                                        </TouchableOpacity>
                                                    })
                                                }
                                            </View>
                                        :
                                            <View style={[CommonStyle.flexCenter,{
                                                height: height*0.5 - 50
                                            }]}>
                                                <Image
                                                    source={require('../../../assets/images/que/wxyd.png')}
                                                    style={{width:160,height:160}}
                                                />
                                            </View>
                                    }
                                </View>
                            </ScrollView>

                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme,
    colwish: state.colwish,
    netconnect: state.netconnect.netInfo,
    user: state.user.user
})
const mapDispatchToProps = dispatch => ({
    onLoadColWish: (storeName, url, data) => dispatch(action.onLoadColWish(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(StoryDetail)
class Bot extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            praiseList: []
        }
    }
    checkLoginRoute(route, data){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            NavigatorUtils.goPage(data?data:{}, route)
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    componentDidMount() {
        this.onLoadPraise()
    }
    onLoadPraise() {
        this.setState({
            isLoading: true
        }, () => {
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('story_id',this.props.story_id);
            Fetch.post(NewHttp + 'storyp', formData).then(res =>{
                if(res.code === 1) {
                    this.setState({
                        praiseList: res.data,
                        isLoading: false
                    }, () => {
                        this.props.changePraise(this.state.praiseList)
                    })
                }
            })
        })
    }
    onPraise(){
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',1);
        formData.append('table_id',this.props.story_id);
        formData.append('type',1);
        Fetch.post(HttpUrl + 'Comment/praise', formData).then(res => {
            if(res.code === 1) {
                this.onLoadPraise();
                this.props.initStatus('init')
            }
        })
    }
    cancelPraise() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',1);
        formData.append('table_id',this.props.story_id);
        formData.append('type',2);
        Fetch.post(HttpUrl+'Comment/praise', formData).then(res => {
            if(res.code === 1) {
                this.onLoadPraise();
                this.props.initStatus('init')
            }
        })
    }
    render(){
        const {storyData, netconnect} = this.props
        return(
            <SafeAreaView style={[CommonStyle.flexCenter,{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor:'#fff',
                shadowColor:'#C1C7CF',
                shadowOffset:{width:1, height:1},
                shadowOpacity: 0.6,
                shadowRadius: 2,
            }]}>
                {
                    netconnect.isConnected
                    ?
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height: 50
                        }]}>
                            <TouchableOpacity style={[CommonStyle.flexStart,{
                                height:35,
                                width:250,
                                backgroundColor:'#f5f5f5',
                                borderRadius: 3,
                                paddingLeft: 10
                            }]}
                            onPress={()=>{
                                this.checkLoginRoute('TextInput', {
                                    table_id: this.props.story_id,
                                    flag: 2,
                                    t_id: this.props.story_id,
                                })
                            }}
                            >
                                <Text style={{color:'#999'}}>说点什么吧</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[CommonStyle.flexEnd]}
                                onPress={()=>{storyData.is_praise?this.cancelPraise():this.onPraise()}}
                            >
                                <Text style={{color:storyData.is_praise?this.props.theme:'#999',marginRight: 5}}>{this.state.praiseList.length}个赞</Text>
                                <AntDesign
                                    name={storyData.is_praise?'like1':'like2'}
                                    size={16}
                                    style={{color:storyData.is_praise?this.props.theme:'#999'}}
                                />

                            </TouchableOpacity>

                        </View>
                    :
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 50
                        }]}>
                            <Text style={{color: '#ff5673'}}>当前无网络连接，请连接后重试</Text>
                        </View>
                }

            </SafeAreaView>
        )
    }
}
class Banner extends Component{
    render(){
        const {storyData} = this.props
        return(
            <View style={{width:'100%',height:300,backgroundColor:this.props.theme}}>
                <Swiper
                    showsButtons={false}
                    showsPagination={true}
                    horizontal={true}
                    loop={true}
                    autoplay={true}
                    autoplayTimeout={6}
                    activeDotColor={this.props.theme}
                >
                    {
                        storyData.image && storyData.image.length > 0
                        ?
                            storyData.image.map((item, index) => {
                                return <LazyImage
                                    key={index}
                                    source={{uri: item.domain + item.image_url}}
                                    style={{width:'100%',height:300}}
                                    resizeMode={'cover'}
                                />
                            })
                        :
                          <LazyImage
                            source={require('../../../assets/images/c1.jpeg')}
                            style={{width:'100%',height:300}}
                          />
                    }
                </Swiper>
            </View>
        )
    }
}

class StoryContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            reportLoading: false,
            attention: '',
            userInfo: '',
            focusLoading: false,
            table_id: ''
        }
    }
    componentWillMount() {
        this.getStoryData()
    }
    onReport() {
        Alert.alert('举报','确定举报该篇故事？',[
            {text:'取消'},
            {text:'确定', onPress: () => {this.report()}}
        ],{
            cancelable: false,
        })
    }
    report() {
        this.setState({
            reportLoading: true
        }, () => {
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('flag',3);
            formData.append('table_id',this.props.story_id);
            formData.append('content','');
            formData.append('option_id','');
            Fetch.post(NewHttp + 'ReportU', formData).then(res => {
                if(res.code === 1) {
                    this.setState({
                        reportLoading: false
                    },() => {
                        this.props.initStatus('init');
                    })


                }
            })
        })
    }
    onFocus(val) {
        let user_id = this.props.storyData.user.user_id;
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('att_user_id',user_id);
        formData.append('type',val?2:1);
        Fetch.post(HttpUrl+'Comment/attention', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    attention: val?0:1
                })
            }
        })
    }
    getStoryData(val) {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('story_id',this.props.story_id);
        formData.append('visit',1);
        formData.append('praise',1);
        Fetch.post(HttpUrl + 'Story/get_story', formData).then(
            res => {
                if(res.code === 1) {
                    this.getUserinfo(res.data.user.user_id)
                }
            }
        )
    }
    getUserinfo(user_id) {
        this.setState({
            focusLoading: true
        }, () => {
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('user_id',user_id);
            Fetch.post(HttpUrl+'User/get_otheruser', formData).then(res =>{
                if(res.code === 1) {
                    this.setState({
                        userInfo:res.data,
                        attention:res.data.is_attention,
                        focusLoading: false
                    })
                }
            })
        })

    }
    _showBackModal(data) {

        this.setState({
            table_id: data.msg_id
        },() => {
            this.refs.content.open()
        })

    }
    commentsBack() {
        this.refs.content.close();
        NavigatorUtils.goPage({
            table_flag: 2,
            flag: 5,
            table_id: this.state.table_id,
            t_id: this.props.story_id
        }, 'TextInput')
    }
    render(){
        const {storyData, praiseList} = this.props
        return(
            <View style={CommonStyle.flexCenter}>
                <Banner {...this.props}/>
                <View style={CommonStyle.commonWidth}>
                    <Text style={{
                        color:'#127D80',
                        fontSize: 12,
                        marginTop:  25,
                        fontWeight:'bold'
                    }}>{storyData.country}{storyData.province}{storyData.city==='直辖市'?null:storyData.city}{storyData.region}</Text>
                    <Text style={{
                        color:'#333',
                        fontWeight:'bold',
                        fontSize: 22,
                        marginTop: 10,
                    }}>{storyData.title}</Text>
                    <View style={[CommonStyle.spaceRow,{
                        marginTop: 30
                    }]}>
                        <View style={CommonStyle.flexStart}>
                            <LazyImage
                                source={storyData.user&&storyData.user.headimage?
                                    {uri:storyData.user.headimage.domain+storyData.user.headimage.image_url}:
                                require('../../../assets/images/touxiang.png')}
                                style={{
                                    width:35,
                                    height:35,
                                    borderRadius: 17.5
                                }}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                height: 40,
                                marginLeft: 10,
                                alignItems:'flex-start'
                            }]}>
                                <Text style={{color:'#333',fontWeight:'bold'}}>
                                    {
                                        storyData.user && (storyData.user.family_name || storyData.user.middle_name || storyData.user.name)
                                            ?
                                            storyData.user.family_name + storyData.user.middle_name + storyData.user.name
                                            :
                                             '匿名用户'
                                    }
                                </Text>
                                <Text style={{color:'#666',fontSize: 12}}>{storyData.create_time}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            width:60,
                            height:32,
                            borderWidth: this.state.attention?0:1,
                            borderColor: this.props.theme,
                            borderRadius: 5,
                            backgroundColor: this.state.attention?this.props.theme:'#fff'
                        }]} onPress={()=>{this.state.focusLoading?null:this.onFocus(this.state.attention)}}>
                            {
                                this.state.focusLoading
                                ?
                                    <ActivityIndicator color="#999" size="small" />
                                :
                                    <Text style={{color: this.state.attention?'#fff':this.props.theme}}>
                                        {this.state.attention?'已关注':'关注'}
                                    </Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        color:'#666',
                        fontSize:16,
                        lineHeight:23,
                        marginTop:30
                    }}>{storyData.content}</Text>
                    <View style={[CommonStyle.spaceRow,{
                        marginTop: 30
                    }]}>
                        <View style={CommonStyle.flexStart}>
                            {
                                praiseList.slice(0, 3).map((item, index) => {
                                    return <LazyImage
                                        key={index}
                                        source={item.domain&&item.image_url?{uri:item.domain+item.image_url}:
                                        require('../../../assets/images/touxiang.png')}
                                        style={{
                                            width:20,
                                            height:20,
                                            borderRadius: 10,
                                            marginLeft:index===0?0:-3
                                        }}
                                    />
                                })
                            }
                            <Text style={{
                                color:'#666',
                                fontSize:12,
                                marginLeft: 5}}>{praiseList.length}人已赞</Text>
                        </View>
                        {
                            this.state.reportLoading
                            ?
                                <ActivityIndicator color="#999" size="small" />
                            :
                            storyData.is_report
                            ?
                                <Text style={{
                                    color:'#ff5673',
                                    fontSize:12,
                                }}>已举报</Text>
                            :
                                <Text style={{
                                    color:'#666',
                                    fontSize:12,
                                }} onPress={()=>this.onReport()}>举报</Text>
                        }

                    </View>
                    <Text style={[styles.story_title,{
                        marginTop: 40
                    }]}>评价</Text>
                    {/*评价*/}
                    <Comments showBackModal={(data)=>{
                        this._showBackModal(data)
                    }} {...this.props}/>
                    <Text style={[styles.story_title,{
                        marginTop: 40
                    }]}>你可能还会想看</Text>
                    {/*相似故事*/}
                    <SameStory {...this.props}/>
                </View>
                <Modal
                    style={{height:140,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"content"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{height: 120,alignItems:'center'}}>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 50,
                            backgroundColor: '#fff',
                            borderRadius: 5
                        }]}
                            onPress={()=>{
                                this.commentsBack()
                            }}
                        >
                            <Text style={{color:'#333'}}>回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 50,
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            marginTop: 10,
                            marginBottom: 10
                        }]}>
                            <Text style={{color:'red'}}>举报</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    story_title: {
        color:'#333',
        fontSize:16,
        fontWeight:'bold',
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
    wishModal:{
        width:"100%",
        height:height*0.5,
        backgroundColor:"#ffffff",
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        shadowColor: '#000000',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 5,
        shadowOpacity: 0.1
    }
})
class Comments extends Component{
    render(){
        return(
            <View>
                <Comment
                    table_id={this.props.story_id}
                    flag={2}
                    type={'detail'}
                    showBackModal={(data)=>{this.props.showBackModal(data)}}
                />
            </View>
        )
    }
}
class SameStory extends Component{
    constructor(props) {
        super(props);
        this.state = {
            storyList: []
        }
    }
    componentDidMount(){
        this.onLoadSameStory()
    }
    onLoadSameStory() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('story_id',this.props.story_id);
        Fetch.post(NewHttp+'storys', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    storyList: res.data
                })
            }
        })
    }
    _renderStory(data){
        return <TouchableOpacity
            style={{
                width: (width*0.94-14) / 2,
                marginLeft: data.index%2===0?0: 13,
                marginTop: 25,
                paddingBottom: 3
            }}
            onPress={() => {
                NavigatorUtils.goPage({story_id: data.item.story_id}, 'StoryDetail', 'push')
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
                        <Image source={require('../../../assets/images/home/xqdz.png')} style={{
                            width:11,
                            height:13,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexStart,{marginLeft: 20}]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.leaving_num}</Text>
                        <Image source={require('../../../assets/images/home/pinglun.png')} style={{
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
        return(
            <View style={{marginBottom: 100}}>
                <FlatList
                    data={this.state.storyList.slice(0, 4)}
                    horizontal={false}
                    numColumns={2}
                    renderItem={(data)=>this._renderStory(data)}
                    showsHorizontalScrollIndicator = {false}
                    showsVerticalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

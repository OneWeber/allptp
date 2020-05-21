import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Image,
} from 'react-native';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import {connect} from 'react-redux'
import Swiper from 'react-native-swiper'
import {ScrollView} from 'react-navigation';
import CommonStyle from '../../../assets/css/Common_css';
import StarRating from "react-native-star-rating";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LazyImage from 'animated-lazy-image';
import Comment from '../../common/Comment';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import NewHttp from '../../utils/NewHttp';
import ActiveList from '../../common/ActiveList';
import NoData from '../../common/NoData';
import Loading from '../../common/Loading';
import action from '../../action'
import Toast from 'react-native-easy-toast';
import Share from '../../common/Share';
import MapView, {
    Marker,
    Callout,
    AnimatedRegion,} from 'react-native-maps';
import Modal from 'react-native-modalbox';
const {width, height} = Dimensions.get('window');
const screen = Dimensions.get('window');
class ActiveDetail extends Component{
    constructor(props) {
        super(props);
        this.table_id = this.props.navigation.state.params.table_id;
        this.state = {
            data: '',
            onTouchEnd:0,
            banner:[],
            activeImgs:[],
            isLoading:false,
            opacity: 0,
            isFull: false,
            isOverdue:false
        }
    }
    componentDidMount(){
        this.setState({
            isLoading:true
        }, () => {
            this.loadData();
            this.loadDiscount();
            this.getWishList();
        })

    }
    loadData() {
        const {token} = this.props
        let formData=new FormData();
        formData.append('token',token);
        formData.append('activity_id',this.table_id);
        formData.append('visit',1);
        Fetch.post(HttpUrl + 'Activity/get_activity', formData).then(res => {
            this.setState({
                isLoading:false
            })
            if(res.code === 1) {
                this.setState({
                    data: res.data
                },() => {
                  let imgArr= this.bannerImg(this.state.data.image);
                  let bannerArr = this.bannerImg(this.state.data.image).slice(0, 5)
                    this.setState({
                        activeImgs:imgArr,
                        banner: bannerArr
                    },() => {
                        console.log('banner', this.state.banner)
                        this.checkStatus(this.state.data)
                    })
                })
            }
        })
    }
    loadDiscount() {
        const {token} = this.props
        let formData=new FormData();
        formData.append('token',token);
        formData.append('version','2.0');
        formData.append('activity_id',this.table_id);
        Fetch.post(NewHttp+'ActivityDiscountTwo', formData).then(res => {
            if(res.code === 1) {
                console.log('discount', res)
            }
        })
    }
    getWishList(){
        const {onLoadColWish} = this.props;
        this.storeName = 'colwish';
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',1);
        formData.append('table_id',this.table_id);
        onLoadColWish(this.storeName, HttpUrl+'Comment/collegroup_list', formData)
    }
    bannerImg(data){ //遍历banner图
        let  totalImg=[];
        for(let i=0;i<data.length;i++) {
            if(data[i].extension==='jpg'||'jpeg'||'png'){
                totalImg.push({
                    url: {uri: data[i].domain + data[i].image_url}
                })
            }
        }
        return totalImg
    }
    checkStatus(data){//查看该活动是否满员或者过期
        if(data.long_day === 1) {
            let arr = []
            for(let i=0;i<data.slot.length;i++){
                for(let k=0;k<data.slot[i].list.length;k++){
                    if(data.slot[i].list[k].personNum>data.slot[i].list[k].order_person_num){
                        this.setState({
                            isFull:false
                        })
                    }else{
                        this.setState({
                            isFull:true
                        })
                    }
                }
                arr.push(data.slot[i].status)
                if(arr.indexOf(0)>-1){
                    this.setState({
                        isOverdue:false
                    })
                }else{
                    this.setState({
                        isOverdue:true
                    })
                }
            }
        } else {
            let arr = []
            for(let i=0;i<data.slot.length;i++){
                if(data.slot[i].max_person_num > data.slot[i].order_person_num){
                    this.setState({
                        isFull:false
                    })
                } else {
                    this.setState({
                        isFull:true
                    })
                }
                arr.push(data.slot[i].status)
                if(arr.indexOf(0)>-1){
                    this.setState({
                        isOverdue:false
                    })
                }else{
                    this.setState({
                        isOverdue:true
                    })
                }
            }
        }
    }
    _onScroll(e){
        let y = e.nativeEvent.contentOffset.y;
        this.setState({
            onTouchEnd:y
        })
        let opacityPercent = y / 300;
        this.setState({
            opacity:opacityPercent
        })
    }
    goDay(vol, isMe, long_day, table_id) {
        const {isOverdue, data} = this.state
        if(isOverdue || !data.price) {
            this.refs.toast.show('该体验暂已过期')
        } else {
            if(long_day === 1){
                const {initJoin, join, initSlot} = this.props
                initSlot({
                    slot: this.state.data.slot
                })
                let datas = join
                datas.activity_id = table_id;
                datas.age_limit = data.age_limit;
                datas.house = data.house
                initJoin(datas)
                NavigatorUtils.goPage({vol: vol, isMe: isMe, issatay: data.issatay},'SingleDay', 'navigate')
            } else {
                const {initJoin, join, initSlot} = this.props;
                initSlot({
                    slot: this.state.data.slot
                });
                let datas = join
                datas.activity_id = table_id;
                datas.age_limit = data.age_limit;
                datas.house = data.house
                initJoin(datas)

                NavigatorUtils.goPage({},'ManyDay', 'navigate')
            }
        }

    }
    _onSliderChange(index){

    }
    goAddWishList(){
        this.refs.wishList.close()
        NavigatorUtils.goPage({table_id:this.table_id, flag: 1}, 'AddWishList')
    }
    _showToast(data) {
        this.refs.toast.show(data)
    }
    chanegCollection(group_id, is_this_colle){
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',1);
        formData.append('table_id',this.table_id);
        formData.append('group_id',group_id);
        formData.append('type',is_this_colle===1?2:1);
        Fetch.post(HttpUrl+'Comment/collection', formData).then(res => {
            if(res.code === 1) {
                this.getWishList();
                this.loadData()
            }else{
                console.log(res.msg)
            }
        })
    }
    _closeModal() {
        this.refs.share.close()
    }
    render(){
        const {data, onTouchEnd, isLoading, opacity, isOverdue, isFull} = this.state
        const {theme, user, netconnect} = this.props
        const nav = <View style={styles.nav_con}>
            <SafeAreaView style={{
                backgroundColor:'rgba(255,255,255,'+opacity+')',
                borderBottomColor:'#f5f5f5',
                borderBottomWidth: onTouchEnd > 300 ? 1 : 0
            }}>
                <View style={[styles.nav_header,CommonStyle.flexCenter]}>
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                        <AntDesign
                            name={'left'}
                            size={24}
                            style={{color:onTouchEnd<=0?'#fff':'#333'}}
                            onPress={()=>{NavigatorUtils.backToUp(this.props)}}
                        />
                        <View style={[CommonStyle.flexEnd]}>
                            {
                                data.is_collection
                                    ?
                                    <AntDesign
                                        name={'heart'}
                                        size={20}
                                        style={{color: this.props.theme,marginRight: 20}}
                                        onPress={()=>{this.refs.wishList.open()}}
                                    />
                                    :
                                    <AntDesign
                                        name={'hearto'}
                                        size={20}
                                        style={{color:onTouchEnd<=0?'#fff':'#333',marginRight: 20}}
                                        onPress={()=>{this.refs.wishList.open()}}
                                    />
                            }
                            <AntDesign
                                name={'export'}
                                size={24}
                                style={{color:onTouchEnd<=0?'#fff':'#333'}}
                                onPress={()=>{
                                    this.refs.share.open()
                                }}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
        const {colwish} = this.props;
        let store = colwish[this.storeName];
        if(!store) {
            store={
                items:[],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1,position:'relative'}}>
                {nav}
                <ScrollView
                    showsHorizontalScrollIndicator = {false}
                    scrollEventThrottle={16}
                    onScroll={(event)=>this._onScroll(event)}
                >
                    <View style={styles.banner_con}>
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
                                this.state.banner.map((item, index) => {
                                    return <LazyImage
                                        key={index}
                                        source={{uri:item.url.uri}}
                                        style={{
                                            width:width,
                                            height:height*0.7
                                        }}
                                    />
                                })
                            }
                        </Swiper>

                        <View style={[CommonStyle.flexCenter, styles.more_img_btn]}>
                            <Text style={{color:'#999'}}>更多图集与视频</Text>
                        </View>
                    </View>
                    {
                        isLoading
                        ?
                            <View style={[CommonStyle.flexCenter]}>
                                <ActivityIndicator
                                    size={'small'}
                                    color={theme}
                                    style={{marginTop: 30}}
                                />
                            </View>
                        :
                            <View>
                                <View style={{backgroundColor: '#fff'}}>
                                    <View style={[CommonStyle.commonWidth,{marginLeft: width*0.03}]}>
                                        <AboutActive {...this.state} {...this.props}/>
                                    </View>
                                </View>
                                {
                                    data.is_volunteen === 1
                                    ?
                                        <VolunteerApply isMe={data.user.user_id === user.userid?1:0} goDaySelect={(val) => this.goDay(val,data.user.user_id === user.userid?1:0, data.long_day, this.table_id )} />
                                    :
                                        null
                                }
                                <View style={{marginTop: data.is_volunteen === 1?0:10}}>
                                    <Preferential />
                                </View>
                                <View style={[aboutStyles.content_con,CommonStyle.flexCenter]}>
                                    <View style={CommonStyle.commonWidth}>
                                        <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>
                                            策划者{data.user && (data.user.family_name || data.user.middle_name || data.user.name)?
                                            data.user.family_name+' '+data.user.middle_name+' '+data.user.name
                                            :'匿名用户'
                                        }
                                        </Text>
                                        <LazyImage
                                            source={data.user&&data.user.headimage?
                                                {uri:data.user.headimage.domain+data.user.headimage.image_url}:
                                                require('../../../assets/images/touxiang.png')}
                                            style={aboutStyles.headimage}
                                        />
                                        <Text style={{lineHeight:22,fontSize:15,color:'#333',marginTop:20}}>{data.introduce}</Text>
                                        <Text style={aboutStyles.translate_btn}>查看翻译</Text>
                                        <Text style={{color:'#333',fontSize:16,fontWeight:'bold',marginTop:35}}>体验内容</Text>
                                        <Text style={{lineHeight:22,fontSize:15,color:'#333',marginTop:20}}>{data.descripte}</Text>
                                        <Text style={aboutStyles.translate_btn}>查看翻译</Text>
                                        <TouchableOpacity style={[aboutStyles.apply_btn,CommonStyle.flexCenter,{height:50,marginTop:10}]}>
                                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                                <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>志愿者翻译</Text>
                                                <AntDesign
                                                    name={'right'}
                                                    size={16}
                                                    style={{color:'#333'}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={{color:'#333',fontSize:16,fontWeight:'bold',marginTop:10}}>体验地点</Text>
                                        <Text style={{lineHeight:22,fontSize:15,color:'#333',marginTop:20}}>
                                            体验地点是{data.country}{data.province}{data.city==='市辖区'?null:data.city}{data.region},
                                            另外在活动中我们还将去到{data.go_place}
                                        </Text>
                                        <View style={aboutStyles.active_map}>
                                            {
                                                data.set_address_lat && data.set_address_lng
                                                ?
                                                    <MapView
                                                        initialRegion={{
                                                            latitude: data.set_address_lat?JSON.parse(data.set_address_lat):0,
                                                            longitude: data.set_address_lng?JSON.parse(data.set_address_lng):0,
                                                            latitudeDelta: 0.0922,
                                                            longitudeDelta: 0.0922 * (screen.width / screen.height),
                                                        }}
                                                        style={{
                                                            width:'100%',
                                                            height: 180
                                                        }}
                                                    >
                                                        <Marker
                                                            coordinate={{
                                                                latitude: data.set_address_lat?JSON.parse(data.set_address_lat):0,
                                                                longitude: data.set_address_lng?JSON.parse(data.set_address_lng):0,
                                                            }}
                                                            tracksViewChanges={true}
                                                            ref={markerRef => this.markerRef = markerRef}
                                                            stopPropagation={true}
                                                            onPress={()=>{}}
                                                        >
                                                            <AntDesign
                                                                name={'enviroment'}
                                                                size={32}
                                                                style={{color:'#14c5ca'}}
                                                            />
                                                        </Marker>
                                                    </MapView>
                                                :
                                                    null
                                            }

                                            <TouchableOpacity style={{
                                                position:'absolute',
                                                left:0,
                                                right:0,
                                                bottom:0,
                                                top:0,
                                            }} onPress={()=>{
                                                NavigatorUtils.goPage({
                                                    set_address_lat: data.set_address_lat,
                                                    set_address_lng: data.set_address_lng,
                                                    set_address: data.set_address,
                                                },'Map')
                                            }}></TouchableOpacity>
                                        </View>

                                    </View>
                                </View>

                                <Comments {...this.state} {...this.props} table_id={this.table_id}/>
                                <AboutOther {...this.state} {...this.props}/>
                                <SameActiveMap {...this.state} {...this.props} table_id={this.table_id}/>
                            </View>
                    }

                </ScrollView>
                <SafeAreaView style={[CommonStyle.flexCenter,styles.active_bot]}>
                    {
                        netconnect.isConnected
                        ?
                        isLoading
                        ?
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:60}]}>
                                <ActivityIndicator size={'small'} color={theme} />
                            </View>
                        :
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height:60}]}>
                                <View style={[CommonStyle.spaceCol,{height: 40,alignItems: "flex-start"}]}>
                                    {
                                        data.price && !isOverdue
                                            ?
                                            <Text style={{fontWeight: 'bold',color:'#333',fontSize: 15}}>¥{data.price}/人</Text>
                                            :
                                            <Text style={{fontWeight: 'bold',color:'#999',fontSize: 15}}>暂已过期</Text>
                                    }
                                    <View style={CommonStyle.spaceRow}>
                                        <View>
                                            <StarRating
                                                disabled={true}
                                                maxStars={'5'}
                                                rating={data.score}
                                                starSize={12}
                                                fullStarColor={theme}
                                                emptyStarColor={theme}
                                            />
                                        </View>
                                        <Text style={{color:theme,marginLeft:5}}>{data.score}</Text>
                                    </View>
                                </View>
                                {
                                    isOverdue || !data.price
                                        ?
                                        <View style={[styles.bot_btn,CommonStyle.flexCenter,{backgroundColor: '#ff5673'}]}>
                                            <Text style={{color: '#fff',fontWeight: 'bold'}}>已过期</Text>
                                        </View>
                                        :
                                        isFull
                                        ?
                                        <View style={[styles.bot_btn,CommonStyle.flexCenter,{backgroundColor: '#ff5673'}]}>
                                            <Text style={{color: '#fff',fontWeight: 'bold'}}>已经满员</Text>
                                        </View>
                                        :
                                        <TouchableOpacity
                                            style={[styles.bot_btn,CommonStyle.flexCenter,{backgroundColor: theme}]}
                                            onPress={()=>this.goDay(0,data.user.user_id === user.userid?1:0, data.long_day, this.table_id)}
                                        >
                                            <Text style={{color: '#fff',fontWeight: 'bold'}}>
                                                {
                                                    data.user
                                                    ?
                                                    data.user.user_id === user.userid
                                                        ?
                                                        '查看日期'
                                                        :
                                                        '选择日期'
                                                    :
                                                    '选择日期'
                                                }
                                            </Text>
                                        </TouchableOpacity>

                                }

                            </View>
                        :
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:60}]}>
                                <Text style={{color: '#ff5673'}}>当前无网络连接，请连接后重试</Text>
                            </View>
                    }

                </SafeAreaView>
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
                        <Share closeModal={()=>this._closeModal()} flag={1} showToast={(data)=>this._showToast(data)} {...this.state}/>
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
const styles = StyleSheet.create({
    banner_con: {
        width: width,
        height:height*0.7,
        position:'relative'
    },
    more_img_btn:{
        position:'absolute',
        left: width*0.03,
        bottom:40,
        width:120,
        height:36,
        backgroundColor:'rgba(255,255,255,.9)',
        borderRadius: 5,
    },
    nav_con:{
        position:'absolute',
        left:0,
        top:0,
        right:0,
        zIndex: 5
    },
    nav_header:{
        height: 50,
    },
    active_bot:{
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        backgroundColor:'#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 0.5,
    },
    bot_btn:{
        width:100,
        height: 40,
        borderRadius: 5
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
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme,
    user: state.user.user,
    join: state.join.join,
    netconnect: state.netconnect.netInfo,
    colwish: state.colwish,
})
const mapDispatchTopProps = dispatch => ({
    initJoin: join => dispatch(action.initJoin(join)),
    initSlot: slot => dispatch(action.initSlot(slot)),
    onLoadColWish: (storeName, url, data) => dispatch(action.onLoadColWish(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchTopProps)(ActiveDetail)
class AboutActive extends Component{
    render(){
        const {data, theme} = this.props;
        return(
            <View style={{paddingTop: 15,paddingBottom: 20}}>
                <Text style={aboutStyles.active_title}>
                    {data.title}
                </Text>
                <View style={[CommonStyle.flexStart,{marginTop:15}]}>
                    <View>
                        <StarRating
                            disabled={true}
                            maxStars={'5'}
                            rating={data.score}
                            starSize={16}
                            fullStarColor={theme}
                            emptyStarColor={theme}
                        />
                    </View>
                    <Text style={[aboutStyles.score, {color: theme}]}>{data.score}</Text>
                </View>
                <View style={[CommonStyle.flexStart,{marginTop: 15}]}>
                    <View style={aboutStyles.active_tabs}>
                        <Text style={{color:'#333'}}>{data.country}{data.province}</Text>
                    </View>
                    <View style={aboutStyles.active_tabs}>
                        <Text style={{color:'#333'}}>{data.kind&&data.kind[0]?data.kind[0].kind_name:null}</Text>
                    </View>
                </View>
                <View style={[CommonStyle.flexStart,{flexWrap: 'wrap',alignItems: 'flex-start',justifyContent: "flex-start"}]}>
                    <PromtItem icon={'place'} title={'地址'} content={<View style={CommonStyle.flexStart}>
                        <Text style={aboutStyles.item_content}>{data.province}</Text>
                        <Text style={[aboutStyles.item_content,{marginLeft: 5}]}>{data.city==='直辖市'?null:data.city}</Text>
                    </View>}/>
                    <PromtItem icon={'assignment'} title={'提供'} content={<View style={CommonStyle.flexStart}>
                        <Text style={aboutStyles.item_content}>{data.activ_provite?data.activ_provite:'不提供任何东西'}</Text>
                    </View>}/>
                    <PromtItem icon={'watch-later'} title={'时长'} content={<View style={CommonStyle.flexStart}>
                        <Text style={aboutStyles.item_content}>{data.total_time?data.total_time:'暂未统计时长'}</Text>
                    </View>}/>
                    <PromtItem icon={'assessment'} title={'准备'} content={<View style={CommonStyle.flexStart}>
                        <Text style={aboutStyles.item_content}>{data.activ_bring?data.activ_bring:'无需自带'}</Text>
                    </View>}/>
                    <PromtItem icon={'assessment'} title={'语言'} content={<View style={CommonStyle.flexStart}>
                        <Text style={aboutStyles.item_content}>
                            {data.main_laguage===0?'中文':data.main_laguage===1?'English':'日本語'}
                            {
                                data.other_laguage && data.other_laguage.split(',').length>0
                                ?
                                    data.other_laguage.split(',').map((item,index)=>{
                                        return(
                                            item==data.main_laguage
                                                ?
                                                null
                                                :
                                                item==0?'中文':item==1?'English':'日本語'
                                        )
                                    })
                                :
                                    null
                            }
                        </Text>
                    </View>}/>
                    <PromtItem icon={'view-carousel'} title={'房源'} content={<View style={CommonStyle.flexStart}>
                        <Text style={aboutStyles.item_content}>{
                            data.issatay===0
                            ?
                                '不提供'
                            :
                                data.issatay===1
                            ?
                                '需购买'
                            :
                                '免费住宿'
                        }</Text>
                    </View>}/>
                </View>


            </View>
        )
    }
}
const aboutStyles = StyleSheet.create({
    active_title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    score:{
        marginLeft:5,
        fontWeight: "bold",
        fontSize: 16
    },
    active_tabs:{
        padding:12,
        marginRight:10,
        borderRadius: 5,
        backgroundColor: "#F5F7FA"
    },
    items:{
        width: width*0.94/2,
        marginTop: 20,
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    item_icon:{
        color:'#666666'
    },
    item_title:{
        marginLeft: 5,
        color:'#666'
    },
    item_content:{
        fontWeight:'bold',
        color:'#333'
    },
    apply_btn:{
        height: 65,
        marginTop:10,
        marginBottom:10,
        backgroundColor:'#fff'
    },
    preferential_con:{
        paddingTop:20,
        backgroundColor:'#fff',
        marginBottom: 20
    },
    p_tabs:{
        width:44,
        height:24,
    },
    p_tabs_txt:{
        fontSize: 12,
        fontWeight:'bold'
    },
    p_tabs_con:{
        width:width*0.94-45-54
    },
    content_con:{
        backgroundColor:'#fff',
        paddingBottom:20,
        paddingTop:20,
        marginBottom:10
    },
    headimage:{
        width: 60,
        height:60,
        borderRadius:30,
        marginTop:20
    },
    translate_btn:{
        color:'#666',
        fontSize: 13,
        marginTop:10
    },
    active_map:{
        marginTop:10,
        height:180,
        backgroundColor:'#f5f5f5',
        position:'relative'
    },
    other_item_btn:{
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    houseing_item:{
        marginTop: 15
    },
    house_img:{
        width:140,
        height:90
    }

})
//详情提示
class PromtItem extends Component{
    render(){
        const {icon, title, content} = this.props
        return(
            <View style={aboutStyles.items}>
                <View style={CommonStyle.flexStart}>
                    <MaterialIcons
                        name={icon}
                        size={20}
                        style={aboutStyles.item_icon}
                    />
                    <Text style={aboutStyles.item_title}>{title}</Text>
                </View>
                <View style={{marginTop: 12}}>
                    {content}
                </View>
            </View>
        )
    }
}
//志愿者报名
class VolunteerApply extends Component{
    render(){
        const {isMe} = this.props
        return (
            <TouchableOpacity style={[aboutStyles.apply_btn,CommonStyle.flexCenter]}
                onPress={() => this.props.goDaySelect(1)}
            >
                <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>
                        {
                            isMe
                            ?
                                '邀请志愿者'
                            :
                                '志愿者报名'
                        }
                    </Text>
                    <AntDesign
                        name={'right'}
                        size={16}
                        style={{color:'#333'}}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}
//优惠
class Preferential extends Component{
    render(){
        return(
            <View style={[aboutStyles.preferential_con,CommonStyle.flexCenter,{marginBottom: 10}]}>
                <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{alignItems: 'flex-start'}]}>
                    <View style={{width:45}}>
                        <Text style={{color:'#333',fontWeight:'bold',fontSize: 16}}>优惠</Text>
                    </View>
                    <View style={{width:width*0.94-45}}>
                        {/*折扣*/}
                        <View style={[CommonStyle.spaceRow,{alignItems: "flex-start",marginBottom: 15}]}>
                            <View style={[aboutStyles.p_tabs,CommonStyle.flexCenter,{backgroundColor:'#FDEAEF'}]}>
                                <Text style={[aboutStyles.p_tabs_txt,{color:'#f4648d'}]}>折扣</Text>
                            </View>
                            <View style={aboutStyles.p_tabs_con}>
                                <Text style={{color:'#222',lineHeight:20}}>3月8日-4月5日时间内折扣5%；5 月4日-9月4日时间内折扣9%；</Text>
                            </View>
                        </View>
                        {/*返差价*/}
                        <View style={[CommonStyle.spaceRow,{alignItems: "flex-start",marginBottom: 15}]}>
                            <View style={[aboutStyles.p_tabs,CommonStyle.flexCenter,{backgroundColor:'#FFF1EC'}]}>
                                <Text style={[aboutStyles.p_tabs_txt,{color:'#F37948'}]}>返差价</Text>
                            </View>
                            <View style={aboutStyles.p_tabs_con}>
                                <Text style={{color:'#222',lineHeight:20}}>时间段内体验结束时满10人返预付 10%；满20人返25%；</Text>
                                <View style={[CommonStyle.flexStart,{marginTop: 5}]}>
                                    <Text style={{color:'#666',fontSize:12}}>返差价说明</Text>
                                    <MaterialIcons
                                        name={'help-outline'}
                                        size={14}
                                        style={{color:'#666'}}
                                    />
                                </View>
                            </View>
                        </View>
                        {/*套餐*/}
                        <View style={[CommonStyle.spaceRow,{alignItems: "flex-start",marginBottom: 15}]}>
                            <View style={[aboutStyles.p_tabs,CommonStyle.flexCenter,{backgroundColor:'#E1FBFB'}]}>
                                <Text style={[aboutStyles.p_tabs_txt,{color:'#1E8C8C'}]}>套餐</Text>
                            </View>
                            <View style={aboutStyles.p_tabs_con}>
                                <Text style={{color:'#222',lineHeight:20}}>该活动包含亲子价套餐和综合套餐</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
//体验内容
class ActiveContent extends Component{
    constructor(props) {
        super(props);
        this.ASPECT_RATIO = screen.width / screen.height;
        this.LATITUDE =0;
        this.LONGITUDE = 0;
        this.LATITUDE_DELTA = 0.0922;
        this.LONGITUDE_DELTA = this.LATITUDE_DELTA * this.ASPECT_RATIO;
    }
    render(){
        const {data} = this.props
        return(
            <View style={[aboutStyles.content_con,CommonStyle.flexCenter]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>
                        策划者{data.user && (data.user.family_name || data.user.middle_name || data.user.name)?
                        data.user.family_name+' '+data.user.middle_name+' '+data.user.name
                        :'匿名用户'
                    }
                    </Text>
                    <LazyImage
                        source={data.user&&data.user.headimage?
                            {uri:data.user.headimage.domain+data.user.headimage.image_url}:
                        require('../../../assets/images/touxiang.png')}
                        style={aboutStyles.headimage}
                    />
                    <Text style={{lineHeight:22,fontSize:15,color:'#333',marginTop:20}}>{data.introduce}</Text>
                    <Text style={aboutStyles.translate_btn}>查看翻译</Text>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold',marginTop:35}}>体验内容</Text>
                    <Text style={{lineHeight:22,fontSize:15,color:'#333',marginTop:20}}>{data.descripte}</Text>
                    <Text style={aboutStyles.translate_btn}>查看翻译</Text>
                    <TouchableOpacity style={[aboutStyles.apply_btn,CommonStyle.flexCenter,{height:50,marginTop:10}]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                            <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>志愿者翻译</Text>
                            <AntDesign
                                name={'right'}
                                size={16}
                                style={{color:'#333'}}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold',marginTop:10}}>体验地点</Text>
                    <Text style={{lineHeight:22,fontSize:15,color:'#333',marginTop:20}}>
                        体验地点是{data.country}{data.province}{data.city==='市辖区'?null:data.city}{data.region},
                        另外在活动中我们还将去到{data.go_place}
                    </Text>
                    <View style={aboutStyles.active_map}>
                        <MapView
                            initialRegion={{
                                latitude: this.LATITUDE,
                                longitude: this.LONGITUDE,
                                latitudeDelta: this.LATITUDE_DELTA,
                                longitudeDelta: this.LONGITUDE_DELTA,
                            }}
                            style={{
                                width:'100%',
                                height: 180
                            }}
                        >

                        </MapView>
                        <TouchableOpacity style={{
                            position:'absolute',
                            left:0,
                            right:0,
                            bottom:0,
                            top:0,
                        }} onPress={()=>{
                            NavigatorUtils.goPage({
                                set_address_lat: data.set_address_lat,
                                set_address_lng: data.set_address_lng,
                                set_address: data.set_address,
                            },'Map')
                        }}></TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
}
//评价
class Comments extends Component{
    render(){
        return(
            <View style={[aboutStyles.content_con,CommonStyle.flexCenter]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>评价</Text>
                    <Comment table_id={this.props.table_id} flag={1} type={'detail'}/>
                </View>
            </View>
        )
    }
}
//其他
class AboutOther extends Component{
    _renderHouse(data){
        return <View style={[aboutStyles.houseing_item,{
            marginLeft: data.index===0?width*0.03:10,
            marginRight:data.index===this.props.data.house.length-1?width*0.03:0,
        }]}>
            <ImageBackground
                source={{uri:data.item.image[0].domain + data.item.image[0].image_url}}
                style={[aboutStyles.house_img,]}
            >
                <TouchableOpacity style={[CommonStyle.flexCenter,{flex: 1,backgroundColor:'rgba(0,0,0,.1)'}]}>
                    <Text style={{color: '#fff',fontSize: 12}}>查看图片</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    }
    _renderImage(data){
        return <LazyImage
            source={{uri:data.item.domain + data.item.image_url}}
            style={{
                width: 140,
                height: 90,
                marginTop:15,
                marginLeft: data.index===0?width*0.03:10,
                marginRight:data.index===this.props.data.houseimage.length-1?width*0.03:0,
            }}
        />
    }
    render(){
        const {data} = this.props
        return(
            <View style={[aboutStyles.content_con,{alignItems: "flex-start"}]}>
                <View style={[CommonStyle.commonWidth,{marginLeft:width*0.03}]}>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold',marginTop:5}}>其他</Text>
                    <TouchableOpacity style={[aboutStyles.other_item_btn,CommonStyle.spaceRow,{marginTop: 10}]}>
                        <Text style={{color:'#333',fontSize: 15}}>对参与者对要求</Text>
                        <AntDesign
                            name={'right'}
                            size={16}
                            style={{color:'#333'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[aboutStyles.other_item_btn,CommonStyle.spaceRow]}>
                        <Text style={{color:'#333',fontSize: 15}}>关于体验</Text>
                        <AntDesign
                            name={'right'}
                            size={16}
                            style={{color:'#333'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[aboutStyles.other_item_btn,CommonStyle.spaceRow]}>
                        <Text style={{color:'#333',fontSize: 15}}>体验取消政策</Text>
                        <AntDesign
                            name={'right'}
                            size={16}
                            style={{color:'#333'}}
                        />
                    </TouchableOpacity>
                </View>
                {/*体验房源*/}
                {
                    data.issatay !== 0
                        ?
                        <View style={[CommonStyle.flexCenter, {width:width}]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <Text style={{color:'#333',fontSize:16,marginTop:15}}>体验房源</Text>
                                <Text style={{color:'#999',fontSize:12,marginTop: 10}}>{data.issatay===1?'需购买':'体验自带'}</Text>
                            </View>
                            {
                                data.issatay === 1
                                    ?
                                    data.house.length > 0
                                    ?
                                    <View style={{width: '100%'}}>
                                        <FlatList
                                            data={data.house}
                                            horizontal={true}
                                            renderItem={(data,index)=>this._renderHouse(data)}
                                            showsHorizontalScrollIndicator = {false}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    :
                                        <NoData></NoData>
                                    :
                                    <View style={{width: '100%'}}>
                                        {
                                            data && data.houseimage && data.houseimage.length > 0
                                            ?
                                                <FlatList
                                                    data={data.houseimage}
                                                    horizontal={true}
                                                    renderItem={(data,index)=>this._renderImage(data)}
                                                    showsHorizontalScrollIndicator = {false}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            :
                                                <NoData></NoData>
                                        }
                                    </View>
                            }
                        </View>
                        :
                        null
                }
            </View>
        )
    }
}
//相似体验
class SameActive extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            activeList: []
        }
    }
    componentDidMount(){
        this.setState({
            isLoading: true
        }, () => {
            this.loadData()
        })
    }
    loadData(){
        const {token, table_id} = this.props
        let formData=new FormData();
        formData.append('token', token);
        formData.append('activity_id',table_id);
        Fetch.post(NewHttp + 'actls', formData).then(res => {
            this.setState({
                isLoading: false
            })
            if(res.code === 1) {
                this.setState({
                    activeList: res.data.data
                })
            }
        })
    }
    render(){
        const {isLoading, activeList} = this.state
        return(
            <View style={[aboutStyles.content_con,CommonStyle.flexCenter, {marginBottom: 110}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={{color:'#333',fontSize:16,fontWeight:'bold',marginBottom: 5}}>相似体验</Text>
                    <View>
                        {
                            isLoading
                            ?
                                <Loading />
                            :
                                activeList&&activeList.length > 0
                            ?
                                <ActiveList data={activeList} limit={4} goType={'push'}/>
                            :
                                <NoData></NoData>
                        }
                    </View>
                </View>
            </View>
        )
    }
}
const mapStateToPropsSame = state => ({
    token: state.token.token
})
const SameActiveMap = connect(mapStateToPropsSame)(SameActive)

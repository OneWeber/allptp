import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    RefreshControl,
    FlatList,
    AsyncStorage,
    TouchableHighlight,
    ActivityIndicator,
    TextInput,
    TouchableOpacity
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import HttpUtils from "../../../../https/HttpUtils"
import HttpUrl from "../../../../https/HttpUrl"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import LazyImage from "animated-lazy-image";
import Modal from 'react-native-modalbox';
import Screeningview from "../../../model/Screeningview"
import Video from 'react-native-video';
import Intro, {intro} from 'react-native-intro';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Activitylist extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            isScreening:'',
            token:'',
            isActivityLoading:false,
            keyword:'',
            sort:'',
            step:1,
            price_low:'',
            price_high:'',
            country:'',
            province:'',
            city:'',
            region:'',
            activ_begin_time:'',
            activ_end_time:'',
            language:'',
            max_person_num:'',
            activityList:[],
            isEnd:false,
            touchEnd: '',
            vLevel:0,
            vLast: 3,
            vIndex:'',
            vNum: '',
            t_height: '',
            p_height: '',
            value: '哈哈'
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getActivity()
            })
        })
    }
    componentDidMount() {
        this.intro = intro({group: 'test1'});
        this._showModal();
    }

    _showModal() { //显示新手指导
        this.intro.start();
    }
    getActivity(isLoading){//获取活动界面，主页跟活动列表共用
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('keywords',this.state.keyword);
        formData.append('sort',this.state.sort);
        formData.append('page',this.state.step);
        formData.append('price_low',this.state.price_low);
        formData.append('price_high',this.state.price_high=='不限'?"":this.state.price_high);
        formData.append('country',this.state.country);
        formData.append('province',this.state.province);
        formData.append('city',this.state.city);
        formData.append('region',this.state.region);
        formData.append('activ_begin_time',this.state.activ_begin_time);
        formData.append('activ_end_time',this.state.activ_end_time);
        formData.append('laguage',this.state.language);
        formData.append('kind_id','');
        formData.append('is_volunteen','');
        formData.append('max_person_num',this.state.max_person_num);
        HttpUtils.post(HttpUrl+'Activity/activ_list',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        activityList:result.data.data
                    },()=>{
                        if(isLoading){
                            this.setState({
                                isActivityLoading:false
                            })
                        }
                    })
                }
            }
        )
    }
    getActMp(data) { //获取对应活动中的视频
        for (let i = 0; i < data.length; i++) {

        }
    }
    loadMore(){
        let steps=this.state.step;
        steps++;
        this.setState({
            step:steps
        },()=>{
            let formData=new FormData();
            formData.append('token',this.state.token);
            formData.append('keywords',this.state.keyword);
            formData.append('sort',this.state.sort);
            formData.append('page',this.state.step);
            formData.append('price_low',this.state.price_low);
            formData.append('price_high',this.state.price_high=='不限'?"":this.state.price_high);
            formData.append('country',this.state.country);
            formData.append('province',this.state.province);
            formData.append('city',this.state.city);
            formData.append('region',this.state.region);
            formData.append('activ_begin_time',this.state.activ_begin_time);
            formData.append('activ_end_time',this.state.activ_end_time);
            formData.append('laguage',this.state.language);
            formData.append('kind_id','');
            formData.append('is_volunteen','');
            formData.append('max_person_num',this.state.max_person_num);
            HttpUtils.post(HttpUrl+'Activity/activ_list',formData).then(
                result=>{
                    if(result.code==1){
                        this.setState({
                            activityList:this.state.activityList.concat(result.data.data)
                        },()=>{
                            if(result.data.data.length>0){
                                this.setState({
                                    isEnd:false
                                })
                            }else{
                                this.setState({
                                    isEnd:true
                                })
                            }
                        })
                    }
                }
            )
        })
    }
    genIndicator(){
        return <View style={{alignItems: 'center',justifyContent: 'center',marginTop:30,marginBottom:30,width:'100%'}}>
            {
                !this.state.isEnd
                    ?
                    <ActivityIndicator
                        size={'small'}
                        color={'#999'}
                        animating={true}
                    />
                    :
                    <View style={{width:widthScreen,alignItems: 'center',justifyContent: 'center'}}>
                        <Text style={{paddingTop:3,paddingBottom:3,paddingLeft:5,paddingRight:5,backgroundColor:"#fff",marginTop:-10,fontSize:12,color:"#999"}}>
                            已登上华山顶峰！
                        </Text>
                    </View>

            }

        </View>
    }
    _renderActivty(data){
        let { activityList } = this.state
        return <TouchableHighlight
            style={{marginLeft:data.index%2==0?0:10}}
            underlayColor='rgba(255,255,255,.3)'
            onPress={() =>{this.toActivity(data.item.activity_id)}}
            onLongPress={() => {this.setState({vIndex: data.index})}}
        >
            <View style={[styles.activityLi,{marginTop:15}]}>
                {
                    this.state.vIndex == data.index
                    ?
                        <View style = {styles.activityLiImg}>

                            <Video
                                ref={(ref: Video) => { //方法对引用Video元素的ref引用进行操作
                                    this.video = ref
                                }}
                                /* source={{ uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__', type: 'mpd' }} */
                                source={{uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__'}}//设置视频源
                                style={styles.activityLiImg}//组件样式
                                muted={true}//控制音频是否静音
                                resizeMode={'cover'}//缩放模式
                                repeat={true}//确定在到达结尾时是否重复播放视频。
                            />
                        </View>
                    :
                        <LazyImage
                            source={{uri:data.item.domain+data.item.image_url}}
                            style={styles.activityLiImg}
                        />
                }

                <View style={{width:'100%'}}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={{color:'#333333',marginTop:7,fontWeight:'bold'}}
                    >{data.item.title}</Text>
                    <View style={[commonStyle.flexSpace,{width:'100%',marginTop:5}]}>
                        {
                            data.item.price==null || data.item.price=='null' || data.item.price==''
                                ?
                                <Text style={{color:'#999',fontSize:12,fontWeight:'bold'}}>暂已过期<Text style={{color:'#fff'}}>/</Text></Text>
                                :
                                <Text style={{color:'#ff5673',fontSize:12,fontWeight:'bold'}}>{data.item.price} ¥/人</Text>
                        }
                        <SimpleLineIcons
                            name={'options-vertical'}
                            style={{color:'#999999'}}
                        />
                    </View>

                </View>
            </View>
        </TouchableHighlight>
    }
    toActivity(activity_id){
        this.props.navigation.navigate('Activity', { activity_id: activity_id })
    }
    activityLoading(){
        this.setState({
            isActivityLoading: true
        },()=>{
            this.getActivity(true);
        })
    }
    onClose(){
        this.setState({
            isScreening:false
        })
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,position:'relative'}} ref={'total'} >
                <View style={{flex:1}}>
                    <View style={[commonStyle.contentViewWidth,{marginLeft:widthScreen*0.02}]}>
                        {
                            this.state.isScreening
                                ?
                                <View style={[commonStyle.flexCenter,{height:50}]}>
                                    <Text style={{
                                        color:'#333',
                                        fontWeight:'bold',
                                        fontSize:18
                                    }}>体验筛选条件</Text>
                                </View>
                                :
                                <View style={[commonStyle.flexSpace,{height:50}]}>
                                    <AntDesign
                                        name={'left'}
                                        size={24}
                                        style={{color:'#333',width:40}}
                                        onPress={()=>this.props.navigation.goBack()}
                                    />
                                    <View style={[commonStyle.flexStart]}>
                                        <View style = {[commonStyle.flexEnd, {marginRight: 15}]}>
                                            <Intro
                                                content="点击输入关键字查询更多相关体验!"
                                                group="test1"
                                                step={2}
                                                style = {{position: 'relative'}}
                                            >
                                            <AntDesign
                                                name={'search1'}
                                                size={24}
                                                style={{color:'#333'}}
                                            />
                                            </Intro>
                                        </View>
                                        <Intro
                                               content="点击获取更多查询体验的条件！"
                                               group="test1"
                                               step={1}
                                               style = {{position: 'relative'}}
                                        >
                                            <AntDesign
                                                name={'profile'}
                                                size={24}
                                                style={{color:'#333'}}
                                                onPress={()=>{
                                                    this.setState({
                                                        isScreening:true
                                                    },()=>{
                                                        this.refs.screening.open()
                                                    })
                                                }}
                                            />
                                        </Intro>

                                    </View>
                                </View>

                        }
                    </View>
                    <ScrollView
                        style={{flex:1}}

                    >
                        <View style={[commonStyle.contentViewWidth,{marginLeft:widthScreen*0.03}]}>
                            <View>
                                <Text style={styles.articleListTitle}>体验一下大家创建的体验～</Text>
                                <Text style={styles.articleListSmallTitle}>共{this.state.activityList.length}个体验</Text>
                            </View>
                            <FlatList
                                data={this.state.activityList}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this._renderActivty(data)}
                                showsHorizontalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={()=>this.genIndicator()}
                                onEndReached={()=>{this.loadMore()}}
                            />
                        </View>
                    </ScrollView>
                    <Modal
                        style={{height:heightScreen*0.6,width:'100%',backgroundColor:'#fff'}}
                        ref={"screening"}
                        animationDuration={280}
                        position={"top"}
                        backdropColor={'rgba(0,0,0,0.2)'}
                        swipeToClose={false}
                        onClosed={()=>this.onClose()}
                        onOpened={this.onOpen}
                        backdropPressToClose={true}
                        coverScreen={true}
                        top={94}
                        onClosingState={this.onClosingState}>
                        <View style={{width:widthScreen,height:heightScreen*0.6,position:'relative'}}>
                            <ScrollView>
                                <Screeningview typeLevel={1}/>
                            </ScrollView>

                            <View style={[commonStyle.flexSpace,{
                                position:'absolute',
                                left:0,
                                right:0,
                                bottom:0,
                                height:50,
                            }]}>
                                <View style={[commonStyle.flexCenter,{width:widthScreen*0.3,height:50,backgroundColor:'#fff'}]}>
                                    <Text style={{color:'#666',fontSize:16}}>重置</Text>
                                </View>
                                <View style={[commonStyle.flexCenter,{width:widthScreen*0.7,height:50,backgroundColor:'#4db6ac'}]}>
                                    <Text style={{color:'#fff',fontSize:16}}>确定</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    articleListTitle:{
        fontSize:20,
        fontWeight: "bold",
        color:'#333',
        marginTop:15
    },
    articleListSmallTitle:{
        color:'#999',
        marginTop:5
    },
    container: {
        flex: 1,
        backgroundColor: '#ddd',
        paddingTop: 20
    },
    box: {
        backgroundColor: 'red'
    },
    buttons: {
        borderColor: 1,
        borderWidth: 1,
    },
    screeningTxt:{
        color:'#333',
        fontWeight:'bold',
        marginTop:20,
        fontSize:15
    },
    activityLi:{
        width:(widthScreen*0.94-10)/2,
        backgroundColor:'#fff',
        borderRadius:3,
        overflow:'hidden'
    },
    activityLiImg:{
        width:'100%',
        height:140,
        borderRadius: 3
    }
})

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    AsyncStorage,
    FlatList,
    ImageBackground,
    TouchableHighlight,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import HttpUtils from "../../../../https/HttpUtils"
import HttpUrl from "../../../../https/HttpUrl"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import LazyImage from "animated-lazy-image";
import Modal from 'react-native-modalbox';
import Screeningview from "../../../model/Screeningview"
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
const praiseArr=[
    {
        headImage:'http://n1-q.mafengwo.net/s15/M00/9E/85/CoUBGV317sGAF4UTAAZwB3fCBoI18.jpeg?imageMogr2%2Fstrip'
    },
    {
        headImage:'https://p1-q.mafengwo.net/s15/M00/D1/2B/CoUBGV3DrquAFChlAAit0UYH5TU218.jpg?imageMogr2%2Fstrip'
    }
]
export  default  class Articlelist extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            token:'',
            articleList:[],
            scroll:true,
            isArticleLoading:false,
            isEnd:false,
            step:1,
            isScreening:false
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getArticle();
            })
        })
    }
    getArticle(isLoading){//获取故事列表
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('page',1);
        HttpUtils.post(HttpUrl+'Story/story_list',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        articleList:result.data.data
                    },()=>{
                        if(isLoading){
                            this.setState({
                                isArticleLoading:false
                            })
                        }
                    })
                }
            }
        )
    }
    disableScroll(){
        this.setState({scroll: !this.state.scroll});
    }
    /*
    _renderArticle(data){
        return <CardModal title={data.item.title}
                  description={data.item.user.family_name+' '+data.item.user.middle_name+' '+data.item.user.name}
                  image={{uri:data.item.cover.domain+data.item.cover.image_url}}
                  color={'#4db6ac'}
                  time={data.item.update_time}
                  content={ data.item.content+data.item.content }
                  onClick={() => this.disableScroll()}
                  due={1}
        />
    }*/
    toArticle(story_id,user_id,article_type){
        this.props.navigation.navigate('Article',{story_id:story_id,user_id:user_id,article_type:article_type})
    }
    _renderArticle(data){
        return <TouchableHighlight
            style={{width:"100%",marginTop:20}}
            underlayColor='rgba(255,255,255,.2)'
            onPress={()=>{this.toArticle(data.item.story_id,data.item.user_id,1)}}
        >
            <View style={[commonStyle.commonShadow,{backgroundColor:'#fff',marginLeft:3,marginRight: 3,marginBottom:5,borderRadius:5}]}>
                <View style={{
                    width:'100%',
                    height:170,
                    borderTopLeftRadius:5,
                    borderTopRightRadius:5,
                    overflow:'hidden'
                }}>
                    <ImageBackground
                        source={{uri:data.item.cover.domain+data.item.cover.image_url}}
                        style={{width:'100%',height:180,}}
                    >
                        <View style={{
                            width:'100%',
                            height:170,
                            backgroundColor:'rgba(0,0,0,.1)',
                            justifyContent:'flex-end',
                            alignItems:'flex-start',
                            paddingLeft:10,
                            paddingRight:10
                        }}>
                            <Text style={{color:'#fff',fontSize: 18,fontWeight: 'bold',marginBottom:10}}>
                                {data.item.title}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={[{height:50},commonStyle.flexSpace,{marginLeft:10,marginRight:10}]}>
                    <View style={[commonStyle.flexStart]}>
                        <View style={[commonStyle.flexStart]}>
                            <AntDesign
                                name={'heart'}
                                size={16}
                                style={{color:'#ff5673'}}
                            />
                            <Text style={{
                                color:data.item.praise_num?'#333333':'#999',
                                fontWeight:data.item.praise_num?'bold':'normal',
                                marginLeft:3
                            }}>{data.item.praise_num}</Text>
                        </View>
                        <View style={[commonStyle.flexStart,{marginLeft:20}]}>
                            <SimpleLineIcons
                                name={'speech'}
                                size={16}
                                style={{color:'#999999'}}
                            />
                            <Text style={{
                                color:data.item.leaving_num?'#333333':'#999',
                                fontWeight:data.item.leaving_num?'bold':'normal',
                                marginLeft:3
                            }}>
                                {
                                    data.item.leaving_num
                                    ?
                                    data.item.leaving_num
                                    :
                                    '暂无评论'
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={[commonStyle.flexStart]}>
                        {
                            praiseArr.map((item,index)=>{
                                return <LazyImage
                                    source={{uri:item.headImage}}
                                    style={{width:30,height:30,borderRadius: 15,marginRight:index==praiseArr.length-1?0:-5}}
                                />
                            })
                        }
                        <Text style={{color:'#999',fontSize:12,marginLeft:5}}>赞过</Text>
                    </View>

                </View>
            </View>
        </TouchableHighlight>
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
    articleLoading(){//下拉刷新
        this.setState({
            isArticleLoading:true
        },()=>{
            this.getArticle(true);
        })
    }
    loadMore(){//上拉加载更多
        let steps=this.state.step;
        steps++;
        this.setState({
            step:steps
        },()=>{
            let formData=new FormData();
            formData.append('token',this.state.token);
            formData.append('page',this.state.step);
            HttpUtils.post(HttpUrl+'Story/story_list',formData).then(
                result=>{
                    if(result.code==1){
                        this.setState({
                            articleList:this.state.articleList.concat(result.data.data)
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
    onClose(){
        this.setState({
            isScreening:false
        })
    }
    onOpen(){

    }
    onClosingState(){

    }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
            <View style={{width:'100%',flex:1}}>
                <View style={[commonStyle.contentViewWidth,{marginLeft:widthScreen*0.03}]}>
                    {
                        this.state.isScreening
                        ?
                            <View style={[commonStyle.flexCenter,{height:50}]}>
                                <Text style={{
                                    color:'#333',
                                    fontWeight:'bold',
                                    fontSize:18
                                }}>故事筛选条件</Text>
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
                                    <AntDesign
                                        name={'profile'}
                                        size={24}
                                        style={{color:'#333',marginRight:15}}
                                        onPress={()=>{
                                            this.setState({
                                                isScreening:true
                                            },()=>{
                                                this.refs.screening.open()
                                            })
                                        }}
                                    />

                                    <AntDesign
                                        name={'search1'}
                                        size={24}
                                        style={{color:'#333'}}
                                    />
                                </View>
                            </View>

                    }
                </View>
                <ScrollView
                    style={{flex:1}}
                    refreshControl={
                        <RefreshControl
                            title={'正在徒步前行...'}
                            colors={['#4db6ac']}
                            tintColor={'#4db6ac'}
                            titleColor={'#4db6ac'}
                            refreshing={this.state.isArticleLoading}
                            onRefresh={
                                ()=>{this.articleLoading()}
                            }
                        />
                    }
                >
                    <View style={[commonStyle.contentViewWidth,{marginLeft:widthScreen*0.03}]}>
                        <Text style={styles.articleListTitle}>来看看大家的故事吧～</Text>
                        <Text style={styles.articleListSmallTitle}>共{this.state.articleList.length}篇故事</Text>
                        <FlatList
                            data={this.state.articleList}
                            horizontal={false}
                            renderItem={(data)=>this._renderArticle(data)}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={()=>this.genIndicator()}
                            onEndReached={()=>{this.loadMore()}}
                        />
                    </View>

                </ScrollView>

            </View>
                <Modal
                    style={{height:300,width:'100%',backgroundColor:'#fff'}}
                    ref={"screening"}
                    animationDuration={300}
                    position={"top"}
                    backdropColor={'rgba(0,0,0,0.2)'}
                    swipeToClose={false}
                    onClosed={()=>this.onClose()}
                    onOpened={this.onOpen}
                    backdropPressToClose={true}
                    coverScreen={true}
                    top={94}
                    onClosingState={this.onClosingState}>
                    <View style={{width:widthScreen,height:300,position:'relative',paddingBottom: 60}}>
                        <ScrollView>
                            <Screeningview typeLevel={2}/>
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
    button: {
        borderColor: 1,
        borderWidth: 1,
    },
    screeningTxt:{
        color:'#333',
        fontWeight:'bold',
        marginTop:20,
        fontSize:15
    }
})

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    TouchableHighlight,
    AsyncStorage,
    FlatList,
    ActivityIndicator
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import AntDesign from "react-native-vector-icons/AntDesign"
import LazyImage from "animated-lazy-image";
import NewhttpUrl from "../../../../https/Newhttpurl"
import HttpUtils from "../../../../https/HttpUtils"
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};

export  default  class Articlecontainer extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            praiseNum:'',
            token:'',
            sameArticle:[],
            commentsList:[],
            isEnd:false,
            step:1
        }
    }
    componentWillMount() {
        this.setState({
            loading:true
        })
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                 this.getPraise();
                 this.getSameArticle();
                 this.getComments();
            })
        })

    }
    getPraise(){
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('story_id',this.props.story_id);
        HttpUtils.post(NewhttpUrl+'storyp',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        praiseNum:result.data.length
                    })
                }
            }
        )
    }
    getSameArticle(){
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('story_id',this.props.story_id);
        HttpUtils.post(NewhttpUrl+'storys',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        sameArticle:result.data.slice(0,3)
                    })
                }
            }
        )
    }
    getComments(){
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('table_id',this.props.story_id);
        formData.append('flag',2);
        formData.append('order',1);
        formData.append('page',1);
        HttpUtils.post(NewhttpUrl+'LeaveL',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        commentsList:result.data.data
                    })
                }
            }
        )
    }
    _renderComments(data){
        return <View style={{
            width:'100%',
            marginTop:10,
            paddingBottom:10,
            borderBottomWidth: data.index==this.state.commentsList.length-1?0:1,
            borderBottomColor:'#f5f5f5'
        }}>
            <View style={[commonStyle.flexSpace]}>
                <View style={[commonStyle.flexStart]}>
                    <LazyImage
                        source={{uri:data.item.user.headimage.domain+data.item.user.headimage.themb_url}}
                        style={{width:35,height:35,borderRadius:17.5}}
                    />
                    <View style={{height:35,justifyContent:'space-between',alignItems:'flex-start',marginLeft:10}}>
                        <Text style={{color:'#4db6ac',fontWeight:'bold'}}>
                            {data.item.user.family_name+data.item.user.middle_name+data.item.user.name}
                        </Text>
                        <Text style={{color:'#999',fontSize:12}}>{data.item.create_time}</Text>
                    </View>
                </View>
                <View style={commonStyle.flexStart}>
                    <Text style={{fontSize:12,color:'#999',marginRight:5}}>
                        12
                    </Text>
                    <AntDesign
                        name="like2"
                        size={16}
                        style={{color:'#999'}}
                    />
                </View>
            </View>
            <Text style={{lineHeight: 20,marginTop:10,color:'#666'}}>{data.item.content}</Text>
            {
                data.item.leaving_num
                ?
                    <Text style={{marginTop:10,color:'#4db6ac'}}>共{data.item.leaving_num}条回复</Text>
                :
                    null
            }
        </View>
    }
    loadMore(){//上拉加载更多评论
        var steps=this.state.step;
        steps++;
        this.setState({
            step:steps
        },()=>{
            let formData=new FormData();
            formData.append('token',this.state.token);
            formData.append('table_id',this.props.story_id);
            formData.append('flag',2);
            formData.append('order',1);
            formData.append('page',this.state.step);
            HttpUtils.post(NewhttpUrl+'LeaveL',formData).then(
                result=>{
                    if(result.code==1){
                        this.setState({
                            commentsList:this.state.commentsList.concat(result.data.data)
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
        return <View style={{alignItems: 'center',justifyContent: 'center',marginTop:10,marginBottom:30,width:'100%'}}>
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
    render(){
        const { article_type } = this.props
        return(
            <View style={[commonStyle.flexCenter,{width:widthScreen,marginTop:10,paddingBottom:100,position:'relative'}]}>
                <View style={[commonStyle.contentViewWidth]}>
                    <View style={[styles.tab,commonStyle.flexCenter]}>
                        {
                            article_type==1
                            ?
                                <Text style={{color:'#fff',fontSize:12}}>精彩故事</Text>
                            :
                                <Text style={{color:'#fff',fontSize:12}}>攻略分享</Text>
                        }

                    </View>
                    <Text style={styles.articleTtitle}>
                        {this.props.articleData.title}
                    </Text>
                    <Text style={styles.articleTxt}>
                        {this.props.articleData.content}
                    </Text>
                    <View style={{marginTop:10}}>
                    {
                        this.props.articleData
                        ?
                            this.props.articleData.image.map((item,index)=>{
                                return <LazyImage
                                    source={{uri:item.domain+item.image_url
                                    }}
                                    style={[styles.articleImage,{marginTop:index==0?0:10}]}
                                />
                            })
                        :
                            null
                    }
                    </View>

                    <View style={[commonStyle.flexCenter]}>
                        <Text style={{color:'#999999',marginTop:30}}>-- 本{article_type==1?'故事':'攻略'}内容不代表人人耍观点 -- </Text>
                    </View>
                    <View style={[commonStyle.flexSpace,{marginTop:25}]}>
                        <Text style={{color:'#999999',fontSize:12}}>阅读 1000+</Text>
                        <Text style={{color:'#999999',fontSize:12}}>举报</Text>
                    </View>
                    <View style={[commonStyle.flexCenter,{marginTop:25}]}>
                        <View style={[commonStyle.flexCenter,{width:60,height:60,borderRadius:30,borderColor:'#f5f5f5',borderWidth:1}]}>
                            <AntDesign
                                name="like2"
                                size={24}
                                style={{color:'#999999'}}
                            />
                        </View>
                        <Text style={{color:'#999999',marginTop:10}}>
                            {
                                this.state.praiseNum
                            }
                        </Text>
                    </View>
                    {
                        this.state.sameArticle.length>0
                        ?
                            <View style={{width:'100%'}}>
                                <Text style={[styles.articleTtitle,{fontSize:14,marginTop:30}]}>相关故事</Text>
                                <View style={{width:'100%',marginTop:5}}>
                                    {
                                        this.state.sameArticle.map((item, index) => {
                                            return <View style={[commonStyle.flexSpace, {
                                                width: '100%',
                                                marginTop: 10,
                                                paddingBottom: 10,
                                                borderBottomColor: '#F5F5F5',
                                                borderBottomWidth: index == this.state.sameArticle.length - 1 ? 0 : 1
                                            }]}>
                                                <LazyImage
                                                    source={{uri: item.cover.domain + item.cover.image_url}}
                                                    style={{width: 100, height: 90, borderRadius: 3}}
                                                />
                                                <View style={{width: widthScreen * 0.94 - 110, height: 90}}>
                                                    <Text numberOfLines={2} ellipsizeMode={'tail'}
                                                          style={{color: '#333', fontWeight: "bold"}}>{item.title}</Text>
                                                    <Text style={{
                                                        marginTop: 10,
                                                        color: '#999'
                                                    }}
                                                          numberOfLines={1} ellipsizeMode={'tail'}
                                                    >{item.user.family_name + item.user.middle_name + item.user.name}</Text>
                                                </View>
                                            </View>
                                        })
                                    }
                                </View>
                            </View>
                        :
                            null
                    }
                    {
                        this.state.commentsList.length>0
                        ?
                            <View style={{width:'100%'}}>
                                <Text style={[styles.articleTtitle,{fontSize:14,marginTop:30}]}>精彩评论</Text>
                                <View style={{marginTop:10}}>
                                    <FlatList
                                        data={this.state.commentsList}
                                        horizontal={false}
                                        renderItem={(data)=>this._renderComments(data)}
                                        showsHorizontalScrollIndicator = {false}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListFooterComponent={()=>this.genIndicator()}
                                        onEndReached={()=>{this.loadMore()}}
                                    />
                                </View>
                            </View>
                        :
                            null
                    }


                </View>


            </View>
        )
    }
}
const styles = StyleSheet.create({
    tab:{
        width:70,
        height:22,
        backgroundColor:'#4db6ac',
        borderRadius:15,

    },
    articleTtitle:{
        color:'#333333',
        fontWeight:'bold',
        fontSize:18,
        marginTop:20
    },
    articleTxt:{
        color:'#333',
        fontSize:16,
        lineHeight:23,
        marginTop:20
    },
    articleImage:{
        width:widthScreen*0.94,
        height:180,
        borderRadius: 5,
    },

})

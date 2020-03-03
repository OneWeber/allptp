import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    ImageBackground,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import Homebanner from "./Homebanner"
import Welike from "./Welike"
import Welikeactivity from "./Welikeactivity"
import Gocity from "./Gocity"
import AntDesign from "react-native-vector-icons/AntDesign"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import Homestrategy from "./Homestrategy"
import HttpUtils from "../../../../https/HttpUtils"
import HttpUrl from "../../../../https/HttpUrl"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export  default  class Homecontainer extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            activeIndex:0,
            token:'',
            hotStory:''
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getHotStory()
            })
        })
    }
    getHotStory(){//获取最热门的故事
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('sort',this.state.sort);
        formData.append('page',1);
        HttpUtils.post(HttpUrl+'Story/story_list',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        hotStory:result.data.data[0]
                    })
                }
            }
        )
    }
    changeActiveIndex(val){
        this.setState({
            activeIndex:val
        })
    }

    toArticle(story_id,user_id,article_type){
        //跳转到文章或攻略
        this.props.navigate('Article',{story_id:story_id,user_id:user_id,article_type:article_type})
    }
    render(){
        return(
            <View style={[{width:widthScreen,marginTop:45,paddingBottom:40},commonStyle.flexCenter]}>
                <View style={{width:widthScreen}}>
                    <Homebanner />
                </View>
                <View style={[commonStyle.contentViewWidth,commonStyle.flexStart,{marginTop:25}]}>
                    <View style={[commonStyle.flexEnd,{position:'relative'}]}>
                        <Text style={{
                            color:this.state.activeIndex==0?'#333333':'#999999',
                            fontSize:this.state.activeIndex==0?16:14,
                            fontWeight: this.state.activeIndex==0?'bold':'normal'
                        }} onPress={()=>this.changeActiveIndex(0)}>推荐体验</Text>
                        {
                            this.state.activeIndex==0
                            ?
                                <View style={styles.underLine}></View>
                            :
                                null
                        }
                    </View>
                    <View style={[commonStyle.flexEnd,{marginLeft:10,position:'relative'}]}>
                        <Text style={{
                            color:this.state.activeIndex==1?'#333333':'#999999',
                            fontSize:this.state.activeIndex==1?16:14,
                            fontWeight: this.state.activeIndex==1?'bold':'normal'
                        }} onPress={()=>this.changeActiveIndex(1)}>喜爱的体验</Text>
                        {
                            this.state.activeIndex==1
                                ?
                                <View style={styles.underLine}></View>
                                :
                                null
                        }
                    </View>
                </View>
                <View style={{marginTop:28,width:'100%'}}>
                    <Welike activeIndex={this.state.activeIndex}/>
                    <View style={[commonStyle.contentViewWidth,{marginLeft:widthScreen*0.03}]}>
                        <Welikeactivity navigate={this.props.navigate} isHome={true}/>
                    </View>
                </View>
                <View style={[commonStyle.contentViewWidth,commonStyle.flexStart,{marginTop:25}]}>
                    <Text style={{color:'#333333',fontSize:16,fontWeight:'bold'}}>你可能想去</Text>
                </View>
                <View style={{width:'100%'}}>
                    <Gocity navigate={this.props.navigate}/>
                </View>
                <View style={[commonStyle.contentViewWidth,commonStyle.flexStart,{marginTop:25}]}>
                    <Text style={{color:'#333333',fontSize:16,fontWeight:'bold'}}>最热故事</Text>
                </View>
                <View style={[commonStyle.contentViewWidth,{marginTop:20}]}>
                    <View style={{width:'100%'}}>
                        <TouchableHighlight
                            style={{width:'100%'}}
                            underlayColor='rgba(255,255,255,.3)'
                            onPress={() =>{this.toArticle(this.state.hotStory.story_id,this.state.hotStory.user_id,1)}}
                        >
                            <View style={{width:'100%',height:180,overflow:'hidden',borderRadius: 5}}>
                                <ImageBackground
                                    source={{
                                        uri:this.state.hotStory.cover?this.state.hotStory.cover.domain+this.state.hotStory.cover.image_url:null
                                    }}
                                    style={[commonStyle.flexBottom,{width:'100%',height:180,alignItems:'flex-start'}]}
                                >
                                    <Text style={{
                                        paddingLeft:10,
                                        paddingRight:10,
                                        marginBottom:15,
                                        color:'#fff',
                                        fontSize:18,
                                        fontWeight:'bold'
                                    }}
                                    numberOfLines={1} ellipsizeMode={'tail'}
                                    >{this.state.hotStory.title}</Text>
                                </ImageBackground>
                            </View>
                        </TouchableHighlight>
                        <View style={[commonStyle.flexStart,{width:'100%',marginTop:10}]}>
                            <View style={[commonStyle.flexStart]}>
                                <AntDesign
                                    name={'heart'}
                                    size={16}
                                    style={{color:'#ff5673'}}
                                />
                                <Text style={{
                                    color:this.state.hotStory.praise_num?'#333333':'#999',
                                    fontWeight:this.state.hotStory.praise_num?'bold':'normal',
                                    marginLeft:3
                                }}>{this.state.hotStory.praise_num}</Text>
                            </View>
                            <View style={[commonStyle.flexStart,{marginLeft:20}]}>
                                <SimpleLineIcons
                                    name={'speech'}
                                    size={16}
                                    style={{color:'#999999'}}
                                />
                                <Text style={{
                                    color:this.state.hotStory.leaving_num?'#333333':'#999',
                                    fontWeight:this.state.hotStory.leaving_num?'bold':'normal',
                                    marginLeft:3
                                }}>
                                    {
                                        this.state.hotStory.leaving_num
                                        ?
                                            this.state.hotStory.leaving_num
                                        :
                                            '暂无评论'
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[commonStyle.flexCenter,{width:'100%',marginTop:20}]}>
                    <Text style={{color:'#4db6ac'}} onPress={()=>this.props.navigate('Articlelist')}>查看更多故事</Text>
                </View>
                <View style={[commonStyle.contentViewWidth,commonStyle.flexStart,{marginTop:25}]}>
                    <Text style={{color:'#333333',fontSize:16,fontWeight:'bold'}}>热门攻略</Text>
                </View>
                <View style={commonStyle.contentViewWidth}>
                    <Homestrategy />
                </View>

            </View>
        )
    }
}
const styles=StyleSheet.create({
    underLine:{
        position:'absolute',
        height:3,
        bottom:-10,
        left:5,
        right:5,
        backgroundColor:'#4db6ac',
        borderRadius:3
    }
})

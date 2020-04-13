import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../../assets/css/Common_css';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window')
class StoryDetail extends Component{
    constructor(props) {
        super(props);
        this.story_id = this.props.navigation.state.params.story_id;
        this.state = {
            storyData: '',
            isLoading: false
        }
    }
    componentDidMount() {
        this.getStoryData()
    }
    getStoryData() {
        this.showLoading()
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
                        this.closeLoading()
                    })
                }
            }
        )
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
    render(){
        return(
            <View style={{flex: 1,position:'relative'}}>
                <ParallaxScrollView
                    noShadow={true}
                    backgroundColor="#ffffff"
                    contentBackgroundColor="#ffffff"
                    //下面渲染背景
                    renderBackground={() =>  <LazyImage style={{
                        width:window.width,
                        height:300,
                    }}
                        source={require('../../../assets/images/c1.jpeg')}/>
                    }
                    //下面是渲染前景
                    renderForeground={() => (
                        <View style={{width:width,height:300,overflow:'visible'}}>
                            <SafeAreaView style={{
                                flex: 1,
                                position:'relative'
                            }}>

                            </SafeAreaView>
                        </View>

                    )}
                    //渲染固定头部
                    renderFixedHeader={() => <Text></Text>}
                    renderStickyHeader={
                        () =>  <SafeAreaView key="sticky-header" style={{width:width}}>

                        </SafeAreaView>
                    }
                    stickyHeaderHeight={94}
                    parallaxHeaderHeight={ 300 }
                >
                    {
                        this.state.isLoading
                        ?
                            <View style={[CommonStyle.flexCenter,{marginTop: 20}]}>
                                <ActivityIndicator color="#999" size="small" />
                            </View>
                        :
                            <StoryContent {...this.state} {...this.props}/>
                    }
                </ParallaxScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(StoryDetail)
class StoryContent extends Component{
    render(){
        const {storyData} = this.props
        return(
            <View style={CommonStyle.flexCenter}>
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
                            borderWidth: 1,
                            borderColor: this.props.theme,
                            borderRadius: 5
                        }]}>
                            <Text style={{color: this.props.theme}}>关注</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        color:'#666',
                        fontSize:16,
                        lineHeight:23,
                        marginTop:30
                    }}>{storyData.content}</Text>
                    {
                        storyData.image && storyData.image.length > 0
                        ?
                            storyData.image.map((item, index) => {
                                return <LazyImage
                                    key={index}
                                    source={{uri: item.domain + item.image_url}}
                                    style={{
                                        width: '100%',
                                        height:180,
                                        borderRadius: 3,
                                        marginTop: 10
                                    }}
                                />
                            })
                        :
                            null
                    }

                </View>
            </View>
        )
    }
}

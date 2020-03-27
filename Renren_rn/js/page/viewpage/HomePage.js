import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, Dimensions, SafeAreaView,Image, TouchableOpacity} from 'react-native'
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
import navs from '../../json/navs'
const {width, height} = Dimensions.get('window')
class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state={
            scrollY:new Animated.Value(0),
            touchEnd:0,
            opacity: 0
        }
        this.navs=navs
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
    render(){
        const {scrollY} = this.state
        let nav = <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{marginTop: 30}]}>
            {this.navs.map((item, index) => {
                return <TouchableOpacity key={index} style={CommonStyle.flexCenter}
                    onPress={()=>{
                        NavigatorUtils.goPage({},item.router,'navigate')
                    }}
                >
                    <Image source={item.icon} style={{
                        width: 41,
                        height:34
                    }}/>
                    <Text
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
                {/*
                    <Text>
                        {JSON.stringify(this.props.user)}
                        {this.props.token}
                    </Text>
                */}
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
                            <NavBar style={{marginTop: 0,marginLeft:width*0.03}} {...this.props}/>
                        </SafeAreaView>
                    :
                        null
                }
                <Parallax
                    backgroundColor="#ffffff"
                    contentBackgroundColor="#ffffff"
                    //下面渲染背景
                    renderBackground={() =>  <View style={{width:width,height:234}}>
                        <Swiper
                            showsButtons={false}
                            showsPagination={false}
                            horizontal={true}
                            loop={true}
                            showsPagination={false}
                            autoplay={true}
                            autoplayTimeout={6}
                        >
                            <LazyImage source={require('../../../assets/images/ssmz.jpeg')} style={{width:width,height:234}}/>
                            <LazyImage source={require('../../../assets/images/bg.jpeg')} style={{width:width,height:234}}/>
                        </Swiper>
                    </View>}
                    renderForeground={()=>(
                        <TouchableOpacity style={{width:width,height:234}}>

                        </TouchableOpacity>
                    )}
                    stickyHeaderHeight={0}
                    parallaxHeaderHeight={ 234 }
                    onScroll={(event)=>this._onScroll(event)}
                >
                    <View style={[styles.content_con,CommonStyle.flexCenter]}>
                        <NavBar {...this.props}/>
                        {nav}
                        {/*即将开展的体验*/}
                        <CommingActive styles={styles} />
                        {/*特惠体验*/}
                        <Preference styles={styles} />
                        {/*高分目的地体验*/}
                        <TopScoreActive styles={styles} />
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 40,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor:'#484A4D',
                            marginTop: 30
                        }]} onPress={()=>NavigatorUtils.goPage({}, 'Destination', 'navigate')}>
                            <Text style={[styles.common_weight,styles.common_color]}>更多目的地体验</Text>
                        </TouchableOpacity>
                        {/*精选体验故事*/}
                        <SelectStory styles={styles}/>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 40,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor:'#484A4D',
                            marginTop: 30
                        }]}>
                            <Text style={[styles.common_weight,styles.common_color]}>更多精彩体验故事</Text>
                        </TouchableOpacity>
                        {/*历史记录*/}
                        <History styles={styles}/>
                        <View style={{width: '100%',marginTop: 50,marginBottom: 50}}>
                            <View style={[styles.home_bot,CommonStyle.spaceRow,{alignItems:'flex-start'}]}>
                                <Image source={require('../../../assets/images/home/deng.png')} style={{width:26.5,height:30}}/>
                                <View style={{
                                    width:width*0.94-20-45
                                }}>
                                    <Text style={[styles.common_color]}>
                                        关于您对所下订单的问题，可以联系人人耍
                                        平台周一至周五09：00-17：00
                                    </Text>
                                    <Text style={[styles.common_color,styles.common_weight,{
                                        marginTop: 12
                                    }]}>固话：028-8888888</Text>
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
})
const mapStateToProps = state => ({
    user: state.user.user,
    token: state.token.token,
    theme:state.theme.theme
})
export default connect(mapStateToProps)(HomePage)
class NavBar extends Component{
    render(){
        const {theme} = this.props
        return (
            <View style={[styles.h_input,CommonStyle.commonWidth,CommonStyle.spaceRow,this.props.style]}>
                <View style={CommonStyle.flexStart}>
                    <Text style={[styles.common_color,styles.common_weight,{fontSize: 15}]}>推荐</Text>
                    <AntDesign
                        name={'caretdown'}
                        size={10}
                        style={{color:'#333',marginLeft: 5}}
                    />
                </View>
                <View style={[styles.input,CommonStyle.flexCenter,{flexDirection:'row'}]}>
                    <AntDesign
                        name={'search1'}
                        size={20}
                        style={{color:'#cacaca',marginRight: 10}}
                    />
                    <Text style={[styles.common_weight,{color:'#cacaca',fontSize: 15}]}>目的地/体验</Text>
                </View>
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


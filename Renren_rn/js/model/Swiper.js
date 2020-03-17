import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, Image, Animated, Easing, ViewPropTypes} from 'react-native';
const {width, height} = Dimensions.get('window')
import {PropTypes} from 'prop-types'
import LazyImage from 'animated-lazy-image';
import LinearGradient from "react-native-linear-gradient"
export default class Swiper extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            offsetValueline: new Animated.Value(0),
            animatedValueline: new Animated.Value(0),
            imageValue: new Animated.Value(0),
        }
    }
    static propsTypes = {
        cWidth: PropTypes.number,
        cHeight: PropTypes.number,
        inActiveColor: PropTypes.string,
        activeColor: PropTypes.string,
        defaultDotSize: PropTypes.number,
        defaultDotMargin: PropTypes.number,
        dotType: PropTypes.string,
        offsetHeight: PropTypes.number,
        onSliderChange: PropTypes.func,
        showDots: PropTypes.bool,
        autoTime: PropTypes.number,
        offsetDotWidth: PropTypes.number,
        offsetDotHeight: PropTypes.number,
        isImageScale: PropTypes.bool,
        titleColor: PropTypes.string,
        titleStyle: ViewPropTypes.style
    }

    static defaultProps = {
        cWidth: width,
        cHeight: height,
        inActiveColor: '#14c5ca',
        activeColor: '#fff',
        defaultDotSize: 10,
        dotMargin: 3,
        dotType: 'default',
        offsetHeight: 2,
        showDots: true,
        autoTime: 4,
        offsetDotWidth: 25,
        offsetDotHeight: 2,
        isImageScale:true,
        titleColor:'#fff',
        onSliderChange: () => {

        }
    }

    componentDidMount(){
        this.initOffset();
        this.autoPlay();
    }
    componentWillUnmount(){
        this.timer && clearTimeout(this.timer)
    }

    initOffset(){//初始化offset类型下刚进入页面
        Animated.spring(
            this.state.offsetValueline,
            //将bounceValue的值动画化，是一个持续变化的过程
            {
                toValue: width,
                friction: width,
                delay: 500
            }
        ).start();
    }
    _onAnimationEnd(e){
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor(offsetX / width);
        if(pageIndex> this.props.data.length- 1 || pageIndex<0)pageIndex=0;
        this.setState({
            currentIndex: pageIndex
        },()=> {
            this.autoPlay();
            this.props.onSliderChange(this.state.currentIndex)
        })
    }

    autoPlay() {//自动轮播
        this.state.animatedValueline.setValue(0)
        this.setState({
            imageWidth: this.props.cWidth
        })
        const {autoTime, dotType} = this.props
        let index = this.state.currentIndex;
        this.timer = setTimeout(() => {
            index ++;
            if(index > this.props.data.length - 1) {
                index = 0;
                this.refScrollView.scrollTo({x: 0, y:0, animated:true})
            } else {
                this.refScrollView.scrollTo({x: width*index, y:0, animated:true})
            }
            this.setState({
                currentIndex: index
            })
        }, autoTime * 1000)

        if(dotType==='offset') {
            Animated.spring(
                this.state.offsetValueline,
                //将bounceValue的值动画化，是一个持续变化的过程
                {
                    toValue: width*(index+1),
                    friction: width*(index+1),
                }
            ).start();
        } else if (dotType==='animated'){
            Animated.timing(
                this.state.animatedValueline,
                //将bounceValue的值动画化，是一个持续变化的过程
                {
                    toValue: 1,
                    duration: autoTime * 1000,
                    easing: Easing.linear,
                }
            ).start();
        }

    }
    _onScrollEndDrag(e){//手动滑动

    }
    _onScrollBeginDrag(e){
        this.timer && clearTimeout(this.timer)
    }
    render(){
        const {data, cWidth, cHeight, dotType, showDots, isImageScale, titleColor} = this.props
        const {imageValue, currentIndex} = this.state
        return(
            <View style={[styles.swiper_con, {width: cWidth, height: cHeight}]}>
                <ScrollView
                    ref={refScrollView=>this.refScrollView=refScrollView}
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    pagingEnabled = {true}
                    onScrollBeginDrag={(e)=>this._onScrollBeginDrag(e)}
                    onScrollEndDrag={(e)=>this._onScrollEndDrag(e)}
                    onMomentumScrollEnd = {(e) => {
                        this._onAnimationEnd(e)
                    }}

                >
                    {
                        data.map((item, index) => {
                            return <View key={index} style={{width: cWidth, height: cHeight, position:'relative'}}>
                                    <LazyImage source={item.url} style={{width: cWidth, height: cHeight}}/>
                                    <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,.3)', 'rgba(255,255,255,1)']} style={[styles.linearBg]}>
                                    </LinearGradient>
                                    <View style={[styles.linearBg,{zIndex: 5,justifyContent: 'center',alignItems: "center"}]}>
                                        <Text style={[{
                                            color: titleColor,
                                            fontSize: 20,
                                            fontWeight: 'bold'
                                        }]}>{item.title}</Text>
                                    </View>
                            </View>
                        })
                    }
                </ScrollView>
                {
                    showDots
                    ?
                        dotType === 'default'
                        ?
                            <View style={styles.defaultDots}>
                                <DefaultDots {...this.props} {...this.state} />
                            </View>
                        :
                        dotType === 'offset'
                            ?
                            <View style={styles.offsetDots}>
                                <OffsetDots {...this.props} {...this.state} />
                            </View>
                            :
                            <View style={styles.defaultDots}>
                                <AnimatedDots {...this.props} {...this.state} />
                            </View>
                    :
                        null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    swiper_con: {
        position: 'relative'
    },
    imgs: {
        width: width,
        height: height
    },
    defaultDots: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right:0,
    },
    dotsStyle:{
        width: '100%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
    },
    offsetDots:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right:0,
    },
    linearBg:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0
    }
})
class DefaultDots extends Component{
    render(){
        const {data, currentIndex, inActiveColor, activeColor, defaultDotSize, dotMargin} = this.props
        return (
            <View style={styles.dotsStyle}>
                {
                    data.map((item, index) => {
                        return <View key={index} style={[{
                            backgroundColor: currentIndex===index?inActiveColor:activeColor,
                            width:defaultDotSize,
                            height:defaultDotSize,
                            borderRadius: defaultDotSize / 2,
                            margin: dotMargin
                        }]}>

                        </View>
                    })
                }
            </View>
        )
    }
}
class OffsetDots extends Component{
    render(){
        const {data, inActiveColor, offsetValueline, offsetHeight} = this.props
        return(
            <Animated.View style={[{
                backgroundColor: inActiveColor,
                height: offsetHeight,
                transform: [
                    {
                        translateX: offsetValueline.interpolate({
                            inputRange: [
                                0,
                                width*(data.length)
                            ],
                            outputRange: [-width, 0],
                            extrapolate: 'clamp',
                        }),
                    }
                ],
            }]}>

            </Animated.View>
        )
    }
}
class AnimatedDots extends Component{
    render(){
        const {data, currentIndex, inActiveColor, animatedValueline, offsetDotWidth, offsetDotHeight,dotMargin, activeColor} = this.props
        return <View style={styles.dotsStyle}>
            {
                data.map((item, index) => {
                    return <View key={index} style={{
                        width: offsetDotWidth,
                        height: offsetDotHeight,
                        margin: dotMargin,
                        backgroundColor:activeColor,
                        overflow:'hidden'
                    }}>
                        {
                            currentIndex===index
                            ?
                                <Animated.View style={{
                                    backgroundColor: inActiveColor,
                                    height:offsetDotHeight,
                                    transform: [
                                        {
                                            translateX: animatedValueline.interpolate({
                                                inputRange: [0,  1],
                                                outputRange: [0,  offsetDotWidth],
                                                extrapolate: 'clamp',
                                            }),
                                        }
                                    ],
                                    }}

                                >

                                </Animated.View>
                            :
                                null
                        }
                    </View>
                })
            }
        </View>
    }
}

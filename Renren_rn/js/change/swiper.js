import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
    ViewPropTypes,
    Animated,
    Easing
} from 'react-native'
import {PropTypes} from 'prop-types'
const {width, height} = Dimensions.get('window')
export default class Swiper extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            animatedValueline: new Animated.Value(0),
            offsetValueline: new Animated.Value(0),
            offsetWidth: width / this.props.data.length
        }
    }
    static propTypes = {
        data: PropTypes.array,
        width: PropTypes.number,
        height: PropTypes.number,
        autoplay: PropTypes.bool,
        autotime: PropTypes.number,
        showDots: PropTypes.bool,
        inActiveDotColor: PropTypes.string,
        activeDotColor: PropTypes.string,
        defaulDotSize: PropTypes.number,
        dotMargin: PropTypes.number,
        dotsStyle: ViewPropTypes.style,
        dotsConStyle: ViewPropTypes.style,
        dotStyle: PropTypes.string,
    }
    static defaultProps = {
        width: width,
        height: height,
        autoplay: true,
        autotime: 4,
        data:[],
        showDots: true,
        inActiveDotColor: '#14c5ca',
        activeDotColor: '#fff',
        defaulDotSize: 10,
        dotMargin: 1,
        dotStyle: 'default'
    }
    componentDidMount(){
        const {dotStyle} = this.props
        if(dotStyle==='offset'){
            this.initOffset();
        } else if(dotStyle==='animate'){
            this.initAnimate()
        }

        const {autoplay} = this.props
        if(autoplay) {
            this.autoPlay()
        }
    }
    initAnimate(){ //初始化animate类型下刚进入页面
        Animated.timing(
            this.state.animatedValueline,
            {
                toValue: 25,
                duration: 5000
            }
        ).start()
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
    autoPlay(val){
        const {autotime, data} = this.props
        let index = val
        this.autoTimer = setInterval(() => {
            index ++
            this.setState({
                currentPage: index
            }, () => {
                if(index > data.length - 1){
                    index = 0;
                    if(this.refScrollView){
                        this.refScrollView.scrollTo({x:0, y:0, animated:true});
                    }
                } else {
                    this.scrollBy(index)
                }
                this.state.offsetValueline.setValue(width*index)
            })


        }, autotime * 1000)
    }
    scrollBy(){
        let index = this.state.currentPage
        this.refScrollView.scrollTo({x:width*index, y:width*index, animated:true});
    }
    stopAutoPlay() {
        this.autoTimer && clearInterval(this.autoTimer)
    }
    _onScrollBeginDrag(e){
        this.stopAutoPlay()
    }
    _onScroll(){

    }
    _onScrollEndDrag(e){
        this.autoPlay()
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor(offsetX / width);
        if(pageIndex> this.props.data.length - 1 || pageIndex<0)pageIndex=0;
        this.setState({
            currentPage:pageIndex
        })
    }
    _onAnimationEnd(e){
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor(offsetX / width);
        const {dotStyle} = this.props
        if(pageIndex> this.props.data.length- 1 || pageIndex<0)pageIndex=0;
        this.setState({
            currentPage:pageIndex
        },() => {
            this.scrollBy(pageIndex)
            console.log('.......', pageIndex)
            let oWidth = this.state.offsetWidth;
            oWidth = width*(this.state.currentPage + 1)
            this.setState({
                offsetWidth: oWidth
            },() => {
                if(dotStyle === 'offset') {
                    Animated.spring(
                        this.state.offsetValueline,
                        //将bounceValue的值动画化，是一个持续变化的过程
                        {
                            toValue: this.state.offsetWidth,
                            friction: this.state.offsetWidth,
                        }
                    ).start();
                } else if(dotStyle === 'animate') {
                    this.initAnimate()
                }

            })
        })

    }
    render(){
        const {data, showDots, dotStyle, height} = this.props
        const offsetLength = this.state.offsetValueline.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.offsetWidth]
        });
        const viewLength = this.state.animatedValueline.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 28]
        });
        return (
            <View style={{width: width, height: height, position: 'relative'}}>
                <ScrollView
                    ref={refScrollView=>this.refScrollView=refScrollView}
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    pagingEnabled = {true}
                    onScroll={(e)=>this._onScroll(e)}
                    onScrollEndDrag={(e)=>this._onScrollEndDrag(e)}
                    onScrollBeginDrag={(e)=>this._onScrollBeginDrag(e)}
                    onMomentumScrollEnd = {(e) => {
                        this._onAnimationEnd(e)
                    }}
                >
                    {
                        data.map((item, index) => {
                            return <View key={index} style={{flex: 1,position: 'relative'}}>
                                <Image
                                    source={item.url}
                                    style={{width: width, height: height}}
                                    resizeMode={'cover'}
                                />
                                <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#fff',fontSize:20,fontWeight:'bold'}}>{item.title}</Text>
                                </View>
                            </View>
                        })
                    }
                </ScrollView>
                {
                    showDots
                        ?
                        dotStyle==='offset'
                            ?
                            <View style={styles.offset_con}>
                                <OffsetDots offsetValueline={this.state.offsetValueline} offsetLength={offsetLength} {...this.props} {...this.state} offsetWidth={this.state.offsetWidth}/>
                            </View>
                            :
                            <View style={[styles.dots_con,this.props.dotsConStyle]}>
                                {
                                    dotStyle === 'default'
                                        ?
                                        <Dots {...this.props} {...this.state}/>
                                        :
                                        <AnimateDots viewLength={viewLength} {...this.props} {...this.state} />
                                }

                            </View>
                        :
                        null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    dots_con: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right:0,
    },
    dots_style:{
        width: '100%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
    },
    offset_con:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right:0,
    },
    offset_style: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
class Dots extends Component{
    render(){
        const {data, currentPage, inActiveDotColor, activeDotColor, defaulDotSize, dotMargin} = this.props
        return(
            <View style={[styles.dots_style,this.props.dotsStyle]}>
                {
                    data.map((item, index) => {
                        return <View key={index} style={[{
                            backgroundColor: currentPage===index?inActiveDotColor:activeDotColor,
                            width:defaulDotSize,
                            height:defaulDotSize,
                            borderRadius: defaulDotSize / 2,
                            margin: dotMargin
                        }]}>

                        </View>
                    })
                }
            </View>
        )
    }
}
class AnimateDots extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        const {data, currentPage, inActiveDotColor, activeDotColor, dotMargin, animatedValueline} = this.props
        return  (
            <View style={[styles.dots_style,this.props.dotsStyle]}>
                {
                    data.map((item, index) => {
                        return <View key={index} style={{
                            width: 25,
                            height: 2,
                            margin: dotMargin,
                            backgroundColor:activeDotColor,
                            position:'relative',
                            overflow: 'hidden'
                        }}>
                            {
                                currentPage === index
                                    ?
                                    <Animated.View style={{
                                        backgroundColor: inActiveDotColor,
                                        height: 2,
                                        transform: [
                                            {
                                                translateX: animatedValueline.interpolate({
                                                    inputRange: [
                                                        0,
                                                        25
                                                    ],
                                                    outputRange: [-1, 0],
                                                    extrapolate: 'clamp',
                                                }),
                                            }
                                        ],
                                    }}></Animated.View>
                                    :
                                    null
                            }
                        </View>
                    })
                }
            </View>
        )
    }
}
class OffsetDots extends Component{
    render(){
        const {data, currentPage, inActiveDotColor, offsetWidth, offsetLength, offsetValueline} = this.props
        return(
            <Animated.View style={[styles.offset_style,{
                backgroundColor: inActiveDotColor,
                height: 2,
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

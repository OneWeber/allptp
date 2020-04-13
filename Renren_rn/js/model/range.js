import React, { Component } from 'react'
import { StyleSheet, View, PanResponder, Text, Dimensions } from 'react-native'

const roundSize = 25  // 圆的大小
const width = Dimensions.get('window').width - roundSize * 1.5 // 设备宽度

/**
 * 价格区间
 */
export default class PriceRange extends Component {
    constructor(props) {
        super(props)
        let scale = width / this.props.range
        let { range, startPrice, endPrice } = this.props
        let start = startPrice === 0 ? roundSize / 2 : scale * startPrice
        let end = endPrice === '不限' ? width : scale * endPrice
        this.state = {
            range,
            startPrice,
            endPrice,
            start, // 起始坐标
            end, // 结束坐标
        }
    }

    componentWillReceiveProps(nextProps) {
        let scale = width / this.props.range
        let { range, startPrice, endPrice } = nextProps
        let start = startPrice === 0 ? roundSize / 2 : (startPrice===range ? width-20 : scale * startPrice)
        let end = endPrice === '不限' ? width : scale * endPrice
        this.setState({
            range,
            startPrice,
            endPrice,
            start, // 起始坐标
            end, // 结束坐标
        })
    }

    componentWillMount() {
        let scale = width / this.props.range
        let step  = this.props.step * scale
        this.panResponderStart = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.forceUpdate()
            },
            onPanResponderMove: (evt, gestureState) => { // 开始的拖动事件
                let start = gestureState.moveX // 当前拖动所在的坐标
                let threshold = this.state.end - roundSize // 阀值
                if (start >= threshold) {  // 保证开始价格不会超过结束价格
                    start = threshold
                }

                start = parseInt(start / step) * step
                let startPrice = Math.floor(start / scale) // 计算开始价格显示值
                if (start <= roundSize) { // 保证开始价格不会小于最小值
                    start = roundSize / 2
                    startPrice = 0
                }

                this.setState({
                    start,
                    startPrice
                }, () => {
                    this.props.onChange(this.state.startPrice, this.state.endPrice)
                })
            },
            onPanResponderRelease: (evt, gestureState) => true,
            onPanResponderTerminate: (evt, gestureState) => true,
        })
        this.panResponderEnd = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.forceUpdate()
            },
            onPanResponderMove: (evt, gestureState) => { // 结束的拖动事件
                let end = gestureState.moveX
                let threshold = this.state.start + roundSize // 阀值
                if (end <= threshold) {  // 保证开始价格不会超过结束价格
                    end = threshold
                }

                end = parseInt(end / step) * step

                let endPrice = Math.floor(end / scale)
                if (end >= width) { // 保证结束价格不会超过最大值
                    end = width
                    endPrice = '不限'
                }
                this.setState({
                    end,
                    endPrice
                }, () => {
                    this.props.onChange(this.state.startPrice, this.state.endPrice)
                })
            },
            onPanResponderRelease: (evt, gestureState) => true,
            onPanResponderTerminate: (evt, gestureState) => true,
        })
    }

    render() {
        let { start, end, startPrice, endPrice, range } = this.state
        return (
            <View style={styles.container}>
                <View style={[{ position: 'absolute' }, { left: startPrice===range ? roundSize/2 : start }, { top: 4 }]}><Text style={{color:'#333'}}>{`￥${startPrice}`}</Text></View>
                <View style={[{ position: 'absolute' }, { left: startPrice===range || endPrice===range ? width-20 : end }, { top: 4 }]}><Text style={{color:'#333'}}>{endPrice !== '不限' ? `￥${endPrice}` : (startPrice===range ? `￥${startPrice}+`:endPrice)}</Text></View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.progressContainer, { backgroundColor: '#E3E3E3' }, { width: start }]}></View>
                    <View style={[styles.progressContainer, { width: width - start - (width - end) }]}></View>
                    <View style={[styles.progressContainer, { backgroundColor: '#E3E3E3' }, { width: width - end }]}></View>
                </View>
                <View style={[styles.circle, { left: start }]} {...this.panResponderStart.panHandlers}>
                </View>
                <View style={[styles.circle, { left: end }]} {...this.panResponderEnd.panHandlers}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    progressContainer: {
        backgroundColor: '#14c5ca',
        height: 9.5,
        borderRadius: 5
    },
    circle: {
        position: 'absolute',
        width: roundSize,
        height: roundSize,
        borderRadius: roundSize / 2,
        borderColor: '#14c5ca',
        borderWidth:1,
        backgroundColor: '#fff'
    }
})

PriceRange.defaultProps = {
    range: 1000, // 价格范围
    startPrice: 0, // 起始价格
    endPrice: '不限', // 结束价格
    step: 50, // 一格大小
    onChange: function() {} // 回调
}

import React, {Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
}from 'react-native';
import PropTypes from 'prop-types'
export default class Limittext extends Component {
    static propTypes = {
        style: Text.propTypes.style,
        numLines: PropTypes.any,
        onMutiCallBack: PropTypes.func,
        allowFontScaling: PropTypes.bool,
    }
    static defaultProps = {
        allowFontScaling: false,
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            numLines: null,
            maxHeight: null,
            opacity: 1,
            isShow: false
        };
    }

    shouldComponentUpdate(newProps, newState) {
        return this.state.numLines !== newProps.numLines;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.numLines !== nextProps.numLines) {
            this.setState({
                numLines: nextProps.numLines,
            });
        }
    }

    render() {
        return (
            <View>
                <Text
                    style={[styles.text,this.props.style,{opacity:this.state.opacity}]}
                    allowFontScaling={this.props.allowFontScaling}
                    numberOfLines={this.state.numLines}
                    onLayout={(event)=>{
                        let height = event.nativeEvent.layout.height;
                        this.setState({
                            tHeight: height
                        })
                        //第一次测量view的最大高度
                        if(this.state.maxHeight===null&&this.props.numLines){
                            this.state.maxHeight=height;
                            this.setState({
                                numLines:this.props.numLines,
                                opacity:1,
                            });
                            //第二次当测量的最大高度>设置行数后的高度的时候，回调需要换行。
                        }else if(this.props.numLines){
                            if(this.state.maxHeight>height){
                                if(this.props.onMutiCallBack){this.props.onMutiCallBack()}
                            }
                        }
                    }}
                >
                    {this.props.children}
                </Text>
                {
                    this.state.isShow
                    ?
                        <Text style = {styles.see_m}>查看更多</Text>
                    :
                        null
                }

            </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: '#333',
        lineHeight: 23
    },
    see_m: {
        color: '#14c5ca',
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 16
    }
});
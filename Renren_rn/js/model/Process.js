import React,{Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {PropTypes} from 'prop-types'
export default class Process extends Component{
    constructor(props) {
        super(props);
        this.state = {
            process_width: 0
        }
    }
    static propTypes = {
        height: PropTypes.number,
        borderRadius: PropTypes.number,
        theme: PropTypes.string,
        inBackColor:PropTypes.string,
        borderWidth:PropTypes.number,
        percentage: PropTypes.number,
    }
    static defaultProps = {
        height: 15,
        borderRadius: 5,
        theme:'#14c5ca',
        inBackColor: 'rgba(20,197,202,.2)',
        borderWidth: 1,
        percentage: 0.5
    }
    layout(e) {
        this.setState({
            process_width: e.layout.width
        })
    }
    render(){
        const {process_width} = this.state
        return(
            <View onLayout={({nativeEvent:e})=> this.layout(e)} style={[styles.process_con,{
                height: this.props.height,
                borderRadius:this.props.borderRadius,
                borderColor: this.props.theme,
                borderWidth:this.props.borderWidth
            }]}>
                <View style={[{
                    width:process_width*this.props.percentage,
                    backgroundColor:this.props.inBackColor,
                    height:this.props.height-(this.props.borderWidth * 2),
                    borderTopLeftRadius: this.props.borderRadius,
                    borderBottomLeftRadius: this.props.borderRadius,
                }]}></View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    process_con:{
        width: '100%',
    },

})

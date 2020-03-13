import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native'
import {PropTypes} from 'prop-types'
export default class NoData extends Component{
    static propTypes = {
        initial: PropTypes.bool
    }
    static defaultProps = {
        title:'暂无数据',
        initial: true
    }
    render(){
        const {initial, title} = this.props
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                {
                    initial
                    ?
                        null
                    :
                        this.props.children
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title:{
        color: '#999',
        fontSize: 16
    }
})

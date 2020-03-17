import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView,TouchableOpacity} from 'react-native'
export default class MsgPage extends Component{
    render(){
        return (
            <View style={styles.container}>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    listItem: {
        height: 75,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftSwipeItem: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 20
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },
})

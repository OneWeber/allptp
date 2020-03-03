import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import commonStyle from "../../../../../res/js/Commonstyle"
type Props = {}
const widthScreen = Dimensions.get('window').width;
export default class Activitydetail extends Component<Props>{
    render() {
        let { activityInfo } = this.props;
        return (
            <View style = {[commonStyle.contentViewWidth, {
                marginTop: 20,
                paddingBottom:20,
                borderBottomColor: '#f5f5f5',
                borderBottomWidth: 1
            }]}>
                <Text style = {{ fontSize:20, color: '#333', fontWeight: 'bold'}}>体验内容</Text>
                <View style = {{marginTop:20}}>
                    <Text style = {styles.userTxt}>{activityInfo.descripte}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    userTxt: {
        lineHeight: 23,
        color: '#333',
        fontSize: 16
    }
})
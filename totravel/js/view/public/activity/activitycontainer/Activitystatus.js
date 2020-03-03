import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import commonStyle from "../../../../../res/js/Commonstyle"
import Singlecalendar from "../../../../model/Singlecalendar"
import Manycalendar from '../../../../model/Manycalendar'
type Props = {}
export default class Activitystatus extends Component<Props>{
    render() {
        let { activityInfo } = this.props
        return (
            <View style = {[commonStyle.contentViewWidth, {
                marginTop: 20,
                paddingBottom:20,
                borderBottomColor: '#f5f5f5',
                borderBottomWidth: 1
            }]}>
                <Text style = {{ fontSize:20, color: '#333', fontWeight: 'bold'}}>体验可选状态</Text>
                <View>
                    {
                        activityInfo.long_day == 1
                        ?
                            activityInfo.slot.length > 0
                            ?
                                <Singlecalendar activityInfo = { activityInfo } />
                            :
                                <View style={[commonStyle.flexCenter]}>
                                    <Text style = {styles.status_txt}>
                                        当前体验暂无举办日期, 看看其他的体验吧
                                    </Text>
                                    <Text style = {styles.go_list} onPress={() => this.props.navigate('Activitylist')}>前往体验列表</Text>
                                </View>
                        :
                            activityInfo.slot.length > 0
                            ?
                                <Manycalendar activityInfo = { activityInfo } />
                            :
                                <View style={[commonStyle.flexCenter]}>
                                    <Text style = {styles.status_txt}>
                                        当前体验暂无举办日期, 看看其他的体验吧
                                    </Text>
                                    <Text style = {styles.go_list} onPress={() => this.props.navigate('Activitylist')}>前往体验列表</Text>
                                </View>
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    status_txt: {
        width: '100%',
        textAlign: 'center',
        marginTop:35,
        color: '#999',
        fontSize: 16,
        marginBottom: 15,
        lineHeight: 23
    },
    go_list: {
        color: '#14c5ca',
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16
    }
})
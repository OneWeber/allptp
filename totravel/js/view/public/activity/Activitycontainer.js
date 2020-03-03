import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
    TouchableHighlight, AsyncStorage,
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import Ionicons from "react-native-vector-icons/Ionicons";
import Activityuser from "./activitycontainer/Activityuser"
import Activitydetail from "./activitycontainer/Activitydetail"
import Activityaddress from "./activitycontainer/Activityaddress"
import Activitystatus from "./activitycontainer/Activitystatus"
import Welikeactivity from '../../../view/faceView/home/Welikeactivity'
import HttpUtils from "../../../../https/HttpUtils";
import NewhttpUrl from "../../../../https/Newhttpurl";
type Props = {}
const widthScreen = Dimensions.get('window').width;
export default class Activitycontainer extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            token: '',
        }
    }

    render() {
        let { activityInfo } = this.props
        return (
            <View style = {[commonStyle.flexCenter]}>
                <View style = {[commonStyle.flexCenter, {paddingBottom:20, backgroundColor: '#000',width:widthScreen}]}>
                    <View style = {[commonStyle.contentViewWidth]}>
                        <View style = {[commonStyle.flexStart, commonStyle.contentViewWidth, { flexWrap: 'wrap', borderTopColor: '#f5f5f5', borderTopWidth: 1, paddingTop:20, width: '100%' }]}>
                            <View style = {[styles.promptLi]}>
                                <Ionicons
                                    name="ios-alarm"
                                    size={18}
                                    style={{color:'#999'}}
                                />
                                <Text style = {styles.promptTxt}>时长</Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style = {styles.promptContent}
                                >
                                    { activityInfo.total_time ? activityInfo.total_time : '暂无统计时长' }
                                </Text>
                            </View>
                            <View style = {[styles.promptLi]}>
                                <Ionicons
                                    name="md-pin"
                                    size={18}
                                    style={{color:'#999'}}
                                />
                                <Text style = {styles.promptTxt}>活动地址</Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style = {styles.promptContent}
                                >
                                    { activityInfo.country + ' ' }
                                    { activityInfo.province + ' ' }
                                    { activityInfo.city === '市辖区' ? null : activityInfo.city + ' ' }
                                    { activityInfo.region }
                                </Text>
                            </View>
                            <View style = {[styles.promptLi, {marginTop:35}]}>
                                <Ionicons
                                    name="ios-barcode"
                                    size={18}
                                    style={{color:'#999'}}
                                />
                                <Text style = {styles.promptTxt}>主要语言</Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style = {styles.promptContent}
                                >
                                    { activityInfo.main_language == 0 ? '中文' : activityInfo.main_language == 1 ? 'English' : '日本語' }
                                    {/*
                                    {
                                        activityInfo.other_language&&activityInfo.other.language.split(',').length > 0
                                        ?
                                            activityInfo.other_language.split(',').map((item, index) => {
                                                return (
                                                    <Text>
                                                        { item == 0 ? '中文' : item == 1 ? 'English' : '日本語'}
                                                    </Text>
                                                )
                                            })
                                        :
                                            null
                                    }*/}
                                </Text>
                            </View>
                            <View style = {[styles.promptLi]}>
                                <Ionicons
                                    name="ios-bed"
                                    size={18}
                                    style={{color:'#999'}}
                                />
                                <Text style = {styles.promptTxt}>住宿</Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style = {styles.promptContent}
                                >
                                    {
                                        activityInfo.issatay == 0
                                        ?
                                            '不提供住宿'
                                        :
                                        activityInfo.issatay == 1
                                        ?
                                            '提供住宿'
                                        :
                                            '包含住宿'
                                    }
                                </Text>
                            </View>
                        </View>
                        <TouchableHighlight
                            style={ [styles.transformBtn, commonStyle.flexCenter] }
                            underlayColor='rgba(0,0,0,.3)'
                            onPress={() =>{console.log('111');alert(11)}}
                        >
                            <Text style = { styles.transformTxt }>志愿者翻译</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <Activityuser navigate = {this.props.navigate} activityInfo = { activityInfo } />
                <Activitydetail navigate = {this.props.navigate} activityInfo = { activityInfo } />
                <Activityaddress navigate = {this.props.navigate} activityInfo = { activityInfo } />
                <Activitystatus navigate = {this.props.navigate} activityInfo = { activityInfo } />
                <View style = {[commonStyle.contentViewWidth, { marginTop: 20}]}>
                    <Text style = {{ fontSize:20, color: '#333', fontWeight: 'bold'}}>相似体验</Text>
                </View>
                <View style = {commonStyle.contentViewWidth}>
                    <Welikeactivity push = {this.props.push} navigate = {this.props.navigate} activity_id = {this.props.activity_id} not_normal = { true }/>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    promptList: {
        marginTop:10
    },
    promptLi:{
        width: widthScreen*0.96/2-5
    },
    promptTxt: {
        color: '#999',
        fontSize: 12,
        marginTop: 5
    },
    promptContent: {
        color: '#f5f5f5',
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold'
    },
    transformBtn: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        marginTop: 10,
        borderRadius: 5
    },
    transformTxt: {
        color: '#f5f5f5',
        fontSize: 16
    }
})
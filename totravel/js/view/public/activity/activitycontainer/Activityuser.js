import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import commonStyle from "../../../../../res/js/Commonstyle"
import LazyImage from "animated-lazy-image";
import Limittext from "../../../../../res/js/Limittext"
type Props = {}
const widthScreen = Dimensions.get('window').width;
export  default  class Activityuser extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            numLines:5,
            isMuti: true
        }
    }
    lookMore() {
        if(this.state.numLines===null){
            this.setState({
                //2行显示
                numLines:5,
            });
        }else{
            //显示全部
            this.setState({
                numLines:null,
            });
        }
    }
    render() {
        let { activityInfo } = this.props;
        let { numLines, isMuti } = this.state
        return (
            <View style = {[commonStyle.contentViewWidth, {paddingBottom:20, borderBottomColor: '#f5f5f5', borderBottomWidth: 1}]}>
                <View style = {[styles.userHeadCon, commonStyle.flexSpace ]}>
                    <View style = {{ width: widthScreen*0.94-90 }}>
                        <Text style = {{ fontSize:20, color: '#333', fontWeight: 'bold'}}>
                            来认识以下活动策划者
                            {
                                activityInfo.user
                                ?
                                    activityInfo.user.family_name + ' ' + activityInfo.user.middle_name + ' ' + activityInfo.user.name
                                :
                                    null
                            }
                        </Text>
                    </View>
                    <View style = {[commonStyle.flexEnd, {width: 90 }]}>
                        {
                            activityInfo.user && activityInfo.user.headimage
                            ?
                                <TouchableHighlight
                                    underlayColor='rgba(255,255,255,.1)'
                                    style={{width:60,height:60,borderRadius:30}}
                                    onPress={() =>{}}
                                >
                                    <LazyImage
                                        source={{uri:activityInfo.user.headimage.domain + activityInfo.user.headimage.image_url}}
                                        style={{width:60,height:60,borderRadius:30}}
                                    />
                                </TouchableHighlight>
                            :
                                <TouchableHighlight
                                    underlayColor='rgba(255,255,255,.1)'
                                    style={{width:60,height:60,borderRadius:30}}
                                    onPress={() =>{}}
                                >
                                    <LazyImage
                                        source={require('../../../../../res/image/data/touxiang.png')}
                                        style={{width:60,height:60,borderRadius:30}}
                                    />
                                </TouchableHighlight>
                        }
                    </View>
                </View>
                <View style = {{marginTop:20}}>
                    <Text style = {styles.userTxt}>
                        {activityInfo.introduce}
                    </Text>


                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    userHeadCon: {
        height: 60,
        marginTop:20
    },
    userTxt: {
        lineHeight: 23,
        color: '#333',
        fontSize: 16
    }
})
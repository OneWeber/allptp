import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, SafeAreaView} from 'react-native'
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../../../assets/css/Common_css';
import AntDesign from "react-native-vector-icons/AntDesign"
import NavigatorUtils from '../../../navigator/NavigatorUtils';
export default class TopSearch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0
        }
    }
    _onScroll(e){
        let y = e.nativeEvent.contentOffset.y;
        let opacityPercent = y / 120;
        this.setState({
            opacity:opacityPercent
        })
    }
    render(){
        const {opacity} = this.state
        return(
            <View style={{flex: 1,backgroundColor:'#fff'}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    scrollEventThrottle={16}
                    onScroll={(event)=>this._onScroll(event)}
                >
                    <LazyImage
                        source={require('../../../../assets/images/rsty.png')}
                        style={{width:'100%',height: 230}}
                    />
                    <View style={[CommonStyle.flexCenter,{
                        width:'100%',
                        height:30,
                        backgroundColor:'#f5f5f5'
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{height:30}]}>
                            <Text style={{color:'#666',fontSize: 12}}>实时热点,每一小时更新一次</Text>
                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView style={[styles.hot_navbar, CommonStyle.flexCenter,{
                    backgroundColor:'rgba(255,255,255,'+opacity+')',
                    borderBottomWidth: 1,
                    borderBottomColor:'rgba(245,245,245,'+opacity+')',
                }]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                        height: 50
                    }]}>
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{color: '#333',width:20}}
                            onPress={()=>{
                                NavigatorUtils.backToUp(this.props)
                            }}
                        />
                        <Text style={{
                            color:'rgba(0,0,0,'+opacity+')',
                            fontWeight:'bold',
                            fontSize: 16
                        }}>热搜体验</Text>
                        <View style={{width: 20}}></View>
                    </View>
                </SafeAreaView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    hot_navbar: {
        position:'absolute',
        left:0,
        top:0,
        right:0,
    }
})

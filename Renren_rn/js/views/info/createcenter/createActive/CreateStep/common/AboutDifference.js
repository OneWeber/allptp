import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView} from 'react-native';
import CreateHeader from '../../../../../../common/CreateHeader';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
class AboutDifference extends Component{
    constructor(props) {
        super(props);
        this.isDetail = this.props.navigation.state.params.isDetail?this.props.navigation.state.params.isDetail:false
    }
    hasRead(){
        NavigatorUtils.backToUp(this.props)
    }
    render(){
        const {theme} = this.props;
        return (
            <View style={{flex: 1,position:'relative',backgroundColor: "#fff"}}>
                <CreateHeader title={'关于退差价'} navigation={this.props.navigation} isDetail={this.isDetail}/>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{color:'#666',fontSize: 15,marginTop:24}}>小贴士：</Text>
                            <Text style={styles.about_txt}>
                                1.活动满设置人数且此体验完成结束时,退还用户预付的百分比金额（人数也包含购买套餐的固定人数）
                            </Text>
                            <Text style={styles.about_txt}>
                                2.如果设置第二次的人数下限大于上一次人数时,返还比例需大于上一次比例
                            </Text>
                            <Text style={styles.about_txt}>
                                3.体验结束时,若没有达到满设置退还人数时,将不会退还金额给用户
                            </Text>
                            <Text style={styles.about_txt}>
                                4.退差价的返还金额比例不叠加,默认选择只满足要求的一档返还
                            </Text>
                            <View style={{padding: 15,backgroundColor:'#F5F7FA',marginTop: 36.5,marginBottom: 100}}>
                                <Text style={{color:'#666',fontSize:13,lineHeight: 22}}>
                                    例子：小王购买了某策划者的体验,此体验参与时间为14:00-18:00,策划者设置此体验满10人参与则退还10%,若此体验在结束时满了10人参与,小王将收到支付的10%的退款。
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                        <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                            backgroundColor:theme
                        }]}
                             onPress={()=>this.hasRead()}
                        >
                            <Text style={{color:'#fff'}}>我知道了</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    about_txt:{
        color:'#333',
        lineHeight:22,
        marginTop: 28
    }
});
const mapStateToProps = state => ({
    theme: state.theme.theme
});
export default connect(mapStateToProps)(AboutDifference)

import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView,Dimensions} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import SideMenu from 'react-native-side-menu';
import MenuContent from '../../../../../common/MenuContent';
import {
    ParallaxSwiper,
    ParallaxSwiperPage
} from "react-native-parallax-swiper";
const {width, height} = Dimensions.get('window')
class Language extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '您需要会用您选择的语言与参与者交流',
            '体验发布后，您还可以添加自己会说的其他语言'
        ];
        this.state = {
            isOpenning: false
        }
    }
    goNext(){
        NavigatorUtils.goPage({},'Introduce')
    }
    render(){
        const {theme} = this.props;
        const {isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>
        return(
            <SideMenu
                menu={menu}
                isOpen={isOpenning}
                openMenuOffset={width*2/3}
                hiddenMenuOffset={0}
                edgeHitWidth={50}
                disableGestures={false}
                onChange={
                    (isOpen) => {
                        isOpen ?
                            this.setState({
                                isOpenning:true
                            })
                            :
                            this.setState({
                                isOpenning:false
                            })

                    }}
                menuPosition={'right'}     //抽屉在左侧还是右侧
                autoClosing={true}         //默认为true 如果为true 一有事件发生抽屉就会关闭
            >
                <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                    <CreateHeader title={'语言/类型'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{backgroundColor:'#fff'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <View style={{
                                    paddingTop:20,
                                    paddingBottom: 20,
                                }}>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize:16.8
                                    }}>小贴士</Text>
                                    <Prompt data={this.prompts}/>
                                </View>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>主要语言</Text>
                                <TouchableOpacity style={[CommonStyle.flexCenter,styles.select_btn]}>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>选择</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>其他语言</Text>
                                <TouchableOpacity style={[CommonStyle.flexCenter,styles.select_btn]}>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>选择</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>体验类型</Text>
                                <TouchableOpacity style={[CommonStyle.flexCenter,styles.select_btn]}>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>选择</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:theme
                            }]}
                            onPress={()=>this.goNext()}
                            >
                                <Text style={{color:'#fff'}}>保存并继续</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },

})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Language)

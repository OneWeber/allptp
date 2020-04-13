import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TextInput, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
const {width, height} = Dimensions.get('window')
class Provide extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '为参与者提供他们自己难以获取的特殊器材和装备',
            '了解参与者在饮食方面的特殊需求，考虑活动对参与者身体素质对要求，同时列出您将为参与者提供对所有物品',
        ]
        this.state = {
            isOpenning: false
        }
    }
    goNext(){
        NavigatorUtils.goPage({},'Bring')
    }
    render(){
        const {theme} = this.props;
        const {isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>
        return(
            <SideMenu
                menu={menu}                    //抽屉内的组件
                isOpen={isOpenning}     //抽屉打开/关闭
                openMenuOffset={width*2/3}     //抽屉的宽度
                hiddenMenuOffset={0}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
                edgeHitWidth={50}              //距离屏幕多少距离可以滑出抽屉,默认60
                disableGestures={false}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
                onChange={                   //抽屉状态变化的监听函数
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
                    <CreateHeader title={'我会提供什么'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <KeyboardAwareScrollView style={{flex: 1}}>
                        <ScrollView>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor:'#fff',
                                paddingTop:20,
                                paddingBottom: 20,
                                justifyContent:'flex-start'}]}>
                                <View style={CommonStyle.commonWidth}>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize:16.8
                                    }}>小贴士</Text>
                                    <Prompt data={this.prompts}/>
                                    <Text style={[styles.main_title,{marginTop:25}]}>
                                        关于活动您将提供什么东西
                                    </Text>
                                    <TextInput
                                        placeholder='请输入内容'
                                        editable={true}
                                        multiline={true}
                                        style={CommonStyle.long_input}/>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAwareScrollView>
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
        lineHeight:20
    },
    demo_item:{
        width:width*0.8,
        marginRight:15,
        padding:15,
        backgroundColor:'#f5f5f5'
    },
    inputs:{
        height:40,
        borderBottomColor:'#f5f5f5',
        borderBottomWidth: 1,
        marginTop: 15
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Provide)

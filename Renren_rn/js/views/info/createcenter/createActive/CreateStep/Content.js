import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import SideMenu from 'react-native-side-menu';
import MenuContent from '../../../../../common/MenuContent';
const {width, height} = Dimensions.get('window')
class Content extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '写明参与者会在体验中做些什么',
            '描述体验的行程，让参与者了解他妈可以期待的内容',
            '写出您的体验最独特的亮点',
            '不要写笼统的行程或者模糊的信息',
            '不要写参与者可以轻松找到的地方或者完成的活动'
        ]
        this.state = {
            isOpenning: false
        }
    }
    goNext(){
        NavigatorUtils.goPage({},'Provide')
    }
    render(){
        const {theme} = this.props;
        const {isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>
        return (
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
                    <CreateHeader title={'体验内容'} navigation={this.props.navigation}/>
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
                                        描述体验的大致流程和独特之处
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
export default connect(mapStateToProps)(Content)

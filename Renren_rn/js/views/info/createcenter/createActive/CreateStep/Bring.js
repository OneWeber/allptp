import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TextInput, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyle from '../../../../../../assets/css/Common_css';
import RNEasyRadio from 'react-native-easy-radio';
import {connect} from 'react-redux'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
const {width, height} = Dimensions.get('window')
class Bring extends Component{
    constructor(props) {
        super(props);
        this.tabNames=[
            {
                label:'参与者不需要携带任何东西',
                val: 0
            },
            {
                label:'参与者需要携带东西',
                val: 1
            }
        ]
        this.state = {
            isOpenning: false,
            selectIndex: 0
        }
    }
    selectBtn(val){
        this.setState({
            selectIndex: val
        })
    }
    goNext(){
        NavigatorUtils.goPage({},'Title')
    }
    render(){
        const {selectIndex} = this.state;
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
                    <CreateHeader title={'参与者需要自带什么'} navigation={this.props.navigation}/>
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
                                    <Text style={{color:'#333',fontWeight:'bold',fontSize: 16}}>参与者需要自带哪些东西</Text>
                                    <Text style={{
                                        lineHeight: 20,
                                        color:'#666',
                                        marginTop: 15,

                                    }}>请仔细考虑，在开展体验过程中，除了您提供对东西，参与者还需要自带什么。参与者预定体验后，我们将通过邮件告知他们这些信息。</Text>
                                    <View style={{marginTop: 5}}>
                                        <RNEasyRadio
                                            arrange_style={{justifyContent:'flex-start',alignItems:'flex-start'}}
                                            item_style={{marginTop: 20}}
                                            con_left={0}
                                            is_animate={false}
                                            text_style={{color:'#333',fontSize: 16,marginLeft: 10}}
                                            r_props={this.tabNames}
                                            onPress={(label, val, index) => {
                                                this.selectBtn(val)
                                            }}
                                        />
                                    </View>
                                    {
                                        selectIndex
                                        ?
                                            <View>
                                                <Text style={[styles.main_title,{marginTop:25}]}>
                                                    参与者要带些什么东西
                                                </Text>
                                                <TextInput
                                                    placeholder='请输入内容'
                                                    editable={true}
                                                    multiline={true}
                                                    style={CommonStyle.long_input}/>
                                            </View>
                                        :
                                            null
                                    }
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
export default connect(mapStateToProps)(Bring)

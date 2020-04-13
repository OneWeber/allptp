import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Dimensions} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
const {width, height} = Dimensions.get('window')
class Address extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '提一提你们将到访的，对您个人有特殊意义的地方',
            '带参与者去只有当地人才知道的地方',
            '不要在热门地点举办稀松平常的活动',
            '不要过多地描述场地细节，向参与者简要说明即可'
        ];
        this.state = {
            isOpenning: false
        }
    }
    goNext(){
        NavigatorUtils.goPage({},'Time')
    }
    render(){
        const {theme} = this.props;
        const {isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>;
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
                    <CreateHeader title={'体验地点'} navigation={this.props.navigation}/>
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
                                    <Text style={[styles.main_title]}>选择行程的体验地点</Text>
                                    <TouchableOpacity
                                        style={[CommonStyle.flexCenter,styles.select_btn]}
                                        onPress={()=>{this.picker.showPicker()}}
                                    >
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
                                    <Text style={[styles.main_title]}>选择集合地点</Text>
                                    <TouchableOpacity style={[CommonStyle.flexCenter,styles.select_btn]}>
                                        <Text style={{
                                            color:theme,
                                            fontWeight:'bold',
                                            fontSize: 13
                                        }}>选择</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.address_map}></View>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor:'#fff',
                                paddingTop:20,
                                paddingBottom: 20,
                                marginTop:10,
                                marginBottom:100,
                                justifyContent:'flex-start'}]}>
                                <View style={CommonStyle.commonWidth}>
                                    <Text style={[styles.main_title]}>
                                        体验期间，参与者还将前往哪些地方？
                                    </Text>
                                    <TextInput
                                        placeholder='请输入内容'
                                        editable={true}
                                        multiline={true}
                                        style={CommonStyle.long_input}/>
                                </View>
                            </View>
                            <RNEasyAddressPicker
                                hasCountry={true}
                                ref={picker => this.picker = picker}
                                selectCountry={(index) => {}}
                                selectCity={(index) => {}}
                                clickConfirmBtn={(data) => {console.log(data)}}
                            />
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
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
    address_map:{
        width:'100%',
        height:180,
        backgroundColor: '#fff',
        marginTop: 10
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Address)

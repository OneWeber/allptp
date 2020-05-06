import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import Prompt from './common/Prompt';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {connect} from 'react-redux'
import Interval from '../../../../../common/Interval';
import SideMenu from 'react-native-side-menu';
import MenuContent from '../../../../../common/MenuContent';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import Toast, {DURATION} from 'react-native-easy-toast';
import Fetch from '../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../utils/NewHttp';
import action from '../../../../../action';
const {width, height} = Dimensions.get('window')
class Introduce extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '突出您拥有的和体验相关的资质',
            '说说您从事这项活动有多少年了',
            '高告诉大家您为什么热衷于组织这项活动',
            '不要围绕您新学的或了解不慎的东西开展体验，因为参与者想找的是具备相关经验的达人'
        ]
        this.state = {
            link_1: '',
            link_2: '',
            link_3: '',
            isOpenning: false,
            introduce: '',
            isLoading: false,
            isInit: false
        }
    }
    componentDidMount() {
        const {activity_id} = this.props;
        if(activity_id === '') {
            return
        } else {
            this.initData()
        }
    }
    initData() {
        const {changeStatus} = this.props;
        this.setState({
            isInit: true
        });
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    introduce: res.data.introduce,
                    link_1: res.data.link_1,
                    link_2: res.data.link_2,
                    link_3: res.data.link_3,
                    isInit: false,
                }, () => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    goNext(){
        if(!this.state.isLoading) {
            this.saveIntroduce()
        }
        //NavigatorUtils.goPage({},'Content')
    }
    saveIntroduce() {
        const {activity_id} = this.props;
        if(!this.state.introduce) {
            this.refs.toast.show('请介绍您和这个主题之间的故事')
        } else {
            this.setState({
                isLoading: true
            });
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("activity_id",activity_id);
            formData.append("step",3);
            formData.append("introduce",this.state.introduce);
            formData.append("link_1",this.state.link_1);
            formData.append("link_2",this.state.link_2);
            formData.append("link_3",this.state.link_3);
            formData.append("question",JSON.stringify([]));
            formData.append("isapp",1);
            Fetch.post(NewHttp+'ActivitSaveTwo', formData).then(res => {
                if(res.code === 1) {
                    this.setState({
                        isLoading: false
                    });
                    NavigatorUtils.goPage({},'Content')
                }
            })
        }
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
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <CreateHeader title={'自我介绍'} navigation={this.props.navigation}/>
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
                                <View>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize:16.8
                                    }}>小贴士</Text>
                                    <Prompt data={this.prompts}/>
                                    <Text style={[styles.main_title,{marginTop:25}]}>
                                        向大家介绍一下您自己以及您和这个主题之间的故事
                                    </Text>
                                    <TextInput
                                        placeholder='请输入内容'
                                        editable={true}
                                        multiline={true}
                                        onChangeText ={(text)=>this.setState({introduce:text})}
                                        defaultValue={this.state.introduce}
                                        style={CommonStyle.long_input}/>

                                    <Text style={[styles.main_title,{marginTop:25}]}>
                                        如果您有围绕该主题的社交媒体账号或相关网站，如微信公众号，博客，微博或报道您的文章，请告诉我们。
                                    </Text>
                                    <TextInput
                                        style={styles.inputs}
                                        placeholder='请输入相关链接'
                                        editable={true}
                                        onChangeText ={(text)=>this.setState({link_1:text})}
                                        defaultValue ={this.state.link_1}
                                    />
                                    <TextInput
                                        style={styles.inputs}
                                        placeholder='请输入相关链接'
                                        editable={true}
                                        onChangeText ={(text)=>this.setState({link_1:text})}
                                        defaultValue ={this.state.link_2}
                                    />
                                    <TextInput
                                        style={[styles.inputs]}
                                        placeholder='请输入相关链接'
                                        editable={true}
                                        onChangeText ={(text)=>this.setState({link_1:text})}
                                        defaultValue ={this.state.link_3}
                                    />
                                </View>
                            </View>
                        </View>
                        <Interval />
                    </ScrollView>
                    </KeyboardAwareScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:theme
                            }]}
                                  onPress={()=>this.goNext()}
                            >
                                {
                                    this.state.isLoading
                                        ?
                                        <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
                                        :
                                        <Text style={{color:'#fff'}}>保存并继续</Text>
                                }
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
    theme: state.theme.theme,
    activity_id: state.steps.activity_id,
    token: state.token.token
});
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Introduce)

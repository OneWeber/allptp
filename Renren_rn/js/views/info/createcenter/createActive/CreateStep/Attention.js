import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import action from '../../../../../action';
import NewHttp from '../../../../../utils/NewHttp';
const {width} = Dimensions.get('window');
class Attention extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenning: false,
            isLoading: false,
            return_policy: 0,
            age_limit: '',
            return_content: '',
            activ_notice: ''
        }
        this.tabNames = [
            {
                id:1,
                title: '随时退款'
            },
            {
                id:2,
                title: '24小时前'
            },
            {
                id:3,
                title: '7天前'
            }
        ]
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
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    return_policy: res.data.return_policy,
                    age_limit: res.data.age_limit,
                    return_content: res.data.return_content,
                    activ_notice: res.data.activ_notice
                },() => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    changePolicy(id) {
        this.setState({
            return_policy: id
        },()=>{
            this.refs.attention.close()
        })
    }
    goNext() {
        if(!this.state.isLoading) {
            if(this.state.return_policy===0) {
                this.refs.toast.show('请选择退订政策')
            }else if(!this.state.return_content) {
                this.refs.toast.show('请填写退订政策内容')
            }else if(!this.state.age_limit) {
                this.refs.toast.show('请填写年龄限制')
            }else if(!this.state.activ_notice) {
                this.refs.toast.show('请填写体验中的注意事项')
            }else {
                this.saveAttention()
            }
        }

    }
    saveAttention() {
        this.setState({
            isLoading: false
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        formData.append("age_limit",this.state.age_limit);
        formData.append("return_policy",this.state.return_policy);
        formData.append("return_content",this.state.return_content);
        formData.append("activ_notice",this.state.activ_notice);
        formData.append("step",13);
        formData.append("isapp",1);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            this.setState({
                isLoading: false
            })
            NavigatorUtils.goPage({},'Reservation')
        })
    }
    render(){
        const {isOpenning, return_policy} = this.state;
        const {theme} = this.props;
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
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <CreateHeader title={'注意事项'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>介绍体验中的注意事项</Text>
                                <Text style={{
                                    color:'#333',
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>您需要写出体验中的注意事项和退订政策</Text>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            marginTop: 10,
                            paddingTop:20,
                            paddingBottom: 20,
                            backgroundColor: '#fff'
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 16,
                                    fontWeight:'bold',
                                }}>退订政策</Text>
                                {
                                    return_policy
                                    ?
                                        <TouchableOpacity
                                            style={[CommonStyle.flexStart]}
                                            onPress={()=>{
                                                this.refs.attention.open()
                                            }}
                                        >
                                            <Text style={{color:'#333'}}>{this.tabNames[return_policy-1].title}</Text>
                                            <AntDesign
                                                name={'right'}
                                                size={14}
                                                style={{color: '#666'}}
                                            />
                                        </TouchableOpacity>
                                    :
                                        <TouchableOpacity
                                            style={[CommonStyle.flexCenter,styles.select_btn]}
                                            onPress={()=>{
                                                this.refs.attention.open()
                                            }}
                                        >
                                            <Text style={{
                                                color:theme,
                                                fontWeight:'bold',
                                                fontSize: 13
                                            }}>选择</Text>
                                        </TouchableOpacity>
                                }

                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>退订政策内容</Text>
                                <TextInput
                                    multiline={true}
                                    placeholder="请输入退订政策内容"
                                    defaultValue={this.state.return_content}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            return_content: text
                                        })
                                    }}
                                    style={{
                                        textAlignVertical:'top',
                                        minHeight: 120,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: 1,
                                        marginTop: 15
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>参加体验的年龄限制</Text>
                                <TextInput
                                    placeholder="请输入年龄"
                                    keyboardType={"number-pad"}
                                    defaultValue={this.state.age_limit}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            age_limit: text
                                        })
                                    }}
                                    style={{
                                        height: 40,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: 1,
                                        marginTop: 15
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            marginBottom: 100,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>体验中的注意事项</Text>
                                <TextInput
                                    multiline={true}
                                    placeholder="请输入体验注意事项"
                                    defaultValue={this.state.activ_notice}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            activ_notice: text
                                        })
                                    }}
                                    style={{
                                        textAlignVertical:'top',
                                        minHeight: 120,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: 1,
                                        marginTop: 15
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:this.props.theme
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
                    <Modal
                        style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                        ref={"attention"}
                        animationDuration={200}
                        position={"bottom"}
                        backdropColor={'rgba(0,0,0,0.5)'}
                        swipeToClose={true}
                        backdropPressToClose={true}
                        coverScreen={true}>
                        <View style={{
                            height:180,
                            backgroundColor: '#fff'
                        }}>
                            {
                                this.tabNames.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        height:60,
                                        borderBottomWidth: index===2?0:1,
                                        borderBottomColor: '#f5f5f5'
                                    }]} onPress={()=>{
                                        this.changePolicy(item.id)
                                    }}>
                                        <Text style={{color: '#333'}}>{item.title}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    </Modal>
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
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
});
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    activity_id: state.steps.activity_id,
})
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Attention)

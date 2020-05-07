import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modalbox';
import {connect} from 'react-redux'
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import action from '../../../../../action';
import NewHttp from '../../../../../utils/NewHttp';
const {width} = Dimensions.get('window');
class Reservation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenning: false,
            isLoading: false,
            end_order_index: 0,
            end_order: -1,
            no_order: 0,
            no_end_order_index: 0,
            no_end_order: 0
        }
        this.tabNames = [
            {title:'不设置',id:-1},
            {title:'体验开始时',id:0},
            {title:'体验开始前1个小时',id:3600},
            {title:'体验开始前2个小时',id:7200},
            {title:'体验开始前3个小时',id:10800},
            {title:'体验开始前4个小时',id:14400},
            {title:'体验开始前8个小时',id:28800},
            {title:'体验开始前12个小时',id:43200},
            {title:'体验开始前1天',id:86400},
            {title:'体验开始前2天',id:172800},
            {title:'体验开始前3天',id:259200},
            {title:'体验开始前4天',id:345600},
            {title:'体验开始前5天',id:432000},
            {title:'体验开始前6天',id:518400},
            {title:'体验开始前一周',id:604800},
        ]
        this.timeTab = [
            {title:'体验开始时',id:0},
            {title:'体验开始2天前',id:172800},
            {title:'体验开始3天前',id:259200},
            {title:'体验开始4天前',id:345600},
            {title:'体验开始5天前',id:432000},
            {title:'体验开始6天前',id:518400},
            {title:'体验开始1周前',id:604800},
        ]
        this.cancelTab = [
            {
                id: 0,
                title:'是的，如果没有参与者预定，请取消我的体验。'
            },
            {
                id: 1,
                title:'不用了，谢谢。请按原计划安排我的体验。'
            },
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
                    end_order: res.data.end_order,
                    no_order: res.data.no_order,
                    no_end_order: res.data.no_end_order
                },() => {
                    for(let i=0;i<this.tabNames.length;i++) {
                        if(this.tabNames[i].id == this.state.end_order) {
                            this.setState({
                                end_order_index: i
                            })
                        }
                    }
                    for(let i=0;i<this.timeTab.length;i++) {
                        if(this.timeTab[i].id == this.state.no_end_order) {
                            this.setState({
                                no_end_order_index: i
                            })
                        }
                    }
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    changeReserTime(index) {
        this.setState({
            end_order_index: index,
            end_order: this.tabNames[index].id
        },()=>{
            this.refs.reserTime.close()
        })
    }
    goNext() {
        this.saveReservation();
    }
    saveReservation() {
        this.setState({
            isLoading: true
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        formData.append("step",14);
        formData.append("isapp",1);
        formData.append("end_order",this.state.end_order);
        formData.append("no_order",this.state.no_order);
        formData.append("no_end_order",this.state.no_end_order);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    isLoading: false
                })
                NavigatorUtils.goPage({}, 'Booking')
            }
        })
    }
    changeCancelTime(index) {
        this.setState({
            no_end_order_index: index,
            no_end_order: this.timeTab[index].id
        },()=>{
            this.refs.cancelTime.close()
        })
    }
    render(){
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
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <CreateHeader title={'预定设置'} navigation={this.props.navigation}/>
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
                                <Text style={styles.main_title}>您希望在体验开始前多久截止预定</Text>
                                <Text style={{
                                    color:'#333',
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>
                                    我们建议您把截止时间设置为接近体验开始时间，以便
                                    更多的参与者预订，但请确保您有充足时间为接待参与
                                    者做准备
                                </Text>
                                <TouchableOpacity style={[CommonStyle.spaceRow,{
                                    height: 40,
                                    paddingLeft: 13.5,
                                    paddingRight: 13.5,
                                    borderColor: '#dfe1e4',
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    marginTop: 20.5
                                }]} onPress={()=>{
                                    this.refs.reserTime.open()
                                }}>
                                    <Text style={{
                                        color:'#999'
                                    }}>{this.tabNames[this.state.end_order_index].title}</Text>
                                    <AntDesign
                                        name={'down'}
                                        size={14}
                                        style={{color:'#666'}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>
                                    如果到设定的活动开始时间没有参与者预订您的
                                    体验，您希望取消体验吗？
                                </Text>
                                {
                                    this.cancelTab.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                            marginTop: 20
                                        }]} onPress={()=>{
                                            this.setState({
                                                no_order: item.id
                                            })
                                        }}>
                                            <View style={[CommonStyle.flexCenter,{
                                                width:18,
                                                height:18,
                                                borderWidth: this.state.no_order===index?0:1,
                                                borderRadius: 9,
                                                borderColor: '#ccc',
                                                backgroundColor:this.state.no_order===index?'#14c5ca':'#fff'
                                            }]}>
                                                {
                                                    this.state.no_order===index
                                                    ?
                                                        <AntDesign
                                                            name={'check'}
                                                            size={14}
                                                            style={{color:'#fff'}}
                                                        />
                                                    :
                                                        null
                                                }
                                            </View>
                                            <Text style={{
                                                marginLeft: 10,
                                                color: '#333'
                                            }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                                {
                                    this.state.no_order === 0
                                    ?
                                        <View>
                                            <TouchableOpacity style={[CommonStyle.spaceRow,{
                                                height: 40,
                                                paddingLeft: 13.5,
                                                paddingRight: 13.5,
                                                borderColor: '#dfe1e4',
                                                borderWidth: 1,
                                                borderRadius: 2,
                                                marginTop: 20.5
                                            }]} onPress={()=>{
                                                this.refs.cancelTime.open()
                                            }}>
                                                <Text style={{
                                                    color:'#999'
                                                }}>{this.timeTab[this.state.no_end_order_index].title}</Text>
                                                <AntDesign
                                                    name={'down'}
                                                    size={14}
                                                    style={{color:'#666'}}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    :
                                        null
                                }
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
                        style={{height:300,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                        ref={"reserTime"}
                        animationDuration={200}
                        position={"bottom"}
                        backdropColor={'rgba(0,0,0,0.5)'}
                        swipeToClose={true}
                        backdropPressToClose={true}
                        coverScreen={true}>
                        <View style={{
                            height:300,
                            backgroundColor: '#fff'
                        }}>
                            <ScrollView>
                                {
                                    this.tabNames.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                            height:60,
                                            borderBottomColor: '#F5F5F5',
                                            borderBottomWidth: index===(this.tabNames.length-1)?0:1
                                        }]} onPress={()=>{
                                            this.changeReserTime(index)
                                        }}>
                                            <Text style={{color:'#333'}}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                    <Modal
                        style={{height:200,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                        ref={"cancelTime"}
                        animationDuration={200}
                        position={"bottom"}
                        backdropColor={'rgba(0,0,0,0.5)'}
                        swipeToClose={true}
                        backdropPressToClose={true}
                        coverScreen={true}>
                        <View style={{
                            height:200,
                            backgroundColor: '#fff'
                        }}>
                            <ScrollView>
                                {
                                    this.timeTab.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                            height:60,
                                            borderBottomColor: '#F5F5F5',
                                            borderBottomWidth: index===(this.timeTab.length-1)?0:1
                                        }]} onPress={()=>{
                                            this.changeCancelTime(index)
                                        }}>
                                            <Text style={{color:'#333'}}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </ScrollView>
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
    token: state.token.token,
    theme:state.theme.theme,
    activity_id: state.steps.activity_id,
});
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Reservation)

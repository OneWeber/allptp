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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import action from '../../../../../action';
import NewHttp from '../../../../../utils/NewHttp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const {width} = Dimensions.get('window');
class Booking extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenning: false,
            book_whole: 0,
            isLoading: false,
            low_price: ''
        }
        this.tabNames = [
            {
                id: 0,
                title:'不允许参与者包场'
            },
            {
                id: 1,
                title:'允许参与者包场'
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
                    book_whole: res.data.book_whole,
                    low_price: res.data.low_price,
                },() => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    goNext() {
        if(this.state.book_whole===1) {
            if(this.state.low_price === '') {
                this.refs.toast.show('请输入包场价格')
            }else{
                this.saveBooking()
            }
        }else{
            this.saveBooking()
        }
    }
    saveBooking() {
        this.setState({
            isLoading: true
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        formData.append("step",15);
        formData.append("book_whole",this.state.book_whole);
        formData.append("low_price",this.state.low_price);
        formData.append("isapp",1);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    isLoading: false
                })
                NavigatorUtils.goPage({}, 'Vol')
            }
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
                    <CreateHeader title={'体验包场'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>体验包场</Text>
                                <Text style={{
                                    color:'#333',
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>
                                    如果参与者可以包下整场体验，您就不比费心等待更多 预订，从而进一步专注于分享您的专业知识。
                                </Text>
                                <Text style={{
                                    color:'#333',
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>
                                    参与者可以把单次体验整个包下来作为私人体验，如果 您日历上某次体验还没有人预订，参与者可以包下整场 体验。
                                </Text>
                                {
                                    this.tabNames.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                            marginTop: 20
                                        }]} onPress={()=>{
                                            this.setState({
                                                book_whole: index
                                            })
                                        }}>
                                            <View style={[CommonStyle.flexCenter,{
                                                width:18,
                                                height:18,
                                                borderWidth: this.state.book_whole===index?0:1,
                                                borderRadius: 9,
                                                borderColor: '#ccc',
                                                backgroundColor:this.state.book_whole===index?'#14c5ca':'#fff'
                                            }]}>
                                                {
                                                    this.state.book_whole===index
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
                                    this.state.book_whole === 1
                                    ?
                                        <View style={{
                                            marginTop: 20
                                        }}>
                                            <Text style={styles.main_title}>设置包场价格</Text>
                                            <View style={[CommonStyle.spaceRow,{
                                                height:45,
                                                marginTop:15,
                                                borderWidth: 1,
                                                borderColor: '#f5f5f5',
                                                borderRadius: 5
                                            }]}>
                                                <View style={[CommonStyle.flexCenter,{
                                                    height:35,
                                                    width: 80,
                                                    borderRightColor: '#f5f5f5',
                                                    borderRightWidth: 1
                                                }]}>
                                                    <Text style={{color:'#333'}}>APY(¥)</Text>
                                                </View>
                                                <TextInput
                                                    placeholder="输入包场价格"
                                                    defaultValue={this.state.low_price?JSON.stringify(parseFloat(this.state.low_price)):''}
                                                    keyboardType='numeric'
                                                    onChangeText={(text)=>{
                                                        this.setState({
                                                            low_price: text
                                                        })
                                                    }}
                                                    style={{
                                                        width: width*0.94-85,
                                                        height:45,
                                                        color: '#333'
                                                    }}
                                                />
                                            </View>
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
    theme: state.theme.theme,
    activity_id: state.steps.activity_id,
});
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Booking)

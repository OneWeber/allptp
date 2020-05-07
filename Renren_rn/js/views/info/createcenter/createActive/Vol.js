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
import CreateHeader from '../../../../common/CreateHeader';
import SiderMenu from '../../../../common/SiderMenu';
import MenuContent from '../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
import CommonStyle from '../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import action from '../../../../action';
import Fetch from '../../../../expand/dao/Fetch';
import HttpUrl from '../../../../utils/Http';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import NewHttp from '../../../../utils/NewHttp';
const {width} = Dimensions.get('window');
class Vol extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenning: false,
            is_volunteen: 0,
            volun_laguage: [],
            volun_require: '',
            mainLanguge: [-1, -1, -1],
            isLoading: false
        }
        this.tabNames = [
            {
                id: 0,
                title:'不需要'
            },
            {
                id: 1,
                title:'需要'
            },
        ]
        this.languages = [
            {
                title: '中文',
                val: 0
            },
            {
                title: 'English',
                val: 1
            },
            {
                title: '日本語',
                val: 2
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
                    is_volunteen: res.data.is_volunteen,
                    volun_require: res.data.volun_require,
                    volun_laguage: res.data.volun_laguage.split(',')
                },() => {
                    console.log(res.data)
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    changeLanguge(val) {
        let list = this.state.mainLanguge;
        let select = [];
        for(let i=0;i<list.length;i++) {
            if(i === val) {
                if(list[i] === -1) {
                    list[i] = 1
                } else {
                    list[i] = -1
                }
            }
            if(list[i] === 1) {
                select.push(i)
            }
        }
        this.setState({
            mainLanguge: list,
            volun_laguage: select
        })
    }
    goNext() {
        if(this.state.is_volunteen===1) {
            if(this.state.volun_laguage.length === 0) {
                this.refs.toast.show('请选择志愿者语言需求')
            }else {
                this.saveVol()
            }
        }else {
            this.saveVol()
        }
    }
    saveVol() {
        this.setState({
            isLoading: true
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        formData.append("step",16);
        formData.append("is_volunteen",this.state.is_volunteen);
        formData.append("volun_laguage",JSON.stringify(this.state.volun_laguage));
        formData.append("volun_require",this.state.volun_require);
        formData.append("isapp",1);
        console.log(formData)
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    isLoading: false
                })
                NavigatorUtils.goPage({}, 'Submit')
            }
        })
    }
    render(){
        const {isOpenning} = this.state;
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
                    <CreateHeader title={'志愿者'} navigation={this.props.navigation}/>
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
                                <Text style={styles.main_title}>邀请志愿者</Text>
                                <Text style={{
                                    color:'#333',
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>
                                    针对您创建的体验，根据您的需求，是否需要志愿者来参与活动，并且帮助您与参与者之间的沟通。但是您必须向志愿者免单。
                                </Text>
                                {
                                    this.tabNames.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                            marginTop: 20
                                        }]} onPress={()=>{
                                            this.setState({
                                                is_volunteen: index
                                            })
                                        }}>
                                            <View style={[CommonStyle.flexCenter,{
                                                width:18,
                                                height:18,
                                                borderWidth: this.state.is_volunteen===index?0:1,
                                                borderRadius: 9,
                                                borderColor: '#ccc',
                                                backgroundColor:this.state.is_volunteen===index?'#14c5ca':'#fff'
                                            }]}>
                                                {
                                                    this.state.is_volunteen===index
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
                            </View>
                        </View>
                        {
                            this.state.is_volunteen === 1
                            ?
                                <View style={{marginTop: 10}}>
                                    <View style={[CommonStyle.flexCenter,{
                                        paddingTop: 20,
                                        paddingBottom: 20,
                                        backgroundColor: '#fff'
                                    }]}>
                                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 16,
                                                fontWeight:'bold',
                                            }}>语言需求</Text>
                                            {
                                                this.state.volun_laguage.length === 0
                                                ?
                                                    <TouchableOpacity
                                                        style={[CommonStyle.flexCenter,styles.select_btn]}
                                                        onPress={()=>{
                                                            this.refs.language.open()
                                                        }}
                                                    >
                                                        <Text style={{
                                                            color:theme,
                                                            fontWeight:'bold',
                                                            fontSize: 13
                                                        }}>选择</Text>
                                                    </TouchableOpacity>
                                                 :
                                                    <TouchableOpacity
                                                        style={CommonStyle.flexEnd}
                                                        onPress={()=>{
                                                            this.refs.language.open()
                                                        }}
                                                    >
                                                        {
                                                            this.state.volun_laguage.map((item, index) => {
                                                                return <Text key={index} style={{
                                                                    color:this.props.theme,
                                                                    marginLeft: 5,
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {this.languages[item].title}
                                                                </Text>
                                                            })
                                                        }
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
                                            <Text style={styles.main_title}>其他要求</Text>
                                            <TextInput
                                                multiline={true}
                                                defaultValue={this.state.volun_require}
                                                onChangeText={(text)=>{
                                                    this.setState({
                                                        volun_require: text
                                                    })
                                                }}
                                                placeholder="请输入其他要求"
                                                style={{
                                                    textAlignVertical:'top',
                                                    minHeight: 120,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#f5f5f5',
                                                    marginTop: 20
                                                }}
                                            />
                                        </View>
                                    </View>

                                </View>
                            :
                                null
                        }
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
                        ref={"language"}
                        animationDuration={200}
                        position={"bottom"}
                        backdropColor={'rgba(0,0,0,0.9)'}
                        swipeToClose={true}
                        backdropPressToClose={true}
                        coverScreen={true}>
                        <View style={{
                            height: 180,
                            backgroundColor:'#fff'
                        }}>
                            {
                                this.languages.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        height:60,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: index===2?0:1
                                    }]} onPress={() => {
                                        this.changeLanguge(item.val)
                                    }}>
                                        <Text style={{
                                            color:this.state.mainLanguge[index]===1?this.props.theme:'#333'
                                        }}>{item.title}</Text>
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
    token: state.token.token,
    theme: state.theme.theme,
    activity_id: state.steps.activity_id,
});
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Vol)

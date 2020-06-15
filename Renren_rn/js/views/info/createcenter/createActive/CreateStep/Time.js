import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput, ActivityIndicator,
} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
import Fetch from '../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../utils/NewHttp';
import action from '../../../../../action'
import Modal from 'react-native-modalbox';
import Toast, {DURATION} from 'react-native-easy-toast';
const {width, height} = Dimensions.get('window')
class Time extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '选择体验时间决定该体验是多天体验或单天体验',
            '根据体验的性质理性决定体验的时间段',
        ];
        this.timeNames = [
            {title:'举办多天体验', id: 0},
            {title:'举办单天体验', id: 1},
        ]
        this.state = {
            isOpenning: false,
            timeIndex: 0,
            dateIndex: -1,
            slot: this.props.longDay,
            differ: this.props.difference,
            minAge: '',
            maxAge: '',
            isChild: false,
            ageLimit: '',
            isLoading: false,
            showSlot: []
        }
    }
    componentDidMount() {
        this.getSlot();
        this.getDiffer();
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
                console.log('ressssss', res)
                this.setState({
                    minAge: res.data.kids_stand_low,
                    maxAge: res.data.kids_stand_high,
                    timeIndex: res.data.long_day,
                    ageLimit: res.data.age_limit
                }, () => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    getSlot() {
        const {activity_id, token, changeLongDay} = this.props;
        let formData = new FormData();
        formData.append("token",token);
        formData.append("version",'2.0');
        formData.append("activity_id",activity_id);
        Fetch.post(NewHttp+'ActivitySlotUserTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    slot: res.data,
                    // timeIndex: res.data.length>0?res.data[0].long_day:0
                },() => {
                    console.log(res.data)
                    if(this.state.timeIndex) {
                        this.initSingleDate(this.state.slot)
                    }else{
                        this.initManyDate(this.state.slot)
                    }
                    const {slot} = this.state;
                    let data = [];
                    for(let i=0;i<slot.length;i++) {
                        if(slot[i].online===0) {
                            data.push(slot[i])
                        }
                    }
                    this.setState({
                        showSlot: data
                    })
                    changeLongDay(this.state.slot)
                })
            } else {
                changeLongDay([])
            }
        })
    }
    initSingleDate(data){
        let dates = [];
        const {changeDateValue} = this.props;
        for(let i=0;i<data.length;i++){
            dates.push({
                begin_date: data[i].date,
                end_date:data[i].date
            })
        }
        changeDateValue(dates)
    }
    initManyDate(data) {
        let dates = [];
        const {changeDateValue} = this.props;
        for(let i=0;i<data.length;i++){
            dates.push({
                begin_date: data[i].begin_date,
                end_date:data[i].end_date
            })
        }
        changeDateValue(dates)
    }
    getDiffer() {
        const {activity_id, token, changeDifference} = this.props;
        let formData = new FormData();
        formData.append("token",token);
        formData.append("version",'2.0');
        formData.append("activity_id",activity_id);
        Fetch.post(NewHttp + 'DifferListTwo',formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    differ: res.data
                },() => {
                    changeDifference(this.state.differ)
                });
            }
        })
    }
    changeIndex(index, id){
        if(this.state.showSlot.length===0) {
            if(index === this.state.timeIndex) {
                this.setState({
                    timeIndex: -1
                })
            } else {
                this.setState({
                    timeIndex: id
                })
            }
        }

    }
    goLongTime(){
        const {changeDiscount,changeAdultStandard,changeChildStandard,changeParentChildPackage,changeCustomePackage,changeNewDate} = this.props;
        changeAdultStandard({
            standard: 10,
            originalPrice: ''
        });
        changeChildStandard({
            standard: 10,
            originalPrice: ''
        });
        changeParentChildPackage([]);
        changeCustomePackage([]);
        changeNewDate([]);
        changeDiscount(false)
        let _this = this;
        NavigatorUtils.goPage({
            timeIndex: this.state.timeIndex,
            refresh: function () {
                _this.getSlot()
            }
        },'LongTime')
    }
    goNext(){
        if(!this.state.isLoading) {
            this.saveTime()
        }
    }
    saveTime() {
        const {activity_id, token} = this.props;
        if(!this.state.slot) {
            this.refs.toast.show('请选择举办体验时间段')
        }else if(!this.state.ageLimit) {
            this.refs.toast.show('请填写参与者年龄下限')
        }else if(!this.state.minAge||!this.state.maxAge) {
            this.refs.toast.show('请完善儿童价标准')
        }else if(parseFloat(this.state.ageLimit)>parseFloat(this.state.minAge)) {
            this.refs.toast.show('参与者年龄下限不得大于儿童价标准最低年龄')
        }else {
            this.setState({
                isLoading: true
            });
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("age_limit",this.state.ageLimit);
            formData.append("kids_stand_low",this.state.minAge);
            formData.append("kids_stand_high",this.state.maxAge);
            formData.append("long_day",this.state.timeIndex);
            formData.append("activity_id",activity_id);
            formData.append("step",11);
            formData.append("isapp",1);
            console.log('dataaaaaa', formData)
            Fetch.post(NewHttp+'ActivitSaveTwo', formData).then(res => {
                this.setState({
                    isLoading: false
                })
                if(res.code === 1) {
                    NavigatorUtils.goPage({},'Accommodation')
                }
            })
        }
    }
    getWeekDay(date) {
        let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let myDate = new Date(Date.parse(date));
        return weekDay[myDate.getDay()]
    }
    clickDateItem(index, data){
        this.setState({
            dateIndex: index
        },() => {
            let _this = this;
            NavigatorUtils.goPage({
                slot: data,
                isSingle: this.state.timeIndex,
                refresh: function () {
                    _this.setState({
                        dateIndex: -1
                    });
                    _this.getSlot()
                }
            }, 'Calendar')
        })
    }
    renderItem(data){
        const {dateIndex} = this.state;
        const {theme} = this.props
        let begin = data.item.begin_date.split('-');
        let end = data.item.end_date.split('-');
        return <View>
            {
                data.item.online===0
                ?
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        width: 90,
                        height: 50,
                        backgroundColor: dateIndex===data.index?'#ECFEFF':'#F5F7FA',
                        borderRadius: 5,
                        marginLeft: width*0.03,
                        marginRight: data.index===this.state.slot.length-1?65.5:0
                    }]} onPress={() => {this.clickDateItem(data.index, data.item)}}>
                        <Text style={{
                            color:dateIndex===data.index?theme:'#333',
                            fontSize: 13
                        }}>{
                            this.state.timeIndex&&data.item.date!='1970-01-01'
                                ?
                                data.item.date
                                :
                                begin[1]+'.'+begin[2] +'-'+ end[1]+'.'+end[2]
                        }</Text>
                        <Text style={{
                            color:dateIndex===data.index?theme:'#333',
                            fontSize: 13,
                            marginTop: 2
                        }}>{this.getWeekDay(begin.join('/'))}开始</Text>
                    </TouchableOpacity>
                :
                    null
            }

        </View>
    }
    goDifference(data, differ_id, index){
        NavigatorUtils.goPage({ //this.props.difference
            data: data,
            differ_id: differ_id,
            index: index,
            difference: this.props.difference
        }, 'SettingDifference')
    }
    _changeAge(text, val) {
        if(val === 'min') {
            if(parseFloat(this.state.maxAge)>0) {
                if(parseFloat(text)<parseFloat(this.state.maxAge)) {
                    console.log(111)
                    this.setState({minAge:text})
                }else{
                    console.log(222)
                    this.refs.toast.show('最大年龄必须大于最低年龄')
                    this.setState({minAge:0})
                }
            }else{
                this.setState({minAge:text})
            }
        }else {
            if(parseFloat(this.state.minAge)>0) {
                if(parseFloat(text)>parseFloat(this.state.minAge)) {
                    this.setState({maxAge:text})
                }else{
                    this.refs.toast.show('最大年龄必须大于最低年龄')
                    this.setState({maxAge:0})
                }
            }else{
                this.setState({maxAge:text})
            }

        }
    }
    _ageLimitChange(text) {
        this.setState({
            ageLimit: text
        })
    }
    delDiffer(differ_id) {
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("version", '2.0');
        formData.append("differ_id", differ_id);
        Fetch.post(NewHttp+'DifferDelTwo', formData).then(res => {
            if(res.code === 1) {
                this.getDiffer()
            }
        })
    }
    render(){
        const {theme} = this.props;
        const {timeIndex, isOpenning, minAge, maxAge} = this.state;
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
                    <CreateHeader title={'体验时间'} navigation={this.props.navigation}/>
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
                                <Text style={{
                                    color:theme,
                                    fontWeight:'bold',
                                    fontSize:16.8
                                }}>小贴士</Text>
                                <Prompt data={this.prompts}/>
                                <Text style={[styles.main_title,{marginTop:25}]}>
                                    选择体验时间举办的类型
                                </Text>
                                {
                                    this.timeNames.map((item, index) => {
                                        return <View key={index} style={{marginTop:20,position:'relative'}}>
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[CommonStyle.flexStart]}
                                                    onPress={()=>{this.changeIndex(index, item.id)}}
                                                >
                                                <View style={[styles.time_roll,CommonStyle.flexCenter,{
                                                    backgroundColor:timeIndex===index?theme:'#fff'
                                                }]}>
                                                    {
                                                        timeIndex===index
                                                        ?
                                                            <AntDesign
                                                                name={'check'}
                                                                size={16}
                                                                style={{color:'#fff'}}
                                                            />
                                                        :
                                                            null
                                                    }

                                                </View>
                                                <Text style={styles.time_txt}>{item.title}</Text>
                                            </TouchableOpacity>
                                                {
                                                    timeIndex>-1&&timeIndex!==index
                                                    ?
                                                        <View style={styles.bg_shadow}></View>
                                                    :
                                                        null
                                                }

                                        </View>
                                    })
                                }
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop: 20,
                            paddingBottom:20,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <Text style={[styles.main_title]}>举办体验时间段</Text>
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,styles.select_btn]}
                                    onPress={()=>{this.goLongTime()}}
                                >
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>添加</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.showSlot.length > 0
                                ?
                                    <View style={[CommonStyle.flexStart,{marginTop: 15,flexDirection:'row',position:'relative'}]}>
                                        <FlatList
                                            data={this.state.showSlot}
                                            horizontal={true}
                                            showsVerticalScrollIndicator = {false}
                                            showsHorizontalScrollIndicator = {false}
                                            renderItem={data=>this.renderItem(data)}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                :
                                    null
                            }
                        </View>

                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop: 20,
                            paddingBottom:20,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <View style={CommonStyle.flexStart}>
                                    <Text style={[styles.main_title]}>设置退差价</Text>
                                    <AntDesign
                                        name={'questioncircleo'}
                                        size={14}
                                        style={{color:'#CACACAFF',marginLeft: 10}}
                                        onPress={()=>{
                                            NavigatorUtils.goPage({}, 'AboutDifference')
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,styles.select_btn]}
                                    onPress={()=>{this.goDifference()}}
                                >
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>添加</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.props.difference.length > 0
                                ?
                                this.props.difference.map((item, index) => {
                                    return <View key={index} style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                        backgroundColor:'#F5F7FAFF',
                                        height: 40,
                                        borderRadius: 3,
                                        marginTop: index===0?15:10,
                                        paddingLeft: 9.5,
                                        paddingRight: 9.5
                                    }]}>
                                        <Text style={{
                                            color:'#333'
                                        }}>满{item.num}人退{parseFloat(item.refund_rate)}%</Text>
                                        <View style={[CommonStyle.flexEnd]}>
                                            <Text
                                                style={{color:'#a4a4a4',fontSize: 13,marginRight: 20}}
                                                onPress={()=>{this.goDifference(item, item.differ_id, index)}}
                                            >编辑</Text>
                                            <Text
                                                style={{color:'#a4a4a4',fontSize: 13}}
                                                onPress={()=>{this.delDiffer(item.differ_id)}}
                                            >删除</Text>
                                        </View>
                                    </View>
                                })
                                :
                                    null
                            }
                        </View>

                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]} onPress={()=>{
                            this.setState({
                                isChild: true
                            },()=>{
                                this.refs.child.open()
                            })
                        }}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>儿童价标准</Text>
                                <View style={CommonStyle.flexEnd}>
                                    {
                                        minAge || maxAge
                                        ?
                                            <Text style={{color:'#333'}}>
                                                {minAge?minAge:'~'}到{maxAge?maxAge:'~'}周岁
                                            </Text>
                                        :
                                            null
                                    }
                                    <AntDesign
                                        name={'right'}
                                        size={16}
                                        style={{color:'#666'}}
                                    />
                                </View>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10,
                            marginBottom: 100
                        }]} onPress={()=>{
                            this.setState({
                                isChild: false
                            },()=>{
                                if(!this.state.minAge) {
                                    this.refs.toast.show('请先设置儿童价标准')
                                }else{
                                    this.refs.child.open()
                                }
                            })
                        }}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>参与者年龄下限</Text>
                                <View style={CommonStyle.flexEnd}>
                                    {
                                        this.state.ageLimit
                                        ?
                                            <Text style={{color:'#333'}}>{this.state.ageLimit}岁</Text>
                                        :
                                            null
                                    }
                                    <AntDesign
                                        name={'right'}
                                        size={16}
                                        style={{color:'#666'}}
                                    />
                                </View>

                            </View>
                        </TouchableOpacity>
                    </ScrollView>
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
                    <Modal
                        style={{height:this.state.isChild?150:100,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                        ref={"child"}
                        animationDuration={200}
                        position={"center"}
                        backdropColor={'rgba(0,0,0,0.5)'}
                        swipeToClose={true}
                        backdropPressToClose={true}
                        coverScreen={true}>
                        <View style={[CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth,{
                                height:this.state.isChild?150:100,
                                backgroundColor:'#fff',
                                borderRadius: 5,
                                padding: 10
                            }]}>
                                {
                                    this.state.isChild
                                    ?
                                        <ChildModal changeAge={(text, val)=>this._changeAge(text, val)} {...this.state}/>
                                    :
                                        <UserModal showToast={(data) => {
                                            this.refs.toast.show(data)
                                        }} ageLimitChange={(text)=>this._ageLimitChange(text)} {...this.state}/>
                                }

                            </View>
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
    },
    time_roll:{
        width:20,
        height:20,
        borderRadius: 10,
        borderWidth:1,
        borderColor:'#f5f5f5'
    },
    time_txt:{
        color:'#333',
        marginLeft: 10,
        fontWeight: "bold"
    },
    bg_shadow:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        backgroundColor:'rgba(255,255,255,.5)'
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    longDay: state.steps.longDay,
    difference: state.steps.difference,
    activity_id: state.steps.activity_id,
    token: state.token.token
});

const mapDispatchToProps = dispatch => ({
    changeLongDay: longday => dispatch(action.changeLongDay(longday)),
    changeDifference: arr => dispatch(action.changeDifference(arr)),
    changeStatus: arr => dispatch(action.changeStatus(arr)),
    changeDateValue: arr => dispatch(action.changeDateValue(arr)),
    changeDiscount: status => dispatch(action.changeDiscount(status)),
    changeAdultStandard: data => dispatch(action.changeAdultStandard(data)),
    changeChildStandard: data => dispatch(action.changeChildStandard(data)),
    changeParentChildPackage: data => dispatch(action.changeParentChildPackage(data)),
    changeCustomePackage: data => dispatch(action.changeCustomePackage(data)),
    changeNewDate: arr => dispatch(action.changeNewDate(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Time)
class ChildModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            minAge: this.props.minAge,
            maxAge: this.props.maxAge
        }
    }
    componentDidMount(){
        console.log('minAge',this.state.minAge)
    }

    changeAge(text, val) {
        if(val === 'min') {
            this.setState({
                minAge:text
            },() => {
                this.props.changeAge(text, val)
            })
        }else {
            this.setState({
                maxAge:text
            },() => {
                this.props.changeAge(text, val)
            })
        }

    }
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                flex: 1
            }]}>
                <View style={[CommonStyle.spaceRow,{
                    width:'100%',
                }]}>
                    <Text style={{
                        color:'#333'
                    }}>儿童最低年龄:</Text>
                    <TextInput
                        placeholder="请输入最低年龄"
                        onChangeText={(text)=>this.changeAge(text, 'min')}
                        defaultValue={this.state.minAge?JSON.stringify(parseFloat(this.state.minAge)):''}
                        keyboardType='numeric'
                        style={{
                        height:40,
                        borderBottomWidth: 1,
                        borderBottomColor:'#f5f5f5',
                        width:width*0.94-120
                    }}/>
                </View>
                <View style={[CommonStyle.spaceRow,{
                    width:'100%',
                    marginTop: 15
                }]}>
                    <Text style={{
                        color:'#333'
                    }}>儿童最大年龄:</Text>
                    <TextInput
                        placeholder="请输入最大年龄"
                        keyboardType='numeric'
                        onChangeText={(text)=>this.changeAge(text, 'max')}
                        defaultValue={this.state.maxAge?JSON.stringify(parseFloat(this.state.maxAge)):''}
                        style={{
                            height:40,
                            borderBottomWidth: 1,
                            borderBottomColor:'#f5f5f5',
                            width:width*0.94-120
                        }}/>
                </View>
            </View>
        )
    }
}

class UserModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ageLimit: this.props.ageLimit
        }
    }
    changeAge(text) {
        if(text>this.props.minAge) {
            this.setState({
                ageLimit: this.props.minAge
            },() => {
                this.props.ageLimitChange(this.state.ageLimit)
                this.props.showToast('参与者年龄下限不能大于儿童价年龄下限')
            })
        }else{
            this.setState({
                ageLimit: text
            },() => {
                this.props.ageLimitChange(text)
            })
        }

    }
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                flex: 1
            }]}>
                <View style={[CommonStyle.spaceRow,{
                    width:'100%',
                }]}>
                    <Text style={{
                        color:'#333'
                    }}>参与者年龄下限:</Text>
                    <TextInput
                        placeholder="参与者年龄下限"
                        onChangeText={(text)=>this.changeAge(text)}
                        defaultValue={this.state.ageLimit?JSON.stringify(parseFloat(this.state.ageLimit)):''}
                        keyboardType='numeric'
                        style={{
                            height:40,
                            borderBottomWidth: 1,
                            borderBottomColor:'#f5f5f5',
                            width:width*0.94-135
                        }}/>
                </View>
            </View>
        )
    }
}

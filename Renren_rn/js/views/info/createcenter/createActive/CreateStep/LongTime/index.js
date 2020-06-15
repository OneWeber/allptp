import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Switch,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import CreateHeader from '../../../../../../common/CreateHeader';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import TimePeriodPicker from '../../../../../../model/TimePeriodPicker';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import action from '../../../../../../action'
import Toast, {DURATION} from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
import {objRemoveDuplicated} from '../../../../../../utils/auth'
import CalendarDate from './CalendarDate';
import {func} from 'prop-types';
const {width, height} = Dimensions.get('window');
class LongTime extends Component{
    constructor(props) {
        super(props);
        this.state = {
            trueSwitchIsOn: this.props.hasDiscount,
            timeIndex: this.props.navigation.state.params.timeIndex,
            beginTime:'',
            endTime: '',
            isEnd:false,
            isCancel: true,
            title:'选择多天体验开始日期',
            year:'',
            month:'',
            day:'',
            limitMonth: '',
            limitDay: '',
            limitYear: '',
            isTimeEnd: false,
            beginPeriodTime: '',
            endPeriodTime: '',
            hour:'',
            minutes: '',
            limitHour: '',
            limitMinutes: '',
            people: '',
            date: this.props.newDate,
            price_origin: '',
            price_discount: '',
            price: '',
            kids_price_origin: '',
            kids_price_discount: '',
            kids_price: '',
            combine: '',
            begin_date: '',
            end_date: '',
            singleTime:[],
            singleIndex: '',
        }
        this.isEdit = this.props.navigation.state.params.isEdit?this.props.navigation.state.params.isEdit:false;
        this.slotInfo = this.props.navigation.state.params.slotInfo?this.props.navigation.state.params.slotInfo:null;
    }
    componentDidMount(){
        if(this.isEdit) {
            console.log()
            const {changeAdultStandard, changeChildStandard, changeParentChildPackage, changeCustomePackage,changeDiscount} = this.props;
            this.setState({
                begin_date: this.state.timeIndex?this.slotInfo.date:this.slotInfo.begin_date,
                end_date: this.state.timeIndex?this.slotInfo.date:this.slotInfo.end_date,
                beginPeriodTime: this.slotInfo.begin_time,
                endPeriodTime: this.slotInfo.end_time,
                people: JSON.stringify(this.slotInfo.max_person_num),
                trueSwitchIsOn: this.slotInfo.is_discount?true:false,
            },() => {
                changeAdultStandard({
                    standard: this.slotInfo.price_discount,
                    originalPrice: this.slotInfo.price_origin
                });
                changeChildStandard({
                    standard: this.slotInfo.kids_price_discount,
                    originalPrice: this.slotInfo.kids_price_origin
                });
                //changeDiscount(this.slotInfo.is_discount)
                let combineQ = [];
                let combineZ = [];
                for(let i=0;i<this.slotInfo.combine.length; i++) {
                    if(this.slotInfo.combine[i].type===1) {
                        combineQ.push(this.slotInfo.combine[i])
                    }else{
                        combineZ.push(this.slotInfo.combine[i])
                    }
                }
                changeParentChildPackage(combineQ);
                changeCustomePackage(combineZ);
            })
        }
    }

    _confirmTime(hour, minutes){
        const {singleTime, timeIndex, singleIndex} = this.state;
        let data = singleTime;
        if(!this.state.isTimeEnd) {
            let begin = (hour.split('').length===1?'0'+ hour:hour) + ':' + (minutes.split('').length===1?'0'+ minutes:minutes);
            this.setState({
                beginPeriodTime: begin
            },() => {
                console.log()
                if(timeIndex&&!this.isEdit) {
                    if(singleIndex) {
                        console.log(11111)
                        data[singleIndex-1].begin_time = begin
                    }else{
                        console.log(13131313)
                        data.push({
                            begin_time: begin,
                            end_time: ''
                        })
                    }
                    this.setState({
                        singleTime: data
                    })
                }
            })
        } else {
            let end = (hour.split('').length===1?'0'+ hour:hour) + ':' + (minutes.split('').length===1?'0'+ minutes:minutes);
            this.setState({
                endPeriodTime: end
            },() => {
                if(timeIndex&&!this.isEdit){
                    console.log(2222)
                    data[singleIndex-1].end_time = end;
                    this.setState({
                        singleTime: data,
                        isTimeEnd: false
                    })
                }
            })
        }
        this.setState({
            singleIndex: ''
        })

    }
    delSingleTime(index) {
        const {singleTime} = this.state;
        let data = singleTime;
        data.splice(index, 1);
        this.setState({
            singleTime: data
        })
    }
    clickBeginPeriod(val){
        const {beginPeriodTime, singleTime} = this.state;
        if(val&&!this.isEdit) {
            this.setState({
                singleIndex: val
            })
            this.setState({
                isTimeEnd: false,
                hour: singleTime[val-1].begin_time.split(':')[0]?JSON.stringify(parseFloat(singleTime[val-1].begin_time.split(':')[0])):'0',
                minutes: singleTime[val-1].begin_time.split(':')[1]?JSON.stringify(parseFloat(singleTime[val-1].begin_time.split(':')[1])):'0',
                limitHour: '-1',
                limitMinutes: '-1'
            },() => {
                this.timePicker.open(true)
            })
        }else{
            this.setState({
                isTimeEnd: false,
                hour: beginPeriodTime.split(':')[0]?JSON.stringify(parseFloat(beginPeriodTime.split(':')[0])):'0',
                minutes: beginPeriodTime.split(':')[1]?JSON.stringify(parseFloat(beginPeriodTime.split(':')[1])):'0',
                limitHour: '-1',
                limitMinutes: '-1'
            },() => {
                this.timePicker.open(true)
            })
        }

    }
    clickEndPeriod(val){
        const {endPeriodTime, singleTime} = this.state;
        if(val&&!this.isEdit) {
            this.setState({
                singleIndex: val
            })
            this.setState({
                isTimeEnd: true,
                hour: singleTime[val-1].end_time.split(':')[0]?JSON.stringify(parseFloat(singleTime[val-1].end_time.split(':')[0])):'0',
                minutes: singleTime[val-1].end_time.split(':')[1]?JSON.stringify(parseFloat(singleTime[val-1].end_time.split(':')[1])):'0',
                limitHour: '-1',
                limitMinutes: '-1',
            },() => {
                this.timePicker.open(true)
            })
        }else{
            this.setState({
                isTimeEnd: true,
                hour: endPeriodTime.split(':')[0]?JSON.stringify(parseFloat(endPeriodTime.split(':')[0])):'0',
                minutes: endPeriodTime.split(':')[1]?JSON.stringify(parseFloat(endPeriodTime.split(':')[1])):'0',
                limitHour: this.state.beginPeriodTime.split(':')[0],
                limitMinutes: this.state.beginPeriodTime.split(':')[1],
            },() => {
                this.timePicker.open(true)
            })
        }

    }
    goStandard(role, val){
        if(val) {
            let _this = this;
            NavigatorUtils.goPage({
                role: role,
                isEdit: true,
                info: {
                    trueSwitchIsOn: this.slotInfo.is_discount,
                    price_origin: this.slotInfo.price_origin,
                    price_discount: this.slotInfo.price_discount,
                    price: this.slotInfo.price,
                    kids_price_origin: this.slotInfo.kids_price_origin,
                    kids_price_discount: this.slotInfo.kids_price_discount,
                    kids_price: this.slotInfo.kids_price,
                },
                slotInfo: this.slotInfo,
                timeIndex: this.state.timeIndex,
            }, 'EditStandard')
        }else{
            NavigatorUtils.goPage({role: role}, 'EditStandard')
        }
    }
    changeSwitch(val) {
        const {changeDiscount, changeAdultStandard, changeChildStandard, adultStandard, childStandard} = this.props
        this.setState({
            trueSwitchIsOn: val?true:false
        },() => {

            changeDiscount(val)
        });
    }
    confirmAdd(){
        const {beginPeriodTime, endPeriodTime, people} = this.state;
        if(this.props.newDate.length===0 || !beginPeriodTime || !endPeriodTime) {
            this.refs.toast.show('请选择完整的体验日期和起止时间');
        }else if(!people) {
            this.refs.toast.show('请填写体验人数');
        }else if((this.props.adultStandard.originalPrice===null||this.props.adultStandard.originalPrice==='') && (this.props.childStandard.originalPrice===null||this.props.childStandard.originalPrice==='')) {
            this.refs.toast.show('需至少有一个价格');
        }else {
            this.saveLongTime();
        }
    }
    saveChange() {
        const {activity_id} = this.props;
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("version",'2.0');
        formData.append("activity_id",activity_id);
        formData.append("slot_id",this.slotInfo.slot_id);
        formData.append('begin_date', this.state.begin_date);
        formData.append('end_date', this.state.end_date);
        formData.append('begin_time', this.state.beginPeriodTime);
        formData.append('end_time', this.state.endPeriodTime);
        formData.append('max_person_num', this.state.people);
        formData.append('is_discount', this.state.trueSwitchIsOn?1:0);
        formData.append('price_origin', this.props.adultStandard.originalPrice);
        formData.append('price_discount', this.state.trueSwitchIsOn?this.props.adultStandard.standard:10);
        formData.append('price',this.props.adultStandard.originalPrice*((this.state.trueSwitchIsOn?this.props.adultStandard.standard:10)/10));
        formData.append('kids_price_origin', this.props.childStandard.originalPrice);
        formData.append('kids_price_discount', this.state.trueSwitchIsOn?this.props.childStandard.standard:10);
        formData.append('kids_price', this.props.childStandard.originalPrice*((this.state.trueSwitchIsOn?this.props.childStandard.standard:10)/10));
        formData.append('combine', JSON.stringify(this.props.parenChildPackage.concat(this.props.customePackage)));
        console.log('has', formData)
        Fetch.post(NewHttp+'SlotEditAllTwo', formData).then(res => {
            if(res.code === 1) {
                NavigatorUtils.backToUp(this.props, true)
            }
        })
    }
    saveLongTime() {
        const {activity_id, token, changeAdultStandard, changeChildStandard, changeParentChildPackage,changeCustomePackage,changeDateValue, changeNewDate} = this.props;
        const {beginPeriodTime, endPeriodTime, people, trueSwitchIsOn} = this.state;
        let data = this.props.newDate;
        data=objRemoveDuplicated(data);
        console.log('data', data)
        let single = this.state.singleTime;
        single=objRemoveDuplicated(single)
        let formData = new FormData();
        formData.append("token",token);
        formData.append("version",'2.0');
        formData.append("activity_id",activity_id);
        formData.append("date",JSON.stringify(data));
        formData.append("time",this.state.timeIndex?JSON.stringify(single):JSON.stringify([{begin_time:beginPeriodTime, end_time:endPeriodTime}]));
        formData.append("max_person_num",people);
        formData.append("is_discount",this.state.trueSwitchIsOn?1:0);
        formData.append("price_origin",this.props.adultStandard.originalPrice);
        formData.append("price_discount",this.props.adultStandard.standard);
        formData.append("price",this.props.adultStandard.originalPrice*(this.props.adultStandard.standard/10));
        formData.append("kids_price_origin",this.props.childStandard.originalPrice);
        formData.append("kids_price_discount", this.props.childStandard.standard);
        formData.append("kids_price",this.props.childStandard.originalPrice*(this.props.childStandard.standard/10));
        formData.append("combine",JSON.stringify(this.props.parenChildPackage.concat(this.props.customePackage)));
        Fetch.post(NewHttp+'SlotAddAllTwo', formData).then(res => {
            if(res.code === 1) {
                changeAdultStandard({
                    standard: 0,
                    originalPrice: ''
                });
                changeChildStandard({
                    standard: 0,
                    originalPrice: ''
                });
                changeParentChildPackage([]);
                changeCustomePackage([]);
                changeDateValue([]);
                changeNewDate([]);
                NavigatorUtils.backToUp(this.props, true)
            }
        })
    }
    EditPcp(data, index) {
        NavigatorUtils.goPage({isEdit: true, data: data, index: index, timeIndex:this.state.timeIndex}, 'ParentChildPackage')
    }
    EditCus(data, index) {//CustomPackage
        NavigatorUtils.goPage({isEdit: true, data: data, index: index, timeIndex:this.state.timeIndex}, 'CustomPackage')
    }
    DelPcp(index, parenChildPackage) {
        const {changeParentChildPackage} = this.props;
        let data = parenChildPackage;
        let datas = []
        data.splice(index, 1)
        datas = data;
        changeParentChildPackage(datas)
        NavigatorUtils.goPage({}, 'LongTime')
    }
    DelCus(index) {
        const {customePackage, changeCustomePackage} = this.props;
        let data = customePackage;
        let datas = []
        data.splice(index, 1);
        datas = data;
        changeCustomePackage(datas);
        NavigatorUtils.goPage({}, 'LongTime')
    }
    render(){
        const {theme, parenChildPackage, customePackage} = this.props;
        const {beginTime, endTime, timeIndex} = this.state;
        return (
            <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <CreateHeader title={this.isEdit?timeIndex?'修改单天体验':'修改多天体验':timeIndex?'添加单天体验':'添加多天体验'} navigation={this.props.navigation}/>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <View style={[CommonStyle.spaceRow]}>
                                    <Text style={styles.title_text}>体验日期</Text>
                                    {
                                        !this.isEdit
                                        ?
                                        this.props.newDate.length>0
                                        ?
                                            this.props.newDate.length===1
                                            ?
                                                <Text style={{
                                                    color:'#333'
                                                }}
                                                onPress={()=>{
                                                  NavigatorUtils.goPage({timeIndex: this.state.timeIndex}, 'CalendarDate')
                                                }}
                                                >{this.props.newDate[0].begin_date} - {this.props.newDate[0].end_date}</Text>
                                            :
                                                <Text style={{
                                                    color:'#333'
                                                }}
                                                  onPress={()=>{
                                                      NavigatorUtils.goPage({timeIndex: this.state.timeIndex}, 'CalendarDate')
                                                  }}
                                                >已选{this.props.newDate.length}个日期</Text>
                                        :
                                            <TouchableOpacity
                                                style={CommonStyle.flexEnd}
                                                onPress={()=>{
                                                    NavigatorUtils.goPage({timeIndex: this.state.timeIndex}, 'CalendarDate')
                                                }}
                                            >
                                                <Text style={{color:'#C6C6C6'}}>选择{this.state.timeIndex?'单':'多'}天日期</Text>

                                                <AntDesign
                                                    name={'right'}
                                                    size={14}
                                                    style={{color:'#C6C6C6'}}
                                                />
                                            </TouchableOpacity>
                                        :
                                            <Text style={{
                                                color:'#333'
                                            }}>{this.state.begin_date} -- {this.state.end_date}</Text>
                                    }

                                </View>
                                <View style={[CommonStyle.spaceRow,{marginTop: 35}]}>
                                    <Text style={styles.title_text}>体验起止时间</Text>
                                    {
                                        !this.isEdit
                                            ?
                                        (!this.state.beginPeriodTime && !this.state.endPeriodTime) || this.state.timeIndex
                                        ?
                                            <TouchableOpacity
                                                style={[CommonStyle.flexCenter,styles.select_btn]}
                                                onPress={()=>{this.timePicker.open()}}
                                            >
                                                <Text style={{
                                                    color:theme,
                                                    fontWeight:'bold',
                                                    fontSize: 13
                                                }}>添加</Text>
                                            </TouchableOpacity>
                                        :
                                        <Text style={{color:'#C6C6C6'}}>
                                            <Text style={{
                                                color:this.state.beginPeriodTime?theme:'#c6c6c6'
                                            }} onPress={()=>{this.clickBeginPeriod()}}>
                                                {this.state.beginPeriodTime?this.state.beginPeriodTime:'开始时间'}
                                            </Text> -- <Text style={{
                                                color:this.state.endPeriodTime?theme:'#c6c6c6'
                                            }} onPress={()=>{this.clickEndPeriod()}}>
                                                {this.state.endPeriodTime?this.state.endPeriodTime:'结束时间'}
                                            </Text>
                                        </Text>
                                        :
                                            <Text style={{color:'#C6C6C6'}}>
                                                <Text style={{
                                                    color:this.state.beginPeriodTime?theme:'#c6c6c6'
                                                }} onPress={()=>{this.clickBeginPeriod()}}>
                                                    {this.state.beginPeriodTime?this.state.beginPeriodTime:'开始时间'}
                                                </Text> -- <Text style={{
                                                color:this.state.endPeriodTime?theme:'#c6c6c6'
                                            }} onPress={()=>{this.clickEndPeriod()}}>
                                                {this.state.endPeriodTime?this.state.endPeriodTime:'结束时间'}
                                            </Text>
                                            </Text>
                                    }
                                </View>
                                {
                                    this.state.singleTime.length>0&&!this.isEdit
                                    ?
                                        <View style={{marginTop: 10}}>
                                            <Text style={{color:'#666'}}>已添加单天日期</Text>
                                            {
                                                this.state.singleTime.map((item, index) => {
                                                    return <View key={index} style={[CommonStyle.spaceRow,{
                                                        marginTop: 10
                                                    }]}>
                                                        <View>
                                                            <Text style={{
                                                                color:'#333'
                                                            }}>
                                                                <Text onPress={()=>{
                                                                    this.clickBeginPeriod(index+1)
                                                                }}>{item.begin_time}</Text> -- <Text onPress={()=>{
                                                                    this.clickEndPeriod(index+1)
                                                            }}>{item.end_time?item.end_time:'请选择结束时间'}</Text>
                                                            </Text>
                                                        </View>
                                                        <Text style={{color:'#666'}} onPress={()=>{
                                                            this.delSingleTime(index)
                                                        }}>删除</Text>
                                                    </View>
                                                })
                                            }
                                        </View>
                                    :
                                        null
                                }
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
                                <Text style={[styles.title_text]}>体验人数</Text>
                                <View style={[CommonStyle.flexEnd]}>
                                    <TextInput
                                        onChangeText={(text)=>this.setState({people:text})}
                                        keyboardType={"number-pad"}
                                        defaultValue={this.state.people}
                                        style={{
                                            width:170,
                                            height:64,
                                            backgroundColor: '#fff',
                                            textAlign:'right',
                                            marginRight: 3,
                                            color:'#333'
                                        }}
                                    />
                                    <Text style={{color:'#C6C6C6'}}>人</Text>
                                </View>
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
                                <Text style={[styles.title_text]}>设置折扣</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9}] }}
                                    onTintColor={theme}
                                    onValueChange={(value) => this.changeSwitch(value)}
                                    value={this.state.trueSwitchIsOn} />
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}>体验价格</Text>
                                {
                                    this.state.trueSwitchIsOn && this.props.adultStandard.originalPrice
                                    ?
                                        <View>
                                            <Text style={{color:'#333',fontWeight: "bold",marginTop: 20}}>标准</Text>
                                            <View style={[CommonStyle.spaceRow,{
                                                height: 40,
                                                paddingLeft: 11,
                                                paddingRight: 11,
                                                backgroundColor: '#F5F7FA',
                                                borderRadius: 5,
                                                marginTop: 20
                                            }]}>
                                                <View style={CommonStyle.flexStart}>
                                                    <Text style={{color:'#333'}}>折扣价</Text>
                                                    <Text style={{
                                                        color:theme,
                                                        marginLeft: 15
                                                    }}>{parseFloat(this.props.adultStandard.standard)}折</Text>
                                                    <Text style={{
                                                        color:theme,
                                                        marginLeft: 15
                                                    }}>¥{(this.props.adultStandard.standard/10)*this.props.adultStandard.originalPrice}/人</Text>
                                                    <OriginalPrice price={this.props.adultStandard.originalPrice}/>
                                                </View>
                                                <Text
                                                    style={{color:'#A4A4A4'}}
                                                    onPress={()=>{this.goStandard('standard', this.isEdit)}}
                                                >编辑</Text>
                                            </View>
                                        </View>
                                    :
                                        <TouchableOpacity
                                            style={[CommonStyle.spaceRow,{marginTop: 26.5}]}
                                            onPress={()=>{this.goStandard('standard', this.isEdit)}}
                                        >
                                            <Text style={styles.title_text}>标准</Text>
                                            <View style={CommonStyle.flexEnd}>
                                                {
                                                    this.props.adultStandard.originalPrice
                                                        ?
                                                        <Text style={{color:theme, marginRight: 3}}>¥{parseFloat(this.props.adultStandard.originalPrice).toFixed(2)}</Text>
                                                        :
                                                        null
                                                }
                                                <AntDesign
                                                    name={'right'}
                                                    size={14}
                                                    style={{color:'#C6C6C6'}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                }
                                {
                                    this.state.trueSwitchIsOn && this.props.childStandard.originalPrice
                                    ?
                                        <View>
                                            <Text style={{color:'#333',fontWeight: "bold",marginTop: 20}}>儿童</Text>
                                            <View style={[CommonStyle.spaceRow,{
                                                height: 40,
                                                paddingLeft: 11,
                                                paddingRight: 11,
                                                backgroundColor: '#F5F7FA',
                                                borderRadius: 5,
                                                marginTop: 20
                                            }]}>
                                                <View style={CommonStyle.flexStart}>
                                                    <Text style={{color:'#333'}}>折扣价</Text>
                                                    <Text style={{
                                                        color:theme,
                                                        marginLeft: 15
                                                    }}>{parseFloat(this.props.childStandard.standard)}折</Text>
                                                    <Text style={{
                                                        color:theme,
                                                        marginLeft: 15
                                                    }}>¥{(this.props.childStandard.standard/10)*this.props.childStandard.originalPrice}/人</Text>
                                                    <OriginalPrice price={this.props.childStandard.originalPrice}/>
                                                </View>
                                                <Text
                                                    style={{color:'#A4A4A4'}}
                                                    onPress={()=>{this.goStandard('child', this.isEdit)}}
                                                >编辑</Text>
                                            </View>
                                        </View>

                                    :
                                        <TouchableOpacity
                                            style={[CommonStyle.spaceRow,{marginTop: 30}]}
                                            onPress={()=>{this.goStandard('child', this.isEdit)}}
                                        >
                                            <Text style={styles.title_text}>儿童</Text>
                                            <View style={CommonStyle.flexEnd}>
                                                {
                                                    this.props.childStandard.originalPrice
                                                        ?
                                                        <Text style={{color:theme, marginRight: 3}}>¥{parseFloat(this.props.childStandard.originalPrice).toFixed(2)}</Text>
                                                        :
                                                        null
                                                }
                                                <AntDesign
                                                    name={'right'}
                                                    size={14}
                                                    style={{color:'#C6C6C6'}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                }

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
                                <Text style={{
                                    color:'#333',
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}>设置套餐</Text>
                                <Text style={{
                                    color:'#666',
                                    fontSize: 13,
                                    marginTop: 10.5
                                }}>套餐价不参与折扣</Text>
                                <View style={[CommonStyle.spaceRow,{marginTop: 20.5}]}>
                                    <Text style={styles.title_text}>亲子价套餐</Text>
                                    <TouchableOpacity
                                        style={[CommonStyle.flexCenter,styles.select_btn]}
                                        onPress={()=>{NavigatorUtils.goPage({
                                            timeIndex: this.state.timeIndex
                                        }, 'ParentChildPackage')}}
                                    >
                                        <Text style={{
                                            color:theme,
                                            fontWeight:'bold',
                                            fontSize: 13
                                        }}>添加</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    parenChildPackage.length > 0
                                    ?
                                        parenChildPackage.map((item, index) => {
                                            return <View key={index} style={[CommonStyle.spaceRow,{
                                                height: 40,
                                                marginTop: index===0?15:10,
                                                backgroundColor: '#f5f7fa',
                                                borderRadius: 3,
                                                paddingLeft:11,
                                                paddingRight: 11
                                            }]}>
                                                <View style={CommonStyle.flexStart}>
                                                    <Text style={{color:'#333',fontWeight: "bold"}}>亲子</Text>
                                                    <Text style={{marginLeft:5,color:'#333'}}>{item.adult}成人{item.kids}儿童</Text>
                                                    <Text style={{color:theme,marginLeft: 20}}>¥{parseFloat(item.price)}</Text>
                                                </View>
                                                <View style={CommonStyle.flexEnd}>
                                                    <Text
                                                        style={{color:'#A4A4A4'}}
                                                        onPress={() => {
                                                            this.EditPcp(item, index)
                                                        }}
                                                    >编辑</Text>
                                                    <Text
                                                        style={{color:'#A4A4A4',marginLeft: 15}}
                                                        onPress={() => {
                                                            this.DelPcp(index, parenChildPackage)
                                                        }}
                                                    >删除</Text>
                                                </View>
                                            </View>
                                        })
                                    :
                                        null
                                }

                                <View style={[CommonStyle.spaceRow,{marginTop: 32.5}]}>
                                    <Text style={styles.title_text}>综合套餐</Text>
                                    <TouchableOpacity
                                        style={[CommonStyle.flexCenter,styles.select_btn]}
                                        onPress={()=>{NavigatorUtils.goPage({
                                            timeIndex: this.state.timeIndex
                                        }, 'CustomPackage')}}
                                    >
                                        <Text style={{
                                            color:theme,
                                            fontWeight:'bold',
                                            fontSize: 13
                                        }}>添加</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    customePackage.length > 0
                                        ?
                                        customePackage.map((item, index) => {
                                            return <View key={index} style={[CommonStyle.spaceRow,{
                                                height: 40,
                                                marginTop: index===0?15:10,
                                                backgroundColor: '#f5f7fa',
                                                borderRadius: 3,
                                                paddingLeft:11,
                                                paddingRight: 11
                                            }]}>
                                                <View style={CommonStyle.flexStart}>
                                                    <Text style={{color:'#333',fontWeight: "bold"}}>{item.name+item.adult}人</Text>
                                                    <Text style={{color:theme,marginLeft: 20}}>¥{parseFloat(item.price)}</Text>
                                                </View>
                                                <View style={CommonStyle.flexEnd}>
                                                    <Text
                                                        style={{color:'#A4A4A4'}}
                                                        onPress={() => {
                                                            this.EditCus(item, index)
                                                        }}
                                                    >编辑</Text>
                                                    <Text
                                                        style={{color:'#A4A4A4',marginLeft: 15}}
                                                        onPress={()=>{
                                                            this.DelCus(index)
                                                        }}
                                                    >删除</Text>
                                                </View>
                                            </View>
                                        })
                                        :
                                        null
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                        {
                            this.isEdit
                            ?
                                <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                    backgroundColor:theme
                                }]}
                                  onPress={()=>{
                                      this.saveChange()
                                  }}
                                >
                                    <Text style={{color:'#fff'}}>保存</Text>
                                </TouchableOpacity>
                            :
                                <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                    backgroundColor:theme
                                }]}
                                      onPress={()=>this.confirmAdd()}
                                >
                                    <Text style={{color:'#fff'}}>确认添加</Text>
                                </TouchableOpacity>
                        }

                    </View>
                </SafeAreaView>
                {/*体验日期选择*/}

                <TimePeriodPicker
                    ref={picker=>this.timePicker=picker}
                    cancel={()=>{}}
                    hour={this.state.hour}
                    minutes={this.state.minutes}
                    limitHour={JSON.stringify(parseFloat(this.state.limitHour))}
                    limitMinutes={JSON.stringify(parseFloat(this.state.limitMinutes))}
                    confirm={(hour, minutes)=>{this._confirmTime(hour, minutes)}}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    title_text:{
        color:'#333',
        fontWeight: 'bold',
        fontSize: 15
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    parenChildPackage: state.steps.parenChildPackage,
    adultStandard: state.steps.adultStandard,
    childStandard: state.steps.childStandard,
    customePackage: state.steps.customePackage,
    hasDiscount: state.steps.hasDiscount,
    longDay: state.steps.longDay,
    activity_id: state.steps.activity_id,
    token: state.token.token,
    dateValue: state.steps.dateValue,
    newDate: state.steps.newDate
})
const mapDispatchToProps = dispatch => ({
    changeDiscount: status => dispatch(action.changeDiscount(status)),
    changeLongDay: data => dispatch(action.changeLongDay(data)),
    changeAdultStandard: data => dispatch(action.changeAdultStandard(data)),
    changeChildStandard: data => dispatch(action.changeChildStandard(data)),
    changeParentChildPackage: data => dispatch(action.changeParentChildPackage(data)),
    changeCustomePackage: data => dispatch(action.changeCustomePackage(data)),
    changeDateValue: arr => dispatch(action.changeDateValue(arr)),
    changeNewDate: arr => dispatch(action.changeNewDate(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(LongTime)

class OriginalPrice extends Component{
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                height:40,
                position:'relative',
                marginLeft: 15
            }]}>
                <Text style={{color:'#A4A4A4'}}>¥{this.props.price}/人</Text>
                <View style={{
                    position: 'absolute',
                    left:0,
                    right:0,
                    height: 1,
                    top: 19.5,
                    backgroundColor: '#A4A4A4'
                }}></View>
            </View>
        )
    }
}

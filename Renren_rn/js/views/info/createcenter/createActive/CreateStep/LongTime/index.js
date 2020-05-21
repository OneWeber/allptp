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
import TimePicker from '../../../../../../model/TimePicker';
import TimePeriodPicker from '../../../../../../model/TimePeriodPicker';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import action from '../../../../../../action'
import Toast, {DURATION} from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
import Modal from 'react-native-modalbox';
import CalendarDate from './Calendar';
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

        }
    }

    clickBegin(){
        const {beginTime} = this.state;
        this.setState({
            isEnd:false,
            isCancel: true,
            title:'选择多天体验开始日期',
            year: beginTime.split('-')[0]?beginTime.split('-')[0]:'',
            month: beginTime.split('-')[1]?beginTime.split('-')[1]:'1',
            day: beginTime.split('-')[2]?beginTime.split('-')[2]:'1',
            limitMonth:'',
            limitDay: '',
            limitYear: ''
        },()=>{
            this.picker.open(true)
        })
    }
    clickEnd(){
        const {endTime} = this.state;
        this.setState({
            isEnd:true,
            isCancel: false,
            title:'选择多天体验结束日期',
            year: endTime.split('-')[0]?endTime.split('-')[0]:'',
            month: endTime.split('-')[1]?endTime.split('-')[1]:'1',
            day: endTime.split('-')[2]?endTime.split('-')[2]:'1',
            limitMonth:this.state.beginTime.split('-')[1],
            limitDay: this.state.beginTime.split('-')[2],
            limitYear:this.state.beginTime.split('-')[0]
        },()=>{
            this.picker.open(true)
        })
    }
    // _confirm(year, month, day){
    //     if(!this.state.isEnd){
    //         let begin = year+'-'+month+'-'+day;
    //         this.setState({
    //             beginTime: begin
    //         })
    //     } else{
    //         let end = year+'-'+month+'-'+day;
    //         this.setState({
    //             endTime: end
    //         })
    //     }
    // }
    // _confirmTime(hour, minutes){
    //     if(!this.state.isTimeEnd) {
    //         let begin = (hour.split('').length===1?'0'+ hour:hour) + ':' + (minutes.split('').length===1?'0'+ minutes:minutes);
    //         this.setState({
    //             beginPeriodTime: begin
    //         })
    //     } else {
    //         let end = (hour.split('').length===1?'0'+ hour:hour) + ':' + (minutes.split('').length===1?'0'+ minutes:minutes);
    //         this.setState({
    //             endPeriodTime: end
    //         })
    //     }
    // }
    clickBeginPeriod(){
        const {beginPeriodTime} = this.state;
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
    clickEndPeriod(){
        const {endPeriodTime} = this.state;
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
    goStandard(role){
        NavigatorUtils.goPage({role: role}, 'EditStandard')
    }
    changeSwitch(val) {
        const {changeDiscount} = this.props
        this.setState({
            trueSwitchIsOn: val
        },() => {
            changeDiscount(val)
        });
    }
    confirmAdd(){
        const {beginTime, endTime, beginPeriodTime, endPeriodTime, people} = this.state;
        if(!beginTime || !endTime || !beginPeriodTime || !endPeriodTime) {
            this.refs.toast.show('请选择完整的体验日期和起止时间');
        }else if(!people) {
            this.refs.toast.show('请填写体验人数');
        }else if(this.props.adultStandard.originalPrice===null||this.props.adultStandard.originalPrice==='') {
            this.refs.toast.show('请填写体验的标准价格');
        }else if(this.props.childStandard.originalPrice===null||this.props.childStandard.originalPrice==='') {
            this.refs.toast.show('请填写体验的儿童价格');
        }else {
            this.saveLongTime();
        }
    }
    saveLongTime() {
        const {activity_id, token, changeAdultStandard, changeChildStandard, changeParentChildPackage,changeCustomePackage} = this.props;
        const {beginTime, endTime, beginPeriodTime, endPeriodTime, people, trueSwitchIsOn} = this.state;
        let formData = new FormData();
        formData.append("token",token);
        formData.append("version",'2.0');
        formData.append("activity_id",activity_id);
        formData.append("date",JSON.stringify([{begin_date: beginTime, end_date: endTime}]));
        formData.append("time",JSON.stringify([{begin_time:beginPeriodTime, end_time:endPeriodTime}]));
        formData.append("max_person_num",people);
        formData.append("is_discount",trueSwitchIsOn);
        formData.append("price_origin",this.props.adultStandard.originalPrice);
        formData.append("price_discount",this.props.adultStandard.standard);
        formData.append("price",this.props.adultStandard.originalPrice*(this.props.adultStandard.standard/10));
        formData.append("kids_price_origin",this.props.childStandard.originalPrice);
        formData.append("kids_price_discount",this.props.childStandard.standard);
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
                NavigatorUtils.backToUp(this.props, true)
            }else{
                console.log(res.msg)
            }
        })

    }
    render(){
        const {theme, parenChildPackage, customePackage} = this.props;
        const {beginTime, endTime} = this.state;
        return (
            <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <CreateHeader title={'添加多天体验'} navigation={this.props.navigation}/>
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
                                    <TouchableOpacity
                                        style={CommonStyle.flexEnd}
                                        onPress={()=>{this.refs.calendar.open()}}
                                    >
                                        {/*
                                            {
                                            !beginTime && !endTime
                                            ?
                                                <Text style={{color:'#C6C6C6'}}>选择日期</Text>
                                            :
                                                <Text style={{color:'#C6C6C6'}}>
                                                    <Text style={{
                                                        color:beginTime?theme:'#c6c6c6'
                                                    }} onPress={()=>{
                                                        this.clickBegin()
                                                    }}>{beginTime?beginTime:'开始日期'}</Text> -- <Text style={{
                                                    color:endTime?theme:'#c6c6c6'
                                                }} onPress={()=>{
                                                        this.clickEnd()
                                                }}>{endTime?endTime:'结束日期'}</Text>
                                                </Text>
                                        }
                                        */}
                                        <Text style={{color:'#C6C6C6'}}>选择日期</Text>

                                        <AntDesign
                                            name={'right'}
                                            size={14}
                                            style={{color:'#C6C6C6'}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[CommonStyle.spaceRow,{marginTop: 35}]}>
                                    <Text style={styles.title_text}>体验起止时间</Text>
                                    {
                                        !this.state.beginPeriodTime && !this.state.endPeriodTime
                                        ?
                                            <TouchableOpacity
                                                style={[CommonStyle.flexCenter,styles.select_btn]}
                                                onPress={()=>this.timePicker.open()}
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
                                    }

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
                                    this.props.adultStandard.standard!=10 && this.props.adultStandard.standard!=0
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
                                                    }}>{this.props.adultStandard.standard}折</Text>
                                                    <Text style={{
                                                        color:theme,
                                                        marginLeft: 15
                                                    }}>¥{(this.props.adultStandard.standard/10)*this.props.adultStandard.originalPrice}/人</Text>
                                                    <OriginalPrice price={this.props.adultStandard.originalPrice}/>
                                                </View>
                                                <Text style={{color:'#A4A4A4'}}>编辑</Text>
                                            </View>
                                        </View>
                                    :
                                        <TouchableOpacity
                                            style={[CommonStyle.spaceRow,{marginTop: 26.5}]}
                                            onPress={()=>{this.goStandard('standard')}}
                                        >
                                            <Text style={styles.title_text}>标准</Text>
                                            <View style={CommonStyle.flexEnd}>
                                                {
                                                    this.props.adultStandard.originalPrice
                                                        ?
                                                        <Text style={{color:theme, marginRight: 3}}>¥{this.props.adultStandard.originalPrice}</Text>
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
                                    this.props.childStandard.standard!=10&&this.props.childStandard.standard!=0
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
                                                    }}>{this.props.childStandard.standard}折</Text>
                                                    <Text style={{
                                                        color:theme,
                                                        marginLeft: 15
                                                    }}>¥{(this.props.childStandard.standard/10)*this.props.childStandard.originalPrice}/人</Text>
                                                    <OriginalPrice price={this.props.childStandard.originalPrice}/>
                                                </View>
                                                <Text style={{color:'#A4A4A4'}}>编辑</Text>
                                            </View>
                                        </View>

                                    :
                                        <TouchableOpacity
                                            style={[CommonStyle.spaceRow,{marginTop: 30}]}
                                            onPress={()=>{this.goStandard('child')}}
                                        >
                                            <Text style={styles.title_text}>儿童</Text>
                                            <View style={CommonStyle.flexEnd}>
                                                {
                                                    this.props.childStandard.originalPrice
                                                        ?
                                                        <Text style={{color:theme, marginRight: 3}}>¥{this.props.childStandard.originalPrice}</Text>
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
                                        onPress={()=>{NavigatorUtils.goPage({}, 'ParentChildPackage')}}
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
                                                    <Text style={{color:theme,marginLeft: 20}}>¥{item.price}</Text>
                                                </View>
                                                <View style={CommonStyle.flexEnd}>
                                                    <Text style={{color:'#A4A4A4'}}>编辑</Text>
                                                    <Text style={{color:'#A4A4A4',marginLeft: 15}}>删除</Text>
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
                                        onPress={()=>{NavigatorUtils.goPage({}, 'CustomPackage')}}
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
                                                    <Text style={{color:theme,marginLeft: 20}}>¥{item.price}</Text>
                                                </View>
                                                <View style={CommonStyle.flexEnd}>
                                                    <Text style={{color:'#A4A4A4'}}>编辑</Text>
                                                    <Text style={{color:'#A4A4A4',marginLeft: 15}}>删除</Text>
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
                        <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                            backgroundColor:theme
                        }]}
                            onPress={()=>this.confirmAdd()}
                        >
                            <Text style={{color:'#fff'}}>确认添加</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                {/*体验日期选择*/}
                {/*
                <TimePicker
                    ref={picker=>this.picker=picker}
                    cancel={()=>{}}
                    year={this.state.year}
                    month={this.state.month}
                    day={this.state.day}
                    limitMonth={this.state.limitMonth}
                    limitDay={this.state.limitDay}
                    limitYear={this.state.limitYear}
                    title={this.state.title}
                    confirm={(year, month, day) => {this._confirm(year, month, day)}}
                />
                <TimePeriodPicker
                    ref={picker=>this.timePicker=picker}
                    cancel={()=>{}}
                    hour={this.state.hour}
                    minutes={this.state.minutes}
                    limitHour={JSON.stringify(parseFloat(this.state.limitHour))}
                    limitMinutes={JSON.stringify(parseFloat(this.state.limitMinutes))}
                    confirm={(hour, minutes)=>{this._confirmTime(hour, minutes)}}
                />
                */}
                <Modal
                    style={{height:height,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"calendar"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        width: '100%',
                        height: height,
                        backgroundColor: '#fff'
                    }}>
                        <CalendarDate
                            timeIndex={this.state.timeIndex}
                            closeCalendar={()=>{
                                this.refs.calendar.close()
                            }}
                        />
                    </View>
                </Modal>
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
    token: state.token.token
})
const mapDispatchToProps = dispatch => ({
    changeDiscount: status => dispatch(action.changeDiscount(status)),
    changeLongDay: data => dispatch(action.changeLongDay(data)),
    changeAdultStandard: data => dispatch(action.changeAdultStandard(data)),
    changeChildStandard: data => dispatch(action.changeChildStandard(data)),
    changeParentChildPackage: data => dispatch(action.changeParentChildPackage(data)),
    changeCustomePackage: data => dispatch(action.changeCustomePackage(data))
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

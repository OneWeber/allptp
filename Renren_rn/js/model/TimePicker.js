import React,{Component} from 'react';
import {StyleSheet, View, Text, Dimensions,Picker,PickerIOS } from 'react-native';
import Modal from 'react-native-modalbox';
import CommonStyle from '../../assets/css/Common_css';
const {width, height} = Dimensions.get('window');
const PickerItemIOS = PickerIOS.Item;
export default class TimePicker extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nYear: '',
            yearList: [],
            nMonth: '1',
            monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
            nDay: '1',
            dayList: [],
            yearIndex: 0
        }
    }
    static defaultProps = {
        isCancel: true,
        title: '选择时间段',
        year: '',
        month:'1',
        day: '1',
        limitMonth:'',
        limitDay: ''
    }
    componentDidMount(){
        this.initYear();
    }
    open(val){
        if(val) {
            if(this.props.limitDay&&this.props.limitYear==this.state.nYear&&this.props.limitMonth==this.state.nMonth){
                this.spliceDay()
            }
            if(this.props.limitDay && (this.props.year>this.props.limitYear || this.props.month>this.props.limitMonth)) {
                this.initDay(this.state.nYear, this.state.nMonth, true);
            }
            if(this.props.limitMonth&&this.props.limitYear==this.state.nYear){
                this.spliceMonth()
            }

            if(!this.props.limitDay && !this.props.limitMonth){
                this.initDay(this.state.nYear, this.state.nMonth)
                this.setState({
                    nDay: this.props.day?this.props.day:this.state.nDay,
                    monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
                },()=>{
                    this.initDay(this.state.nYear, this.state.nMonth)
                })
            }
            this.setState({
                nYear: this.props.year?this.props.year:this.state.nYear,
                nMonth: this.props.month?this.props.month:this.state.nMonth,
                nDay: this.props.day?this.props.day:this.state.nDay,
            })
        }
        this.refs.picker.open()
    }
    spliceDay(){
        let day = this.state.dayList;
        if(day[0] < this.props.limitDay) {
            day.splice(0, parseFloat(this.props.limitDay) - 1)
        }
        this.setState({
            dayList: day,
            //nDay: this.props.limitDay>=this.state.nDay?day[0]:this.state.nDay
        })
    }
    spliceMonth(){
        let month = this.state.monthList;
        if(month[0] < this.props.limitMonth){
            month.splice(0, parseFloat(this.props.limitMonth) - 1);
        }
        this.setState({
            monthList: month,
            nMonth: this.props.limitMonth>=this.state.nMonth?month[0]:this.state.nMonth,
        })
    }
    initYear(){
        let nowYear = new Date().getFullYear();
        let yearArr = [];
        yearArr.push(nowYear)
        this.setState({
            nYear: nowYear
        },() => {
            for(let i=0; i<5; i++){
                nowYear ++;
                yearArr.push(nowYear)
            }
            this.setState({
                yearList: yearArr
            },() => {
                this.initDay(this.state.nYear, this.state.nMonth)
            })
        })
    }
    changeYear(val){ //改变年份
        this.setState({
            nYear: val
        },() => {
            if(this.props.limitYear&&this.state.nYear==this.props.limitYear){
                this.spliceDay();
                this.spliceMonth();
            } else {
                this.initDay(this.state.nYear, this.state.nMonth)
                this.setState({
                    monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
                    nMonth:'1',
                    nDay: '1'
                })
            }

        })
    }
    changeMonth(val){ //改变月份
        this.setState({
            nMonth: val
        },() => {
            if(this.props.limitYear==this.state.nYear&&this.props.limitMonth==this.state.nMonth){
                this.spliceDay();
            }else {
                this.initDay(this.state.nYear, this.state.nMonth)

            }

        })
    }
    changeDay(val){ //改变日期
        this.setState({
            nDay: val
        })
    }
    initDay(year, month,status){
        let list = this.getDaysOfMonth(year, month);
        let arr = []
        for (let i=0;i<list;i++){
            arr.push(i+1)
        }
        this.setState({
            dayList: arr
        },()=>{
            if(status){
                this.setState({
                    nDay: this.props.limitDay>=this.state.nDay?arr[0]:this.state.nDay
                })
            }
        })
    }
    getDaysOfMonth = (year, month) => {//获取当月有多少天
        var day = new Date(year, month, 0)
        var dayCount = day.getDate()
        return dayCount
    }
    _cancel(){
        this.refs.picker.close();
        this.props.cancel()
    }
    _confirm(){
        this.refs.picker.close();
        this.props.confirm(this.state.nYear, this.state.nMonth,this.state.nDay)
    }
    render(){
        const {yearList, nYear, monthList, nMonth, nDay, dayList} = this.state;
        const {isCancel} = this.props
        return(
            <View style={{flex: 1}}>
                <Modal
                    style={{height:240,width:width,backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"picker"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,.3)'}
                    swipeToClose={false}
                    entry={'bottom'}
                    backdropPressToClose={false}
                    coverScreen={true}>
                    <View style={{width:'100%',height:240,backgroundColor: "#fff",borderRadius: 5}}>
                        <View style={{
                            height:40,
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height: 40}]}>
                                <Text style={{
                                    color:'#666',
                                    fontSize: 16
                                }} onPress={()=>this._cancel()}>取消</Text>
                                <Text style={{
                                    color:'#333',
                                    fontWeight:'bold',
                                    fontSize: 16
                                }}>{this.props.title}</Text>
                                <Text style={{
                                    color:'#14c5ca',
                                    fontSize: 16
                                }} onPress={()=>this._confirm()}>确定</Text>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexStart]}>
                            <PickerIOS
                                style={{width:width/3,height:200}}
                                selectedValue={nYear}
                                onValueChange={(val)=>{this.changeYear(val)}}
                            >
                                {
                                    yearList.map((item, index) => {
                                        return <PickerItemIOS
                                            key={index}
                                            value={JSON.stringify(item)}
                                            label={JSON.stringify(item)}
                                        />
                                    })
                                }
                            </PickerIOS>
                            <PickerIOS
                                style={{width:width/3,height:200}}
                                selectedValue={nMonth}
                                onValueChange={(val)=>{this.changeMonth(val)}}
                            >
                                {
                                    monthList.map((item, index) => {
                                        return <PickerItemIOS
                                            key={index}
                                            value={JSON.stringify(item)}
                                            label={JSON.stringify(item)}
                                        />
                                    })
                                }
                            </PickerIOS>
                            <PickerIOS
                                style={{width:width/3,height:200}}
                                selectedValue={nDay}
                                onValueChange={(val)=>{this.changeDay(val)}}
                            >
                                {
                                    dayList.map((item, index) => {
                                        return <PickerItemIOS
                                            key={index}
                                            value={JSON.stringify(item)}
                                            label={JSON.stringify(item)}
                                        />

                                    })
                                }
                            </PickerIOS>

                        </View>

                    </View>
                </Modal>
            </View>
        )
    }
}

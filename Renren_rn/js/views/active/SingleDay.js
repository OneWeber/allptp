import React, {Component} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import CommonStyle from '../../../assets/css/Common_css';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loading from '../../common/Loading';
const {width, height} = Dimensions.get('window')
class SingleDay extends Component{
    constructor(props) {
        super(props);
        this.days=['日','一','二','三','四','五','六']
        this.state = {
            monthList: [],
            selected: [],
            calendarArr: []
        }
    }
    componentDidMount(){
        this.initSlot()
    }
    initSlot(){
        let slot = this.props.slot,monthArr=[];
        for(let i=0;i<slot.length;i++){
            monthArr.push({
                y:parseFloat(slot[i].day.split('-')[0]),
                m:parseFloat(slot[i].day.split('-')[1]),
                date:this.parseDate(slot[i].day.split('-')[0]+'-'+slot[i].day.split('-')[1]+'-1')
            })
        }
        monthArr=this.objRemoveDuplicated(monthArr);
        monthArr=monthArr.sort(function (a, b) {
            return a.date - b.date
        })
        this.setState({
            monthList: monthArr
        },() => {
            let list=[],dayCount=0,dayIn=0,temp = [],selectArr=[],selecting=[];
            let {monthList} = this.state
            for(let i=0;i<monthList.length;i++){
                temp=[];
                selectArr=[];
                dayCount = this.getDaysOfMonth(monthList[i].y,monthList[i].m);//获取当月的天数
                dayIn = this.getFirstDay(monthList[i].y,monthList[i].m)//获取当月第一天日期前有几个空格
                for (let j=0;j<dayCount;j++){
                    temp.push(j+1);
                    selectArr.push(1);
                    selecting.push(0)
                    for(let k=0;k<slot.length;k++){
                        if(this.parseDate(monthList[i].y+"-"+monthList[i].m+"-"+j)==this.parseDate(slot[k].day)- 8.64e7){
                            selectArr[j]=slot[k].status
                        }
                    }
                }
                temp=this.removeDuplicatedItem(temp);
                for(let k=0;k<dayIn;k++){
                    temp.unshift(" ");
                    selectArr.unshift(1);
                    selecting.unshift(0);
                }
                this.setState({
                    selected:selectArr
                })
                list.push({
                    y:this.state.monthList[i].y,
                    m:this.state.monthList[i].m,
                    list:temp,
                    select:selectArr,
                    selecting:selecting
                })
            }
            this.setState({
                calendarArr:list
            })
        })
    }
    getDaysOfMonth = (year, month) => {
        var day = new Date(year, month, 0)
        var dayCount = day.getDate()
        return dayCount
    }
    getFirstDay = (year, month) => {
        var day = new Date(year, month - 1)
        var dayCount = day.getDay()
        if (dayCount == 0) {
            dayCount = 7
        }
        return dayCount
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    removeDuplicatedItem(arr) {//数组去重
        for(var i = 0; i < arr.length-1; i++){
            for(var j = i+1; j < arr.length; j++){
                if(arr[i]==arr[j]){

                    arr.splice(j,1);//console.log(arr[j]);
                    j--;
                }
            }
        }
        return arr;
    }
    objRemoveDuplicated(arr){
        var tmepArr = [];
        // 将数组对象转成数组字符串
        var newStr = this.changeArrStr(arr);
        newStr.sort();
        // 数组去重
        for(var i=0;i<newStr.length;i++){
            if(newStr[i] !== tmepArr[tmepArr.length-1]){
                tmepArr.push(newStr[i]);
            }
        }
        var newArr = [];
        // 新数组字符串转成数组对象
        for(var i=0;i<tmepArr.length;i++){
            newArr.push(JSON.parse(tmepArr[i]));
        }
        return newArr
    }
    changeArrStr(arr){
        var newArr = [];
        if(arr.length !== 0){
            for(var i=0;i<arr.length;i++){
                var thisObj = this.sortObjectFun(arr[i]);
                var thisStr = JSON.stringify(thisObj);
                thisStr = thisStr.replace(/(\s|[\\t])/g,''); // 去除空格及\t空白字符
                newArr.push(thisStr);
            }
        }
        return newArr;
    }
    sortObjectFun(obj){
        var keyArr = [];// 对象的key
        for(var item in obj){
            keyArr.push(item);
        };
        keyArr.sort(); // 降序
        var newObj = {};
        for(var i=0;i<keyArr.length;i++){
            newObj[keyArr[i]] = obj[keyArr[i]]
        }
        return newObj;
    }
    getLeftButton(){
        return <TouchableOpacity
            style={styles.back_icon}
            onPress={() =>{
                NavigatorUtils.backToUp(this.props)
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    render(){
        let Day = <View style={CommonStyle.flexCenter}>
            <View style={[CommonStyle.flexStart,CommonStyle.commonWidth]}>
                {this.days.map((item, index) => {
                    return <View style={[styles.day_item,CommonStyle.flexCenter,{
                        marginLeft:index===0?0:10
                    }]}>
                        <Text style={{color: '#333',fontWeight: 'bold', fontSize: 16}}>{item}</Text>
                    </View>
                })}
            </View>
        </View>
        const {calendarArr} = this.state
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1,backgroundColor:'#fff',justifyContent:'flex-start'}]}>
                <RNEasyTopNavBar
                    title={'我的订单'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {Day}
                {
                    calendarArr.length > 0
                    ?
                        <Text>111</Text>
                    :
                       <Loading></Loading>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    day_item:{
        width:(width*0.94 - 60) / 7,
        height: 40
    },
    back_icon: {
        paddingLeft: width*0.03
    }
})
const mapStateToProps = state => ({
    slot: state.slot.slot.slot
})
export default connect(mapStateToProps)(SingleDay)

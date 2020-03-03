import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import commonStyle from '../../res/js/Commonstyle'
type Props = {}
const widthScreen = Dimensions.get('window').width;
export default class Singlecalendar extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            activityInfo: this.props.activityInfo,
            monthList: [],
            selectedList: [],
            calendarArray: []
        }
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    objRemoveDuplicated(arr){ //数组对象去重
        var tmepArr = [];
        // 将数组对象转成数组字符串
        var newStr = this.changeArrStr(arr);
        newStr.sort();
        // 数组去重
        for(var i = 0; i < newStr.length; i++){
            if(newStr[i] !== tmepArr[tmepArr.length-1]){
                tmepArr.push(newStr[i]);
            }
        }
        var newArr = [];
        // 新数组字符串转成数组对象
        for(var i=0; i < tmepArr.length; i++){
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
    componentDidMount(): void { //遍历体验日期
        let slot = this.state.activityInfo.slot
        let monthArray = []
        for (let i = 0; i < slot.length; i++ ) { //遍历获取有体验的月份
            monthArray.push({
                y: parseFloat(slot[i].day.split('-')[0]),
                m: parseFloat(slot[i].day.split('-')[1]),
                date: this.parseDate(slot[i].day.split('-')[0] + '-' + slot[i].day.split('-')[1] + '-1')
            })
        }
        monthArray = this.objRemoveDuplicated(monthArray)
        monthArray = monthArray.sort((a, b) => { //数组排序
            return a.date - b.date
        })
        this.setState({
            monthList: monthArray
        }, () => {
            this.forShowDay(slot)
        })


    }
    getDaysOfMonth = (year, month) => { // 获取当前月的天数
        var day = new Date(year, month, 0)
        var dayCount = day.getDate()
        return dayCount
    }
    getFirstDay = (year, month) => { //获取当前月有几个空格期
        var day = new Date(year, month - 1)
        var dayCount = day.getDay()
        if (dayCount == 0) {
            dayCount = 7
        }
        return dayCount
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
    forShowDay(data) { //遍历有体验的月份显示对应的日期
        let list = [], slot = data, dayCount = 0, dayIn = 0, temp = [], selectArray = [], monthList = this.state.monthList; //temp为装对应月份的数组
        for ( let i = 0; i < monthList.length; i++ ) {
            temp = []
            selectArray = []
            dayCount = this.getDaysOfMonth( monthList[i].y, monthList[i].m ) //获取当月的天数
            dayIn = this.getFirstDay( monthList[i].y, monthList[i].m ) //获取当前月第一天前有几个空格期
            for (let j = 0; j < dayCount; j++) {
                temp.push(j + 1)
                selectArray.push(1)
                for (let k = 0; k < slot.length; k++) {
                    if (this.parseDate(monthList[i].y + '-' + monthList[i].m + '-' + j) == this.parseDate(slot[k].day) - 8.64e7) {
                        selectArray[j] = slot[k].status
                    }
                }
            }
            temp = this.removeDuplicatedItem(temp) //数组去重
            if (dayIn != 7) {
                for (let k = 0; k < dayIn; k ++) {
                    temp.unshift(" ")
                    selectArray.unshift(1)
                }
            }
            this.setState({
                selectedList: selectArray
            })
            list.push({
                y: monthList[i].y,
                m: monthList[i].m,
                list: temp,
                select: selectArray
            })
        }
        this.setState({
            calendarArray: list
        })

    }
    _renderCalendar(data) {
        const calendarLength = this.state.calendarArray.length
        const date = ['日', '一', '二', '三', '四', '五', '六']
        return <View style = {{
            width: calendarLength == 1 ? widthScreen * 0.96 : widthScreen * 0.6,
            marginLeft: calendarLength == 1 ? 0 : data.index == 0 ? 0 : 25
        }}>
            <Text style = {styles.date_title}>{data.item.y} 年 {data.item.m} 月</Text>
            <View style = {[commonStyle.flexStart]}>
                {
                    date.map((dateItem, index) => {
                        return <View style = {[styles.date_xq, commonStyle.flexCenter, {
                            marginLeft: index === 0 ? 0 : 10,
                            width: calendarLength == 1 ? (widthScreen*0.96 - 60) / 7 : (widthScreen*0.6 - 60) / 7,
                            backgroundColor: calendarLength == 1 ? '#f5f5f5' : '#fff',
                            height: calendarLength == 1 ? 35 : 30
                        }]}>
                            <Text>{dateItem}</Text>
                        </View>
                    })
                }
            </View>
            <View style = {[commonStyle.flexStart, {flexWrap: 'wrap'}]}>
                {
                    data.item.list.map((item, index) => {
                        return <View style = {[commonStyle.flexCenter, styles.date_li, {
                            width: calendarLength == 1 ? (widthScreen*0.96 - 60) / 7 : (widthScreen*0.6 - 60) / 7,
                            marginLeft: index%7 === 0 ? 0 : 10,
                            borderWidth: data.item.select[index]!=1 ? 1 : 0,
                            borderColor:data.item.select[index]!==0 ? "#999999" : "#4db6ac",
                            height: calendarLength == 1 ? (widthScreen*0.96 - 60) / 7 : (widthScreen*0.6 - 60) / 7,
                        }]}>
                            <Text>
                                {item}
                            </Text>
                        </View>
                    })
                }
            </View>


        </View>
    }
    render() {
        return (
            <View>
                <FlatList
                    data={this.state.calendarArray}
                    horizontal={true}
                    renderItem={(data)=>this._renderCalendar(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    date_title: {
        marginTop: 20,
        color: '#333',
        fontWeight: 'bold'
    },
    date_xq: {
        marginTop: 15,
    },
    date_li: {
        marginTop: 10,
        position: 'relative',
        borderStyle: 'solid',
        borderRadius: 3
    }
})
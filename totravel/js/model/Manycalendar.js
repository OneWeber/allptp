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
export default class Manycalendar extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            activityInfo: this.props.activityInfo,
            dayList: []
        }
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
    componentDidMount(): void {
        const slot = this.state.activityInfo.slot
        let arr = [],selectArr = [],list = [],dayCount = 0,dayIn = 0, a = [],b = [], temp = [];
        for (let i = 0; i < slot.length; i++) { //遍历获取该体验设计到到月份
            arr.push(slot[i].begin_date.substring(0, 7))
            arr.push(slot[i].end_date.substring(0, 7))
        }
        arr = this.removeDuplicatedItem(arr)
        this.forEachMonth(temp, selectArr, a, b, dayCount, dayIn, arr, list)
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }

    forEachMonth(temp, selectArr, a, b, dayCount, dayIn, arr, list) {
        const actslot = this.state.activityInfo.slot
        for (let i = 0; i < arr.length; i++) {
            temp = []; selectArr = []; a = []; b = [];
            dayCount = this.getDaysOfMonth(arr[i].split('-')[0], arr[i].split('-')[1])
            dayIn = this.getFirstDay(arr[i].split('-')[0], arr[i].split('-')[1])
            for (let j = 0; j < dayCount; j++) {
                temp.push(j + 1)
                selectArr.push(1)
                b.push(1)
                for (let k = 0; k < actslot.length; k++) {
                    if (this.parseDate(arr[i] + '-' + j) <= this.parseDate(actslot[k].end_date) - 8.64e7 && this.parseDate(arr[i] + '-' + j) >= this.parseDate(actslot[k].begin_date) - 8.64e7 && j != " ") {
                        b[j] = 0
                    }
                }
            }
            temp = this.removeDuplicatedItem(temp)
            if (dayIn != 7) {
                for ( let k = 0; k < dayIn; k++) {
                    temp.unshift(" ")
                    selectArr.unshift(1)
                    a.push(1)
                }
            }

            list.push({
                date: arr[i],
                list: temp,
                select: a.concat(b)
            })
        }
        this.setState({
            dayList: list
        })
    }
    _renderCalendar(data) {
        const calendarLength = this.state.dayList.length
        const date = ['日', '一', '二', '三', '四', '五', '六']
        return <View style = {{
            width: calendarLength == 1 ? widthScreen * 0.96 : widthScreen * 0.6,
            marginLeft: calendarLength == 1 ? 0 : data.index == 0 ? 0 : 25
        }}>
            <Text style = {styles.date_title}>{data.item.date}</Text>
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
                           height: calendarLength == 1 ? (widthScreen*0.96 - 60) / 7 : (widthScreen*0.6 - 60) / 7,
                           position: 'relative',
                           backgroundColor: data.item.select[index] !== 0 ? '#fff' : '#14c5ca'
                       }]}>
                            <Text style = {{
                                color: data.item.select[index] == 0 ? '#fff' : data.item.select[index] == 2 ? '#999' : '#999'
                            }}>
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
                    data={this.state.dayList}
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
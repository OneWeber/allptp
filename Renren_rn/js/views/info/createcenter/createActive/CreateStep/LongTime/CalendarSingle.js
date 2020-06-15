import React,{Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux'
import {CalendarList} from 'react-native-calendars';
import {getAll} from '../../../../../../utils/auth'
import actions from '../../../../../../action';
class CalendarSingle extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date: {},
            dateValue: this.props.dateValue,
            dateArr: []
        }
    }
    componentDidMount() {
        if(this.state.dateValue.length>0) {
            this.initDate(this.state.dateValue)
        }
        if(this.props.newDate.length>0) {
            this.initDate(this.props.newDate)
        }

    }
    _longPressDay(day) {
        // const {changeDateValue} = this.props;
        // let newDValue = this.state.dateArr;
        // for(let i=0;i<newDValue.length;i++) {
        //     if(getAll(newDValue[i].begin_date, newDValue[i].end_date).indexOf(day.dateString) > -1) {
        //         return
        //     }
        // }
        //
        // if(newDValue.length === 0) {
        //     newDValue.push({
        //         begin_date: day.dateString,
        //         end_date: ''
        //     })
        //     this.props.changeShow(false, newDValue)
        // }else{
        //     if(!newDValue[newDValue.length-1].end_date) {
        //         newDValue[newDValue.length-1].end_date = day.dateString;
        //         this.props.changeShow(true, newDValue)
        //     } else {
        //         newDValue.push({
        //             begin_date: day.dateString,
        //             end_date:''
        //         });
        //         this.props.changeShow(false, newDValue)
        //     }
        // }
        // this.setState({
        //     dateArr: newDValue
        // },()=>{
        //     this.initDate(this.state.dateValue)
        // })
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    initDate(data) {
        console.log('datas', data)
        let newDate = this.state.date;
        for(let i=0; i<data.length; i++) {
            if(data[i].begin_date&&data[i].end_date) {
                let days=getAll(data[i].begin_date, data[i].end_date)
                for(let k=0; k<days.length; k++) {
                    newDate[days[k]] = {selected:true, color: this.props.theme, textColor: '#fff'}
                }
            }else{
                newDate[data[i].begin_date] = {selected:true, color: this.props.theme, textColor: '#fff'}
            }
        }
        this.setState({
            date: newDate
        })
    }
    _dayPress(day) {
        const {changeDateValue} = this.props;
        let newDValue = [];
        if(this.props.newDate) {
            newDValue = this.props.newDate
        }else{
            newDValue = this.state.dateArr
        }
        for(let i=0;i<newDValue.length;i++) {
            if(getAll(newDValue[i].begin_date, newDValue[i].end_date).indexOf(day.dateString) > -1) {
                return
            }
        }

        newDValue.unshift({
            begin_date: day.dateString,
            end_date: day.dateString
        })
        this.setState({
            dateArr: newDValue
        },()=>{
            this.props.changeShow(this.state.dateArr.length>0?true:false, this.state.dateArr)
            // changeDateValue(this.state.dateValue);
            this.initDate(this.state.dateValue.concat(this.state.dateArr))
        })
    }
    getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    render() {
        const markedDates = Object.assign({}, this.state.date)
        return(
            <View>
                <CalendarList
                    // Callback which gets executed when visible months change in scroll view. Default = undefined
                    onVisibleMonthsChange={(months) => {}}
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={50}
                    minDate={this.getNowFormatDate()}
                    monthFormat={'yyyy MM'}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={50}
                    // Enable or disable scrolling of calendar list
                    scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    showScrollIndicator={true}
                    hideExtraDays={true}
                    showWeekNumbers={true}
                    onDayLongPress={(day)=>{
                        this._longPressDay(day)
                    }}
                    markedDates={markedDates}
                    // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                    markingType={'period'}
                    onDayPress={(day) => {
                        this._dayPress(day)
                    }}

                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    date: state.steps.date,
    theme: state.theme.theme,
    dateValue: state.steps.dateValue,
    newDate: state.steps.newDate
})
const mapDispatchToProps = dispatch => ({
    changeDateValue: arr => dispatch(actions.changeDateValue(arr)),
})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarSingle)

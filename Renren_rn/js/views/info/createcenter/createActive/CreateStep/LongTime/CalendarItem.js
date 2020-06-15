import React,{Component} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {connect} from 'react-redux'
import {CalendarList} from 'react-native-calendars';
import {getAll} from '../../../../../../utils/auth'
import actions from '../../../../../../action'
import Modal from 'react-native-modalbox';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {objRemoveDuplicated} from '../../../../../../utils/auth'
class CalendarItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date: {},
            dateValue: this.props.dateValue,
            dateArr: [],
            clickDay: ''
        }
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    componentDidMount() {
        if(this.state.dateValue.length>0) {
            this.initDate(this.state.dateValue)
        }
        if(this.props.newDate) {
            this.initDate(this.props.newDate)
        }

    }
    getTheSame(dataOne, dataTwo) {
        let attendUid = dataOne;
        let dataattendUid = dataTwo;
        let result = new Array();
        let c = dataattendUid.toString();
        for (let i = 0; i < attendUid.length; i++) {
            if (c.indexOf(attendUid[i].toString()) > -1) {
                for (let j = 0; j < dataattendUid.length; j++) {
                    if (attendUid[i] == dataattendUid[j]) {
                        result.push(attendUid[i]);
                        break;
                    }
                }
            }
        }
        return result;
    }
    clickDay(day) {
        const {changeDateValue, changeNewDate} = this.props;
        let newDValue = [];
        if(this.props.newDate) {
            newDValue = this.props.newDate
        }else{
            newDValue = this.state.dateArr;
        }
        for(let i=0;i<newDValue.length;i++) {
            if(getAll(newDValue[i].begin_date, newDValue[i].end_date).indexOf(day.dateString) > -1) {
                return
            }
        }
        if(newDValue.length === 0) {
            newDValue.push({
                begin_date: day.dateString,
                end_date: ''
            })
            this.props.changeShow(false, newDValue)
        } else {
            if(!newDValue[newDValue.length-1].end_date) {
                if(this.parseDate(day.dateString)<this.parseDate(newDValue[newDValue.length-1].begin_date)) {
                    newDValue[newDValue.length-1].end_date=newDValue[newDValue.length-1].begin_date;
                    newDValue[newDValue.length-1].begin_date=day.dateString
                }else{
                    newDValue[newDValue.length-1].end_date = day.dateString;
                }
                // let datas = this.state.date;
                // for(let i=0; i<newDValue.length; i++) {
                //     if(i!=(newDValue.length-1)) {
                //         if(this.getTheSame(getAll(newDValue[i].begin_date, newDValue[i].end_date), getAll(newDValue[newDValue.length-1].begin_date, newDValue[newDValue.length-1].end_date))  ) {
                //             console.log('不能包含');
                //             newDValue.splice(newDValue.length-1, 1);
                //
                //         }
                //     }
                // }
                // this.props.changeShow(true, newDValue)
            } else {
                newDValue.push({
                    begin_date: day.dateString,
                    end_date:''
                });
                this.props.changeShow(false, newDValue)
            }
        }
        this.setState({
            dateArr: newDValue
        },()=>{
            console.log('dateArr', this.state.dateArr)
            console.log(this.state.dateValue)
            this.initDate(this.state.dateValue.concat(this.state.dateArr))
        })
    }
    initDate(data) {
        let newDate = this.state.date;
        for(let i=0; i<data.length; i++) {
            if(data[i].begin_date&&data[i].end_date) {
                let days=getAll(data[i].begin_date, data[i].end_date)
                for(let k=0; k<days.length; k++) {
                    if(k===0) {
                        newDate[days[k]] = {startingDay: true, color: this.props.theme, textColor: '#fff'}
                    }else if(k===(days.length-1)) {
                        newDate[days[k]] = {selected:true, endingDay: true, color: this.props.theme, textColor: '#fff'}
                    }else{
                        newDate[days[k]] = {selected:true, color: this.props.theme, textColor: '#fff'}
                    }
                }
            }else{
                newDate[data[i].begin_date] = {startingDay: true, color: this.props.theme, textColor: '#fff'}
            }
        }
        this.setState({
            date: newDate
        })
    }
    maybeDel(day) {
        this.setState({
            clickDay: day
        },() => {
            this.refs.do.open()
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
    delDay() {
        console.log('dateArr1', objRemoveDuplicated(this.state.dateValue))
        console.log('dateArr2', this.props.newDate);
        console.log('dateArr3', this.state.dateArr);
        const {clickDay} = this.state;
        let dateArr = this.state.dateArr, newDate = this.props.newDate, dateValue = this.state.dateValue;
        for(let i=0;i<dateArr.length; i++) {
            if(getAll(dateArr[i].begin_date, dateArr[i].end_date).indexOf(clickDay.dateString)>-1) {
                dateArr.splice(i, 1)
            }
        }
        for(let i=0;i<newDate.length; i++) {
            if(getAll(newDate[i].begin_date, newDate[i].end_date).indexOf(clickDay.dateString)>-1) {
                newDate.splice(i, 1)
            }
        }
        let dateData = objRemoveDuplicated(dateArr.concat(newDate).concat(dateValue));
        console.log('dateData', dateData)
        this.initDate(dateData);
    }
    render() {
        const markedDates = Object.assign({}, this.state.date)
        return <View>
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
                    this.maybeDel(day)
                }}
                markedDates={markedDates}
                // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                markingType={'period'}
                onDayPress={(day) => {
                    this.clickDay(day)
                }}
        />
            <Modal
                style={{height:60,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                ref={"do"}
                animationDuration={200}
                position={"bottom"}
                backdropColor={'rgba(0,0,0,0.9)'}
                swipeToClose={false}
                backdropPressToClose={true}
                coverScreen={true}>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:60,
                    backgroundColor:'#fff'
                }]}
                onPress={() => {
                    this.delDay()
                }}
                >
                    <Text style={{
                        color:'red'
                    }}>删除</Text>
                </TouchableOpacity>
            </Modal>
        </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(CalendarItem)

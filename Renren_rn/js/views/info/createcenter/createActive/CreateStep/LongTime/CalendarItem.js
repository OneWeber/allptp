import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
const {width, height} = Dimensions.get('window')
class CalendarItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date: {
                '2020-05-21': {textColor: 'green'},
            }
        }
    }
// {
//     '2020-05-20': {textColor: 'green'},
//     '2020-05-22': {startingDay: true, color: 'green'},
//     '2020-05-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
//     '2020-05-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
// }
    clickDay(day) {
        let newDate = this.state.date;
        newDate[day.dateString] = {selected: true, endingDay: true, color: 'green', textColor: 'gray'}
        this.setState({
            date: newDate
        })
    }
    render() {
        const markedDates = Object.assign({}, this.state.date)
        return <View>
            <CalendarList
                // Callback which gets executed when visible months change in scroll view. Default = undefined
                onVisibleMonthsChange={(months) => {}}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={50}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={50}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}
                hideExtraDays={true}
                showWeekNumbers={true}
                markedDates={markedDates}
                // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                markingType={'period'}
                onDayPress={(day) => {
                    this.clickDay(day)
                }}

        />
        </View>
    }
}
const mapStateToProps = state => ({
    date: state.steps.date
})
export default connect(mapStateToProps)(CalendarItem)







import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {getDaysOfMonth, getFirstDay} from '../../../../../../utils/auth';
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window')
class CalendarItem extends Component{
    constructor(props) {
        super(props);
        this.monthList= [1,2,3,4,5,6,7,8,9,10,11,12];
        this.year = this.props.tabLabel;
        this.days=['日','一','二','三','四','五','六']
        this.state = {
            dateList: [],
            selectDate: []
        }
    }
    componentDidMount() {
        this.initDate()
    }
    initDate() {
        let list=[],dayCount=0,dayIn=0,temp=[];
        for(let i=0;i<this.monthList.length;i++) {
            temp=[];
            dayCount=getDaysOfMonth(this.year, this.monthList[i]); //获取当月的天数
            dayIn=getFirstDay(this.year, this.monthList[i]); //获取当月第一天日期前有几个空格
            for(let j=0;j<dayCount;j++) {
                temp.push({
                    day: j+1,
                });
            }
            if (dayIn != 7){
                for(let k=0;k<dayIn;k++){
                    temp.unshift(" ");
                }
            }
            list.push({
                m:this.monthList[i],
                list:temp,
            });
        }
        this.setState({
            dateList: list
        })
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    clickItem(month, day) {
        const {timeIndex} = this.props;
        if(timeIndex===0) {
            this.manyClick(month, day);
        }else{
            this.singleClick(month, day);
        }
    }
    singleClick() {

    }
    manyClick(month, day) {
        let s_date = this.state.selectDate;
        if(s_date.length === 0) {
            s_date.push({
                begin_date: this.year+'-'+month+'-'+day,
                end_date: ''
            })
        }else{
            for(let i=0; i<s_date.length; i++) {
                if(s_date[i].end_date==='') {
                    s_date[i].end_date = this.year+'-'+month+'-'+day;
                }else{
                    let dateTime = this.year+'-'+month+'-'+day;
                    if(this.parseDate(dateTime)>=this.parseDate(s_date[i].begin_date) && this.parseDate(dateTime)<=this.parseDate(s_date[i].end_date)) {
                        s_date[i] = {
                            begin_date: this.year+'-'+month+'-'+day,
                            end_date: ''
                        }
                    }else{
                        s_date.push({
                            begin_date: this.year+'-'+month+'-'+day,
                            end_date: ''
                        })
                    }
                }
            }
        }
    }
    render() {
        const {item} = this.props;
        const {dateList} = this.state;
        return <View style={{flex: 1}}>
            <ScrollView>
                <View style={[CommonStyle.flexCenter]}>
                    <View style={CommonStyle.commonWidth}>
                        {
                            dateList.map((item, index) => {
                                return <View key={index} style={[{
                                    marginTop: 15
                                }]}>
                                    <Text style={{
                                        color:'#333',
                                        fontWeight: 'bold'
                                    }}>{item.m}月</Text>
                                    <View style={[CommonStyle.spaceRow,{
                                        marginTop: 10
                                    }]}>
                                        {
                                            this.days.map((ditem, dindex) => {
                                                return <View key={dindex} style={[CommonStyle.flexCenter,{
                                                    width:(width*0.94)/7,
                                                    height: 40
                                                }]}>
                                                    <Text style={{
                                                        color:'#999',
                                                        fontSize: 12
                                                    }}>{ditem}</Text>
                                                </View>
                                            })
                                        }
                                    </View>
                                    <View style={[CommonStyle.flexStart, {
                                        flexWrap: 'wrap'
                                    }]}>
                                        {
                                            item.list.map((litem, lindex) => {
                                                return <TouchableOpacity key={lindex} style={[CommonStyle.flexCenter,{
                                                    width:(width*0.94)/7,
                                                    height:40
                                                }]} onPress={() => {
                                                    this.clickItem(item.m, litem.day)
                                                }}>
                                                    <Text style={{
                                                        color:'#666'
                                                    }}>{litem.day}</Text>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </View>
                                </View>
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    }
}
const mapStateToProps = state => ({
    date: state.steps.date
})
export default connect(mapStateToProps)(CalendarItem)

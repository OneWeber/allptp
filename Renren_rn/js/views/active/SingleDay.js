import React, {Component} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux'
import CommonStyle from '../../../assets/css/Common_css';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loading from '../../common/Loading';
import action from '../../action';
const {width, height} = Dimensions.get('window')
class SingleDay extends Component{
    constructor(props) {
        super(props);
        this.days=['日','一','二','三','四','五','六']
        this.state = {
            monthList: [],
            selected: [],
            calendarArr: [],
            topIndex:-1,
            date:'',
            isSlotView: false,
            slotList: []
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
                if (dayIn != 7){
                    for(let k=0;k<dayIn;k++){
                        temp.unshift(" ");
                        selectArr.unshift(1);
                        selecting.unshift(0);
                    }
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
    selectDay(status,date,i,index){
        this.setState({
            topIndex: i,
            date: date
        })
        const {calendarArr} = this.state
        const {slot} = this.props
        for(let j=0; j<calendarArr[i].select.length; j++) {
            if(status === 0) {
                if(j===index) {
                    calendarArr[i].selecting[j]=1
                } else {
                    calendarArr[i].selecting[j]=0
                }
            }
        }
        //isSlotView
        if(status === 0) {
            this.setState({
                isSlotView: true
            }, () => {
                for(let i=0; i<slot.length; i++) {
                    if(this.parseDate(date) === this.parseDate(slot[i].day)) {
                        this.setState({
                            slotList: slot[i].list
                        })
                    }
                }
            })
        }
    }
    toNext(price,slot_id,beginTme,endTime){
        const {issatay} = this.props.navigation.state.params
        if(issatay){
            alert(111)
            return
        }
        const {join, initJoin} = this.props
        let datas = join;
        datas.price = price
        datas.slot_id = slot_id;
        datas.date = this.state.date
        datas.slot_time = beginTme+"-"+endTime
        initJoin(datas)
        NavigatorUtils.goPage({}, 'Requirements', 'navigate')
    }
    _renderList(data){
        const {isMe, vol} = this.props.navigation.state.params
        return (
            <View style={[CommonStyle.flexCenter,{paddingTop: 10, paddingBottom: 10}]}>
                <View style={[CommonStyle.commonWidth, CommonStyle.spaceRow]}>
                    <View style={[CommonStyle.spaceCol,{height: 40,width: width*0.94 - 80,alignItems: 'flex-start'}]}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:"#333333",fontWeight: "bold"}}>
                            {data.item.time[0]} - {data.item.time[1]}
                        </Text>
                        {
                            vol
                            ?
                                <Text style={{color: '#999'}}>志愿者无需付费</Text>
                            :
                                <Text style={{color: '#999'}}>
                                    <Text style={{color:this.props.theme,fontWeight:'bold'}}>¥{data.item.price}/人起 </Text>
                                    还剩{data.item.personNum-data.item.order_person_num}个名额
                                </Text>
                        }
                    </View>
                    {
                        isMe
                        ?
                            null
                        :
                        data.item.online === 1 || data.item.status === 1 || data.item.status === 2
                        ?
                            <View style={[styles.select_btn,CommonStyle.flexCenter,{backgroundColor: '#ff5673'}]}>
                                <Text style={{color: '#fff', fontWeight: 'bold'}}>{
                                    data.item.online === 1 ? '已取消' : data.item.status === 1 ? '已删除' : '已过期'
                                }</Text>
                            </View>
                        :
                            vol
                            ?
                            <TouchableOpacity style={[styles.select_btn,CommonStyle.flexCenter,{backgroundColor: this.props.theme}]}>
                                <Text style={{color: '#fff', fontWeight: 'bold'}}>报名</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={[styles.select_btn,CommonStyle.flexCenter,{backgroundColor: this.props.theme}]}
                                onPress={() => this.toNext(data.item.price,data.item.slot_id,data.item.time[0],data.item.time[1])}
                            >
                                <Text style={{color: '#fff', fontWeight: 'bold'}}>选择</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
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
        const {theme} = this.props
        const {calendarArr, topIndex, isSlotView, slotList} = this.state
        let single = [];
        for(let i=0;i<calendarArr.length;i++) {
            single.push(
                <View style={[CommonStyle.commonWidth]} key={i}>
                    <Text style={styles.year_title}>{calendarArr[i].y}年{calendarArr[i].m}月</Text>
                    <View style={[CommonStyle.flexStart,{flexWrap: 'wrap'}]}>
                        {calendarArr[i].list.map((item, index) => {
                            return(
                                <View>
                                    {
                                        calendarArr[i].select[index] === 0
                                        ?
                                            <TouchableOpacity
                                                style={[CommonStyle.flexCenter,styles.day_one,{
                                                    marginLeft: index%7===0?0:10,
                                                    backgroundColor: calendarArr[i].selecting[index]==1&&i==topIndex&&calendarArr[i].select[index]==0?theme:'#fff'
                                                }]}
                                                onPress={()=>this.selectDay(calendarArr[i].select[index],JSON.stringify(calendarArr[i].y)+"-"+JSON.stringify(calendarArr[i].m)+"-"+JSON.stringify(item),i,index)}
                                            >
                                                <Text style={[styles.day_txt,{
                                                    color:calendarArr[i].selecting[index]===1&&i===topIndex&&calendarArr[i].select[index]===0?'#fff':theme
                                                }]}>{item}</Text>
                                            </TouchableOpacity>
                                        :
                                            <View style={[CommonStyle.flexCenter,styles.day_one,{
                                                marginLeft: index%7===0?0:10,
                                            }]}>
                                                <Text style={[styles.day_txt,{color: '#999'}]}>{item}</Text>
                                            </View>
                                    }
                                </View>
                            )
                        })}
                    </View>
                </View>
            )
        }

        return(
            <View style={[CommonStyle.flexCenter,{flex: 1,backgroundColor:'#fff',justifyContent:'flex-start',position: 'relative'}]}>
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
                        single
                    :
                       <Loading></Loading>
                }
                {
                    isSlotView
                    ?
                        <View style={styles.slot_modal}>
                            <FlatList
                                data={slotList}
                                horizontal={false}
                                renderItem={(data)=>this._renderList(data)}
                                showsHorizontalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    :
                        null
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
    },
    year_title:{
        fontWeight:'bold',
        color: '#333',
        fontSize: 16,
        marginTop: 20
    },


    day_txt:{
        fontWeight: "bold"
    },
    slot_modal:{
        position:'absolute',
        left: 0,
        right: 0,
        bottom:0,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        minHeight: 100,
        maxHeight: 400
    },
    select_btn: {
        width: 75,
        height: 40,
        borderRadius: 3
    }
})
const mapStateToProps = state => ({
    slot: state.slot.slot.slot,
    theme: state.theme.theme,
    join: state.join.join
})
const mapDispatchToProps = dispatch => ({
    initJoin: join => dispatch(action.initJoin(join))
})
export default connect(mapStateToProps, mapDispatchToProps)(SingleDay)

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import action from '../../action';
import {getAll} from '../../utils/auth';
import Loading from '../../common/Loading';
import Modal from 'react-native-modalbox';
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
const {width, height} = Dimensions.get('window')
class ManyDay extends Component{
    constructor(props) {
        super(props);
        this.days=['日','一','二','三','四','五','六'];
        this.vol = this.props.navigation.state.params.vol;
        this.isMe = this.props.navigation.state.params.isMe;
        this.state = {
            monthList: [],
            selected: [],
            calendarArr: [],
            topIndex:-1,
            date:'',
            isSlotView: false,
            slotList: [],
            detailLoading: false
        }
    }
    componentDidMount(){
        this.initSlot()
    }
    initSlot() {
        let slot = this.props.slot,monthArr=[];
        for(let i=0;i<slot.length;i++){
            let slotDay = getAll(slot[i].begin_date, slot[i].end_date)
            for(let k=0;k<slotDay.length; k++) {
                monthArr.push({
                    y:parseFloat(slotDay[k].split('-')[0]),
                    m:parseFloat(slotDay[k].split('-')[1]),
                    date:this.parseDate(slotDay[k].split('-')[0]+'-'+slotDay[k].split('-')[1]+'-1')
                })
            }
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
                        let slotDay = getAll(slot[k].begin_date, slot[k].end_date)
                        for(let l=0;l<slotDay.length; l++) {
                            if(this.parseDate(monthList[i].y+"-"+monthList[i].m+"-"+j)==this.parseDate(slotDay[l])- 8.64e7){
                                selectArr[j]=slot[k].status
                            }
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
            style={CommonStyle.back_icon}
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
    selectDay(status,date,ti,index) {
        this.setState({
            topIndex: ti,
            date: date,
        })
        const {calendarArr} = this.state;
        let slots = this.props.slot;
        let dateArr = date.split('-');
        if(dateArr[1].length===1) {
            dateArr[1]='0'+dateArr[1]
        }
        if(dateArr[2].length===1) {
            dateArr[2]='0'+dateArr[2]
        }
        let newDate = dateArr.join('-');
        for(let i=0;i<slots.length;i++) {

            if(getAll(slots[i].begin_date, slots[i].end_date).indexOf(newDate)>-1) {
                for(let j=0;j<calendarArr.length;j++) {
                    for(let k=0;k<calendarArr[j].list.length;k++) {
                        if(getAll(slots[i].begin_date, slots[i].end_date).indexOf((calendarArr[j].y+'-'+(JSON.stringify(calendarArr[j].m).length===1?'0'+calendarArr[j].m:calendarArr[j].m)+'-'+(JSON.stringify(calendarArr[j].list[k]).length===1?'0'+calendarArr[j].list[k]:calendarArr[j].list[k])))>-1) {
                            calendarArr[j].selecting[k]=1
                        }
                    }
                }
            }
        }
        if(status === 0) {
            this.setState({
                detailLoading: true
            },() => {
                this.refs.list.open();
                const {join} = this.props;let formData = new FormData();
                formData.append('token', this.props.token);
                formData.append('version', '2.0');
                formData.append('activity_id', join.activity_id);
                Fetch.post(NewHttp+'ActivitySlotUserTwo', formData).then(res => {
                    if(res.code === 1) {
                        this.setState({
                            detailLoading: false,
                            slotList: res.data
                        },()=>{
                            console.log('list', this.state.slotList)
                        })
                    }
                })

            })
        }
    }
    _joinItem(slot_id,is_discount,price_origin,price,kids_price,kids_price_origin,begin_time,end_time,combine, max_person_num,order_person_num,begin_date,end_date) {
        this.refs.list.close();
        const {initJoin, join} = this.props;
        let data = {
            activity_id: join.activity_id,
            slot_id: slot_id,
            person: [],
            house: this.props.navigation.state.params.house,
            houseid:[],
            adult_price_origin: price_origin,
            adult_price:price,
            kids_price_origin: kids_price_origin,
            kids_price:kids_price,
            age_limit: '',
            date: this.state.date,
            begin_time: begin_time,
            end_time: end_time,
            is_discount: is_discount,
            combine: combine,
            title: this.props.navigation.state.params.title,
            kids_stand_low: this.props.navigation.state.params.kids_stand_low,
            kids_stand_high: this.props.navigation.state.params.kids_stand_high,
            selectCombine: [],
            longday:0,
            begin_date: begin_date,
            end_date: end_date
        }
        initJoin(data);
        NavigatorUtils.goPage({max_person_num: max_person_num,order_person_num:order_person_num}, 'ConfirmVisitors')
    }
    _renderList(data) {
        return <View style={[CommonStyle.flexCenter]}>
            <View style={[CommonStyle.commonWidth,{
                borderBottomColor: '#f5f5f5',
                borderBottomWidth: 1,
                paddingBottom: 15
            }]}>
                <View style={[CommonStyle.commonWidth, CommonStyle.spaceRow,{
                    paddingTop: 15,
                    paddingBottom: 15,
                }]}>
                    <View style={{
                        width: width*0.95-95
                    }}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{
                                color:'#333',
                                fontWeight: 'bold',
                                fontSize: 15
                        }}>{data.item.begin_date} {data.item.begin_time} -- {data.item.end_date} {data.item.end_time}</Text>
                        <View style={[CommonStyle.flexStart,{
                            marginTop: 15
                        }]}>
                            <Text style={{
                                fontSize: 12,
                                color:'#333'
                            }}>标准</Text>
                            <Text style={{
                                marginLeft: 10,
                                fontSize: 12,
                                color:'#333'}}>
                                {data.item.is_discount?'¥'+data.item.price:'¥'+data.item.price_origin}
                            </Text>
                            {
                                data.item.is_discount
                                    ?
                                    <View style={[CommonStyle.flexCenter,{
                                        position:'relative',
                                        marginLeft: 10,
                                    }]}>
                                        <Text style={{
                                            fontSize: 12,
                                            color:'#999'
                                        }}>
                                            {data.item.price_origin}
                                        </Text>
                                        <View style={{
                                            position:'absolute',
                                            left:0,
                                            right:0,
                                            top: 7,
                                            borderTopWidth: 1,
                                            borderTopColor: "#999"
                                        }}></View>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                        <View style={[CommonStyle.flexStart,{
                            marginTop: 15
                        }]}>
                            <Text style={{
                                fontSize: 12,
                                color:'#333'
                            }}>儿童</Text>
                            <Text style={{
                                marginLeft: 10,
                                fontSize: 12,
                                color:'#333'}}>
                                {data.item.is_discount?'¥'+data.item.kids_price:'¥'+data.item.kids_price_origin}
                            </Text>
                            {
                                data.item.is_discount
                                    ?
                                    <View style={[CommonStyle.flexCenter,{
                                        position:'relative',
                                        marginLeft: 10,
                                    }]}>
                                        <Text style={{
                                            fontSize: 12,
                                            color:'#999'
                                        }}>
                                            {data.item.kids_price_origin}
                                        </Text>
                                        <View style={{
                                            position:'absolute',
                                            left:0,
                                            right:0,
                                            top: 7,
                                            borderTopWidth: 1,
                                            borderTopColor: "#999"
                                        }}></View>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                    </View>
                    <View style={{
                        width: 75
                    }}>
                        {
                            this.isMe
                                ?
                                null
                                :
                                this.vol
                                    ?
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width: 75,
                                        height: 40,
                                        backgroundColor: this.props.theme,
                                        borderRadius: 6
                                    }]}>
                                        <Text style={{
                                            color:'#fff'
                                        }}>报名</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width: 75,
                                        height: 40,
                                        backgroundColor: this.props.theme,
                                        borderRadius: 6
                                    }]}
                                      onPress={() => {
                                          this._joinItem(
                                              data.item.slot_id,
                                              data.item.is_discount,
                                              data.item.price_origin,
                                              data.item.price,
                                              data.item.kids_price,
                                              data.item.kids_price_origin,
                                              data.item.begin_time,
                                              data.item.end_time,
                                              data.item.combine,
                                              data.item.max_person_num,
                                              data.item.order_person_num,
                                              data.item.begin_date,
                                              data.item.end_date,
                                          )
                                      }}
                                    >
                                        <Text style={{
                                            color:'#fff'
                                        }}>选择</Text>
                                    </TouchableOpacity>
                        }
                        {
                            this.vol
                                ?
                                <Text style={{
                                    color:this.props.theme,
                                    fontSize: 12,
                                    marginTop: 8
                                }}>
                                    志愿者参与体验免费
                                </Text>
                                :
                                <Text style={{
                                    color:this.props.theme,
                                    fontSize: 12,
                                    marginTop: 8
                                }}>仅剩{parseFloat(data.item.max_person_num) - parseFloat(data.item.order_person_num)}个名额</Text>
                        }

                    </View>
                </View>
                {
                    data.item.combine.length>0
                        ?
                        <View>
                            <Text style={{color:'#666',fontSize: 12}}>包含套餐</Text>
                            <View style={[CommonStyle.flexStart,{flexWrap: 'wrap'}]}>
                                {
                                    data.item.combine.map((item, index) => {
                                        return <View
                                            key={index}
                                            style={[CommonStyle.flexStart,{
                                                padding: 9.5,
                                                backgroundColor: '#f5f7fa',
                                                borderRadius: 6,
                                                marginTop:12,
                                                marginRight: 10
                                            }]}
                                        >
                                            <Text style={{color:'#333',fontSize: 12}}>{item.type===1?'亲子':item.name}</Text>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 12,
                                                marginLeft: 10
                                            }}>
                                                {item.adult}成人{item.kids}儿童
                                            </Text>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 12,
                                                marginLeft: 10
                                            }}>
                                                ¥{data.item.price}
                                            </Text>
                                        </View>
                                    })
                                }
                            </View>
                        </View>
                        :
                        null
                }
            </View>
        </View>
    }
    render(){
        let Day = <View style={CommonStyle.flexCenter}>
            <View style={[CommonStyle.flexStart,CommonStyle.commonWidth]}>
                {this.days.map((item, index) => {
                    return <View key={index} style={[styles.day_item,CommonStyle.flexCenter,{
                        marginLeft:index===0?0:10
                    }]}>
                        <Text style={{color: '#333',fontWeight: 'bold', fontSize: 16}}>{item}</Text>
                    </View>
                })}
            </View>
        </View>
        const {theme} = this.props
        const {calendarArr, topIndex, isSlotView, slotList,detailLoading} = this.state;
        let many = [];
        for(let i=0;i<calendarArr.length;i++) {
            many.push(
                <View style={[CommonStyle.commonWidth,{
                    marginBottom:i===calendarArr.length-1?350:0
                }]} key={i}>
                    <Text style={styles.year_title}>{calendarArr[i].y}年{calendarArr[i].m}月</Text>
                    <View style={[CommonStyle.flexStart,{flexWrap: 'wrap'}]}>
                        {calendarArr[i].list.map((item, index) => {
                            return(
                                <View key={index}>
                                    {
                                        calendarArr[i].select[index] === 0
                                            ?
                                            <TouchableOpacity
                                                style={[CommonStyle.flexCenter,styles.day_one,{
                                                    marginLeft: index%7===0?0:10,
                                                    backgroundColor: calendarArr[i].selecting[index]==1&&i==topIndex&&calendarArr[i].select[index]==0?theme:'#fff'
                                                }]}
                                                onPress={()=>{
                                                    this.selectDay(calendarArr[i].select[index],JSON.stringify(calendarArr[i].y)+"-"+JSON.stringify(calendarArr[i].m)+"-"+JSON.stringify(item),i,index)
                                                }}

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
                    title={'多天体验'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {Day}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {
                        calendarArr.length > 0
                            ?
                            many
                            :
                            <Loading></Loading>
                    }
                </ScrollView>
                <Modal
                    style={{height:350,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"list"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 350,
                        backgroundColor:'#fff'
                    }}>
                        {
                            this.state.detailLoading
                            ?
                                <View style={[CommonStyle.flexCenter,{
                                    flex: 1
                                }]}>
                                    <ActivityIndicator size={'small'} color={this.props.theme}/>
                                </View>
                            :
                                <FlatList
                                    data={slotList}
                                    horizontal={false}
                                    renderItem={(data)=>this._renderList(data)}
                                    showsHorizontalScrollIndicator = {false}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                        }
                    </View>
                </Modal>
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

    day_one:{
        marginTop: 10,
        width:(width*0.94-60)/7,
        borderRadius:(width*0.94-60)/7/2,
        position:'relative',
        height: (width*0.94-60)/7
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
        minHeight: 150,
        maxHeight: 400
    },
    select_btn: {
        width: 75,
        height: 40,
        borderRadius: 3
    }
})
const mapStateToProps = state => ({
    slot: state.slot.slot,
    theme: state.theme.theme,
    join: state.join.join,
    token: state.token.token
})
const mapDispatchToProps = dispatch => ({
    initJoin: join => dispatch(action.initJoin(join))
})
export default connect(mapStateToProps, mapDispatchToProps)(ManyDay)

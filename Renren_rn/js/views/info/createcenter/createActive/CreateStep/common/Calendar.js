import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Animated,
    ActivityIndicator,
    Alert
} from 'react-native';
import {connect} from 'react-redux'
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {objRemoveDuplicated, getDaysOfMonth, getFirstDay, removeDuplicatedItem, getAll} from '../../../../../../utils/auth'
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
const {width, height} = Dimensions.get('window')
class Calendar extends Component{
    constructor(props) {
        super(props);
        this.days=['日','一','二','三','四','五','六']
        this.timeIndex = this.props.navigation.state.params.isSingle;
        this.slot = this.props.navigation.state.params.slot;

        this.state = {
            dateArr: [],
            calendarList: [],
            isShowDetail: false,
            scrollHeight: new Animated.Value(height),
            packData: [],
            titleDate: '',
            dayIndex: -1,
            date: '',
            slotData: '',
            singleData: []
        }
    }
    componentDidMount() {
        this.getHasDate();
    }
    _packUpCal(){
        Animated.timing(
            this.state.scrollHeight,
            //将bounceValue的值动画化，是一个持续变化的过程
            {
                toValue: (width*0.94-60)/7 + 30,
                duration: 150
            }
        ).start();
        this.timer = setInterval(() => {
            this.setState({
                isShowDetail:true
            },()=>{
                clearInterval(this.timer)
            })
        }, 150)

    }
    _packDownCal() {
        Animated.timing(
            this.state.scrollHeight,
            //将bounceValue的值动画化，是一个持续变化的过程
            {
                toValue: height,
            }
        ).start();
        this.setState({isShowDetail:false})
    }
    getHasDate() { //获取体验设计到的年月
        const {isSingle} = this.props.navigation.state.params;
        const {slot, isAll} = this.props.navigation.state.params;
        let dateList = [];
        if(isAll) {

        }else{
            console.log('slot', slot)
            if(slot.long_day==1) {
                let data = getAll(slot.date, slot.date);
                for(let j=0; j<data.length; j++) {
                    dateList.push({
                        y:data[j].split('-')[0],
                        m:data[j].split('-')[1],
                    })
                }
            } else {
                let slots = getAll(slot.begin_date, slot.end_date)
                for(let i=0; i<slots.length; i++) {
                    dateList.push({
                        y:slots[i].split('-')[0],
                        m:slots[i].split('-')[1],
                    })
                }
            }
        }


        dateList = objRemoveDuplicated(dateList);
        this.setState({
            dateArr: dateList
        }, () => {
            this.getDetailDate(this.state.dateArr)
        })
    }
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    getDetailDate(data){//获取设计到的年月中的详细日期
        let list=[],dayCount=0,dayIn=0,temp=[];
        const {slot, isSingle} = this.props.navigation.state.params;
        for(let i=0; i<data.length; i++) {
            temp=[];
            dayCount=getDaysOfMonth(data[i].y, data[i].m); //获取当月的天数
            dayIn=getFirstDay(data[i].y, data[i].m); //获取当月第一天日期前有几个空格
            for(let j=0;j<dayCount;j++) {
                temp.push({
                    day: j+1,
                    status: 0
                });
                if(slot.long_day==1) {
                    if(this.parseDate(data[i].y+'-'+data[i].m+'-'+(j+1))==this.parseDate(slot.date)) {
                        temp[j].status = 1
                    } else {
                        if(temp[j].status === 1) {
                            temp[j].status = 1
                        } else {
                            temp[j].status = 0
                        }

                    }
                }else {
                    let slots = getAll(slot.begin_date, slot.end_date)
                    for(let y=0; y<slots.length; y++) {
                        if(this.parseDate(data[i].y+'-'+data[i].m+'-'+(j+1))>=this.parseDate(slots[y])&&this.parseDate(data[i].y+'-'+data[i].m+'-'+(j+1))<=this.parseDate(slots[y])) {
                            temp[j].status = 1
                        } else {
                            if(temp[j].status === 1) {
                                temp[j].status = 1
                            } else {
                                temp[j].status = 0
                            }

                        }
                    }
                }
            }
            if (dayIn != 7){
                for(let k=0;k<dayIn;k++){
                    temp.unshift(" ");
                }
            }
            list.push({
                y:data[i].y,
                m:data[i].m,
                list:temp,
            });

            this.setState({
                calendarList:list
            })

        }
    }
    getLeftButton(){
        return <View style={CommonStyle.flexStart}>
                <TouchableOpacity
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
                {
                    this.state.isShowDetail
                    ?
                        <Text style={{
                            color:'#333',
                            fontSize: 17,
                            marginLeft: 5
                        }}>{this.state.titleDate}</Text>
                    :
                        null
                }
            </View>

    }
    getRightButton(){
        return <TouchableOpacity
            style={[CommonStyle.flexStart,{paddingRight: width*0.03}]}
            onPress={()=>{
                NavigatorUtils.goPage({},'LongTime')
            }}
        >
            <Text style={{
                color:this.props.theme,
                fontSize: 14
            }}>添加日期</Text>
            {
                this.timeIndex&&this.state.isShowDetail
                ?
                    <Text style={{
                        color:'#666',
                        marginLeft: 15
                    }}
                    onPress={()=>{
                        NavigatorUtils.goPage({}, 'BatchDelete')
                    }}
                    >批量删除</Text>
                :
                    null
            }

        </TouchableOpacity>
    }
    clickDateItem(i, index, day){
        this._packUpCal();
        let titelDate = this.state.calendarList[i];
        let initRow =Math.ceil(titelDate.list.length / 7) ;
        let row = 0;
        for(let i=1; i<=initRow; i++){
            if((index+1) <= i*7 && (index+1)>(i-1)*7) {
                row = i
            }
        }
        let data = titelDate.list.slice((row-1)*7, (row-1)*7+7);
        this.setState({
            packData: data,
            titleDate: titelDate.y+'年'+titelDate.m+'月',
            dayIndex: index - ((row-1) * 7),
            date: day
        },() => {
            this.loadSlotDetail()
        })
    }
    loadSlotDetail(val) {
        if(val) {
            this.setState({
                isLoading: true
            });
        }
        const {token, activity_id} = this.props;
        const {date} = this.state;
        let formData=new FormData();
        formData.append('token',token);
        formData.append('version','2.0');
        formData.append('activity_id',activity_id);
        formData.append('date',date);
        Fetch.post(NewHttp+'ActivitySlotDetailTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    slotData: res.data,
                    isLoading: false,
                    singleData: []
                })
            }
        })
    }
    clickLitleItem(index, day){
        let dates=this.state.date.split('-');
        dates[2] = day;
        dates=dates.join('-');
        this.setState({
            dayIndex: index,
            date: dates
        },() => {
            this.loadSlotDetail();
        })
    }
    render(){
        let Day = <View style={CommonStyle.flexCenter}>
            <View style={[CommonStyle.flexStart,CommonStyle.commonWidth]}>
                {this.days.map((item, index) => {
                    return <View key={index} style={[styles.day_item,CommonStyle.flexCenter,{
                        marginLeft:index===0?0:10
                    }]}>
                        <Text style={{color: '#7D7D7E',fontSize: 12}}>{item}</Text>
                    </View>
                })}
            </View>
        </View>;
        let date = [];
        const {calendarList} = this.state;
        for (let i=0; i<calendarList.length; i++) {
            date.push(
                <View key={i} style={[CommonStyle.commonWidth,{
                    marginBottom:i===(calendarList.length-1)?80:0
                }]}>
                    <Text style={styles.year_title}>{calendarList[i].y}年{calendarList[i].m}月</Text>
                    <View style={[CommonStyle.flexStart,{flexWrap: 'wrap'}]}>
                        {
                            calendarList[i].list.map((item, index) => {
                                return <View key={index}>
                                        {
                                            item.status
                                            ?
                                                <TouchableOpacity style={[CommonStyle.flexCenter,styles.day_one,{
                                                    marginLeft: index%7===0?0:10,
                                                    backgroundColor: '#fff'
                                                }]} onPress={()=>this.clickDateItem(i, index,calendarList[i].y+'-'+calendarList[i].m+'-'+item.day)}>
                                                    <Text style={{
                                                        color:'#333',
                                                        fontWeight: "bold"
                                                    }}>{item.day}</Text>
                                                </TouchableOpacity>
                                                :
                                                <View style={[CommonStyle.flexCenter,styles.day_one,{
                                                    marginLeft: index%7===0?0:10,
                                                    backgroundColor: '#fff'
                                                }]}>
                                                    <Text style={{
                                                        color:'#cdcdcd',
                                                    }}>{item.day}</Text>
                                                </View>
                                        }

                                </View>
                            })
                        }
                    </View>
                </View>
            )
        }
        const {theme} = this.props;
        const {isSingle} = this.props.navigation.state.params;
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={this.state.isShowDetail?'':isSingle?'单天体验日期':'多天体验日期'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <View style={{
                    borderBottomColor: '#f5f5f5',
                    paddingBottom: 3,
                    borderBottomWidth: 1,
                    backgroundColor: '#fff'
                }}>
                    {Day}
                </View>
                <Animated.ScrollView
                    ref={c => this.scrollPad = c}
                    overScrollMode='never'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor:'#fff',
                        height:this.state.scrollHeight.interpolate({
                            inputRange: [
                                0,
                                height
                            ],
                            outputRange: [-height, 0],
                            extrapolate: 'clamp',
                        }),
                        maxHeight:this.state.scrollHeight
                    }}
                >
                    <View >
                        {
                            this.state.isShowDetail
                            ?
                                <View style={{marginLeft: width*0.03}}>
                                    <View style={[CommonStyle.flexStart,{height: (width*0.94 - 60) / 7}]}>
                                        {
                                            this.state.packData.map((item, index) => {
                                                return <View key={index}>
                                                        {
                                                            item.status
                                                            ?
                                                                <TouchableOpacity key={index} style={[CommonStyle.flexCenter,styles.day_one,{
                                                                    marginLeft: index%7===0?0:10,
                                                                    backgroundColor: this.state.dayIndex===index?theme:'#fff'
                                                                }]} onPress={()=>{this.clickLitleItem(index, item.day)}}>
                                                                    <Text style={{
                                                                        color:this.state.dayIndex===index?"#fff":'#333',
                                                                        fontWeight: 'bold'
                                                                    }}>{item.day}</Text>
                                                                </TouchableOpacity>
                                                            :
                                                                <View key={index} style={[CommonStyle.flexCenter,styles.day_one,{
                                                                    marginLeft: index%7===0?0:10,
                                                                    backgroundColor: '#fff'
                                                                }]}>
                                                                    <Text style={{
                                                                        color:'#cdcdcd'
                                                                    }}>{item.day}</Text>
                                                                </View>
                                                        }
                                                    </View>

                                            })
                                        }
                                    </View>
                                    <View style={[CommonStyle.flexCenter,{
                                        height: 30,
                                        marginLeft: -(width*0.03),
                                        justifyContent: 'flex-end'
                                    }]}>
                                        <AntDesign
                                            name={'down'}
                                            size={20}
                                            style={{color:'#666'}}
                                            onPress={()=>{
                                                this._packDownCal()
                                            }}
                                        />
                                    </View>
                                </View>
                            :
                                <View style={{marginLeft: width*0.03}}>
                                    {date}
                                </View>
                        }
                    </View>
                </Animated.ScrollView>
                {
                    this.state.isShowDetail
                    ?
                        <ScrollView>
                            <View>
                                <DateDetail initData={()=>{this.loadSlotDetail(true)}} {...this.state} {...this.props} timeIndex={this.timeIndex} slot={this.state.slotData}/>
                            </View>
                        </ScrollView>
                    :
                        null
                }



            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    day_item:{
        width:(width*0.94 - 60) / 7,
        height: 40
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
    scrollPadStyle:{
        position: 'absolute',
        width: width,
        height: (width*0.94-60)/7,
        top: 132,
        left: 0,
        right:0,
        zIndex:999,
        backgroundColor: '#fff'
    },
    detailTitle: {
        color: '#999999',
        fontSize: 13
    },
    normalText: {
        color: '#333',
        fontSize: 13
    },
    packageItem: {
        width: 165,
        height: 40,
        backgroundColor: '#f5f7fa',
        borderRadius: 5,
        paddingLeft: 9.5,
        paddingRight: 9.5
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    longDay: state.steps.longDay,
    token: state.token.token,
    activity_id: state.steps.activity_id,
})
export default connect(mapStateToProps)(Calendar)
class DateDetail extends Component{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {

    }
    goDel(slot_id) {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('activity_id', this.props.activity_id);
        formData.append('is_all',0);
        formData.append('slot_id',slot_id);
        formData.append('version','2.0');
        Fetch.post(NewHttp+'ActivitySlotDelTwo', formData).then(res => {
            if(res.code === 1) {
                NavigatorUtils.backToUp(this.props, true)
            }
        })
    }
    delInfo(index) {
        const {slot, slotData} = this.props;
        const slots = this.props.navigation.state.params.slot;
        if(slots.long_day === 1) {
            Alert.alert('删除','确定删除'+slotData[index].date+' '+slotData[index].begin_time+' -- '+slotData[index].end_time+'该天该时间段体验吗？',[
                {text:'取消'},
                {text:'确定', onPress: () => {this.goDel(slotData[index].slot_id)}}
            ],{
                cancelable: false,
            })
        }else{
            Alert.alert('删除','确定删除'+slotData[index].begin_date+'至'+slotData[index].end_date+'该时间段体验吗？',[
                {text:'取消'},
                {text:'确定', onPress: () => {this.goDel(slotData[index].slot_id)}}
            ],{
                cancelable: false,
            })
        }

    }
    editInfo(index) {
        let _this = this;
        const slots = this.props.navigation.state.params.slot;
        NavigatorUtils.goPage({
            timeIndex: this.props.timeIndex,
            slotInfo: slots.long_day?this.props.slotData[index]:this.props.slotData[0],
            isEdit: true,
            long_day: slots.long_day,
            refresh: function () {
                _this.props.initData()
            }
        }, 'LongTime')
    }
    render(){
        const {slotData} = this.props;
        const slots = this.props.navigation.state.params.slot;
        return(
            <View style={CommonStyle.flexCenter}>
                <View style={[CommonStyle.commonWidth,{
                    paddingTop: 21.5,
                    paddingBottom: 21.5,
                    paddingLeft: 14.5,
                    paddingRight: 14.5,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    marginTop: 10,
                    minHeight:200
                }]}>
                    {
                        this.props.isLoading
                        ?
                            <View style={CommonStyle.flexCenter}>
                                <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
                            </View>
                        :
                            <View>
                                {
                                    slotData&&slotData.length>0
                                    ?
                                    slotData.map((item, index) => {
                                        return <View key={index} style={{
                                            marginTop: index===0?0: 20
                                        }}>
                                            <View style={CommonStyle.flexStart}>
                                                <AntDesign
                                                    name={'clockcircle'}
                                                    size={12}
                                                    style={{color: '#CFD0D1'}}
                                                />
                                                {
                                                    slots.long_day === 1
                                                    ?
                                                        <Text style={{color: '#333',fontWeight: "bold",marginLeft: 10}}>
                                                            {item.date} {item.begin_time} -- {item.end_time}{item.long_day}
                                                        </Text>
                                                    :
                                                        <Text style={{color: '#333',fontWeight: "bold",marginLeft: 10}}>
                                                            {
                                                                item
                                                                ?
                                                                item.begin_date.split('-')[1]+'月'+item.begin_date.split('-')[2]+'日'+item.begin_time
                                                                :
                                                                ''
                                                            }
                                                            -
                                                            {
                                                                item
                                                                    ?
                                                                    item.end_date.split('-')[1]+'月'+item.end_date.split('-')[2]+'日'+item.end_time
                                                                    :
                                                                    ''
                                                            }
                                                        </Text>
                                                }

                                            </View>
                                            {
                                                !this.props.navigation.state.params.isSingle
                                                    ?
                                                    <Text style={{
                                                        color:this.props.theme,
                                                        fontSize: 12,
                                                        marginTop: 10
                                                    }}>注：当前为多天体验，修改内容将会对应到当前多天体验的每一天</Text>
                                                    :
                                                    null
                                            }
                                            <View style={[CommonStyle.flexStart,{
                                                marginTop: 20
                                            }]}>
                                                <Text style={styles.detailTitle}>体验人数</Text>
                                                <Text style={{color: '#333',marginLeft: 20,fontSize: 13}}>{item?item.max_person_num:0}人</Text>
                                            </View>
                                            <View style={[CommonStyle.flexStart,{
                                                marginTop: 25,
                                                alignItems:'flex-start'
                                            }]}>
                                                <Text style={styles.detailTitle}>价格</Text>
                                                <View style={{marginLeft: 20}}>
                                                    <View style={CommonStyle.flexStart}>
                                                        <Text style={styles.normalText}>标准</Text>
                                                        {
                                                            item&&item.is_discount
                                                                ?
                                                                <View style={[CommonStyle.flexStart,{marginLeft: 15}]}>
                                                                    <AntDesign
                                                                        name={'tago'}
                                                                        size={12}
                                                                        style={{color:'#333'}}
                                                                    />
                                                                    <Text style={[styles.normalText,{marginLeft:3}]}>{parseFloat(item.price_discount)}折</Text>
                                                                </View>
                                                                :
                                                                null
                                                        }
                                                        <Text style={[styles.normalText,{marginLeft:15}]}>
                                                            ¥{
                                                            item?
                                                                parseFloat(item.price_discount)===0 || parseFloat(item.price_discount)===10
                                                                    ?
                                                                    parseFloat(item.price_origin)
                                                                    :
                                                                    parseFloat(item.price)
                                                                :
                                                                null
                                                        }/人
                                                        </Text>
                                                    </View>
                                                    <View style={[CommonStyle.flexStart,{
                                                        marginTop: 19.5
                                                    }]}>
                                                        <Text style={styles.normalText}>儿童</Text>
                                                        {
                                                            item&&item.is_discount
                                                                ?
                                                                <View style={[CommonStyle.flexStart,{marginLeft: 15}]}>
                                                                    <AntDesign
                                                                        name={'tago'}
                                                                        size={12}
                                                                        style={{color:'#333'}}
                                                                    />
                                                                    <Text style={[styles.normalText,{marginLeft:3}]}>{parseFloat(item.kids_price_discount)}折</Text>
                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        <Text style={[styles.normalText,{marginLeft:15}]}>
                                                            ¥{
                                                            item?
                                                                parseFloat(item.kids_price_discount) === 0 || parseFloat(item.kids_price_discount) === 10
                                                                    ?
                                                                    parseFloat(item.kids_price_origin)
                                                                    :
                                                                    parseFloat(item.kids_price)
                                                                :
                                                                null
                                                        }/人
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            {
                                                item&&item.combine.length>0
                                                    ?
                                                    <View style={[CommonStyle.flexStart,{
                                                        alignItems:'flex-start',
                                                        marginTop: 25
                                                    }]}>
                                                        <View>
                                                            <Text style={styles.detailTitle}>套餐</Text>
                                                        </View>
                                                        <View style={{marginLeft: 15}}>
                                                            {/*亲子*/}
                                                            {
                                                                item
                                                                    ?
                                                                    item.combine.map((items, index) => {
                                                                        return <View key={index}>
                                                                            {
                                                                                items.type===1
                                                                                ?
                                                                                    <View style={[styles.packageItem,CommonStyle.spaceRow,{
                                                                                        marginTop:index===0?0:10
                                                                                    }]}>
                                                                                        <View style={[CommonStyle.flexStart]}>
                                                                                            <Text style={styles.normalText}>{items.type===1?'亲子':items.name}</Text>
                                                                                            <Text style={[styles.normalText,{marginLeft:3}]}>
                                                                                                {items.adult}{items.type===1?'成':null}人{items.type===1?items.kids+'儿童':null}
                                                                                            </Text>
                                                                                        </View>
                                                                                        <Text style={{color:'#033333',fontSize:13}}>¥{parseFloat(items.price)}</Text>
                                                                                    </View>
                                                                                :
                                                                                    null
                                                                            }
                                                                        </View>
                                                                    })
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                item
                                                                    ?
                                                                    item.combine.map((items, index) => {
                                                                        return <View key={index}>
                                                                            {
                                                                                items.type===2
                                                                                ?
                                                                                    <View key={index} style={[styles.packageItem,CommonStyle.spaceRow,{
                                                                                        marginTop:index===0?0:10
                                                                                    }]}>
                                                                                        <View style={[CommonStyle.flexStart]}>
                                                                                            <Text style={styles.normalText}>{items.type===1?'亲子':items.name}</Text>
                                                                                            <Text style={[styles.normalText,{marginLeft:3}]}>
                                                                                                {items.adult}{items.type===1?'成':null}人{items.type===1?items.kids+'儿童':null}
                                                                                            </Text>
                                                                                        </View>
                                                                                        <Text style={{color:'#033333',fontSize:13}}>¥{parseFloat(items.price)}</Text>
                                                                                    </View>
                                                                                :
                                                                                    null
                                                                            }
                                                                        </View>
                                                                    })
                                                                    :
                                                                    null
                                                            }

                                                        </View>
                                                    </View>
                                                    :
                                                    null
                                            }

                                            <View style={[CommonStyle.flexEnd,{
                                                marginTop: 20
                                            }]}>
                                                <Text
                                                    style={{color:'#a4a4a4',marginRight: 15}}
                                                    onPress={() => {
                                                        this.editInfo(index)
                                                    }}
                                                >编辑</Text>
                                                <Text
                                                    style={{color:'#a4a4a4'}}
                                                    onPress={()=>{
                                                        this.delInfo(index)
                                                    }}
                                                >删除</Text>
                                            </View>
                                        </View>
                                    })
                                   :
                                    null
                                }

                            </View>
                    }

                </View>
            </View>
        )
    }
}

import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, Animated} from 'react-native';
import {connect} from 'react-redux'
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {objRemoveDuplicated, getDaysOfMonth, getFirstDay, removeDuplicatedItem, getAll} from '../../../../../../utils/auth'
const {width, height} = Dimensions.get('window')
class Calendar extends Component{
    constructor(props) {
        super(props);
        this.days=['日','一','二','三','四','五','六']
        this.state = {
            dateArr: [],
            calendarList: [],
            isShowDetail: false,
            scrollHeight: new Animated.Value(height),
            packData: [],
            titleDate: '',
            dayIndex: -1
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
        const {longDay} = this.props;
        let dateList = [];
        for(let i=0; i<longDay.length; i++) {
            let data = getAll(longDay[i].longDayTime.beginTime, longDay[i].longDayTime.endTime);
            for(let j=0; j<data.length; j++) {
                dateList.push({
                    y:data[j].split('-')[0],
                    m:data[j].split('-')[1],
                })
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
        const {longDay} = this.props;
        for(let i=0; i<data.length; i++) {
            temp=[];
            dayCount=getDaysOfMonth(data[i].y, data[i].m); //获取当月的天数
            dayIn=getFirstDay(data[i].y, data[i].m); //获取当月第一天日期前有几个空格
            for(let j=0;j<dayCount;j++) {
                temp.push({
                    day: j+1,
                    status: 0
                });
                for(let y=0; y<longDay.length; y++) {
                    if(this.parseDate(data[i].y+'-'+data[i].m+'-'+(j+1))>=this.parseDate(longDay[y].longDayTime.beginTime)&&this.parseDate(data[i].y+'-'+data[i].m+'-'+(j+1))<=this.parseDate(longDay[y].longDayTime.endTime)) {
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
        return <View style={{paddingRight: width*0.03}}>
            <Text style={{
                color:this.props.theme,
                fontSize: 16
            }}>添加日期</Text>
        </View>
    }
    clickDateItem(i, index){
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
            dayIndex: index - ((row-1) * 7)
        })
    }
    clickLitleItem(index){
        this.setState({
            dayIndex: index
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
                                                }]} onPress={()=>this.clickDateItem(i, index)}>
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
        const {theme} = this.props
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={this.state.isShowDetail?'':'多天体验日期'}
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
                                                                }]} onPress={()=>{this.clickLitleItem(index)}}>
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
                                <DateDetail />
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
    longDay: state.steps.longDay
})
export default connect(mapStateToProps)(Calendar)
class DateDetail extends Component{
    render(){
        return(
            <View style={CommonStyle.flexCenter}>
                <View style={[CommonStyle.commonWidth,{
                    paddingTop: 21.5,
                    paddingBottom: 21.5,
                    paddingLeft: 14.5,
                    paddingRight: 14.5,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    marginTop: 10
                }]}>
                    <View style={CommonStyle.flexStart}>
                        <AntDesign
                            name={'clockcircle'}
                            size={12}
                            style={{color: '#CFD0D1'}}
                        />
                        <Text style={{color: '#333',fontWeight: "bold",marginLeft: 10}}>3月1日09：00-3月16日14：00</Text>
                    </View>
                    <View style={[CommonStyle.flexStart,{
                        marginTop: 25
                    }]}>
                        <Text style={styles.detailTitle}>体验人数</Text>
                        <Text style={{color: '#333',marginLeft: 20,fontSize: 13}}>10人</Text>
                    </View>
                    <View style={[CommonStyle.flexStart,{
                        marginTop: 25,
                        alignItems:'flex-start'
                    }]}>
                        <Text style={styles.detailTitle}>价格</Text>
                        <View style={{marginLeft: 20}}>
                            <View style={CommonStyle.flexStart}>
                                <Text style={styles.normalText}>标准</Text>
                                <View style={[CommonStyle.flexStart,{marginLeft: 15}]}>
                                    <AntDesign
                                        name={'tago'}
                                        size={12}
                                        style={{color:'#333'}}
                                    />
                                    <Text style={[styles.normalText,{marginLeft:3}]}>5折</Text>
                                </View>
                                <Text style={[styles.normalText,{marginLeft:15}]}>¥129/人</Text>
                            </View>
                            <View style={[CommonStyle.flexStart,{
                                marginTop: 19.5
                            }]}>
                                <Text style={styles.normalText}>标准</Text>
                                <View style={[CommonStyle.flexStart,{marginLeft: 15}]}>
                                    <AntDesign
                                        name={'tago'}
                                        size={12}
                                        style={{color:'#333'}}
                                    />
                                    <Text style={[styles.normalText,{marginLeft:3}]}>5折</Text>
                                </View>
                                <Text style={[styles.normalText,{marginLeft:15}]}>¥129/人</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexStart,{
                        alignItems:'flex-start',
                        marginTop: 25
                    }]}>
                        <View>
                            <Text style={styles.detailTitle}>套餐</Text>
                        </View>
                        <View style={{marginLeft: 15}}>
                            <View style={[styles.packageItem,CommonStyle.spaceRow]}>
                                <View style={[CommonStyle.flexStart]}>
                                    <Text style={styles.normalText}>亲子</Text>
                                    <Text style={[styles.normalText,{marginLeft:3}]}>2成人1儿童</Text>
                                </View>
                                <Text style={{color:'#033333',fontSize:13}}>¥129</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexEnd,{
                        marginTop: 20
                    }]}>
                        <Text style={{color:'#a4a4a4',marginRight: 15}}>编辑</Text>
                        <Text style={{color:'#a4a4a4'}}>删除</Text>
                    </View>

                </View>
            </View>
        )
    }
}

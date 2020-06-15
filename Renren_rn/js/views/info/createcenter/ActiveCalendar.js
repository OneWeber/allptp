import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TouchableHighlight} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux';
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import Modal from 'react-native-modalbox';
import action from '../../../action';
class ActiveCalendar extends Component{
    constructor(props) {
        super(props);
        this.state = {
            planningList: [],
            items: {},
            activity_id:'',
            long_day:'',
            online:'',
            img:'',
            title:'',
            create_time:'',
        }
    }
    componentWillMount() {
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        Fetch.post(NewHttp+'ActivityListTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    planningList: res.data
                },()=>{
                    console.log(this.state.planningList)
                })
            }
        })
    }
    getLeftButton() {
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
    parseDate(str) { // 字符串转时间戳
        return Date.parse(new Date(Date.parse(str.replace(/-/g, "/")))) ;
    }
    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
    loadItems(day) {
        const {items, planningList} = this.state;
        setTimeout(() => {
            for(let i=-15; i<85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if(!items[strTime]) {
                    items[strTime] = [];
                    if(planningList.length>0) {
                        for(let i=0;i<planningList.length;i++) {
                            for(let j=0; j<planningList[i].slot.length;j++) {
                                if(planningList[i].long_day === 1) {
                                    if(this.parseDate(strTime)===this.parseDate(planningList[i].slot[j].day?planningList[i].slot[j].day:'')) {
                                        items[strTime].push({
                                            title:planningList[i].title,
                                            img:planningList[i].cover.domain + planningList[i].cover.image_url,
                                            long_day:planningList[i].long_day,
                                            slot:planningList[i].slot[j],
                                            create_time:planningList[i].create_time,
                                            activity_id:planningList[i].activity_id,
                                            online:planningList[i].online,
                                            differ: planningList[i].differ
                                        })
                                    }
                                }else{
                                    if(this.parseDate(strTime)>=this.parseDate(planningList[i].slot[j].begin_date?planningList[i].slot[j].begin_date:'') && this.parseDate(strTime)<=this.parseDate(planningList[i].slot[j].end_date?planningList[i].slot[j].end_date:'')) {
                                        items[strTime].push({
                                            title:planningList[i].title,
                                            img:planningList[i].cover.domain + planningList[i].cover.image_url,
                                            online:planningList[i].online,
                                            create_time:planningList[i].create_time,
                                            refund_num: planningList[i].refund_num,
                                            enroll_count: planningList[i].enroll_count,
                                            sale_num: planningList[i].sale_num,
                                            activity_id:planningList[i].activity_id,
                                            status: planningList[i].status,
                                            is_doing: planningList[i].is_doing,
                                            long_day:planningList[i].long_day,
                                            slot:planningList[i].slot,
                                            differ: planningList[i].differ
                                        })
                                    }
                                }
                            }
                        }
                    }else{
                        items[strTime].push({
                            title: '当前没有活动'
                        })
                    }
                }
            }
            const newItems = {};
            Object.keys(items).forEach(key => {newItems[key] = items[key];});
            this.setState({
                items: newItems
            });
        },1000)
    }
    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
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
    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text style={{color:'#999999',fontSize:16}}>今天没有体验哦!</Text></View>
        );
    }
    renderItem(item) {
        return <View style={{width: '100%'}}>
            {
                item.long_day === 1
                ?
                    <View style={[styles.item, {height: item.height}]}>
                        {
                            item.differ.length > 0
                            ?
                                <Text style={{fontSize: 12, color:this.props.theme}}>
                                    【返差价】活动结束时同时间段内参与者
                                    {
                                        item.differ.map((item, index) => {
                                            return <Text key={index}>
                                                满{item.num}人,返预付{parseFloat(item.refund_rate)}%；
                                            </Text>
                                        })
                                    }
                                </Text>
                            :
                                null
                        }
                        <View style={{
                            width:'100%',
                            height:35,
                            justifyContent:'space-between',
                            alignItems:'center',
                            flexDirection:'row'
                        }}>
                            <Text style={{color:item.online==1?"#999999":"#666666",fontSize:12}}>发布时间:{item.create_time}</Text>
                            <Text style={{color:'#666666',fontSize:12}}>单天体验</Text>
                        </View>
                        <View style={{width:'100%',height:140,marginTop:5,position:'relative'}}>
                            <LazyImage
                                source={item.img?{uri:item.img}:require('../../../../assets/images/error.png')}
                                style={{width:'100%',height:140,borderRadius: 5}}
                            />
                            <AntDesign
                                name="ellipsis1"
                                size={25}
                                style={{color:'#ffffff',position:'absolute',right:10,top:5,zIndex:60}}
                                onPress={()=>{
                                    this.refs.doing.open();
                                    this.setState({
                                        online:item.online,
                                        activity_id:item.activity_id,
                                        long_day:item.long_day,
                                        img:item.img,
                                        title:item.title,
                                        create_time:item.create_time
                                    })
                                }}
                            />
                        </View>
                        <Text style={{marginTop:10,color:'#333'}}>{item.title}</Text>
                        <View style={{width:'100%'}}>
                            {
                                item.slot.list.map((items,index)=>{
                                    return <View style={{width:'100%'}} key={index}>
                                        <Text style={{marginTop:15,color:'#666666'}}>{items.time[0]} -- {items.time[1]} <Text style={{color:'orange',fontSize:12}}>{items.status==2?' 已过期':null}</Text></Text>
                                        <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:35,marginTop:5}}>
                                            <TouchableHighlight
                                                underlayColor='rgba(255,255,255,.1)'
                                                style={styles.item_btns}
                                            >
                                                <View style={{width:'100%',justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:"#e8e8e8"}}>
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.item_txt,{color:items.online==1?"#999999":"#525252"}]}>退款申请({items.refund_num})</Text>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                underlayColor='rgba(255,255,255,.1)'
                                                style={styles.item_btns}
                                            >
                                                <View style={{width:'100%',justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:"#e8e8e8"}}>
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.item_txt,{color:items.online==1?"#999999":"#525252"}]}>志愿者申请({items.enroll_count})</Text>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                underlayColor='rgba(255,255,255,.1)'
                                                style={styles.item_btns}
                                            >
                                                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.item_txt,{color:items.online==1?"#999999":"#525252"}]}>预定({items.order_num})</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                })
                            }
                        </View>

                    </View>
                :
                    <View style={[styles.item, {height: item.height}]}>
                        {
                            item.differ.length > 0
                                ?
                                <Text style={{fontSize: 12, color:this.props.theme}}>
                                    【返差价】活动结束时同时间段内参与者
                                    {
                                        item.differ.map((item, index) => {
                                            return <Text key={index}>
                                                满{item.num}人,返预付{parseFloat(item.refund_rate)}%；
                                            </Text>
                                        })
                                    }
                                </Text>
                                :
                                null
                        }
                        <View style={{
                            width:'100%',
                            height:35,
                            justifyContent:'space-between',
                            alignItems:'center',
                            flexDirection:'row'
                        }}>
                            <Text style={{color:item.online==1?"#999999":"#666666",fontSize:12}}>发布时间:{item.create_time}</Text>
                            <AntDesign
                                name="ellipsis1"
                                size={22}
                                style={{color:item.online==1?"#999999":"#666666"}}
                                onPress={()=>{
                                    this.refs.doing.open();
                                    this.setState({
                                        online:item.online,
                                        activity_id:item.activity_id,
                                        long_day:item.long_day,
                                        img:item.img,
                                        title:item.title,
                                        create_time:item.create_time
                                    })
                                }}
                            />
                        </View>
                        <View style={{position:'relative',marginTop:5}}>
                            <LazyImage
                                source={item.img?{uri:item.img}:require('../../../../assets/images/error.png')}
                                style={{width:'100%',height:140,borderRadius: 5}}
                            />
                            {
                                item.online==1
                                    ?
                                    <View style={{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:"rgba(255,255,255,.4)",justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{color:"#ffffff",fontSize:12}}>已取消</Text>
                                    </View>
                                    :
                                    <View style={{
                                        position:"absolute",
                                        left:0,
                                        right:0,
                                        bottom:0,
                                        backgroundColor:"rgba(0,0,0,.4)",
                                        justifyContent:'flex-end',
                                        alignItems:'center',
                                        height:20,
                                        borderBottomLeftRadius:3,
                                        borderBottomRightRadius:3,
                                        flexDirection:"row"
                                    }}>
                                        {
                                            item.status==0
                                                ?
                                                <Text style={{color:"#ffffff",fontSize:10,marginRight:3}}>
                                                    {
                                                        item.is_doing==0
                                                            ?
                                                            "未进行"
                                                            :
                                                            "进行中"
                                                    }
                                                </Text>
                                                :
                                                item.status==2
                                                    ?
                                                    <Text style={{color:"#ffffff",fontSize:10,marginRight:3}}>已过期</Text>
                                                    :
                                                    null
                                        }
                                    </View>
                            }
                        </View>
                        <Text style={{marginTop:10,color:'#333333'}}>{item.title}</Text>
                        <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',height:35,marginTop:10}}>
                            <TouchableHighlight
                                underlayColor='rgba(255,255,255,.1)'
                                style={styles.item_btns}
                            >
                                <View style={{width:'100%',justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:"#e8e8e8"}}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:item.online==1?"#999999":"#525252",fontSize:12,borderRightWidth:1,borderRightColor:"#e8e8e8"}}>退款申请({item.refund_num})</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor='rgba(255,255,255,.1)'
                                style={styles.item_btns}
                            >
                                <View style={{width:'100%',justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:"#e8e8e8"}}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:item.online==1?"#999999":"#525252",fontSize:12,borderRightWidth:1,borderRightColor:"#e8e8e8"}}>志愿者申请({item.enroll_count})</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor='rgba(255,255,255,.1)'
                                style={styles.item_btns}
                            >
                                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:item.online==1?"#999999":"#525252",fontSize:12,borderRightWidth:1,borderRightColor:"#e8e8e8"}}>预定({item.sale_num})</Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>
            }
        </View>
    }
    _inviteVol() {
        this.refs.doing.close();
        NavigatorUtils.goPage({
            activity_id: this.state.activity_id,
            long_day: this.state.long_day,
            create_time: this.state.create_time
        }, 'InviteVol')
    }
    myInvite() {
        this.refs.doing.close();
        NavigatorUtils.goPage({
            activity_id:this.state.activity_id,
        },'MyInvite')
    }
    changeActive() {
        this.refs.doing.close();
        const {changeActivityId} = this.props;
        changeActivityId(this.state.activity_id);
        NavigatorUtils.goPage({},'Language')
    }
    _cancelActive() {
        this.refs.doing.close();
        NavigatorUtils.goPage({
            activity_id:this.state.activity_id,
        },'CancelActive')
    }
    render() {
        const {planningList} = this.state;
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'体验日历'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <Agenda
                    items={this.state.items}
                    selected={this.getNowFormatDate()}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    loadItemsForMonth={planningList.length>0?this.loadItems.bind(this):null}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    monthFormat={'yyyy MM'}
                    // markingType={'period'}
                    // monthFormat={'yyyy'}
                    // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                    //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                />
                <Modal
                    style={{height:395,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"doing"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 395,
                        backgroundColor: '#fff'
                    }}>
                        {
                            this.state.online==1
                                ?
                                <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                                    <Text style={{color:"#999999"}}>邀请志愿者</Text>
                                </View>
                                :
                                <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                                    <TouchableHighlight
                                        underlayColor='rgba(0,0,0,.1)'
                                        style={{width:"100%",height:55,justifyContent:'center',alignItems:'center',}}
                                        onPress={()=>{
                                            this._inviteVol()
                                        }}
                                    >
                                        <Text style={{color:"#333333"}}>邀请志愿者</Text>
                                    </TouchableHighlight>
                                </View>
                        }
                        <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                            <TouchableHighlight
                                underlayColor='rgba(0,0,0,.1)'
                                style={{width:"100%",height:55,justifyContent:'center',alignItems:'center'}}
                                onPress={() => {
                                    this.myInvite()
                                }}
                            >
                                <Text style={{color:"#333333"}}>我的邀请</Text>
                            </TouchableHighlight>
                        </View>
                        {
                            this.state.online==1
                                ?
                                <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                                    <Text style={{color:"#999999"}}>修改体验</Text>
                                </View>
                                :
                                <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                                    <TouchableHighlight
                                        underlayColor='rgba(0,0,0,.1)'
                                        style={{width:"100%",height:55,justifyContent:'center',alignItems:'center',}}
                                        onPress={() => {
                                            this.changeActive()
                                        }}
                                    >
                                        <Text style={{color:"#333333"}}>修改体验</Text>
                                    </TouchableHighlight>
                                </View>
                        }
                        <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                            <TouchableHighlight
                                underlayColor='rgba(0,0,0,.1)'
                                style={{width:"100%",height:55,justifyContent:'center',alignItems:'center',}}
                                onPress={()=>{
                                    this._cancelActive()
                                }}
                            >
                                <Text style={{color:"#333333"}}>取消体验</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                            <TouchableHighlight
                                underlayColor='rgba(0,0,0,.1)'
                                style={{width:"100%",height:55,justifyContent:'center',alignItems:'center',}}
                            >
                                <Text style={{color:"#333333"}}>恢复体验</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                            <TouchableHighlight
                                underlayColor='rgba(0,0,0,.1)'
                                style={{width:"100%",height:55,justifyContent:'center',alignItems:'center',}}
                            >
                                <Text style={{color:"#333333"}}>删除体验</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{width:"100%",height:10,backgroundColor:"#f5f5f5"}}>

                        </View>
                        <View style={{width:"100%",height:55,justifyContent:'center', alignItems:'center',borderBottomWidth:1,borderBottomColor:"#f5f5f5"}}>
                            <TouchableHighlight
                                underlayColor='rgba(0,0,0,.1)'
                                style={{width:"100%",height:55,justifyContent:'center',alignItems:'center',}}
                                onPress={()=>{this.refs.doing.close()}}
                            >
                                <Text style={{color:"#333333"}}>返回</Text>
                            </TouchableHighlight>
                        </View>


                    </View>
                </Modal>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    item_btns:{
        width:'33.333%',
        height:50,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    },
    item_txt: {
        fontSize:12,
        borderRightWidth:1,
        borderRightColor:"#e8e8e8"
    }
})
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    changeActivityId: id => dispatch(action.changeActivityId(id)),
})
export default connect(mapStateToProps, mapDispatchToProps)(ActiveCalendar)

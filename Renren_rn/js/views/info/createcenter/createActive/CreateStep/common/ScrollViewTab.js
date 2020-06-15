import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import {connect} from 'react-redux'
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {objRemoveDuplicated, date} from '../../../../../../utils/auth';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-easy-toast';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
const {width} = Dimensions.get('window')
class ScrollViewTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            typeIndex: 0,
            timeList: [],
            dateList: [],
            selectDate: [],
            dateStaus: []
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('activity_id', this.props.activity_id);
        Fetch.post(NewHttp+'ActivitySlotTimeTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    timeList: res.data
                },() => {
                    const {timeList} = this.state;
                    this.loadDate(timeList[0].begin_time, timeList[0].end_time)
                })
            }
        })
    }
    loadDate(begin_time, end_time) {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('begin_time', begin_time);
        formData.append('end_time', end_time);
        formData.append('activity_id', this.props.activity_id);
        Fetch.post(NewHttp+'ActivitySlotDateTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    dateList: res.data
                },() => {
                    const {dateList} = this.state;
                    let data = [];
                    for(let i=0;i<dateList.length;i++) {
                        data.push(0)
                    }
                    this.setState({
                        dateStaus: data
                    })
                })
            }
        })
    }
    leftType() {
        return <FlatList
            ref={flat=>this.flat=flat}
            data={this.state.timeList}
            extraData={this.state.timeList}
            renderItem={(data) => this._renderItem(data)}
            keyExtractor={(item, index) => index.toString()}
        />
    }
    _changeType(index) {
        this.setState({
            typeIndex: index,
            selectDate: [],
            dateStaus: []
        },() => {
            const {timeList} = this.state;
            this.loadDate(timeList[index].begin_time, timeList[index].end_time)
            this.flat.scrollToIndex({viewPosition: 0.5, index: index})
        })
    }
    layout(e){
        console.log(e)
    }
    _renderItem(data) {
        const {typeIndex} = this.state;
        return <TouchableOpacity style={[styles.type_container_item,{
            backgroundColor: data.index===typeIndex?'#fff':'#f5f5f5',
            marginBottom: data.index===this.state.timeList.length-1?110:0
        }]}
             key={data.index}
             onPress={() => {
                 this._changeType(data.index)
             }}
        >
            <Text style={{
                color:'#333',
                fontSize: 12,
                fontWeight: data.index===typeIndex?'bold':'normal'
            }}>{data.item.begin_time} - {data.item.end_time}</Text>
            {
                data.index===typeIndex
                    ?
                    <View style={[styles.index_tabs,{
                        backgroundColor: this.props.theme
                    }]}></View>
                    :
                    null
            }
        </TouchableOpacity>
    }
    _contentScroll(e) {
        let index = this.state.typeIndex;
        let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        // if (offsetY + oriageScrollHeight >= contentSizeHeight) {
        //     console.log('到底了')
        // }
    }
    clickDate(item, index) {
        const {dateStaus} = this.state;
        let data = dateStaus;
        for(let i=0;i<data.length; i++) {
            if(i===index) {
                if(data[i]===0) {
                    data[i]=1
                }else{
                    data[i]=0
                }
            }
        }
        this.setState({
            dateStaus: data
        },() => {
            let selectDates = this.state.selectDate;
            const {dateStaus} = this.state;
            for(let i=0;i<dateStaus.length;i++) {
                if(index==i) {
                    if(dateStaus[i]===1) {
                        selectDates.push(this.state.dateList[i])
                    }else{
                        if(selectDates.length===1) {
                            selectDates = [];
                        }else{
                            selectDates.splice(i, 1)
                        }
                    }
                }
            }
            this.setState({
                selectDate: objRemoveDuplicated(selectDates)
            })
        })
    }
    delSlot() {
        let sData = this.state.selectDate;
        let subData = [];
        for(let i=0;i<sData.length;i++) {
            subData.push(
                date('Y-m-d', sData[i].date)
            )
        }
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('activity_id', this.props.activity_id);
        formData.append('begin_time', this.state.timeList[this.state.typeIndex].begin_time);
        formData.append('end_time', this.state.timeList[this.state.typeIndex].end_time);
        formData.append('date', JSON.stringify(subData));
        formData.append('is_all', 0);
        console.log('foramData', formData)
        Fetch.post(NewHttp+'ActivitySlotDelTwo', formData).then(res => {
            if(res.code === 1) {
                NavigatorUtils.goPage({}, 'Time')
            }
        })
    }
    render() {
        const {dateList, dateStaus, selectDate} = this.state;
        return (
            <View style={styles.container} layout={(event)=>this.layout(event)}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <View style={styles.type_container}>
                    {this.leftType()}
                </View>
                <View style={styles.detail_container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        onScroll={(event)=>{
                            this._contentScroll(event)
                        }}
                    >
                        <View style={[CommonStyle.flexStart,{
                            padding: 5,
                            flexWrap: 'wrap',
                            paddingBottom: 110
                        }]}>
                            {
                                dateList.map((item, index) => {
                                    return <TouchableOpacity key={index} style={{
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                        paddingBottom: 12,
                                        paddingTop: 12,
                                        backgroundColor: dateStaus[index]===1?'#ecfeff':'#F5F7FA',
                                        marginRight: 10,
                                        marginTop: 15,
                                        borderRadius: 4,
                                        borderColor: dateStaus[index]===1?this.props.theme:'#F5F7FA',
                                        borderWidth: 1
                                    }}
                                    onPress={() => {
                                        this.clickDate(item, index)
                                    }}
                                    >
                                        <Text style={{color:dateStaus[index]===1?this.props.theme:'#333',fontSize: 13}}>
                                            {item.date_temp}
                                        </Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                {
                    selectDate.length>0
                    ?
                        <SafeAreaView style={{
                            position:'absolute',
                            left:0,
                            right:0,
                            bottom:0,
                            backgroundColor:'#fff'
                        }}>
                            <View style={[CommonStyle.flexCenter,{
                                height:50
                            }]}>
                                <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                                    height:40,
                                    backgroundColor:this.props.theme,
                                    borderRadius: 4
                                }]}
                                onPress={() => {
                                    this.delSlot()
                                }}
                                >
                                    <Text style={{color:'#fff'}}>确认删除</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        position:'relative'
    },
    type_container: {
        width: 100,
        backgroundColor: '#f5f5f5'
    },
    detail_container: {
        width: width-100,
        flex: 1,
    },
    type_container_item: {
        width: 100,
        height: 60,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    index_tabs: {
        position: 'absolute',
        left: 0,
        top: 20,
        bottom: 20,
        width: 3,
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    activity_id: state.steps.activity_id,
    token: state.token.token
})
export default connect(mapStateToProps)(ScrollViewTab)

import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, FlatList} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
const {width, height} = Dimensions.get('window')
class Time extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '选择体验时间决定该体验是多天体验或单天体验',
            '根据体验的性质理性决定体验的时间段',
        ];
        this.timeNames = [
            {title:'举办多天体验', id: 0},
            {title:'举办单天体验', id: 1},
        ]
        this.state = {
            isOpenning: false,
            timeIndex: 0,
            dateIndex: -1
        }
    }
    changeIndex(index, id){
        if(index === this.state.timeIndex) {
            this.setState({
                timeIndex: -1
            })
        } else {
            this.setState({
                timeIndex: id
            })
        }
    }
    goLongTime(){
        NavigatorUtils.goPage({},'LongTime')
    }
    goNext(){

    }
    getWeekDay(date) {
        let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let myDate = new Date(Date.parse(date));
        return weekDay[myDate.getDay()]
    }
    clickDateItem(index){
        this.setState({
            dateIndex: index
        },() => {
            NavigatorUtils.goPage({}, 'Calendar')
        })
    }
    renderItem(data){
        const {dateIndex} = this.state;
        const {theme} = this.props
        let begin = data.item.longDayTime.beginTime.split('-');
        let end = data.item.longDayTime.endTime.split('-');
        return <TouchableOpacity style={[CommonStyle.flexCenter,{
            width: 90,
            height: 50,
            backgroundColor: dateIndex===data.index?'#ECFEFF':'#F5F7FA',
            borderRadius: 5,
            marginLeft: data.index===0?width*0.03:5
        }]} onPress={() => {this.clickDateItem(data.index)}}>
            <Text style={{
                color:dateIndex===data.index?theme:'#333',
                fontSize: 13
            }}>{begin[1]+'.'+begin[2]} - {end[1]+'.'+end[2]}</Text>
            <Text style={{
                color:dateIndex===data.index?theme:'#333',
                fontSize: 13,
                marginTop: 2
            }}>{this.getWeekDay(begin.join('/'))}开始</Text>
        </TouchableOpacity>
    }
    goDifference(){
        NavigatorUtils.goPage({}, 'SettingDifference')
    }
    render(){
        const {theme} = this.props;
        const {timeIndex, isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>;
        return(
            <SideMenu
                menu={menu}                    //抽屉内的组件
                isOpen={isOpenning}     //抽屉打开/关闭
                openMenuOffset={width*2/3}     //抽屉的宽度
                hiddenMenuOffset={0}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
                edgeHitWidth={50}              //距离屏幕多少距离可以滑出抽屉,默认60
                disableGestures={false}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
                onChange={                   //抽屉状态变化的监听函数
                    (isOpen) => {
                        isOpen ?
                            this.setState({
                                isOpenning:true
                            })
                            :
                            this.setState({
                                isOpenning:false
                            })

                    }}
                menuPosition={'right'}     //抽屉在左侧还是右侧
                autoClosing={true}         //默认为true 如果为true 一有事件发生抽屉就会关闭
            >
                <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                    <CreateHeader title={'体验时间'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:theme,
                                    fontWeight:'bold',
                                    fontSize:16.8
                                }}>小贴士</Text>
                                <Prompt data={this.prompts}/>
                                <Text style={[styles.main_title,{marginTop:25}]}>
                                    选择体验时间举办的类型
                                </Text>
                                {
                                    this.timeNames.map((item, index) => {
                                        return <View key={index} style={{marginTop:20,position:'relative'}}>
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[CommonStyle.flexStart]}
                                                    onPress={()=>{this.changeIndex(index, item.id)}}
                                                >
                                                <View style={[styles.time_roll,CommonStyle.flexCenter,{
                                                    backgroundColor:timeIndex===index?theme:'#fff'
                                                }]}>
                                                    {
                                                        timeIndex===index
                                                        ?
                                                            <AntDesign
                                                                name={'check'}
                                                                size={16}
                                                                style={{color:'#fff'}}
                                                            />
                                                        :
                                                            null
                                                    }

                                                </View>
                                                <Text style={styles.time_txt}>{item.title}</Text>
                                            </TouchableOpacity>
                                                {
                                                    timeIndex>-1&&timeIndex!==index
                                                    ?
                                                        <View style={styles.bg_shadow}></View>
                                                    :
                                                        null
                                                }

                                        </View>
                                    })
                                }
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop: 20,
                            paddingBottom:20,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <Text style={[styles.main_title]}>举办体验时间段</Text>
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,styles.select_btn]}
                                    onPress={()=>{this.goLongTime()}}
                                >
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>添加</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.props.longDay.length > 0
                                ?
                                    <View style={[CommonStyle.flexStart,{marginTop: 15,flexDirection:'row'}]}>
                                        <FlatList
                                            data={this.props.longDay}
                                            horizontal={true}
                                            showsVerticalScrollIndicator = {false}
                                            renderItem={data=>this.renderItem(data)}
                                            keyExtractor={(item, index) => index.toString()}
                                        />

                                    </View>
                                :
                                    null
                            }
                        </View>

                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop: 20,
                            paddingBottom:20,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <View style={CommonStyle.flexStart}>
                                    <Text style={[styles.main_title]}>设置退差价</Text>
                                    <AntDesign
                                        name={'questioncircleo'}
                                        size={14}
                                        style={{color:'#CACACAFF',marginLeft: 10}}
                                        onPress={()=>{
                                            NavigatorUtils.goPage({}, 'AboutDifference')
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,styles.select_btn]}
                                    onPress={()=>{this.goDifference()}}
                                >
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize: 13
                                    }}>添加</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.props.difference.length > 0
                                ?
                                this.props.difference.map((item, index) => {
                                    return <View key={index} style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                        backgroundColor:'#F5F7FAFF',
                                        height: 40,
                                        borderRadius: 3,
                                        marginTop: index===0?15:10,
                                        paddingLeft: 9.5,
                                        paddingRight: 9.5
                                    }]}>
                                        <Text style={{
                                            color:'#333'
                                        }}>满{item.people}人退{item.returnNum}%</Text>
                                        <View style={[CommonStyle.flexEnd]}>
                                            <Text style={{color:'#a4a4a4',fontSize: 13,marginRight: 20}}>编辑</Text>
                                            <Text style={{color:'#a4a4a4',fontSize: 13}}>删除</Text>
                                        </View>
                                    </View>
                                })
                                :
                                    null
                            }
                        </View>

                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>儿童价标准</Text>
                                <AntDesign
                                    name={'right'}
                                    size={16}
                                    style={{color:'#666'}}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10,
                            marginBottom: 100
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>参与者年龄下限</Text>
                                <AntDesign
                                    name={'right'}
                                    size={16}
                                    style={{color:'#666'}}
                                />
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:theme
                            }]}
                               onPress={()=>this.goNext()}
                            >
                                <Text style={{color:'#fff'}}>保存并继续</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
        lineHeight:20
    },
    demo_item:{
        width:width*0.8,
        marginRight:15,
        padding:15,
        backgroundColor:'#f5f5f5'
    },
    inputs:{
        height:40,
        borderBottomColor:'#f5f5f5',
        borderBottomWidth: 1,
        marginTop: 15
    },
    time_roll:{
        width:20,
        height:20,
        borderRadius: 10,
        borderWidth:1,
        borderColor:'#f5f5f5'
    },
    time_txt:{
        color:'#333',
        marginLeft: 10,
        fontWeight: "bold"
    },
    bg_shadow:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        backgroundColor:'rgba(255,255,255,.5)'
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    longDay: state.steps.longDay,
    difference: state.steps.difference
})
export default connect(mapStateToProps)(Time)

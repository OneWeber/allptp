import React,{Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getAll} from '../../../../../../utils/auth';
import {connect} from 'react-redux'
import CalendarItem from './CalendarItem';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
const {width, height} = Dimensions.get('window')
class CalendarDate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            timeIndex: this.props.timeIndex, //0为多天体验，1为单天体验
            tabIndex: 0,
            currentPage: 1,
            yearList: ''
        }
    }
    componentDidMount() {
        this.initYear()
    }
    initYear(){
        let nowYear = new Date().getFullYear();
        let yearArr = [];
        yearArr.push(nowYear)
        for(let i=0; i<9; i++){
            nowYear ++;
            yearArr.push(nowYear)
        }
        this.setState({
            yearList: yearArr
        })
    }
    getLeftButton(){
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                this.props.closeCalendar()
            }}
        >
            <AntDesign
                name={'close'}
                size={20}
            />
        </TouchableOpacity>
    }
    _onScrollEndDrag() {

    }
    _onAnimationEnd(e){
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor((offsetX/0.96) / (width*0.96))+1;
        if(pageIndex> 5 || pageIndex<0.93)pageIndex=0;
        this.setState({
            currentPage:pageIndex,
            tabIndex:pageIndex-1
        })
    }
    render(){
        const {timeIndex, yearList} = this.state;
        const {theme} = this.props;
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={timeIndex===0?'多天日历':'单天日历'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <CalendarItem
                    {...this.props}
                    {...this.state}
                />

            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(CalendarDate)

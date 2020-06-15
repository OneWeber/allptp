import React,{Component} from 'react';
import {SafeAreaView, TouchableOpacity, Dimensions,Text, View} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import CalendarItem from './CalendarItem';
import Toast from 'react-native-easy-toast';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import CalendarSingle from './CalendarSingle';
import actions from '../../../../../../action';
import {objRemoveDuplicated} from '../../../../../../utils/auth'
const {width, height} = Dimensions.get('window')
class CalendarDate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            timeIndex: this.props.navigation.state.params.timeIndex, //0为多天体验，1为单天体验
            tabIndex: 0,
            currentPage: 1,
            yearList: '',
            isShow: false,
            date: []
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
        return<TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                NavigatorUtils.goPage({},'LongTime')
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    _initDate() {
        let date = this.props.dateValue;
        for(let i=0; i<date.length; i++) {
            if(!date[i].begin_date || !date[i].end_date) {
                this.refs.toast.show('请选择完成的体验日期')
            }else{
                NavigatorUtils.goPage({},'LongTime')
            }
        }
    }
    getRightButton() {
        return <View>
                {
                    this.state.isShow
                    ?
                        <TouchableOpacity style={{
                            paddingRight: width*0.03
                        }}
                        onPress={()=>{
                            this.submitDate()
                        }}
                        >
                            <Text style={{color:this.props.theme}}>确定</Text>
                        </TouchableOpacity>
                    :
                        null
                }
            </View>

    }
    submitDate() {
        const {changeNewDate} = this.props;
        let data = this.state.date;
        data=objRemoveDuplicated(data)
        changeNewDate(data);
        NavigatorUtils.goPage({}, 'LongTime')
    }
    _changeShow(val, data) {
        this.setState({
            isShow: val,
            date: data
        })
    }
    render(){
        const {timeIndex, yearList} = this.state;
        const {theme} = this.props;
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <RNEasyTopNavBar
                    title={timeIndex===0?'多天日历':'单天日历'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                {
                    timeIndex===0
                    ?
                        <CalendarItem
                            {...this.props}
                            {...this.state}
                            changeShow={(val, data) => {
                                this._changeShow(val, data)
                            }}
                        />
                    :
                        <CalendarSingle
                            {...this.props}
                            {...this.state}
                            changeShow={(val, data) => {
                                this._changeShow(val, data)
                            }}
                        />
                }

            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    dateValue: state.steps.dateValue
});
const mapDispatchToProps = dispatch => ({
    changeNewDate: arr => dispatch(actions.changeNewDate(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarDate)

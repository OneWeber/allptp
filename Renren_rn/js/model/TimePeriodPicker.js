import React,{Component} from 'react';
import {StyleSheet, View, Text, Dimensions,PickerIOS} from 'react-native';
import Modal from 'react-native-modalbox';
import CommonStyle from '../../assets/css/Common_css';
const {width, height} = Dimensions.get('window');
const PickerItemIOS = PickerIOS.Item;
export default class TimePeriodPicker extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hours:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            minutes:[],
            nHour: '0',
            nMinutes: '0'
        }
    }
    componentDidMount(){
        this.initMinutes()
    }
    initMinutes(){
        let data = [];
        for(let i=0;i<60;i++){
            data.push(i)
        }
        this.setState({
            minutes: data
        })
    }
    open(val){
        if(val) {
            console.log('hahaha', this.props.limitHour)
            if(parseFloat(this.props.limitHour)>=0) {
                this.spliceHour()
            }
            if(parseFloat(this.props.limitMinutes)>=0) {
                this.spliceMinutes()
            }
            if(this.props.limitHour<0&&this.props.limitMinutes<0) {
                this.setState({
                    hours:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                });
                this.initMinutes()
            }
            this.setState({
                nHour: this.props.hour?this.props.hour:'0',
                nMinutes: this.props.minutes?this.props.minutes:'0',
            })
        }
        this.refs.picker.open()
    }
    spliceHour(){
        let hour = this.state.hours;
        if(hour[0] < this.props.limitHour) {
            hour.splice(0, this.props.limitHour)
        }
        this.setState({
            hours: hour
        })
    }
    spliceMinutes(){
        let m = this.state.minutes;
        if(m[0] < this.props.limitMinutes) {
            m.splice(0, parseFloat(this.props.limitMinutes))
        }
        this.setState({
            minutes: m
        })
    }
    _cancel(){
        this.refs.picker.close();
        this.props.cancel()
    }
    _confirm(){
        this.refs.picker.close();
        this.props.confirm(this.state.nHour, this.state.nMinutes)
    }
    changeHour(val){
        this.setState({
            nHour: val
        })
    }
    changeMinutes(val){
        this.setState({
            nMinutes: val
        })
    }
    render(){
        const {hours, nHour, nMinutes, minutes} = this.state
        return(
            <View style={{flex: 1}}>
                <Modal
                    style={{height:240,width:width,backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"picker"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,.3)'}
                    swipeToClose={false}
                    entry={'bottom'}
                    backdropPressToClose={false}
                    coverScreen={true}>
                    <View style={{width:'100%',height:240,backgroundColor: "#fff",borderRadius: 5}}>
                        <View style={{
                            height:40,
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height: 40}]}>
                                <Text style={{
                                    color:'#666',
                                    fontSize: 16
                                }} onPress={()=>this._cancel()}>取消</Text>
                                <Text style={{
                                    color:'#333',
                                    fontWeight:'bold',
                                    fontSize: 16
                                }}>体验起止时间</Text>
                                <Text style={{
                                    color:'#14c5ca',
                                    fontSize: 16
                                }} onPress={()=>this._confirm()}>确定</Text>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexStart]}>
                            <PickerIOS
                                style={{width:width/2,height:200}}
                                selectedValue={nHour}
                                onValueChange={(val)=>{this.changeHour(val)}}
                            >
                                {
                                    hours.map((item, index)=> {
                                        return <PickerItemIOS
                                            key={index}
                                            value={JSON.stringify(item)}
                                            label={JSON.stringify(item).split('').length===1?'0'+JSON.stringify(item):JSON.stringify(item)}
                                        />
                                    })
                                }
                            </PickerIOS>
                            <PickerIOS
                                style={{width:width/2,height:200}}
                                selectedValue={nMinutes}
                                onValueChange={(val)=>{this.changeMinutes(val)}}
                            >
                                {
                                    minutes.map((item, index)=> {
                                        return <PickerItemIOS
                                            key={index}
                                            value={JSON.stringify(item)}
                                            label={JSON.stringify(item).split('').length===1?'0'+JSON.stringify(item):JSON.stringify(item)}
                                        />
                                    })
                                }
                            </PickerIOS>
                        </View>

                    </View>
                </Modal>
            </View>
        )
    }
}

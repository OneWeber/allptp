import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import action from '../../../../../../action'
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
import Toast from 'react-native-easy-toast';
const {width} = Dimensions.get('window')
class SettingDifference extends Component{
    constructor(props) {
        super(props);
        this.state = {
            num:this.props.navigation.state.params?this.props.navigation.state.params.data?JSON.stringify(this.props.navigation.state.params.data.num):'':'',
            refund_rate:this.props.navigation.state.params?this.props.navigation.state.params.data?this.props.navigation.state.params.data.refund_rate:'':'',
        }
        this.difference = this.props.navigation.state.params.difference?this.props.navigation.state.params.difference:[];
        this.index = this.props.navigation.state.params.index>=0?this.props.navigation.state.params.index:-1
    }
    getLeftButton(){
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                this.props.navigation.goBack()
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    getRightButton(){
        return <View style={{paddingRight: width*0.03}}>
            <Text
                style={{color:'#666',fontSize: 13}}
                onPress={()=>{
                    NavigatorUtils.goPage({}, 'AboutDifference')
                }}
            >关于退差价</Text>
        </View>
    }
    confirmDifference(){
        if(this.props.navigation.state.params&&this.props.navigation.state.params.data) {
            for (let i=0;i<this.difference.length; i++) {
                if(i>=this.index) {
                    if(this.state.refund_rate==this.difference[i].refund_rate || this.state.refund_rate>this.difference[i].refund_rate) {
                        this.refs.toast.show('后面的返还比例必须比前面比例大');
                        return
                    }
                }
            }
        }else{
            for (let i=0;i<this.difference.length; i++) {
                if(this.state.refund_rate==this.difference[i].refund_rate || this.state.refund_rate<this.difference[i].refund_rate) {
                    this.refs.toast.show('后面的返还比例必须比前面比例大');
                    return
                }
            }
        }

        const {changeDifference, difference, token, activity_id} = this.props;
        let formData=new FormData();
        formData.append('token',token);
        formData.append('version','2.0');
        formData.append('activity_id',activity_id);
        formData.append('num',this.state.num);
        formData.append('refund_rate',this.state.refund_rate);
        if(this.props.navigation.state.params&&this.props.navigation.state.params.data) {
            formData.append('differ_id',this.props.navigation.state.params.data.differ_id);
        }
        Fetch.post(NewHttp+'DifferAddTwo', formData).then(res => {
            if(res.code === 1) {
                this.getDiffer();
                NavigatorUtils.goPage({}, 'Time')
            }
        })
    }
    getDiffer() {
        const {activity_id, token, changeDifference} = this.props;
        let formData = new FormData();
        formData.append("token",token);
        formData.append("version",'2.0');
        formData.append("activity_id",activity_id);
        Fetch.post(NewHttp + 'DifferListTwo',formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    differ: res.data
                },() => {
                    changeDifference(this.state.differ)
                });
            }
        })
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: '#f5f5f5'}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <RNEasyTopNavBar
                    title={'返差价'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={CommonStyle.commonWidth}>
                            <View style={[{
                                marginTop: 10,
                                backgroundColor:'#fff',
                                borderRadius: 5,
                                paddingLeft: 15,
                                paddingRight: 15
                            }]}>
                                <View style={[CommonStyle.spaceRow,{
                                    height:60,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f5f5f5',
                                }]}>
                                    <Text style={{
                                        color:'#333',
                                        fontWeight: 'bold',
                                        fontSize: 15
                                    }}>满人数</Text>
                                    <View style={CommonStyle.flexEnd}>
                                        <TextInput
                                            onChangeText={(text)=>this.setState({num:text})}
                                            defaultValue={this.state.num?JSON.stringify(parseFloat(this.state.num)):''}
                                            keyboardType={"number-pad"}
                                            style={{
                                                width:170,
                                                height:60,
                                                backgroundColor: '#fff',
                                                textAlign:'right',
                                                marginRight: 3,
                                                color:'#333',
                                                fontSize: 14
                                            }}
                                        />
                                        <Text style={{color:'#696969'}}>人</Text>
                                    </View>
                                </View>
                                <View style={[CommonStyle.spaceRow,{
                                    height:60,
                                    width: '100%'
                                }]}>
                                    <Text style={{
                                        color:'#333',
                                        fontWeight: 'bold',
                                        fontSize: 15
                                    }}>返还比例</Text>
                                    <View style={CommonStyle.flexEnd}>
                                        <TextInput
                                            onChangeText={(text)=>this.setState({refund_rate:text})}
                                            defaultValue={this.state.refund_rate?JSON.stringify(parseFloat(this.state.refund_rate)):''}
                                            keyboardType='numeric'
                                            style={{
                                                width:170,
                                                height:60,
                                                backgroundColor: '#fff',
                                                textAlign:'right',
                                                marginRight: 3,
                                                color:'#333',
                                                fontSize: 14
                                            }}
                                        />
                                        <Text style={{color:'#696969'}}>%</Text>
                                    </View>
                                </View>
                            </View>
                            {
                                this.state.num && this.state.refund_rate
                                    ?
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        height:40,
                                        marginTop: 45,
                                        backgroundColor:this.props.theme,
                                        borderRadius: 5
                                    }]} onPress={()=>{this.confirmDifference()}}>
                                        <Text style={{color:'#fff'}}>确认添加</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={[CommonStyle.flexCenter,{
                                        height:40,
                                        marginTop: 45,
                                        backgroundColor:'#d5d5d5',
                                        borderRadius: 5
                                    }]}>
                                        <Text style={{color:'#fff'}}>确认添加</Text>
                                    </View>
                            }
                            <Text style={{
                                color:'#696969',
                                fontSize: 12,
                                lineHeight:20,
                                marginTop: 24
                            }}>
                                小贴士：如果设置第二次的人数下限大于上一次人数时，返还金
                                额比例需大于上一次比例
                            </Text>
                        </View>
                    </View>

                </ScrollView>

            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    difference: state.steps.difference,
    token: state.token.token,
    activity_id: state.steps.activity_id,
});
const mapDispatchToProps = dispatch => ({
    changeDifference: data => dispatch(action.changeDifference(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(SettingDifference)

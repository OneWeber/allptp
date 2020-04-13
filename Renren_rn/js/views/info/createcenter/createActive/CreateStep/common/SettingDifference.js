import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import action from '../../../../../../action'
const {width} = Dimensions.get('window')
class SettingDifference extends Component{
    constructor(props) {
        super(props);
        this.state = {
            people: '',
            returnNum: ''
        }
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
        const {changeDifference, difference} = this.props;
        let list = difference;
        let data = {
            people: this.state.people,
            returnNum: this.state.returnNum
        }
        list.push(data);
        changeDifference(list);
        NavigatorUtils.goPage({}, 'Time')
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: '#f5f5f5'}}>
                <RNEasyTopNavBar
                    title={'添加亲子套餐'}
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
                                            onChangeText={(text)=>this.setState({people:text})}
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
                                            onChangeText={(text)=>this.setState({returnNum:text})}
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
                                this.state.people && this.state.returnNum
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
    difference: state.steps.difference
});
const mapDispatchToProps = dispatch => ({
    changeDifference: data => dispatch(action.changeDifference(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(SettingDifference)

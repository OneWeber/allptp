import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import CreateHeader from '../../../../../../common/CreateHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../../../../../action'
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
class CustomPackage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            customePackageName: '',
            customePackagePeople: '',
            customePackageTotalPrice: ''
        }
    }
    confirmPackage(){
        const {customePackage, changeCustomePackage} = this.props;
        let list = customePackage;
        let data = {
            name: this.state.customePackageName,
            adult: this.state.customePackagePeople,
            price: this.state.customePackageTotalPrice,
            type: 2,
            flag: 1,
            date: []
        }
        list.push(data);
        changeCustomePackage(list);
        NavigatorUtils.goPage({}, 'LongTime')
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                <CreateHeader title={'添加综合套餐'} navigation={this.props.navigation}/>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={CommonStyle.flexCenter}>
                            <View style={[CommonStyle.commonWidth]}>
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
                                        }}>套餐名称</Text>
                                        <View style={CommonStyle.flexEnd}>
                                            <TextInput
                                                placeholder="自由输入不超过10个字"
                                                maxLength={10}
                                                onChangeText={(text)=>this.setState({customePackageName:text})}
                                                style={{
                                                    width:200,
                                                    height:60,
                                                    backgroundColor: '#fff',
                                                    textAlign:'right',
                                                    marginRight: 3,
                                                    color:'#333',
                                                    fontSize: 14
                                                }}
                                            />
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
                                        }}>人数</Text>
                                        <View style={CommonStyle.flexEnd}>
                                            <TextInput
                                                onChangeText={(text)=>this.setState({customePackagePeople:text})}
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
                                </View>
                                <View style={[CommonStyle.spaceRow,{
                                    height:60,
                                    marginTop: 10,
                                    backgroundColor:'#fff',
                                    borderRadius: 5,
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }]}>
                                    <Text style={{
                                        color:'#333',
                                        fontWeight: 'bold',
                                        fontSize: 15
                                    }}>总价</Text>
                                    <View style={CommonStyle.flexEnd}>
                                        <View style={CommonStyle.flexEnd}>
                                            <TextInput
                                                onChangeText={(text)=>this.setState({customePackageTotalPrice:text})}
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
                                            <Text style={{color:'#696969'}}>元</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    this.state.customePackageName && this.state.customePackagePeople && this.state.customePackageTotalPrice
                                        ?
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height:40,
                                            marginTop: 45,
                                            backgroundColor:this.props.theme,
                                            borderRadius: 5
                                        }]} onPress={()=>{this.confirmPackage()}}>
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
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    customePackage: state.steps.customePackage
})
const mapDispatchToProps = dispatch => ({
    changeCustomePackage: data => dispatch(action.changeCustomePackage(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(CustomPackage)

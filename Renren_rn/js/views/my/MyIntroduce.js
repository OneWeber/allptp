import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
const {width, height} = Dimensions.get('window');
class MyIntroduce extends Component{
    constructor(props) {
        super(props);
        this.state = {
            introduce: this.props.navigation.state.params.introduce
        }
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
    changeIntroduce(text) {
        this.setState({
            introduce: text
        })
    }
    saveIntroduce() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('introduce',this.state.introduce);
        Fetch.post(HttpUrl+'User/saveuser', formData).then(res => {
            if(res.code === 1) {
                NavigatorUtils.backToUp(this.props, true)
            }
        })
    }
    getRightButton() {
        return <TouchableOpacity
            style={{paddingRight:width*0.03}}
            onPress={()=>{
                this.saveIntroduce()
            }}
        >
            <Text style={{
                color:this.props.theme,
                fontSize: 16
            }}>保存</Text>
        </TouchableOpacity>
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'自我介绍'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#f5f5f5'
                    }}
                />
                <ScrollView>
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 10,
                        backgroundColor: '#fff'
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <TextInput
                                placeholder="自我介绍"
                                multiline={true}
                                style={{
                                    minHeight: 130
                                }}
                                defaultValue={this.state.introduce}
                                onChangeText={(text)=>this.changeIntroduce(text)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(MyIntroduce)

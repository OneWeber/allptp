import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../assets/css/Common_css';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
class CancelActive extends Component{
    componentDidMount(){
        this.getSlot()
    }

    getLeftButton(){
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
    getSlot() {
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.navigation.state.params.activity_id);
        Fetch.post(NewHttp+'ActivityE', formData).then(res => {
            if(res.code === 1) {
                console.log(res)
            }
        })
    }
    render() {
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'取消体验'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token
})
export default connect(mapStateToProps)(CancelActive)

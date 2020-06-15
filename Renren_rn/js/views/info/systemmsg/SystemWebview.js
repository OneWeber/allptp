import React,{Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import action from '../../../action';
import HttpUrl from '../../../utils/Http';
class SystemWebview extends Component{
    // componentDidMount() {
    //     const {onLoadSystemMsg} = this.props;
    //     this.storeName = 'systemmsg'
    //     this.step = 1
    //     let formData=new FormData();
    //     formData.append('token', this.props.token);
    //     formData.append('page', 1);
    //     onLoadSystemMsg(this.storeName, NewHttp+'sysmsgl', formData)
    // }
    render(){
        return(
            <View>
                <Text>{this.props.navigation.state.params.msg_id}</Text>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token
});
const mapDispatchToProps = dispatch => ({
    onLoadSystemMsg: (storeName, url, data) => dispatch(action.onLoadSystemMsg(storeName, url, data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SystemWebview)

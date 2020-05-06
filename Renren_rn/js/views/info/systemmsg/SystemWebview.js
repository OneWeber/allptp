import React,{Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import action from '../../../action';
import HttpUrl from '../../../utils/Http';
class SystemWebview extends Component{
    componentDidMount() {

    }

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
    onLoadNoRead: (storeName, url, data) => dispatch(action.onLoadNoRead(storeName, url, data)),
    onLoadMoreSystemMsg: (storeName, url, data, oItems) => dispatch(action.onLoadMoreSystemMsg(storeName, url, data, oItems))
})
export default connect(mapStateToProps, mapDispatchToProps)(SystemWebview)

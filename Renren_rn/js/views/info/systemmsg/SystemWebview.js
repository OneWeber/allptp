import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import action from '../../../action';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
class SystemWebview extends Component{
    constructor(props) {
        super(props);
        this.state = {
            msg_url: ''
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('msg_id',this.props.navigation.state.params.msg_id);
        Fetch.post(NewHttp+'SysMsgD', formData).then(res => {
            console.log('ressss', res)
            this.setState({
                msg_url: res.data.url
            })
        })
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
    render(){
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'系统消息详情'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    this.state.msg_url
                    ?
                        <WebView source={{ uri: this.state.msg_url }} />
                    :
                        null
                }

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

import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, Text, SafeAreaView} from 'react-native';
import ViewBotNavigator from '../navigator/ViewBotNavigator';
import NetInfo from "@react-native-community/netinfo";
import NavigatorUtils from '../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import HttpUrl from '../utils/Http';
import HttpUtils from '../expand/dao/Fetch';
import AsyncStorage from '@react-native-community/async-storage';
import InitToken from '../expand/dao/InitToken';
import actions from '../action';
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonStyle from '../../assets/css/Common_css';
import Fetch from '../expand/dao/Fetch';
import NewHttp from '../utils/NewHttp';
class ViewPage extends Component{
    constructor(props) {
        super(props);
        this.InitTokens = new InitToken();
        console.disableYellowBox = true;
    }
    componentWillMount() {
        const {changeNet} = this.props
        NetInfo.fetch().then(state => {
            let data = {
                type: state.type,
                isConnected: state.isConnected
            };
            changeNet(data)
            //console.log("Connection type", state.type);
            //console.log("Is connected?", state.isConnected);
        });
        NetInfo.addEventListener(state => {
            let data = {
                type: state.type,
                isConnected: state.isConnected
            };
            changeNet(data);
            if(!state.isConnected) {
                this.refs.toast.show('无网络连接')
            }
        });
    }
    componentDidMount(){
        this.InitTokens.goInitToken().then(res => {
            let formDataTwo=new FormData();
            formDataTwo.append('','');
            if(!res) {
                const {onInitUser, onInitToken} = this.props
                Fetch.post(HttpUrl + 'Index/token', formDataTwo).then(result => {
                    if(result.code === 1) {
                        onInitToken(result.data)
                        AsyncStorage.setItem('token', JSON.stringify(result.data));
                        this.loadComming(result.data);
                        this.loadHistory(result.data);
                        this.loadStory(result.data);
                        this.loadTop(result.data)
                    } else {
                        onInitToken('')
                    }
                })
            }
        })
    }
    loadComming(token){
        const {onLoadComming} = this.props
        this.storeName='commingactive'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('version', '2.0');
        onLoadComming(this.storeName, NewHttp + 'SoonActTwo', formData)
    }
    loadHistory(token){
        const {onLoadHistory} = this.props;
        this.storeName='history'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('page',1);
        formData.append('version','2.0');
        onLoadHistory(this.storeName, NewHttp + 'VisitListTwo', formData)
    }
    loadStory(token){
        const {onLoadSelectStory} = this.props
        this.storeName='selectstory'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort',2);
        formData.append('page',1);
        formData.append('kind_id','');
        formData.append('country','');
        formData.append('province','');
        formData.append('city','');
        formData.append('region','');
        onLoadSelectStory(this.storeName, HttpUrl + 'Story/story_list', formData)
    }
    loadTop(token){
        const {onLoadHotCity} = this.props
        this.storeName = 'hotcity';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('version', '2.0');
        onLoadHotCity(this.storeName, NewHttp + 'ScoreHighCityTwo', formData)
    }
    render(){
        NavigatorUtils.navigation = this.props.navigation;
        const {comming,hotcity} = this.props
        return <View style={{flex: 1,position:'relative'}}>
            <ViewBotNavigator />
            <Toast ref="toast" position='center' positionValue={0}/>
             {
                comming['commingactive']&&comming['commingactive'].isLoading || (hotcity['hotcity']&&hotcity['hotcity'].isLoading)
                ?
                    <View style={[CommonStyle.flexCenter,{
                        position:'absolute',
                        left:0,
                        top:0,
                        right:0,
                        bottom:0,
                        backgroundColor: '#fff'
                    }]}>
                        <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
                        <Text style={{
                            color:'#f5f5f5',
                            fontWeight: 'bold',
                            marginTop: 20,
                            fontSize: 25
                        }}>ALLPTP</Text>
                    </View>
                :
                    null
            }

        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
const mapStateToProps = state => ({
    user: state.user.user,
    theme:state.theme.theme,
    comming: state.comming,
    hotcity: state.hotcity,
    cityitem: state.cityitem,
    selectstory: state.selectstory,
    history: state.history,
    token: state.token.token
})
const mapDispatchToProps = dispatch => ({
    onInitUser: user => dispatch(actions.InitUser(user)),
    changeNet: data => dispatch(actions.changeNet(data)),
    onInitToken: data => dispatch(actions.InitToken(data)),
    onLoadComming: (storeName, url, data) => dispatch(actions.onLoadComming(storeName, url, data)),
    onLoadHistory: (storeName, url, data) => dispatch(actions.onLoadHistory(storeName, url, data)),
    onLoadSelectStory: (storeName, url, data) => dispatch(actions.onLoadSelectStory(storeName, url, data)),
    onLoadHotCity: (storeName, url, data) => dispatch(actions.onLoadHotCity(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewPage)

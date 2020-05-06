import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Dimensions,
    FlatList,
    KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux'
import Fetch from '../expand/dao/Fetch';
import NewHttp from '../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import WS from 'react-native-websocket'
import action from '../action';
const {width, height} = Dimensions.get('window');
class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            typing: '',
            messages: [],
            isEnd: false,
            step: 1,
            msg_id: '',
            client_id: ''
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let user_id = this.props.navigation.state.params.user_id;
        const {token} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('to_user_id', user_id);
        formData.append('page',1);
        Fetch.post(NewHttp+'MsgList', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    messages: res.data.data,
                })
            }
        })
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
    sendMessage() {
        let user_id = this.props.navigation.state.params.user_id;
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('to_user_id', user_id);
        formData.append('content',this.state.typing);
        Fetch.post(NewHttp + 'SendMsg', formData).then(
            this.initData()
        )
    }
    initData() {
        this.setState({
            typing: ''
        }, () => {
            this.loadData();
            this.chatCon.scrollToIndex({ viewPosition: 0, index: 0 });
        })
    }
    onLoadMore() {
        let steps = this.state.step;
        steps ++ ;
        this.setState({
            step: steps
        }, () => {
            let user_id = this.props.navigation.state.params.user_id;
            const {token} = this.props;
            let formData=new FormData();
            formData.append('token', token);
            formData.append('to_user_id', user_id);
            formData.append('page',this.state.step);
            Fetch.post(NewHttp+'MsgList', formData).then(res => {
                if(res.code === 1) {
                    this.setState({
                        messages: this.state.messages.concat(res.data.data)
                    }, () => {
                        if(res.data.data.length > 0) {
                            this.setState({
                                isEnd: false
                            })
                        } else {
                            this.setState({
                                isEnd: true
                            })
                        }
                    })
                }
            })
        })

    }
    renderItem(data) {
        return <View style={CommonStyle.flexCenter}>
            <View style={CommonStyle.commonWidth}>
                {
                    data.item.user_id == this.props.user.userid
                    ?
                        <View style={[CommonStyle.flexEnd,styles.messageItem]}>
                            <View style={{marginRight: 15}}>
                                <TouchableOpacity style={styles.messageContent}>
                                    <Text style={{lineHeight:20,color:'#333'}}>{data.item.content}</Text>
                                </TouchableOpacity>
                            </View>
                            <LazyImage
                                source={data.item.user&&data.item.user.headimage?{uri:data.item.user.headimage.domain+data.item.user.headimage.image_url}:
                                require('../../assets/images/touxiang.png')}
                                style={{
                                    width:40,
                                    height:40,
                                    borderRadius: 5
                                }}
                            />
                        </View>
                    :
                        <View style={[CommonStyle.flexStart,styles.messageItem]}>
                            <LazyImage
                                source={data.item.user&&data.item.user.headimage?{uri:data.item.user.headimage.domain+data.item.user.headimage.image_url}:
                                    require('../../assets/images/touxiang.png')}
                                style={{
                                    width:40,
                                    height:40,
                                    borderRadius: 5
                                }}
                            />
                            <View style={{marginLeft: 15}}>
                                <TouchableOpacity style={styles.messageContent}>
                                    <Text style={{lineHeight:20,color:'#333'}}>{data.item.content}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                }

            </View>
        </View>
    }
    genIndicator() {
        return <View>
            {
                this.state.messages.length > 0
                    ?
                    <View style={[CommonStyle.flexCenter, {
                        width: '100%',
                        marginTop: 15
                    }]}>
                        {
                            this.state.isEnd
                            ?
                                null
                            :
                                <View style={[CommonStyle.flexCenter,{
                                    flexDirection: 'row'
                                }]}>
                                    <ActivityIndicator size={'small'} color={'#999'}/>
                                    <Text style={{
                                        marginLeft: 5,
                                        color: '#999'
                                    }}>加载更多聊天信息</Text>
                                </View>
                        }
                    </View>
                    :
                    null
            }
        </View>

    }
    sendCliendid(client_id) {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('client_id', client_id);
        Fetch.post(NewHttp+'RegisterC', formData).then(res =>{

        })
    }
    sendMsgid() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('msg_id',this.state.msg_id);
        Fetch.post(NewHttp+'ReadMsg' ,formData).then(
            this.initMsg()
        )
    }
    initMsg() {
        const {onLoadMsg} = this.props;
        this.storeName='msg';
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('page',1);
        onLoadMsg(this.storeName, NewHttp+'MyMsg', formData)
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={this.props.navigation.state.params.name?this.props.navigation.state.params.name:'匿名用户'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <FlatList
                    ref={chatCon => this.chatCon = chatCon}
                    data={this.state.messages}
                    renderItem={(data)=>this.renderItem(data)}
                    inverted
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        if(this.canLoadMore) {
                            this.onLoadMore();
                            this.canLoadMore = false;
                        }
                    }}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                    }}
                />
                <KeyboardAvoidingView behavior="padding">
                    <SafeAreaView style={[CommonStyle.spaceRow,styles.footer]}>
                        <TextInput
                            value={this.state.typing}
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            multiline={true}
                            onChangeText={text => this.setState({ typing: text })}
                        />
                        <TouchableOpacity
                            onPress={()=>this.sendMessage()}>
                            <Text style={styles.send}>发送</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </KeyboardAvoidingView>
                <WS
                    ref={ref => {this.ws = ref}}
                    url="wss://www.allptp.top:8282/socket.io"
                    onOpen={() => {

                    }}
                    onMessage={(e)=>{
                        if(JSON.parse(e.data).type=='init'){
                            this.setState({
                                client_id:JSON.parse(e.data).client_id
                            },()=>{
                               this.sendCliendid(this.state.client_id)
                            })
                        }else if(JSON.parse(e.data).type=='send_msg'){
                            let _this=this;
                            this.setState({
                                msg_id:JSON.parse(e.data).msg_id
                            },()=>{
                                _this.sendMsgid();
                                _this.loadData();
                            })
                        }else if(JSON.parse(e.data).type=='is_read'){

                        }else if(JSON.parse(e.data).type=='ping'){

                        }else if(JSON.parse(e.data).type=='msg'){

                        }else if(JSON.parse(e.data).type=='is_del'){

                        }else{

                        }
                    }}
                    reconnect // Will try to reconnect onClose
                />
            </View>

        )
    }
}
const styles = StyleSheet.create({
    footer: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#f5f5f5'
    },
    input: {
        padding: 10,
        fontSize: 16,
        width:width*0.94-60,
        marginLeft: width*0.03,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor:'#fff',
        minHeight: 40,
        borderRadius: 5,
        maxHeight: 120
    },
    send: {
        alignSelf: 'center',
        color: '#14c5ca',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 20
    },
    messageItem: {
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 10,
        alignItems: 'flex-start'
    },
    messageContent: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        minHeight: 40,
        maxWidth: width*0.6
    }
});
const mapStateToProps = state => ({
    token: state.token.token,
    user: state.user.user
});
const mapDispatchToProps = dispatch => ({
    onLoadMsg: (storeName, url, data) => dispatch(action.onLoadMsg(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import action from '../../action'
import NoData from '../../common/NoData';
import LazyImage from 'animated-lazy-image';
import HttpUrl from '../../utils/Http';
const {width} = Dimensions.get('window');
class SystemMsg extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.loadSystem()
    }
    loadSystem() {
        const {onLoadSystemMsg} = this.props;
        this.storeName = 'systemmsg'
        this.step = 1
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        onLoadSystemMsg(this.storeName, NewHttp+'sysmsgl', formData)
    }
    onLoadMore() {
        const {onLoadMoreSystemMsg, token, systemmsg} = this.props;
        let store = systemmsg[this.storeName];
        this.step ++;
        let url =  NewHttp+'sysmsgl';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('page', this.step);
        onLoadMoreSystemMsg(this.storeName, url, formData, store.items)
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
    clickItem(index, data) {
        const {onLoadNoRead} = this.props;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('msg_id',  data.msg_id);
        Fetch.post(NewHttp+'SysMsgD', formData).then(res => {
            let formDatas=new FormData();
            this.storeName = 'noread';
            formDatas.append('token', this.props.token);
            onLoadNoRead(this.storeName, HttpUrl+ 'Sysmsg/noread', formDatas)
        })

        NavigatorUtils.goPage({msg_id: data.msg_id, step: this.step}, 'SystemWebview')
    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
            marginLeft: width*0.03,
            paddingTop: 28,
            paddingBottom: 28,
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f5'
        }]} onPress={()=>{this.clickItem(data.index, data.item)}}>
            <View style={[CommonStyle.flexStart]}>
                <LazyImage
                    source={require('../../../assets/images/logo3.png')}
                    style={{
                        width:45,
                        height:45,
                        borderRadius: 22.5
                    }}
                />
                <View style={[CommonStyle.spaceCol,{
                    height: 45,
                    marginLeft: 10,
                    alignItems: 'flex-start'
                }]}>
                    <View style={CommonStyle.flexStart}>
                        <Text style={{color:'#333',fontSize: 15,fontWeight: 'bold'}}>系统</Text>
                        {
                            data.item.read_user_list.split(',').indexOf(this.props.user.userid) > -1
                            ?
                                null
                            :
                                <View style={{
                                    width:5,
                                    height:5,
                                    backgroundColor: '#FF0000',
                                    borderRadius: 2.5,
                                    marginLeft: 5
                                }}></View>
                        }

                    </View>
                    <Text style={{color:'#333',fontSize: 13}}>{data.item.title}</Text>
                </View>
            </View>
            <Text style={{color:'#999',fontSize: 11}}>{data.item.create_time}</Text>
        </TouchableOpacity>
    }
    genIndicator() {
        const {systemmsg} = this.props
        let store = systemmsg[this.storeName]
        return store.hideMoreshow?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',paddingTop: 10,paddingBottom:10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    render(){
        const {systemmsg} = this.props;
        let store = systemmsg[this.storeName];
        if(!store) {
            store={
                items:[],
                isLoading : false
            }
        }
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'系统消息'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                    ?
                        <FlatList
                            data={store.items.data.data.data}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
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
                    :
                        <NoData></NoData>
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    systemmsg: state.systemmsg,
    user: state.user.user
});
const mapDispatchToProps = dispatch => ({
    onLoadSystemMsg: (storeName, url, data) => dispatch(action.onLoadSystemMsg(storeName, url, data)),
    onLoadMoreSystemMsg: (storeName, url, data, oItems) => dispatch(action.onLoadMoreSystemMsg(storeName, url, data, oItems)),
    onLoadNoRead: (storeName, url, data) => dispatch(action.onLoadNoRead(storeName, url, data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SystemMsg)

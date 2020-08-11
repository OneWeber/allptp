import React, {Component} from 'react';
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
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import Fetch from '../../../expand/dao/Fetch';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import NewHttp from '../../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import dateDiff from '../../../utils/DateDiff';
const {width, height} = Dimensions.get('window')
class UserReply extends Component{
    constructor(props) {
        super(props);
        this.user_id = this.props.navigation.state.params.user_id;
        this.tabNames = ['游客评价', '策划者评价']
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
    render() {
        return(
            <View style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>
                <RNEasyTopNavBar
                    title={'她/他获得的评价'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollableTabView
                    renderTabBar={() => (<CustomeTabBar
                        backgroundColor={'rgba(0,0,0,0)'}
                        locked={true}
                        sabackgroundColor={'#fff'}
                        scrollWithoutAnimation={true}
                        tabUnderlineDefaultWidth={25}
                        tabUnderlineScaleX={6} // default 3
                        activeColor={this.props.theme}
                        isWishLarge={true}
                        inactiveColor={'#999'}
                    />)}>
                    <CommentVisit
                        tabLabel={'游客评价'}
                        {...this.props}
                        user_id={this.user_id}
                    >

                    </CommentVisit>
                    <ReplyComponent
                        tabLabel={'策划者评价'}
                        {...this.props}
                        user_id={this.user_id}
                    ></ReplyComponent>
                </ScrollableTabView>

            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(UserReply)
class ReplyComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            replyList: [],
            isEnd: false
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        this.step = 1;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('user_id', this.props.user_id);
        formData.append('page', 1);
        Fetch.post(NewHttp+'CommentPlanner', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    replyList: res.data.data
                })
            }
        })
    }
    renderItem(data) {
       return  <View style={[CommonStyle.flexCenter,{
            marginTop: data.index===0?20:25,
            paddingBottom: 15,
            borderBottomWidth:1,
            borderBottomColor: '#f5f5f5'
        }]}
        >
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                <View style={[CommonStyle.flexStart]}>
                    <LazyImage
                        source={{uri:data.item.domain + data.item.image_url}}
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5
                        }}
                    />
                    <View style={[CommonStyle.spaceCol,{
                        height:45,
                        marginLeft: 10,
                        maxWidth: width*0.94-45-10-110,
                        alignItems:'flex-start'
                    }]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{color:'#7b7b7b'}}>
                            <Text style={{color:this.props.theme}}>
                                {
                                    data.item.family_name||data.item.middle_name||data.item.name
                                        ?
                                        data.item.family_name+' '+data.item.middle_name+' '+data.item.name
                                        :
                                        '匿名用户'
                                }
                            </Text>
                            评价了你
                        </Text>
                        <Text style={{
                            color:'#333',
                            fontSize: 12
                        }}>{data.item.content}</Text>
                    </View>
                </View>
                <View style={[CommonStyle.spaceCol,{
                    height: 45,
                    width: 100,
                }]}>
                    <View style={[CommonStyle.flexEnd,{
                        width: '100%'
                    }]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{
                                color:'#999',
                                fontSize: 11
                            }}>{dateDiff(data.item.create_time)}</Text>
                    </View>
                    <View style={[CommonStyle.flexEnd,{
                        width: '100%'
                    }]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{
                                color:'#999',
                                fontSize: 11
                            }}>{data.item.title}</Text>
                    </View>
                </View>
            </View>
            {
                data.item.leavemsg.length > 0
                    ?
                    <View style={[CommonStyle.flexEnd,{
                        width: '100%',
                        paddingRight: width*0.03
                    }]}>
                        <View style={{
                            width: width*0.94-45-10,
                            marginTop: 15,
                            padding: 14,
                            backgroundColor: '#f3f5f8',
                            borderRadius: 4
                        }}>
                            <Text style={{
                                color:'#333',
                                fontSize: 12
                            }}>
                                <Text style={{color:this.props.theme}}>我的回复: </Text>
                                {data.item.leavemsg[0].content}
                            </Text>
                            <Text style={{
                                marginTop: 10,
                                color:'#333',
                                fontSize: 12
                            }}>共{data.item.leavemsg.length}条回复</Text>
                        </View>
                    </View>
                    :
                    null
            }
        </View>
    }
    onLoadMore() {
        this.step ++;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('user_id', this.props.user_id);
        formData.append('page', this.step);
        Fetch.post(NewHttp+'CommentPlanner', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    replyList:this.state.replyList.concat(res.data.data)
                },() => {
                    if(res.data.data.length > 0) {
                        this.setState({
                            isEnd: false
                        })
                    }else{
                        this.setState({
                            isEnd: true
                        })
                    }
                })
            }
        })
    }
    genIndicator() {
        return this.state.isEnd?null:
            <View style={[CommonStyle.flexCenter, {width: '100%'}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    render() {
        return(
            <View style={{flex: 1}}>
                {
                    this.state.replyList.length > 0
                    ?
                        <FlatList
                            data={this.state.replyList}
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
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <Text style={{color: '#999'}}>暂无数据</Text>
                        </View>
                }
            </View>
        )
    }
}
class CommentVisit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            replyList: [],
            isEnd: false
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        this.step = 1;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('user_id', this.props.user_id);
        formData.append('page', 1);
        Fetch.post(NewHttp+'CommentVisit', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    replyList: res.data.data
                })
            }
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.flexCenter,{
            marginTop: data.index===0?20:25,
            paddingBottom: 15,
            borderBottomWidth:1,
            borderBottomColor: '#f5f5f5'
        }]}
        >
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                <View style={[CommonStyle.flexStart]}>
                    <LazyImage
                        source={{uri:data.item.domain + data.item.image_url}}
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5
                        }}
                    />
                    <View style={[CommonStyle.spaceCol,{
                        height:45,
                        marginLeft: 10,
                        maxWidth: width*0.94-45-10-110,
                        alignItems:'flex-start'
                    }]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{color:'#7b7b7b'}}>
                            <Text style={{color:this.props.theme}}>
                                {
                                    data.item.family_name||data.item.middle_name||data.item.name
                                        ?
                                        data.item.family_name+' '+data.item.middle_name+' '+data.item.name
                                        :
                                        '匿名用户'
                                }
                            </Text>
                            评价了你
                        </Text>
                        <Text style={{
                            color:'#333',
                            fontSize: 12
                        }}>{data.item.content}</Text>
                    </View>
                </View>
                <View style={[CommonStyle.spaceCol,{
                    height: 45,
                    width: 100,
                }]}>
                    <View style={[CommonStyle.flexEnd,{
                        width: '100%'
                    }]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{
                                color:'#999',
                                fontSize: 11
                            }}>{dateDiff(data.item.create_time)}</Text>
                    </View>
                    <View style={[CommonStyle.flexEnd,{
                        width: '100%'
                    }]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{
                                color:'#999',
                                fontSize: 11
                            }}>{data.item.title}</Text>
                    </View>
                </View>
            </View>
            {
                data.item.leavemsg.length > 0
                    ?
                    <View style={[CommonStyle.flexEnd,{
                        width: '100%',
                        paddingRight: width*0.03
                    }]}>
                        <View style={{
                            width: width*0.94-45-10,
                            marginTop: 15,
                            padding: 14,
                            backgroundColor: '#f3f5f8',
                            borderRadius: 4
                        }}>
                            <Text style={{
                                color:'#333',
                                fontSize: 12
                            }}>
                                <Text style={{color:this.props.theme}}>我的回复: </Text>
                                {data.item.leavemsg[0].content}
                            </Text>
                            <Text style={{
                                marginTop: 10,
                                color:'#333',
                                fontSize: 12
                            }}>共{data.item.leavemsg.length}条回复</Text>
                        </View>
                    </View>
                    :
                    null
            }
        </View>
    }
    genIndicator() {
        return this.state.isEnd?null:
            <View style={[CommonStyle.flexCenter, {width: '100%'}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        this.step ++;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('user_id', this.props.user_id);
        formData.append('page', this.step);
        Fetch.post(NewHttp+'CommentVisit', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    replyList: this.state.replyList.concat(res.data.data)
                },() => {
                    if(res.data.data.length > 0) {
                        this.setState({
                            isEnd: false
                        })
                    }else{
                        this.setState({
                            isEnd: true
                        })
                    }
                })
            }
        })
    }
    render() {
        return(
            <View style={{flex: 1}}>
                {
                    this.state.replyList.length > 0
                        ?
                        <FlatList
                            data={this.state.replyList}
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
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <Text style={{color: '#999'}}>暂无数据</Text>
                        </View>
                }
            </View>
        )
    }
}

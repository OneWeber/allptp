import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    FlatList,
    ActivityIndicator, ScrollView,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import action from '../../action'
import {connect} from 'react-redux'
import NewHttp from '../../utils/NewHttp';
import NoData from '../../common/NoData';
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import Modal from 'react-native-modalbox';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
const {width, height} = Dimensions.get('window')
class Focus extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: ''
        }
    }
    componentDidMount(){
        this.loadData();
    }
    loadData(val){
        const {token, onLoadFocus, focus} = this.props;
        const {user_id} = this.props.navigation.state.params;
        this.storeName='focus';
        let store = focus[this.storeName]
        this.step = 1
        let refreshType = false;
        if(val) {
            refreshType = true
        } else {
            refreshType = false
        }
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',1);
        formData.append('user_id',user_id);
        if(val){
            onLoadFocus(this.storeName, NewHttp + 'AttentionOL', formData,refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadFocus(this.storeName, NewHttp + 'AttentionOL', formData, refreshType, 0)
    }
    getLeftButton(){
        return <TouchableOpacity
            style={styles.back_icon}
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
    genIndicator(){
        const {focus} = this.props
        let store = focus[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined  ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore(){
        const {token, onLoadMoreFocus, focus} = this.props
        const {user_id} = this.props.navigation.state.params;
        let store = focus[this.storeName]
        this.step ++;
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',this.step);
        formData.append('user_id',user_id);
        onLoadMoreFocus(this.storeName, NewHttp + 'AttentionOL', formData , store.items, callback => {
            this.props.showFlash({
                message: '暂无更多关注的人',
                type: 'info',
                backgroundColor: '#999'
            })

        })
    }
    cancelCollection(user_id) {
        this.setState({
            user_id: user_id
        },()=>{
            this.refs.focus.open()
        })
    }
    cancelFocus() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('att_user_id',this.state.user_id);
        formData.append('type',2);
        Fetch.post(HttpUrl+'Comment/attention', formData).then(res => {
            if(res.code===1) {
                this.refs.focus.close();
                this.loadData();
                const {token, onLoadUserInfo} = this.props
                let formData=new FormData();
                this.storeNames='userinfo';
                formData.append('token', token);
                onLoadUserInfo(this.storeNames, HttpUrl+'User/get_user', formData)
            }
        })
    }
    renderItem(data){
        return <View style={[CommonStyle.flexCenter,{
            width:'100%',
            marginTop:30,
        }]}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.domain&&data.item.image_url?{uri:data.item.domain + data.item.image_url}:
                            require('../../../assets/images/touxiang.png')}
                        style={{width:40,height:40,borderRadius: 20}}
                    />
                    <View style={[CommonStyle.spaceCol,{
                        height:40,
                        marginLeft: 15,
                        maxWidth: 180,
                        alignItems:'flex-start'
                    }]}>
                        <Text style={{color:'#333',fontWeight:'bold',fontSize:15}}>{
                            data.item.family_name||data.item.middle_name||data.item.name
                                ?
                                data.item.family_name+' '+data.item.middle_name+' '+data.item.name
                                :
                                '匿名用户'
                        }</Text>

                        <Text numberOfLines={1} ellipsizeMode={'tail'}
                              style={{color:'#999',fontSize: 12}}>{data.item.introduce?data.item.introduce:'这个人很懒,什么都没有说'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    width:65,
                    height:24,
                    backgroundColor:'#f3f5f8',
                    borderRadius: 15,
                    flexDirection:'row'
                }]} onPress={()=>{
                    this.cancelCollection(data.item.user_id)
                }}>
                    <Text style={{color: '#999',fontSize: 12}}>取消关注</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    render(){
        const {focus, theme} = this.props;
        let store = focus[this.storeName];
        if(!store) {
            store = {
                items:[],
                isLoading: false
            }
        }
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'关注'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    style={{
                        borderBottomColor:'#f5f5f5',
                        borderBottomWidth: 1
                    }}
                />
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <ScrollView style={{flex: 1}}>
                            <View style={[CommonStyle.commonWidth,{
                                marginLeft: width*0.03
                            }]}>
                                <Text style={{
                                    marginTop: 24,
                                    color:'#333',
                                    fontSize: 13,
                                    fontWeight: 'bold'
                                }}>共关注了{store.items.data.data.data.length}个人</Text>
                            </View>
                            <View>
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
                            </View>
                        </ScrollView>
                    :
                        <NoData></NoData>
                }
                <Modal
                    style={{height:120,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"focus"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={[CommonStyle.flexCenter,{
                        height:120,
                        backgroundColor: '#fff'
                    }]}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5',
                            width:'100%'
                        }]} onPress={()=>{
                            this.cancelFocus()
                        }}>
                            <Text style={{
                                color:'#333'
                            }}>确定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60,
                            width: '100%'
                        }]} onPress={()=>{
                            this.refs.focus.close()
                        }}>
                            <Text style={{
                                color:'#999'
                            }}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    back_icon: {
        paddingLeft: width*0.03
    },
})
const mapStateToProps = state => ({
    token: state.token.token,
    focus: state.focus,
    theme: state.theme.theme,
    user: state.user.user
})
const mapDispatchToProps = dispatch => ({
    onLoadFocus: (storeName, url, data,refreshType, oNum, callback) => dispatch(action.onLoadFocus(storeName, url, data,refreshType, oNum, callback)),
    onLoadMoreFocus: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreFocus(storeName, url, data, oItems, callback)),
    onLoadUserInfo: (storeName, url, data) => dispatch(action.onLoadUserInfo(storeName, url, data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Focus)

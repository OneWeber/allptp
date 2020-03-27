import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    RefreshControl,
    ActivityIndicator,
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
const {width, height} = Dimensions.get('window')
class Fans extends Component{
    componentDidMount(){
        this.loadData();
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
    loadData(val){
        const {token, onLoadFans,fans} = this.props
        const {user_id} = this.props.navigation.state.params;
        this.storeName='fans';
        let store = fans[this.storeName]
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
            onLoadFans(this.storeName, NewHttp + 'attentionl', formData,refreshType, store.items.data.data.total, callback => {

            })
            return
        }
        onLoadFans(this.storeName, NewHttp + 'attentionl', formData, refreshType, 0)
    }
    genIndicator(){
        const {fans} = this.props
        let store = fans[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined  ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore(){
        const {token, onLoadMoreFans, fans} = this.props
        const {user_id} = this.props.navigation.state.params;
        let store = fans[this.storeName]
        this.step ++;
        let formData=new FormData();
        formData.append('token',token);
        formData.append('page',this.step);
        formData.append('user_id',user_id);
        onLoadMoreFans(this.storeName, NewHttp + 'attentionl', formData , store.items, callback => {
            this.props.showFlash({
                message: '暂无更多粉丝',
                type: 'info',
                backgroundColor: '#999'
            })

        })
    }
    renderItem(data){
        const {theme} = this.props
        return <View style={[CommonStyle.flexCenter,{
            width:'100%',
            paddingBottom: 15,
            paddingTop: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f5'
        }]}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.domain&&data.item.image_url?{uri:data.item.domain + data.item.image_url}:
                            require('../../../assets/images/touxiang.png')}
                        style={{width:60,height:60,borderRadius: 30}}
                    />
                    <View style={[CommonStyle.spaceCol,{
                        height:60,
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
                        <View style={CommonStyle.flexStart}>
                            <Text style={{color:'#999',fontSize: 12}}>策划了{data.item.activ_num}个活动,参加了{data.item.volun_num}个活动</Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'}
                              style={{color:'#999',fontSize: 12}}>{data.item.introduce?data.item.introduce:'这个人很懒,什么都没有说'}</Text>
                    </View>
                </View>
                {
                    data.item.is_mutualatt===1
                    ?
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            width:65,
                            height:25,
                            borderWidth: 1,
                            borderColor:'#999',
                            borderRadius: 15,
                            flexDirection:'row'
                        }]}>
                            <Text style={{color: '#999',fontSize: 12}}>取消关注</Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            width:65,
                            height:25,
                            borderWidth: 1,
                            borderColor:theme,
                            borderRadius: 15,
                            flexDirection:'row'
                        }]}>
                            <Text style={{color: theme,fontSize: 12}}>互相关注</Text>
                        </TouchableOpacity>
                }

            </View>
        </View>
    }
    render(){
        const {fans, theme} = this.props;
        let store = fans[this.storeName];
        if(!store) {
            store = {
                items:[],
                isLoading: false
            }
        }
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'粉丝'}
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
                        <View style={{flex: 1}}>
                            <FlatList
                                data={store.items.data.data.data}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                    <RefreshControl
                                        title={'loading'}
                                        titleColor={theme}
                                        colors={[theme]}
                                        refreshing={store.isLoading}
                                        onRefresh={() => {this.loadData(true)}}
                                        tintColor={theme}
                                    />
                                }
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
                        :
                        <NoData></NoData>
                }
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
    fans: state.fans,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadFans: (storeName, url, data,refreshType, oNum, callback) => dispatch(action.onLoadFans(storeName, url, data,refreshType, oNum, callback)),
    onLoadMoreFans: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreFans(storeName, url, data, oItems, callback))
})
export default connect(mapStateToProps, mapDispatchToProps)(Fans)

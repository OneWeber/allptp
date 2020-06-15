import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Image,
    RefreshControl, FlatList,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import NoData from '../../common/NoData';
import LazyImage from 'animated-lazy-image';
import Badge from '../../model/Badge';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import languageType from '../../json/languageType'
import HttpUrl from '../../utils/Http';
const {width, height} = Dimensions.get('window')
class MsgPage extends Component{

    componentDidMount() {
        this.loadData();
        this.loadApply();
    }
    loadData(){
        const {onLoadMsg} = this.props;
        this.storeName='msg';
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('page',1);
        onLoadMsg(this.storeName, NewHttp+'MyMsg', formData)
    }
    loadApply() {
        const {onLoadFriendApply} = this.props;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        onLoadFriendApply('friendapply', HttpUrl+'Friend/getlist', formData)
    }
    renderItem(data){
        return <TouchableOpacity style={[CommonStyle.spaceRow,{
            marginTop: data.index===0?24:40,
            alignItems:'flex-start'
        }]} onPress={()=>{
            NavigatorUtils.goPage({user_id:data.item.user_id,name:data.item.user.family_name+data.item.user.middle_name+data.item.user.name}, 'Chat')
        }}>
            <LazyImage
                source={data.item.user&&data.item.user.headimage&&data.item.user.headimage.domain&&data.item.user.headimage.image_url?
                    {uri:data.item.user.headimage.domain+data.item.user.headimage.image_url}:require('../../../assets/images/touxiang.png')}
                style={{width:45,height:45,borderRadius: 22.5}}
            />
            <View style={[CommonStyle.spaceCol,{
                width:width*0.94-60,
                height:45
            }]}>
                <View style={[CommonStyle.spaceRow,{width:'100%'}]}>
                    {
                        data.item.user.family_name||data.item.user.middle_name||data.item.user.name
                            ?
                            <Text style={{color:'#333',fontSize:15}}>
                                {data.item.user.family_name}
                                {data.item.user.middle_name?''+data.item.user.middle_name:''}
                                {data.item.user.name?''+data.item.user.name:''}
                            </Text>
                            :
                            <Text style={{color:'#333333',fontSize:15}}>匿名用户</Text>
                    }
                    <Text style={{
                        color:'#bfbfbf',
                        fontSize: 11
                    }}>{data.item.long_age}</Text>
                </View>
                <View style={[CommonStyle.spaceRow,{width:'100%'}]}>
                    {
                        data.item.noread_count
                        ?
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{
                                color:'#999',
                                fontSize: 13,
                                maxWidth:width*0.94-60-25
                            }}>{data.item.content}</Text>
                        :
                            <Text numberOfLines={2} ellipsizeMode={'tail'} style={{
                                color:'#999',
                                fontSize: 13
                            }}>{data.item.content}</Text>
                    }
                    {
                        data.item.noread_count
                        ?
                            <Badge num={data.item.noread_count}/>
                        :
                            null
                    }
                </View>
            </View>
        </TouchableOpacity>
    }
    render(){
        const {msg, language, friendapply} = this.props;
        let store = msg[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        let applyStore = friendapply['friendapply'];
        if(!applyStore) {
            applyStore = {
                items: [],
                isLoading: false,
                applyLength: []
            }
        }
        return (
            <View style={styles.container} >
                <RNEasyTopNavBar
                    title={language===1?languageType.CH.msg.title:language===2?languageType.EN.msg.title:languageType.JA.msg.title}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                />
                <ScrollView>
                    <TouchableOpacity
                        style={[CommonStyle.flexCenter]}
                        onPress={()=>NavigatorUtils.goPage({},'Contact')}
                    >
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height:77
                        }]}>
                            <View style={CommonStyle.flexStart}>
                                <Image
                                    source={require('../../../assets/images/msg/lxr.png')}
                                    style={{width:40,height:40}}
                                />
                                <Text style={{
                                    marginLeft: 15,
                                    color:'#333',
                                    fontSize: 15
                                }}>
                                    {
                                        language===1?languageType.CH.msg.contact:language===2?languageType.EN.msg.contact:languageType.JA.msg.contact
                                    }
                                </Text>
                            </View>
                            <AntDesign
                                name={'right'}
                                size={16}
                                style={{color:'#dfe1e4'}}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        borderBottomWidth: 10,
                        borderBottomColor:'#f5f5f5'
                    }]}
                    onPress={()=>NavigatorUtils.goPage({},'FriendApply')}
                    >
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height:77
                        }]}>
                            <View style={CommonStyle.flexStart}>
                                <Image
                                    source={require('../../../assets/images/msg/hysq.png')}
                                    style={{width:40,height:40}}
                                />
                                <Text style={{
                                    marginLeft: 15,
                                    color:'#333',
                                    fontSize: 15
                                }}>
                                    {
                                        language===1?languageType.CH.msg.apply:language===2?languageType.EN.msg.apply:languageType.JA.msg.apply
                                    }
                                </Text>
                            </View>
                            <View style={CommonStyle.flexEnd}>
                                {
                                    applyStore.applyLength.length>0
                                    ?
                                        <Badge num={applyStore.applyLength.length}/>
                                    :
                                        null
                                }
                                <AntDesign
                                    name={'right'}
                                    size={16}
                                    style={{color:'#dfe1e4'}}
                                />
                            </View>

                        </View>
                    </TouchableOpacity>
                    <View style={CommonStyle.flexCenter}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                marginTop: 15
                            }}>
                                {
                                    language===1?languageType.CH.msg.all_msg:language===2?languageType.EN.msg.all_msg:languageType.JA.msg.all_msg
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={CommonStyle.flexCenter}>
                        {
                            store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                                ?
                                <View style={CommonStyle.commonWidth}>
                                    <FlatList
                                        data={store.items.data.data.data}
                                        showsVerticalScrollIndicator = {false}
                                        renderItem={data=>this.renderItem(data)}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                                :
                                <View>
                                    <Image
                                    source={require('../../../assets/images/que/wxx.png')}
                                    style={{
                                       width:180,
                                       height:180,
                                       marginTop: 60,
                                       marginBottom:60
                                    }}
                                    />
                                </View>
                        }
                    </View>

                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
});
const mapStateToProps = state => ({
    token: state.token.token,
    msg: state.msg,
    language: state.language.language,
    friendapply: state.friendapply,
});
const mapDispatchToProps = dispatch => ({
    onLoadMsg: (storeName, url, data) => dispatch(action.onLoadMsg(storeName, url, data)),
    onLoadFriendApply: (storeName, url, data) => dispatch(action.onLoadFriendApply(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(MsgPage)

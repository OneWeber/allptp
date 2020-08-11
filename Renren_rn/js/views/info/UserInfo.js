import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    FlatList,
    RefreshControl, TouchableOpacity, TextInput,
} from 'react-native';
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import AntDesign from 'react-native-vector-icons/AntDesign'
import LinearGradient from "react-native-linear-gradient";
import languageType from '../../json/languageType';
import Viewswiper from '../../model/Viewswiper';
import NewHttp from '../../utils/NewHttp';
import NoData from '../../common/NoData';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-easy-toast';
const {width, height} = Dimensions.get('window');
class UserInfo extends Component{
    constructor(props) {
        super(props);
        this.user_id = this.props.navigation.state.params.user_id;
        this.state = {
            userInfo: '',
            tabIndex: 0
        }
    }
    componentDidMount() {
        const {token} = this.props;
        let user_id = this.props.navigation.state.params.user_id;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('user_id', user_id);
        Fetch.post(HttpUrl+'User/get_otheruser', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    userInfo: res.data
                },() => {
                    console.log('userInfo', this.state.userInfo)
                })
            }
        })
    }
    render(){
        const {userInfo, tabIndex} = this.state;
        return <SafeAreaView style={{flex: 1}}>
            <Toast ref="toast" position='center' positionValue={0}/>
            <View style={[CommonStyle.flexStart,{
                height: 50
            }]}>
                <TouchableOpacity onPress={()=>{
                    NavigatorUtils.backToUp(this.props)
                }}>
                    <AntDesign
                        name={'left'}
                        size={20}
                        style={{color:'#333',paddingLeft: width*0.03}}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
                <View style={CommonStyle.flexCenter}>
                    <UserHeader
                        {...this.props}
                        {...this.state}
                        showToast={(data) => {
                            this.refs.toast.show(data)
                        }}
                        initData={()=>{this.componentDidMount()}}
                    />
                    <View style={[CommonStyle.commonWidth,{
                        marginTop: 15
                    }]}>
                        <Text style={{color:'#999'}}>
                            {
                                userInfo.introduce
                                    ?
                                    userInfo.introduce
                                    :
                                    '什么也没有留下'
                            }
                        </Text>
                    </View>
                    <UserList {...this.props} {...this.state}/>
                    <View style={[CommonStyle.flexStart,CommonStyle.commonWidth,{
                        marginTop: 27
                    }]}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                tabIndex: 0
                            })
                        }}>
                            <Text style={{
                                color:tabIndex===0?this.props.theme:'#333',
                                fontWeight: 'bold'
                            }}>最新动态</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            marginLeft: 15
                        }} onPress={()=>{
                            this.setState({
                                tabIndex: 1
                            })
                        }}>
                            <Text style={{
                                color:tabIndex===1?this.props.theme:'#333',
                                fontWeight: 'bold'
                            }}>体验</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            marginLeft: 15
                        }} onPress={()=>{
                            this.setState({
                                tabIndex: 2
                            })
                        }}>
                            <Text style={{
                                color:tabIndex===2?this.props.theme:'#333',
                                fontWeight: 'bold'
                            }}>故事</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        tabIndex===0
                        ?
                            <RecentNews {...this.props} user_id={this.user_id}/>
                        :
                            tabIndex===1
                        ?
                            <Active {...this.props} user_id={this.user_id} {...this.state}/>
                        :
                            <Story {...this.props} user_id={this.user_id} {...this.state}/>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme,
    user: state.user.user
})
export default connect(mapStateToProps)(UserInfo)
class UserHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
        }
    }
    onFocus(user_id) {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('att_user_id',user_id);
        formData.append('type',1);
        Fetch.post(HttpUrl+'Comment/attention', formData).then(res => {
            if(res.code === 1) {
                this.props.initData()
            }
        })
    }
    addFriend() {
        this.refs.addfriend.close();
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('f_user_id',this.props.userInfo.user_id);
        formData.append('msg',this.state.msg);
        Fetch.post(HttpUrl+'Friend/ask_friend', formData).then(res => {
            if(res.code === 1) {
                this.props.showToast('好友申请发送成功')
            }else{
                this.props.showToast(res.msg)
            }
        })
    }
    render() {
        const {userInfo} = this.props
        return(
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                marginTop: 10
            }]}>
                <LazyImage
                    source={userInfo&&userInfo.headimage&&userInfo.headimage.domain&&userInfo.headimage.image_url?
                        {uri:userInfo.headimage.domain+userInfo.headimage.image_url}:
                        require('../../../assets/images/touxiang.png')}
                    style={{width:60,height:60,borderRadius: 30}}
                />
                <View style={[CommonStyle.spaceRow,{
                    width: width*0.94-70
                }]}>
                    <View style={[CommonStyle.spaceCol,{
                        height: 60,
                        width:width*0.94 - 214,
                        alignItems:'flex-start',
                    }]}>
                        <Text style={{
                            color:'#333',
                            fontSize: 18,
                            fontWeight:'600'}}>
                            {
                                userInfo.family_name||userInfo.middle_name||userInfo.name
                                    ?
                                    userInfo.family_name+userInfo.middle_name+userInfo.name
                                    :
                                    '匿名用户'
                            }
                            {
                                this.props.navigation.state.params.user_id == this.props.user.userid
                                ?
                                    '(我)'
                                :
                                    null
                            }
                        </Text>
                        <View style={CommonStyle.flexStart}>
                            {
                                userInfo.isvolunteer && userInfo.audit_idcard == 1
                                    ?
                                    <LinearGradient colors={['#14BBCA', '#14c5ca']} style={[styles.role_item,CommonStyle.flexCenter,{
                                        marginRight: 10
                                    }]}>
                                        <Text style={{color:'#fff',fontSize:11}}>
                                            志愿者
                                        </Text>
                                    </LinearGradient>
                                    :
                                    null
                            }
                            {
                                userInfo.isplanner && userInfo.audit_face==2
                                    ?
                                    <LinearGradient colors={['#19CBBC', '#1ACBC9']} style={[styles.role_item,CommonStyle.flexCenter,{
                                        marginRight:10
                                    }]}>
                                        <Text style={{color:'#fff',fontSize:11}}>
                                            策划者
                                        </Text>
                                    </LinearGradient>
                                    :
                                    null
                            }
                        </View>
                    </View>
                    {
                        this.props.navigation.state.params.user_id == this.props.user.userid
                            ?
                            <View style={CommonStyle.flexEnd}></View>
                            :
                            <View style={CommonStyle.flexEnd}>
                                {
                                    userInfo.is_attention
                                    ?
                                        <View style={[CommonStyle.flexCenter,{
                                            width: 49,
                                            height: 24,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: this.props.theme,
                                            flexDirection: 'row',
                                            marginRight: 10
                                        }]}>
                                            <Text style={{
                                                color:this.props.theme,
                                                fontSize: 12
                                            }}>已关注</Text>
                                        </View>
                                    :
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            width: 49,
                                            height: 24,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: this.props.theme,
                                            flexDirection: 'row',
                                            marginRight: 10
                                        }]}
                                        onPress={() => {
                                            this.onFocus(userInfo.user_id)
                                        }}
                                        >
                                            <AntDesign
                                                name={'plus'}
                                                size={12}
                                                style={{color: this.props.theme}}
                                            />
                                            <Text style={{
                                                color:this.props.theme,
                                                fontSize: 12
                                            }}>关注</Text>
                                        </TouchableOpacity>
                                }

                                {
                                    userInfo.is_friend
                                    ?
                                        <View style={[CommonStyle.flexCenter,{
                                            width: 65,
                                            height: 24,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: this.props.theme
                                        }]}>
                                            <Text style={{
                                                color:this.props.theme,
                                                fontSize: 12
                                            }}>已是好友</Text>
                                        </View>
                                    :
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            width: 65,
                                            height: 24,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: this.props.theme
                                        }]}
                                        onPress={() => {
                                            this.refs.addfriend.open()
                                        }}
                                        >
                                            <Text style={{
                                                color:this.props.theme,
                                                fontSize: 12
                                            }}>添加好友</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                    }
                </View>
                <Modal
                    style={{height:300,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"addfriend"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 300,
                        backgroundColor: '#fff'
                    }}>
                        <View style={[CommonStyle.commonWidth,{
                            marginLeft: width*0.03
                        }]}>
                            <Text style={{
                                marginTop: 15,
                                color:'#333'
                            }}>好友验证信息</Text>
                            <TextInput
                                placeholder={'输入验证信息'}
                                multiline={true}
                                defaultValue={this.state.msg}
                                onChangeText={(text) => {this.setState({msg: text})}}
                                style={{
                                    height:160,
                                    marginTop: 15,
                                    borderWidth: 1,
                                    borderColor: '#f5f5f5',
                                    textAlignVertical:'top',
                                    padding: 10
                                }}
                            />
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                height:40,
                                marginTop: 15,
                                backgroundColor: this.props.theme,
                                borderRadius: 5
                            }]}
                            onPress={() => {
                                this.addFriend()
                            }}
                            >
                                <Text style={{
                                    color:'#fff'
                                }}>确定添加</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
class UserList extends Component{
    render() {
        const {userInfo} = this.props
        return(
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                height: 70,
                backgroundColor: '#fff',
                marginTop: 19.5,
                borderRadius: 5,
                paddingLeft: 15,
                paddingRight: 15
            }]}>
                <TouchableOpacity
                    style={CommonStyle.flexCenter}
                    onPress={() => {
                        NavigatorUtils.goPage({
                            collect_group:userInfo.collect_group?userInfo.collect_group:[]
                        }, 'UserCollection')
                    }}
                >
                    <Text style={styles.user_item_num}>{userInfo.collect_group?userInfo.collect_group.length:0}</Text>
                    <Text style={styles.user_item_txt}>收藏夹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={CommonStyle.flexCenter}
                    onPress={() => {
                        NavigatorUtils.goPage({user_id: userInfo.user_id}, 'UserFans')
                    }}
                >
                    <Text style={styles.user_item_num}>{userInfo.fans_num?userInfo.fans_num:0}</Text>
                    <Text style={styles.user_item_txt}>粉丝</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={CommonStyle.flexCenter}
                    onPress={() => {
                        NavigatorUtils.goPage({user_id: userInfo.user_id}, 'UserFocus')
                    }}
                >
                    <Text style={styles.user_item_num}>{userInfo.attention_num?userInfo.attention_num:0}</Text>
                    <Text style={styles.user_item_txt}>关注</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={CommonStyle.flexCenter}
                    onPress={() => {
                        NavigatorUtils.goPage({user_id: userInfo.user_id}, 'UserReply')
                    }}
                >
                    <Text style={styles.user_item_num}>{userInfo.comment_num?userInfo.comment_num:0}</Text>
                    <Text style={styles.user_item_txt}>获得的评价</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
class RecentNews extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dynamicList: [],
            isLoading: false
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        this.setState({
            isLoading: true
        })
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('page',1);
        formData.append('user_id',this.props.user_id);
        Fetch.post(NewHttp+'Dynamic', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    dynamicList: res.data.data,
                    isLoading: false
                })
            }
        })
    }
    render() {
        let dynamic = [];
        if(this.state.dynamicList&&this.state.dynamicList.length>0) {
            for(let i=0;i<this.state.dynamicList.length;i++) {
                dynamic.push(
                    <View key={i} style={{
                        padding: 14,
                        backgroundColor:'#fff',
                        marginTop: 15
                    }}>
                        <View style={[CommonStyle.flexStart]}>
                            <LazyImage
                                source={this.state.dynamicList[i]&&this.state.dynamicList[i].domain&&this.state.dynamicList[i].image_url?
                                    {uri:this.state.dynamicList[i].domain+this.state.dynamicList[i].image_url}:
                                    require('../../../assets/images/touxiang.png')}
                                style={{width:40,height:40,borderRadius: 20}}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                height:40,
                                marginLeft: 12,
                                alignItems:'flex-start'
                            }]}>
                                <View style={CommonStyle.flexStart}>
                                    {
                                        this.props.user_id === this.props.user.userid
                                            ?
                                            <Text style={{color:'#333'}}>你</Text>
                                            :
                                            this.state.dynamicList[i].family_name||this.state.dynamicList[i].middle_name||this.state.dynamicList[i].name
                                                ?
                                                <Text style={{color:'#333'}}>
                                                    {this.state.dynamicList[i].family_name+this.state.dynamicList[i].middle_name+this.state.dynamicList[i].name}
                                                </Text>
                                                :
                                                <Text style={{color:'#333'}}>匿名用户</Text>
                                    }
                                    <Text style={{
                                        marginLeft: 10,
                                        color:'#333'
                                    }}>{this.state.dynamicList[i].flag==1?'创建活动:':this.state.dynamicList[i].flag==2?'发布故事:':'转发:'}</Text>
                                </View>
                                <Text style={{color:'#666',fontSize: 12}}>{this.state.dynamicList[i].create_time}</Text>
                            </View>
                        </View>
                        <View style={{marginTop: 15}}>
                            {
                                this.state.dynamicList[i]&&this.state.dynamicList[i].datas&&this.state.dynamicList[i].datas.image&&this.state.dynamicList[i].datas.image.length === 1
                                    ?
                                    <LazyImage
                                        source={{uri:this.state.dynamicList[i].datas.image[0].domain+this.state.dynamicList[i].datas.image[0].image_url}}
                                        style={{width:'100%',height:150}}
                                    />
                                    :
                                    this.state.dynamicList[i]&&this.state.dynamicList[i].datas&&this.state.dynamicList[i].datas.image&&this.state.dynamicList[i].datas.image.length === 2
                                        ?
                                        <View style={CommonStyle.spaceRow}>
                                            <LazyImage
                                                source={{uri:this.state.dynamicList[i].datas.image[0].domain+this.state.dynamicList[i].datas.image[0].image_url}}
                                                style={{width:(width*0.94 - 5 -28)/2,height:150,borderRadius: 2}}
                                            />
                                            <LazyImage
                                                source={{uri:this.state.dynamicList[i].datas.image[1].domain+this.state.dynamicList[i].datas.image[1].image_url}}
                                                style={{width:(width*0.94 - 5 -28)/2,height:150,borderRadius: 2}}
                                            />
                                        </View>
                                        :
                                        this.state.dynamicList[i]&&this.state.dynamicList[i].datas&&this.state.dynamicList[i].datas.image&&this.state.dynamicList[i].datas.image.length >=3
                                            ?
                                            <View style={CommonStyle.spaceRow}>
                                                <LazyImage
                                                    source={{uri:this.state.dynamicList[i].datas.image[0].domain+this.state.dynamicList[i].datas.image[0].image_url}}
                                                    style={{width:(width*0.94 - 5 -28)/2,height:150,borderRadius: 2}}
                                                />
                                                <View style={[CommonStyle.spaceCol,{
                                                    width:(width*0.94 - 5 -28)/2,
                                                    height: 150
                                                }]}>
                                                    <LazyImage
                                                        source={{uri:this.state.dynamicList[i].datas.image[1].domain+this.state.dynamicList[i].datas.image[1].image_url}}
                                                        style={{width:(width*0.94 - 5 -28)/2,height:72.5,borderRadius: 2}}
                                                    />
                                                    <LazyImage
                                                        source={{uri:this.state.dynamicList[i].datas.image[2].domain+this.state.dynamicList[i].datas.image[2].image_url}}
                                                        style={{width:(width*0.94 - 5 -28)/2,height:72.5,borderRadius: 2}}
                                                    />
                                                </View>
                                            </View>
                                            :
                                            null
                            }
                        </View>
                        <Text style={{
                            color:'#999',
                            fontSize: 12,
                            marginTop: 12
                        }}>{this.state.dynamicList[i].datas.country+this.state.dynamicList[i].datas.province+this.state.dynamicList[i].datas.city+this.state.dynamicList[i].datas.region}</Text>
                        <Text style={{
                            color:'#333',
                            fontWeight: "bold",
                            marginTop: 10.5
                        }}>{this.state.dynamicList[i].datas.title}</Text>
                        {
                            this.state.dynamicList[i].flag===2
                                ?
                                <Text numberOfLines={2} ellipsizeMode={'tail'}
                                      style={{
                                          lineHeight: 20,
                                          color:'#333',
                                          fontSize: 13,
                                          marginTop: 9
                                      }}>{this.state.dynamicList[i].datas.content}</Text>
                                :
                                null
                        }

                        <View style={[CommonStyle.flexStart,{
                            marginTop: 18
                        }]}>
                            <View style={CommonStyle.flexStart}>
                                <Text style={{color:'#999',fontSize: 12}}>评论</Text>
                                <Text style={{color:'#999',fontSize: 12,marginLeft: 3}}>{this.state.dynamicList[i].datas.leaving_num}</Text>
                            </View>
                            <View style={[CommonStyle.flexStart,{
                                marginLeft: 15
                            }]}>
                                <Text style={{color:'#999',fontSize: 12}}>收藏</Text>
                                <Text style={{color:'#999',fontSize: 12,marginLeft: 3}}>{this.state.dynamicList[i].datas.collection_num}</Text>
                            </View>
                            {
                                this.state.dynamicList[i].flag === 2
                                    ?
                                    <View style={[CommonStyle.flexStart,{
                                        marginLeft: 15
                                    }]}>
                                        <Text style={{color:'#999',fontSize: 12}}>赞</Text>
                                        <Text style={{color:'#999',fontSize: 12,marginLeft: 3}}>{this.state.dynamicList[i].datas.praise_num}</Text>
                                    </View>
                                    :
                                    null
                            }
                        </View>


                    </View>
                )
            }
        }

        return(
            <View style={CommonStyle.flexCenter}>
                <View style={CommonStyle.commonWidth}>
                    {
                        this.state.isLoading
                        ?
                            <ActivityIndicator size={'small'} color={'#999'} style={{marginTop: 20}}/>
                        :
                            this.state.dynamicList.length > 0
                        ?
                           dynamic
                        :
                                <View style={{
                                    marginTop:30,
                                    marginBottom: 30
                                }}>
                                    <NoData></NoData>
                                </View>
                    }

                </View>
            </View>
        )
    }
}
class Active extends Component{
    render() {
        const {create_activity} = this.props.userInfo;
        let active=[];
        if(create_activity) {
            for(let i=0;i<create_activity.length;i++) {
                active.push(
                    <View style={{
                        padding: 15,
                        marginTop: 15,
                        backgroundColor: '#fff',
                    }}>
                        <LazyImage
                            source={create_activity[i]&&create_activity[i].cover&&create_activity[i].cover.domain&&create_activity[i].cover.image_url?
                                {uri:create_activity[i].cover.domain+create_activity[i].cover.image_url}:
                                require('../../../assets/images/error.png')}
                            style={{
                                width: '100%',
                                height: 150,
                                borderRadius: 2
                            }}
                        />
                    </View>
                )
            }
        }
        return(
            <View style={CommonStyle.flexCenter}>
                <View style={CommonStyle.commonWidth}>
                    {
                        create_activity && create_activity.length > 0
                        ?
                            <View>
                                {active}
                            </View>
                        :
                            <View style={{
                                marginTop:30,
                                marginBottom: 30
                            }}>
                                <NoData></NoData>
                            </View>
                    }
                </View>
            </View>
        )
    }
}
class Story extends Component{
    render(){
        const {story_list} = this.props.userInfo;
        let story = [];
        if(story_list&&story_list.length>0) {
            for(let i=0;i<story_list.length;i++) {
                story.push(
                    <View style={[{
                        padding: 15,
                        backgroundColor: '#fff',
                        marginTop: 15
                    }]}>
                        <Text style={{
                            color:'#666',
                            fontSize: 12
                        }}>{story_list[i].create_time}</Text>
                        <View style={[CommonStyle.spaceRow,{
                            marginTop: 10
                        }]}>
                            <LazyImage
                                source={story_list[i].cover&&story_list[i].cover.domain&&story_list[i].cover.image_url?
                                    {uri:story_list[i].cover.domain+story_list[i].cover.image_url}:
                                    require('../../../assets/images/error.png')}
                                style={{
                                    width: 120,
                                    height: 90,
                                    borderRadius: 2
                                }}
                            />
                            <View style={[CommonStyle.spaceCol,{
                                width:width*0.94-120-30-10,
                                height: 90,
                                alignItems:'flex-start',
                            }]}>
                                <Text style={{color:'#333',fontWeight: 'bold'}}>{story_list[i].title}</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        }
        return (
            <View style={CommonStyle.flexCenter}>
                <View style={CommonStyle.commonWidth}>
                    {
                        story_list && story_list.length > 0
                            ?
                            story
                            :
                            <View style={{
                                marginTop:30,
                                marginBottom: 30
                            }}>
                                <NoData></NoData>
                            </View>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    role_item:{
        paddingLeft: 5,
        paddingRight: 5,
        height:20,
        borderRadius:10,
    },
    user_item_num: {
        color:'#333',
        fontWeight: '600',
        fontSize: 17
    },
    user_item_txt: {
        color:'#999',
        fontSize: 12,
        marginTop: 11
    },
    under_line: {
        position:'absolute',
        left:5,
        right:5,
        bottom: -8,
        height:2,
        backgroundColor:'#14c5ca',
        borderRadius: 3
    }
})

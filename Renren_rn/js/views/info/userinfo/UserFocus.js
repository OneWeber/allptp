import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LazyImage from 'animated-lazy-image';
class UserFocus extends Component{
    constructor(props) {
        super(props);
        this.user_id = this.props.navigation.state.params.user_id;
        this.state = {
            focusList: [],
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
        formData.append('user_id', this.user_id);
        formData.append('page', 1);
        Fetch.post(NewHttp+ 'AttentionOL', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    focusList: res.data.data
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
    renderItem(data) {
        const {theme} = this.props
        return <View style={[CommonStyle.flexCenter,{
            width:'100%',
            marginTop: 30

        }]}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.domain&&data.item.image_url?{uri:data.item.domain + data.item.image_url}:
                            require('../../../../assets/images/touxiang.png')}
                        style={{width:40,height:40,borderRadius: 30}}
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
            </View>
        </View>
    }
    genIndicator() {
        return this.state.isEnd || this.state.focusList.length < 10 ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    onLoadMore() {
        this.step ++ ;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('user_id', this.user_id);
        formData.append('page', this.step);
        Fetch.post(NewHttp+'AttentionOL', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    focusList: this.state.focusList.concat(res.data.data)
                },() => {
                    if(res.data.data.length>0){
                        this.setState({
                            isEnd:false
                        })
                    }else{
                        this.setState({
                            isEnd:true
                        })
                    }
                })
            }
        })
    }
    render(){
        return(
            <View style={{
                flex: 1,
                backgroundColor: '#fff'
            }}>
                <RNEasyTopNavBar
                    title={'她/他的关注'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    style={{
                        borderBottomColor:'#f5f5f5',
                        borderBottomWidth: 1
                    }}
                />
                {
                    this.state.focusList.length>0
                        ?
                        <FlatList
                            data={this.state.focusList}
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
                        <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                            <Text style={{color:'#999'}}>暂无数据</Text>
                        </View>
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token
})
export default connect(mapStateToProps)(UserFocus)

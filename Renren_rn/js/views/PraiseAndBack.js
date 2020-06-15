import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../assets/css/Common_css';
import CustomeTabBar from '../model/CustomeTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux';
import Fetch from '../expand/dao/Fetch';
import NewHttp from '../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import NoData from '../common/NoData';
const {width} = Dimensions.get('window')
class PraiseAndBack extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [ '获赞', '回复我的']
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
    render() {
        const {theme} = this.props;
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'获赞与回复'}
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
                        activeColor={theme}
                        isWishLarge={true}
                        inactiveColor={'#999'}
                    />)}>
                    <GetPraise tabLabel={'获赞'} {...this.props}/>
                    <GetBack tabLabel={'回复我的'} {...this.props}/>
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme:state.theme.theme
})
export default connect(mapStateToProps)(PraiseAndBack)
class GetPraise extends Component{
    constructor(props) {
        super(props);
        this.state = {
            praiseList: []
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('user_id', this.props.navigation.state.params.user_id);
        formData.append('page', 1);
        Fetch.post(NewHttp+'MyPraise', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    praiseList: res.data.data
                })
            }
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
            marginTop: data.index===0?20:30,
            marginLeft: width*0.03
        }]}>
            <View style={CommonStyle.flexStart}>
                <LazyImage
                source={data.item.domain&&data.item.image_url?{
                    uri: data.item.domain + data.item.image_url
                }:require('../../assets/images/error.png')}
                style={{width: 40,height:40,borderRadius: 20}}
                />
                <View style={[CommonStyle.spaceCol,{
                    height: 40,
                    marginLeft: 10,
                    maxWidth: width*0.94-50-120,
                    alignItems: 'flex-start'
                }]}>
                    <Text style={{color:'#7b7b7b',fontSize: 13}}>
                        <Text style={{
                            color:this.props.theme
                        }}>
                            {
                                data.item.family_name||data.item.middle_name||data.item.name
                                    ?
                                    <Text>
                                        {data.item.family_name?data.item.family_name+' ':''}
                                        {data.item.middle_name?data.item.middle_name+' ':''}
                                        {data.item.name?data.item.name+' ':''}
                                    </Text>
                                    :
                                    '匿名用户'
                            }
                        </Text>
                        赞了你
                    </Text>
                    <View>
                        {
                            data.item.flag===1
                            ?
                                <Text style={{color:'#333',fontSize: 12}}>来自故事: {data.item.title}</Text>
                            :
                            data.item.flag===2
                            ?
                                <Text style={{color:'#333',fontSize: 12}}>来自翻译: {data.item.title}</Text>
                            :
                                <Text style={{color:'#333',fontSize: 12}}>来自留言/评论: {data.item.title}</Text>

                        }
                    </View>
                </View>
            </View>
            <View style={{
                height: 40,
                justifyContent:'flex-start'
            }}>
                <Text style={{
                    color:'#999',
                    fontSize: 12
                }}>{data.item.create_time}</Text>
            </View>
        </View>
    }
    render() {
        return(
            <View style={{flex: 1}}>
                {
                    this.state.praiseList.length>0
                    ?
                        <FlatList
                            data={this.state.praiseList}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <NoData />
                        </View>
                }

            </View>
        )
    }
}
class GetBack extends Component{
    constructor(props) {
        super(props);
        this.state = {
            backList: []
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        Fetch.post(NewHttp+'msgreply', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    backList: res.data.data
                })
                console.log(res)
            }
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
            marginTop: data.index===0?20:30,
            marginLeft: width*0.03
        }]}>
            <View style={CommonStyle.flexStart}>
                <LazyImage
                    source={data.item.domain&&data.item.image_url?{
                        uri: data.item.domain + data.item.image_url
                    }:require('../../assets/images/error.png')}
                    style={{width: 40,height:40,borderRadius: 20}}
                />
                <View style={[CommonStyle.spaceCol,{
                    height: 40,
                    marginLeft: 10,
                    maxWidth: width*0.94-50-120,
                    alignItems: 'flex-start'
                }]}>
                    <Text style={{color:'#7b7b7b',fontSize: 13}}>
                        <Text style={{
                            color:this.props.theme
                        }}>
                            {
                                data.item.family_name||data.item.middle_name||data.item.name
                                    ?
                                    <Text>
                                        {data.item.family_name?data.item.family_name+' ':''}
                                        {data.item.middle_name?data.item.middle_name+' ':''}
                                        {data.item.name?data.item.name+' ':''}
                                    </Text>
                                    :
                                    '匿名用户'
                            }
                        </Text>
                        回复了你
                    </Text>
                    <Text style={{color:'#333',fontSize: 12}}>{data.item.content}</Text>
                </View>
            </View>
            <View style={[CommonStyle.spaceCol,{
                height: 40,
                alignItems:'flex-end',
                maxWidth: 120
            }]}>
                <Text
                    numberOfLines={1} ellipsizeMode={'tail'}
                    style={{
                    color:'#999',
                    fontSize: 12
                }}>{data.item.create_time}</Text>
                <Text
                    numberOfLines={1} ellipsizeMode={'tail'}
                    style={{
                    color:'#999',
                    fontSize: 12
                }}>{data.item.title}</Text>
            </View>
        </View>
    }
    render() {
        return(
            <View style={{flex: 1}}>
                {
                    this.state.backList.length>0
                        ?
                        <FlatList
                            data={this.state.backList}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <NoData />
                        </View>
                }

            </View>
        )
    }
}

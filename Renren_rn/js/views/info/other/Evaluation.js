import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView, TextInput,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomeTabBar from '../../../model/CustomeTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import dateDiff from '../../../utils/DateDiff';
const {width, height} = Dimensions.get('window')
class Evaluation extends Component{
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
                    title={'评价'}
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
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5'
                        }}
                    />)}>
                    <EvaluationPlanner tabLabel={'策划人评价'} {...this.props}/>
                    <EvaluationVolunteer tabLabel={'游客评价'} {...this.props}/>
                    <MyEvaluation tabLabel={'我写的评价'} {...this.props}/>
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProsp = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    user: state.user.user
})
export default connect(mapStateToProsp)(Evaluation)
class EvaluationPlanner extends Component{
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isMessage: false
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('page',1);
        formData.append('user_id',this.props.user.userid);
        Fetch.post(NewHttp+'CommentPlanner', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    comments: res.data.data
                })
            }
        })
    }
    goBackMessage() {
        this.setState({
            isMessage: true
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.flexCenter,{
            marginTop: data.index===0?20:25,
            paddingBottom: 15,
            borderBottomWidth:1,
            borderBottomColor: '#f5f5f5'
        }]}>
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
                        }} onLongPress={()=>{
                            this.goBackMessage()
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
        </View>
    }
    render(){
        return <View style={{flex: 1}}>
            <FlatList
                data={this.state.comments}
                showsVerticalScrollIndicator = {false}
                renderItem={data=>this.renderItem(data)}
                keyExtractor={(item, index) => index.toString()}
            />
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    autoFocus={true}
                    placeholder={'回复王丽'}
                    style={{
                        width:width,
                        height: 49,
                        paddingLeft: 10
                    }}
                />
            </KeyboardAvoidingView>
        </View>
    }
}
class EvaluationVolunteer extends Component{
    render(){
        return <View>
            <Text>
                111
            </Text>
        </View>
    }
}
class MyEvaluation extends Component{
    render(){
        return <View>
            <Text>
                111
            </Text>
        </View>
    }
}
class BackInput extends Component{
    render(){
        return(
            <View style={{
                width:width,
                height: 49,
                backgroundColor:' #fff'
            }}>
                <KeyboardAvoidingView behavior="padding">
                    <TextInput
                        autoFocus={true}
                        placeholder={'回复王丽'}
                        style={{
                            width:width,
                            height: 49,
                            paddingLeft: 10
                        }}
                    />
                </KeyboardAvoidingView>
            </View>
        )
    }
}

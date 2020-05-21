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
    SafeAreaView,
    TextInput, Image,
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
import Modal from 'react-native-modalbox';
import HttpUrl from '../../../utils/Http';
import Toast from 'react-native-easy-toast';
const {width, height} = Dimensions.get('window')
class Evaluation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isReport: false
        }
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
                    title={'评价'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollableTabView
                    style={{flex: 1}}
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
                    <EvaluationPlanner showReport={() => {
                        this.setState({
                            isReport: true
                        })
                    }} tabLabel={'策划人评价'} {...this.props}/>
                    <EvaluationVolunteer tabLabel={'游客评价'} {...this.props}/>
                    <MyEvaluation tabLabel={'我写的评价'} {...this.props}/>
                </ScrollableTabView>
                {
                    this.state.isReport
                        ?
                        <ReportContainer {...this.props} _closeReport={()=>{
                            this.setState({
                                isReport: false
                            })
                        }}/>
                        :
                        null
                }
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
            isMessage: false,
            table_id: '',

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
    showModal(table_id) {
        this.setState({
            table_id: table_id
        }, () => {
            this.backContainer.open()
        })

    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.flexCenter,{
            marginTop: data.index===0?20:25,
            paddingBottom: 15,
            borderBottomWidth:1,
            borderBottomColor: '#f5f5f5'
        }]}
             onLongPress={()=>{
                this.showModal(data.item.comment_id)
             }}
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
        </TouchableOpacity>
    }
    _showBackMessage() {
        this.backInput.open();
    }
    _showReport() {
        this.props.showReport()
    }
    render(){
        return <View style={{flex: 1,position: 'relative'}}>
            <Toast ref="toast" position='center' positionValue={0}/>
            {
                this.state.comments.length > 0
                ?
                    <FlatList
                        data={this.state.comments}
                        showsVerticalScrollIndicator = {false}
                        renderItem={data=>this.renderItem(data)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                :
                    <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                        <Image
                            source={require('../../../../assets/images/que/wdt.png')}
                            style={{width: 180,height: 180}}
                        />
                    </View>
            }

            <BackContainer
                {...this.props}
                {...this.state}
                initData={()=>{
                    this.loadData()
                }}
                ref={backContainer=>this.backContainer=backContainer}
                showBackMessage={()=>{this._showBackMessage()}}
                showReport={()=>{
                    this._showReport()
                }}
                showToast={(data)=>{
                    this.refs.toast.show(data)
                }}
            />

        </View>
    }
}
class EvaluationVolunteer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isMessage: false,
            table_id: ''
        }
    }
    componentDidMount() {
        this.loadData()
    }
    showModal(table_id) {
        this.setState({
            table_id: table_id
        }, () => {
            this.backContainer.open()
        })
    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.flexCenter,{
            marginTop: data.index===0?20:25,
            paddingBottom: 15,
            borderBottomWidth:1,
            borderBottomColor: '#f5f5f5'
        }]}
             onLongPress={()=>{
                 this.showModal(data.item.comment_id)
             }}
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
        </TouchableOpacity>
    }
    _showBackMessage() {
        this.backInput.open();
    }
    loadData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('page',1);
        formData.append('user_id',this.props.user.userid);
        Fetch.post(NewHttp+'CommentVisit', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    comments: res.data.data
                })
            }
        })
    }
    render(){
        return <View style={{flex: 1}}>
            <Toast ref="toast" position='center' positionValue={0}/>
            {
                this.state.comments.length>0
                ?
                    <FlatList
                        data={this.state.comments}
                        showsVerticalScrollIndicator = {false}
                        renderItem={data=>this.renderItem(data)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                :
                    <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                        <Image
                            source={require('../../../../assets/images/que/wdt.png')}
                            style={{width: 180,height: 180}}
                        />
                    </View>
            }

            <BackContainer
                {...this.props}
                {...this.state}
                initData={()=>{
                    this.loadData()
                }}
                ref={backContainer=>this.backContainer=backContainer}
                showBackMessage={()=>{this._showBackMessage()}}
                showToast={(data)=>{
                    this.refs.toast.show(data)
                }}
            />
        </View>
    }
}
class MyEvaluation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token)
        formData.append('page', 1)
        Fetch.post(NewHttp+'msgsay', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    comments: res.data.data
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
                            我写的评价
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

        </View>
    }
    render(){
        return <View style={{flex: 1}}>
            {
                this.state.comments.length>0
                    ?
                    <FlatList
                        data={this.state.comments}
                        showsVerticalScrollIndicator = {false}
                        renderItem={data=>this.renderItem(data)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    :
                    <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                        <Image
                            source={require('../../../../assets/images/que/wdt.png')}
                            style={{width: 180,height: 180}}
                        />
                    </View>
            }
        </View>
    }
}
class BackContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isBackMsg: false,
            message: '',
            isSend: false
        }
    }
    open() {
        this.refs.backContainer.open()
    }
    backMessage() {
        //this.refs.backContainer.close();
        //this.props.showBackMessage();
        this.setState({
            isBackMsg: true
        })
    }
    goBackMessage() {
        const {table_id,token} = this.props;
        if(this.state.message) {
            let formData=new FormData();
            formData.append('token',token);
            formData.append('flag',4);
            formData.append('table_id',table_id);
            formData.append('content',this.state.message);
            Fetch.post(HttpUrl+'Comment/save_leavemsg', formData).then(res => {
                if(res.code === 1) {
                    this.refs.backContainer.close();
                    this.props.initData()
                }
            })
        }
    }
    toDetail() {
        const {table_id} = this.props;
        this.refs.backContainer.close();
        NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
    }
    toReport() {
        this.refs.backContainer.close();
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',2);
        formData.append('table_id',this.props.table_id);
        formData.append('content','');
        formData.append('option_id','');
        Fetch.post(NewHttp + 'ReportU', formData).then(res => {
            if(res.code === 1) {
                this.props.showToast('举报成功')
            }
        })
       //this.props.showReport()
    }
    render(){
        const {isBackMsg} = this.state;
        return(
            <View>
                <Modal style={{height:isBackMsg?60:240,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                       ref={"backContainer"}
                       animationDuration={200}
                       position={"bottom"}
                       backdropColor={'rgba(0,0,0,0.5)'}
                       swipeToClose={true}
                       onClosed={()=>{
                           this.setState({
                               isBackMsg: false,
                           })
                       }}
                       backdropPressToClose={true}
                       coverScreen={true}>
                    <View style={[CommonStyle.flexCenter,{
                        height: isBackMsg?60:240,
                        justifyContent:'flex-start'
                    }]}>
                        {
                            isBackMsg
                            ?
                                <View style={[CommonStyle.spaceRow]}>
                                    <TextInput
                                        ref={'textinput'}
                                        placeholder={'回复某某'}
                                        multiline={true}
                                        autoFocus={true}
                                        defaultValue={this.state.message}
                                        onChangeText={(text)=>{
                                            this.setState({
                                                message: text
                                            })
                                        }}
                                        style={{
                                            padding:10,
                                            width:width-60,
                                            backgroundColor: '#fff',
                                            textAlignVertical:'top',
                                            maxHeight: 120,
                                            minHeight: 60,
                                            color:'#333',
                                            lineHeight: 20
                                        }}
                                    />
                                    <TouchableOpacity style={[CommonStyle.flexEnd,{
                                        width: 60,
                                        height:60,
                                        backgroundColor:'#fff',
                                        paddingRight: width*0.03
                                    }]} onPress={() => {
                                        this.goBackMessage()
                                    }}>
                                        <Text style={{
                                            color:this.state.message === ''?'#999':this.props.theme
                                        }}>回复</Text>
                                    </TouchableOpacity>
                                </View>
                            :
                                <View style={[CommonStyle.commonWidth]}>
                                    <View style={{
                                        height:165,
                                        backgroundColor: '#fff',
                                        borderRadius: 12
                                    }}>
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height:55,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#f5f5f5'
                                        }]} onPress={()=>{
                                            this.backMessage()
                                        }}>
                                            <Text style={{color:'#333'}}>回复评价</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height:55,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#f5f5f5'
                                        }]} onPress={() => {
                                            this.toDetail()
                                        }}>
                                            <Text style={{color:'#333'}}>查看详情</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height:55,
                                        }]} onPress={() => {
                                            this.toReport()
                                        }}>
                                            <Text style={{color:'#333'}}>举报</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height:55,
                                            marginTop: 10,
                                            marginBottom: 10,
                                            backgroundColor:'#fff',
                                            borderRadius: 12
                                        }]} onPress={()=>{
                                            this.refs.backContainer.close()
                                        }}>
                                            <Text style={{color:'#999'}}>取消</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                        }

                    </View>
                </Modal>
            </View>
        )
    }
}
class ReportContainer extends Component{
    closeReport() {
        this.props._closeReport()
    }
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{
                position:'absolute',
                left:0,
                right:0,
                top:0,
                bottom:0,
                backgroundColor: 'rgba(0,0,0,0.5)'
            }]}>
                <TouchableOpacity style={{
                    position:'absolute',
                    left:0,
                    right:0,
                    top:0,
                    bottom:0,
                }} onPress={()=>{
                    this.closeReport()
                }}>
                </TouchableOpacity>
                <View style={{
                    width:width*0.94,
                    height: 220,
                    position:'absolute',
                    left: width*0.03,
                    top: (height-220)/2,
                    backgroundColor: '#fff',
                    borderRadius: 5
                }}>
                    <View style={[CommonStyle.flexCenter,{
                        width: '100%',
                        padding: 15
                    }]}>
                        <View style={[CommonStyle.flexStart,{
                            width: '100%'
                        }]}>
                            <Text style={{color:'#333'}}>举报内容</Text>
                        </View>
                        <TextInput
                            placeholder={'举报内容'}
                            multiline={true}
                            autoFocus={true}
                            style={{
                                width: '100%',
                                height:110,
                                borderWidth: 1,
                                borderColor: '#f5f5f5',
                                marginTop: 13,
                                textAlignVertical:'top',
                                color: '#333',
                                lineHeight: 22
                            }}
                        />
                        <View style={[CommonStyle.flexCenter,{
                            height: 40,
                            backgroundColor:this.props.theme,
                            borderRadius: 3,
                            marginTop: 13,
                            width: '100%'
                        }]}>
                            <Text style={{color:'#fff'}}>提交</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

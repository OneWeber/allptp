import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window');
class PersonalData extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            family_name: '',
            middle_name: '',
            name: '',
            sex: '',
            email: '',
            mobile: '',
            introduce: ''
        }
    }
    componentDidMount() {
        this.getUserInfo()
    }

    getUserInfo(){
        const {token} = this.props
        let formData=new FormData();
        formData.append('token', token);
        Fetch.post(HttpUrl+'User/get_user',formData).then(
            res=>{
                if(res.code===1){
                    this.setState({
                        userInfo:res.data[0] || ''
                    },()=>{
                        const {userInfo} = this.state;
                        this.setState({
                            family_name: userInfo.family_name,
                            middle_name: userInfo.middle_name,
                            name: userInfo.name,
                            sex: userInfo.six,
                            email: userInfo.email_link,
                            mobile: userInfo.mobile,
                            introduce: userInfo.introduce
                        })
                    })
                }
            }
        )
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
    _closeModal() {
        this.refs.photo.close()
    }
    _initInfo() {
        this.getUserInfo();
    }
    changeName(text, index) {
        if(index===0) {
            this.setState({
                family_name: text
            },() => {
                this.changeNameUrl(text, 0)
                this.initName()
            })
        }else if(index===1) {
            this.setState({
                middle_name: text
            },() => {
                this.changeNameUrl(text, 1);
                this.initName()
            })
        }else{
            this.setState({
                name: text
            },() => {
                this.changeNameUrl(text, 2);
                this.initName()
            })
        }
    }
    initName() {
        const {onInitUser} = this.props;
        const {userInfo} = this.state;
        AsyncStorage.setItem('username', this.state.family_name||this.state.middle_name||this.state.name?
            JSON.stringify(this.state.family_name+this.state.middle_name+this.state.name):'匿名用户')
        onInitUser({
            username: this.state.family_name||this.state.middle_name||this.state.name?
                JSON.stringify(this.state.family_name+this.state.middle_name+this.state.name):'匿名用户',
            avatar: JSON.stringify(userInfo.headimage.domain+userInfo.headimage.image_url),
            userid:userInfo.user_id
        });

    }
    changeNameUrl(text, index) {
        let formData=new FormData();
        formData.append('token',this.props.token);
        if(index===0) {
            formData.append('family_name',text);
        }else if(index===1) {
            formData.append('middle_name',text);
        }else if(index===2){
            formData.append('name',text);
        }
        Fetch.post(HttpUrl+'User/saveuser',formData).then(

        )
    }
    changeSex(sex) {
        this.refs.sex.close();
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('six',sex);
        Fetch.post(HttpUrl+'User/saveuser',formData).then(res => {
            this.setState({
                sex: sex
            })
        })
    }
    changeEmail(text) {
        this.setState({
            email: text
        },() => {
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('email',text);
            Fetch.post(HttpUrl+'User/saveuser',formData).then(

            )
        })
    }
    changeMobile(text) {
        this.setState({
            mobile: text
        },()=>{
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('mobile',text);
            Fetch.post(HttpUrl+'User/saveuser',formData).then(
            )
        })
    }
    _loginOut() {
        this.refs.loginout.open()
    }
    _out() {
        const {onInitUser, onInitToken} = this.props;
        let formData=new FormData();
        formData.append('token',this.props.token);
        Fetch.post(HttpUrl+'User/quit', formData).then(res => {
            this.refs.loginout.close();
            if(res.code === 1) {
                AsyncStorage.setItem('username', '');
                AsyncStorage.setItem('avatar', '');
                AsyncStorage.setItem('userid', '');
                onInitUser({
                    username: '',
                    avatar: '',
                    userid: ''
                })
                NavigatorUtils.goPage({}, 'ViewPage');
                let formDataTwo=new FormData();
                formDataTwo.append('','');
                Fetch.post(HttpUrl + 'Index/token', formDataTwo).then(result => {
                    if(result.code === 1) {
                        onInitToken(result.data)
                        AsyncStorage.setItem('token', JSON.stringify(result.data));
                    } else {
                        onInitToken('')
                    }
                })
            }
        })
    }
    render(){
        const {userInfo} = this.state;
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'个人资料'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor: '#fff',
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <TouchableOpacity style={[CommonStyle.spaceRow,{
                                paddingTop: 15,
                                paddingBottom: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]} onPress={()=>{
                                this.refs.photo.open()
                            }}>
                                <Text style={styles.data_title}>头像</Text>
                                <View
                                    style={CommonStyle.flexStart}
                                >
                                    <LazyImage
                                        source={userInfo.headimage&&userInfo.headimage.domain&&userInfo.headimage.image_url?
                                            {uri:userInfo.headimage.domain+userInfo.headimage.image_url}:require('../../../assets/images/touxiang.png')}
                                        style={{height:45,width:45,borderRadius: 22.5}}
                                    />
                                    <AntDesign
                                        name={'right'}
                                        size={16}
                                        style={{color:'#DFE1E4'}}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>姓</Text>
                                <TextInput
                                    defaultValue={this.state.family_name}
                                    placeholder={this.state.family_name?this.state.family_name:'姓'}
                                    style={[styles.text_input,{width:width*0.94-100,color:'#999'}]}
                                    onChangeText={(text)=>this.changeName(text, 0)}
                                />
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>中间名</Text>
                                <TextInput
                                    defaultValue={this.state.middle_name}
                                    placeholder={this.state.middle_name?this.state.middle_name:'中间名'}
                                    style={[styles.text_input,{width:width*0.94-120,color:'#999'}]}
                                    onChangeText={(text)=>this.changeName(text, 1)}
                                />
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                            }]}>
                                <Text style={styles.data_title}>名</Text>
                                <TextInput
                                    defaultValue={this.state.name}
                                    placeholder={this.state.name?this.state.name:'名'}
                                    style={[styles.text_input,{width:width*0.94-100,color:'#999'}]}
                                    onChangeText={(text)=>this.changeName(text, 2)}
                                />
                            </View>

                        </View>
                    </View>
                    {/*第二段*/}
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor: '#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <TouchableOpacity style={[CommonStyle.spaceRow,{
                                paddingTop: 15,
                                paddingBottom: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]} onPress={()=>{this.refs.sex.open()}}>
                                <Text style={styles.data_title}>性别</Text>
                                <View
                                    style={CommonStyle.flexStart}
                                >
                                    {
                                        this.state.sex
                                        ?
                                            <Text style={{color:'#999'}}>
                                                {this.state.sex===1?'男':'女'}
                                            </Text>
                                        :
                                            null
                                    }
                                    <AntDesign
                                        name={'right'}
                                        size={16}
                                        style={{color:'#DFE1E4'}}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>邮件地址</Text>
                                <TextInput
                                    editable={false}
                                    defaultValue={this.state.email}
                                    placeholder={this.state.email?this.state.email:'邮件地址'}
                                    style={[styles.text_input,{width:width*0.94-120,color:'#999'}]}
                                    onChangeText={(text)=>this.changeEmail(text)}
                                />
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>电话号码</Text>
                                <TextInput
                                    editable={false}
                                    defaultValue={this.state.mobile}
                                    placeholder={this.state.mobile?this.state.mobile:'电话号码'}
                                    style={[styles.text_input,{width:width*0.94-120,color:'#999'}]}
                                    onChangeText={(text)=>this.changeMobile(text)}
                                />
                            </View>
                        </View>
                    </View>
                    {/*第三段*/}
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor: '#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <TouchableOpacity style={[CommonStyle.spaceRow,{
                                paddingTop: 15,
                                paddingBottom: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]} onPress={()=>{
                                const _this = this;
                                NavigatorUtils.goPage({
                                    introduce: this.state.introduce,
                                    refresh: function () {
                                        _this.getUserInfo()
                                    }
                                }, 'MyIntroduce')
                            }}>
                                <Text style={styles.data_title}>自我介绍</Text>
                                <View style={CommonStyle.flexEnd}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{
                                        maxWidth: 200,
                                        color:'#999'
                                    }}>{this.state.introduce}</Text>
                                    <AntDesign
                                        name={'right'}
                                        size={16}
                                        style={{color:'#DFE1E4'}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*第四段*/}
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor: '#fff',
                        marginTop: 10
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>策划人验证审核</Text>
                                <Text style={{
                                    color:userInfo.audit_face===1?'#999':userInfo.audit_face===2?this.props.theme:userInfo.audit_face===3?'#EE4444':'#999'
                                }}>
                                    {
                                        userInfo.audit_face===1
                                        ?
                                            '待审核'
                                        :
                                        userInfo.audit_face===2
                                        ?
                                            '审核通过'
                                        :
                                        userInfo.audit_face===3
                                        ?
                                            '已拒绝'
                                        :
                                            '待验证'
                                    }
                                </Text>
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>志愿者验证审核</Text>
                                <Text style={{
                                    color:userInfo.audit_face===0?'#999':userInfo.audit_idcard===1&&userInfo.isvolunteer?this.props.theme:'#999'
                                }}>
                                    {
                                        userInfo.audit_idcard===0
                                            ?
                                            '待审核'
                                            :
                                            userInfo.audit_idcard===1&&userInfo.isvolunteer
                                            ?
                                            '审核通过'
                                            :
                                            null
                                    }
                                </Text>
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                height:55,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f5f5f5'
                            }]}>
                                <Text style={styles.data_title}>志愿者技能完善</Text>
                                <Text style={{
                                    color:userInfo.isvolunteer?this.props.theme:'#999'
                                }}>
                                    {
                                        userInfo.isvolunteer
                                            ?
                                            '已完善'
                                            :
                                            '待完善'
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={CommonStyle.flexCenter}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,CommonStyle.commonWidth,{
                            height: 45,
                            backgroundColor:'#efefef',
                            marginTop: 25,
                            marginBottom: 40
                        }]} onPress={()=>this._loginOut()}>
                            <Text style={{
                                color:'#EE4444'
                            }}>退出登录</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <Modal
                    style={{height:120,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"photo"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 120,
                        backgroundColor: '#fff'
                    }}>
                        <PhotoModal initInfo={()=>this._initInfo()} closeModal={()=>this._closeModal()} {...this.props} {...this.state}/>
                    </View>
                </Modal>
                <Modal
                    style={{height:120,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"sex"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 120,
                        backgroundColor: '#fff'
                    }}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5'
                        }]} onPress={()=>this.changeSex(1)}>
                            <Text>男</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60,
                        }]} onPress={()=>this.changeSex(2)}>
                            <Text>女</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    style={{height:120,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"loginout"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 120,
                        backgroundColor: '#fff'
                    }}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5'
                        }]} onPress={()=>this._out()}>
                            <Text style={{color:'#333'}}>确定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60,
                        }]} onPress={()=>this.refs.loginout.close()}>
                            <Text style={{color:'#999'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>


            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    onInitUser: user => dispatch(action.InitUser(user)),
    onInitToken: data => dispatch(action.InitToken(data))
})
const styles = StyleSheet.create({
    data_title: {
        color:'#333',
        fontSize: 15
    },
    text_input:{
        textAlign: 'right',
        height:55
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(PersonalData)
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import action from '../../action';
var photoOptions={
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择照片',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'medium',  // 图片质量
    durationLimit: 10,  //
    maxWidth: 500, // 图片大小
    maxHeight: 500, // 图片大小
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true
    }
}

class PhotoModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            coverId: '',
            coverUri: ''
        }
    }
    openPhotoalbum() {
        ImagePicker.launchImageLibrary(photoOptions,(response)=>{
            if(response.didCancel){
                return
            }else if(response.error){
                console.log(response.error)
            }else{
                this.uploadImage(response.uri)
            }

        })
    }
    openCamera() {
        ImagePicker.launchCamera(photoOptions,(response)=>{
            if(response.didCancel){
                return
            }else if(response.error){
                console.log(response.error)
            }else{
                this.uploadImage(response.uri)
            }

        })
    }
    uploadImage(uri){
        const {onInitUser, userInfo} = this.props;
        let formData=new FormData();
        let file={uri:uri,type:'multipart/form-data',name:'image.png'};
        formData.append('token',this.props.token);
        formData.append('file',file);
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            res=>{
                this.props.closeModal();
                if(res.code==1){
                    this.setState({
                        coverId:res.data.image_id,
                        coverUri:res.data.domain+res.data.image_url
                    },()=>{
                        let formData=new FormData();
                        formData.append('token',this.props.token);
                        formData.append('head_image',this.state.coverId);
                        Fetch.post(HttpUrl+'User/saveuser',formData).then(res => {
                            AsyncStorage.setItem('avatar', JSON.stringify(this.state.coverUri));
                            onInitUser({
                                username: userInfo.family_name||userInfo.middle_name||userInfo.name?
                                    JSON.stringify(userInfo.family_name+userInfo.middle_name+userInfo.name):'匿名用户',
                                avatar: JSON.stringify(this.state.coverUri),
                                userid: userInfo.user_id
                            });
                            this.props.initInfo()
                        })
                    })
                }
            }
        )
    }
    render() {
        return (
            <View>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:60,
                    borderBottomColor: '#f5f5f5',
                    borderBottomWidth: 1
                }]} onPress={()=>{
                    this.openPhotoalbum()
                }}>
                    <Text style={{color:'#333'}}>相册</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:60,
                }]} onPress={()=>{
                    this.openCamera()
                }}>
                    <Text style={{color:'#333'}}>拍摄</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

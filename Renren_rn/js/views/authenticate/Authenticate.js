import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ActivityIndicator, ImageBackground,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window')
class Authenticate extends Component{
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            identity: this.props.navigation.state.params.identity,
            cardIndex: '',//选择的证件类型,
            idcard_z: '',
            idcard_f: '',
            isLoading: false,
            passport: '',
            face_image: '',
            activity_id: this.props.navigation.state.params.activity_id
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
    _addStep() {
        let steps = this.state.step;
        steps ++;
        this.setState({
            step: steps
        })
    }
    _delStep() {
        let steps = this.state.step;
        steps --;
        this.setState({
            step: steps
        })
    }
    getRightButton() {
        const {step} = this.state;
        return <View>
            {
                step>0
                ?
                    <TouchableOpacity
                        style={{paddingRight: width*0.03}}
                        onPress={()=>{
                            this._delStep()
                        }}
                    >
                        <Text style={{color:'#666'}}>上一步</Text>
                    </TouchableOpacity>
                :
                    null
            }
        </View>
    }
    changeIdCard(val, idcard_z, idcard_f) {
        if(val === 0) {
            this.setState({
                idcard_z: idcard_z
            })
        }else{
            this.setState({
                idcard_f: idcard_f
            })
        }
    }
    changePassport(passport) {
        this.setState({
            passport: passport
        })
    }
    _changeHandle(face_image) {
        this.setState({
            face_image: face_image
        })
    }
    render() {
        this.tabNames = [
            {
                title: '国家/地区'
            },
            {
                title: '类型'
            },
            {
                title: '上传'
            },
        ];
        const {step, identity} = this.state;
        return <View style={{flex: 1,backgroundColor: '#fff',position:'relative'}}>
            <Toast ref="toast" position='center' positionValue={0}/>
            <RNEasyTopNavBar
                title={'验证身份'}
                backgroundTheme={'#fff'}
                titleColor={'#333'}
                leftButton={this.getLeftButton()}
                rightButton={this.getRightButton()}
            />
            <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                marginLeft: width*0.03,
                height:30,
                marginBottom: 10
            }]}>
                {
                    this.tabNames.map((item, index) => {
                        return <View key={index} style={[CommonStyle.spaceRow]}>
                            <View style={[CommonStyle.flexCenter,{
                                width:14,
                                height:14,
                                borderRadius: 7,
                                backgroundColor: step>=index?this.props.theme:'#999'
                            }]}>
                                <Text style={{
                                    fontSize: 11,
                                    color:'#fff'
                                }}>{index+1}</Text>
                            </View>
                            <Text style={{
                                marginLeft:5,
                                color:step>=index?this.props.theme:'#333'
                            }}>{item.title}</Text>
                        </View>
                    })
                }
                {
                    identity==='planner'
                    ?
                        <View style={[CommonStyle.spaceRow]}>
                            <View style={[CommonStyle.flexCenter,{
                                width:14,
                                height:14,
                                borderRadius: 7,
                                backgroundColor: step>=3?this.props.theme:'#999'
                            }]}>
                                <Text style={{
                                    fontSize: 11,
                                    color:'#fff'
                                }}>4</Text>
                            </View>
                            <Text style={{
                                marginLeft:5,
                                color:step>=3?this.props.theme:'#333'
                            }}>手持</Text>
                        </View>
                    :
                        null
                }
            </View>
            <ScrollView>
                <View style={CommonStyle.flexCenter}>
                    <View style={CommonStyle.commonWidth}>
                        {
                            step===0
                            ?
                                <StepOne addStep={()=>{this._addStep()}} {...this.props}/>
                            :
                             step===1
                            ?
                                 <StepTwo changeCard={(data)=>{
                                     this.setState({
                                         cardIndex: data
                                     })
                                 }} addStep={()=>{this._addStep()}} {...this.props}/>
                            :
                            step === 2
                            ?
                                <StepThree
                                    _changeIdCard={(val, idcard_z, idcard_f) => {
                                        this.changeIdCard(val, idcard_z, idcard_f)
                                    }}
                                    _changePassport={(passport) => {
                                        this.changePassport(passport)
                                    }
                                    }
                                    showModal={(data)=>{
                                        this.refs.toast.show(data)
                                    }}
                                    changeLoading={(val)=>{
                                        if(val) {
                                            this.setState({
                                                isLoading: true
                                            })
                                        }else {
                                            this.setState({
                                                isLoading: false
                                            })
                                        }
                                    }
                                    }
                                    addStep={()=>{this._addStep()}}
                                    {...this.props}
                                    {...this.state}/>
                            :
                                <StepFour
                                    changeHandle={(face_image)=>{
                                        this._changeHandle(face_image)
                                    }}
                                    showModal={(data)=>{
                                        this.refs.toast.show(data)
                                    }}
                                    changeLoading={(val)=>{
                                        if(val) {
                                            this.setState({
                                                isLoading: true
                                            })
                                        }else {
                                            this.setState({
                                                isLoading: false
                                            })
                                        }
                                    }
                                    }
                                    {...this.props}
                                    {...this.state}
                                />
                        }

                    </View>
                </View>
            </ScrollView>
            {
                this.state.isLoading
                ?
                    <View style={[CommonStyle.flexCenter,{
                        position:'absolute',
                        left:0,
                        right:0,
                        top:0,
                        bottom:0,
                    }]}>
                        <ActivityIndicator size={'large'} color={'#333'}/>
                    </View>
                :
                    null
            }
        </View>
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
});
const mapDispatchToProps = dispatch => ({
    onLoadToAudit: (storeName, url, data) => dispatch(action.onLoadToAudit(storeName, url, data)),
    onLoadUncommit:(storeName, url, data) => dispatch(action.onLoadUncommit(storeName, url, data)),
    onLoadNotPass: (storeName, url, data) => dispatch(action.onLoadNotPass(storeName, url, data)),
    onLoadAlready: (storeName, url, data) => dispatch(action.onLoadAlready(storeName, url, data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
class StepOne extends Component{
    goNext() {
        this.props.addStep()
    }
    render(){
        return(
            <View>
                <Text style={{
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 10
                }}>只能添加由政府签发的有效身份证件。</Text>
                <View style={[CommonStyle.spaceRow,{
                    height: 64,
                    marginTop: 10,
                }]}>
                    <Text style={styles.main_title}>签发国家/地区</Text>
                    <Text style={{
                        color:this.props.theme,
                        fontWeight: "bold"
                    }}>中国</Text>
                    {/*
                    <TouchableOpacity
                        style={[CommonStyle.flexCenter,styles.select_btn]}

                    >
                        <Text style={{
                            color:this.props.theme,
                            fontWeight:'bold',
                            fontSize: 13
                        }}>选择</Text>
                    </TouchableOpacity>
                    */}
                </View>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:40,
                    marginTop: 25,
                    backgroundColor: this.props.theme,
                    borderRadius: 5,
                    marginBottom: 40
                }]} onPress={()=>{
                    this.goNext()
                }}>
                    <Text style={{color: '#fff'}}>
                        下一步
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }
}
class StepTwo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cardIndex: 0
        }
    }
    goNext(){
        this.props.changeCard(this.state.cardIndex)
        this.props.addStep()
    }
    render(){
        this.tabNames = [
            {
                id: 0,
                title: '身份证'
            },
            {
                id: 1,
                title: '护照'
            }
        ]
        const {cardIndex} = this.state;
        return(
            <View>
                <Text style={{
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 10
                }}>身份证件类型</Text>
                {
                    this.tabNames.map((item, index) => {
                        return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                            marginTop: 30
                        }]} onPress={()=>{
                            this.setState({
                                cardIndex: index
                            })
                        }}>
                            <View style={[CommonStyle.flexCenter,{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                borderWidth: cardIndex===index?0:1,
                                borderColor: '#ccc',
                                backgroundColor: cardIndex===index?this.props.theme: '#fff'
                            }]}>
                                {
                                    cardIndex===index
                                    ?
                                        <AntDesign
                                            name={'check'}
                                            size={14}
                                            style={{color:'#fff'}}
                                        />
                                    :
                                        null
                                }

                            </View>
                            <Text style={{
                                marginLeft: 10,
                                color: cardIndex===index?this.props.theme:'#333',
                                fontSize: 16
                            }}>{item.title}</Text>
                        </TouchableOpacity>
                    })
                }
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:40,
                    marginTop: 25,
                    backgroundColor: this.props.theme,
                    borderRadius: 5,
                    marginBottom: 40
                }]} onPress={()=>{
                    this.goNext()
                }}>
                    <Text style={{color: '#fff'}}>下一步</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
import IdCard from './IdCard';
import Passport from './Passport';
import Toast from 'react-native-easy-toast';
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import ImagePicker from 'react-native-image-picker';
import HttpUrl from '../../utils/Http';
import action from '../../action';
class StepThree extends Component{
    goNext() {
        if(this.props.identity==='planner'){
            if(this.props.cardIndex==0) {
                if(this.props.idcard_z && this.props.idcard_f) {
                    this.checkIdCard();
                    //this.props.addStep()
                }else{
                    this.props.showModal('请上传完整身份证照片')
                }
            } else {
                //策划者上传护照
                if(this.props.passport) {
                    this.checkPassport()
                }else{
                    this.props.showModal('请上传护照照片')
                }
            }
        }else{

        }
    }
    checkIdCard() {
        this.props.changeLoading(1)
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('flag', 1);
        formData.append('idcard_f', this.props.idcard_z);
        formData.append('idcard_z', this.props.idcard_f);
        Fetch.post(NewHttp+'IdentifyCardPlanner', formData).then(res => {
            this.props.changeLoading(0)
            if (res.code === 1) {
                this.props.addStep()
            }else{
                this.props.showModal(res.msg)
            }
        })
    }
    checkPassport() {
        this.props.changeLoading(1)
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('flag', 2);
        formData.append('passport', this.props.passport);
        Fetch.post(NewHttp+'IdentifyCardPlanner', formData).then(res => {
            this.props.changeLoading(0)
            if (res.code === 1) {
                this.props.addStep()
            }else{
                this.props.showModal(res.msg)
            }
        })
    }
    render(){
        const {cardIndex} = this.props;
        return(
            <View style={{flex: 1}}>

                {
                    cardIndex
                    ?
                        <View>
                            <Passport _changePassport={(passport)=> {
                                this.props._changePassport(passport)
                            }}/>
                        </View>
                    :
                        <View>
                            <IdCard _changeIdCard={(val, idcard_z, idcard_f)=>{
                                this.props._changeIdCard(val, idcard_z, idcard_f)
                            }} />
                        </View>
                }
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:40,
                    marginTop: 25,
                    backgroundColor: this.props.theme,
                    borderRadius: 5,
                    marginBottom: 40
                }]} onPress={()=>{
                    this.goNext()
                }}>
                    <Text style={{color: '#fff'}}>
                        {
                            this.props.identity==='planner'
                                ?
                                '下一步'
                                :
                                '提交'
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const photoOptions={
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
};
class StepFour extends Component{
    constructor(props) {
        super(props);
        this.state = {
            face_image: '',
            face_image_uri: ''
        }
    }
    submitHandel() {
        ImagePicker.launchImageLibrary(photoOptions,(response)=>{
            if(response.didCancel){
                return
            }else if(response.error){
                console.log(JSON.stringify(response.error))
            }else{
                this.uploadImage(response.uri)
            }

        })
    }
    uploadImage(uri){
        //alert(uri)
        let formData=new FormData();
        let file={uri:uri,type:'multipart/form-data',name:'image.png'};
        formData.append('token',this.props.token);
        formData.append('file',file);
        //alert(JSON.stringify(formData))
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        face_image:result.data.image_id,
                        face_image_uri:result.data.domain+result.data.image_url
                    },() => {
                        this.changeHandle(this.state.face_image)
                    })
                }
            }
        )
    }
    changeHandle(face_image) {
        this.props.changeHandle(face_image)
    }
    goNext() {
        this.props.changeLoading(1)
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('face_image', this.props.face_image);
        formData.append('flag', 3);
        Fetch.post(NewHttp+'IdentifyCardPlanner', formData).then(res => {
            this.props.changeLoading(0)
            if(res.code === 1) {
                //如果有传体验数据过了
                if(this.props.activity_id) {
                    this.saveActive()
                }else {

                }
            }else{
                this.props.showModal(res.msg)
            }
        })
    }
    saveActive() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('activity_id', this.props.activity_id);
        formData.append('complete', 1);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.initToAudit();
                this.initUncommitted();
                this.initNotPass();
                this.initAlready();
            }
        })
    }
    initToAudit() {
        const {onLoadToAudit} = this.props;
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('flag',2);
        onLoadToAudit('toaudit', HttpUrl + 'Activity/complete', formData)
        NavigatorUtils.goPage({},'CreateActive')
    }
    initUncommitted() {
        const {token, onLoadUncommit} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',1);
        onLoadUncommit('uncommit', HttpUrl + 'Activity/complete', formData)
    }
    initNotPass() {
        const {token, onLoadNotPass} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',4);
        onLoadNotPass('notpass', HttpUrl + 'Activity/complete', formData)
    }
    initAlready() {
        const {token, onLoadAlready} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',3);
        onLoadAlready('already', HttpUrl + 'Activity/complete', formData)
    }
    render(){
        return(
            <View>
                <Text style={{
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 10
                }}>上传您的手持证件照片</Text>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:180,
                    borderWidth: 1,
                    borderColor: '#f5f5f5',
                    marginTop: 20
                }]} onPress={()=>{
                    this.submitHandel()
                }}>
                    <ImageBackground
                        resizeMode={'cover'}
                        source={{uri:this.state.face_image_uri?this.state.face_image_uri:''}}
                        style={[CommonStyle.flexCenter,{
                            height:180,
                            width: '100%'
                        }]}>
                        <AntDesign
                            name={'plus'}
                            size={22}
                            style={{color:'#999'}}
                        />
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:40,
                    marginTop: 25,
                    backgroundColor: this.props.theme,
                    borderRadius: 5,
                    marginBottom: 40
                }]} onPress={()=>{
                    this.goNext()
                }}>
                    <Text style={{color: '#fff'}}>
                        提交
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
    },
})

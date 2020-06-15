import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-picker';
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import SideMenu from 'react-native-side-menu';
import MenuContent from '../../../../../common/MenuContent';
import LazyImage from 'animated-lazy-image';
import ImagePickers from 'react-native-image-crop-picker';
import Toast, {DURATION} from 'react-native-easy-toast';
import NewHttp from '../../../../../utils/NewHttp';
import action from '../../../../../action';
const {width, height} = Dimensions.get('window');
const photoOptions={
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择照片',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'medium',  // 图片质量
    durationLimit: 100,  //
    maxWidth: 100000, // 图片大小
    maxHeight: 100000, // 图片大小
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true
    }
};
class Photo extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '展现大家在体验过程中如何投入地参与活动',
            '展现体验欢迎与内容的照片，以及真实的活动抓拍',
            '确保照片中光线良好，自然光为最佳',
            '不要用自拍或者摆拍',
            '不要用用了滤镜或家里文字和贴图的照片',
            '不要用包含毒品，裸体，酒精，二用元素的照片'
        ]
        this.state = {
            isOpenning: false,
            coverId: '',
            coverUri: '',
            imageList: [],
            imageId: [],
            isIphone: false,
            lodingImages: false,
            isLoading: false,
            initImage: [],
            loadingImg: false
        }
    }
    componentDidMount(){
        this.isIphoneX();
        const {activity_id} = this.props;
        if(activity_id === '') {
            return
        } else {
            this.initData()
        }
    }
    initData() {
        this.setState({
            lodingImages: true
        })
        const {changeStatus} = this.props;
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            this.setState({
                lodingImages: false
            })
            if(res.code === 1) {
                this.setState({
                    coverUri:res.data.cover&&res.data.cover.domain&&res.data.cover.image_url?res.data.cover.domain+res.data.cover.image_url:null,
                    coverId:res.data.cover.image_id,
                    initImage:res.data.image,

                }, () => {
                    let list = [];
                    const {initImage} = this.state;
                    if(initImage.length>0) {
                        for(let i=0;i<initImage.length; i++) {
                            list.push({
                                send: {image_id:initImage[i].image_id,img:initImage[i].domain+initImage[i].image_url}
                            });
                        }
                    }
                    this.setState({
                        imageList: list
                    },() => {
                        if(list.length>0) {
                            let image_id = [];
                            for(let i=0;i<list.length; i++) {
                                image_id.push({image_id:list[i].send.image_id})
                            }
                            this.setState({
                                imageId: image_id,
                            })
                        }

                    })
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    isIphoneX(){
        if(Platform.OS === 'ios'){
            this.setState({
                isIphone:true
            })
        }else{
            this.setState({
                isIphone:false
            })
        }

    }
    coverImg(){
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
        this.setState({
            loadingImg: true
        })
        let formData=new FormData();
        let file={uri:uri,type:'multipart/form-data',name:'image.png'};
        formData.append('token',this.props.token);
        formData.append('file',file);
        //alert(JSON.stringify(formData))
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            result=>{
                this.setState({
                    loadingImg: false
                })
                if(result.code==1){
                    this.setState({
                        coverId:result.data.image_id,
                        coverUri:result.data.domain+result.data.image_url
                    })
                }else{
                    this.refs.toast.show(result.msg)
                }
            }
        )
    }
    detailImg(){
        if(!this.state.lodingImages) {
            ImagePickers.openPicker({
                multiple: true
            }).then(images => {
                for(let i=0;i<images.length;i++) {
                    this.uploadImageMore(images[i], i)
                }
            });
        }

    }
    uploadImageMore(images, i){
        //let arr=this.state.showImage;
        //let img=[];
        this.setState({
            lodingImages: true
        })
        let list = this.state.imageList;
        let image_id = this.state.imageId;
        let formData=new FormData();
        let file={uri:images.path,type:images.mime,name:images.filename,size:images.size};
        formData.append('token',this.props.token);
        formData.append('file',file);
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            res=>{
                if(res.code === 1) {
                    list.push({
                        imageDetail: images,
                        send: {image_id:res.data.image_id,img:res.data.domain+res.data.image_url}
                    })
                    for(let i=0;i<list.length;i++) {
                        image_id.push({image_id:list[i].send.image_id})
                    }
                    this.setState({
                        imageList: list,
                        imageId: image_id,
                        lodingImages: false
                    })
                }else {
                    this.setState({
                        lodingImages: false
                    })
                    // this.refs.toast.show('第'+(i+1)+'张图片上传失败')
                    this.refs.toast.show(res.msg)
                }
            }
        )
    }
    goNext(){
        if(!this.state.isLoading && !this.state.lodingImages) {
            this.savePhoto()
        }
    }
    savePhoto() {
        const {activity_id} = this.props;
        if(!this.state.coverUri) {
            this.refs.toast.show('请上传封面照片')
        } else if(this.state.imageId.length === 0) {
            this.refs.toast.show('请上传封体验内容的图片或视频')
        } else {
            this.setState({
                isLoading: true
            });
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("activity_id",activity_id);
            formData.append("step",8);
            formData.append("isapp",1);
            formData.append("cover_image",this.state.coverId);
            formData.append("image",JSON.stringify(this.state.imageId));
            Fetch.post(NewHttp+'ActivitSaveTwo', formData).then(res => {
                if(res.code === 1) {
                    this.setState({
                        isLoading: false
                    });
                    this.initUncommitted();
                    NavigatorUtils.goPage({}, 'Address')
                }
            })
        }
    }
    initUncommitted() {
        const {onLoadUncommit} = this.props;
        this.storeName = 'uncommit';
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('flag',1);
        onLoadUncommit(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    dropImage(data) {
        if(data.imageDetail) {
            ImagePickers.openCropper({
                path: data.imageDetail.path,
                width: 300,
                height: 400
            }).then(image => {
                console.log(image);
            });
        }
    }
    delImage(i) {
        let list = this.state.imageList;
        let image_id = this.state.imageId;
        list.splice(i, 1);
        image_id.splice(i, 1);
        this.setState({
            imageList: list,
            imageId: image_id
        })
    }
    render(){
        const {theme} = this.props;
        const {isOpenning, coverUri, imageList, lodingImages} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>;
        let Images = [];
        for(let i=0;i<imageList.length;i++) {
            Images.push(
                <TouchableOpacity key={i} style={[styles.detail_imgs_btn,{
                    marginLeft: i!=0&&(i+1)%3===0?0:15,
                    borderWidth: 0,
                    position:'relative',
                    backgroundColor:'#f5f5f5',
                    borderRadius: 3
                }]} onPress={()=>{
                    this.dropImage(imageList[i])
                }}>
                    <LazyImage
                        source={{uri: imageList[i].send.img}}
                        style={{
                            width:(width*0.94-30)/3,
                            height: (width*0.94-30)/3,
                            borderRadius: 3
                        }}
                    />
                    <TouchableOpacity style={{
                        position:'absolute',
                        top:0,
                        right:0,
                        padding: 5
                    }} onPress={()=>{
                        this.delImage(i)
                    }}>
                        <AntDesign
                            name={'close'}
                            size={14}
                            style={{color:'#999'}}
                        />
                    </TouchableOpacity>
                    {
                        imageList[i].imageDetail
                        ?
                            <View style={[CommonStyle.flexCenter,{
                                paddingLeft:3,
                                height:15,
                                backgroundColor:'rgba(0,0,0,.3)',
                                position:'absolute',
                                left:0,
                                right:0,
                                bottom:0,
                                borderBottomRightRadius: 3,
                                borderBottomLeftRadius: 3,
                            }]}>
                                <Text style={{color:'#fff',fontSize: 12}}>可裁剪</Text>
                            </View>
                        :
                            null
                    }
                </TouchableOpacity>
            )
        }
        return(
            <SideMenu
                menu={menu}                    //抽屉内的组件
                isOpen={isOpenning}     //抽屉打开/关闭
                openMenuOffset={width*2/3}     //抽屉的宽度
                hiddenMenuOffset={0}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
                edgeHitWidth={50}              //距离屏幕多少距离可以滑出抽屉,默认60
                disableGestures={false}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
                onChange={                   //抽屉状态变化的监听函数
                    (isOpen) => {
                        isOpen ?
                            this.setState({
                                isOpenning:true
                            })
                            :
                            this.setState({
                                isOpenning:false
                            })

                    }}
                menuPosition={'right'}     //抽屉在左侧还是右侧
                autoClosing={true}         //默认为true 如果为true 一有事件发生抽屉就会关闭
            >
                <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <CreateHeader title={'图片'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:theme,
                                    fontWeight:'bold',
                                    fontSize:16.8
                                }}>小贴士</Text>
                                <Prompt data={this.prompts}/>
                                <Text style={[styles.main_title,{marginTop:25}]}>
                                    封面照片
                                </Text>
                                <Text style={styles.main_prompt}>请为体验挑选一张最具有代表性的照片，这会是参与者浏览体验时看到的第一张照片</Text>
                                <TouchableOpacity
                                    style={[styles.cover_img_btn,CommonStyle.flexCenter]}
                                    onPress={()=>{this.coverImg()}}
                                >
                                    {
                                        coverUri
                                        ?
                                            <LazyImage
                                                source={{uri:coverUri}}
                                                style={{
                                                    width:120,
                                                    height:120,
                                                    borderRadius: 3
                                                }}
                                            />
                                        :
                                            null
                                    }
                                    <View style={[CommonStyle.flexCenter,{
                                        position:'absolute',
                                        left:0,
                                        right:0,
                                        top:0,
                                        bottom:0
                                    }]}>
                                        {
                                            this.state.loadingImg
                                            ?
                                                <ActivityIndicator size={'small'} color={'#999'}/>
                                            :
                                                <AntDesign
                                                    name={'plus'}
                                                    size={20}
                                                    style={{color:coverUri?'#fff':'#666'}}
                                                />
                                        }

                                    </View>
                                </TouchableOpacity>
                                <Text style={[styles.main_title,{marginTop:25}]}>
                                    更多活动内容照片或视频
                                </Text>
                                <Text style={styles.main_prompt}>
                                    请为体验挑选活动照片或视频，这会是参与者浏览体验时看到的照片或视频
                                </Text>
                                <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginBottom: 100}]}>
                                    <TouchableOpacity
                                        style={[styles.detail_imgs_btn, CommonStyle.flexCenter]}
                                        onPress={()=>{this.detailImg()}}
                                    >
                                        {
                                            lodingImages
                                            ?
                                                <ActivityIndicator size={'small'} color={'#999'}/>
                                            :
                                                <AntDesign
                                                    name={'plus'}
                                                    size={20}
                                                    style={{color:'#666'}}
                                                />
                                        }

                                    </TouchableOpacity>
                                    {Images}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:theme
                            }]}
                               onPress={()=>this.goNext()}
                            >
                                {
                                    this.state.isLoading
                                        ?
                                        <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
                                        :
                                        <Text style={{color:'#fff'}}>保存并继续</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
        lineHeight:20
    },
    demo_item:{
        width:width*0.8,
        marginRight:15,
        padding:15,
        backgroundColor:'#f5f5f5'
    },
    inputs:{
        height:40,
        borderBottomColor:'#f5f5f5',
        borderBottomWidth: 1,
        marginTop: 15
    },
    main_prompt:{
        color:'#333',
        lineHeight: 20,
        marginTop: 10
    },
    cover_img_btn: {
        width: 120,
        height: 120,
        borderWidth:2,
        borderColor:'#dcdcdc',
        borderStyle:'dashed',
        marginTop:15,
        position:'relative'
    },
    detail_imgs_btn: {
        width:(width*0.94-30)/3,
        height: (width*0.94-30)/3,
        borderWidth: 2,
        borderColor: "#dcdcdc",
        borderStyle:'dashed',
        marginTop: 15
    }
})
const mapStateProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    activity_id: state.steps.activity_id
});
const mapDispatchToProps = dispatch => ({
    onLoadUncommit:(storeName, url, data) => dispatch(action.onLoadUncommit(storeName, url, data)),
    changeStatus: arr => dispatch(action.changeStatus(arr))
});
export default connect(mapStateProps, mapDispatchToProps)(Photo)

import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
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
const {width, height} = Dimensions.get('window');
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
const options = {
    imageCount: 6,          // 最大选择图片数目，默认6
    isCamera: false,         // 是否允许用户在内部拍照，默认true
    isCrop: false,          // 是否允许裁剪，默认false
    CropW: ~~(width * 0.6), // 裁剪宽度，默认屏幕宽度60%
    CropH: ~~(width * 0.6), // 裁剪高度，默认屏幕宽度60%
    isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
    showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
    showCropFrame: true,    // 是否显示裁剪区域，默认true
    showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
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
            showImage: [],
            image: [],
            isIphone: false,
            isPhotoLoading: false
        }
    }
    componentDidMount(){
        this.isIphoneX();
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
                alert(JSON.stringify(response.error))
            }else{
                this.uploadImage(response.uri)
            }

        })
    }
    uploadImage(uri){
        //alert(uri)
        let formData=new FormData();
        let file={uri:uri,type:'multipart/form-data',name:'image.png'};
        formData.append('token',this.state.token);
        formData.append('file',file);
        //alert(JSON.stringify(formData))
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        coverId:result.data.image_id,
                        coverUri:result.data.domain+result.data.image_url
                    })
                }
            }
        )
    }
    detailImg(){
        /*
        SyanImagePicker.asyncShowImagePicker(options)
            .then(photos => {
                if(this.state.isIphone){
                    for(let i=0;i<photos.length;i++){
                        this.uploadImageMore(photos[i].uri)
                    }
                }else{
                    for(let i=0;i<photos.length;i++){
                        this.uploadImageMore(photos[i].original_uri)
                    }
                }

            })*/
    }
    uploadImageMore(uri){
        console.log(uri)
        this.setState({
            isPhotoLoading:true
        })
        let arr=this.state.showImage;
        let img=[];
        let formData=new FormData();
        let file={uri:uri,type:'multipart/form-data',name:'image.png'};
        formData.append('token',this.state.token);
        formData.append('file',file);
        //alert(JSON.stringify(formData))
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            result=>{
                this.setState({
                    isPhotoLoading:false
                })
                if(result.code==1){
                    arr.push({image_id:result.data.image_id,img:result.data.domain+result.data.image_url});
                    this.setState({
                        showImage:arr
                    },()=>{
                        for(let i=0;i<arr.length;i++){
                            img.push({image_id:arr[i].image_id})
                        }
                        this.setState({
                            image:img,
                        })

                    })
                }
            }
        )
    }
    goNext(){
        NavigatorUtils.goPage({},'Address')
    }
    render(){
        const {theme} = this.props;
        const {isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>
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
                                <Text style={styles.main_prompt}>请为体验挑选一张最具有代表性的照片，这回事参与者浏览体验时看到的第一张照片</Text>
                                <TouchableOpacity
                                    style={[styles.cover_img_btn,CommonStyle.flexCenter]}
                                    onPress={()=>{this.coverImg()}}
                                >
                                    <AntDesign
                                        name={'plus'}
                                        size={20}
                                        style={{color:'#666'}}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.main_title,{marginTop:25}]}>
                                    更多活动内容照片或视频
                                </Text>
                                <Text style={styles.main_prompt}>
                                    请为体验挑选活动照片或视频，这回事参与者浏览体验时看到的照片或视频
                                </Text>
                                <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginBottom: 100}]}>
                                    <TouchableOpacity
                                        style={[styles.detail_imgs_btn, CommonStyle.flexCenter]}
                                        //onPress={()=>{this.detailImg()}}
                                    >
                                        <AntDesign
                                            name={'plus'}
                                            size={20}
                                            style={{color:'#666'}}
                                        />
                                    </TouchableOpacity>
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
                                <Text style={{color:'#fff'}}>保存并继续</Text>
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
        marginTop:15
    },
    detail_imgs_btn: {
        width:(width*0.94-20)/3,
        height: (width*0.94-20)/3,
        borderWidth: 2,
        borderColor: "#dcdcdc",
        borderStyle:'dashed',
        marginTop: 15
    }
})
const mapStateProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateProps)(Photo)

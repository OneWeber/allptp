import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import ImagePickers from "react-native-image-crop-picker";
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import Toast from 'react-native-easy-toast';
import LazyImage from 'animated-lazy-image';
import Video from 'react-native-video';
import Modal from 'react-native-modalbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NewHttp from '../../utils/NewHttp';
const {width, height} = Dimensions.get('window');
class Feedback extends Component{
    constructor(props) {
        super(props);
        this.timer = null
        this.tabNames = [
            {title: '功能异常', id: 1},
            {title: '产品建议', id: 2},
            {title: '其他', id:3}
        ]
        this.state = {
            type: '',
            typeIndex: -1,
            content: '',
            lodingImages: false,
            imageList: [],
            imageId: []
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
    getRightButton() {
        return <View>
            {
                this.state.type && this.state.content
                ?
                    <TouchableOpacity style={{
                        paddingRight: width*0.03
                    }}
                    onPress={() => {
                        this.saveFeedBack()
                    }}
                    >
                        <Text style={{color:this.props.theme,fontWeight: 'bold',fontSize: 16}}>确定</Text>
                    </TouchableOpacity>
                :
                    null
            }
        </View>
    }
    saveFeedBack() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('content', this.state.content);
        formData.append('type', this.state.type);
        formData.append('image', JSON.stringify(this.state.imageId));
        Fetch.post(NewHttp+'FeedBackS', formData).then(res => {
            if(res.code === 1) {
                this.refs.toast.show('反馈提交成功');
                let time = 2;
                this.timer = setInterval(() => {
                    time --;
                    if(time === 0) {
                        NavigatorUtils.backToUp(this.props)
                    }
                }, 1000)
            }
        })
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    clickItem(index, id) {
        this.setState({
            type: id,
            typeIndex: index
        })
    }
    detailImg() {
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
    uploadImageMore(images, i){
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
                        send: {image_id:res.data.image_id,img:res.data.domain+res.data.image_url},
                        extension: res.data.extension
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
    render() {
        const {imageList} = this.state;
        let Images = [];
        const list = ['MP3','MP4','AVI','MOV', 'ASF', 'WMV', 'VOB', '3GP', 'SWF', 'MKV', 'FLV','RMVB','WEBM','F4V'];
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
                    {
                        list.indexOf(imageList[i].extension.toUpperCase())>-1
                            ?
                            <View style={[CommonStyle.flexCenter,{
                                width:(width*0.94-30)/3,
                                height: (width*0.94-30)/3,
                                borderRadius: 3,
                                backgroundColor: '#333'
                            }]}>
                                <AntDesign
                                    name={'play'}
                                    size={20}
                                    style={{color:'#f5f5f5'}}
                                    onPress={() => {
                                        this.setState({
                                            videoUrl: imageList[i].send.img
                                        },() => {
                                            this.refs.video.open()
                                        })
                                    }}
                                />
                            </View>
                            :
                            <LazyImage
                                source={{uri: imageList[i].send.img}}
                                style={{
                                    width:(width*0.94-30)/3,
                                    height: (width*0.94-30)/3,
                                    borderRadius: 3
                                }}
                            />
                    }

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

                </TouchableOpacity>
            )
        }
         return(
             <View style={{flex: 1,backgroundColor: '#fff'}}>
                 <RNEasyTopNavBar
                     title={'帮助与反馈'}
                     backgroundTheme={'#fff'}
                     titleColor={'#333'}
                     leftButton={this.getLeftButton()}
                     rightButton={this.getRightButton()}
                 />
                 <Toast ref="toast" position='center' positionValue={0}/>
                 <KeyboardAwareScrollView>
                 <ScrollView>
                     <View style={[CommonStyle.flexCenter]}>
                         <View style={CommonStyle.commonWidth}>
                             <Text style={styles.main_title}>反馈类型<Text style={{color:'red'}}>*</Text></Text>
                             <View>
                                 {
                                     this.tabNames.map((item, index) => {
                                         return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                             marginTop: 20
                                         }]}
                                         onPress={() => {
                                             this.clickItem(index, item.id)
                                         }}
                                         >
                                             <View style={[CommonStyle.flexCenter,{
                                                 width:20,
                                                 height:20,
                                                 borderRadius: 10,
                                                 borderWidth: this.state.typeIndex===index?0:1,
                                                 borderColor: '#dcdcdc',
                                                 backgroundColor: this.state.typeIndex===index?this.props.theme:'#fff'
                                             }]}></View>
                                             <Text style={{
                                                 marginLeft: 10,
                                                 color: '#333'
                                             }}>{item.title}</Text>
                                         </TouchableOpacity>
                                     })
                                 }
                             </View>

                             <Text style={[styles.main_title,{
                                 marginTop: 35
                             }]}>反馈内容<Text style={{color:'red'}}>*</Text></Text>
                             <TextInput
                                multiline={true}
                                defaultValue={this.state.content}
                                onChangeText={text => {
                                    this.setState({
                                        content: text
                                    })
                                }}
                                placeholder={'反馈内容'}
                                style={{
                                    marginTop: 25,
                                    height: 180,
                                    borderWidth: 1,
                                    borderColor: '#dcdcdc',
                                    borderRadius:5,
                                    padding: 5
                                }}
                             />
                             <Text style={[styles.main_title,{
                                 marginTop: 35
                             }]}>上传照片/视频</Text>
                             <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginBottom: 50,marginTop: 25}]}>
                                 <TouchableOpacity
                                     style={[styles.detail_imgs_btn, CommonStyle.flexCenter]}
                                     onPress={()=>{this.detailImg()}}
                                 >
                                     {
                                            this.state.lodingImages
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
                 </KeyboardAwareScrollView>
                 <Modal
                     style={{height:height,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                     ref={"video"}
                     animationDuration={200}
                     position={"center"}
                     backdropColor={'rgba(0,0,0,0.9)'}
                     swipeToClose={false}
                     backdropPressToClose={true}
                     coverScreen={true}>
                     <View style={{
                         width: width,
                         height: height,
                         backgroundColor: '#333',
                         position:'relative'
                     }}>
                         <Video
                             ref={(ref: Video) => { //方法对引用Video元素的ref引用进行操作
                                 this.video = ref
                             }}
                             /* source={{ uri: 'https://gslb.miaopai.com/stream/HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__.mp4?ssig=bbabfd7684cae53660dc2d4c2103984e&time_stamp=1533631567740&cookie_id=&vend=1&os=3&partner=1&platform=2&cookie_id=&refer=miaopai&scid=HNkFfNMuhjRzDd-q6j9qycf54OaKqInVMu0YhQ__', type: 'mpd' }} */
                             source={{uri:this.state.videoUrl}}//设置视频源
                             paused={false}//暂停
                             style={{
                                 width: width,
                                 height: height,
                             }}//组件样式
                             rate={1}//播放速率
                             muted={true}//控制音频是否静音
                             resizeMode={'cover'}//缩放模式

                             repeat={true}//确定在到达结尾时是否重复播放视频。
                         />
                         <AntDesign
                             name={'close'}
                             size={25}
                             style={{
                                 color:'#fff',
                                 position:'absolute',
                                 right: width*0.03,
                                 top:40
                             }}
                             onPress={() => {
                                 this.setState({
                                     paused: true,
                                 },() => {
                                     this.refs.video.close()
                                 })
                             }}
                         />
                     </View>
                 </Modal>
             </View>
         )
    }
}
const styles = StyleSheet.create({
    main_title: {
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20
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
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(Feedback)

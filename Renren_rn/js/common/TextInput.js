import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavigatorUtils from '../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import Fetch from '../expand/dao/Fetch';
import HttpUrl from '../utils/Http';
import action from '../action';
import NewHttp from '../utils/NewHttp';
import StarRating from'react-native-star-rating';
import ImagePickers from 'react-native-image-crop-picker';
import Toast from 'react-native-easy-toast';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window');
class TextInputView extends Component{
    constructor(props) {
        super(props);
        this.table_flag = this.props.navigation.state.params.table_flag;
        this.flag = this.props.navigation.state.params.flag;
        this.t_id = this.props.navigation.state.params.t_id;
        this.table_id = this.props.navigation.state.params.table_id;
        this.order_id = this.props.navigation.state.params.order_id?this.props.navigation.state.params.order_id:null
        this.state = {
            content: '',
            image: [],
            score: 5,
            lodingImages: false,
            imageList: [],
            imageId: []
        }
    }
    goComments() {
        if(this.flag === 2||this.flag === 4||this.flag === 5) {
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('flag',this.flag);
            formData.append('table_id',this.table_id);
            formData.append('content',this.state.content);
            Fetch.post(HttpUrl+'Comment/save_leavemsg', formData).then(res => {
                if(res.code === 1) {
                    if(this.table_flag === 1) {
                        this.initActiveComments();
                    }else{
                        this.initStoryComments();
                    }
                    NavigatorUtils.backToUp(this.props)
                }
            })
        }else{
            let formData=new FormData();
            formData.append('token',this.props.token);
            formData.append('table_id',this.table_id);
            formData.append('content',this.state.content);
            formData.append('flag',this.flag);
            formData.append('image',JSON.stringify(this.state.imageId));
            formData.append('isapp',1);
            formData.append('score', this.state.score);
            if(this.order_id){
                formData.append('order_id', this.order_id);
            }
            Fetch.post(NewHttp+'CommentS', formData).then(res => {
                if(res.code === 1) {
                    this.initActiveComments();
                    NavigatorUtils.backToUp(this.props, this.order_id?true:false)
                }
            })
        }

    }

    initActiveComments() {
        const {onLoadActiveComments} = this.props;
        this.storeName = 'comments'
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('table_id',this.t_id);
        formData.append('flag',1);
        formData.append('order',1);
        formData.append('page',1);
        onLoadActiveComments(this.storeName, HttpUrl + 'Comment/comment_list', formData)
    }
    initStoryComments() {
        const {onLoadStoryComments} = this.props;
        this.storeName = 'comments'
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('table_id',this.t_id);
        formData.append('flag',2);
        formData.append('order',1);
        formData.append('page',1);
        onLoadStoryComments(this.storeName, NewHttp + 'LeaveL', formData)
    }
    uploadImages() {
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
                    this.refs.toast.show('第'+(i+1)+'张图片上传失败')
                }
            }
        )
    }
    render() {
        const {lodingImages, imageList} = this.state;
        let Images = [];
        for(let i=0;i<imageList.length;i++) {
            Images.push(
                <View key={i} style={[styles.detail_imgs_btn,{
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
                            style={{color:'#fff'}}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <View style={[CommonStyle.spaceRow,{
                    height: 50
                }]}>
                    <TouchableOpacity
                        style={{paddingLeft: width*0.03}}
                        onPress={()=>{
                            NavigatorUtils.backToUp(this.props)
                        }}
                    >
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{color:'#333'}}
                        />
                    </TouchableOpacity>
                    {
                        this.state.content
                        ?
                            <TouchableOpacity
                                style={{paddingRight: width*0.03}}
                                onPress={()=>{
                                    this.goComments()
                                }}
                            >
                                <Text style={{
                                    color:this.props.theme,
                                    fontSize: 16
                                }}>发表</Text>
                            </TouchableOpacity>
                        :
                            <View
                                style={{paddingRight: width*0.03}}
                            >
                                <Text style={{
                                    color:'#333',
                                    fontSize: 16
                                }}>发表</Text>
                            </View>
                    }
                </View>
                <KeyboardAwareScrollView style={{flex: 1}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                        style={{width:'100%'}}
                    >
                        <TextInput
                            placeholder={this.flag===1?'对这个体验说点什么吧':this.flag===2?'对这篇故事说点什么吧':'你想对她/他说点什么'}
                            multiline={true}
                            onChangeText={(text)=>{
                                this.setState({
                                    content: text
                                })
                            }}
                            style={{
                                justifyContent:'flex-start',
                                alignItems:'flex-start',
                                textAlignVertical:'top',
                                padding: width*0.03,
                                minHeight: 120,
                                width: width
                            }}
                        />
                        {
                            this.flag===1
                            ?
                                <View style={[CommonStyle.commonWidth,{
                                    marginLeft: width*0.03,
                                    marginTop: 25
                                }]}>
                                    <View style={CommonStyle.flexStart}>
                                        <Text style={{
                                            color:'#333',
                                            fontWeight: 'bold'
                                        }}>给体验打分:</Text>
                                        <View>
                                            <StarRating
                                                disabled={false}
                                                maxStars={5}
                                                starSize={20}
                                                rating={this.state.score}
                                                halfStarEnabled={true}
                                                fullStarColor={this.props.theme}
                                                starStyle={{marginLeft: 10}}
                                                selectedStar={(rating) =>{
                                                    this.setState({
                                                        score: rating
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={[CommonStyle.flexStart,{
                                        flexDirection: 'row',
                                        marginTop: 25,
                                        flexWrap: 'wrap'
                                    }]}>
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            width:(width*0.94-30)/3,
                                            height: (width*0.94-30)/3,
                                            borderWidth: 1,
                                            borderColor: "#dcdcdc",
                                            borderStyle:'dashed',
                                            marginTop: 15
                                        }]}
                                         onPress={()=>{
                                             this.uploadImages()
                                         }}
                                        >
                                            {
                                                lodingImages
                                                    ?
                                                    <ActivityIndicator size={'small'} color={'#666'}/>
                                                    :
                                                    <AntDesign
                                                        name={'plus'}
                                                        size={16}
                                                        style={{color:'#666'}}
                                                    />
                                            }
                                        </TouchableOpacity>
                                        {Images}
                                    </View>
                                </View>
                            :
                                null
                        }
                    </ScrollView>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
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
});
const mapDispatchToProps = dispatch => ({
    onLoadActiveComments: (storeName, url, data) => dispatch(action.onLoadActiveComments(storeName, url, data)),
    onLoadStoryComments: (storeName, url, data) => dispatch(action.onLoadStoryComments(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(TextInputView)

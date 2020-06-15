import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput, ScrollView, Image, ActivityIndicator} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
import Fetch from '../../../expand/dao/Fetch';
import HttpUrl from '../../../utils/Http';
import Modal from 'react-native-modalbox';
import ImagePickers from 'react-native-image-crop-picker';
import Toast from 'react-native-easy-toast';
import LazyImage from 'animated-lazy-image';
import NewHttp from '../../../utils/NewHttp';
import action from '../../../action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const widthScreen = Dimensions.get('window').width;
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
class PublishStory extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            address: '',
            country_id: '',
            country: '',
            province_id: '',
            province: '',
            city_id: '',
            city: '',
            imageList: [],
            imageId: [],
            kind_id: '',
            lodingImages: false,
            cover_image: '',
            story_id: '',
            region: '',
            region_id: ''
        }
        this.isEdit=this.props.navigation.state.params.isEdit?this.props.navigation.state.params.isEdit:false;
        this.data=this.props.navigation.state.params.data?this.props.navigation.state.params.data:'';
        this.typeNames = [
            {
                title: '户外活动',
                vol: 1
            },
            {
                title: '少数民族',
                vol: 2
            },
            {
                title: '本土文化',
                vol: 3
            }
        ]
    }
    componentDidMount(){
        if(this.isEdit) {
            this.loadStory()
        }
    }
    loadStory() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('story_id', this.data.story_id);
        formData.append('visit', 0);
        Fetch.post(HttpUrl+'Story/get_story', formData).then(res => {
            if(res.code === 1) {
                console.log('res', res);
                this.setState({
                    title: res.data.title,
                    content: res.data.content,
                    address: res.data.address,
                    country_id: res.data.country_id,
                    country: res.data.country,
                    province_id: res.data.province_id,
                    province: res.data.province,
                    city_id: res.data.city_id,
                    city: res.data.city,
                    cover_image: res.data.cover_image,
                    story_id: res.data.story_id,
                    kind_id: res.data.kind_id
                }, () => {
                    let imgs = res.data.image;
                    console.log('imgs', res.data.image)
                    let list = [], ids=[];
                    for(let i=0; i<imgs.length; i++) {
                        list.push({
                            send: {image_id:imgs[i].image_id,img:imgs[i].domain+imgs[i].image_url}
                        })
                        ids.push(
                            {image_id: imgs[i].image_id}
                        )
                    }
                    this.setState({
                        imageList: list,
                        imageId: ids
                    })
                })
            }
        })
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
    publishStory() {
        if(!this.state.title) {
            this.refs.toast.show('请填写标题')
        }else if(!this.state.content) {
            this.refs.toast.show('请填写故事内容')
        }else if(this.state.imageId.length===0) {
            this.refs.toast.show('请至少上传一张图片')
        } else if(this.state.kind_id === '') {
            this.refs.toast.show('请选择故事类型')
        }else if(!this.state.country&&!this.state.province) {
            this.refs.toast.show('请选择故事地点')
        }else{
            let formData = new FormData();
            formData.append('token', this.props.token);
            if(this.isEdit) {
                formData.append('story_id', this.state.story_id);
            }
            formData.append('title', this.state.title);
            formData.append('content', this.state.content);
            formData.append('kind_id', this.state.kind_id);
            formData.append('image', JSON.stringify(this.state.imageId));
            formData.append('country', this.state.country);
            formData.append('province', this.state.province);
            formData.append('city', this.state.city);
            formData.append('region', this.state.region);
            formData.append('address', this.state.address);
            formData.append('cover_image', this.state.imageId[0].image_id);
            formData.append('isapp', 1);
            formData.append('country_id', this.state.country_id);
            formData.append('province_id', this.state.province_id);
            formData.append('city_id', this.state.city_id);
            formData.append('region_id', this.state.region_id);
            console.log(formData)
            Fetch.post(HttpUrl+'Story/save_story', formData).then(res => {
                if(res.code === 1) {
                    if(this.isEdit) {
                        this.initStory();
                        NavigatorUtils.backToUp(this.props)
                    }else{
                        NavigatorUtils.goPage({}, 'StoryList')
                    }
                }
            })
        }
    }
    initStory() {
        const {token, onLoadMyStory} = this.props;
        let formData=new FormData();
        formData.append('token',token);
        formData.append('keywords','');
        formData.append('sort','');
        formData.append('page',1);
        formData.append('kind_id','');
        onLoadMyStory('mystory', NewHttp + 'storyc', formData)
    }
    getRightButton(){
        const {theme} = this.props
        return <View style={{paddingRight:widthScreen*0.03}}>
            <Text style={{
                fontWeight:'bold',
                fontSize: 16,
                color:theme
            }} onPress={()=>{
                this.publishStory()
            }}>
                {this.isEdit?'确定':'发布'}
            </Text>

        </View>
    }
    clickAddress(data) {
        this.setState({
            country_id: data.countryId,
            country: data.country,
            province_id: data.provinceId,
            province: data.province,
            city_id: data.cityId,
            city: data.city,
        })
    }
    clickKind(index) {
        this.setState({
            kind_id: this.typeNames[index].vol
        },()=>{
            this.refs.type.close();
        })
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
        console.log(images.size)
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
        const {country, province, city, kind_id, imageList} = this.state;
        let Images = [];
        for(let i=0;i<imageList.length;i++) {
            Images.push(
                <View key={i} style={[styles.detail_imgs_btn,{
                    marginLeft: i!=0&&(i+1)%3===0?0:15,
                    borderWidth: 0,
                    position:'relative',
                    backgroundColor:'#f5f5f5',
                    borderRadius: 3
                }]} >
                    <LazyImage
                        source={{uri: imageList[i].send.img}}
                        style={{
                            width:(widthScreen*0.94-30)/3,
                            height: (widthScreen*0.94-30)/3,
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
                </View>
            )
        }
        return(
            <View style={styles.container}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <RNEasyTopNavBar
                    title={'发布故事'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                    style={{borderBottomWidth: 1,borderBottomColor: '#f5f5f5'}}
                />
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <TextInput
                                    style={styles.title_input}
                                    placeholder = '故事标题'
                                    placeholderTextColor='#C9C9C9'
                                    multiline={true}
                                    onChangeText={(text)=>{this.setState({title:text})}}
                                    defaultValue ={this.state.title}
                                />
                                <TextInput
                                    style={styles.content_input}
                                    placeholder = '尽情发挥吧'
                                    placeholderTextColor='#B6B6B6'
                                    multiline={true}
                                    textAlignVertical='top'
                                    onChangeText={(text)=>{this.setState({content:text})}}
                                    defaultValue ={this.state.content}
                                />
                                <View style={[CommonStyle.flexStart,{
                                    flexWrap: 'wrap',
                                    marginTop: 20
                                }]}>
                                    <TouchableOpacity
                                        style={[styles.addContent,CommonStyle.flexCenter]}
                                        onPress={() => {
                                            this.uploadImages()
                                        }}
                                    >
                                        {
                                            this.state.lodingImages
                                            ?
                                                <ActivityIndicator size={'small'} style={{color:'#666'}}/>
                                            :
                                                <AntDesign
                                                    name="plus"
                                                    size={35}
                                                    style={{color:'#E8E8E8'}}
                                                />
                                        }

                                    </TouchableOpacity>
                                    {Images}
                                </View>
                                <Text style={{
                                    color:theme,
                                    marginTop: 10
                                }}>
                                    (注：您上传的照片中，第一张照片将会成为该故事的封面照哦～)
                                </Text>
                                <TouchableOpacity
                                    style={[CommonStyle.spaceRow,{marginTop: 25}]}
                                    onPress={() => {
                                        this.refs.type.open()
                                    }}
                                >
                                    <Image
                                        source={require('../../../../assets/images/home/gushilx.png')}
                                        style={{width: 15, height: 18}}
                                    />
                                    <View style={[CommonStyle.flexStart,styles.lx_con]}>
                                        {
                                            kind_id
                                            ?
                                                <Text style={styles.lx_contxt}>{this.typeNames[kind_id-1].title}</Text>
                                            :
                                                <Text style={styles.lx_contxt}>故事类型</Text>
                                        }

                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[CommonStyle.spaceRow,{marginTop: 5}]}
                                    onPress={()=>{this.picker.showPicker()}}
                                >
                                    <Image
                                        source={require('../../../../assets/images/home/gushidz.png')}
                                        style={{width: 15, height: 18}}
                                    />
                                    <View style={[CommonStyle.flexStart,styles.lx_con]}>
                                        {
                                            country || province || city
                                            ?
                                                <Text style={styles.lx_contxt}>
                                                    {country+province+city}
                                                </Text>
                                            :
                                                <Text style={styles.lx_contxt}>故事地点</Text>
                                        }

                                    </View>
                                </TouchableOpacity>
                                <View style={[CommonStyle.spaceRow,{marginTop: 20,alignItems:'flex-start',marginBottom: 30}]}>
                                    <Image
                                        source={require('../../../../assets/images/home/xiangxidz.png')}
                                        style={{width: 15, height: 18}}
                                    />
                                    <View style={[CommonStyle.flexCenter,{
                                        alignItems: "flex-start",
                                        width:widthScreen*0.94 -30,

                                    }]}>
                                        <Text style={styles.lx_contxt}>详细地址</Text>
                                        <TextInput
                                            style={styles.address_con}
                                            placeholder = '请输入详细地址'
                                            placeholderTextColor='#B6B6B6'
                                            multiline={true}
                                            textAlignVertical='top'
                                            onChangeText={(text)=>{this.setState({address:text})}}
                                            defaultValue ={this.state.address}
                                        />
                                    </View>
                                </View>
                                <RNEasyAddressPicker
                                    hasCountry={true}
                                    ref={picker => this.picker = picker}
                                    selectCountry={(index) => {}}
                                    selectCity={(index) => {}}
                                    clickConfirmBtn={(data) => {this.clickAddress(data)}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"type"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.7)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 180,
                        backgroundColor: '#fff'
                    }}>
                        {
                            this.typeNames.map((item, index) => {
                                return <TouchableOpacity key={index}
                                    style={[CommonStyle.flexCenter,{
                                        height:60,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: index===2?0:1
                                    }]}
                                    onPress={() => {
                                        this.clickKind(index)
                                    }}
                                >
                                    <Text style={{color:'#333'}}>{item.title}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    title_input:{
        width:'100%',
        fontSize:18,
        marginTop:15,
        color:"#333333",
        fontWeight:'bold'
    },
    content_input:{
        width:'100%',
        fontSize:16,
        minHeight:120,
        marginTop:15,
        color:"#666666",
        lineHeight: 22
    },
    addContent: {
        width:(widthScreen*0.94 - 30) /3,
        height: (widthScreen*0.94 - 30) /3,
        borderStyle:'dashed',
        borderColor:'#dcdcdc',
        borderWidth:1,
        borderRadius:0.1
    },
    lx_con:{
        width: widthScreen*0.94 -30,
        height: 50,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1
    },
    lx_contxt: {
        color:'#333',
        fontSize: 16.5
    },
    address_con:{
        fontSize:16,
        minHeight:100,
        marginTop:15,
        borderBottomWidth:1,
        borderBottomColor:'#f5f5f5',
        marginBottom:30,
        color:"#333",
        paddingBottom: 10,
        width: widthScreen*0.94
    },
    detail_imgs_btn: {
        width:(widthScreen*0.94-30)/3,
        height: (widthScreen*0.94-30)/3,
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
    onLoadMyStory: (storeName, url, data) => dispatch(action.onLoadMyStory(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(PublishStory)

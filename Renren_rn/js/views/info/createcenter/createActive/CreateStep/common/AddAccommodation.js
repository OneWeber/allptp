import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TextInput,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import action from '../../../../../../action'
import Toast from 'react-native-easy-toast';
import ImagePickers from 'react-native-image-crop-picker';
import Fetch from '../../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../../utils/Http';
import LazyImage from 'animated-lazy-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const {width} = Dimensions.get('window')
class AddAccommodation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            typeIndex: 0,
            num: '',
            max_person: '',
            price: '',
            descript: '',
            images: [],
            lodingImages: false,
            imageList: [],
            imageId: []
        }
        this.tabNames = [
            {
                id: 1,
                title: '露营'
            },
            {
                id: 2,
                title: '民宿'
            },
            {
                id: 3,
                title: '酒店'
            }
        ]
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
        return <TouchableOpacity style={{
            paddingRight: width*0.03
        }}>
            <Text style={{
                color:'#333'
            }}>退出</Text>
        </TouchableOpacity>
    }
    changeType(index, id) {
        this.setState({
            typeIndex: id
        },()=>{
            this.refs.type.close()
        })
    }
    addAccommodation() {
        const {accommodation, changeAccommodation, changeAccImageId, acc_imageId} = this.props;
        if(!this.state.typeIndex) {
            this.refs.toast.show('请选择住宿类型')
        }else if(!this.state.num) {
            this.refs.toast.show('请填写提供的房间数')
        }else if(!this.state.max_person) {
            this.refs.toast.show('请填写一个房间可住人数')
        }else if(!this.state.descript) {
            this.refs.toast.show('请简单介绍您住宿的情况')
        }else if(!this.state.price) {
            this.refs.toast.show('请填写住宿价格')
        }else if(this.state.imageId.length === 0) {
            this.refs.toast.show('请提供住宿图片')
        }else {
            let list = this.props.navigation.state.params.acc_arr;
            let id_data = [];
            const {imageList} = this.state;
            for(let i=0;i<imageList.length;i++) {
                id_data.push({
                    image_id: imageList[i].send.image_id,
                    domain: imageList[i].send.domain,
                    image_url: imageList[i].send.image_url
                })
            }
            changeAccImageId(id_data);
            let data = {
                flag: this.state.typeIndex,
                num: this.state.num,
                max_person: this.state.max_person,
                descript: this.state.descript,
                price: this.state.price,
                image: id_data,
            }
            list.push(data)
            changeAccommodation(list);

            // NavigatorUtils.backToUp(this.props, true)
           NavigatorUtils.goPage({},'Accommodation')
        }
    }
    onloadImages() {
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
                        send: {image_id:res.data.image_id,domain:res.data.domain,image_url:res.data.image_url}
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
        const {typeIndex, imageList} = this.state;
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
                        source={{uri: imageList[i].send.domain + imageList[i].send.image_url }}
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
            <View style={{flex: 1,backgroundColor: '#f5f5f5',position:'relative'}}>
                <RNEasyTopNavBar
                    title={'添加住宿'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <Toast ref="toast" position='center' positionValue={0}/>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        {/*住宿类型*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 20,
                            paddingBottom: 20,
                            marginTop: 10,
                            backgroundColor: '#fff'
                        }]}>
                            <TouchableOpacity
                                style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}
                                onPress={()=>{
                                    this.refs.type.open()
                                }}
                            >
                                <Text style={styles.acc_title}>您提供的住宿类型</Text>
                                <View style={CommonStyle.flexStart}>
                                    {
                                        typeIndex===0
                                        ?
                                            null
                                        :
                                            <Text style={{color:'#333'}}>
                                                {
                                                    this.tabNames[typeIndex-1].title
                                                }
                                            </Text>
                                    }
                                    <AntDesign
                                        name={'right'}
                                        size={14}
                                        style={{color:'#c6c6c6'}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/*房间详情*/}
                        <View style={[{
                            backgroundColor: '#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.flexCenter,{
                                paddingTop: 20,
                                paddingBottom: 20,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1
                            }]}>
                                <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                    <Text style={styles.acc_title}>提供的房间数</Text>
                                    <TextInput
                                        placeholder="请填写"
                                        style={styles.acc_input}
                                        defaultValue={this.state.num}
                                        keyboardType={"number-pad"}
                                        onChangeText={(text)=>{this.setState({
                                            num: text
                                        })}}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[CommonStyle.flexCenter,{
                                paddingTop: 20,
                                paddingBottom: 20,
                            }]}>
                                <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                    <Text style={styles.acc_title}>一个房间可住人数</Text>
                                    <TextInput
                                        placeholder="请填写"
                                        style={styles.acc_input}
                                        keyboardType={"number-pad"}
                                        defaultValue={this.state.max_person}
                                        onChangeText={(text)=>{this.setState({
                                            max_person: text
                                        })}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/*住宿情况*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 20,
                            paddingBottom: 20,
                            marginTop: 10,
                            backgroundColor: '#fff'
                        }]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }}>请简单介绍您住宿的情况</Text>
                                <TextInput
                                    multiline={true}
                                    defaultValue={this.state.descript}
                                    onChangeText={(text)=>{this.setState({
                                        descript: text
                                    })}}
                                    style={{
                                        textAlignVertical:'top',
                                        minHeight: 90,
                                        borderWidth: 1,
                                        borderColor: '#f5f5f5',
                                        marginTop: 14.5,
                                        borderRadius: 2
                                    }}
                                />

                            </View>
                        </View>
                        {/*住宿价格*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 20,
                            paddingBottom: 20,
                            marginTop: 10,
                            backgroundColor: '#fff'
                        }]}>
                            <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <Text style={styles.acc_title}>住宿价格</Text>
                                <View style={CommonStyle.flexStart}>
                                    <View style={[CommonStyle.flexCenter,{
                                        width: 54,
                                        height:22.5,
                                        borderWidth: 1,
                                        borderColor: '#dfe1e4',
                                        borderRadius: 4
                                    }]}>
                                        <Text style={{color:'#333',fontSize: 12}}>APY(¥)</Text>
                                    </View>
                                    <TextInput
                                        placeholder="请填写"
                                        defaultValue={this.state.price}
                                        onChangeText={(text)=>{this.setState({
                                            price: text
                                        })}}
                                        style={{marginLeft: 10,textAlign: 'right'}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/*住宿图片*/}
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop: 20,
                            paddingBottom: 20,
                            marginTop: 10,
                            backgroundColor: '#fff',
                            marginBottom: 100
                        }]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }}>您提供的住宿图片</Text>
                                <View style={[CommonStyle.flexStart,{
                                    flexWrap:'wrap',
                                    marginTop: 10
                                }]}>
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width:(width*0.94-30)/3,
                                        height: (width*0.94-30)/3,
                                        borderWidth: 1,
                                        borderColor: '#dfe1e4',
                                        marginTop: 15
                                    }]} onPress={()=>{
                                        this.onloadImages()
                                    }}>
                                        {
                                            this.state.lodingImages
                                                ?
                                                <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
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
                <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                        <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                            backgroundColor:this.props.theme
                        }]}
                         onPress={()=>{
                             this.addAccommodation()
                         }}
                        >
                            <Text style={{color:'#fff'}}>添加</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"type"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.5)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height:180,
                        backgroundColor: '#fff'
                    }}>
                        {
                            this.tabNames.map((item, index) => {
                                return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                    height:60,
                                    borderBottomWidth: index===2?0:1,
                                    borderBottomColor: '#f5f5f5'
                                }]} onPress={()=>this.changeType(index, item.id)}>
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
    acc_title: {
        fontSize: 15,
        color:'#333',
        fontWeight: 'bold'
    },
    acc_input: {
        minWidth: 200,
        textAlign: 'right'
    },
    detail_imgs_btn: {
        width:(width*0.94-30)/3,
        height: (width*0.94-30)/3,
        marginTop: 15
    }
});
const mapStateToProps = state => ({
    token:state.token.token,
    theme: state.theme.theme,
    accommodation: state.steps.accommodation,
    acc_imageId: state.steps.acc_imageId
});
const mapDispatchToProps = dispatch => ({
    changeAccommodation: arr => dispatch(action.changeAccommodation(arr)),
    changeAccImageId: arr => dispatch(action.changeAccImageId(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(AddAccommodation)

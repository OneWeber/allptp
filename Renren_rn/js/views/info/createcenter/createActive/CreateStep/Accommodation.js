import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import LazyImage from 'animated-lazy-image';
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import action from '../../../../../action';
import NewHttp from '../../../../../utils/NewHttp';
import ImagePickers from "react-native-image-crop-picker";
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
const {width} = Dimensions.get('window')
class Accommodation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenning: false,
            tabIndex: 0,
            volTabIndex: 0,
            isLoading: false,
            acc_arr: this.props.accommodation,
            houseImage: []
        }
        this.tabNames = [
            {
                id: 0,
                title: '不提供'
            },
            {
                id: 1,
                title: '提供'
            },
            {
                id: 2,
                title: '包含住宿'
            }
        ]
        this.tabNamesVol = [
            {
                id: 0,
                title: '不提供'
            },
            {
                id: 1,
                title: '提供'
            }
        ]
    }
    componentDidMount() {
        const {activity_id} = this.props;
        if(activity_id === '') {
            return
        } else {
            this.initData()
        }
    }
    initData() {
        const {changeStatus} = this.props;
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    tabIndex: res.data.issatay,
                    volTabIndex: res.data.house_volunteen,
                    acc_arr: res.data.house,
                    houseImage: res.data.houseimage
                },() => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    changeIndex(index) {
        this.setState({
            tabIndex: index
        })
    }
    changeVolIndex(index) {
        this.setState({
            volTabIndex: index
        })
    }
    goNext() {
        if(!this.state.isLoading) {
            if(this.state.tabIndex===1) {
                if(this.props.accommodation.length===0) {
                    this.refs.toast.show('请添加住宿信息')
                }else{
                    this.saveAccommodation()
                }
            }else if(this.state.tabIndex===2) {
                if(this.state.houseImage.length === 0) {
                    this.refs.toast.show('请上传您提供的住宿图片')
                }else{
                    this.saveAccommodation()
                }
            }
        }

    }
    saveAccommodation() {
        this.setState({
            isLoading: true
        });
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        formData.append("step",12);
        formData.append("issatay",this.state.tabIndex);
        formData.append("house_volunteen",this.state.volTabIndex);
        formData.append("house",JSON.stringify(this.props.accommodation));
        formData.append("house_image",this.state.tabIndex===2?JSON.stringify(this.state.houseImage):JSON.stringify([]));
        formData.append("isapp",1);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    isLoading: false
                },()=>{
                    NavigatorUtils.goPage({}, 'Attention')
                })
            }

        })
    }
    render(){
        const {tabIndex, volTabIndex} = this.state;
        const {isOpenning} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>
        return(
            <SideMenu
                menu={menu}
                isOpen={isOpenning}
                openMenuOffset={width*2/3}
                hiddenMenuOffset={0}
                edgeHitWidth={50}
                disableGestures={false}
                onChange={
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
                    <CreateHeader title={'提供住宿'} navigation={this.props.navigation}/>
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
                                <Text style={styles.main_title}>是否为参与者提供住宿</Text>
                                {
                                    this.tabNames.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                            marginTop: 20
                                        }]} onPress={()=>this.changeIndex(index)}>
                                            <View style={[CommonStyle.flexCenter,{
                                                height: 18,
                                                width: 18,
                                                borderRadius: 9,
                                                borderWidth: tabIndex===index?0:1,
                                                borderColor: '#ccc',
                                                backgroundColor: tabIndex===index?this.props.theme:'#fff'
                                            }]}>
                                                {
                                                    tabIndex===index
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
                                                marginLeft: 11.5,
                                                color: '#333'
                                            }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </View>
                        {
                            tabIndex === 1
                            ?
                                <Provide initData={()=>{this.initData()}} {...this.props} {...this.state}/>
                            :
                            tabIndex === 2
                            ?
                                <Contains showModal={(data)=>{
                                    this.refs.toast.show(data)
                                }}
                                changeHouseImage={(data)=>{
                                  this.setState({
                                      houseImage: data
                                  })
                                }}
                                {...this.props}
                                {...this.state}/>
                            :
                                null
                        }

                        {/*为志愿者提供住宿*/}
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            paddingTop:20,
                            paddingBottom: 20,
                            marginTop: 10,
                            marginBottom: 100,
                            justifyContent:'flex-start'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <Text style={styles.main_title}>是否为志愿者提供住宿</Text>
                                {
                                    this.tabNamesVol.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                            marginTop: 20
                                        }]} onPress={()=>this.changeVolIndex(index)}>
                                            <View style={[CommonStyle.flexCenter,{
                                                height: 18,
                                                width: 18,
                                                borderRadius: 9,
                                                borderWidth: volTabIndex===index?0:1,
                                                borderColor: '#ccc',
                                                backgroundColor: volTabIndex===index?this.props.theme:'#fff'
                                            }]}>
                                                {
                                                    volTabIndex===index
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
                                                marginLeft: 11.5,
                                                color: '#333'
                                            }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }

                            </View>
                        </View>
                    </ScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:this.props.theme
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
    detail_imgs_btn: {
        width:(width*0.94-30)/3,
        height: (width*0.94-30)/3,
        marginTop: 15
    }
});
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    accommodation: state.steps.accommodation,
    activity_id: state.steps.activity_id,
    acc_imageId: state.steps.acc_imageId
})
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Accommodation)
class Contains extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lodingImages: false,
            imageList: this.props.houseImage,
            imageId: []
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
                        image_id:res.data.image_id,domain:res.data.domain,image_url:res.data.image_url
                    })
                    for(let i=0;i<list.length;i++) {
                        image_id.push({image_id:list[i].image_id})
                    }
                    this.setState({
                        imageList: list,
                        imageId: image_id,
                        lodingImages: false
                    },() => {
                        this.props.changeHouseImage(this.state.imageId)
                    })
                }else {
                    this.setState({
                        lodingImages: false
                    })
                    this.props.showModal('第'+(i+1)+'张图片上传失败')
                   // this.refs.toast.show()
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
    render() {
        const {imageList} = this.state;
        let Images = [];
        for(let i=0;i<imageList.length;i++) {
            Images.push(
                <TouchableOpacity key={i} style={[styles.detail_imgs_btn,{
                    marginLeft: i!=0&&(i+1)%3===0?0:15,
                    borderWidth: 0,
                    position:'relative',
                    backgroundColor:'#f5f5f5',
                    borderRadius: 3
                }]}>
                    <LazyImage
                        source={{uri: imageList[i].domain + imageList[i].image_url }}
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
                </TouchableOpacity>
            )
        }
        return (
            <View style={[CommonStyle.flexCenter,{
                backgroundColor:'#fff',
                paddingTop:20,
                paddingBottom: 20,
                marginTop: 10,
                justifyContent:'flex-start'}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={styles.main_title}>您提供的住宿图片</Text>
                    <View style={[CommonStyle.flexStart,{
                        flexWrap: 'wrap',
                        marginTop: 10
                    }]}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            width:(width*0.94-30)/3,
                            height: (width*0.94-30)/3,
                            borderRadius: 3,
                            borderColor: '#dfe1e4',
                            borderWidth: 1,
                            borderStyle: 'dashed',
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
        )
    }
}
class Provide extends Component{
    goAddAcc() {
        let _this=this;
        NavigatorUtils.goPage({
            refresh: function () {
                _this.props.initData()
            },
            acc_arr: this.props.acc_arr
        }, 'AddAccommodation')
    }
    render() {
        const {acc_arr} = this.props;
        return (
            <View style={[CommonStyle.flexCenter,{
                backgroundColor:'#fff',
                paddingTop:20,
                paddingBottom: 20,
                marginTop: 10,
                justifyContent:'flex-start'}]}>
                <View style={CommonStyle.commonWidth}>
                   <View style={[CommonStyle.spaceRow]}>
                       <Text style={{
                           color:'#333',
                           fontSize: 16,
                           fontWeight: "bold"
                       }}>添加住宿</Text>
                       <TouchableOpacity style={[CommonStyle.flexCenter,{
                           width:50,
                           height:27,
                           backgroundColor: '#ecfeff',
                           borderRadius: 13.5
                       }]} onPress={()=>{
                          this.goAddAcc()
                       }}>
                           <Text style={{
                               color:this.props.theme,
                               fontSize: 13,
                               fontWeight: "bold"
                           }}>添加</Text>
                       </TouchableOpacity>
                   </View>
                    {
                        acc_arr&&acc_arr.length>0
                        ?
                            acc_arr.map((item, index) => {
                                return <View key={index} style={[CommonStyle.spaceRow,{
                                    padding: 11,
                                    backgroundColor: '#f5f7fa',
                                    borderRadius: 5,
                                    marginTop: 10
                                }]}>
                                    <LazyImage
                                        source={{uri: item.image[0].domain + item.image[0].image_url}}
                                        style={{
                                            width:90,
                                            height:75,
                                            borderRadius: 4
                                        }}
                                    />
                                    <View style={[CommonStyle.spaceCol,{
                                        height:75,
                                        width: width*0.94-90-115,
                                        alignItems:'flex-start'
                                    }]}>
                                        <View>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 13
                                            }}>{item.flag===1?'露营':item.flag===2?'民宿':'酒店'}</Text>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 12,
                                                marginTop: 10
                                            }}>¥{item.price}/人</Text>
                                        </View>
                                        <View style={CommonStyle.flexStart}>
                                            <Text style={{
                                                color:'#666',
                                                fontSize: 12
                                            }}>房数:{item.num}间</Text>
                                            <Text style={{
                                                marginLeft: 15,
                                                color:'#666',
                                                fontSize: 12
                                            }}>每间可住{item.max_person}人</Text>
                                        </View>
                                    </View>
                                    <View style={[CommonStyle.flexStart,{
                                        height:75,
                                        alignItems:'flex-start'
                                    }]}>
                                        <Text style={{color:'#a4a4a4',fontSize: 13,marginRight: 15}}>编辑</Text>
                                        <Text style={{color:'#a4a4a4',fontSize: 13}}>删除</Text>
                                    </View>

                                </View>
                            })
                        :
                            null
                    }


                </View>
            </View>
        )
    }
}

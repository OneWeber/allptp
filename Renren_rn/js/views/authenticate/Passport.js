import React,{Component} from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import {connect} from 'react-redux'
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
class Passport extends Component{
    constructor(props) {
        super(props);
        this.state = {
            passport: '',
            passport_uri : ''
        }
    }
    submitPassport() {
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
                        passport:result.data.image_id,
                        passport_uri:result.data.domain+result.data.image_url
                    },() => {
                        this.changePassport(this.state.passport)
                    })
                }
            }
        )
    }
    changePassport(passport) {
        this.props._changePassport(passport)
    }
    render(){
        return(
            <View>
                <Text style={{
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 10
                }}>上传您的护照照片</Text>
                <Text style={{
                    color: '#666',
                    lineHeight: 22,
                    marginTop: 10
                }}>
                    上传您的护照（中国）的照片。 确保您的照片不会模糊不清，能够清楚地显示您的信息。
                </Text>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:180,
                    borderWidth: 1,
                    borderColor: '#f5f5f5',
                    marginTop: 20
                }]} onPress={()=>{
                    this.submitPassport()
                }}>
                    <ImageBackground
                        resizeMode={'cover'}
                        source={{uri:this.state.passport_uri?this.state.passport_uri:''}}
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

            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token
})
export default connect(mapStateToProps)(Passport)

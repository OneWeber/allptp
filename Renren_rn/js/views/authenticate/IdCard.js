import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity,ImageBackground} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
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
class IdCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            idcard_z: '',
            idcard_z_uri: '',
            idcard_f: '',
            idcard_f_uri: ''
        }
    }
    submitIdCardOne(val) {
        ImagePicker.launchImageLibrary(photoOptions,(response)=>{
            if(response.didCancel){
                return
            }else if(response.error){
                console.log(JSON.stringify(response.error))
            }else{
                this.uploadImage(response.uri, val)
            }

        })
    }
    uploadImage(uri, val){
        //alert(uri)
        let formData=new FormData();
        let file={uri:uri,type:'multipart/form-data',name:'image.png'};
        formData.append('token',this.props.token);
        formData.append('file',file);
        //alert(JSON.stringify(formData))
        Fetch.post(HttpUrl+'Upload/upload',formData).then(
            result=>{
                if(result.code==1){
                    if(val === 0) {
                        this.setState({
                            idcard_z:result.data.image_id,
                            idcard_z_uri:result.data.domain+result.data.image_url
                        },() => {
                            this.changeIdCard(val, this.state.idcard_z, this.state.idcard_f)
                        })
                    }else {
                        this.setState({
                            idcard_f:result.data.image_id,
                            idcard_f_uri:result.data.domain+result.data.image_url
                        },() => {
                            this.changeIdCard(val, this.state.idcard_z, this.state.idcard_f)
                        })
                    }

                }
            }
        )
    }
    changeIdCard(val, idcard_z, idcard_f) {
        this.props._changeIdCard(val, idcard_z, idcard_f)
    }
    render(){
        return(
            <View>
                <Text style={{
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 10
                }}>上传您的身份证照片</Text>
                <Text style={{
                    color: '#666',
                    lineHeight: 22,
                    marginTop: 10
                }}>
                    上传您的身份证（中国）的照片。 确保您的照片不会模糊不清，能够清楚地显示您的脸部。
                </Text>

                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:180,
                    borderWidth: 1,
                    borderColor: '#f5f5f5',
                    marginTop: 20
                }]} onPress={()=>{
                    this.submitIdCardOne(0)
                }}>
                    <ImageBackground
                        resizeMode={'cover'}
                        source={{uri:this.state.idcard_z_uri?this.state.idcard_z_uri:''}}
                        style={[CommonStyle.flexCenter,{
                        height:180,
                        width: '100%'
                    }]}>
                        <AntDesign
                            name={'plus'}
                            size={22}
                            style={{color:'#999'}}
                        />
                        <Text style={{
                            color:'#999',
                            marginTop: 10,
                            fontSize: 12
                        }}>身份证正面照(国徽面)</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:180,
                    borderWidth: 1,
                    borderColor: '#f5f5f5',
                    marginTop: 20
                }]} onPress={()=>{
                    this.submitIdCardOne(1)
                }}>
                    <ImageBackground
                        resizeMode={'cover'}
                        source={{uri:this.state.idcard_f_uri?this.state.idcard_f_uri:''}}
                        style={[CommonStyle.flexCenter,{
                        height:180,
                        width: '100%'
                    }]}>
                        <AntDesign
                            name={'plus'}
                            size={22}
                            style={{color:'#999'}}
                        />
                        <Text style={{
                            color:'#999',
                            marginTop: 10,
                            fontSize: 12
                        }}>身份证背面照(头像面)</Text>
                    </ImageBackground>
                </TouchableOpacity>

            </View>
        )
    }
}
const styles = StyleSheet.create({

})
const mapStateToProps = state => ({
    token: state.token.token
})
export default connect(mapStateToProps)(IdCard)

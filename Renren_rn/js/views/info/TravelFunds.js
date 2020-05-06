import React,{Component} from 'react';
import {StyleSheet, View, Text, ImageBackground, SafeAreaView, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from "react-native-vector-icons/AntDesign"
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Share from '../../common/Share';
import Modal from 'react-native-modalbox';
const {width} = Dimensions.get('window');
export default class TravelFunds extends Component{
    _closeModal() {
        this.refs.share.close()
    }
    _showToast(data) {
        this.refs.toast.show(data)
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <ImageBackground
                    style={[CommonStyle.spaceCol,{flex: 1}]}
                    source={require('../../../assets/images/travelbg.png')}
                >
                    <SafeAreaView>
                        <View style={[CommonStyle.flexStart,{
                            width: width,
                            height:50
                        }]}>
                            <TouchableOpacity style={[CommonStyle.back_icon]}>
                                <AntDesign
                                    name={'left'}
                                    size={20}
                                    style={{color:'#fff'}}
                                    onPress={()=>{
                                        NavigatorUtils.backToUp(this.props)
                                    }}
                                />
                            </TouchableOpacity>

                        </View>
                    </SafeAreaView>

                    <View style={[CommonStyle.flexCenter]}>
                        <Text style={styles.travel_title}>分享App给新用户</Text>
                        <Text style={[styles.travel_title,{
                            marginTop: 5
                        }]}>新用户下载并注册，你将获得</Text>
                        <Text style={{
                            color:'#fff',
                            fontSize: 15,
                            fontWeight: "bold",
                            marginTop:26
                        }}><Text style={{fontSize: 36}}>¥25</Text>基金</Text>
                        <TouchableOpacity
                            style={[CommonStyle.flexCenter,{
                                width: 160,
                                height: 45,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: '#fff',
                                marginTop: 45
                            }]}
                            onPress={()=>{
                                this.refs.share.open()
                            }}
                        >
                            <Text style={{color:'#fff',fontSize: 15}}>立即分享</Text>
                        </TouchableOpacity>
                    </View>


                    <SafeAreaView>
                        <View style={{
                            borderBottomColor: '#fff',
                            borderBottomWidth: 1
                        }}>
                            <Text style={{
                                color:'#fff',
                                fontSize: 12,
                            }}>
                                有疑问？查看关于基金
                            </Text>
                        </View>
                    </SafeAreaView>
                </ImageBackground>
                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"share"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 180,
                        backgroundColor:'#F3F5F8'
                    }}>
                        <Share closeModal={()=>this._closeModal()} flag={2} showToast={(data)=>this._showToast(data)} />
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    travel_title: {
        color:'#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})

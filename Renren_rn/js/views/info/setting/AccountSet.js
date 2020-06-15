import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import CommonStyle from '../../../../assets/css/Common_css';
import Modal from 'react-native-modalbox';
export default class AccountSet extends Component{
    render() {
        return(
            <SafeAreaView style={CommonStyle.flexCenter}>
                <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                    height: 40,
                    borderRadius: 4,
                    backgroundColor: '#ff5673',
                    marginTop: 30
                }]}
                onPress={() => {
                    this.refs.stop.open()
                }}
                >
                    <Text style={{color:'#fff'}}>停用账号</Text>
                </TouchableOpacity>
                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"stop"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height:180
                    }}>
                        <View style={[CommonStyle.flexCenter,{
                            height:50,
                            backgroundColor: '#fff',
                            borderBottomWidth: 1,
                            borderBottomColor: '#f5f5f5'
                        }]}>
                            <Text style={{color:'#999'}}>确定停用账号?</Text>
                        </View>
                        <TouchableOpacity
                            style={[CommonStyle.flexCenter,{
                                height: 60,
                                backgroundColor: '#fff'
                            }]}
                        >
                            <Text style={{color:'#333'}}>确定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[CommonStyle.flexCenter,{
                                height: 60,
                                backgroundColor: '#fff',
                                marginTop: 10
                            }]}
                        >
                            <Text style={{color:'#999'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

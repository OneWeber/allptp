import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView} from 'react-native';
import CommonStyle from '../../../../../../assets/css/Common_css';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window');
class VapplyDetail extends Component{
    constructor(props) {
        super(props);
        this.data = this.props.navigation.state.params.data
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative'}}>
                <SafeAreaView>
                    <View style={[CommonStyle.flexStart,{
                        height: 50
                    }]}>
                        <TouchableOpacity style={{
                            paddingLeft: width*0.03
                        }}
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
                    </View>
                </SafeAreaView>
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart]}>
                            <AntDesign
                                name={this.data.status===1?'checkcircle':'exclamationcircle'}
                                size={30}
                                style={{color:this.data.status===2?'#ee385b':this.props.theme}}
                            />
                            <Text style={{
                                marginLeft: 12,
                                fontSize:18,
                                fontWeight: 'bold',
                                color:'#333'
                            }}>
                                申请{this.data.status===0?'待处理':this.data.status===1?'已同意':'已谢绝'}
                            </Text>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        marginTop: 15,
                        paddingTop: 20,
                        paddingBottom: 20,
                        backgroundColor: '#fff'
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <View style={CommonStyle.flexStart}>
                                <LazyImage
                                    source={this.data.user&&this.data.user.headimage&&this.data.user.headimage.domain&&this.data.user.headimage.image_url?{
                                        uri:this.data.user.headimage.domain+this.data.user.headimage.image_url
                                    }:require('../../../../../../assets/images/touxiang.png')}
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 21
                                    }}
                                />
                                <View style={{
                                    marginLeft: 15
                                }}>
                                    {
                                        this.data.user
                                            ?
                                            <Text style={{
                                                color:'#333',
                                                fontWeight: 'bold'
                                            }}>
                                                {this.data.user.family_name?this.data.user.family_name+' ':''}
                                                {this.data.user.middle_name?this.data.user.middle_name+' ':''}
                                                {this.data.user.name?this.data.user.name+' ':''}
                                                (我)
                                            </Text>
                                            :
                                            <Text style={{
                                                color:'#333',
                                                fontWeight: 'bold'
                                            }}>我</Text>
                                    }
                                </View>
                            </View>
                            <View style={[CommonStyle.spaceRow,{
                                marginTop: 17.5
                            }]}>
                                <LazyImage
                                    source={this.data.activity&&this.data.activity.cover&&this.data.activity.cover.domain&&this.data.activity.cover.image_url?{
                                        uri: this.data.activity.cover.domain + this.data.activity.cover.image_url
                                    }:require('../../../../../../assets/images/error.png')}
                                    style={{
                                        width: 90,
                                        height: 60,
                                        borderRadius: 4
                                    }}
                                />
                                <View style={[CommonStyle.spaceCol,{
                                    height: 60,
                                    width: width*0.94-100,
                                    alignItems:'flex-start'
                                }]}>
                                    <Text
                                        numberOfLines={2} ellipsizeMode={'tail'}
                                        style={{
                                            color:'#333',
                                            fontWeight: 'bold'
                                        }}
                                    >{this.data.activity.title}</Text>
                                    <Text style={{color:'#333',fontSize: 13}}>¥{this.data.price}/人</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        marginTop:10,
                        backgroundColor: '#fff',
                        paddingTop: 15,
                        paddingBottom: 15
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>申请志愿时间</Text>
                            {
                                this.data.slot_id.map((item, index) => {
                                    return <View key={index} style={{
                                        marginTop: index===0?19:10
                                    }}>
                                        <Text style={{color:'#656565',fontSize: 13}}>
                                            {item.begin_time}至{item.end_time}
                                        </Text>
                                    </View>
                                })
                            }
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        marginTop:10,
                        backgroundColor: '#fff',
                        paddingTop: 15,
                        paddingBottom: 15
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>我的主要语言</Text>
                            <Text style={{
                                marginTop: 20,
                                color:'#666'
                            }}>{this.data.main_language===0?'中文':this.data.main_language===1?'English':'日本語'}</Text>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginTop: 25
                            }}>其他所会语言</Text>
                            <View style={[CommonStyle.flexStart,{
                                flexWrap: 'wrap',
                                marginTop: 10
                            }]}>
                                {
                                    this.data.language.map((item, index) => {
                                        return <View key={index} >
                                            <Text style={{
                                                color:'#666',
                                                marginTop: 10
                                            }}>{item===0?'中文':item===1?'English':'日本語'}</Text>
                                        </View>
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    <View style={[CommonStyle.flexCenter,{
                        marginTop:10,
                        backgroundColor: '#fff',
                        paddingTop: 15,
                        paddingBottom: 15
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>我的技能</Text>
                            <Text style={{
                                marginTop: 20,
                                color:'#666'
                            }}>{this.data.skill}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(VapplyDetail)

import React,{Component} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import Fetch from '../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../utils/NewHttp';
import CommonStyle from '../../../../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
const {width} = Dimensions.get('window');
export default class VapplyItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            applyList: []
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData(){
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        Fetch.post(NewHttp+'ErollL', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    applyList: res.data.data
                })
            }
        })
    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.flexCenter,CommonStyle.commonWidth,{
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor:'#fff',
            borderRadius: 6,
            marginTop: 10,
            marginLeft: width*0.03
        }]}
         onPress={()=>{
             NavigatorUtils.goPage({data:data.item}, 'VapplyDetail')
         }}
        >
            <View style={[CommonStyle.spaceRow,{
                width: '100%'
            }]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.user&&data.item.user.headimage&&data.item.user.headimage.domain&&data.item.user.headimage.image_url?{
                            uri:data.item.user.headimage.domain+data.item.user.headimage.image_url
                        }:require('../../../../../../assets/images/touxiang.png')}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20
                        }}
                    />
                    <View style={{
                        marginLeft: 9
                    }}>
                        {
                            data.item.user
                                ?
                                <Text style={{
                                    color:'#333',
                                    fontWeight: 'bold'
                                }}>
                                    {data.item.user.family_name?data.item.user.family_name+' ':''}
                                    {data.item.user.middle_name?data.item.user.middle_name+' ':''}
                                    {data.item.user.name?data.item.user.name+' ':''}
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
                <Text style={{
                    color:'#333',
                    fontWeight: 'bold'
                }}>
                    {data.item.status===0?'待处理':data.item.status===1?'已同意':'不合适'}
                </Text>
            </View>
            <View style={[CommonStyle.spaceRow,{
                marginTop: 15.5,
                width: '100%'
            }]}>
                <LazyImage
                    source={data.item.activity&&data.item.activity.cover&&data.item.activity.cover.domain&&data.item.activity.cover.image_url?{
                        uri: data.item.activity.cover.domain + data.item.activity.cover.image_url
                    }:require('../../../../../../assets/images/error.png')}
                    style={{
                        width: 90,
                        height: 70,
                        borderRadius: 4
                    }}
                />
                <View style={[CommonStyle.spaceCol,{
                    height: 70,
                    width: width*0.94-100-30,
                    alignItems:'flex-start'
                }]}>
                    <Text
                        numberOfLines={2} ellipsizeMode={'tail'}
                        style={{
                            color:'#333',
                            fontWeight: 'bold'
                        }}
                    >{data.item.activity.title}</Text>
                    <Text style={{color:'#333',fontSize: 13}}>¥{data.item.price}/人</Text>
                </View>
            </View>
            <View style={{
                marginTop: 19,
                width: '100%'
            }}>
                <Text style={{
                    color:this.props.theme,
                    fontSize: 12
                }}>申请志愿时间:</Text>
                {
                    data.item.slot_id.map((item, index) => {
                        return <Text key={index} style={{
                            color:this.props.theme,
                            fontSize: 12,
                            marginTop: 10
                        }}>
                            {item.begin_time}至{item.end_time}
                        </Text>
                    })
                }
            </View>
        </TouchableOpacity>
    }
    render(){
        const {applyList} = this.state;
        return(
            <View style={{flex: 1}}>
                {
                    applyList&&applyList.length>0
                    ?
                        <FlatList
                            data={applyList}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <Text style={{color:'#999'}}>暂无数据</Text>
                        </View>
                }
            </View>
        )
    }
}

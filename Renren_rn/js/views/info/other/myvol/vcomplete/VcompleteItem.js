import React,{Component} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import Fetch from '../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../utils/NewHttp';
import CommonStyle from '../../../../../../assets/css/Common_css';
import NoData from '../../../../../common/NoData';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window');
export default class VcompleteItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            comList: []
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        Fetch.post(NewHttp+'CompleteMy', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    comList: res.data.data
                })
            }
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.flexCenter,CommonStyle.commonWidth,{
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor:'#fff',
            borderRadius: 6,
            marginTop: 10,
            marginLeft: width*0.03
        }]}
        >
            <View style={[CommonStyle.spaceRow,{
                width: '100%'
            }]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.head_domain&&data.item.head_image_url?{
                            uri:data.item.head_domain+data.item.head_image_url
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
                        <Text style={{
                            color:'#333',
                            fontWeight: 'bold'
                        }}>
                            {data.item.family_name?data.item.family_name+' ':''}
                            {data.item.middle_name?data.item.middle_name+' ':''}
                            {data.item.name?data.item.name+' ':''}
                        </Text>
                    </View>
                </View>
                <Text style={{
                    color:'#333',
                    fontWeight: 'bold'
                }}>
                    已完成
                </Text>
            </View>
            <View style={[CommonStyle.spaceRow,{
                marginTop: 15.5,
                width: '100%'
            }]}>
                <LazyImage
                    source={data.item.act_domian&&data.item.act_image_url?{
                        uri: data.item.act_domian + data.item.act_image_url
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
                    >{data.item.title}</Text>
                    <Text style={{color:'#333',fontSize: 13}}>¥{data.item.price}/人</Text>
                </View>
            </View>
            <View style={{
                marginTop: 19,
                width: '100%'
            }}>
                <Text style={{
                    color:'#656565',
                    fontSize: 12
                }}>志愿时间: {data.item.begin_time} -- {data.item.end_time}</Text>
            </View>
        </View>
    }
    render(){
        const {comList} = this.state;
        return(
            <View style={{flex: 1}}>
                {
                    comList.length>0
                    ?
                        <FlatList
                            data={comList}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                            <NoData />
                        </View>
                }
            </View>
        )
    }
}

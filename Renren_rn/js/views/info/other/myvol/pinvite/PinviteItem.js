import React, {Component} from 'react';
import {StyleSheet, View, Text, RefreshControl, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import NewHttp from '../../../../../utils/NewHttp';
import NoData from '../../../../../common/NoData';
import CommonStyle from '../../../../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
const {width} = Dimensions.get('window');
export default class PinviteItem extends Component{
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const {onLoadPInvite} = this.props;
        let formData = new FormData();
        this.storeName = this.props.tabLabel;
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', this.props.index);
        onLoadPInvite(this.storeName, NewHttp+'InviteL', formData)
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
            NavigatorUtils.goPage({
                data: data.item,
                storeName: this.storeName
            }, 'PinviteDetail')
        }}
        >
            <View style={[CommonStyle.spaceRow,{
                width: '100%'
            }]}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.invuser&&data.item.invuser.headimage&&data.item.invuser.headimage.domain&&data.item.invuser.headimage.image_url?{
                            uri:data.item.invuser.headimage.domain+data.item.invuser.headimage.image_url
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
                            data.item.invuser
                            ?
                                <Text style={{
                                    color:'#333',
                                    fontWeight: 'bold'
                                }}>
                                    {data.item.invuser.family_name?data.item.invuser.family_name+' ':''}
                                    {data.item.invuser.middle_name?data.item.invuser.middle_name+' ':''}
                                    {data.item.invuser.name?data.item.invuser.name+' ':''}
                                </Text>
                            :
                                <Text style={{
                                    color:'#333',
                                    fontWeight: 'bold'
                                }}>匿名用户</Text>
                        }
                    </View>
                </View>
                <Text style={{
                    color:'#333',
                    fontWeight: 'bold'
                }}>{this.props.tabLabel}</Text>
            </View>
            <View style={[CommonStyle.spaceRow,{
                marginTop: 15.5,
                width: '100%'
            }]}>
                <LazyImage
                    source={data.item.cover&&data.item.cover.domain&&data.item.cover.image_url?{
                        uri: data.item.cover.domain + data.item.cover.image_url
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
                    color:this.props.theme,
                    fontSize: 12
                }}>邀请志愿时间:</Text>
                {
                    data.item.slot.map((item, index) => {
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
        const {pinvite} = this.props;
        let store = pinvite[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1}}>
                {
                    store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                    ?
                        <FlatList
                            data={store.items.data.data.data}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={{flex: 1}}>
                            <NoData/>
                        </View>
                }
            </View>
        )
    }
}

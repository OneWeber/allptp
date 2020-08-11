import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('window');
export default class UserCollection extends Component{
    constructor(props) {
        super(props);
        this.collect_group = this.props.navigation.state.params.collect_group;
    }
    renderItem(data) {
        return <View>
            {
                data.item.hide
                ?
                    null
                :
                    <View style={[CommonStyle.commonWidth,{
                        marginLeft: width*0.03
                    }]}>
                        <LazyImage
                            source={data.item.cover&&data.item.cover.domain&&data.item.cover.image_url?{
                                uri: data.item.cover.domain+ data.item.cover.image_url
                            }:require('../../../../assets/images/error.png')}
                            style={{
                                width: '100%',
                                height: 150,
                                borderRadius: 5,
                                marginTop: data.index=== 0?0:20
                            }}
                        />
                        <Text style={{
                            color:'#333',
                            marginTop: 10
                        }}>{data.item.group_name}</Text>
                    </View>
            }
        </View>
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
    render() {
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'收藏夹'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    this.collect_group.length > 0
                    ?
                        <FlatList
                            data={this.collect_group}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <Text style={{color: '#999'}}>暂无数据</Text>
                        </View>

                }
            </View>
        )
    }
}

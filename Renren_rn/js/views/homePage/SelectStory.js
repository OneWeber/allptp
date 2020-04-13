import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity, Image} from 'react-native'
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../action'
import HttpUrl from '../../utils/Http';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../navigator/NavigatorUtils';
const {width, height } = Dimensions.get('window')
class SelectStory extends Component{
    componentDidMount() {
        this.loadData()
    }
    loadData(){
        const {token, onLoadSelectStory} = this.props
        this.storeName='selectstory'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort',2);
        formData.append('page',1);
        formData.append('kind_id','');
        formData.append('country','');
        formData.append('province','');
        formData.append('city','');
        formData.append('region','');
        onLoadSelectStory(this.storeName, HttpUrl + 'Story/story_list', formData)
    }
    _renderSelectStory(data){
        const {selectstory} = this.props
        let store = selectstory[this.storeName]
        return <TouchableOpacity style={{
            width: width*0.94*0.95,
            marginLeft:data.index===0?width*0.03:15,
            marginRight:data.index===store.items.data.data.data.length-1?width*0.03:0
        }} onPress={()=>{
            NavigatorUtils.goPage({story_id: data.item.story_id}, 'StoryDetail')
        }}>
            <LazyImage
                source={{uri:data.item.cover.domain + data.item.cover.image_url}}
                style={{width: '100%',height:205,borderRadius: 4}}
            />
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.common_color,styles.common_weight,{
                marginTop: 10,
                fontSize: 16
            }]}>{data.item.title}</Text>
            <Text numberOfLines={2} ellipsizeMode={'tail'} style={[styles.common_color,{
                lineHeight: 20,
                marginTop: 8,
            }]}>
                {data.item.content}
            </Text>
            <View style={[CommonStyle.spaceRow,{marginTop: 13.5}]}>
                <View style={[CommonStyle.flexStart]}>
                    <TouchableOpacity style={[CommonStyle.flexStart]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.praise_num}</Text>
                        <Image source={require('../../../assets/images/home/xqdz.png')} style={{
                            width:11,
                            height:13,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexStart,{marginLeft: 24}]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.leaving_num}</Text>
                        <Image source={require('../../../assets/images/home/pinglun.png')} style={{
                            width:14,
                            height:14,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                </View>
                <LazyImage
                    source={{uri: data.item.user.headimage.domain + data.item.user.headimage.image_url}}
                    style={{width:30,height:30,borderRadius: 15}}
                />
            </View>
        </TouchableOpacity>
    }
    render(){
        const {selectstory} = this.props
        let store = selectstory[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={[CommonStyle.flexCenter,{width: '100%'}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={[this.props.styles.component_title,
                        styles.common_color,
                        styles.common_weight,
                    ]}>
                        精选体验故事
                    </Text>
                    <Text style={{color:'#333',fontSize:15,marginTop:8}}>关于体验的随心随记</Text>
                </View>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View style={{width: '100%',marginTop: 23}}>
                            <FlatList
                                data={store.items.data.data.data}
                                horizontal={true}
                                renderItem={(data)=>this._renderSelectStory(data)}
                                showsHorizontalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    :
                        null
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
})
const mapStateToProps = state => ({
    token: state.token.token,
    selectstory: state.selectstory
})
const mapDispatchToProps = dispatch => ({
    onLoadSelectStory: (storeName, url, data) => dispatch(action.onLoadSelectStory(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(SelectStory)

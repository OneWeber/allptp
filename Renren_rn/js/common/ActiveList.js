import React,{Component} from 'react';
import {StyleSheet, View, Text, FlatList,TouchableOpacity, Dimensions} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../assets/css/Common_css';
import NavigatorUtils from '../navigator/NavigatorUtils';
const {width, height} = Dimensions.get('window')
export default class ActiveList extends Component{
    goDetail(table_id){
        const {goType} = this.props
        NavigatorUtils.goPage({table_id:table_id}, 'ActiveDetail', goType)
    }
    _renderActivty(data){
        return <TouchableOpacity
            style={[styles.active_item, {marginLeft:data.index%2==0?0:10}]}
            onPress={()=>this.goDetail(data.item.activity_id)}
        >
            <LazyImage
                source={data.item.domain && data.item.image_url?{uri:data.item.domain + data.item.image_url}:
                require('../../assets/images/error.png')}
                style={styles.active_img}
            />
            <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.active_title}
            >{data.item.title}</Text>
            <View style={[CommonStyle.spaceRow,{marginTop: 5}]}>
                {
                    data.item.price==null || data.item.price=='null' || data.item.price==''
                        ?
                        <Text style={[styles.active_txt,{color:'#999'}]}>暂已过期<Text style={{color:'#fff'}}>/</Text></Text>
                        :
                        <Text style={[styles.active_txt,{color:'#ff5673'}]}>{data.item.price} ¥/人</Text>
                }
            </View>

        </TouchableOpacity>
    }
    render(){
        const {data, limit} = this.props
        return(
            <View>
                <FlatList
                    data={limit?data.slice(0, limit):data}
                    horizontal={false}
                    numColumns={2}
                    renderItem={(data)=>this._renderActivty(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    active_item: {
        width:(width*0.94-10)/2,
        backgroundColor:'#fff',
        borderRadius:3,
        overflow:'hidden',
        marginTop: 10
    },
    active_img:{
        width:'100%',
        height:120,
        borderRadius: 3
    },
    active_title:{
        color:'#333333',
        marginTop:7,
        fontWeight:'bold'
    },
    active_txt:{
        fontSize:12,
        fontWeight:'bold'
    }
})

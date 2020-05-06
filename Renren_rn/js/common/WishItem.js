import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import NavigatorUtils from '../navigator/NavigatorUtils';
const widthScreen = Dimensions.get('window').width;
class WishItem extends Component{
    goWishDetail(group_id, group_name, hidden){
        NavigatorUtils.goPage({group_id: group_id, group_name: group_name, hidden: hidden}, 'WishDetail')
    }
    render(){
        const {data_w,data_index,theme,language} = this.props
        return(
            <TouchableOpacity
                style={[CommonStyle.commonWidth,styles.wish_item,{marginTop:data_index==0?15:20,marginBottom: 10}]}
                underlayColor='rgba(0,0,0,0)'
                onPress={()=>this.goWishDetail(data_w.group_id, data_w.group_name, data_w.hide)}
            >
                <View style={{position:'relative'}}>
                    <LazyImage
                        source={data_w.cover&&data_w.cover.domain?
                            {uri:data_w.cover.domain + data_w.cover.image_url}
                            :require('../../assets/images/error.png')
                        }
                        style={styles.wish_img}
                    />
                    {
                        data_w.hide!=0
                            ?
                            <MaterialIcons
                                name={'lock'}
                                size={16}
                                style={{
                                    color:'#fff',
                                    position:'absolute',
                                    top:10,
                                    right:10
                                }}
                            />
                            :
                            null
                    }
                </View>
                <View style={[styles.w_item_con,CommonStyle.flexStart,{alignItems:'flex-start',marginTop:17}]}>
                    <Text
                        numberOfLines={2} ellipsizeMode={'tail'}
                        style={styles.group_name}
                    >
                        {data_w.group_name}
                    </Text>
                    <Text style={{color:'#333',fontSize: 15,marginLeft: 19}}>{
                        data_w.count
                            ?
                            data_w.count+ (language===1?' 个收藏':language===2?' collections':' つのコレクション')
                            :
                            null
                    }</Text>

                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    wish_item: {
        backgroundColor: '#fff',
        borderRadius: 3
    },
    wish_img:{
        width:'100%',
        height:180,
        borderRadius: 5
    },
    w_item_con:{
        width:widthScreen*0.94-130-10,
    },
    group_name:{
        fontWeight:'bold',
        color:'#333',
        fontSize: 15
    },
    type_title:{
        fontSize: 12,
        color:'#999'
    },
    leftSwipeItem:{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    leftSwiperText:{
        color:'#fff',
        fontWeight: "bold"
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(WishItem)

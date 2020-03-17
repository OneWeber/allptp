import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import NavigatorUtils from '../navigator/NavigatorUtils';
const widthScreen = Dimensions.get('window').width;
class WishItem extends Component{
    doWish(){
        this.props.showModal()
    }
    goWishDetail(group_id, group_name){
        NavigatorUtils.goPage({group_id: group_id, group_name: group_name}, 'WishDetail')
    }
    render(){
        const {data_w,data_index,theme} = this.props
        return(
            <TouchableOpacity
                style={[CommonStyle.commonWidth,styles.wish_item,CommonStyle.spaceRow,{marginTop:data_index==0?15:5}]}
                underlayColor='rgba(0,0,0,0)'
                onLongPress={()=>this.doWish()}
                onPress={()=>this.goWishDetail(data_w.group_id, data_w.group_name)}
            >
                <LazyImage
                    source={data_w.cover&&data_w.cover.domain?
                        {uri:data_w.cover.domain + data_w.cover.image_url}
                        :require('../../assets/images/error.jpeg')
                    }
                    style={styles.wish_img}
                />
                <View style={[styles.w_item_con,CommonStyle.spaceCol,{alignItems:'flex-start'}]}>
                    <Text
                        numberOfLines={2} ellipsizeMode={'tail'}
                        style={styles.group_name}
                    >
                        {data_w.group_name}
                    </Text>
                    <View style={[CommonStyle.spaceRow,{width: '100%'}]}>
                        <Text style={styles.type_title}>
                            {data_w.hidden===0?'共享心愿单':'私密心愿单'}
                        </Text>
                        {
                            data_w.hidden==0
                            ?
                                <MaterialIcons
                                    name={'donut-large'}
                                    size={16}
                                    style={{color:theme}}
                                />
                            :
                                <MaterialIcons
                                    name={'lock'}
                                    size={16}
                                    style={{color:'#999'}}
                                />
                        }

                    </View>

                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    wish_item: {
        backgroundColor: '#fff',
        marginVertical: 3,
        padding: 10,
        elevation: 2,
        borderRadius: 3
    },
    wish_img:{
        width:110,
        height:80,
        borderRadius: 3
    },
    w_item_con:{
        width:widthScreen*0.94-130-10,
        height:80
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

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../assets/css/Common_css';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign'
const {width, height} = Dimensions.get('window')
export default class ActiveItem extends Component{
    constructor(props) {
        super(props);
    }
    goDetail(table_id){
        NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
    }
    formatDate(now) {
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    }
    render(){
        const {data_a, data_index, theme, isComming} = this.props
        let data = data_a
        return(
            <TouchableOpacity style={[{
                width:this.props.history?164:(width*0.94-14) / 2,
                marginLeft: data_index%2===0?width*0.03: 14,
                marginTop: 25
            },this.props.style]}
            onPress={() => {this.goDetail(data_a.activity_id || data_a.activity_id==0?data_a.activity_id:data_a.table_id)}}
            >
                <View style={[styles.cityitem_img,{position:'relative'}]}>
                    <LazyImage
                        source={{uri: data.domain + data.image_url}}
                        style={styles.cityitem_img}
                    />
                    {
                        isComming
                        ?
                            <View style={{
                                position: 'absolute',
                                left:5,
                                top:5,
                                padding: 3,
                                backgroundColor:'rgba(0,0,0,.5)',
                                borderRadius: 3
                            }}>
                                <Text style={{fontSize: 10,color:'#fff'}}>即将开始{this.formatDate(new Date(data.begin_time)).split(' ')[1]}</Text>
                            </View>
                        :
                            null
                    }

                </View>
                {
                    data.region
                    ?
                        <Text style={[styles.common_weight,{
                            color:'#127D80',
                            fontSize: 10,
                            marginTop: 5.5
                        }]}>{data.region}</Text>
                    :
                        null
                }
                <Text numberOfLines={2} ellipsizeMode={'tail'}
                      style={[styles.common_weight,styles.common_color,{
                          marginTop: 4.5,
                          marginBottom: 5
                      }]}>{data.title}</Text>
                <View style={[CommonStyle.flexStart,{flexWrap:'wrap'}]}>
                    {
                        data.price_discount_concat&&data.price_discount_concat.split(',').length>1
                        ?
                            <View style={[styles.tab_item,{

                            }]}>
                                <Text style={{
                                    fontSize: 10,
                                    color:theme
                                }}>{parseFloat(data.price_discount_concat.split(',')[1])}折起</Text>
                            </View>
                        :
                            null
                    }
                    {
                        data.is_differ
                        ?
                            <View style={[styles.tab_item,{
                                backgroundColor:'#F5F6F8',
                            }]}>
                                <Text style={{
                                    fontSize: 10,
                                    color:'#626467'
                                }}>返差价</Text>
                            </View>
                        :
                            null
                    }
                    {
                        data.is_combine
                            ?
                            <View style={[styles.tab_item,{
                                backgroundColor:'#F5F6F8',
                            }]}>
                                <Text style={{
                                    fontSize: 10,
                                    color:'#626467'
                                }}>含套餐</Text>
                            </View>
                            :
                            null
                    }
                </View>
                <View style={[CommonStyle.flexStart,{marginTop: 8}]}>

                    <AntDesign
                        name={'star'}
                        size={10}
                        style={{color:this.props.theme}}
                    />
                    <Text style={[{
                        fontSize:11,marginLeft:3,
                        color:parseFloat(data.score)>0?'#333':'#626467',
                        fontWeight:parseFloat(data.score)>0?'bold':'normal',
                    }]}>{parseFloat(data.score)>0?data.score:'暂无评分'}</Text>
                    <Text style={[{color:'#626467',fontSize: 11,marginLeft: 10}]}>
                        {
                            data.comment_num
                                ?
                                data.comment_num + '点评'
                                :
                                '暂无点评'
                        }
                    </Text>
                </View>
                {
                    data.price
                        ?
                        <Text style={[styles.common_color,styles.common_weight,{marginTop: 8}]}>
                            ¥{data.price}<Text style={{fontSize: 11,color:'#626467',fontWeight: "normal"}}>/人起</Text>
                        </Text>
                        :
                        <Text style={[{marginTop: 10,color:'#626467',fontSize: 11}]}>
                            暂未定价或时间
                        </Text>
                }
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    tab_item:{
        padding: 3,
        marginRight: 15
    },
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    cityitem_img:{
        width: '100%',
        height: 126,
        borderRadius: 3
    },
})

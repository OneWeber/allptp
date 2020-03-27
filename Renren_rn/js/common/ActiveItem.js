import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../assets/css/Common_css';
import NavigatorUtils from '../navigator/NavigatorUtils';
const {width, height} = Dimensions.get('window')
export default class ActiveItem extends Component{
    constructor(props) {
        super(props);
        this.tabs=['3折起','返差价','多套餐']
    }
    goDetail(table_id){
        NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
    }
    render(){
        const {data_a, data_index, theme} = this.props
        let data = data_a
        return(
            <TouchableOpacity style={[{
                width:this.props.history?164:(width*0.94-14) / 2,
                marginLeft: data_index%2===0?width*0.03: 14,
                marginTop: 25
            },this.props.style]}
            onPress={() => {this.goDetail(data_a.activity_id)}}
            >
                <LazyImage
                    source={{uri: data.domain + data.image_url}}
                    style={styles.cityitem_img}
                />
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
                          marginTop: 4.5
                      }]}>{data.title}</Text>
                <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 5}]}>
                    {this.tabs.map((item, index) => {
                        return <View key={index} style={[styles.tab_item,{
                            backgroundColor:index===0?'#EEFFFF':'#F5F6F8',
                            marginTop: 5
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:index===0?theme:'#626467'
                            }}>{item}</Text>
                        </View>
                    })}
                </View>
                <View style={[CommonStyle.flexStart,{marginTop: 8}]}>
                    <Image
                        source={parseFloat(data.score)>0?
                            require('../../assets/images/home/pingxing.png'):
                            require('../../assets/images/home/wpx.png')}
                        style={{width: 10,height:9.5}}
                    />
                    <Text style={[{
                        fontSize:11,marginLeft:3,
                        color:parseFloat(data.score)>0?'#333':'#626467',
                        fontWeight:parseFloat(data.score)>0?'bold':'normal',
                    }]}>{parseFloat(data.score)>0?data.score:'暂无评分'}</Text>
                    <Text style={[{color:'#626467',fontSize: 11,marginLeft: 10}]}>
                        {
                            data.leaving_num
                                ?
                                data.leaving_num + '点评'
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

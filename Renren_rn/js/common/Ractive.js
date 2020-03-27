import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux'
class Ractive extends Component{
    constructor(props) {
        super(props);
        this.tabs=['3折起','返差价','多套餐']
    }
    render(){
        const {data_r, data_index, theme} = this.props
        return(
            <TouchableOpacity style={[CommonStyle.commonWidth,{marginTop: data_index===0?0:30}]}>
                <LazyImage
                    source={data_r.url}
                    style={[CommonStyle.commonWidth,{
                        height: 180,
                        borderRadius: 4,
                    }]}
                />
                <Text style={[styles.common_weight,{
                    color:'#127D80',
                    fontSize: 10,
                    marginTop: 9.5
                }]}>{data_r.province}{data_r.city==='直辖市'?null:data_r.city}{data_r.region}</Text>
                <Text numberOfLines={2} ellipsizeMode={'tail'}
                      style={[styles.common_weight,styles.common_color,{
                          marginTop: 8,
                          fontSize:16
                      }]}>{data_r.title}</Text>
                <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 5}]}>
                    {this.tabs.map((item, index) => {
                        return <View key={index} style={[styles.tab_item,{
                            backgroundColor:index===0?'#EEFFFF':'#F5F6F8',
                            marginTop: 10
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:index===0?theme:'#626467'
                            }}>{item}</Text>
                        </View>
                    })}
                </View>
                <View style={[CommonStyle.spaceRow,{marginTop: 5}]}>
                    <View style={[CommonStyle.spaceCol,{height: 40,alignItems:'flex-start'}]}>
                        <View style={[CommonStyle.flexStart]}>
                            <Image
                                source={parseFloat(data_r.score)>0?
                                    require('../../assets/images/home/pingxing.png'):
                                    require('../../assets/images/home/wpx.png')}
                                style={{width: 10,height:9.5}}
                            />
                            <Text style={[{
                                fontSize:11,marginLeft:3,
                                color:parseFloat(data_r.score)>0?'#333':'#626467',
                                fontWeight:parseFloat(data_r.score)>0?'bold':'normal',
                            }]}>{parseFloat(data_r.score)>0?data_r.score:'暂无评分'}</Text>
                            <Text style={[{color:'#626467',fontSize: 11,marginLeft: 10}]}>
                                {
                                    data_r.leaving_num
                                        ?
                                        data_r.leaving_num + '点评'
                                        :
                                        '暂无点评'
                                }
                            </Text>
                        </View>
                        <View>
                            {
                                data_r.price
                                    ?
                                    <Text style={[styles.common_color,styles.common_weight]}>
                                        ¥{data_r.price}<Text style={{fontSize: 11,color:'#626467',fontWeight: "normal"}}>/人起</Text>
                                    </Text>
                                    :
                                    <Text style={[{marginTop: 10,color:'#626467',fontSize: 11}]}>
                                        暂未定价或时间
                                    </Text>
                            }
                        </View>
                    </View>
                    <LazyImage
                        source={data_r.headimage}
                        style={{width: 40,height:40,borderRadius: 20}}
                    />
                </View>

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
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Ractive)

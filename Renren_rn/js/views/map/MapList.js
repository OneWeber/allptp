import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window')
export default class MapList extends Component{
    constructor(props) {
        super(props);
        this.tabs=['3折起','返差价','多套餐']
    }
    _renderActivty(data) {
        const {theme} = this.props
        return <TouchableOpacity style={{
            width: (width*0.94-14) / 2,
            marginLeft: data.index%2===0?0: 14,
            marginTop: data.index===1||2?15:25
        }}>
            <LazyImage
                source={{uri: data.item.domain + data.item.image_url}}
                style={styles.cityitem_img}
            />
            {
                data.item.region
                    ?
                    <Text style={[styles.common_weight,{
                        color:'#127D80',
                        fontSize: 10,
                        marginTop: 5.5
                    }]}>{data.item.region}</Text>
                    :
                    null
            }
            <Text numberOfLines={2} ellipsizeMode={'tail'}
                  style={[styles.common_weight,styles.common_color,{
                      marginTop: 4.5
                  }]}>{data.item.title}</Text>
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
                    source={parseFloat(data.item.score)>0?
                        require('../../../assets/images/home/pingxing.png'):
                        require('../../../assets/images/home/wpx.png')}
                    style={{width: 10,height:9.5}}
                />
                <Text style={[{
                    fontSize:11,marginLeft:3,
                    color:parseFloat(data.item.score)>0?'#333':'#626467',
                    fontWeight:parseFloat(data.item.score)>0?'bold':'normal',
                }]}>{parseFloat(data.score)>0?data.item.score:'暂无评分'}</Text>
                <Text style={[{color:'#626467',fontSize: 11,marginLeft: 10}]}>
                    {
                        data.item.leaving_num
                            ?
                            data.item.leaving_num + '点评'
                            :
                            '暂无点评'
                    }
                </Text>
            </View>
            {
                data.item.price
                    ?
                    <Text style={[styles.common_color,styles.common_weight,{marginTop: 8}]}>
                        ¥{data.item.price}<Text style={{fontSize: 11,color:'#626467',fontWeight: "normal"}}>/人起</Text>
                    </Text>
                    :
                    <Text style={[{marginTop: 10,color:'#626467',fontSize: 11}]}>
                        暂未定价或时间
                    </Text>
            }
        </TouchableOpacity>
    }
    render(){
        const {activityList} = this.props
        return(
            <ScrollView>
                <View style={CommonStyle.flexCenter}>
                    <View style={CommonStyle.commonWidth}>
                        <FlatList
                            data={activityList}
                            horizontal={false}
                            numColumns={2}
                            renderItem={(data)=>this._renderActivty(data)}
                            showsHorizontalScrollIndicator = {false}
                            showsVerticalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </ScrollView>

        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    cityitem_img:{
        width: '100%',
        height: 126,
        borderRadius: 3
    },
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    tab_item:{
        padding: 3,
        marginRight: 15
    },
    screen_title:{
        color:'#333',
        fontSize: 13,
        marginTop: 20,
        fontWeight: "bold"
    },
    addRoll:{
        width: 34,
        height:34,
        borderRadius: 17,
        borderWidth: 1
    }
})

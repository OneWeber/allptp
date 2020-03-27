import React,{Component} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native'
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window')
export default class Preference extends Component{
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{width:'100%'}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={[this.props.styles.component_title,
                        styles.common_color,
                        styles.common_weight,
                        ]}>
                        特惠体验
                    </Text>
                    <Text style={{color:'#333',fontSize:15,marginTop:8}}>超值特价优惠体验</Text>
                    <View style={[CommonStyle.spaceRow,{marginTop: 24.5}]}>
                        <View style={styles.left_con}>
                            <LazyImage
                                source={require('../../../assets/images/ssmz.jpeg')}
                                style={styles.left_con}
                            />
                            <View style={styles.con_shadow}>
                                <Text style={styles.shadow_txt}>节假日特价</Text>
                            </View>
                        </View>
                        <View style={[styles.left_con, CommonStyle.spaceCol]}>
                            <View style={styles.right_con}>
                                <LazyImage
                                    source={require('../../../assets/images/bg.jpeg')}
                                    style={styles.right_con}
                                />
                                <View style={styles.con_shadow}>
                                    <Text style={styles.shadow_txt}>低至3折</Text>
                                </View>
                            </View>
                            <View style={[styles.right_con,{marginTop: 10}]}>
                                <LazyImage
                                    source={require('../../../assets/images/timg.jpeg')}
                                    style={styles.right_con}
                                />
                                <View style={styles.con_shadow}>
                                    <Text style={styles.shadow_txt}>低至5折</Text>
                                </View>
                            </View>
                        </View>


                    </View>

                </View>
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
    left_con:{
        width:(width*0.94 -10) / 2,
        height: 190,
        borderRadius: 3,
        position:'relative',
        overflow:'hidden'
    },
    right_con:{
        width:'100%',
        height: 90,
        borderRadius: 3,
        position:'relative',
        overflow:'hidden'
    },
    con_shadow:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        backgroundColor:'rgba(0,0,0,.2)'
    },
    shadow_txt:{
        color:'#fff',
        fontWeight: "bold",
        fontSize: 12,
        margin: 10
    }
})

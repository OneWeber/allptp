import React,{Component} from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import languageType from '../../json/languageType'
import {connect} from 'react-redux';
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import {removeDuplicatedItem} from '../../utils/auth'
const {width, height} = Dimensions.get('window')
class Preference extends Component{
    constructor(props) {
        super(props);
        this.state = {
            discount: []
        }
    }
    goPreferential(val){
        NavigatorUtils.goPage({initPage:val}, 'Preferential')
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0')
        Fetch.post(NewHttp+'DiscountTwo', formData).then(res => {
            if(res.code === 1) {
                let data = res.data;
                let disData = this.state.discount;
                for(let i=0;i<data.length;i++){
                    disData.push(parseFloat(data[i].price_discount))
                }
                disData = removeDuplicatedItem(disData)
                this.setState({
                    discount: disData.sort()
                })
            }
        })
    }
    render(){
        const {language} = this.props;
        const {discount} = this.state;
        return(
            <View style={[CommonStyle.flexCenter,{width:'100%'}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={[this.props.styles.component_title,
                        styles.common_color,
                        styles.common_weight,
                        ]}>
                        {
                            language===1?languageType.CH.home.special:language===2?languageType.EN.home.special:languageType.JA.home.special
                        }
                    </Text>
                    <Text style={{color:'#333',fontSize:15,marginTop:8}}>
                        {
                            language===1?languageType.CH.home.special_propmt:language===2?languageType.EN.home.special_propmt:languageType.JA.home.special_propmt
                        }
                    </Text>
                    {
                        discount.length===1
                        ?
                            <TouchableOpacity
                                style={[{marginTop: 24.5,height:190,borderRadius: 5,position:'relative'}]}
                                onPress={()=>{this.goPreferential(0)}}
                            >
                                <LazyImage
                                    source={require('../../../assets/images/ssmz.jpeg')}
                                    style={{height:190,borderRadius: 5,width:'100%'}}
                                />
                                <View style={styles.con_shadow}>
                                    <Text style={styles.shadow_txt}>低至{discount[0]}折</Text>
                                </View>
                            </TouchableOpacity>
                        :
                        discount.length===2
                        ?
                            <View style={[CommonStyle.spaceRow,{marginTop: 24.5}]}>
                                <TouchableOpacity
                                    style={styles.left_con}
                                    onPress={()=>{this.goPreferential(0)}}
                                >
                                    <LazyImage
                                        source={require('../../../assets/images/ssmz.jpeg')}
                                        style={styles.left_con}
                                    />
                                    <View style={styles.con_shadow}>
                                        <Text style={styles.shadow_txt}>低至{discount[0]}折</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.left_con}
                                    onPress={()=>{this.goPreferential(1)}}
                                >
                                    <LazyImage
                                        source={require('../../../assets/images/bg.jpeg')}
                                        style={styles.left_con}
                                    />
                                    <View style={styles.con_shadow}>
                                        <Text style={styles.shadow_txt}>低至{discount[1]}折</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        :
                            <View style={[CommonStyle.spaceRow,{marginTop: 24.5}]}>
                                <TouchableOpacity
                                    style={styles.left_con}
                                    onPress={()=>{this.goPreferential(0)}}
                                >
                                    <LazyImage
                                        source={require('../../../assets/images/ssmz.jpeg')}
                                        style={styles.left_con}
                                    />
                                    <View style={styles.con_shadow}>
                                        <Text style={styles.shadow_txt}>低至{discount[0]}折</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.left_con, CommonStyle.spaceCol]}>
                                    <TouchableOpacity
                                        style={styles.right_con}
                                        onPress={()=>{this.goPreferential(1)}}
                                    >
                                        <LazyImage
                                            source={require('../../../assets/images/bg.jpeg')}
                                            style={styles.right_con}
                                        />
                                        <View style={styles.con_shadow}>
                                            <Text style={styles.shadow_txt}>低至{discount[discount.length/2]}折</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.right_con,{marginTop: 10}]}
                                        onPress={()=>{this.goPreferential(2)}}
                                    >
                                        <LazyImage
                                            source={require('../../../assets/images/timg.jpeg')}
                                            style={styles.right_con}
                                        />
                                        <View style={styles.con_shadow}>
                                            <Text style={styles.shadow_txt}>低至{discount[discount.length-1]}折</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>


                            </View>
                    }
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
});
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Preference)

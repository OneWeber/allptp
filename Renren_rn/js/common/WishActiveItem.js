import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import CommonStyle from '../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import {connect} from 'react-redux';
class WishActiveItem extends Component{
    render() {
        const {data_w, data_index, theme} = this.props
        return (
            <TouchableOpacity style={[styles.wish_active_item, CommonStyle.commonWidth,{marginTop:data_index===0?15:10}]}>
                <LazyImage
                    source={data_w.domain && data_w.image_url ?
                        {uri:data_w.domain + data_w.image_url}
                    :require('../../assets/images/error.jpeg')}
                    style={styles.wish_img}
                />
                <View style={{padding: 5}}>
                    {
                        data_w.kind.map((item, index) => {
                            return <Text key={index} style={[styles.type_txt, {color: theme}]}>{item.kind_name}</Text>
                        })
                    }
                    <Text style={styles.act_title}>{data_w.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    wish_active_item: {
        backgroundColor: '#fff',
        marginVertical: 3,
        paddingBottom: 5,
        elevation: 2,
        borderRadius: 3,
        borderColor: '#ddd',
        borderWidth: 0.5,
        shadowColor:'gray',
        shadowOffset:{width:0.5, height:0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        margin: 5
    },
    wish_img:{
        width:'100%',
        height:130,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    type_txt:{
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 5,
        lineHeight: 20
    },
    act_title:{
        marginTop: 5,
        fontWeight: "bold",
        color: '#333',
        fontSize: 14
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(WishActiveItem)

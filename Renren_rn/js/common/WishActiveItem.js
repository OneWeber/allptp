import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import {connect} from 'react-redux';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modalbox';
import Fetch from '../expand/dao/Fetch';
import HttpUrl from '../utils/Http';
const {width, height} = Dimensions.get('window')
class WishActiveItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            flag: '',
            table_id: ''
        }
    }
    goDetail(tabLabel, table_id){
        if(tabLabel === '体验'){
            NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
            return
        }
        NavigatorUtils.goPage({story_id: table_id}, 'StoryDetail')
    }
    cancelCollection(flag, table_id) {
        this.setState({
            flag: flag,
            table_id: table_id
        },()=>{
            this.refs.delColle.open()
        })
    }
    delCollection() {
        const {group_id, token} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('group_id', group_id);
        formData.append('table_id', this.state.table_id);
        formData.append('flag', this.state.flag);
        formData.append('type', 2);
        Fetch.post(HttpUrl+'Comment/collection', formData).then(res => {
            if(res.code === 1) {
                this.refs.delColle.close()
                this.props.initWish()
            }
        })
    }
    render() {
        const {data_w, data_index, theme, tabLabel} = this.props
        return (
            <View>
                <TouchableOpacity
                    style={[styles.wish_active_item,{
                        marginTop:20,
                        marginLeft: data_index%2===0?width*0.03:14
                    }]}
                    onPress={() => {this.goDetail(tabLabel, data_w.table_id)}}
                >
                    <View style={{position:'relative'}}>
                        <LazyImage
                            source={data_w.domain && data_w.image_url ?
                                {uri:data_w.domain + data_w.image_url}
                            :require('../../assets/images/error.png')}
                            style={styles.wish_img}
                        />
                        <AntDesign
                            name={'heart'}
                            size={20}
                            style={{
                                position:'absolute',
                                right:10,
                                top:10,
                                color:this.props.theme
                            }}
                            onPress={()=>{
                                this.cancelCollection(data_w.flag, data_w.table_id)
                            }}
                        />
                    </View>
                    <View style={{padding: 5}}>
                        {
                            data_w.kind.map((item, index) => {
                                return <Text key={index} style={[styles.type_txt, {color: '#127D80'}]}>{item.kind_name}</Text>
                            })
                        }
                        <Text style={styles.act_title}>{data_w.title} {data_w.table_id}</Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    style={{height:80,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"delColle"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height:80,
                        backgroundColor: '#fff'
                    }}>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:60
                        }]} onPress={()=>this.delCollection()}>
                            <Text style={{color:'#999'}}>取消收藏</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wish_active_item: {
        backgroundColor: '#fff',
        borderRadius: 3,
        width:(width*0.94-14) / 2
    },
    wish_img:{
        width:'100%',
        height:126,
        borderRadius: 4
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

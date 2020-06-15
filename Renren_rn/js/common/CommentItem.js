import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window')
class CommentItem extends Component{
    showImg(index){
        const {data_c} = this.props
        let imgs = data_c.image;
        let arr=[];
        for(let i=0;i<imgs.length;i++){
            arr.push({
                url:imgs[i].domain + imgs[i].image_url
            })
        }
        this.props.showImg(arr, index)
    }
    render(){
        const {data_c, theme} = this.props
        return (
            <View style={styles.c_con}>
                <View style={[CommonStyle.spaceRow,styles.ci_header]}>
                    <View style={[CommonStyle.flexStart]}>
                        <LazyImage
                            source={data_c.user && data_c.user.headimage && data_c.user.headimage.domain && data_c.user.headimage.image_url?
                                {uri:data_c.user.headimage.domain + data_c.user.headimage.image_url}
                                :require('../../assets/images/touxiang.png')}
                            style={styles.headimage}
                        />
                        <View style={[CommonStyle.spaceCol,{height: 45,marginLeft: 10, alignItems:'flex-start'}]}>
                            <Text  numberOfLines={1} ellipsizeMode={'tail'}
                                  style={{fontSize: 14,fontWeight:'bold',color:'#333',maxWidth: 200}}>
                                {data_c.user && (data_c.user.family_name || data_c.user.middle_name || data_c.user.name)?
                                data_c.user.family_name+' '+data_c.user.middle_name+' '+data_c.user.name:'匿名用户'}
                            </Text>
                            <Text style={{color:'#666',fontSize: 12}}>{data_c.create_time}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[CommonStyle.flexStart]}>
                        <Text style={{color:data_c.is_praise===1?'#14c5ca':'#999',fontSize: 12}}>{data_c.praise_num}</Text>
                        <AntDesign
                            name={'like2'}
                            size={13}
                            style={{marginLeft:5,color:data_c.is_praise===1?theme:'#999'}}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.props.showBackModal({
                            msg_id: data_c.msg_id?data_c.msg_id:data_c.comment_id
                        })
                    }}
                >
                    <Text
                        style={styles.c_content}
                    >{data_c.content}</Text>
                </TouchableOpacity>

                {/*评论中带有图片*/}
                {
                    data_c.image && data_c.image.length > 0
                    ?
                        <View style={[CommonStyle.flexStart,{flexWrap: 'wrap',marginTop: 5 }]}>
                            {
                                data_c.image.map((item, index) => {
                                    return <TouchableOpacity
                                        onPress={()=>this.showImg(index)}
                                    >
                                        <LazyImage
                                            key={index}
                                            source={{uri:item.domain+item.image_url}}
                                            style={[styles.c_img,{
                                                width:data_c.image.length===1? (width*0.94)*0.7 :(width*0.94 - 20) / 3,
                                                height:data_c.image.length===1? (width*0.94)*0.7*0.6 :(width*0.94 - 20) / 3,
                                                marginLeft:data_c.image.length===1?0:index%3===0?0:10,
                                                marginTop: 5
                                            }]}
                                        />
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    :
                        null
                }
                {/*回复评论*/}
                {
                    data_c.leavemsg && data_c.leavemsg.length > 0
                    ?
                        <View style={styles.leave_con}>
                            <Text style={{color: '#333'}}>
                                来自
                                {
                                    data_c.leavemsg[0].user.family_name||data_c.leavemsg[0].user.middle_name||data_c.leavemsg[0].user.name
                                    ?
                                        data_c.leavemsg[0].user.family_name+' '+ data_c.leavemsg[0].user.middle_name+' '+data_c.leavemsg[0].user.name
                                    :
                                        '匿名用户'
                                }
                                的回复:
                            </Text>
                            <Text style={{fontSize: 15,color:'#333',marginTop:10,lineHeight: 20}}>{data_c.leavemsg[0].content}</Text>
                            <Text style={{marginTop: 10,color:theme}}>共{data_c.leaving_num}条回复</Text>
                        </View>
                    :
                        null
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    c_con:{
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        marginTop:20,
    },
    ci_header: {
        alignItems:'flex-start'
    },
    headimage:{
        width: 45,
        height: 45,
        borderRadius: 22.5
    },
    c_content:{
        color: '#333',
        fontSize: 15,
        marginTop: 15,
        lineHeight: 20
    },
    c_img:{
        width: (width*0.94 - 20) / 3,
        height:(width*0.94 - 20) / 3,
        borderRadius: 3
    },
    leave_con:{
        padding: 10,
        marginTop: 10,
        backgroundColor: '#F5F7FA',
        borderRadius: 3
    }
})
const mapStateToProps=state=>({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(CommentItem)

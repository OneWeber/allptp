import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import CommentItem from './CommentItem';
import CommonStyle from '../../assets/css/Common_css';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default class DetailComments extends Component{
    showImg(arr, index){
        this.props.showImg(arr, index)
    }
    render() {
        const {limit, commentsArr, theme} = this.props
        let data = commentsArr
        return(
            <View>
                {
                    data.slice(0,limit).map((item, index) => {
                        return <View key={index}>
                            <CommentItem
                                showBackModal={(data)=>this.props.showBackModal(data)}
                                showImg={(arr, index)=>this.showImg(arr, index)}
                                data_c={item}
                                clickPraise={(data, msg_id) => {this.props.clickPraise(data, msg_id)}}
                            />
                        </View>
                    })
                }
                {
                    data.length > limit
                        ?
                        <View style={[CommonStyle.flexCenter,{marginTop:20}]}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width: 139,
                                height:36,
                                flexDirection:'row',
                                backgroundColor:'#ECFEFF',
                                borderRadius: 20
                            }]}
                                  onPress={()=>{
                                      NavigatorUtils.goPage({
                                          flag: this.props.flag,
                                          table_id: this.props.table_id,
                                          table_flag: this.props.flag
                                      },'AllComments')
                                  }}
                            >
                                <Text style={{color:theme,fontWeight:'bold'}}>查看所有评价</Text>
                                <AntDesign
                                    name={'right'}
                                    size={15}
                                    style={{color: theme}}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
            </View>

        )
    }
}

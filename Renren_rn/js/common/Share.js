import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import * as WeChat from 'react-native-wechat';
import Toast from "react-native-easy-toast";
const {width, height} = Dimensions.get('window');
export default class Share extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'QQ',
                img:require('../../assets/images/share/qq.png')
            },
            {
                title:'空间',
                img:require('../../assets/images/share/kj.png')
            },
            {
                title:'微信',
                img:require('../../assets/images/share/wx.png')
            },
            {
                title:'朋友圈',
                img:require('../../assets/images/share/pyq.png')
            },
            {
                title:'邮件',
                img:require('../../assets/images/share/yj.png')
            },
            {
                title:'更多',
                img:require('../../assets/images/share/gd.png')
            }
        ]
        WeChat.registerApp('wx675e99e19312c085');
    }
    componentDidMount() {
        const {flag} = this.props;
        let datas = ''
        if(flag === 1) {
            const {data} = this.props;
            datas = data
        }else{
            const {storyData} = this.props;
            datas = storyData;
        }
        console.log('data', datas)
    }
    goShare(index) {
        if(index === 2) {
            this.wechatShare()
        }
    }
    wechatShare() {
        const {flag} = this.props;
        let datas = ''
        if(flag === 1) {
            const {data} = this.props;
            datas = data
        }else{
            const {storyData} = this.props;
            datas = storyData;
        }
        this.closeModal();
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToSession({
                        title:datas.title,
                        description:this.props.flag==1?'体验':'故事',
                        thumbImage:datas&&datas.cover?datas.cover.domain+datas.cover.image_url:null,
                        type: 'news',
                        webpageUrl: this.props.flag==1?'https://www.allptp.cn/mPublishPage?information='+datas.activity_id:'https://www.allptp.cn/mStorypage?information='+datas.story_id
                    })
                } else {
                    this.props.showToast('请安装微信客户端')
                }
            });
    }
    closeModal() {
        this.props.closeModal()
    }
    render(){
        return(
            <View>
                <View style={[{
                    height:135,
                    borderBottomColor: '#f5f5f5',
                    borderBottomWidth: 1
                }]}>
                    <ScrollView
                        ref={refScrollView=>this.refScrollView=refScrollView}
                        horizontal = {true}
                        showsHorizontalScrollIndicator = {false}
                        pagingEnabled = {true}
                    >
                        <View style={[CommonStyle.flexStart,{
                            height: 135
                        }]}>
                            {
                                this.tabNames.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        marginLeft:index===0?width*0.03:20,
                                        marginRight: index==this.tabNames.length-1?width*0.03:0
                                    }]} onPress={()=>this.goShare(index)}>
                                        <Image
                                        source={item.img}
                                        style={{width:52,height:52}}
                                        />
                                        <Text style={{
                                            color:'#333',
                                            fontSize: 12,
                                            marginTop: 10
                                        }}>{item.title}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                <TouchableOpacity style={[CommonStyle.flexCenter,{
                    height:45
                }]}>
                    <Text style={{color:'#999'}}>取消</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    TouchableHighlight,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import HttpUtils from '../../../../https/HttpUtils';
import HttpUrl from "../../../../https/HttpUrl";
import LazyImage from 'animated-lazy-image';
import Video from "react-native-video";
import NewhttpUrl from "../../../../https/Newhttpurl";
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
//===================================这个页面需要判断用户点击的是推荐体验还是我喜欢的体验而请求对应的数据。
export  default  class Welikeactivity extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            token:'',
            keyword:'',
            sort:'',
            step:1,
            price_low:'',
            price_high:'',
            country:'',
            province:'',
            city:'',
            region:'',
            activ_begin_time:'',
            activ_end_time:'',
            language:'',
            max_person_num:'',
            activityList:[],
            hIndex: -1,
            loading: false
        }
    }
    componentDidMount(){
        this.setState({
            loading: true
        })
        let { not_normal } = this.props
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                if (not_normal) {
                    this.getSameActivity()
                } else {
                    this.getActivity()
                }

            })
        })
    }
    getSameActivity() {//获取相似体验
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('activity_id',this.props.activity_id);
        HttpUtils.post(NewhttpUrl+'actls',formData).then(res => {
            if (res.code == 1) {
                this.setState({
                    activityList: res.data.data.slice(0, 4),
                    loading: false
                })
            }
        })
    }
    getActivity(){//获取活动界面，主页跟活动列表共用
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('keywords',this.state.keyword);
        formData.append('sort',this.state.sort);
        formData.append('page',this.state.step);
        formData.append('price_low',this.state.price_low);
        formData.append('price_high',this.state.price_high=='不限'?"":this.state.price_high);
        formData.append('country',this.state.country);
        formData.append('province',this.state.province);
        formData.append('city',this.state.city);
        formData.append('region',this.state.region);
        formData.append('activ_begin_time',this.state.activ_begin_time);
        formData.append('activ_end_time',this.state.activ_end_time);
        formData.append('laguage',this.state.language);
        formData.append('kind_id','');
        formData.append('is_volunteen','');
        formData.append('max_person_num',this.state.max_person_num);
        HttpUtils.post(HttpUrl+'Activity/activ_list',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        loading: false
                    })
                    if(this.props.isHome){
                        if(result.data.data.length>6){
                            this.setState({
                                activityList:result.data.data.slice(0,6)
                            })
                        }else if(result.data.data.length<6&&result.data.data.length>3){
                            this.setState({
                                activityList:result.data.data.slice(0,4)
                            })
                        }else{
                            this.setState({
                                activityList:result.data.data.slice(0,2)
                            })
                        }

                    }else{
                        this.setState({
                            activityList:result.data.data
                        })
                    }

                }
            }
        )
    }
    toActivity(activity_id){
        let { not_normal } = this.props
        if (not_normal) {
            this.props.push('Activity', { activity_id: activity_id })
        } else {
            this.props.navigate('Activity', { activity_id: activity_id })
        }

    }
    _renderActivty(data){
        let { not_normal } = this.props
        let { activityList } = this.state
        return <TouchableHighlight
            style={{marginLeft:not_normal?activityList.length == 1 ? 0 : data.index%2==0?0:10: data.index%2==0?0:10}}
            underlayColor='rgba(255,255,255,.3)'
            onPress={() =>{this.toActivity(data.item.activity_id)}}
        >
        <View style={[styles.activityLi,{
            marginTop:15,
            width:not_normal?activityList.length == 1? widthScreen*0.94 :(widthScreen*0.94 - 10) / 2 :(widthScreen*0.94 - 10) / 2
        }]}>
            <LazyImage
                source={{uri:data.item.domain+data.item.image_url}}
                style={styles.activityLiImg}
            />

            <View style={{width:'100%'}}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{color:'#333333',marginTop:7,fontWeight:'bold'}}
                >{data.item.title}</Text>
                <View style={[commonStyle.flexSpace,{width:'100%',marginTop:5}]}>
                    {
                        data.item.price==null||data.item.price=='null'||data.item.price==''
                        ?
                            <Text style={{color:'#999',fontSize:12,fontWeight:'bold'}}>暂已过期<Text style={{color:'#fff'}}>/</Text></Text>
                        :
                            <Text style={{color:'#ff5673',fontSize:12,fontWeight:'bold'}}>{data.item.price} ¥/人</Text>
                    }
                    <SimpleLineIcons
                        name={'options-vertical'}
                        style={{color:'#999999'}}
                    />
                </View>

            </View>
        </View>
        </TouchableHighlight>
    }
    render(){
        const { noMore, not_normal } = this.props
        const { activityList, loading } = this.state
        return(
            <View style={{marginTop:5,width:widthScreen}}>
                {
                    loading
                    ?
                        <ActivityIndicator size = 'small' style = {{marginTop: 20}}/>
                    :
                    activityList.length > 0
                    ?
                        <FlatList
                            data={this.state.activityList}
                            horizontal={false}
                            numColumns={2}
                            renderItem={(data)=>this._renderActivty(data)}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <Text style = {styles.status_txt}>
                            {
                                not_normal
                                ?
                                    '暂无相似体验'
                                :
                                    '暂无体验'
                            }
                        </Text>
                }

                {
                    loading
                    ?
                        null
                    :
                    not_normal
                    ?
                        null
                    :
                        noMore
                    ?
                        null
                    :
                    activityList.length > 0
                    ?
                        <View style={[commonStyle.flexCenter,{width:'100%',marginTop:20}]}>
                            <Text style={{color:'#4db6ac'}} onPress={()=>this.props.navigate('Activitylist')}>查看更多体验</Text>
                        </View>
                    :
                        null
                }

            </View>
        )
    }
}
const styles=StyleSheet.create({
    activityLi:{
        backgroundColor:'#fff',
        borderRadius:3,
        overflow:'hidden'
    },
    activityLiImg:{
        width:'100%',
        height:140,
        borderRadius: 3
    },
    status_txt: {
        width: '100%',
        textAlign: 'center',
        marginTop:35,
        color: '#999',
        fontSize: 16,
        marginBottom: 15
    }
})

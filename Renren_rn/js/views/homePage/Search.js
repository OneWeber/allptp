import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Dimensions,
    TextInput,
    ScrollView, TouchableOpacity, FlatList, Image,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch'
import HttpUrl from '../../utils/Http';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../navigator/NavigatorUtils';

const {width} = Dimensions.get('window')
class Search extends Component{
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            active: [],
            story: [],
            user: []
        }
    }
    _clickKeyword(item) {
        this.setState({
            keyword: item.keywords
        },() => {
            this.initData();
        })
    }
    _changeText(text) {
        this.setState({
            keyword: text
        },() => {
            if(this.state.keyword!='') {
                this.initData();
            }

        })
    }
    initData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('keywords',this.state.keyword);
        formData.append('page',1);
        Fetch.post(HttpUrl+'Search/search', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    active: res.data.activity.data,
                    story: res.data.story.data,
                    user: res.data.user.data,
                },() => {
                    console.log(res.data)
                })
            }
        })
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <SearchHeader
                    {...this.props}
                    {...this.state}
                    changeText={(text)=>{
                        this._changeText(text)
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SearchContent
                        {...this.props}
                        {...this.state}
                        clickKeyword={(item)=>{
                            this._clickKeyword(item)
                        }}
                    />
                </ScrollView>
            </View>
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
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(Search);
class SearchHeader extends Component{
    changeText(text) {
        this.props.changeText(text)
    }
    render(){
        return(
            <SafeAreaView style={[CommonStyle.flexCenter,{backgroundColor: '#fff'}]}>
                <View style={CommonStyle.commonWidth}>
                    <View style={[CommonStyle.spaceRow,{
                        height:60
                    }]}>
                        <View style={[CommonStyle.flexStart,{
                            height:40,
                            width:width*0.94-50,
                            backgroundColor:'#f5f5f5',
                            borderRadius: 5
                        }]}>
                            <AntDesign
                                name={'search1'}
                                size={16}
                                style={{color:'#999',width:20,marginLeft: 5}}
                            />
                            <Text
                                numberOfLines={1} ellipsizeMode={'tail'}
                                style={{
                                    color:this.props.theme,
                                    fontWeight:'bold',
                                    maxWidth: 60
                                }}>遂宁市</Text>
                            <TextInput
                                style={{
                                    width:width*0.94-50-5-20-70,
                                    height:40,
                                    marginLeft: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor:'#fff',
                                    paddingLeft:10,
                                    paddingRight: 10
                                }}
                                defaultValue={this.props.keyword}
                                placeholder="地点/体验/故事"
                                autoFocus={true}
                                onChangeText={(text) => {
                                    this.changeText(text)
                                }}
                            />
                        </View>
                        <Text
                            style={{color:'#666'}}
                            onPress={()=>{
                                this.props.closeSearch()
                            }}
                        >
                            取消
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
class SearchContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchList: []
        }
        this.tabs=['3折起','返差价','多套餐']
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        Fetch.post(HttpUrl+'Index/search_lately', formData).then(res => {
            console.log('res', res)
            if(res.code === 1) {
                this.setState({
                    searchList: res.data
                })
            }
        })
    }
    clickKeyword(item) {
        this.props.clickKeyword(item)
    }
    goDetail(table_id) {
        this.props.closeSearch()
        NavigatorUtils.goPage({table_id: table_id}, 'ActiveDetail')
    }
    _renderActivty(data){
        const {theme} = this.props
        return <TouchableOpacity style={{
            width: (width*0.94-14) / 2,
            marginLeft: data.index%2===0?0: 14,
            marginTop: data.index===1||2?15:25
        }}
           onPress={() => {this.goDetail(data.item.activity_id)}}
        >
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
                {
                    data.item.price_discount_concat&&data.item.price_discount_concat.split(',').length>1
                        ?
                        <View style={[styles.tab_item,{
                            backgroundColor:'#EEFFFF',
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:theme
                            }}>{parseFloat(data.item.price_discount_concat.split(',')[1])}折起</Text>
                        </View>
                        :
                        null
                }
                {
                    data.item.is_differ
                        ?
                        <View style={[styles.tab_item,{
                            backgroundColor:'#F5F6F8',
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:'#626467'
                            }}>返差价</Text>
                        </View>
                        :
                        null
                }
                {
                    data.item.is_combine
                        ?
                        <View style={[styles.tab_item,{
                            backgroundColor:'#F5F6F8',
                        }]}>
                            <Text style={{
                                fontSize: 10,
                                color:'#626467'
                            }}>含套餐</Text>
                        </View>
                        :
                        null
                }
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
    _renderStory(data) {
        return <TouchableOpacity
            style={{
                width: (width*0.94-14) / 2,
                marginLeft: data.index%2===0?0: 14,
                marginTop: data.index===1||2?15:25
            }}
            onPress={()=>{
                NavigatorUtils.goPage({story_id: data.item.story_id}, 'StoryDetail')
            }}
        >
            <LazyImage
                source={{uri: data.item.cover.domain + data.item.cover.image_url}}
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
            <Text numberOfLines={1} ellipsizeMode={'tail'}
                  style={[styles.common_weight,styles.common_color,{
                      marginTop: 4.5
                  }]}>{data.item.title}</Text>
            <View style={[CommonStyle.spaceRow,{marginTop: 8}]}>
                <View style={[CommonStyle.flexStart]}>
                    <TouchableOpacity style={[CommonStyle.flexStart]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.praise_num}</Text>
                        <Image source={require('../../../assets/images/home/xqdz.png')} style={{
                            width:11,
                            height:13,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexStart,{marginLeft: 24}]}>
                        <Text style={[styles.common_color,{fontSize:12}]}>{data.item.leaving_num}</Text>
                        <Image source={require('../../../assets/images/home/pinglun.png')} style={{
                            width:14,
                            height:14,
                            marginLeft: 3
                        }}/>
                    </TouchableOpacity>
                </View>
                <LazyImage
                    source={{uri: data.item.user.headimage.domain + data.item.user.headimage.image_url}}
                    style={{width:20,height:20,borderRadius: 10}}
                />
            </View>
        </TouchableOpacity>
    }
    render(){
        const {searchList} =this.state
        return(
            <View>
                {
                    this.props.keyword
                    ?
                        <View>
                            <View style={[CommonStyle.flexStart,{
                                marginTop: 10,
                                paddingLeft: width*0.03
                            }]}>
                                <AntDesign
                                    name={'clockcircleo'}
                                    size={14}
                                    style={{color:'#333'}}
                                />
                                <Text style={{
                                    color:'#333',
                                    fontWeight: 'bold',
                                    marginLeft: 10
                                }}>搜索结果</Text>
                                {/*体验*/}
                            </View>
                            <View style={[CommonStyle.commonWidth,{
                                marginLeft: width*0.03
                            }]}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    color:'#333',
                                    marginTop: 25
                                }}>体验</Text>
                                <View>
                                    {
                                        this.props.active.length>0
                                        ?
                                            <FlatList
                                                data={this.props.active}
                                                horizontal={false}
                                                numColumns={2}
                                                renderItem={(data)=>this._renderActivty(data)}
                                                showsHorizontalScrollIndicator = {false}
                                                showsVerticalScrollIndicator = {false}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        :
                                            <View style={[CommonStyle.flexCenter,{
                                                marginTop: 25,
                                                marginBottom: 10
                                            }]}>
                                                <Text style={{color:'#666'}}>暂无结果</Text>
                                            </View>
                                    }
                                </View>
                                <Text style={{
                                    fontWeight: 'bold',
                                    color:'#333',
                                    marginTop: 25
                                }}>故事</Text>
                                <View style={{
                                    marginBottom: 40
                                }}>
                                    {
                                        this.props.story.length>0
                                            ?
                                            <FlatList
                                                data={this.props.story}
                                                horizontal={false}
                                                numColumns={2}
                                                renderItem={(data)=>this._renderStory(data)}
                                                showsHorizontalScrollIndicator = {false}
                                                showsVerticalScrollIndicator = {false}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                            :
                                            <View style={[CommonStyle.flexCenter,{
                                                marginTop: 25,
                                                marginBottom: 10
                                            }]}>
                                                <Text style={{color:'#666'}}>暂无结果</Text>
                                            </View>
                                    }
                                </View>

                            </View>


                        </View>

                    :
                        <View>
                            <View style={[CommonStyle.flexStart,{
                                marginTop: 10,
                                paddingLeft: width*0.03
                            }]}>
                                <AntDesign
                                    name={'clockcircleo'}
                                    size={14}
                                    style={{color:'#333'}}
                                />
                                <Text style={{
                                    color:'#333',
                                    fontWeight: 'bold',
                                    marginLeft: 10
                                }}>最近的搜索</Text>
                            </View>
                            {
                                searchList.length>0
                                    ?
                                    <ScrollView
                                        horizontal = {true}
                                        showsHorizontalScrollIndicator = {false}
                                        pagingEnabled = {true}
                                    >
                                        {
                                            searchList.map((item, index) => {
                                                return <TouchableOpacity key={index} style={{
                                                    padding: 5,
                                                    backgroundColor:'#f5f5f5',
                                                    marginTop: 15,
                                                    marginLeft: index===0?width*0.03:0,
                                                    marginRight: index===searchList.length-1?width*0.03:15
                                                }}
                                                     onPress={() => {
                                                         this.clickKeyword(item)
                                                     }}
                                                >
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color:'#666'
                                                    }}>{item.keywords}</Text>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </ScrollView>
                                    :
                                    <View style={[CommonStyle.flexCenter,{
                                        marginTop: 15,
                                    }]}>
                                        <Text style={{color:'#666'}}>暂无搜索记录</Text>
                                    </View>
                            }
                        </View>
                }


            </View>
        )
    }
}

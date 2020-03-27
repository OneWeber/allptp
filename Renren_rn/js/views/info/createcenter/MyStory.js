import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, RefreshControl, FlatList, Dimensions, Image} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import action from '../../../action'
import NewHttp from '../../../utils/NewHttp';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window')
class MyStory extends Component{
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, mystory, onLoadMyStory} = this.props;
        this.storeName = 'mystory';
        this.step = 1;
        let formData=new FormData();
        formData.append('token',token);
        formData.append('keywords','');
        formData.append('sort','');
        formData.append('page',1);
        formData.append('kind_id','');
        onLoadMyStory(this.storeName, NewHttp + 'storyc', formData)
    }
    getLeftButton() {
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                NavigatorUtils.backToUp(this.props)
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    renderItem(data){
        return <MyStoryItem data_m={data.item} data_index={data.index} />
    }
    render(){
        const {mystory} = this.props;
        let store = mystory[this.storeName];
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'我的故事'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    style={{borderBottomWidth: 1,borderBottomColor: '#f5f5f5'}}
                />
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                        ?
                        <View style={{flex: 1}}>
                            <FlatList
                                data={store.items.data.data.data}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <NoData></NoData>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
const mapStateToProps = state => ({
    mystory: state.mystory,
    token: state.token.token
})
const mapDispatchToProps = dispatch => ({
    onLoadMyStory: (storeName, url, data) => dispatch(action.onLoadMyStory(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyStory)

class MyStoryItem extends Component{
    render(){
        const {data_m} = this.props
        return(
            <TouchableOpacity style={[CommonStyle.commonWidth,{
                padding: 10,
                backgroundColor: '#fff',
                marginLeft: width*0.03,
                marginTop: 10,
                borderRadius: 4
            }]}>
                <LazyImage
                    source={{uri:data_m.cover.domain+data_m.cover.image_url}}
                    style={{width: '100%',height: 140,borderRadius: 4}}
                />
                <Text style={{
                    color:'#127D80',
                    fontSize: 10,
                    marginTop: 8,
                    fontWeight:'bold'
                }}>{data_m.country}{data_m.province}{data_m.city==='直辖市'?null:data_m.city}{data_m.region}</Text>
                <Text numberOfLines={2} ellipsizeMode={'tail'}
                      style={{
                          marginTop: 10,
                          fontWeight:'bold',
                          color:'#333'
                      }}>{data_m.title}</Text>
                <View style={[CommonStyle.spaceRow,{marginTop:10}]}>
                    <View style={[CommonStyle.flexCenter,{width:60,height:18,backgroundColor:'#14c5ca',borderRadius:5}]}>
                        <Text style={{color:'#fff',fontSize: 11}}>{data_m.kind[0].kind_name}</Text>
                    </View>
                    <View style={CommonStyle.flexStart}>
                        <TouchableOpacity style={[CommonStyle.flexStart]}>
                            <Text style={[styles.common_color,{fontSize:12}]}>{data_m.praise_num}</Text>
                            <Image source={require('../../../../assets/images/home/xqdz.png')} style={{
                                width:11,
                                height:13,
                                marginLeft: 3
                            }}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexStart,{marginLeft: 24}]}>
                            <Text style={[styles.common_color,{fontSize:12}]}>{data_m.leaving_num}</Text>
                            <Image source={require('../../../../assets/images/home/pinglun.png')} style={{
                                width:14,
                                height:14,
                                marginLeft: 3
                            }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

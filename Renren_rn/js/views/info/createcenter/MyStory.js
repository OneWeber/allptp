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
import Modal from 'react-native-modalbox';
import Fetch from '../../../expand/dao/Fetch';
import HttpUrl from '../../../utils/Http';
const {width, height} = Dimensions.get('window')
class MyStory extends Component{
    constructor(props) {
        super(props);
        this.state = {
            itemData: ''
        }
    }
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
    _showModal(data) {
        this.setState({
            itemData: data
        }, () => {
            this.refs.story.open()
        })

    }
    renderItem(data){
        return <MyStoryItem showModal={(data)=>this._showModal(data)} data_m={data.item} data_index={data.index} />
    }
    goEditStory() {
        this.refs.story.close();
        NavigatorUtils.goPage({
            isEdit: true,
            data: this.state.itemData,
        }, 'PublishStory')
    }
    goDelStory() {
        this.refs.story.close();
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('story_id', this.state.itemData.story_id);
        Fetch.post(HttpUrl+'Story/del_story', formData).then(res => {
            if(res.code === 1) {
                this.loadData();
            }
        })
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
                <Modal
                    style={{height:170,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"story"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.7)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={[CommonStyle.flexCenter,{
                        height: 170
                    }]}>
                        <View style={[CommonStyle.commonWidth,{
                            height: 170
                        }]}>
                            <View style={[{
                                height: 100,
                                backgroundColor: '#fff',
                                borderRadius: 10,

                            }]}>
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,{
                                        width: '100%',
                                        height: 50,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: 1
                                    }]}
                                    onPress={() => {
                                        this.goEditStory()
                                    }}
                                >
                                    <Text style={{color:'#333',fontWeight: 'bold'}}>编辑故事</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,{
                                        width: '100%',
                                        height: 50,
                                    }]}
                                    onPress={()=>{
                                        this.goDelStory()
                                    }}
                                >
                                    <Text style={{color:'#333',fontWeight: 'bold'}}>删除故事</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={[CommonStyle.flexCenter,{
                                    width: '100%',
                                    height: 50,
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    marginTop: 10
                                }]}
                                onPress={()=>{this.refs.story.close()}}
                            >
                                <Text style={{color:'#999',fontWeight: 'bold'}}>取消</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    _showModal(data){
        this.props.showModal(data)
    }
    render(){
        const {data_m} = this.props
        return(
            <TouchableOpacity style={[CommonStyle.commonWidth,{
                backgroundColor: '#fff',
                marginLeft: width*0.03,
                paddingTop: 22,
                paddingBottom: 20.5,
                borderBottomWidth: 1,
                borderBottomColor: '#f5f5f5'
            }]}
              onPress={() => {
                  NavigatorUtils.goPage({story_id:data_m.story_id}, 'StoryDetail')
              }}
            >
                <Text style={{
                    color:'#666',
                    fontSize: 12
                }}>{data_m.create_time}</Text>
                <View style={[CommonStyle.spaceRow,{
                    marginTop: 10
                }]}>
                    <LazyImage
                        source={data_m.cover&&data_m.cover.domain&&data_m.cover.image_url?{
                            uri:data_m.cover.domain+data_m.cover.image_url
                        }:require('../../../../assets/images/error.png')}
                        style={{
                            width: 120,
                            height: 90,
                            borderRadius: 2
                        }}
                    />
                    <View style={[CommonStyle.spaceCol,{
                        height: 90,
                        width: width*0.94-130,
                        alignItems: 'flex-start'
                    }]}>
                        <Text numberOfLines={2} ellipsizeMode={'tail'}
                              style={{
                                  fontWeight:'bold',
                                  color:'#333'
                              }}>{data_m.title}</Text>
                        <View style={[CommonStyle.spaceRow,{
                            width: '100%'
                        }]}>
                            <View style={[CommonStyle.flexStart]}>
                                <Text style={{color:'#999',fontSize: 12}}>留言 {data_m.leaving_num}</Text>
                                <Text style={{color:'#999',fontSize: 12,marginLeft: 10}}>收藏 {data_m.collection_num}</Text>
                                <Text style={{color:'#999',fontSize: 12,marginLeft: 10}}>赞 {data_m.praise_num}</Text>
                            </View>
                            <AntDesign
                                name={'ellipsis1'}
                                size={16}
                                style={{color:'#BBBBBB'}}
                                onPress={()=>{this._showModal(data_m)}}
                            />
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

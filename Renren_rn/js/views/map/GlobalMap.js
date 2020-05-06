import React,{Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity, Image,ActivityIndicator} from 'react-native';
import MapView,{
    Marker,
    Callout,
    AnimatedRegion,
} from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import {connect} from 'react-redux'
import CommonStyle from '../../../assets/css/Common_css';
import Carousel, { ParallaxImage,Pagination } from 'react-native-snap-carousel';
import Modal from 'react-native-modalbox';
import LazyImage from 'animated-lazy-image';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Screening from '../../model/screen';
import MapList from './MapList';
import PeopleModal from './PeopleModal';
import Geolocation from 'react-native-geolocation-service';
import {Initializer, Geocode} from 'react-native-baidumap-sdk'

const {width, height} = Dimensions.get('window');
let _this = this;
class GlobalMap extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'参与人数',
                data:[],
                type: 2
            },
            {
                title:'综合排序',
                data:[{title:'价格低到高',},{title:'评分优先'},{title:'评论优先'},{title:'收藏优先'}],
                type: 1
            },
            {
                title:'筛选条件',
                data:[],
                type: 3
            }
        ];
        this.state = {
            actCluster: [],
            activityList: [],
            activeSlide: -1,
            screenIndex: -1,
            isList: false,
            LATITUDE: '',
            LONGITUDE: '',
            isFocusMe: true,
            latitudeDelta: '',
            longitudeDelta: '',
            nowAddress: ''
        }
        Initializer.init('qtmMN5Ps98kROk5UistKGfKyqHOncMxv').catch(e => console.log(e))
    }
    componentDidMount(){
        this.getActivityList();
        this.initAddress()
    }
    initAddress() {
        Geolocation.getCurrentPosition(
            (position) => {
                if(position) {
                    this.changeAddress(position.coords.latitude, position.coords.longitude)
                }
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    async  changeAddress(latitude, longitude){
        const searchResult = await Geocode.reverse({ latitude: latitude, longitude: longitude });
        this.setState({
            nowAddress: searchResult
        })
    }
    regionChange(Region) {
        this.setState({
            LATITUDE: Region.latitude,
            LONGITUDE: Region.longitude,
            latitudeDelta: Region.latitudeDelta,
            longitudeDelta: Region.longitudeDelta,
        })
    };
    getActivityList(Region) { //获取体验列表
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('page',1);
        Fetch.post(HttpUrl+'Activity/activ_list',formData).then(
            res => {
                if(res.code === 1) {
                    this.setState({
                        activityList: res.data.data
                    },() => {
                        let act_arr = this.state.activityList
                        this.forAct(act_arr).then(
                            res => {
                                this.setState({
                                    actCluster: res
                                })
                            }
                        )
                    })
                }
            }
        )
    }
    forAct(val) {//遍历所有活动转换为点聚合需要的格式
        let actCluster_arr = []
        const promise = new Promise((resolve, reject) => {
            for (let i = 0; i < val.length; i++) {
                actCluster_arr.push({
                    key: parseFloat(i),
                    coordinate: {latitude: val[i].set_address_lat, longitude: val[i].set_address_lng},
                })
            }
            resolve(actCluster_arr)
        })
        return promise
    }
    showDetail(index) {
        const {actCluster} = this.state;
        this.setState({
            activeSlide: index,
            LATITUDE: actCluster[index].coordinate.latitude,
            LONGITUDE: actCluster[index].coordinate.longitude,
            latitudeDelta: 15,
            longitudeDelta: 15,
            isFocusMe: false
        }, () => {
            this.refs.map.open()
        })

    }
    _onSnapToItem(index) {
        const {actCluster} = this.state;
        this.setState({
            activeSlide: index,
            LATITUDE: actCluster[index].coordinate.latitude,
            LONGITUDE: actCluster[index].coordinate.longitude,
            latitudeDelta: 15,
            longitudeDelta: 15,
        })
    }
    _onClose() {
        this.setState({
            activeSlide: -1,
            isFocusMe: true,
            latitudeDelta: 15,
            longitudeDelta: 15,
        })
    }
    clickItem(activity_id) {
        this.refs.map.close();
        NavigatorUtils.goPage({table_id:activity_id},'ActiveDetail')
    }
    _renderItem(data) {
        const item = data.item;
        return (
            <TouchableOpacity
                style={[styles.detail_item,CommonStyle.spaceRow]}
                onPress={()=>{
                    this.clickItem(item.activity_id)
                }}
            >
                <LazyImage
                    source={{ uri: item.domain + item.image_url }}
                    style={{
                        width:100,
                        height: 100,
                        borderRadius: 3
                    }}
                />
                <View style={[CommonStyle.spaceCol,{
                    width:width - 60 -110,
                    height: 100,
                    alignItems:'flex-start'
                }]}>
                    <View>
                        <Text numberOfLines={2} ellipsizeMode={'tail'}
                            style={{
                            color:'#333',
                            fontWeight: 'bold'
                        }}>{item.title}{item.activity_id}</Text>
                        <Text style={{
                            color:'#008489',
                            fontSize: 10,
                            fontWeight:'bold',
                            marginTop: 5
                        }}>{item.country}{item.province}{item.city}{item.region}</Text>
                    </View>
                    <View style={{width: '100%'}}>
                        {
                            item.price
                                ?
                                <Text style={{color:'#333'}}>
                                    <Text style={{fontWeight:'bold'}}>{item.price}</Text> /人起
                                </Text>
                                :
                                <Text style={{color:'#999'}}>
                                    暂已过期
                                </Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    getCustom() {

    }
    _itemOnpress() {

    }
    checkPeoPle() {
        this.refs.people.open()
    }
    _onClosePeople() {
        this.screen.openOrClosePanel(this.state.screenIndex, true)
    }
    render(){
        const {actCluster, activityList, activeSlide, isList, nowAddress} = this.state
        return(
            <SafeAreaView style={{flex: 1,backgroundColor: '#fff'}}>
                <View style={{flex:1,position:'relative'}}>
                <SafeAreaView style={[styles.header_con,CommonStyle.flexCenter]}>
                    <View style={[CommonStyle.flexCenter,{
                        height: 60
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height:45,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 5
                        }]}>
                            <View style={CommonStyle.flexStart}>
                                <TouchableOpacity style={{
                                    paddingLeft: 10,
                                }} onPress={()=>{
                                    NavigatorUtils.backToUp(this.props)
                                }}>
                                    <AntDesign
                                        name={'left'}
                                        size={20}
                                        style={{color:'#333'}}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={[CommonStyle.flexCenter,{
                                    width:50,
                                    height:45,
                                    borderRightWidth: 1,
                                    borderRightColor: '#fff',
                                    marginLeft:5
                                }]} onPress={()=>{
                                    NavigatorUtils.goPage({}, 'SelectAddress')
                                }}>
                                    {
                                        nowAddress
                                        ?
                                            <Text numberOfLines={1} ellipsizeMode={'tail'}
                                                  style={{
                                                      color:this.props.theme,
                                                      fontWeight:'bold'
                                                  }}>{nowAddress.country}</Text>
                                        :
                                            <ActivityIndicator size={'small'} color={'#666'}/>
                                    }

                                </TouchableOpacity>
                            </View>
                            <View style={[CommonStyle.flexStart,{
                                width: width*0.94-20-155,
                                height:45,
                            }]}>
                                {
                                    nowAddress
                                    ?
                                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:'#999'}}>
                                            {nowAddress.province}{nowAddress.city}{nowAddress.street}
                                        </Text>
                                    :
                                        <ActivityIndicator size={'small'} color={'#666'}/>
                                }

                            </View>
                            {
                                isList
                                ?
                                    <TouchableOpacity style={[CommonStyle.flexEnd,{
                                        paddingRight: 10
                                    }]} onPress={()=>{this.setState({isList: false})}}>
                                        <AntDesign
                                            name={'earth'}
                                            size={16}
                                            style = {{color:'#333'}}
                                        />
                                        <Text style={{color:'#333',marginLeft:3}}>地图</Text>
                                    </TouchableOpacity>
                                :
                                    <TouchableOpacity style={[CommonStyle.flexEnd,{
                                        paddingRight: 10
                                    }]} onPress={()=>{this.setState({isList: true})}}>
                                        <AntDesign
                                            name={'profile'}
                                            size={16}
                                            style = {{color:'#333'}}
                                        />
                                        <Text style={{color:'#333',marginLeft:3}}>列表</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                </SafeAreaView>
                 <View style={styles.map_view}>
                     <Screening
                         ref={screen => this.screen = screen}
                         screenData={this.tabNames}
                         selectHeader={(data, index) => {
                             this.setState({
                                 screenIndex: index
                             })
                         }}
                         selectIndex={[0,0,0]}
                         customContent={this.getCustom()}
                         customData={[]}
                         customFunc={()=>{
                             this.refs.people.open()
                         }}
                         itemOnpress={(tIndex, index, data) => {
                             this._itemOnpress(tIndex, index, data)
                         }}
                     >
                         {
                             isList
                             ?
                                 <MapList {...this.state} {...this.props}/>
                             :
                                 <View style={{flex: 1}}>
                                     <MapView
                                         provider={this.props.provider}
                                         zoomTapEnabled={true}
                                         zoomEnabled={true}
                                         pitchEnabled={false}
                                         zoomControlEnabled={true}
                                         scrollEnabled={true}
                                         rotateEnabled={true}
                                         showsUserLocation={this.state.isFocusMe}
                                         followsUserLocation={false}
                                         showsMyLocationButton={this.state.isFocusMe}
                                         enableZoomControl={true}
                                         maxZoomLevel={14}
                                         minZoomLevel={3}
                                         userLocationAnnotationTitle={'我当前的位置'}
                                         showsIndoorLevelPicker={false}
                                         loadingEnabled={false}
                                         region={{
                                             latitude: this.state.LATITUDE,
                                             longitude: this.state.LONGITUDE,
                                             latitudeDelta: this.state.latitudeDelta,
                                             longitudeDelta: this.state.longitudeDelta,
                                         }}
                                         onRegionChangeComplete={(Region)=>this.regionChange(Region)}
                                         style={{
                                             flex: 1,
                                             position:'relative'
                                         }}
                                     >
                                         {
                                             actCluster && actCluster.length > 0
                                                 ?
                                                 actCluster.map((item, index) => {
                                                     return <Marker
                                                         key={index}
                                                         coordinate={item.coordinate}
                                                         tracksViewChanges={true}
                                                         ref={markerRef => this.markerRef = markerRef}
                                                         stopPropagation={true}
                                                         onPress={()=>{this.showDetail(index)}}
                                                     >

                                                         <View style={CommonStyle.flexStart}>
                                                             <LazyImage
                                                                source={{uri:activityList[index].domain+activityList[index].image_url}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    borderRadius: 3,
                                                                    borderWidth: 3,
                                                                    borderColor: activeSlide===index?'#14c5ca':'#fff',
                                                                    shadowColor: '#000000',
                                                                    shadowOffset: {h: 10, w: 10},
                                                                    shadowRadius: 5,
                                                                    shadowOpacity: 0.1
                                                                }}
                                                             />
                                                             <View style={[CommonStyle.flexCenter,{
                                                                 height:20,
                                                                 paddingLeft:5,
                                                                 paddingRight: 5,
                                                                 backgroundColor:'#fff',
                                                                 shadowColor: '#000000',
                                                                 shadowOffset: {h: 10, w: 10},
                                                                 shadowRadius: 5,
                                                                 shadowOpacity: 0.1,
                                                                 borderTopRightRadius:3,
                                                                 borderBottomRightRadius:3
                                                             }]}>
                                                                 <Text style={{color:'#333',fontSize:12}}>{
                                                                     activityList[index].price
                                                                     ?
                                                                     '¥'+activityList[index].price+'/人起'
                                                                     :
                                                                     '暂已过期'
                                                                 }</Text>
                                                             </View>
                                                         </View>
                                                     </Marker>
                                                 })
                                                 :
                                                 null
                                         }
                                     </MapView>
                                     <Modal
                                         style={[CommonStyle.flexCenter,{
                                             backgroundColor:'#fff',
                                             height:150
                                         }]}
                                         ref={"map"}
                                         animationDuration={280}
                                         position={"bottom"}
                                         backdropColor={'rgba(0,0,0,0)'}
                                         swipeToClose={false}
                                         backdropPressToClose={true}
                                         coverScreen={true}
                                         onClosed={()=>this._onClose()}
                                         onClosingState={this.onClosingState}>
                                         <View style = {[styles.p_con]}>
                                             <SafeAreaView style={{flex: 1}}>
                                                 <Carousel
                                                     ref={c => {
                                                         this._slider1Ref = c;
                                                     }}
                                                     sliderWidth={width}

                                                     firstItem={ activeSlide }
                                                     itemWidth={width - 60}
                                                     data={activityList}
                                                     renderItem={(data)=>this._renderItem(data)}
                                                     hasParallaxImages={true}
                                                     onSnapToItem={(index) => {this._onSnapToItem(index)}}
                                                 />

                                             </SafeAreaView>
                                         </View>
                                     </Modal>
                                     {/*参与人数modal*/}
                                     <Modal
                                         style={[CommonStyle.flexCenter,CommonStyle.commonWidth,{
                                             backgroundColor:'#fff',
                                             height:220,
                                             borderRadius: 5
                                         }]}
                                         ref={"people"}
                                         animationDuration={280}
                                         position={"center"}
                                         backdropColor={'rgba(0,0,0,.8)'}
                                         swipeToClose={false}
                                         backdropPressToClose={true}
                                         onClosed={()=>{
                                             this._onClosePeople()
                                         }}
                                         coverScreen={true}>
                                         <View style={[CommonStyle.commonWidth,{
                                             height:220,
                                             backgroundColor:'#fff',
                                             borderRadius: 5
                                         }]}>
                                             <PeopleModal />
                                         </View>
                                     </Modal>
                                 </View>
                         }

                     </Screening>
                 </View>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    p_con: {
        height:150,
        backgroundColor:'#fff'
    },
    detail_item: {
        width: width - 60,
        marginTop: 10,
        position:'relative',
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'relative'
    },
    header_con: {
        position:'absolute',
        left:0,
        right:0,
        top: 0,
        zIndex: 9,
        backgroundColor:'#fff'
    },
    map_view: {
        position:'absolute',
        left:0,
        top:60,
        bottom:0,
        right:0
    }
})
const mapStateToProps = state => ({
    token:state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(GlobalMap)

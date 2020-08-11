import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    FlatList,
    ActivityIndicator,
    SectionList, SafeAreaView,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../assets/css/Common_css';
import Geolocation from "react-native-geolocation-service";
import {Geocode} from 'react-native-baidumap-sdk/lib/js';
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window');
class SelectAddress extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {title: '中国'},
            {title: '眉山'},
            {title: '遂宁'}
        ];
        this.btns = ['国内', '国外'];
        this.state = {
            nowAddress: '',
            countryIndex: 0,
            initHeight: 0,
            isFixed: false
        }
    }
    componentDidMount(){
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
    _renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.flexCenter,{
            paddingLeft:10,
            paddingRight: 10,
            height:35,
            borderWidth: 1,
            borderColor:'#f5f5f5',
            marginLeft: data.index===0?width*0.03:15,
            borderRadius: 3
        }]}>
            <Text style={{color:'#666'}}>{data.item.title}</Text>
        </TouchableOpacity>
    }
    layout(e) {
        this.setState({
            initHeight: e.layout.y
        })
    }
    _onScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if(offsetY > this.state.initHeight) {
            this.setState({
                isFixed: true
            })
        } else {
            this.setState({
                isFixed: false
            })
        }
    }
    render() {
        const {nowAddress, countryIndex} = this.state;
        return(
            <SafeAreaView style={[{
                flex: 1,
                backgroundColor:'#fff',
            }]}>
                <View style={{flex: 1, position:'relative'}}>
                    <RNEasyTopNavBar
                        title={'选择城市'}
                        backgroundTheme={'#fff'}
                        titleColor={'#333'}
                        leftButton={this.getLeftButton()}
                        style={{borderBottomColor:'#f5f5f5',borderBottomWidth: 1}}
                    />
                        {/*<View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{*/}
                        {/*    marginTop: 15,*/}
                        {/*    marginLeft:width*0.03*/}
                        {/*}]}>*/}
                        {/*    <View>*/}
                        {/*        <Text style={{*/}
                        {/*            color:'#333',*/}
                        {/*            fontWeight: 'bold',*/}
                        {/*            fontSize: 12*/}
                        {/*        }} >当前地址:</Text>*/}
                        {/*    </View>*/}
                        {/*    <View>*/}
                        {/*        <Text style={{*/}
                        {/*            fontSize: 12,*/}
                        {/*            fontWeight: 'bold',*/}
                        {/*            color:this.props.theme,*/}
                        {/*            marginLeft: 5*/}
                        {/*        }}>{nowAddress.country}{nowAddress.province}{nowAddress.city}{nowAddress.street}</Text>*/}
                        {/*    </View>*/}
                        {/*</View>*/}
                        {/*<View style={[CommonStyle.commonWidth,styles.search_header,CommonStyle.flexStart,{*/}
                        {/*    marginLeft:width*0.03*/}
                        {/*}]}>*/}
                        {/*    <AntDesign*/}
                        {/*        name={'search1'}*/}
                        {/*        size={14}*/}
                        {/*        style={{color:'#666'}}*/}
                        {/*    />*/}
                        {/*    <TextInput*/}
                        {/*        placeholder="输入城市名称"*/}
                        {/*        style={styles.search_input}*/}
                        {/*    />*/}
                        {/*</View>*/}
                        {/*<View style={[CommonStyle.commonWidth,{*/}
                        {/*    marginTop: 20,*/}
                        {/*    marginLeft:width*0.03*/}
                        {/*}]}>*/}
                        {/*    <Text style={{*/}
                        {/*        color:'#333',*/}
                        {/*        fontWeight: 'bold',*/}
                        {/*    }}>最近搜索</Text>*/}
                        {/*</View>*/}
                        {/*<View style={{width: width,marginTop: 20}}>*/}
                        {/*    <FlatList*/}
                        {/*        data={this.tabNames}*/}
                        {/*        horizontal={true}*/}
                        {/*        renderItem={(data)=>this._renderItem(data)}*/}
                        {/*        showsHorizontalScrollIndicator = {false}*/}
                        {/*        keyExtractor={(item, index) => index.toString()}*/}
                        {/*    />*/}
                        {/*</View>*/}
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{
                            marginTop: 10,
                            marginLeft:width*0.03
                        }]}>
                            {
                                this.btns.map((item, index) => {
                                    return <View key={index}  style={{height:40,position:'relative',marginLeft: index===0?0:20}}>
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height: 40,
                                            position:'relative',
                                        }]} onPress={()=>{
                                            this.setState({
                                                countryIndex: index
                                            })
                                        }}>
                                            <Text style={{
                                                color:'#333',
                                                fontWeight: 'bold',
                                            }}>{item}</Text>
                                            {
                                                countryIndex===index
                                                    ?
                                                    <View style={{
                                                        position:'absolute',
                                                        bottom:0,
                                                        left:5,
                                                        right:5,
                                                        height:3,
                                                        backgroundColor: '#14c5ca',
                                                        borderRadius: 3
                                                    }}></View>
                                                    :
                                                    null
                                            }
                                        </TouchableOpacity>
                                        {
                                            index===1
                                            ?
                                                <View style={{
                                                    position:'absolute',
                                                    left:0,
                                                    right:0,
                                                    top:0,
                                                    bottom:0,
                                                    backgroundColor:'rgba(255,255,255,.6)'
                                                }}></View>
                                            :
                                                null
                                        }
                                    </View>
                                })
                            }
                        </View>
                    {
                        countryIndex === 0
                            ?
                            <View onLayout={({nativeEvent:e})=> this.layout(e)} style={{
                                position:'absolute',
                                left:0,
                                right:0,
                                top:90,
                                bottom: 0,
                                zIndex: 5
                            }}>
                                <Inland  {...this.props}/>
                            </View>
                            :
                            null
                    }

                </View>

            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    search_header: {
        height: 40,
        backgroundColor: '#f5f5f5',
        marginTop: 15,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    search_input: {
        width:width*0.94-20-30,
        height:40,
        marginLeft:10,
        paddingLeft:5
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(SelectAddress)
import area from '../../assets/js/address'
import Fetch from '../expand/dao/Fetch';
import NewHttp from '../utils/NewHttp';
import {PinyinUtil} from '../utils/pinyin'
class Inland extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hotCity: [],
            loadingHot: false,
            cityIndex: -1
        }
        this.cityList = area();
    }
    componentDidMount(){
        this.loadHot()

    }
    loadHot() {
        this.setState({
            loadingHot: true
        })
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        Fetch.post(NewHttp + 'ScoreHighCityTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    hotCity: res.data,
                    loadingHot: false
                })
            }
        })
    }
    clickCity(city) {
        if (this.props.navigation.state.params.callback) {
            this.props.navigation.state.params.callback(city);
            NavigatorUtils.backToUp(this.props)
        }
    }
    render() {
        const {loadingHot, hotCity, cityIndex} = this.state;
        return (
            <View style={[CommonStyle.spaceRow,{
                width:width,
                marginTop: 20
            }]}>
                <View style={{
                    width: width*0.2,
                    backgroundColor:'#f5f5f5'
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:50
                        }]} onPress={() => {
                            this.setState({
                                cityIndex: -1
                            })
                        }}>
                            <Text style={{color:cityIndex===-1?this.props.theme:'#333'}}>热门</Text>
                        </TouchableOpacity>
                        {
                           this.cityList.map((item, index) => {
                               return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                   height:50
                               }]} onPress={() => {
                                   this.setState({
                                       cityIndex: index
                                   })
                               }}>
                                   <Text style={{color:cityIndex===index?this.props.theme:'#333'}}>{item.name}</Text>
                               </TouchableOpacity>
                           })
                        }
                    </ScrollView>
                </View>
                <View style={{
                    width:width*0.8
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false} bounces={true}>
                        <View style={{
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>
                            {
                                cityIndex>-1
                                ?
                                this.cityList[cityIndex].cityList
                                ?
                                    this.cityList[cityIndex].cityList[0].name==='市辖区' || this.cityList[cityIndex].cityList[0].name==='特别行政区'
                                    ?
                                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                                            height:35,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            borderWidth: 1,
                                            borderColor: '#f5f5f5',
                                            marginRight: 15,
                                            marginTop: 10,
                                            borderRadius: 3
                                        }]}>
                                            <Text style={{
                                                color:'#666'
                                            }}>{this.cityList[cityIndex].name}</Text>
                                        </TouchableOpacity>
                                    :
                                    <View style={[CommonStyle.flexStart,{
                                        flexWrap: 'wrap',
                                        marginBottom: 10
                                    }]}>
                                        {
                                            this.cityList[cityIndex].cityList.map((item, index) => {
                                                return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                                    height:35,
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                    borderWidth: 1,
                                                    borderColor: '#f5f5f5',
                                                    marginRight: 15,
                                                    marginTop: 10,
                                                    borderRadius: 3
                                                }]}>
                                                    <Text style={{
                                                        color:'#666'
                                                    }}>{item.name}</Text>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </View>
                                :
                                    null
                                :
                                    <View>
                                        {
                                            loadingHot
                                                ?
                                                <ActivityIndicator size={'small'} color={'#333'}/>
                                                :
                                                <View style={[CommonStyle.flexStart,{
                                                    flexWrap: 'wrap',
                                                    marginBottom: 10
                                                }]}>
                                                    {
                                                        hotCity.map((item, index) => {
                                                            return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                                                height:35,
                                                                paddingLeft: 10,
                                                                paddingRight: 10,
                                                                borderWidth: 1,
                                                                borderColor: '#f5f5f5',
                                                                marginRight: 15,
                                                                marginTop: 10,
                                                                borderRadius: 3
                                                            }]} onPress={() => {
                                                                this.clickCity(item.city)
                                                            }}>
                                                                <Text style={{
                                                                    color:'#666'
                                                                }}>{item.city}</Text>
                                                            </TouchableOpacity>
                                                        })
                                                    }
                                                </View>
                                        }
                                    </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

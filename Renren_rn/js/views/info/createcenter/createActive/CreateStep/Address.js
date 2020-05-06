import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import MenuContent from '../../../../../common/MenuContent';
import SideMenu from 'react-native-side-menu';
import Modal from 'react-native-modalbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast, {DURATION} from 'react-native-easy-toast';
import MapView, {
    Marker,
    Callout,
    AnimatedRegion,
} from 'react-native-maps';
import {Initializer, Geocode} from 'react-native-baidumap-sdk';
import Geolocation from 'react-native-geolocation-service';
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import action from '../../../../../action';
import NewHttp from '../../../../../utils/NewHttp';
const {width, height} = Dimensions.get('window');

class Address extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '提一提你们将到访的，对您个人有特殊意义的地方',
            '带参与者去只有当地人才知道的地方',
            '不要在热门地点举办稀松平常的活动',
            '不要过多地描述场地细节，向参与者简要说明即可'
        ];
        this.state = {
            isOpenning: false,
            nowAddress: '',
            goplace: '',
            goPlaceLat: '',
            goPlaceLng: '',
            goPlaceLatIcon: '',
            goPlaceLngIcon: '',
            country: '',
            country_id: '',
            province: '',
            province_id: '',
            city: '',
            city_id: '',
            goOtherWhere: '',
            isLoading: false
        }
        Initializer.init('qtmMN5Ps98kROk5UistKGfKyqHOncMxv').catch(e => console.log(e))
    }
    componentDidMount(){
        const {activity_id} = this.props;
        if(activity_id === '') {
            return
        } else {
            this.initData()
        }
    }
     initData() {
        const {changeStatus} = this.props;
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
           if(res.code === 1) {
                this.setState({
                    goOtherWhere: res.data.go_place,
                    province_id:res.data.province_id,
                    province:res.data.province,
                    city_id:res.data.city_id,
                    city:res.data.city,
                    country: res.data.country,
                    country_id: res.data.country_id,
                    goplace: res.data.set_address,
                    goPlaceLat: res.data.set_address_lat,
                    goPlaceLng: res.data.set_address_lng,
                    goPlaceLatIcon: parseFloat(res.data.set_address_lat),
                    goPlaceLngIcon: parseFloat(res.data.set_address_lng),
                }, () => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
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
    async changeAddress(latitudes, longitudes, val){
        const searchResult = await Geocode.reverse({ latitude: latitudes, longitude: longitudes });
         if(val) {
              this.setState({
                goplace: searchResult.address+searchResult.description,
                goPlaceLatIcon: searchResult.latitude,
                goPlaceLngIcon: searchResult.longitude,
            })
        } else {
              this.setState({
                nowAddress:searchResult,
                goPlaceLatIcon: searchResult.latitude,
                goPlaceLngIcon: searchResult.longitude,
            })
        }

    }
    async  changeAddressTitle(address, val){
        const searchResult = await Geocode.search(address);
         this.setState({
            goPlaceLatIcon: searchResult.latitude,
            goPlaceLngIcon: searchResult.longitude,
        })

    }
    _changeCoor(data) {
        this.changeAddress(data.coordinate.latitude, data.coordinate.longitude, true)
    }
    goNext(){
        const {nowAddress,country, province, city, goplace, goOtherWhere} = this.state;
        if(!this.state.isLoading) {
            if(!country || !province || !city) {
                this.refs.toast.show('请选择体验地点')
            }else if(!goOtherWhere) {
                this.refs.toast.show('参与者还将前往哪些地方')
            }else {
                this.saveAddress()
            }
        }
    }
    saveAddress() {
        this.setState({
            isLoading: true
        })
        const {activity_id} = this.props;
        const {nowAddress,country, province, city, goplace, goOtherWhere} = this.state;
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",activity_id);
        formData.append("step",10);
        formData.append("go_place",this.state.goOtherWhere);
        formData.append("country",this.state.country);
        formData.append("country_id",this.state.country_id);
        formData.append("province_id",this.state.province_id);
        formData.append("province",this.state.province);
        formData.append("city_id",this.state.city_id);
        formData.append("city",this.state.city);
        formData.append("isapp",1);
        formData.append("set_address",goplace?goplace:(nowAddress.address+nowAddress.description));
        formData.append("set_address_lng",this.state.goPlaceLatIcon);
        formData.append("set_address_lat",this.state.goPlaceLngIcon);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    isLoading: false
                });
                NavigatorUtils.goPage({}, 'Time')
            }
        });
    }
    changeGoPlace(text) {
        this.setState({
            goplace: text
        }, () => {
            this.changeAddressTitle(text)
        })
    }
    onClose() {
        this.refs.map.close()
    }
    choiceAddress(data) {
        this.setState({
            country: data.country,
            country_id: data.countryId,
            province: data.province,
            province_id: data.provinceId,
            city: data.city,
            city_id: data.cityId
        })
    }
    render(){
        const {theme} = this.props;
        const {isOpenning, nowAddress,country, province, city} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>;
        return(
            <SideMenu
                menu={menu}                    //抽屉内的组件
                isOpen={isOpenning}     //抽屉打开/关闭
                openMenuOffset={width*2/3}     //抽屉的宽度
                hiddenMenuOffset={0}          //抽屉关闭状态时,显示多少宽度 默认0 抽屉完全隐藏
                edgeHitWidth={50}              //距离屏幕多少距离可以滑出抽屉,默认60
                disableGestures={false}        //是否禁用手势滑动抽屉 默认false 允许手势滑动
                onChange={                   //抽屉状态变化的监听函数
                    (isOpen) => {
                        isOpen ?
                            this.setState({
                                isOpenning:true
                            })
                            :
                            this.setState({
                                isOpenning:false
                            })

                    }}
                menuPosition={'right'}     //抽屉在左侧还是右侧
                autoClosing={true}         //默认为true 如果为true 一有事件发生抽屉就会关闭
            >
                <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <CreateHeader title={'体验地点'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <KeyboardAwareScrollView style={{flex: 1}}>
                        <ScrollView>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor:'#fff',
                                paddingTop:20,
                                paddingBottom: 20,
                                justifyContent:'flex-start'}]}>
                                <View style={CommonStyle.commonWidth}>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize:16.8
                                    }}>小贴士</Text>
                                    <Prompt data={this.prompts}/>
                                </View>
                            </View>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor:'#fff',
                                height:64,
                                marginTop:10
                            }]}>
                                <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                    height:64
                                }]}>
                                    <Text style={[styles.main_title]}>选择行程的体验地点</Text>
                                    {
                                        country||province||city
                                        ?
                                            <Text style={{
                                                color:theme,
                                            }}
                                             onPress={()=>{this.picker.showPicker()}}
                                            >{country+province+city}</Text>
                                        :
                                            <TouchableOpacity
                                                style={[CommonStyle.flexCenter,styles.select_btn]}
                                                onPress={()=>{this.picker.showPicker()}}
                                            >
                                                <Text style={{
                                                    color:theme,
                                                    fontWeight:'bold',
                                                    fontSize: 13
                                                }}>选择</Text>
                                            </TouchableOpacity>
                                    }

                                </View>
                            </View>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor:'#fff',
                                height:64,
                                marginTop:10
                            }]}>
                                <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                    height:64
                                }]}>
                                    <Text style={[styles.main_title]}>选择集合地点</Text>

                                </View>
                            </View>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor: '#fff',
                                paddingBottom: 15,
                                marginTop: -10
                            }]}>
                                <TextInput
                                    placeholder={nowAddress
                                        ?
                                        nowAddress.address + nowAddress.description
                                        :
                                        "输入集合地点"}
                                    onChangeText={(text)=>this.changeGoPlace(text)}//输入框改变触发的函数
                                    defaultValue={this.state.goplace}
                                    style={[CommonStyle.commonWidth,{
                                        height: 40,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f5f5f5'
                                    }]}
                                />
                            </View>
                            <View style={styles.address_map}>
                                <MapView
                                    zoomTapEnabled={true}
                                    zoomEnabled={true}
                                    pitchEnabled={false}
                                    zoomControlEnabled={true}
                                    showsUserLocation={false}
                                    followsUserLocation={false}
                                    showsMyLocationButton={false}
                                    scrollEnabled={true}
                                    showsIndoorLevelPicker={false}
                                    loadingEnabled={false}
                                    userLocationAnnotationTitle={'我当前的位置'}
                                    region={{
                                        latitude: this.state.goPlaceLatIcon?this.state.goPlaceLatIcon: 30.095848083496094,
                                        longitude: this.state.goPlaceLngIcon?this.state.goPlaceLngIcon:103.83992004394531,
                                        latitudeDelta: 0.09,
                                        longitudeDelta: 0.09,
                                    }}
                                    onPress={() => {
                                        this.refs.map.open()
                                    }}
                                    style={{
                                        width:'100%',
                                        height: 180
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: this.state.goPlaceLatIcon?this.state.goPlaceLatIcon:30.095848083496094,
                                            longitude: this.state.goPlaceLngIcon?this.state.goPlaceLngIcon:103.83992004394531,
                                        }}
                                        tracksViewChanges={true}
                                    >
                                        <View style={CommonStyle.spaceCol}>
                                            <AntDesign
                                                name={'enviroment'}
                                                size={24}
                                                style={{color:this.props.theme}}
                                            />
                                        </View>
                                    </Marker>
                                </MapView>
                            </View>
                            <View style={[CommonStyle.flexCenter,{
                                backgroundColor:'#fff',
                                paddingTop:20,
                                paddingBottom: 20,
                                marginTop:10,
                                marginBottom:100,
                                justifyContent:'flex-start'}]}>
                                <View style={CommonStyle.commonWidth}>
                                    <Text style={[styles.main_title]}>
                                        体验期间，参与者还将前往哪些地方？
                                    </Text>
                                    <TextInput
                                        placeholder='请输入内容'
                                        editable={true}
                                        multiline={true}
                                        onChangeText={(text)=>this.setState({goOtherWhere: text})}//输入框改变触发的函数
                                        defaultValue={this.state.goOtherWhere}
                                        style={CommonStyle.long_input}/>
                                </View>
                            </View>
                            <RNEasyAddressPicker
                                hasCountry={true}
                                ref={picker => this.picker = picker}
                                selectCountry={(index) => {}}
                                selectCity={(index) => {}}
                                clickConfirmBtn={(data) => {this.choiceAddress(data)}}
                            />
                        </ScrollView>
                    </KeyboardAwareScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:theme
                            }]}
                                  onPress={()=>this.goNext()}
                            >
                                {
                                    this.state.isLoading
                                        ?
                                        <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
                                        :
                                        <Text style={{color:'#fff'}}>保存并继续</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    <Modal
                        style={{height:height,width:'100%',backgroundColor:'#fff'}}
                        ref={"map"}
                        animationDuration={200}
                        position={"bottom"}
                        backdropColor={'rgba(0,0,0,0.5)'}
                        swipeToClose={false}
                        onClosed={() => this.onClose()}
                        backdropPressToClose={false}
                        coverScreen={true}>
                        <View style={{width:width,height:height,backgroundColor:'#fff',borderRadius: 5}}>
                            <MapContainer closeMap={()=>{
                                this.refs.map.close()
                            }} changeCoor={(data)=>this._changeCoor(data)} {...this.state} {...this.props}/>
                        </View>
                    </Modal>

                </View>
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
    address_map:{
        width:'100%',
        height:180,
        backgroundColor: '#fff',
        marginTop: 10
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    activity_id: state.steps.activity_id
});
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
});
export default connect(mapStateToProps, mapDispatchToProps)(Address)

class MapContainer extends Component{
    clickMap(data) {
        this.props.changeCoor(data)
    }
    render() {
        return(
            <View style={{flex: 1}}>
                <MapView
                    zoomTapEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={false}
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                    followsUserLocation={false}
                    showsMyLocationButton={true}
                    scrollEnabled={true}
                    showsIndoorLevelPicker={false}
                    loadingEnabled={false}
                    userLocationAnnotationTitle={'我当前的位置'}
                    region={{
                        latitude: this.props.goPlaceLat,
                        longitude: this.props.goPlaceLng,
                        latitudeDelta: 0.09,
                        longitudeDelta: 0.09,
                    }}
                    onPress={e =>{
                        this.clickMap(e.nativeEvent)
                    }}
                    style={{
                        flex: 1
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: this.props.goPlaceLatIcon,
                            longitude: this.props.goPlaceLngIcon,
                        }}
                        title={this.props.nowAddress.address}
                        tracksViewChanges={true}
                    >

                    </Marker>
                </MapView>
                <SafeAreaView style={{
                    position:'absolute',
                    left:0,
                    top:0,
                    right:0,
                }}>
                    <View style={[CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                            <AntDesign
                                name={'close'}
                                size={20}
                                style={{color: '#333'}}
                                onPress={()=>{
                                    this.props.closeMap()
                                }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

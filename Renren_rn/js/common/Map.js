import React,{Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity,Dimensions} from 'react-native';
import MapView,{
    Marker,
    Callout,
    AnimatedRegion,
} from 'react-native-maps';
import CommonStyle from '../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../navigator/NavigatorUtils';
import GlobalMap from '../views/map/GlobalMap';
const screen = Dimensions.get('window');

export default class Map extends Component{
    constructor(props) {
        super(props);
        this.ASPECT_RATIO = screen.width / screen.height;
        this.LATITUDE =this.props.navigation.state.params.set_address_lat;
        this.LONGITUDE = this.props.navigation.state.params.set_address_lng;
        this.LATITUDE_DELTA = 0.0922;
        this.LONGITUDE_DELTA = this.LATITUDE_DELTA * this.ASPECT_RATIO;
        this.TITLE = this.props.navigation.state.params.set_address;
        this.state = {
            coordinate: new AnimatedRegion({
                latitude: this.LATITUDE,
                longitude: this.LONGITUDE,
            }),
            isGlobal: false
        }
    }
    regionChange(){

    }
    animate() {
        const { coordinate } = this.state;
        const newCoordinate = {
            latitude: this.LATITUDE + (Math.random() - 0.5) * (this.LATITUDE_DELTA / 2),
            longitude: this.LONGITUDE + (Math.random() - 0.5) * (this.LONGITUDE_DELTA / 2),
        };

        if (Platform.OS === 'android') {
            if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }
    render(){
        const {isGlobal} = this.state;
        return(
            <SafeAreaView style={{flex: 1,backgroundColor:'#fff'}}>
                <View style={{flex: 1,position:'relative'}}>
                    <SafeAreaView style={[styles.header_con,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.flexCenter,{
                            height: 60
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:45,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 5
                            }]}>
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
                                <TouchableOpacity style={{
                                    paddingRight: 10,
                                }}>
                                    <AntDesign
                                        name={'earth'}
                                        size={20}
                                        style = {{color:'#333'}}
                                        onPress={()=>{
                                            NavigatorUtils.goPage({},'GlobalMap')
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                    <View style={styles.map_view}>
                        <MapView
                            provider={this.props.provider}
                            zoomTapEnabled={true}
                            zoomEnabled={true}
                            pitchEnabled={false}
                            zoomControlEnabled={true}
                            scrollEnabled={true}
                            rotateEnabled={true}
                            showsUserLocation={false}
                            followsUserLocation={false}
                            showsMyLocationButton={false}
                            enableZoomControl={true}
                            userLocationAnnotationTitle={'我当前的位置'}
                            showsIndoorLevelPicker={false}
                            loadingEnabled={false}
                            onRegionChangeComplete={()=>this.regionChange()}
                            initialRegion={{
                                latitude: this.LATITUDE,
                                longitude: this.LONGITUDE,
                                latitudeDelta: this.LATITUDE_DELTA,
                                longitudeDelta: this.LONGITUDE_DELTA,

                            }}
                            style={{
                                flex: 1,
                                position:'relative'
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: this.LATITUDE,
                                    longitude: this.LONGITUDE,
                                }}
                                tracksViewChanges={true}
                                ref={markerRef => this.markerRef = markerRef}
                                stopPropagation={true}
                                onPress={()=>{}}
                            >
                                <AntDesign
                                    name={'enviroment'}
                                    size={32}
                                    style={{color:'#14c5ca'}}
                                />
                                <Callout>
                                    <View style={{padding:0,minWidth:100}}>
                                        <Text style={{color:'#333',lineHeight:20}}>{this.TITLE}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        </MapView>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    header_con: {
        position:'absolute',
        left:0,
        right:0,
        top: 0,
        zIndex: 9
    },
    map_view: {
        position:'absolute',
        left:0,
        top:60,
        bottom:0,
        right:0
    }
})

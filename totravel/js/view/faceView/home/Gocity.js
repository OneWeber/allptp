import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    StatusBar,
    Platform,
    FlatList,
    ImageBackground,
    TouchableHighlight
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const city=[
    {
        img:'https://b1-q.mafengwo.net/s11/M00/3B/41/wKgBEFpTIjaADHLRAAbM9KsUwLs31.jpeg?imageMogr2%2Fthumbnail%2F%21310x207r%2Fgravity%2FCenter%2Fcrop%2F%21310x207%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cHM6Ly9iMS1xLm1hZmVuZ3dvLm5ldC9zMTEvTTAwLzQ0LzlCL3dLZ0JFRnNQNVJ5QUR2N3BBQUFIWlpVUFJsUTk5MC5wbmc%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
        title:'成都',
        activeNum:130
    },
    {
        img:'https://b1-q.mafengwo.net/s10/M00/C7/DF/wKgBZ1kD96yAJcNQABCCx4gFoHM38.jpeg?imageMogr2%2Fthumbnail%2F%21310x207r%2Fgravity%2FCenter%2Fcrop%2F%21310x207%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cHM6Ly9iMS1xLm1hZmVuZ3dvLm5ldC9zMTEvTTAwLzQ0LzlCL3dLZ0JFRnNQNVJ5QUR2N3BBQUFIWlpVUFJsUTk5MC5wbmc%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
        title:'东京',
        activeNum:130
    },
    {
        img:'https://n1-q.mafengwo.net/s11/M00/16/4D/wKgBEFpK6YyABrCXAAI3DtEwBSo77.jpeg?imageMogr2%2Fthumbnail%2F%21310x202r%2Fgravity%2FCenter%2Fcrop%2F%21310x202%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cHM6Ly9iMS1xLm1hZmVuZ3dvLm5ldC9zMTEvTTAwLzQ0LzlCL3dLZ0JFRnNQNVJ5QUR2N3BBQUFIWlpVUFJsUTk5MC5wbmc%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
        title:'慕尼黑',
        activeNum:130
    },
    {
        img:'https://n1-q.mafengwo.net/s8/M00/4F/3D/wKgBpVYnldyAHFasAA3At4Djx4E57.jpeg?imageMogr2%2Fthumbnail%2F%21310x207r%2Fgravity%2FCenter%2Fcrop%2F%21310x207%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cHM6Ly9iMS1xLm1hZmVuZ3dvLm5ldC9zMTEvTTAwLzQ0LzlCL3dLZ0JFRnNQNVJ5QUR2N3BBQUFIWlpVUFJsUTk5MC5wbmc%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
        title:'汉堡',
        activeNum:130
    }
]
export  default  class Gocity extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    toCity(){
        this.props.navigate('City')
    }
    _renderCity(data){
        return <TouchableHighlight
            style={{
                marginLeft:data.index==0?widthScreen*0.03:10,
                marginRight:data.index==city.length - 1?widthScreen*0.03:0
            }}
            underlayColor='rgba(255,255,255,.3)'
            onPress={() =>{this.toCity()}}
        >
        <View style={[styles.cityLi]}>
            <ImageBackground
                source={{uri:data.item.img}}
                style={[commonStyle.flexContent]}
            >
                <View style={[commonStyle.flexContent,commonStyle.flexBottom,{backgroundColor:'rgba(0,0,0,.2)',alignItems:'flex-start'}]}>
                    <Text style={{
                        paddingLeft:10,
                        paddingRight:10,
                        color:'#ffffff',
                        fontSize:16,
                        fontWeight: "bold"
                    }}
                    numberOfLines={1} ellipsizeMode={'tail'}
                    >{data.item.title}</Text>
                    <Text style={{
                        paddingLeft:10,
                        paddingRight:10,
                        color:'#ffffff',
                        fontSize:12,
                        marginBottom:10,
                        marginTop:5
                    }}
                     numberOfLines={1} ellipsizeMode={'tail'}>
                        共{data.item.activeNum}个体验
                    </Text>
                </View>
            </ImageBackground>
        </View>
        </TouchableHighlight>
    }
    render(){
        return(
            <View style={{width:widthScreen,marginTop:20}}>
                <FlatList
                    data={city}
                    horizontal={true}
                    renderItem={(data)=>this._renderCity(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
const styles=StyleSheet.create({
    cityLi:{
        width:125,
        height:155,
        borderRadius:5,
        overflow:'hidden'
    }
})

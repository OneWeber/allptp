import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    AsyncStorage,
    Platform
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import Carousel, { ParallaxImage,Pagination } from 'react-native-snap-carousel';
import HttpUtils from "../../../../https/HttpUtils";
import HttpUrl from "../../../../https/HttpUrl"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export  default  class Homebanner extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            token:'',
            entries:[

            ],
            activeSlide:1,
            bannerList:[]
        }
    }
    componentWillMount(): void {
        AsyncStorage.getItem('token',(error,result)=>{
            this.setState({
                token:result
            },()=>{
                this.getHomeBanner()
            })
        })
    }
    getHomeBanner(){//获取主页banner图
        let formData=new FormData();
        formData.append('token',this.state.token);
        formData.append('flag',0);
        HttpUtils.post(HttpUrl+'Banner/bannerlist',formData).then(
            result=>{
                if(result.code==1){
                    this.setState({
                        bannerList:result.data
                    },()=>{
                        let entriesList=[];
                        let banner=this.state.bannerList;
                        for(let i=0;i<banner.length;i++){
                            entriesList.push({
                                thumbnail:banner[i].image.domain+banner[i].image.image_url,
                                title:banner[i].text
                            })
                        }
                        this.setState({
                            entries:entriesList
                        })
                    })
                }
            }
        ).catch(
            err=>{
                console.log(err)
            }
        )
    }
    _renderItem ({item, index}, parallaxProps) {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.thumbnail }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <Text style={styles.title} numberOfLines={2}>
                    { item.title }
                </Text>
            </View>
        );
    }
    render(){
        return(
            <View style={{width:widthScreen,height:180}}>
                <Carousel
                    sliderWidth={widthScreen}
                    sliderHeight={180}
                    itemWidth={widthScreen - 60}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    hasParallaxImages={true}
                    autoplay={true}
                    loop={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    activeSlideOffset={0}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                />

            </View>
        )
    }
}
const styles=StyleSheet.create({
    item: {
        width: widthScreen - 60,
        height: 180,
        position:'relative'
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    title:{
        position:'absolute',
        fontSize:18,
        color:'#fff',
        fontWeight:'bold',
        left:10,
        top:10,
        right:10
    }
})

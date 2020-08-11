import React, {Component} from 'react';
import {

    View,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class VideoSwiper extends Component<Props>{
    constructor(props){
        super(props);
        this.state={
            data:this.props.navigation.state.params.data,
            videoArr:[],
            rate: 1,
            volume: 1,
            muted: true,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
            videoIndex:this.props.navigation.state.params.index
        }
    }
    componentWillMount(){

    }
    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#000000'}}>
                <View style={{position:'relative',width:widthScreen,height:heightScreen}}>
                    <View style={{width:widthScreen,height:heightScreen*0.9,backgroundColor:'#000000',position:"relative"}}>
                        <VideoPlayer
                            onBack={()=>this.props.navigation.goBack()}
                            source={{ uri: this.state.data[this.state.videoIndex].domain+this.state.data[this.state.videoIndex].image_url}}
                            disableVolume={false}
                        />

                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

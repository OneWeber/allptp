import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    FlatList,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Video from 'react-native-video';
import {connect} from 'react-redux';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
class Videos extends Component{
    constructor(props){
        super(props);
        this.state={
            rate: 1,
            volume: 1,
            muted: true,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
        }
    }
    _renderItem(data){
        return <View style={{width:widthScreen*0.94,marginTop:15,position:'relative',height:140}}>
            <Video
                ref={(ref: Video) => { //方法对引用Video元素的ref引用进行操作
                    this.video = ref
                }}
                source={{ uri:data.item.domain+data.item.image_url, type: 'mpd' }}
                // source={require('../../background.mp4')}//设置视频源
                style={{position:'absolute',left:0,right:0,top:0,bottom:0,borderRadius:10,backgroundColor:'#f5f5f5'}}//组件样式
                rate={this.state.rate}//播放速率
                paused={this.state.paused}//暂停
                volume={this.state.volume}//调节音量
                muted={this.state.muted}//控制音频是否静音
                resizeMode={this.state.resizeMode}//缩放模式
                repeat={true}//确定在到达结尾时是否重复播放视频。
                resizeMode={"cover"}
            />
            <TouchableHighlight
                underlayColor='rgba(0,0,0,.1)'
                style={{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,.1)',justifyContent:'center',alignItems:'center',borderRadius:10}}
                onPress={() =>{this.props.navigate("VideoSwiper",{data:this.props.videoData,index:data.index})}}
            >
                <AntDesign
                    name="playcircleo"
                    size={40}
                    style={{color:this.props.theme}}
                />
            </TouchableHighlight>

        </View>
    }
    render(){
        return(
            <View style={{flex:1}}>
                {
                    this.props.videoData.length>0
                        ?
                        <FlatList
                            data={this.props.videoData}
                            horizontal={false}
                            renderItem={(data)=>this._renderItem(data)}
                            showsHorizontalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <View style={{flex:1,backgroundColor:'#ffffff',justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color:'#666666',fontSize:14,marginTop:15}}>暂无视频</Text>
                        </View>
                }

            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Videos)

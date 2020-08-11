import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    StatusBar,
    SafeAreaView, TouchableOpacity,
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Toast, {DURATION} from 'react-native-easy-toast';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomTabBar from '../../model/CustomeTabBar';
import {connect} from 'react-redux';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../assets/css/Common_css';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import Pic from './picvideo/Pic';
import Video from './picvideo/Video';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
class MorePicVideo extends Component<Props>{
    constructor(props){
        super(props);
        this.state={
            data:this.props.navigation.state.params.data,
            picData:[],
            videoData:[],
        }
    }
    componentWillMount(){
        let pic=[];
        let video=[];
        const list = ['MP3','MP4','AVI','MOV', 'ASF', 'WMV', 'VOB', '3GP', 'SWF', 'MKV', 'FLV','RMVB','WEBM','F4V'];
        for(let i=0;i<this.state.data.length;i++){
            if(list.indexOf(this.state.data[i].extension.toUpperCase())> -1) {
                video.push(this.state.data[i])
            }else{
                pic.push(this.state.data[i])
            }
        }
        pic.unshift({
            domain:this.props.navigation.state.params.domain,
            image_url:this.props.navigation.state.params.image_url,
        })

        this.setState({
            picData:pic,
            videoData:video,

        },()=>{
            //alert(JSON.stringify(this.props.navigation.state.params.domain))
        })

    }
    getLeftButton(){
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
    render(){
        return(
            <SafeAreaView style={styles.safeArea}>
                <Toast ref="toast" position='center' positionValue={0} />
                <View style={{flex:1}}>
                    <RNEasyTopNavBar
                        title={'更多图片与视频'}
                        backgroundTheme={'#fff'}
                        titleColor={'#333'}
                        leftButton={this.getLeftButton()}
                    />
                    <ScrollableTabView
                        renderTabBar={() => (<CustomTabBar
                            backgroundColor={'#ffffff'}
                            locked={true}
                            scrollWithoutAnimation={true}
                            tabUnderlineDefaultWidth={25}
                            tabUnderlineScaleX={6} // default 3
                            activeColor={this.props.theme}
                            style={{borderBottomWidth:0,borderBottomColor:"#f5f5f5"}}
                            inactiveColor={"#999"}
                        />)}>

                        <View tabLabel='图片' style={styles.homeSlider}>
                            <Pic navigate={this.props.navigation.navigate} picData={this.state.picData} data={this.state.data} />
                        </View>
                        <View tabLabel='视频' style={styles.homeSlider}>
                            <Video navigate={this.props.navigation.navigate} videoData={this.state.videoData}/>
                        </View>
                    </ScrollableTabView>


                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    safeArea: {
        flex:1,
        backgroundColor: '#ffffff',
        position:"relative",
    },
    journeyCon:{
        flex:1,
        backgroundColor:"#ffffff",
        position:"relative"
    },
    wishHeader:{
        width:widthScreen,
        height:50,
        backgroundColor:"#ffffff",
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:"#f5f5f5"
    },
    wishHeaderCon:{
        width:"92%",
        height:50,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
    },
    homeSlider:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(MorePicVideo)

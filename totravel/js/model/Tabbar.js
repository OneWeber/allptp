import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    Platform,
    Animated,
    Easing,
    TouchableHighlight
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
const  widthScreen= Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const X_WIDTH = 375;
const X_HEIGHT = 812;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

export default class MyTabBar extends Component {
    /*static propTypes = {
        goToPage: PropTypes.func, // 跳转到对应tab的方法
        activeTab: PropTypes.number, // 当前被选中的tab下标
        tabs: PropTypes.array, // 所有tabs集合
        tabNames: PropTypes.array, // 保存Tab名称
        tabIconNames: PropTypes.array, // 保存Tab图标
    };*/
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0);
        this.state={
            isIphoneX:false,
            isShow:false
        }
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
        this.isIphoneX();
    }
    spin(){
        if(!this.state.isShow){
            this.spinValue.setValue(0)
        }else{
            this.spinValue.setValue(1)
        }
        Animated.timing(this.spinValue,{
            toValue:this.state.isShow?0:1, // 最终值 为1，这里表示最大旋转 360度
            duration: 300,
            easing: Easing.linear
        }).start()
        this.setState({
            isShow:!this.state.isShow
        },()=>{

        })
    }
    setAnimationValue({value}) {
        console.log('动画值：'+value);
    }
    isIphoneX(){
        if(Platform.OS === 'ios'&&((heightScreen === X_HEIGHT && widthScreen === X_WIDTH) || (heightScreen === X_WIDTH && widthScreen === X_HEIGHT))){
            this.setState({
                isIphoneX:true
            })
        }else{
            this.setState({
                isIphoneX:false
            })
        }
    }
    closeSpin(){
        this.setState({
            isShow:false
        },()=>{
            this.spinValue.setValue(1)
            Animated.timing(this.spinValue,{
                toValue:0, // 最终值 为1，这里表示最大旋转 360度
                duration: 300,
                easing: Easing.linear
            }).start();
            this.props.showNav(!this.state.isShow)
        })
    }
    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '45deg'] //输出值
        })
        return (
            <View style={[styles.tabs,{height:this.state.isIphoneX?85:55}]}>
                <View style={{width:widthScreen,flexDirection:"row",height:55}}>
                    {
                        this.props.tabs.map((tab, i) => {
                            return <View style={styles.tab}>
                                {
                                    i==2
                                        ?
                                        <TouchableHighlight
                                            style={styles.tabItem}
                                            underlayColor='rgba(255,255,255,.7)'
                                            onPress={()=>{this.spin();this.props.showNav(this.state.isShow)}}
                                        >
                                        <View style={[styles.tabItem,{position:'relative'}]}>
                                            <View style={{width:'100%',height:24,position:'relative'}}>
                                                <View style={{
                                                    width:45,
                                                    height:45,
                                                    borderRadius:22.5,
                                                    shadowColor: '#000000',
                                                    shadowOffset: {h: 5, w: 5},
                                                    shadowRadius: 3,
                                                    shadowOpacity: 0.1,
                                                    position:'absolute',
                                                    top:-22.5,
                                                    left:(widthScreen/5-45)/2,
                                                    backgroundColor:'#fff',
                                                    justifyContent: 'center',
                                                    alignItems:'center'
                                                }}>
                                                    <Animated.View style={{
                                                        width:40,
                                                        height:40,
                                                        borderR:20,
                                                        backgroundColor:'#4db6ac',
                                                        borderRadius:20,
                                                        justifyContent: 'center',
                                                        alignItems:'center',
                                                        transform:[{rotate:spin}]
                                                    }}>
                                                        <AntDesign
                                                            name={'plus'}
                                                            size={20}
                                                            style={{color:'#fff'}}
                                                        />
                                                    </Animated.View>
                                                </View>
                                            </View>
                                            <Text style={{color: this.props.activeTab == i ? "#4db6ac" : "#666666",fontSize:12,marginTop:5}}>
                                                发布
                                            </Text>
                                        </View>
                                        </TouchableHighlight>
                                        :
                                        //因为要有点击效果 所以要引入可触摸组件
                                        <TouchableOpacity onPress={()=>this.props.goToPage(i)} style={styles.tab} key={tab}>
                                            <View style={styles.tabItem}>
                                                <SimpleLineIcons
                                                    name={this.props.tabIconNames[i]} // 图标 调用传入的属性
                                                    size={20}
                                                    color={this.props.activeTab == i ? "#4db6ac" : "#666666"}/>
                                                <Text style={{color: this.props.activeTab == i ? "#4db6ac" : "#666666",fontSize:12,marginTop:5}}>
                                                    {this.props.tabNames[i]}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View>
                        })
                    }
                </View>
                {
                    this.state.isShow
                    ?
                        <TouchableHighlight
                            style={{
                                position:'absolute',
                                left:0,
                                right:0,
                                top:-(heightScreen-75),
                                bottom:0,
                                zIndex:10,
                                backgroundColor:'rgba(0,0,0,0)'
                            }}
                            underlayColor='rgba(255,255,255,0)'
                            onPress={()=>{this.closeSpin()}}
                        >
                        <View>
                        </View>
                        </TouchableHighlight>
                    :
                        null
                }

            </View>

        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        height: 55,
        backgroundColor:'#ffffff',
        shadowColor: '#000000',
        shadowOffset: {h: 5, w: 5},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width:widthScreen*0.2
    },

})

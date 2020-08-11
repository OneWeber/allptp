import React,{Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableNativeFeedback,
    TouchableOpacity,
    Platform,
    StatusBar,
    Dimensions,
    SafeAreaView
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
const widthScreen = Dimensions.get('window').width;
export default class CustomTabBar extends Component {
    constructor(props: TabBarProps) {
        super(props);

        this.state = {
            activeDefaultColor: '#08086b',
            inactiveDefaultColor: '#666666'
        }
    }

    _renderTab(name, page, isTabActive, onPressHandler) {
        const { textStyle } = this.props;
        const textColor = isTabActive ? this.props.activeColor : this.props.inactiveColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        const fontSize= this.props.isLarge?isTabActive ? 20 : 16 : this.props.isWishLarge?isTabActive ? 16 : 15 :null;
        const Button = Platform.OS == 'ios' ? ButtonIos : ButtonAndroid;
        return (<Button
            style={{flex: 1}}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={styles.tab}>
                <View style={{position:'relative'}}>
                    <Text style={[{color: textColor, fontWeight,fontSize} ]}>
                        {name}
                    </Text>
                    {
                        page==1&&this.props.isHome
                            ?
                            <View style={{width:5,height:5,borderRadius:2.5,backgroundColor:'red',position:'absolute',right:-3,top:-3}}></View>
                            :
                            null
                    }

                </View>

            </View>
        </Button>);
    }

    _renderUnderline() {
        const containerWidth =this.props.isPreferential?widthScreen-100:this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const underlineWidth = this.props.tabUnderlineDefaultWidth ? this.props.tabUnderlineDefaultWidth : containerWidth / (numberOfTabs * 2);
        const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 3;
        const deLen = (containerWidth / numberOfTabs - underlineWidth ) / 2;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: underlineWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: this.props.lineColor?this.props.lineColor:this.props.activeColor,
            bottom: 3,
            left: deLen
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });

        const scaleValue = (defaultScale) => {
            let number = 6
            let arr = new Array(number * 2)
            return arr.fill(0).reduce(function(pre, cur, idx){
                idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx-1] + 0.5);
                idx%2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1)
                return pre
            }, {inputRange: [], outputRange: []})
        }

        const scaleX = this.props.scrollValue.interpolate(scaleValue(scale));

        return(
            <Animated.View
                style={[
                    tabUnderlineStyle,
                    {
                        transform: [
                            { translateX },
                            { scaleX }
                        ],
                    },
                    this.props.underlineStyle,
                ]}
            />
        )
    }

    render() {
        return (
            <SafeAreaView style={{
                backgroundColor: this.props.sabackgroundColor,
                justifyContent:'space-between',
                alignItems: 'center',
                flexDirection: 'row'}}>
                {
                    this.props.isPreferential
                    ?
                        <View style={{width: 40}}>
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333',marginLeft:widthScreen*0.03}}
                                onPress={()=>{
                                    this.props.navigation.goBack()
                                }}
                            />
                        </View>
                    :
                        null
                }
                <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,height:this.props.isPreferential?50:40,width:this.props.isPreferential?widthScreen-100:'100%'}, this.props.style]}>
                    <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor,width:"100%",height:this.props.isPreferential?50:40}, this.props.style]}>
                        {this.props.tabs.map((name, page) => {
                            const isTabActive = this.props.activeTab === page;
                            return this._renderTab(name, page, isTabActive, this.props.goToPage)
                        })}
                    </View>
                    {this._renderUnderline()}

                </View>
                {
                    this.props.isPreferential
                    ?
                        <View style={{
                            width: 40,
                            justifyContent:'flex-end',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>

                        </View>
                    :
                        null
                }

            </SafeAreaView>
        );
    };
}



const ButtonAndroid = (props) => (
    <TouchableNativeFeedback
        delayPressIn={0}
        background={TouchableNativeFeedback.SelectableBackground()}
        {...props}
    >
        {props.children}
    </TouchableNativeFeedback>);

const ButtonIos = (props) => (<TouchableOpacity {...props}>
    {props.children}
</TouchableOpacity>);


const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        height:40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#f4f4f4',
    },
});

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,

} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomTabBar from '../../model/CustomTabBar'
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Trip extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,position:'relative'}}>
                <View style={{flex:1}}>
                    <ScrollableTabView
                        renderTabBar={() => (<CustomTabBar
                            backgroundColor={'#ffffff'}
                            locked={true}
                            scrollWithoutAnimation={true}
                            tabUnderlineDefaultWidth={25}
                            tabUnderlineScaleX={6} // default 3
                            activeColor={"#4db6ac"}
                            style={{borderBottomWidth:0,borderBottomColor:"#f5f5f5",fontSize:16}}
                            inactiveColor={"#666666"}
                            isLarge={true}
                        />)}>
                        <View tabLabel='未开始' style={styles.homeSlider}>

                        </View>
                        <View tabLabel='进行中' style={styles.homeSlider}>

                        </View>
                        <View tabLabel='已参加' style={styles.homeSlider}>

                        </View>
                    </ScrollableTabView>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    homeSlider:{
        flex:1
    }
})

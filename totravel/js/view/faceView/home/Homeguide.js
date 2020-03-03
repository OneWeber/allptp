import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    FlatList
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
//===================================这个页面需要判断用户点击的是推荐体验还是我喜欢的体验而请求对应的数据。
const guide=[
    {
        icon:require('../../../../res/image/data/renwu.png'),
        title:'人物'
    }
]
export  default  class Homeguide extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <View style={[commonStyle.flexSpace,{marginTop:25,width:'100%'}]}>
                {
                    guide.map((item,index)=>{
                        return <View style={commonStyle.flexCenter}>
                            <Image source={item.icon}/>
                            <Text style={{marginTop:5,color:'#333333'}}>{item.title}</Text>
                        </View>
                    })
                }
            </View>
        )
    }
}
const styles=StyleSheet.create({

})

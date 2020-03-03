import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
    ImageBackground
} from 'react-native';
import commonStyle from "../../../../res/js/Commonstyle"
import LazyImage from 'animated-lazy-image';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Story extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <View style={{width:'100%',marginTop:25,height:180,borderRadius:5,overflow:'hidden'}}>
                <ImageBackground
                    source={{uri:this.props.articleList.cover?this.props.articleList.cover.domain+this.props.articleList.cover.image_url:null}}
                    style={[commonStyle.flexBottom,{width:'100%',height:180}]}
                >
                    <View style={{width:'90%',marginBottom:20}}>
                        <Text style={{
                            color:'#fff',
                            fontWeight: 'bold',
                            fontSize:18}}
                            numberOfLines={1} ellipsizeMode={'tail'}
                        >{this.props.articleList.title}</Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}
const styles = StyleSheet.create({

})

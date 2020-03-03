import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types'
import commonStyle from "../../res/js/Commonstyle"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export  default  class Sizeswiper extends Component<Props>{
    constructor(props) {
        super(props);
        this.state={
            currentPage:1
        }
    }
    static PropTypes = {
        swiperList:PropTypes.array.isRequired
    }
    static defaultProps = {
        swiperList:[]
    }
    _onScrollEndDrag(){

    }
    _onAnimationEnd(e){
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor(offsetX / widthScreen)+1;
        if(pageIndex>3 || pageIndex==1)pageIndex=1;
        this.setState({
            currentPage:pageIndex
        })
    }
    render(){
        return(
            <ScrollView
                style = {{height:160,
                    width: widthScreen,
                    marginHorizontal: 0,
                    marginTop: 10}}
                ref = 'scrollview'
                horizontal = {true}
                showsHorizontalScrollIndicator = {false}
                pagingEnabled = {true}
                onMomentumScrollEnd = {(e) => {
                    this._onAnimationEnd(e)
                }}
            >

                {
                    this.props.children.map((item,index)=>{
                        return <View style={[
                            commonStyle.flexContent,
                            {backgroundColor:'red',
                                width: widthScreen - 40,
                                height:230,
                                marginLeft:index==0? widthScreen*0.02: this.props.horNum? 15 : 5,
                                marginRight: index==this.props.children.length-1? widthScreen*0.02: 0,
                            }]}>

                        </View>
                    })
                }



            </ScrollView>
        )
    }
}

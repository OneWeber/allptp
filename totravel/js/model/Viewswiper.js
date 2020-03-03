import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions, FlatList
} from 'react-native';
import PropTypes from 'prop-types'
import commonStyle from "../../res/js/Commonstyle"
type Props = {};
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export  default  class Viewswiper extends Component<Props>{
    constructor(props) {
        super(props);
        let timer=null
        this.state={
            currentPage:1,
            titleIndex:0
        }
    }
    changeTitle(index){
        this.setState({
            titleIndex:index,
            currentPage:index+1
        },()=>{
            this._startTimer()
        })
    }
    _onScrollEndDrag(){
        let getNowPage = 1
    }
    _onAnimationEnd(e){
        let offsetX = e.nativeEvent.contentOffset.x;
        let pageIndex = Math.floor((offsetX/0.96) / (widthScreen*0.96))+1;
        if(pageIndex> this.props.titleList.length || pageIndex<0.93)pageIndex=0;
        this.setState({
            currentPage:pageIndex,
            titleIndex:pageIndex-1
        })
    }
    _startTimer(){
        clearTimeout(this.timer);
        let scrollView = this.refs.scrollview;
        this.timer = setTimeout(()=>{
            let imageCount = this.props.titleList.length;
            let activePage = 1;
            activePage = this.state.currentPage;
            let offsetX = (activePage - 1)*widthScreen;
            let allWidth = widthScreen*(imageCount-1);
            if(offsetX>allWidth)offsetX=0;
            scrollView.scrollResponderScrollTo({x:offsetX,y:0,animated:true});
            this.setState({
                currentPage:activePage
            },()=>{
                clearTimeout(this.timer)
            })
        })
    }
    render(){
        const { titleList } =this.props;
        const titleView=[];
        for(let i=0;i<titleList.length;i++){
            titleView.push(
                <View style={[commonStyle.flexCenter,{marginLeft:i==0?0:15}]} key={i}>
                    <Text style={{
                        fontSize:this.state.titleIndex==i?18:14,
                        fontWeight: this.state.titleIndex==i?'bold':'normal',
                        color:this.state.titleIndex==i?'#333333':'#999999',

                    }}
                          onPress={()=>this.changeTitle(i)}
                    >{titleList[i]}</Text>
                </View>
            )
        }
        return(
            <View style={{width:'100%'}}>
                <ScrollView horizontal={true}>
                    {titleView}
                </ScrollView>
                <ScrollView
                    style = {{width:'100%'}}
                    ref = 'scrollview'
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    pagingEnabled = {true}
                    onScrollEndDrag = {()=>{
                        this._onScrollEndDrag()
                    }}
                    onMomentumScrollEnd = {(e) => {
                        this._onAnimationEnd(e)
                    }}
                >
                    {this.props.children}
                </ScrollView>
            </View>
        )
    }
}

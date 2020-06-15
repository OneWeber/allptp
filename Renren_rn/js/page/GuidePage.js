import React,{Component} from 'react';
import {View, Alert, Dimensions} from 'react-native';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AppIntro from 'react-native-app-intro';
export default class GuidePage extends Component{
    onSkipBtnHandle = (index) => {

    }
    doneBtnHandle = () => {
        NavigatorUtils.resetToHomePage(this.props)
    }
    nextBtnHandle = (index) => {

    }
    onSlideChangeHandle = (index, total) => {

    }
    render(){
        const pageArray = [{
            title: '成为策划人',
            description: '玩乐收益两不误',
            img: require('../../assets/images/guide/cwchr.png'),
            imgStyle: {
                height: 150 * 2.5,
                width: 109 * 2.5,
                marginTop: 30
            },
            backgroundColor: '#fff',
            fontColor: '#333',
            level: 10,
        }, {
            title: '加入志愿者',
            description: '发现更多有趣体验',
            img: require('../../assets/images/guide/jrzyz.png'),
            imgStyle: {
                height: 150 * 2.5,
                width: 109 * 2.5,
                marginTop: 30
            },
            backgroundColor: '#fff',
            fontColor: '#333',
            level: 10,
        },{
            title: '发布故事',
            description: '分析旅途回忆',
            img: require('../../assets/images/guide/fbgs.png'),
            imgStyle: {
                height: 150 * 2.5,
                width: 109 * 2.5,
                marginTop: 30
            },
            backgroundColor: '#fff',
            fontColor: '#333',
            level: 10,
        },{
            title: '参与体验',
            description: '变身玩乐达人',
            img: require('../../assets/images/guide/cyty.png'),
            imgStyle: {
                height: 150 * 2.5,
                width: 109 * 2.5,
                marginTop: 30
            },
            backgroundColor: '#fff',
            fontColor: '#333',
            level: 10,
        }];
        NavigatorUtils.navigation = this.props.navigation
        return(
            <View style={{flex: 1}}>
                <AppIntro
                    onNextBtnClick={this.nextBtnHandle}
                    onDoneBtnClick={this.doneBtnHandle}
                    onSkipBtnClick={this.onSkipBtnHandle}
                    onSlideChange={this.onSlideChangeHandle}
                    pageArray={pageArray}
                />
            </View>
        )
    }
}

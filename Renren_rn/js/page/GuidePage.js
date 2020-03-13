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
            title: 'Page 1',
            description: 'Description 1',
            img: 'https://goo.gl/Bnc3XP',
            imgStyle: {
                height: 80 * 2.5,
                width: 109 * 2.5,
            },
            backgroundColor: '#fa931d',
            fontColor: '#fff',
            level: 10,
        }, {
            title: 'Page 2',
            description: 'Description 2',
            img: 'https://goo.gl/Bnc3XP',
            imgStyle: {
                height: 93 * 2.5,
                width: 103 * 2.5,
            },
            backgroundColor: '#a4b602',
            fontColor: '#fff',
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

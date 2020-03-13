import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs'
import HomePage from '../page/viewpage/HomePage';
import FavoritePage from '../page/viewpage/FavoritPage';
import TravelPage from '../page/viewpage/TravelPage';
import MsgPage from '../page/viewpage/MsgPage';
import MyPage from '../page/viewpage/MyPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
const TABS = {
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarIcon:({tintColor, focused}) => (
                <MaterialCommunityIcons
                    name={'home'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '心愿单',
            tabBarIcon:({tintColor, focused}) => (
                <MaterialCommunityIcons
                    name={'chart-bubble'}
                    size={26}
                    style={{color:tintColor}}
                />
            )

        }
    },
    TravelPage: {
        screen: TravelPage,
        navigationOptions: {
            tabBarLabel: '旅途',
            tabBarIcon:({tintColor, focused}) => (
                <MaterialCommunityIcons
                    name={'beach'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    MsgPage: {
        screen: MsgPage,
        navigationOptions: {
            tabBarLabel: '消息',
            tabBarIcon:({tintColor, focused}) => (
                <MaterialCommunityIcons
                    name={'comment-processing'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon:({tintColor, focused}) => (
                <MaterialIcons
                    name={'account-circle'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    }
}
export default class ViewBotNavigator extends Component{
    _tabNavigator() {
        if(this.Tabs) {
            return this.Tabs
        }
        return this.Tabs = createAppContainer(createBottomTabNavigator(
            TABS, {
                tabBarComponent: props => {
                    return <TabBar {...props} />
                }
            }
        ))
    }
    render(){
        const Tab = this._tabNavigator()
        return <Tab />
    }
}
class TabBarComponent extends Component{
    render() {
        return <BottomTabBar
            {...this.props}
            activeTintColor = {this.props.theme}
        />
    }
}
const mapStateToProps = state =>({
    theme: state.theme.theme
})
const TabBar = connect(mapStateToProps)(TabBarComponent)

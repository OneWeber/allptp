import React, { Component } from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator,
    createAppContainer,
    createMaterialTopTabNavigator
} from "react-navigation";
import Face from "../view/Face"
import Hobby from "../view/Hobby"
import Article from "../view/public/Article"
import Personalcenter from '../view/public/Personalcenter'
import Activity from "../view/public/Activity"
import City from "../view/public/City"
import Login from "../view/faceView/signin/Login"
import Publisharticle from "../view/public/article/Publisharticle"
import Articlelist from "../view/public/article/Articlelist"
import Activitylist from "../view/public/activity/Activitylist"
import Createactive from "../view/createActive/Createactive"
import Globalmap from "../view/public/Global_map"

const StacksOverTabs = createStackNavigator({
    //Hobby:{
     //   screen: Hobby
    //},
    TabNav: {
        screen: Face
    },
    Article:{
        screen: Article
    },
    Personalcenter:{
        screen: Personalcenter
    },
    Activity:{
        screen: Activity
    },
    City:{
        screen: City
    },
    Login:{
        screen: Login
    },
    Publisharticle:{
        screen: Publisharticle
    },
    Articlelist:{
        screen: Articlelist
    },
    Activitylist:{
        screen: Activitylist
    },
    Createactive:{
        screen: Createactive
    },
    Globalmap: {
        screen: Globalmap
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false
    }
})
const CreaterTab = createAppContainer(StacksOverTabs)

export default class App extends Component {
    render() {
        return (
            <CreaterTab />
        );
    }
}

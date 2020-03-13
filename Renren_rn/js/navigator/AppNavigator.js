import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import WelcomePage from '../page/WelcomePage';
import ViewPage from '../page/ViewPage';
import Login from '../views/sign/Login';
import OrderPage from '../views/order/OrderPage';
import GuidePage from '../page/GuidePage';
import WishDetail from '../views/wish/WishDetail';
import AddWishList from '../views/wish/AddWishList';
const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            headerShown: false
        }
    }
})
const GuideNavigator = createStackNavigator({
    GuidePage: {
        screen: GuidePage,
        navigationOptions: {
            headerShown: false
        }
    }
})
const MainNavigator = createStackNavigator({
    ViewPage: {
        screen: ViewPage,
        navigationOptions: {
            headerShown: false
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            headerShown: false
        }
    },
    OrderPage: {
        screen: OrderPage,
        navigationOptions: {
            headerShown: false
        }
    },
    WishDetail: {
        screen: WishDetail,
        navigationOptions: {
            headerShown: false
        }
    },
    AddWishList: {
        screen: AddWishList,
        navigationOptions: {
            headerShown: false
        }
    }
})
export default createAppContainer(createSwitchNavigator({
    Init:InitNavigator,
    Guide:GuideNavigator,
    Main:MainNavigator
}, {
    navigationOptions: {
        headerShown: false
    }
}))

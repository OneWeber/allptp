import {createSwitchNavigator, createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import WelcomePage from '../page/WelcomePage';
import ViewPage from '../page/ViewPage';
import Login from '../views/sign/Login';
import OrderPage from '../views/order/OrderPage';
import GuidePage from '../page/GuidePage';
import WishDetail from '../views/wish/WishDetail';
import AddWishList from '../views/wish/AddWishList';
import ActiveDetail from '../views/detail/ActiveDetail';
import StoryDetail from '../views/detail/StoryDetail';
import SingleDay from '../views/active/SingleDay';
import Requirements from '../views/active/Requirements';
import TouristsList from '../views/active/TouristsList';
import AddTourists from '../views/active/AddTourists';
import SelectPackage from '../views/active/SelectPackage';
import GlobalMap from '../views/map/GlobalMap';
import ActiveList from '../views/active/activeList/ActiveList';
import StoryList from '../views/story/storyList/StoryList';
import TopSearch from '../views/homePage/topsearch/TopSearch';
import Volunteer from '../views/homePage/volunteer/Volunteer';
import Creater from '../views/homePage/creater/Creater';
import Destination from '../views/destination/Destination';
import Focus from '../views/info/Focus';
import Fans from '../views/info/Fans';
import ActiveReserve from '../views/info/activemanage/ActiveReserve';
import Trading from '../views/info/Trading';
import PublishStory from '../views/info/createcenter/PublishStory';
import MyStory from '../views/info/createcenter/MyStory';
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
    },
    ActiveDetail: {
        screen: ActiveDetail,
        navigationOptions: {
            headerShown: false
        }
    },
    StoryDetail: {
        screen: StoryDetail,
        navigationOptions: {
            headerShown: false
        }
    },
    SingleDay: {
        screen: SingleDay,
        navigationOptions: {
            headerShown: false
        }
    },
    Requirements: {
        screen: Requirements,
        navigationOptions: {
            headerShown: false
        }
    },
    TouristsList:{
        screen: TouristsList,
        navigationOptions: {
            headerShown: false
        }
    },
    AddTourists: {
        screen: AddTourists,
        navigationOptions: {
            headerShown: false
        }
    },
    SelectPackage: {
        screen: SelectPackage,
        navigationOptions: {
            headerShown: false
        }
    },
    GlobalMap:{
        screen: GlobalMap,
        navigationOptions: {
            headerShown: false
        }
    },
    ActiveList: {
        screen: ActiveList,
        navigationOptions: {
            headerShown: false
        }
    },
    StoryList:{
        screen: StoryList,
        navigationOptions: {
            headerShown: false
        }
    },
    TopSearch: {
        screen: TopSearch,
        navigationOptions: {
            headerShown: false
        }
    },
    Volunteer:{
        screen: Volunteer,
        navigationOptions: {
            headerShown: false
        }
    },
    Creater:{
        screen: Creater,
        navigationOptions: {
            headerShown: false
        }
    },
    Destination: {
        screen: Destination,
        navigationOptions: {
            headerShown: false
        }
    },
    Focus:{
        screen: Focus,
        navigationOptions: {
            headerShown: false
        }
    },
    Fans: {
        screen: Fans,
        navigationOptions: {
            headerShown: false
        }
    },
    Trading: {
        screen: Trading,
        navigationOptions: {
            headerShown: false
        }
    },
    ActiveReserve:{
        screen: ActiveReserve,
        navigationOptions: {
            headerShown: false
        }
    },
    PublishStory:{
        screen: PublishStory,
        navigationOptions: {
            headerShown: false
        }
    },
    MyStory: {
        screen: MyStory,
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
        headerShown: false,
        lazy: true
    }
}))

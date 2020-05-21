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
import CreateActive from '../views/info/createcenter/CreateActive';
import Language from '../views/info/createcenter/createActive/CreateStep/Language';
import Introduce from '../views/info/createcenter/createActive/CreateStep/Introduce';
import Content from '../views/info/createcenter/createActive/CreateStep/Content';
import Provide from '../views/info/createcenter/createActive/CreateStep/Provide';
import Bring from '../views/info/createcenter/createActive/CreateStep/Bring';
import Title from '../views/info/createcenter/createActive/CreateStep/Title';
import Photo from '../views/info/createcenter/createActive/CreateStep/Photo';
import Address from '../views/info/createcenter/createActive/CreateStep/Address';
import Time from '../views/info/createcenter/createActive/CreateStep/Time';
import LongTime from '../views/info/createcenter/createActive/CreateStep/LongTime';
import EditStandard from '../views/info/createcenter/createActive/CreateStep/public/EditStandard';
import ParentChildPackage from '../views/info/createcenter/createActive/CreateStep/public/ParentChildPackage';
import CustomPackage from '../views/info/createcenter/createActive/CreateStep/public/CustomPackage';
import Calendar from '../views/info/createcenter/createActive/CreateStep/common/Calendar';
import AboutDifference from '../views/info/createcenter/createActive/CreateStep/common/AboutDifference';
import SettingDifference from '../views/info/createcenter/createActive/CreateStep/common/SettingDifference';
import Preferential from '../views/homePage/preference/Preferential';
import NetError from '../page/NetError';
import Contact from '../views/msg/Contact';
import Chat from '../common/Chat';
import UserInfo from '../views/info/UserInfo';
import Setting from '../views/info/Setting';
import MainTheme from '../views/info/setting/MainTheme';
import Type from '../views/info/createcenter/createActive/CreateStep/Type';
import Map from '../common/Map';
import SelectAddress from '../common/SelectAddress';
import PersonalData from '../views/my/PersonalData';
import MyIntroduce from '../views/my/MyIntroduce';
import BankList from '../views/info/trading/BankList';
import AddCard from '../views/info/trading/AddCard';
import WithDrawal from '../views/info/trading/WithDrawal';
import SystemMsg from '../views/info/SystemMsg';
import SystemWebview from '../views/info/systemmsg/SystemWebview';
import TravelFunds from '../views/info/TravelFunds';
import Accommodation from '../views/info/createcenter/createActive/CreateStep/Accommodation';
import AddAccommodation from '../views/info/createcenter/createActive/CreateStep/common/AddAccommodation';
import Attention from '../views/info/createcenter/createActive/CreateStep/Attention';
import Reservation from '../views/info/createcenter/createActive/CreateStep/Reservation';
import Booking from '../views/info/createcenter/createActive/CreateStep/Booking';
import Vol from '../views/info/createcenter/createActive/Vol';
import Submit from '../views/info/createcenter/createActive/CreateStep/Submit';
import SettingLanguage from '../views/info/setting/SettingLanguage';
import Evaluation from '../views/info/other/Evaluation';
import Authenticate from '../views/authenticate/Authenticate';
import ManyDay from '../views/active/ManyDay';
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
            headerShown: false,
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
    },
    CreateActive: {
        screen: CreateActive,
        navigationOptions: {
            headerShown: false
        }
    },
    Language: {
        screen: Language,
        navigationOptions: {
            headerShown: false
        }
    },
    Introduce:{
        screen: Introduce,
        navigationOptions: {
            headerShown: false
        }
    },
    Content: {
        screen: Content,
        navigationOptions: {
            headerShown: false
        }
    },
    Provide: {
        screen: Provide,
        navigationOptions: {
            headerShown: false
        }
    },
    Bring: {
        screen: Bring,
        navigationOptions: {
            headerShown: false
        }
    },
    Title: {
        screen: Title,
        navigationOptions: {
            headerShown: false
        }
    },
    Photo: {
        screen: Photo,
        navigationOptions: {
            headerShown: false
        }
    },
    Address: {
        screen: Address,
        navigationOptions: {
            headerShown: false
        }
    },
    Time: {
        screen: Time,
        navigationOptions: {
            headerShown: false
        }
    },
    LongTime: {
        screen: LongTime,
        navigationOptions: {
            headerShown: false
        }
    },
    EditStandard: {
        screen: EditStandard,
        navigationOptions: {
            headerShown: false
        }
    },
    ParentChildPackage: {
        screen: ParentChildPackage,
        navigationOptions: {
            headerShown: false
        }
    },
    CustomPackage: {
        screen: CustomPackage,
        navigationOptions: {
            headerShown: false
        }
    },
    Calendar: {
        screen: Calendar,
        navigationOptions: {
            headerShown: false
        }
    },
    AboutDifference: {
        screen: AboutDifference,
        navigationOptions: {
            headerShown: false
        }
    },
    SettingDifference: {
        screen: SettingDifference,
        navigationOptions: {
            headerShown: false
        }
    },
    Preferential: {
        screen: Preferential,
        navigationOptions: {
            headerShown: false
        }
    },
    NetError: {
        screen: NetError,
        navigationOptions: {
            headerShown: false
        }
    },
    Contact: {
        screen: Contact,
        navigationOptions: {
            headerShown: false
        }
    },
    Chat: {
        screen: Chat,
        navigationOptions: {
            headerShown: false
        }
    },
    UserInfo: {
        screen: UserInfo,
        navigationOptions: {
            headerShown: false
        }
    },
    Setting: {
        screen: Setting,
        navigationOptions: {
            headerShown: false
        }
    },
    MainTheme: {
        screen: MainTheme,
        navigationOptions: {
            headerShown: false
        }
    },
    Type: {
        screen: Type,
        navigationOptions: {
            headerShown: false
        }
    },
    Map: {
        screen: Map,
        navigationOptions: {
            headerShown: false
        }
    },
    SelectAddress: {
        screen: SelectAddress,
        navigationOptions: {
            headerShown: false
        }
    },
    PersonalData: {
        screen: PersonalData,
        navigationOptions: {
            headerShown: false
        }
    },
    MyIntroduce: {
        screen: MyIntroduce,
        navigationOptions: {
            headerShown: false
        }
    },
    BankList: {
        screen: BankList,
        navigationOptions: {
            headerShown: false
        }
    },
    AddCard: {
        screen: AddCard,
        navigationOptions: {
            headerShown: false
        }
    },
    WithDrawal: {
        screen: WithDrawal,
        navigationOptions: {
            headerShown: false
        }
    },
    SystemMsg: {
        screen: SystemMsg,
        navigationOptions: {
            headerShown: false
        }
    },
    SystemWebview: {
        screen: SystemWebview,
        navigationOptions: {
            headerShown: false
        }
    },
    TravelFunds: {
        screen: TravelFunds,
        navigationOptions: {
            headerShown: false
        }
    },
    Accommodation: {
        screen: Accommodation,
        navigationOptions: {
            headerShown: false
        }
    },
    AddAccommodation: {
        screen: AddAccommodation,
        navigationOptions: {
            headerShown: false
        }
    },
    Attention: {
        screen: Attention,
        navigationOptions: {
            headerShown: false
        }
    },
    Reservation: {
        screen: Reservation,
        navigationOptions: {
            headerShown: false
        }
    },
    Booking: {
        screen: Booking,
        navigationOptions: {
            headerShown: false
        }
    },
    Vol: {
        screen: Vol,
        navigationOptions: {
            headerShown: false
        }
    },
    Submit: {
        screen: Submit,
        navigationOptions: {
            headerShown: false
        }
    },
    SettingLanguage: {
        screen: SettingLanguage,
        navigationOptions: {
            headerShown: false
        }
    },
    Evaluation: {
        screen: Evaluation,
        navigationOptions: {
            headerShown: false
        }
    },
    Authenticate: {
        screen: Authenticate,
        navigationOptions: {
            headerShown: false
        }
    },
    ManyDay: {
        screen: ManyDay,
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

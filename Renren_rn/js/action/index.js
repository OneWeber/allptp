import {InitUser} from './user'
import {InitToken} from './token'
import {onLoadTravel, onLoadMoreTravel} from './travel'
import {onLoadOrder,onLoadMoreOrder} from './order'
import {onLoadWish} from './wish'
import {onLoadColWish} from './wish/colwish'
import {onLoadWishDetail} from './wishdetail'
import {initJoin} from './join'
import {initSlot} from './slot'
import {onLoadComming} from './comming'
import {onLoadHotCity} from './hotcity'
import {onLoadCityItem} from './cityitem'
import {onLoadSelectStory} from './selectstory'
import {onLoadHistory} from './histroy'
import {onLoadActiveList} from './activelist'
import {onLoadStoryList} from './storylist'
import {onLoadVolunteer, onLoadMoreVolunteer} from './volunteer'
import {onLoadCreater, onLoadMoreCreater} from './creater'
import {onLoadFocus, onLoadMoreFocus} from './focus'
import {onLoadFans, onLoadMoreFans} from './focus/fans'
import {onLoadTrading, onLoadMoreTrading} from './trading'
import {onLoadMyStory} from './info/mystory'
import {onLoadToAudit} from './info/toaudit'
import {onLoadAlready} from './info/already'
import {onLoadNotPass} from './info/notpass'
import {onLoadUncommit} from './info/uncommit';
import {
    changeDiscount,
    changeParentChildPackage,
    changeAdultStandard,
    changeChildStandard,
    changeCustomePackage,
    changeLongDay,
    changeDifference,
    changeLanguage,
    changeOtherLanguage,
    changeActivityId,
    changeStatus,
    changeFull,
    changeAccommodation,
    changeAccImageId
} from './info/steps'
import {onLoadBank} from './info/bank'
import {changeNet} from "./netinfo"
import {onLoadBanner} from './banner'
import {onLoadMsg} from './msg'
import {onLoadContact} from './msg/contact'
import {changeTheme} from './theme'
import {onLoadSystemMsg,onLoadMoreSystemMsg} from './info/systemmsg'
import {onLoadNoRead} from './info/noread'
import {onLoadUserInfo} from './info/userinfo'
import {changeMainLanguage} from './language'

export default {
    InitUser,
    InitToken,
    onLoadTravel,
    onLoadMoreTravel,
    onLoadOrder,
    onLoadMoreOrder,
    onLoadWish,
    initJoin,
    initSlot,
    onLoadComming,
    onLoadHotCity,
    onLoadCityItem,
    onLoadSelectStory,
    onLoadHistory,
    onLoadActiveList,
    onLoadStoryList,
    onLoadVolunteer,
    onLoadCreater,
    onLoadMoreCreater,
    onLoadMoreVolunteer,
    onLoadFocus,
    onLoadMoreFocus,
    onLoadFans,
    onLoadMoreFans,
    onLoadTrading,
    onLoadMoreTrading,
    onLoadMyStory,
    onLoadToAudit,
    onLoadAlready,
    onLoadNotPass,
    onLoadUncommit,
    changeDiscount,
    changeParentChildPackage,
    changeAdultStandard,
    changeChildStandard,
    changeCustomePackage,
    changeLongDay,
    changeDifference,
    changeNet,
    onLoadColWish,
    onLoadBanner,
    onLoadMsg,
    onLoadContact,
    changeTheme,
    changeLanguage,
    changeOtherLanguage,
    changeActivityId,
    changeStatus,
    onLoadBank,
    onLoadSystemMsg,
    onLoadMoreSystemMsg,
    onLoadNoRead,
    onLoadUserInfo,
    changeAccommodation,
    changeAccImageId,
    changeMainLanguage
}

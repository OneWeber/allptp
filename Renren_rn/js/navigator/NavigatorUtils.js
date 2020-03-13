export default class NavigatorUtils {
    //跳转到指定页面
    static goPage(params, page) {
        const navigation = NavigatorUtils.navigation;
        if(!navigation) {
            console.log('NavigatorUtils.navigation can not be null')
        }
        navigation.navigate(
            page,
            {
                ...params
            }
        )
    }
    //重置到首页
    static resetToHomePage(params) {
        const {navigation} = params
        navigation.navigate('Main')
    }

    //返回上一页

    static backToUp(params, isFunc) {
        const {navigation} = params;
        if(isFunc) {
            navigation.state.params.refresh()
        }
        navigation.goBack()
    }
}

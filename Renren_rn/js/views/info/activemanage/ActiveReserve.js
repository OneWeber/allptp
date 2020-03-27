import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux'
class ActiveReserve extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['全部','已支付','待支付','已完成','已退款']
    }
    getLeftButton() {
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                NavigatorUtils.backToUp(this.props)
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    render(){
        const {theme} = this.props
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'体验预定'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollableTabView
                    renderTabBar={() => (<CustomeTabBar
                        backgroundColor={'rgba(0,0,0,0)'}
                        locked={true}
                        sabackgroundColor={'#fff'}
                        scrollWithoutAnimation={true}
                        tabUnderlineDefaultWidth={25}
                        tabUnderlineScaleX={6} // default 3
                        activeColor={theme}
                        isWishLarge={true}
                        inactiveColor={theme}
                    />)}>
                    {
                        this.tabNames.map((item, index) => {
                            return <ActiveReserveContent tabLabel={item}/>
                        })
                    }
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(ActiveReserve)
class ActiveReserveContent extends Component{
    render(){
        return(
            <View>
                <Text>!1</Text>
            </View>
        )
    }
}

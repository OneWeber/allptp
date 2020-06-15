import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomeTabBar from '../../../model/CustomeTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux';
class CompleteActive extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['待评价','已评价'];
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
        const {theme} = this.props;
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'已完成体验'}
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
                        inactiveColor={'#999'}
                    />)}>
                    {
                        this.tabNames.map((item, index) => {
                            return <CompleteActiveItem tabLabel={item} index={index} {...this.props} {...this.state}/>
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
export default connect(mapStateToProps)(CompleteActive)
class CompleteActiveItem extends Component{
    componentDidMount(){

    }

    render(){
        return(
            <View>
                <Text>111</Text>
            </View>
        )
    }
}

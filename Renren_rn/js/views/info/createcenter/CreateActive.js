import React,{Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, TouchableOpacity,Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import ToAudit from './createActive/ToAudit';
import Already from './createActive/Already';
import NotPass from './createActive/NotPass';
import Uncommitted from './createActive/Uncommitted';
const {width, height} = Dimensions.get('window')
class CreateActive extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['待审核', '已通过', '未通过', '未提交']
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
    getRightButton(){
        return <Text style={{
            marginRight: width*0.03,
            fontWeight:'bold',
            color:'#ff5673'
        }}>验证身份</Text>
    }
    render(){
        const {theme} = this.props
        return(
            <SafeAreaView style={styles.container}>
                <RNEasyTopNavBar
                    title={'我的体验列表'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                    style={{borderBottomWidth: 1,borderBottomColor: '#f5f5f5'}}
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
                    <View tabLabel={'待审核'} style={{flex: 1}}>
                        <ToAudit {...this.props} {...this.state} />
                    </View>
                    <View tabLabel={'已通过'} style={{flex: 1}}>
                        <Already {...this.props} {...this.state}/>
                    </View>
                    <View tabLabel={'未通过'} style={{flex: 1}}>
                        <NotPass {...this.props} {...this.state}/>
                    </View>
                    <View tabLabel={'未提交'} style={{flex: 1}}>
                        <Uncommitted {...this.props} {...this.state}/>
                    </View>
                </ScrollableTabView>
                <View style={[CommonStyle.flexCenter,styles.fixedBtn]}>
                    <TouchableOpacity style={[styles.btn,CommonStyle.flexCenter,{
                        backgroundColor: theme,
                        flexDirection: 'row'
                    }]}
                    onPress={()=>{NavigatorUtils.goPage({},'Language')}}
                    >
                        <AntDesign
                            name={'plus'}
                            size={18}
                            style={{color:'#fff'}}
                        />
                        <Text style={{
                            color:'#fff',
                            fontWeight:'bold',
                            marginLeft: 3
                        }}>创建体验</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    fixedBtn:{
        position: 'absolute',
        left:0,
        right:0,
        bottom:30
    },
    btn:{
        width:120,
        height:35,
        borderRadius: 20,
        shadowColor:'gray',
        shadowOffset:{width:0.5, height:0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(CreateActive)


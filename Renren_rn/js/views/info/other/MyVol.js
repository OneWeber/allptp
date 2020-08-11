import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Tooltip } from 'react-native-elements';
import Modal from 'react-native-modalbox';
import CustomeTabBar from '../../../model/CustomeTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux';
import PinviteItem from './myvol/pinvite/PinviteItem';
import VapplyItem from './myvol/vapply/VapplyItem';
import VcompleteItem from './myvol/vcomplete/VcompleteItem';
import action from '../../../action'
import NavigatorUtils from '../../../navigator/NavigatorUtils';
const {width} = Dimensions.get('window');
class MyVol extends Component{
    constructor(props) {
        super(props);
        this.Tabs = ['策划者邀请', '我的志愿申请', '已完成志愿'];
        this.pInvite=['待处理','已同意','已谢绝'];
        this.vApply=['待处理','已同意','不合适'];
        this.state = {
            tabIndex: 0
        }
    }
    clickItem(index) {
        this.setState({
            tabIndex: index
        },()=>{
            this.refs.type.close()
        })
    }
    render(){
        const {tabIndex} = this.state;
        const {theme} = this.props;
        return(
            <View style={{flex: 1}}>
                <SafeAreaView style={{backgroundColor:'#fff'}}>
                    <View style={[CommonStyle.spaceRow,{
                        height:50
                    }]}>
                        <TouchableOpacity
                            style={{
                                paddingLeft: width*0.03
                            }}
                            onPress={()=>{
                                NavigatorUtils.backToUp(this.props)
                            }}
                        >
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333',width:50}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            flexDirection: 'row'
                        }]}
                        onPress={()=>{
                            this.refs.type.open()
                        }}
                        >
                            <Text style={{
                                color:'#333',
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>{this.Tabs[tabIndex]}</Text>
                            <AntDesign
                                name={'caretdown'}
                                size={12}
                                style={{color:'#333'}}
                            />
                        </TouchableOpacity>
                        <Tooltip
                            backgroundColor={'#fff'}
                            overlayColor={'rgba(0,0,0,.4)'}
                            containerStyle={{height:90}}
                            popover={<Text style={{color:'#666',lineHeight: 22}}>志愿者被策划者邀请或者申请体验志愿者，都免费体验活动</Text>}>
                            <View style={[CommonStyle.flexEnd,{
                                width:50,
                                marginRight: width*0.03
                            }]}>
                                <Text style={{
                                    color:'#333',
                                    fontSize: 13,
                                }}>小贴士</Text>
                            </View>
                        </Tooltip>
                    </View>
                </SafeAreaView>
                {
                    tabIndex===0
                    ?
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
                                this.pInvite.map((item, index) => {
                                    return <PinviteItem tabLabel={item} key={index} index={index} {...this.props} {...this.state}/>
                                })
                            }
                        </ScrollableTabView>
                    :
                    tabIndex===1
                    ?
                        <VapplyItem {...this.props} {...this.state}/>
                    :
                        <VcompleteItem {...this.props} {...this.state}/>
                }

                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"type"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 180,
                        backgroundColor:'#fff'
                    }}>
                        {
                            this.Tabs.map((item, index) => {
                                return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                    height: 60,
                                    borderBottomColor: '#F5F5F5',
                                    borderBottomWidth: index===2?0:1
                                }]}
                                onPress={()=>{
                                    this.clickItem(index)
                                }}
                                >
                                    <Text style={{color:'#333'}}>{item}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </Modal>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    pinvite: state.pinvite
});
const mapDispatchToProps = dispatch =>({
    onLoadPInvite: (storeName, url, data) => dispatch(action.onLoadPInvite(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyVol)

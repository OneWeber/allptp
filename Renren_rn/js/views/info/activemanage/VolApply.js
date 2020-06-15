import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import action from '../../../action'
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window');
class VolApply extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['待处理','已同意','已谢绝'];
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
                    title={'志愿者申请'}
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
                            return <VolApplyItem tabLabel={item} key={index} index={index} {...this.props} {...this.state}/>
                        })
                    }
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme,
    volapply: state.volapply
});
const mapDispatchToProps = dispatch => ({
    onLoadVolApply: (storeName, url, data) => dispatch(action.onLoadVolApply(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(VolApply)

class VolApplyItem extends Component{
    componentDidMount(){
        this.loadData();
    }
    loadData() {
        const {onLoadVolApply} = this.props;
        let formData = new FormData();
        this.storeName = this.props.tabLabel;
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', this.props.index)
        onLoadVolApply(this.storeName, NewHttp+'ErollL', formData)
    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.commonWidth,{
            marginTop: 10,
            backgroundColor:'#fff',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 14.5,
            paddingRight: 14.5,
            marginLeft: width*0.03,
            borderRadius: 6
        }]}
        onPress={()=>{
            NavigatorUtils.goPage({
                data:data.item,
                storeName: this.props.tabLabel
            }, 'VolApplyDetail')
        }}
        >
            <View style={CommonStyle.spaceRow}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.user&&data.item.user.headimage&&data.item.user.headimage.domain&&data.item.user.headimage.image_url?{
                            uri: data.item.user.headimage.domain+data.item.user.headimage.image_url
                        }:require('../../../../assets/images/touxiang.png')}
                        style={{
                            width:40,
                            height:40,
                            borderRadius: 20
                        }}
                    />
                    <Text style={{
                        marginLeft: 9,
                        color:'#333',
                        fontWeight: 'bold'
                    }}>
                        {
                            data.item.user
                            ?
                                data.item.user.family_name||data.item.user.middle_name||data.item.user.name
                                ?
                                    <Text>
                                        {data.item.user.family_name?data.item.user.family_name+' ':''}
                                        {data.item.user.middle_name?data.item.user.middle_name+' ':''}
                                        {data.item.user.name?data.item.user.name:''}
                                    </Text>
                                :
                                    '匿名用户'
                            :
                            '匿名用户'
                        }
                    </Text>
                </View>
                <Text style={{
                    color:'#333',
                    fontWeight: 'bold'
                }}>{this.props.tabLabel}</Text>
            </View>
            <View style={[CommonStyle.spaceRow,{
                marginTop: 15.5
            }]}>
                <LazyImage
                    source={data.item.activity&&data.item.activity.cover&&data.item.activity.cover.domain&&data.item.activity.cover.image_url?{
                        uri: data.item.activity.cover.domain + data.item.activity.cover.image_url
                    }:require('../../../../assets/images/error.png')}
                    style={{
                        width:90,
                        height:70,
                        borderRadius: 4
                    }}
                />
                <View style={[CommonStyle.spaceCol,{
                    height: 70,
                    width: width*0.94-100-29,
                    alignItems:'flex-start'
                }]}>
                    <Text
                        numberOfLines={2} ellipsizeMode={'tail'}
                        style={{
                            color:'#333',
                            fontWeight: 'bold'
                        }}
                    >{data.item.activity.title}</Text>
                    <Text style={{color:'#222',fontSize: 13}}>¥/人</Text>
                </View>
            </View>
            <Text style={{
                marginTop: 20,
                fontSize: 12,
                color:this.props.tabLabel==='待处理'?this.props.theme:'#666'
            }}>申请志愿时间:</Text>
            {
                data.item.slot_id.map((item, index) => {
                    return <Text key={index} style={{
                        fontSize: 12,
                        marginTop:10,
                        color:this.props.tabLabel==='待处理'?this.props.theme:'#666'
                    }}>
                        {item.begin_time} -- {item.end_time}
                    </Text>
                })
            }

        </TouchableOpacity>
    }
    render(){
        const {volapply} = this.props;
        let store = volapply[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1}}>
                {
                    store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                    ?
                        <FlatList
                            data={store.items.data.data.data}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <NoData></NoData>
                        </View>
                }
            </View>
        )
    }
}

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomeTabBar from '../../../model/CustomeTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import action from '../../../action'
import NewHttp from '../../../utils/NewHttp';
import NoData from '../../../common/NoData';
import LazyImage from 'animated-lazy-image';
const {width} = Dimensions.get('window');
class RefundApply extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['待处理','已同意','已拒绝'];
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
                    title={'退款申请'}
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
                            return <RefundApplyItem tabLabel={item} key={index} index={index} {...this.props} {...this.state}/>
                        })
                    }
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    refundapply: state.refundapply
});
const mapDispatchToProps = dispatch => ({
    onLoadRefundApply: (storeName, url, data) => dispatch(action.onLoadRefundApply(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(RefundApply)
class RefundApplyItem extends Component{
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        const {onLoadRefundApply} = this.props;
        this.storeName = this.props.tabLabel;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('page', 1);
        formData.append('audit', this.props.index);
        onLoadRefundApply(this.storeName, NewHttp+'RefundLPlanner', formData)
    }
    renderItem(data) {
        return <TouchableOpacity style={[CommonStyle.commonWidth,{
            paddingTop: 20,
            paddingBottom:20,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor:'#fff',
            borderRadius: 6,
            marginTop: 10,
            marginLeft: width*0.03
        }]}
        onPress={() => {
            NavigatorUtils.goPage({refund_id: data.item.refund_id}, 'RefundApplyDetail')
        }}
        >
            <View style={CommonStyle.spaceRow}>
                <View style={CommonStyle.flexStart}>
                    <LazyImage
                        source={data.item.domain&&data.item.image_url?{
                            uri: data.item.domain+data.item.image_url
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

                        data.item.family_name||data.item.middle_name||data.item.name
                            ?
                            <Text>
                                {data.item.family_name?data.item.family_name+' ':''}
                                {data.item.middle_name?data.item.middle_name+' ':''}
                                {data.item.name?data.item.name:''}
                            </Text>
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
                    >{data.item.title}</Text>
                    <Text style={{color:'#222',fontSize: 13}}>¥/人</Text>
                </View>
            </View>
            <View style={[CommonStyle.flexEnd,{
                marginTop: 20
            }]}>
                {
                    this.props.tabLabel==='待处理'
                    ?
                        <Text style={{color:this.props.theme,fontSize: 12}}>申请退款: ¥{parseFloat(data.item.total_price)}</Text>
                    :
                        this.props.tabLabel==='已同意'
                    ?
                            <Text style={{color:'#666',fontSize: 12}}>已退款: ¥{parseFloat(data.item.total_price)}</Text>
                    :
                            <Text style={{color:'#ff5673',fontSize: 12}}>已拒绝</Text>
                }
            </View>

        </TouchableOpacity>
    }
    render(){
        const {refundapply} = this.props;
        let store=refundapply[this.storeName];
        if(!store) {
            store={
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

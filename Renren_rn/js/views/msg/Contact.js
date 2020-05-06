import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux';
import action from '../../action'
import HttpUrl from '../../utils/Http';
import NoData from '../../common/NoData';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window')
class Contact extends Component{
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const {token, onLoadContact} = this.props;
        this.storeName = 'contact'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('page',1);
        onLoadContact(this.storeName, HttpUrl+'Friend/myfriend', formData)
    }
    getLeftButton(){
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
    renderItem(data) {
        return <View style={[CommonStyle.spaceRow,{
            marginTop: data.index===0?24:40
        }]}>
            <LazyImage
                source={data.item.user&&data.item.user.headimage&&data.item.user.headimage.domain&&data.item.user.headimage.image_url?
                    {uri:data.item.user.headimage.domain+data.item.user.headimage.image_url}:require('../../../assets/images/touxiang.png')}
                style={{
                    width:45,
                    height:45,
                    borderRadius: 22.5
                }}
            />
            <View style={[CommonStyle.spaceCol,{
                width:width*0.94-60,
                height: 45,
                alignItems:'flex-start'
            }]}>
                {
                    data.item.user.family_name||data.item.user.middle_name||data.item.user.name
                        ?
                        <Text style={{color:'#333',fontSize:15}}>
                            {data.item.user.family_name}
                            {data.item.user.middle_name?''+data.item.user.middle_name:''}
                            {data.item.user.name?''+data.item.user.name:''}
                        </Text>
                        :
                        <Text style={{color:'#333333',fontSize:15}}>匿名用户</Text>
                }

            </View>
        </View>
    }
    render(){
        const {contact} = this.props;
        let store = contact[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'联系人'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={[CommonStyle.flexCenter]}>
                        <View style={CommonStyle.commonWidth}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                height: 36,
                                backgroundColor: "#f5f7fa",
                                marginTop: 5
                            }]}>
                                <View style={CommonStyle.flexStart}>
                                    <AntDesign
                                        name={'search1'}
                                        size={18}
                                        style={{color:'#999'}}
                                    />
                                    <Text style={{
                                        marginLeft: 5,
                                        fontSize: 12,
                                        color:'#999'
                                    }}>搜索好友</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                                ?
                                    <View>
                                        <FlatList
                                            data={store.items.data.data.data}
                                            showsVerticalScrollIndicator = {false}
                                            renderItem={data=>this.renderItem(data)}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                :
                                    <NoData></NoData>
                            }
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
const mapStateToProps = state => ({
    token: state.token.token,
    contact: state.contact
});
const mapDispatchToProps = dispatch => ({
    onLoadContact: (storeName, url, data) => dispatch(action.onLoadContact(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Contact)

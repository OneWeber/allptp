import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../model/CustomeTabBar';
import {connect} from 'react-redux'
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import WishActiveItem from '../../common/WishActiveItem';
import CommonStyle from '../../../assets/css/Common_css';
import Modal from 'react-native-modalbox';
import NoData from '../../common/NoData';
import Fetch from '../../expand/dao/Fetch'
import HttpUrl from '../../utils/Http';
import Toast, {DURATION} from 'react-native-easy-toast';
const widthScreen = Dimensions.get('window').width;
class WishDetail extends Component{
    constructor(props) {
        super(props);
        this.tabNames=['体验', '故事'];
        this.state = {
            data: [],
            hidden: this.props.navigation.state.params.hidden
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        const {token} = this.props
        const {onLoadWishDetail} = this.props
        const {group_id} = this.props.navigation.state.params
        let formData=new FormData();
        formData.append('token', token);
        formData.append('group_id', group_id);
        Fetch.post(NewHttp + 'collectional', formData).then(res =>{
            if(res.code === 1){
                this.setState({
                    data: res.data.data
                })
            }
        })
       // onLoadWishDetail(this.storeName, NewHttp + 'collectional', formData)
    }
    getLeftButton(){
        return <TouchableOpacity
            style={styles.back_icon}
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
    changeHidden(val){
        const {group_id, group_name} = this.props.navigation.state.params;
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('group_id',group_id);
        formData.append('group_name',group_name);
        formData.append('hide',val);
        Fetch.post(HttpUrl+'Comment/add_collegroup', formData).then(res =>{
            if(res.code === 1) {
                this.initWish();
                this.setState({
                    hidden: val
                })
            }
        })

    }
    getRightButton(){
        return <View style={[CommonStyle.flexEnd,{
            paddingRight: widthScreen*0.03
        }]}>
            {
                this.state.hidden
                ?
                    <TouchableOpacity style={{
                        marginRight: 20
                    }} onPress={()=>this.changeHidden(0)}>
                        <Image
                            source={require('../../../assets/images/collection/qxjm.png')}
                            style={{width:10,height:12}}
                        />
                    </TouchableOpacity>

                :
                    <Text style={{
                        color:'#333',
                        marginRight: 20
                    }} onPress={()=>this.changeHidden(1)}>设为私密</Text>
            }

            <AntDesign
                name={'ellipsis1'}
                size={18}
                style={{color:'#666'}}
                onPress={()=>{
                    this.refs.delCollection.open()
                }}
            />
        </View>
    }
    delCollection() {
        const {group_id} = this.props.navigation.state.params;
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('group_id',group_id);
        Fetch.post(NewHttp + 'GroupD', formData).then(res => {
            if(res.code === 1) {
                this.initWish();
                this.refs.delCollection.close();
                NavigatorUtils.backToUp(this.props);
            }
        })
    }
    initWish(){
        const {onLoadWish} = this.props;
        this.storeName = '心愿单';
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('flag',1);
        onLoadWish(this.storeName, HttpUrl + 'Comment/collegroup_list', formData);
    }
    render(){
        const {group_name} = this.props.navigation.state.params
        const {theme} = this.props
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={group_name}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
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
                            return <WishItemD
                                key={index}
                                tabLabel={item}
                                data={this.state.data}
                                group_id={this.props.navigation.state.params.group_id}
                                {...this.props}
                            />
                        })
                    }
                </ScrollableTabView>
                <Modal
                    style={[styles.modal_con,{backgroundColor:'rgba(0,0,0,0)'}]}
                    ref={"delCollection"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    backdropPressToClose={true}
                    coverScreen={true}
                    onClosingState={this.onClosingState}>
                    <View style={[styles.modal_con,CommonStyle.flexCenter,{justifyContent: 'flex-start'}]}>
                        <TouchableOpacity
                            style={[styles.items_btn, CommonStyle.flexCenter,CommonStyle.commonWidth]}
                            onPress={()=>{
                                this.delCollection()
                            }}
                        >
                            <Text style={styles.items_text}>删除此收藏夹</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.items_btn, CommonStyle.flexCenter,CommonStyle.commonWidth,{
                            marginTop: 10
                        }]}>
                            <Text style={[styles.items_text,{
                                color:'#007AFF'
                            }]}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    back_icon: {
        paddingLeft: widthScreen*0.03
    },
    modal_con:{
        width: '100%',
        height: 135
    },
    items_btn:{
        width: '100%',
        height: 57.5,
        backgroundColor:'#fff',
        borderRadius: 12
    },
    items_text: {
        fontWeight: "bold",
        color:'#F22A46'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
});
const mapDispatchToProps = dispatch => ({
    onLoadWish:(storeName, url, data, callBack) => dispatch(action.onLoadWish(storeName, url, data, callBack)),
})
export default connect(mapStateToProps, mapDispatchToProps)(WishDetail)
class WishItemD extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    componentDidMount(){
        const {group_id, token} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('group_id', group_id);
        Fetch.post(NewHttp+'collectional', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    data: res.data.data
                })
            }
        })
    }
    _initWish() {
        this.componentDidMount();
        this.refs.toast.show('取消收藏成功')
    }
    renderActive(data, tabLabel) {
        return <WishActiveItem initWish={()=>this._initWish()} tabLabel={tabLabel} data_w={data.item}  data_index={data.index} {...this.props}/>
    }
    onClose() {

    }
    onOpen() {

    }
    render(){
        const {tabLabel} = this.props;
        const {data} = this.state;
        function getActive(data){
            let activeList = [];
            for(let i=0; i<data.length; i++){
                if(data[i].flag === 1){
                    activeList.push(data[i])
                }
            }
            return activeList
        }
        function getStory(data){
            let storyList = [];
            for(let i=0; i<data.length; i++){
                if(data[i].flag !== 1){
                    storyList.push(data[i])
                }
            }
            return storyList
        }
        let active = data.length > 0
        ? getActive(data) : []
        let story = data.length > 0
            ? getStory(data) : []
        return(
            <View tabLabel={tabLabel} style={[{flex: 1}]}>
                <Toast ref="toast" position='center' positionValue={0}/>
                {
                    tabLabel==='体验'
                    ?
                        active.length > 0
                        ?
                            <FlatList
                                data={active}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this.renderActive(data, tabLabel)}
                                showsHorizontalScrollIndicator = {false}
                                showsVerticalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        :
                        <NoData></NoData>
                    :
                        story.length > 0
                        ?
                            <FlatList
                                data={story}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this.renderActive(data, tabLabel)}
                                showsHorizontalScrollIndicator = {false}
                                showsVerticalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        :
                            <NoData></NoData>
                }
            </View>
        )
    }
}

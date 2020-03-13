import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, RefreshControl} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../action'
import HttpUrl from '../../utils/Http';
import WishItem from '../../common/WishItem';
import Modal from 'react-native-modalbox';
import NoData from '../../common/NoData';
import NavigatorUtils from '../../navigator/NavigatorUtils';
const widthScreen = Dimensions.get('window').width;
class FavoritePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isShadow:false,
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(val) {
        const {token} = this.props;
        const {onLoadWish} = this.props
        this.step = 1;
        this.storeName = '心愿单'
        let formData = new FormData();
        formData.append('token', token);
        formData.append('flag',1);
        onLoadWish(this.storeName, HttpUrl + 'Comment/collegroup_list', formData)
    }
    goAddWishList(){
        NavigatorUtils.goPage({}, 'AddWishList')
    }
    getRightButton() {
        const {theme} = this.props
        return <TouchableOpacity
            style={[styles.back_icon,CommonStyle.flexStart]}
            onPress={() =>{
                this.goAddWishList()
            }}
        >
            <AntDesign
                name={'plus'}
                size={18}
                style={{color:theme}}
            />
            <Text style={[styles.add_txt,{color:theme}]}>添加心愿单</Text>
        </TouchableOpacity>
    }
    _showModal(){
        this.refs.wish.open()
    }
    renderItem(data){
        return <WishItem showModal={() => this._showModal()} data_w={data.item} data_index={data.index} />
    }
    onClose() {

    }
    onOpen(){

    }
    onClosingState(){

    }
    render(){
        const {wish, theme} = this.props;
        let store = wish[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={''}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    rightButton={this.getRightButton()}
                />
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.length > 0
                    ?
                    <FlatList
                        data={store.items.data.data}
                        showsVerticalScrollIndicator = {false}
                        renderItem={data=>this.renderItem(data)}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl
                                title={'loading'}
                                titleColor={theme}
                                colors={[theme]}
                                refreshing={store.isLoading}
                                onRefresh={() => {this.loadData(true)}}
                                tintColor={theme}
                            />
                        }
                    />

                    :
                        <NoData></NoData>
                }
                <Modal
                    style={styles.modal_con}
                    ref={"wish"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={false}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    backdropPressToClose={true}
                    coverScreen={true}
                    onClosingState={this.onClosingState}>
                    <View style={[styles.modal_con,CommonStyle.flexCenter,{justifyContent: 'flex-start'}]}>
                        <View style={[styles.modal_btn,CommonStyle.flexCenter,{borderBottomWidth:1,borderBottomColor:'#f5f5f5'}]}>
                            <Text style={styles.modal_txt}>编辑</Text>
                        </View>
                        <View style={[styles.modal_btn,CommonStyle.flexCenter]}>
                            <Text style={[styles.modal_txt,{color:'red'}]}>删除</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative'
    },
    back_icon: {
        paddingRight: widthScreen*0.03
    },
    add_txt:{
        fontWeight:'bold',
        fontSize: 16,
        marginLeft:5
    },
    shadow_bg:{
        position:'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor:'rgba(0,0,0,.5)'
    },
    modal_con:{
        width: '100%',
        backgroundColor: '#fff',
        height: 120
    },
    modal_btn:{
        height:60,
        width: '100%'
    },
    modal_txt:{
        fontWeight: "bold",
        color:'#999'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    wish: state.wish
})
const mapDispatchToProps = dispatch => ({
    onLoadWish:(storeName, url, data) => dispatch(action.onLoadWish(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)

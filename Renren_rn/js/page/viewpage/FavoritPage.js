import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Image,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../action'
import HttpUrl from '../../utils/Http';
import WishItem from '../../common/WishItem';
import NoData from '../../common/NoData';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import languageType from '../../json/languageType'
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
        onLoadWish(this.storeName, HttpUrl + 'Comment/collegroup_list', formData, callback => {

        })
    }
    goAddWishList(){
        NavigatorUtils.goPage({}, 'AddWishList')
    }
    renderItem(data){
        return <WishItem data_w={data.item} data_index={data.index} {...this.props}/>
    }
    onClose() {

    }
    onOpen(){

    }
    onClosingState(){

    }
    render(){
        const {wish, theme, language} = this.props;
        let store = wish[this.storeName]
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <SafeAreaView style={styles.container}>
                <View style={[CommonStyle.spaceRow,CommonStyle.commonWidth,{
                    height:50
                }]}>
                    <Text style={{
                        color:'#333',
                        fontWeight:'bold',
                        fontSize: 18
                    }}>
                        {
                            language===1?languageType.CH.favorites.title:language===2?languageType.EN.favorites.title:languageType.JA.favorites.title
                        }
                    </Text>
                    <TouchableOpacity
                        onPress={()=>this.goAddWishList()}
                    >
                        <Image
                            source={require('../../../assets/images/collection/tjscj.png')}
                            style={{width:18,height:18}}
                        />
                    </TouchableOpacity>
                </View>
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
                        <View style={[CommonStyle.flexCenter,{
                            flex: 1
                        }]}>
                            <Image
                                source={require('../../../assets/images/que/wxyd.png')}
                                style={{
                                    width: 180,
                                    height: 180
                                }}
                            />
                        </View>
                }
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#fff'
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
        height: 140
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
    wish: state.wish,
    language: state.language.language
})
const mapDispatchToProps = dispatch => ({
    onLoadWish:(storeName, url, data, callBack) => dispatch(action.onLoadWish(storeName, url, data, callBack))
})
export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)

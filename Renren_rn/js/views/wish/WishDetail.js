import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList} from 'react-native';
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
const widthScreen = Dimensions.get('window').width;
class WishDetail extends Component{
    constructor(props) {
        super(props);
        this.tabNames=['体验', '故事']
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        const {token} = this.props
        const {onLoadWishDetail} = this.props
        const {group_id} = this.props.navigation.state.params
        this.storeName = 'wishdetail'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('group_id', group_id);
        onLoadWishDetail(this.storeName, NewHttp + 'collectional', formData)
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
    render(){
        const {group_name} = this.props.navigation.state.params
        const {theme, wishdetail} = this.props
        let store = wishdetail[this.storeName]
        if(!store) {
            store = {
                items:[]
            }
        }
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'心愿单-'+group_name}
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
                            return <WishItemD tabLabel={item} store={store}/>
                        })
                    }
                </ScrollableTabView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    back_icon: {
        paddingLeft: widthScreen*0.03
    },
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    wishdetail: state.wishdetail
})
const mapDispatchToProps = dispatch => ({
    onLoadWishDetail: (storeName, url, data) => dispatch(action.onLoadWishDetail(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(WishDetail)
class WishItemD extends Component{
    renderActive(data) {
        return <WishActiveItem data_w={data.item}  data_index={data.index}/>
    }
    render(){
        const {tabLabel, store} = this.props;
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
        let active = store && store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length >0
        ? getActive(store.items.data.data.data) : []
        let story = store && store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length >0
            ? getStory(store.items.data.data.data) : []
        return(
            <View tabLabel={tabLabel} style={[CommonStyle.flexCenter,{flex: 1}]}>
                <FlatList
                    data={tabLabel==='体验'?active:story}
                    showsVerticalScrollIndicator = {false}
                    renderItem={data=>this.renderActive(data)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

import React,{Component} from 'react';
import {StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity, Image} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import NewHttp from '../../utils/NewHttp';
import HttpUrl from '../../utils/Http';
import action from '../../action'
import ScrollableTabView , { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import LazyImage from 'animated-lazy-image';
import ActiveItem from '../../common/ActiveItem';
const {width, height} = Dimensions.get('window')
class TopScoreActive extends Component{
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadHotCity} = this.props
        this.storeName = 'hotcity';
        let formData=new FormData();
        formData.append('token', token);
        onLoadHotCity(this.storeName, NewHttp + 'PopularCity', formData)
    }
    render(){
        const {hotcity, theme} = this.props
        let store = hotcity[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={[this.props.styles.component_title,
                        styles.common_color,
                        styles.common_weight,
                    ]}>
                        高分目的地体验
                    </Text>
                    <Text style={{color:'#333',fontSize:15,marginTop:8}}>各地策划人组织带领体验</Text>
                </View>
                <View style={{width: '100%'}}>
                    {
                        store.items && store.items.data && store.items.data.data && store.items.data.data.length > 0
                        ?
                            <View style={{marginTop: 25}}>
                                <ScrollableTabView
                                    renderTabBar={() => (<ScrollableTabBar
                                        backgroundColor={'rgba(0,0,0,0)'}
                                        scrollWithoutAnimation={true}
                                        tabUnderlineDefaultWidth={25}
                                        tabUnderlineScaleX={6} // default 3
                                        hotcity={true}
                                        activeTextColor={'#fff'}
                                        inactiveTextColor={'#333'}
                                        total={store.items.data.data.length}
                                        buttonTheme={theme}
                                    />)}>
                                    {
                                        store.items.data.data.map((item, index) => {
                                            return <CityItemMap key={index} {...this.props} tabLabel={item.city} data={item} />
                                        })
                                    }
                                </ScrollableTabView>

                            </View>
                        :
                            null
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    city_item:{
        padding: 8,
        borderRadius: 3
    },
    cityitem_img:{
        width: '100%',
        height: 126,
        borderRadius: 3,
    },
    tab_item:{
        padding: 3,
        marginRight: 15
    }
})
const mapStateToProps = state => ({
    token: state.token.token,
    hotcity: state.hotcity,
    theme: state.theme.theme
})
const comDispatchToProps = dispatch => ({
    onLoadHotCity: (storeName, url, data) => dispatch(action.onLoadHotCity(storeName, url, data))
})
export default connect(mapStateToProps, comDispatchToProps)(TopScoreActive)
class CityItem extends Component{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadCityItem} = this.props
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords',"");
        formData.append('sort',1);
        formData.append('page',1);
        formData.append('price_low','');
        formData.append('price_high','');
        formData.append('country','');
        formData.append('province','');
        formData.append('city',this.props.tabLabel);
        formData.append('region',"");
        formData.append('activ_begin_time',"");
        formData.append('activ_end_time',"");
        formData.append('laguage',"");
        formData.append('kind_id',"");
        formData.append('is_volunteen',"");
        formData.append('max_person_num',"");
        onLoadCityItem(this.props.tabLabel, HttpUrl + 'Activity/activ_list', formData)
    }
    render(){
        const {data, cityitem, theme} = this.props
        let store = cityitem[this.props.tabLabel]
        if(!store){
            store={
                items: [],
                isLaoding: false
            }
        }
        let cityItemArr = []
        let arr = store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
        ?store.items.data.data.data : []
        for(let i=0;i<arr.slice(0, 4).length;i++){
            cityItemArr.push(
                <ActiveItem data_a={arr[i]} data_index={i} {...this.props} key={i}/>
            )
        }
        return(
            <View>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View style={[CommonStyle.flexStart,{flexWrap:'wrap',alignItems:'flex-start',marginTop: -15}]}>
                            {cityItemArr}
                        </View>
                    :
                        null
                }
            </View>
        )
    }
}
const mapStateToPropsC = state => ({
    cityitem: state.cityitem
})
const mapDispatchToPropsC = dispatch => ({
    onLoadCityItem: (storeName, url, data) => dispatch(action.onLoadCityItem(storeName, url, data))
})
const CityItemMap = connect(mapStateToPropsC, mapDispatchToPropsC)(CityItem)

import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import {connect} from 'react-redux'
import holiday from '../../../json/holiday';
import CommonStyle from '../../../../assets/css/Common_css';
import Screening from '../../../model/screen';
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
import {removeDuplicatedItem, objRemoveDuplicated} from '../../../utils/auth';
const {width, height} = Dimensions.get('window')
class Preferential extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['节假日特惠','低至3折','低至5折'];
        this.state = {
            discount: [],
            tabNames: []
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0')
        Fetch.post(NewHttp+'DiscountTwo', formData).then(res => {
            if(res.code === 1) {
                let data = res.data;
                let disData = this.state.discount;
                for(let i=0;i<data.length;i++){
                    disData.push(parseFloat(data[i].price_discount))
                }
                disData = removeDuplicatedItem(disData)
                this.setState({
                    discount: disData.sort()
                },() => {
                    const {discount} = this.state;
                    let data = this.state.tabNames;
                    data.push(discount[0]);
                    data.push(discount[discount.length/2]);
                    data.push(discount[discount.length-1]);
                    this.setState({
                        tabNames: data
                    })
                })
            }
        })
    }
    render(){
        const {theme} = this.props;
        return(
            <View style={{flex: 1,backgroundColor:'#fff'}}>
                {
                    this.state.tabNames.length>0
                    ?
                        <ScrollableTabView
                            initialPage={this.props.navigation.state.params.initPage?this.props.navigation.state.params.initPage:0}
                            renderTabBar={() => (<CustomeTabBar
                                backgroundColor={'rgba(0,0,0,0)'}
                                locked={true}
                                sabackgroundColor={'#fff'}
                                scrollWithoutAnimation={true}
                                tabUnderlineDefaultWidth={25}
                                tabUnderlineScaleX={6} // default 3
                                activeColor={'#333'}
                                isWishLarge={true}
                                navigation={this.props.navigation}
                                inactiveColor={'#b5b5b5'}
                                isPreferential={true}
                                lineColor={theme}
                            />)}>
                            {
                                this.state.tabNames.map((item, index) => {
                                    return <PreferentialItem
                                        key={index}
                                        tabLabel={'低至'+JSON.stringify(item)+'折'}
                                        item={item}
                                        {...this.props}
                                    />
                                })
                            }
                        </ScrollableTabView>
                    :
                        null
                }

            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(Preferential)
class PreferentialItem extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'类型',
                data:[{title:'户外活动',id: 1},{title:'少数民族',id: 2},{title:'本土文化', id:3}],
                type: 1
            },
            {
                title:'排序',
                data:[{title:'价格低到高',},{title:'评分优先'},{title:'评论优先'},{title:'收藏优先'}],
                type: 1
            },
            {
                title:'地区',
                data:[],
                type: 2
            },
            {
                title:'筛选',
                data:[],
                type: 3
            }
        ];
        this.state = {
            customData: '',
            kind_id: '',
            sort: '',
            country: '',
            province: '',
            city: '',
            region: '',
            activeList: []
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const {item} = this.props;
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords', '');
        formData.append('sort', this.state.sort);
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('country',this.state.country);
        formData.append('province', this.state.province);
        formData.append('city', this.state.city);
        formData.append('region', '');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('laguage', '');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        Fetch.post(NewHttp+'ActivityListUserTwo', formData).then(res => {
            if(res.code === 1) {
                console.log('item', item)
                let resData = res.data.data;
                console.log('resData', resData)
                let data = [];
                for(let i=0;i<resData.length; i++) {
                    let concat = []
                    if(resData[i].price_discount_concat) {
                        concat = resData[i].price_discount_concat.split(',');
                        for(let j=0;j<concat.length;j++){
                            if(item>=parseFloat(concat[j])) {
                                data.push(resData[i])
                            }
                        }
                    }
                }
                data = objRemoveDuplicated(data);
                console.log(data)

            }
        })
    }
    getCustom(){

    }
    render(){
        const {tabLabel} = this.props
        return <View style={{flex: 1}}>
            <Screening
                ref={screen => this.screen = screen}
                screenData={this.tabNames}
                selectHeader={(data, index) => {
                    this.setState({
                        screenIndex: index
                    })
                }}
                selectIndex={[0,0,0,0]}
                customContent={this.getCustom()}
                customData={this.state.customData}
                customFunc={()=>{

                }}
                itemOnpress={(tIndex, index, data) => {

                }}
                style={{
                    borderBottomWidth:1,
                    borderBottomColor:'#f5f5f5',
                    marginTop:10
                }}
            >
                <View style={{flex: 1}}>
                    <Text>1</Text>
                </View>
            </Screening>
        </View>
    }
}
const styles = StyleSheet.create({
    calendarItem: {
        height:35,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F5F7FA',
        borderRadius: 4
    }
})

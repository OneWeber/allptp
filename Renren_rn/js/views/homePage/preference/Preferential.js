import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import ScrollableTabView , { DefaultTabBar } from 'react-native-scrollable-tab-view';
import CustomeTabBar from '../../../model/CustomeTabBar';
import {connect} from 'react-redux'
import holiday from '../../../json/holiday';
import CommonStyle from '../../../../assets/css/Common_css';
import Screening from '../../../model/screen';
const {width, height} = Dimensions.get('window')
class Preferential extends Component{
    constructor(props) {
        super(props);
        this.tabNames = ['节假日特惠','低至3折','低至5折']
    }
    render(){
        const {theme} = this.props
        return(
            <View style={{flex: 1,backgroundColor:'#fff'}}>
                <ScrollableTabView
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
                        this.tabNames.map((item, index) => {
                            return <PreferentialItem key={index} tabLabel={item} />
                        })
                    }
                </ScrollableTabView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(Preferential)
class PreferentialItem extends Component{
    constructor(props) {
        super(props);
        this.calendar = holiday;
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
        ]
    }
    getCustom(){

    }
    render(){
        const {tabLabel} = this.props
        return <View style={{flex: 1}}>
            {
                tabLabel==='节假日特惠'
                ?
                    <View style={{marginTop: 20,height:35}}>
                        <ScrollView
                            ref={refScrollView=>this.refScrollView=refScrollView}
                            horizontal = {true}
                            showsHorizontalScrollIndicator = {false}
                            pagingEnabled = {true}
                        >
                            {
                                this.calendar.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[styles.calendarItem, CommonStyle.flexCenter,{
                                        marginLeft:index===0?width*0.03:20,
                                        marginRight: index === this.calendar.length-1?width*0.03:0
                                    }]}>
                                        <Text style={{color:'#333',fontSize: 12}}>{item.month}月/{item.title}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </ScrollView>
                    </View>
                :
                    null
            }
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
                customData={[]}
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

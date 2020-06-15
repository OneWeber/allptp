import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import LazyImage from 'animated-lazy-image';
import action from '../../../action';
const {width} = Dimensions.get('window')
class House extends Component{
    constructor(props) {
        super(props);
        this.state = {
            houseList: [],
            choiceHouse: []
        }
    }
    componentDidMount() {
        let houseData = this.props.join.house;
        let houseId = this.props.join.houseid;
        if(houseId.length === 0) {
            for(let i=0; i<houseData.length; i++) {
                houseData[i].choiceNum = 1;
                houseData[i].isSelected = false;
            }
            this.setState({
                houseList: houseData
            })
        }else{
            for(let i=0; i<houseData.length; i++) {
               for(let j=0; j<houseId.length; j++) {
                   if(houseData[i].house_id === houseId[j].house_id) {
                       houseData[i].choiceNum = houseId[j].choiceNum;
                       houseData[i].isSelected = houseId[j].isSelected;
                   }
               }
            }
            this.setState({
                houseList: houseData
            })
        }

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
    delNum(index) {
        let {houseList} = this.state;
        if(houseList[index].choiceNum===1) {
            return
        }else{
            houseList[index].choiceNum --;
        }
        this.setState({
            houseList: houseList
        })
    }
    addNum(index) {
        let {houseList} = this.state;
        if(houseList[index].choiceNum >= houseList[index].num) {
            return
        }else{
            houseList[index].choiceNum ++;
        }
        this.setState({
            houseList: houseList
        })
    }
    getHouse(index, item) {
        let houseData = this.state.houseList;
        houseData[index].isSelected = !houseData[index].isSelected;
        this.setState({
            houseList: houseData
        },() => {
            let data = this.state.houseList;
            let choiceData = [];
            for(let i=0;i<data.length;i++) {
                if(data[i].isSelected) {
                    choiceData.push(data[i])
                }
            }
            this.setState({
                choiceHouse: choiceData
            })
        })
    }
    sureHouse() {
        const {join, initJoin} = this.props;
        let data = {
            activity_id: join.activity_id,
            slot_id: join.slot_id,
            person: join.person,
            house: join.house,
            houseid:this.state.choiceHouse,
            adult_price_origin: join.adult_price_origin,
            adult_price:join.adult_price,
            kids_price_origin: join.kids_price_origin,
            kids_price: join.kids_price,
            age_limit: '',
            date: join.date,
            begin_time: join.begin_time,
            end_time: join.end_time,
            is_discount: join.is_discount,
            combine: join.combine,
            title: join.title,
            kids_stand_low: join.kids_stand_low,
            kids_stand_high: join.kids_stand_high,
            selectCombine: join.selectCombine,
            longday: join.longday,
            begin_date: join.begin_date,
            end_date: join.end_date
        }
        initJoin(data);
        NavigatorUtils.goPage({}, 'ConfirmVisitors')
    }
    renderItem(data) {
        return <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 13,
            paddingRight: 13,
            borderRadius: 6,
            marginTop: 10,
            backgroundColor: '#fff',
            marginLeft:'3%'
        }]}>
            <TouchableOpacity style={[CommonStyle.flexCenter,{
                height: 18,
                width: 18,
                borderRadius: 9,
                borderWidth: data.item.isSelected?0:1,
                borderColor: '#f5f5f5',
                backgroundColor: data.item.isSelected?this.props.theme:'#fff'
            }]}
            onPress={() => {
                this.getHouse(data.index, data.item)
            }}
            >
                {
                    data.item.isSelected
                    ?
                        <AntDesign
                            name={'check'}
                            size={14}
                            style={{color: '#fff'}}
                        />
                    :
                        null
                }
            </TouchableOpacity>
            <View style={[CommonStyle.spaceRow,{
                width: width*0.94-18-26-10
            }]}>
                <LazyImage
                    source={data.item.image&&data.item.image.length>0&&data.item.image[0].domain&&data.item.image[0].image_url?{
                        uri:data.item.image[0].domain + data.item.image[0].image_url
                    }:require('../../../../assets/images/error.png')}
                    style={{
                        width: 120,
                        height: 90,
                        borderRadius: 6
                    }}
                />
                <View style={[CommonStyle.spaceCol,{
                    width: width*0.94-18-26-10-133,
                    height: 90,
                    alignItems: 'flex-start'
                }]}>
                    <View>
                        <Text
                            numberOfLines={2} ellipsizeMode={'tail'}
                            style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}
                        >{data.item.flag===1?'露营':data.item.flag===2?'民宿':'酒店'}({data.item.num}间)</Text>
                        <Text style={{
                            marginTop: 10,
                            backgroundColor: '#f4f4f4',
                            fontSize: 12,
                            color:'#333',
                            padding:3
                        }}>可住{data.item.max_person}人/房间</Text>
                    </View>
                    <View style={[CommonStyle.spaceRow,{
                        width: '100%'
                    }]}>
                        <View>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>¥{parseFloat(data.item.price)}</Text>
                        </View>
                        <View style={CommonStyle.flexStart}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                borderWidth: 1,
                                borderColor: '#d6d6d6'
                            }]}
                            onPress={()=>{
                                this.delNum(data.index)
                            }}
                            >
                                <AntDesign
                                    name={'minus'}
                                    size={14}
                                    style={{color:'#d6d6d6'}}
                                />
                            </TouchableOpacity>
                            <Text style={{
                                color:'#333',
                                marginLeft: 15
                            }}>{data.item.choiceNum}</Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                borderWidth: 1,
                                borderColor: '#d6d6d6',
                                marginLeft: 15
                            }]}
                              onPress={()=>{
                                  this.addNum(data.index)
                              }}
                            >
                                <AntDesign
                                    name={'plus'}
                                    size={14}
                                    style={{color:'#d6d6d6'}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </View>
        </View>
    }
    render(){
        const {join} = this.props;
        return(
            <View style={{flex: 1,position: 'relative'}}>
                <RNEasyTopNavBar
                    title={'选择住宿'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    join&&join.house&&join.house.length>0
                    ?
                        <FlatList
                            data={this.state.houseList}
                            extraData={this.state.houseList}
                            showsVerticalScrollIndicator = {false}
                            renderItem={data=>this.renderItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        null
                }
                <SafeAreaView style={{
                    position:'absolute',
                    left: 0,
                    right: 0,
                    bottom:0,
                    backgroundColor: '#fff'
                }}>
                    <View style={[CommonStyle.flexCenter,{
                        height:60
                    }]}>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height:40,
                            backgroundColor: this.props.theme,
                            borderRadius: 6,
                        }]}
                        onPress={() => {
                            this.sureHouse()
                        }}
                        >
                            <Text style={{color:'#fff'}}>确认选择</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

            </View>
        )
    }
}
const mapStateToProps = state => ({
    join: state.join.join,
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    initJoin: join => dispatch(action.initJoin(join))
});
export default connect(mapStateToProps, mapDispatchToProps)(House)

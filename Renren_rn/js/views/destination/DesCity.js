import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    FlatList,
    TextInput,
    ScrollView,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux';
import Screening from '../../model/screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import NoData from '../../common/NoData';
import Ractive from '../../common/Ractive';
const {width, height} = Dimensions.get('window')
class DesCity extends Component{
    constructor(props) {
        super(props);
        this.tabNames = [
            {
                title:'类型',
                data:[{title:'全部',id: 1},{title:'户外活动',id: 1},{title:'少数民族',id: 2},{title:'本土文化', id:3}],
                type: 1
            },
            {
                title:'排序',
                data:[{title:'全部',id: 0},{title:'价格低到高',id: 6},{title:'评分优先', id: 1},{title:'评论优先', id: 4},{title:'收藏优先', id: 3}],
                type: 1
            },
            {
                title:'筛选',
                data:[],
                type: 3
            }
        ];
        this.city=this.props.navigation.state.params.city;
        this.state={
            customData: '',
            sort: '',
            country: '',
            province: '',
            city: this.city,
            kind_id: '',
            list: [],
            keywords: '',
            languageIndex: -1,
            needVol: -1,
            peopleNum: 0,
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('keywords', this.state.keywords);
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
        formData.append('laguage', this.state.languageIndex>-1?this.state.languageIndex:'');
        formData.append('kind_id',this.state.kind_id);
        formData.append('is_volunteen', this.state.needVol>-1?this.state.needVol:'');
        formData.append('max_person_num', this.state.peopleNum?this.state.peopleNum:'');
        Fetch.post(NewHttp + 'ActivityListUserTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    list: res.data.data
                })
            }
        })
    }
    _itemOnpress(tIndex, index, data) {
        if(tIndex===0) {
            this.setState({
                kind_id: data.id
            },() => {
                this.loadData()
            })
        }else if(tIndex===1) {
            this.setState({
                sort: data.id
            },() => {
                this.loadData()
            })
        }
    }
    getCustom() {
        return(
            <CustomContent
                {...this.props}
                {...this.state}
                changeLan={(data) => {
                    this.setState({
                        languageIndex: data
                    })
                }}
                changeNeedVol={(data) => {
                    this.setState({
                        needVol: data
                    })
                }}
                changeNum={(data) => {
                    this.setState({
                        peopleNum: data
                    })
                }}
                cleanCon = {() => {
                    this._cleanCon()
                }}
                showEnd={() => {
                    this._showEnd()
                }}
            />
        )
    }
    _cleanCon() {
        this.setState({
            languageIndex: -1,
            needVol: -1,
            peopleNum: '',
        })
    }
    _showEnd() {
        this.loadData();
        this._clickCancelBtn();
    }
    _clickCancelBtn() {
        this.screen.openOrClosePanel(this.state.screenIndex)
    }
    _initCustomData() {

    }
    _renderItem(data) {
        return <Ractive
            total={this.state.list.length}
            data_r={data.item}
            data_index={data.index}
        />
    }
    render() {
        return(
            <SafeAreaView style={[CommonStyle.flexCenter,{flex: 1,backgroundColor: '#fff',justifyContent:'flex-start'}]}>
                <SafeAreaView>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height: 50}]}>
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{color: '#333'}}
                            onPress={()=>NavigatorUtils.backToUp(this.props)}
                        />
                        <View style={[CommonStyle.flexStart,{
                            height: 36,
                            width:width*0.94-30,
                            backgroundColor: '#f5f7fa',
                            borderRadius: 4
                        }]}>
                            <View style={[CommonStyle.flexCenter,{
                                height:20,
                                width:70,
                                borderRightWidth: 1,
                                borderRightColor: '#dcdcdc'
                            }]}>
                                <Text style={{
                                    color:this.props.theme,
                                    fontWeight: 'bold'
                                }}>{this.props.navigation.state.params.city}</Text>
                            </View>
                            <TextInput style={[CommonStyle.flexCenter,{
                                width: width*0.94-30-70,
                                height:36,
                                paddingLeft: 10,
                                paddingRight: 10
                            }]}
                            placeholder={'搜索体验'}
                            defaultValue={this.state.keywords}
                            onBlur={() => {
                               this.loadData();
                            }}
                            onChangeText={(text) => {
                                this.setState({
                                    keywords: text
                                })
                            }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
                <Screening
                    ref={screen => this.screen = screen}
                    screenData={this.tabNames}
                    selectHeader={(data, index) => {
                        this.setState({
                            screenIndex: index
                        })
                    }}
                    selectIndex={[0,0,0]}
                    customContent={this.getCustom()}
                    customData={this.state.customData}
                    customFunc={()=>{
                        this.picker.showPicker()
                    }}
                    initCustomData={() => {this._initCustomData()}}
                    itemOnpress={(tIndex, index, data) => {
                        this._itemOnpress(tIndex, index, data)
                    }}
                >
                    {
                        this.state.list.length>0
                        ?
                            <View style={{
                                marginLeft: width*0.03
                            }}>
                                <FlatList
                                    data={this.state.list}
                                    renderItem={(data)=>this._renderItem(data)}
                                    showsVerticalScrollIndicator = {false}
                                    showsHorizontalScrollIndicator = {false}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        :
                            <NoData />
                    }
                </Screening>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    cityitem_img:{
        width: '100%',
        height: 126,
        borderRadius: 3
    },
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    tab_item:{
        padding: 3,
        marginRight: 15
    },
    screen_title:{
        color:'#333',
        fontSize: 13,
        marginTop: 20,
        fontWeight: "bold"
    },
    addRoll:{
        width: 34,
        height:34,
        borderRadius: 17,
        borderWidth: 1
    }
})
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(DesCity)
class CustomContent extends Component{
    constructor(props) {
        super(props);
        this.languages = ['中文', 'English', '日本語']
        this.volunteer = ['不需要', '需要'];
        this.state = {
            languageIndex: this.props.languageIndex,
            needVol: this.props.needVol,
            peopleNum: this.props.peopleNum,
            startPrice: this.props.startPrice,
            endPrice: this.props.endPrice
        }
    }
    delNum() {
        let num = this.state.peopleNum;
        if(num>0) {
            num--;
        }
        this.setState({
            peopleNum: num
        },() => {
            this.props.changeNum(num)
        })
    }
    addNum() {
        let num = this.state.peopleNum;
        num ++;
        this.setState({
            peopleNum: num
        },() => {
            this.props.changeNum(num)
        })
    }
    cleanCon() {
        if(this.state.languageIndex>-1||this.state.needVol>-1||this.state.peopleNum?this.props.theme:'#999') {
            this.setState({
                languageIndex: -1,
                needVol: -1,
                peopleNum: '',
            })
            this.props.cleanCon();
        }
    }
    render(){
        const {languageIndex, needVol} = this.state;
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1,position:'relative'}]}>
                <ScrollView
                    showsHorizontalScrollIndicator = {false}
                    scrollEventThrottle={16}
                >
                    <View style={[CommonStyle.commonWidth]}>
                        <Text style={styles.screen_title}>语言</Text>
                        <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 19}]}>
                            {
                                this.languages.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        width:70,
                                        height:36,
                                        backgroundColor:languageIndex==index?this.props.theme:'#F5F7FA',
                                        marginRight: 22
                                    }]}
                                                             onPress={() => {
                                                                 this.setState({
                                                                     languageIndex: index
                                                                 },() => {
                                                                     this.props.changeLan(index)
                                                                 })
                                                             }}
                                    >
                                        <Text style={{color:languageIndex==index?'#fff':'#333',fontSize: 13}}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <Text style={styles.screen_title}>志愿者</Text>
                        <View style={[CommonStyle.flexStart,{flexWrap:'wrap',marginTop: 19}]}>
                            {
                                this.volunteer.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        width:70,
                                        height:36,
                                        backgroundColor:needVol==index?this.props.theme:'#F5F7FA',
                                        marginRight: 22
                                    }]}
                                                             onPress={() => {
                                                                 this.setState({
                                                                     needVol: index
                                                                 },() => {
                                                                     this.props.changeNeedVol(index)
                                                                 })
                                                             }}
                                    >
                                        <Text style={{color:needVol==index?'#fff':'#333',fontSize: 13}}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <Text style={styles.screen_title}>参与人数</Text>
                        <View style={[CommonStyle.flexStart,{marginTop: 19,marginBottom: 70}]}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.addRoll,{
                                borderColor:'#D6D6D6'
                            }]}
                                              onPress={() => {
                                                  this.delNum()
                                              }}
                            >
                                <AntDesign
                                    name={'minus'}
                                    size={18}
                                    style={{color:'#BFBFBF'}}
                                />
                            </TouchableOpacity>
                            <Text style={{marginLeft: 25,fontSize: 18,color:'#666'}}>{this.state.peopleNum?this.state.peopleNum:0}</Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.addRoll,{
                                borderColor:'#14c5ca',
                                marginLeft: 25
                            }]}
                                              onPress={() => {
                                                  this.addNum()
                                              }}
                            >
                                <AntDesign
                                    name={'plus'}
                                    size={18}
                                    style={{color:'#14c5ca'}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View style={[CommonStyle.flexStart,{
                    position: 'absolute',
                    left:0,
                    right:0,
                    bottom: 0,
                    height:50,
                    backgroundColor: '#fff'
                }]}>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        width:100,
                        height:40,
                        marginLeft: width*0.03
                    }]}
                                      onPress={() => {
                                          this.cleanCon()
                                      }}
                    >
                        <Text style={{
                            color: this.state.languageIndex>-1||this.state.needVol>-1||this.state.peopleNum?this.props.theme:'#999'
                        }}>清除全部</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        height:40,
                        backgroundColor:'#14c5ca',
                        borderRadius: 4,
                        width: width*0.94-120,
                        marginLeft: 20
                    }]}
                      onPress={() => {
                          this.props.showEnd()
                      }}
                    >
                        <Text style={{color:'#fff',fontSize: 15,fontWeight:'bold'}}>显示结果</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

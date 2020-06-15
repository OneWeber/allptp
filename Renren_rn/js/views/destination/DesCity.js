import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, FlatList} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux';
import Screening from '../../model/screen';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
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
            list: []
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
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
        console.log(formData)
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
            <CustomContent />
        )
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
                            <TouchableOpacity style={[CommonStyle.flexCenter,{
                                width: width*0.94-30-70,
                                height:36
                            }]}>
                                <Text style={{color:'#999',fontSize: 13}}>目的地或体验</Text>
                            </TouchableOpacity>

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
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(DesCity)
class CustomContent extends Component{
    render(){
        return(
            <View></View>
        )
    }
}

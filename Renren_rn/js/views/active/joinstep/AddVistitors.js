import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView,TextInput} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import action from '../../../action';
class AddVistitors extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            tel :'',
            isChild: false,
            idCard: ''
        };
        this.index = this.props.navigation.state.params.index;
        this.isEdit = this.props.navigation.state.params.isEdit;
    }
    componentDidMount() {
        const {join} = this.props;
        if(this.isEdit) {
            this.setState({
                name: join.person[this.index].name,
                tel: join.person[this.index].tel,
                isChild: join.person[this.index].type===1?false:true,
                idCard: join.person[this.index].tel.idCard
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
    _addVisitor() {
        const {join, initJoin} = this.props;
        let personList = join.person;
        if(this.isEdit) {
            personList[this.index] = {
                name: this.state.name,
                type: this.state.isChild?2:1,
                tel: this.state.tel,
                idCard: this.state.idCard
            }
            let data = {
                activity_id: join.activity_id,
                slot_id: join.slot_id,
                person: personList,
                house: join.house,
                houseid:join.houseid,
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
        }else{
            personList.push({
                name: this.state.name,
                type: this.state.isChild?2:1,
                tel: this.state.tel,
                idCard: this.state.idCard
            })
            let data = {
                activity_id: join.activity_id,
                slot_id: join.slot_id,
                person: personList,
                house: join.house,
                houseid:join.houseid,
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

    }
    render() {
        const {join} = this.props;
        const {isChild} = this.state;
        return (
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'添加游客'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                fontSize: 18,
                                color: '#333',
                                marginTop: 20
                            }}>
                                当前已添加{join&&join.person?join.person.length:null}位游客
                            </Text>
                            <Text style={{
                                color:'#666',
                                marginTop: 20
                            }}>请务必填写真实姓名，以便策划者统计。</Text>
                            <Text style={{
                                color: '#333',
                                fontWeight: 'bold',
                                marginTop: 20
                            }}>姓名</Text>
                            <TextInput
                                placeholder={'请输入游客姓名'}
                                defaultValue={this.state.name}
                                onChangeText={(text) => {
                                    this.setState({
                                        name: text
                                    })
                                }}
                                style={{
                                    height: 40,
                                    marginTop: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f5f5f5'
                                }}
                            />
                            <Text style={{
                                color: '#333',
                                fontWeight: 'bold',
                                marginTop: 20
                            }}>联系电话</Text>
                            <TextInput
                                placeholder={'请输入联系电话'}
                                keyboardType={"number-pad"}
                                defaultValue={this.state.tel}
                                onChangeText={(text) => {
                                    this.setState({
                                        tel: text
                                    })
                                }}
                                style={{
                                    height: 40,
                                    marginTop: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f5f5f5'
                                }}
                            />
                            <Text style={{
                                color: '#333',
                                fontWeight: 'bold',
                                marginTop: 20
                            }}>身份证</Text>
                            <TextInput
                                placeholder={'请输入身份证'}
                                keyboardType={"number-pad"}
                                defaultValue={this.state.idCard}
                                onChangeText={(text) => {
                                    this.setState({
                                        idCard: text
                                    })
                                }}
                                style={{
                                    height: 40,
                                    marginTop: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f5f5f5'
                                }}
                            />
                            <TouchableOpacity style={[CommonStyle.spaceRow,{
                                marginTop: 20
                            }]}
                            onPress={()=>{
                                this.setState({
                                    isChild: !this.state.isChild
                                })
                            }}
                            >
                                <Text>当前游客是否为儿童游客</Text>
                                <View style={[CommonStyle.flexCenter,{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 3,
                                    borderWidth: isChild?0:1,
                                    borderColor: '#f5f5f5',
                                    backgroundColor:isChild?this.props.theme:'#fff'
                                }]}>
                                    {
                                        isChild
                                        ?
                                            <AntDesign
                                                name={'check'}
                                                size={14}
                                                style={{color:'#fff'}}
                                            />
                                        :
                                            null
                                    }
                                </View>
                            </TouchableOpacity>
                            <Text style={{
                                color:'#999',
                                fontSize: 12,
                                marginTop: 10
                            }}>儿童价标准为{join.kids_stand_low}岁到{join.kids_stand_high}岁</Text>
                            {
                                this.state.name
                                ?
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        height: 40,
                                        marginTop: 30,
                                        backgroundColor: this.props.theme,
                                        borderRadius: 3,
                                    }]}
                                    onPress={()=>{
                                        this._addVisitor()
                                    }}
                                    >
                                        <Text style={{color:'#fff'}}>确认添加</Text>
                                    </TouchableOpacity>
                                :
                                    <View style={[CommonStyle.flexCenter,{
                                        height: 40,
                                        marginTop: 30,
                                        backgroundColor: '#d5d5d5',
                                        borderRadius: 3
                                    }]}
                                    >
                                        <Text style={{color:'#fff'}}>确认添加</Text>
                                    </View>
                            }


                        </View>
                    </View>
                </ScrollView>
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
})
export default connect(mapStateToProps, mapDispatchToProps)(AddVistitors)

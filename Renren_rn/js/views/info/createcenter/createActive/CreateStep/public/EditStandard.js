import React,{Component} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import CreateHeader from '../../../../../../common/CreateHeader';
import {connect} from 'react-redux'
import CommonStyle from '../../../../../../../assets/css/Common_css';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import action from '../../../../../../action'
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
class EditStandard extends Component{
    constructor(props) {
        super(props);
        this.role = this.props.navigation.state.params.role;
        this.isEdit = this.props.navigation.state.params.isEdit?this.props.navigation.state.params.isEdit:false;
        this.info = this.props.navigation.state.params.slotInfo?this.props.navigation.state.params.slotInfo:null;
    }
    render(){
        const {hasDiscount} = this.props
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                <CreateHeader title={this.role==='standard'?hasDiscount?'标准活动价格':'标准价格':hasDiscount?'儿童活动价格':'儿童价格'} navigation={this.props.navigation}/>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={CommonStyle.flexCenter}>
                            <View style={[CommonStyle.commonWidth]}>
                                {
                                    !this.isEdit
                                    ?
                                        hasDiscount
                                        ?
                                            <TrueDiscount role={this.role} isEdit={this.isEdit} info={this.info} {...this.props}/>
                                        :
                                            <FalseDiscount role={this.role} isEdit={this.isEdit} info={this.info} {...this.props}/>
                                    :
                                        hasDiscount
                                            ?
                                            <TrueDiscount role={this.role} isEdit={this.isEdit} info={this.info} {...this.props}/>
                                            :
                                            <FalseDiscount role={this.role} isEdit={this.isEdit} info={this.info} {...this.props}/>
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    hasDiscount: state.steps.hasDiscount,
    theme: state.theme.theme,
    adultStandard: state.steps.adultStandard,
    childStandard: state.steps.childStandard,
});
const mapDispatchToProps = dispatch => ({
    changeAdultStandard: data => dispatch(action.changeAdultStandard(data)),
    changeChildStandard: data => dispatch(action.changeChildStandard(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(EditStandard)
class FalseDiscount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            standardPrice: this.props.role==='standard'?this.props.isEdit?this.props.info.price_origin:this.props.adultStandard.originalPrice:this.props.isEdit?this.props.info.kids_price_origin:this.props.childStandard.originalPrice
        }
    }

    confirmPrice(){
        const {role,  changeAdultStandard, changeChildStandard,isEdit} = this.props;
        let data = {
            standard: 10,
            originalPrice: this.state.standardPrice
        };
        if(role === 'standard') {
            changeAdultStandard(data)
        } else {
            changeChildStandard(data)
        }
        NavigatorUtils.goPage({}, 'LongTime')


    }
    render(){
        const {standardPrice} = this.state;
        const {isEdit, info} = this.props;
        return(
            <View style={{flex: 1}}>
                <View style={[CommonStyle.spaceRow,{
                    height:60,
                    marginTop: 10,
                    backgroundColor:'#fff',
                    borderRadius: 5,
                    paddingLeft: 15,
                    paddingRight: 15
                }]}>
                    <Text style={{
                        color:'#333',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>价格</Text>
                    <View style={CommonStyle.flexEnd}>
                        <TextInput
                            onChangeText={(text)=>this.setState({standardPrice:text})}
                            defaultValue={this.state.standardPrice?JSON.stringify(parseFloat(this.state.standardPrice)):''}
                            keyboardType='numeric'
                            style={{
                                width:170,
                                height:60,
                                backgroundColor: '#fff',
                                textAlign:'right',
                                marginRight: 3,
                                color:'#333',
                                fontSize: 14
                            }}
                        />
                        <Text style={{color:'#696969'}}>元/人</Text>
                    </View>
                </View>
                {
                    standardPrice
                    ?
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:40,
                            marginTop: 45,
                            backgroundColor:this.props.theme,
                            borderRadius: 5
                        }]} onPress={() => {this.confirmPrice()}}>
                            <Text style={{color:'#fff'}}>确定</Text>
                        </TouchableOpacity>
                    :
                        <View style={[CommonStyle.flexCenter,{
                            height:40,
                            marginTop: 45,
                            backgroundColor:'#d5d5d5',
                            borderRadius: 5
                        }]}>
                            <Text style={{color:'#fff'}}>确定</Text>
                        </View>
                }

            </View>
        )
    }
}

class TrueDiscount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            initPrice: this.props.role==='standard'?this.props.isEdit?this.props.info.price_origin:this.props.adultStandard.originalPrice:this.props.isEdit?this.props.info.kids_price_origin:this.props.childStandard.originalPrice,
            discount: this.props.role==='standard'?this.props.isEdit?this.props.info.price_discount:this.props.adultStandard.standard:this.props.isEdit?this.props.info.kids_price_discount:this.props.childStandard.standard,
        }
    }
    componentDidMount(){
        console.log(this.props)
    }

    confirmPrice(){
        const {role,  changeAdultStandard, changeChildStandard} = this.props;
        let data = {
            standard: this.state.discount,
            originalPrice: this.state.initPrice
        };
        if(role === 'standard') {
            changeAdultStandard(data)
        } else {
            changeChildStandard(data)
        }
        NavigatorUtils.goPage({}, 'LongTime')
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <View style={[{
                    marginTop: 10,
                    backgroundColor:'#fff',
                    borderRadius: 5,
                    paddingLeft: 15,
                    paddingRight: 15
                }]}>
                    <View style={[CommonStyle.spaceRow,{
                        height:60,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f5f5f5',
                    }]}>
                        <Text style={{
                            color:'#333',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>原价</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TextInput
                                onChangeText={(text)=>this.setState({initPrice:text})}
                                defaultValue={this.state.initPrice?JSON.stringify(parseFloat(this.state.initPrice)):''}
                                keyboardType='numeric'
                                style={{
                                    width:170,
                                    height:60,
                                    backgroundColor: '#fff',
                                    textAlign:'right',
                                    marginRight: 3,
                                    color:'#333',
                                    fontSize: 14
                                }}
                            />
                            <Text style={{color:'#696969'}}>元/人</Text>
                        </View>
                    </View>
                    <View style={[CommonStyle.spaceRow,{
                        height:60,
                        width: '100%'
                    }]}>
                        <Text style={{
                            color:'#333',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>折扣</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TextInput
                                onChangeText={(text)=>this.setState({discount:text})}
                                defaultValue={this.state.discount?JSON.stringify(parseFloat(this.state.discount))==0||JSON.stringify(parseFloat(this.state.discount))==10?"":JSON.stringify(parseFloat(this.state.discount)):''}
                                keyboardType='numeric'
                                style={{
                                    width:170,
                                    height:60,
                                    backgroundColor: '#fff',
                                    textAlign:'right',
                                    marginRight: 3,
                                    color:'#333',
                                    fontSize: 14
                                }}
                            />
                            <Text style={{color:'#696969'}}>折</Text>
                        </View>
                    </View>
                </View>
                <View style={[CommonStyle.spaceRow,{
                    height:60,
                    marginTop: 10,
                    backgroundColor:'#fff',
                    borderRadius: 5,
                    paddingLeft: 15,
                    paddingRight: 15
                }]}>
                    <Text style={{
                        color:'#333',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>折扣价</Text>
                    <View style={CommonStyle.flexEnd}>
                        <Text style={{color:'#696969',marginRight: 3}}>
                            {!this.state.discount?this.state.initPrice?this.state.initPrice:'':this.state.initPrice*(this.state.discount/10)?this.state.initPrice*(this.state.discount/10):''}
                        </Text>
                        <Text style={{color:'#696969'}}>元/人</Text>
                    </View>
                </View>
                {
                    this.state.initPrice && this.state.discount
                        ?
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:40,
                            marginTop: 45,
                            backgroundColor:this.props.theme,
                            borderRadius: 5
                        }]} onPress={()=>{this.confirmPrice()}}>
                            <Text style={{color:'#fff'}}>确认价格</Text>
                        </TouchableOpacity>
                        :
                        <View style={[CommonStyle.flexCenter,{
                            height:40,
                            marginTop: 45,
                            backgroundColor:'#d5d5d5',
                            borderRadius: 5
                        }]}>
                            <Text style={{color:'#fff'}}>确认价格</Text>
                        </View>
                }
            </View>
        )
    }
}

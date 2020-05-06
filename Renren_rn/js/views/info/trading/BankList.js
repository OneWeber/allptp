import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, RefreshControl, FlatList} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import NewHttp from '../../../utils/NewHttp';
import action from '../../../action'
const {width} = Dimensions.get('window')
class BankList extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.loadCard()
    }
    loadCard() {
        const {token, onLoadBank} = this.props;
        this.storeName = 'bank';
        let formData = new FormData();
        formData.append('token', token);
        onLoadBank(this.storeName, NewHttp+'bankl', formData)
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
    getRightButton() {
        const {bank} = this.props;
        let store = bank[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return <View>
            {
                store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                ?
                    <TouchableOpacity
                        style={{paddingRight: width*0.03}}
                        onPress={()=>{
                            NavigatorUtils.goPage({}, 'AddCard')
                        }}
                    >
                        <AntDesign
                            name={'plus'}
                            size={20}
                        />
                    </TouchableOpacity>
                :
                    null
            }
        </View>
    }
    regCard(val) {
        var reg = /^(\d{4})\d+(\d{4})$/;
        return val.replace(reg, "$1 **** **** $2")
    }
    renderItem(data) {
        return <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
            marginTop: 20,
            height: 111,
            backgroundColor: '#5C6EDC',
            borderRadius: 5,
            paddingLeft: 12,
            paddingRight: 12,
            alignItems:'flex-start'
        }]}>
            <View style={[CommonStyle.flexStart,{
                width: '100%'
            }]}>
                <View style={{
                    width:36,
                    height:36,
                    borderRadius: 18,
                    backgroundColor:'#fff'
                }}></View>
                <View style={[CommonStyle.spaceCol,{
                    height:36,
                    alignItems:'flex-start',
                    marginLeft: 12
                }]}>
                    <Text style={{
                        color:'#fff',
                        fontWeight: 'bold'
                    }}>{data.item.bank_name}</Text>
                    <Text style={{color:'#fff',fontSize: 12}}>储蓄卡</Text>
                </View>
            </View>
            <Text style={{marginTop: 15,color:'#fff',fontSize: 18,fontWeight: 'bold'}}>
                {this.regCard(data.item.card_number.split(' ').join(''))}
            </Text>



        </View>
    }
    render() {
        const {bank} = this.props;
        let store = bank[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'我的银行卡'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                {
                    store.items&&store.items.data&&store.items.data.data&&store.items.data.data.length>0
                    ?
                        <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                            <FlatList
                                data={store.items.data.data}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    :
                        <View style={CommonStyle.flexCenter}>
                            <AddCard {...this.props}/>
                        </View>
                }

            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme,
    bank: state.bank
});
const mapDispatchToProps = dispatch => ({
    onLoadBank: (storeName, url, data) => dispatch(action.onLoadBank(storeName, url, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(BankList)

class AddCard extends Component{
    render() {
        return(
            <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                marginTop: 20,
                height: 111,
                shadowColor:'#C1C7CF',
                shadowOffset:{width:1, height:1},
                shadowOpacity: 0.6,
                shadowRadius: 2,
                backgroundColor: '#fff'
            }]} onPress={()=>{
                NavigatorUtils.goPage({}, 'AddCard')
            }}>
                <View style={[CommonStyle.flexCenter,{
                    width:35,
                    height:35,
                    borderRadius: 17.5,
                    backgroundColor:this.props.theme
                }]}>
                    <AntDesign
                        name={'plus'}
                        size={18}
                        style={{color:'#fff'}}
                    />
                </View>
                <Text style={{
                    color:'#333',
                    fontWeight:'bold',
                    fontSize:15,
                    marginTop:10
                }}>添加银行卡</Text>
            </TouchableOpacity>
        )
    }
}

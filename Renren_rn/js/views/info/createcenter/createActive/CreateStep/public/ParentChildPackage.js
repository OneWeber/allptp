import React,{Component} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, SafeAreaView} from 'react-native';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import {connect} from 'react-redux'
import action from '../../../../../../action'
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
const {width} = Dimensions.get('window')
class ParentChildPackage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showBot: false
        }
    }
    getLeftButton(){
        return <TouchableOpacity
            style={CommonStyle.back_icon}
            onPress={() =>{
                this.props.navigation.goBack()
            }}
        >
            <AntDesign
                name={'left'}
                size={20}
            />
        </TouchableOpacity>
    }
    getRightButton(){
        const {parenChildPackage} = this.props
        return <View style={{paddingRight: width*0.03}}>
            {
                parenChildPackage.length > 0
                ?
                    <Text style={{color:this.props.theme,fontSize: 16}}>新添加</Text>
                :
                    null
            }
        </View>
    }
    _changeBot(val){
        this.setState({
            showBot: val
        })
    }
    render(){
        const {parenChildPackage} = this.props
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: parenChildPackage.length>0?'#fff':"#f5f5f5"}}>
                <RNEasyTopNavBar
                    title={'添加亲子套餐'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <ScrollView>
                    <View style={CommonStyle.flexCenter}>
                        {
                            parenChildPackage.length > 0
                            ?
                                <View style={{width:'100%'}}>
                                    <PackageList changeBot={(val)=>this._changeBot(val)} {...this.props}/>
                                </View>
                            :
                                <View style={CommonStyle.commonWidth}>
                                    <AddPCPackage {...this.props}/>
                                </View>
                        }

                    </View>
                </ScrollView>
                {
                    this.state.showBot
                    ?
                        <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                                <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                    backgroundColor:this.props.theme
                                }]}
                                >
                                    <Text style={{color:'#fff'}}>应用到当前选择日期</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    :
                        null
                }

            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    parenChildPackage: state.steps.parenChildPackage
})
const mapDispatchToProps = dispatch => ({
    changeParentChildPackage: data => dispatch(action.changeParentChildPackage(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(ParentChildPackage)
class AddPCPackage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adultNum: '',
            childNum: '',
            totalPrice: ''
        }
    }
    addPackage(){
        const {changeParentChildPackage, parenChildPackage} = this.props;
        let list = parenChildPackage;
        let data = {
            adultNum: this.state.adultNum,
            childNum: this.state.childNum,
            totalPrice: this.state.totalPrice
        };
        list.push(data);
        changeParentChildPackage(list);
        NavigatorUtils.goPage({}, 'LongTime')
    }
    render(){
        return(
            <View>
                <Text style={{
                    marginTop: 22.5,
                    color:'#999',
                    fontSize: 13
                }}>请添加套餐成人和儿童的人数以及总价</Text>
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
                        }}>成人</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TextInput
                                onChangeText={(text)=>this.setState({adultNum:text})}
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
                            <Text style={{color:'#696969'}}>人</Text>
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
                        }}>儿童</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TextInput
                                onChangeText={(text)=>this.setState({childNum:text})}
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
                            <Text style={{color:'#696969'}}>人</Text>
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
                    }}>总价</Text>
                    <View style={CommonStyle.flexEnd}>
                        <TextInput
                            onChangeText={(text)=>this.setState({totalPrice:text})}
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
                        <Text style={{color:'#696969'}}>元</Text>
                    </View>
                </View>

                {
                    this.state.adultNum && this.state.childNum && this.state.totalPrice
                        ?
                        <TouchableOpacity style={[CommonStyle.flexCenter,{
                            height:40,
                            marginTop: 45,
                            backgroundColor:this.props.theme,
                            borderRadius: 5
                        }]} onPress={()=>this.addPackage()}>
                            <Text style={{color:'#fff'}}>确认添加</Text>
                        </TouchableOpacity>
                        :
                        <View style={[CommonStyle.flexCenter,{
                            height:40,
                            marginTop: 45,
                            backgroundColor:'#d5d5d5',
                            borderRadius: 5
                        }]}>
                            <Text style={{color:'#fff'}}>确认添加</Text>
                        </View>
                }
            </View>
        )
    }
}
class PackageList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status: []
        }
    }
    componentDidMount() {
        const {parenChildPackage} = this.props;
        let list = []
        for(let i=0; i<parenChildPackage.length; i++){
            list.push(0)
        }
        this.setState({
            status: list
        })
    }
    clickItem(index){
        let list = this.state.status;
        if(list[index]===0){
            list[index] = 1
        } else {
            list[index] = 0
        }
        this.setState({
            status: list
        },() => {
            if(list.indexOf(1) > -1){
                this.props.changeBot(true)
            } else {
                this.props.changeBot(false)
            }
        })
    }
    render(){
        const {parenChildPackage} = this.props;
        return(
            <View style={[CommonStyle.flexCenter,{
                borderTopWidth: 10,
                borderTopColor:'#f5f5f5',
                marginBottom: 100
            }]}>
                <View style={[CommonStyle.commonWidth,{
                    paddingTop: 24.5
                }]}>
                    <Text style={{
                        color:'#333',
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}>已经添加{parenChildPackage.length}个亲子套餐</Text>
                    {
                        parenChildPackage.map((item, index) => {
                            return <TouchableOpacity key={index} style={[CommonStyle.spaceRow,{
                                marginTop: 20
                            }]} onPress={()=>{this.clickItem(index)}}>
                                <View style={[styles.roll,CommonStyle.flexCenter,{
                                    borderWidth: this.state.status[index]?0:1,
                                    borderColor:'#aaaaaa',
                                    backgroundColor: this.state.status[index]?this.props.theme:'#fff'
                                }]}>
                                    {
                                        this.state.status[index]
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
                                <View style={[CommonStyle.spaceRow,{
                                    width:width*0.94-28,
                                    height: 40,
                                    backgroundColor:'#f5f7fa',
                                    borderRadius: 5,
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }]}>
                                    <View style={CommonStyle.flexStart}>
                                        <Text style={{color:'#333',fontWeight:'bold'}}>亲子</Text>
                                        <Text style={{marginLeft: 5}}>{item.adultNum}成人{item.childNum}儿童</Text>
                                        <Text style={{color:this.props.theme,marginLeft: 20}}>¥{item.totalPrice}</Text>
                                    </View>
                                    <View style={CommonStyle.flexEnd}>
                                        <Text style={{color:'#A4A4A4'}}>编辑</Text>
                                        <Text style={{color:'#A4A4A4',marginLeft: 15}}>删除</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        })
                    }

                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    roll:{
        width: 18,
        height: 18,
        borderRadius: 9
    }
})

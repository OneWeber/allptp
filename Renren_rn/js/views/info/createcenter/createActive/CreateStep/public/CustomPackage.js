import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
import CreateHeader from '../../../../../../common/CreateHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../../../../../action'
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
const {width} = Dimensions.get('window')
class CustomPackage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            customePackageName: '',
            customePackagePeople: '',
            customePackageTotalPrice: '',
            isAdd: false,
            status: [],
            showBot: false,
            packageList: [],
            selectPackage: []
        }
        this.isEdit = this.props.navigation.state.params.isEdit?this.props.navigation.state.params.isEdit:false;
        this.data = this.props.navigation.state.params.data?this.props.navigation.state.params.data:false;
    }
    componentDidMount(){
        this.getParentPackageList();

        if(this.isEdit) {
            this.setState({
                customePackageName:typeof(this.data.name)=='string'?this.data.name:JSON.stringify(this.data.name),
                customePackagePeople:typeof(this.data.adult)=='string'?this.data.adult:JSON.stringify(this.data.adult),
                customePackageTotalPrice: this.data.price
            })
        }


    }
    getParentPackageList() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('activity_id', this.props.activity_id);
        formData.append('type', 2);
        Fetch.post(NewHttp+'CombineUsedTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    packageList: res.data
                },() => {
                    const {packageList} = this.state;
                    if(packageList.length>0) {
                        let list = []
                        for(let i=0; i<packageList.length; i++){
                            list.push(0)
                        }
                        this.setState({
                            status: list
                        })
                    }
                })
            }
        })
    }
    confirmPackage(){
        const {customePackage, changeCustomePackage} = this.props;
        let list = customePackage;
        let data = {
            name: this.state.customePackageName,
            adult: this.state.customePackagePeople,
            price: this.state.customePackageTotalPrice,
            type: 2,
            flag: 1,
            date: [],

        }
        list.push(data);
        changeCustomePackage(list);
        NavigatorUtils.goPage({}, 'LongTime')
    }
    clickItem(index) {
        let list = this.state.status;
        if(list[index]===0){
            list[index] = 1
        } else {
            list[index] = 0
        }
        this.setState({
            status: list
        },() => {
            let data = [];
            for(let i=0;i<list.length;i++) {
                if(list[i] === 1) {
                    data.push(this.state.packageList[i])
                }
            }
            this.setState({
                selectPackage: data
            })
            if(list.indexOf(1) > -1){
                this.setState({
                    showBot:true
                })
            } else {
                this.setState({
                    showBot:false
                })
            }
        })
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
    getRightButton() {
        const {packageList} = this.state;
        return <View style={{paddingRight: width*0.03}}>
            {
                packageList.length > 0 && !this.isEdit && !this.state.isAdd
                    ?
                    <Text
                        style={{color:this.props.theme,fontSize: 16}}
                        onPress={() => {
                            this.setState({
                                isAdd: true
                            })
                        }}
                    >新添加</Text>
                    :
                    null
            }
        </View>
    }
    usePackage() {
        const {changeCustomePackage} = this.props;
        changeCustomePackage(this.state.selectPackage);
        NavigatorUtils.goPage({ }, 'LongTime')
    }
    saveChange() {
        const {customePackage, changeCustomePackage} = this.props;
        let data = customePackage;
        let index = this.props.navigation.state.params.index
        data[index] = {
            combine_id: data[index].combine_id,
            name: this.state.customePackageName,
            adult: this.state.customePackagePeople,
            price: this.state.customePackageTotalPrice,
            type: 2,
            flag: 1,
            date: []
        }
        changeCustomePackage(data);
        NavigatorUtils.goPage({ }, 'LongTime')
    }
    render(){
        const {packageList} = this.state;
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: "#fff"}}>
                <RNEasyTopNavBar
                    title={'添加综合套餐'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={CommonStyle.flexCenter}>
                            {
                                packageList.length>0 && !this.isEdit && !this.state.isAdd
                                ?
                                    <View style={[CommonStyle.flexCenter,{
                                        width:width,
                                        backgroundColor: '#fff',
                                        borderTopWidth: 10,
                                        borderTopColor: '#f5f5f5'
                                    }]}>
                                        <View style={[CommonStyle.commonWidth,{
                                            paddingTop: 24.5
                                        }]}>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}>创建过{packageList.length}个综合套餐</Text>
                                            {
                                                packageList.map((item, index) => {
                                                    return <View key={index} style={[CommonStyle.spaceRow,{
                                                        marginTop: 20
                                                    }]}>
                                                        <TouchableOpacity style={[styles.roll,CommonStyle.flexCenter,{
                                                            borderWidth: this.state.status[index]?0:1,
                                                            borderColor:'#aaaaaa',
                                                            backgroundColor: this.state.status[index]?this.props.theme:'#fff'
                                                        }]}
                                                        onPress={()=>{this.clickItem(index)}}
                                                        >
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
                                                        </TouchableOpacity>
                                                        <View style={[CommonStyle.spaceRow,{
                                                            width:width*0.94-28,
                                                            height: 40,
                                                            backgroundColor:'#f5f7fa',
                                                            borderRadius: 5,
                                                            paddingLeft: 15,
                                                            paddingRight: 15
                                                        }]}>
                                                            <View style={CommonStyle.flexStart}>
                                                                <Text style={{color:'#333',fontWeight:'bold'}}>{item.name}</Text>
                                                                <Text style={{marginLeft: 5}}>{item.adult}人</Text>
                                                                <Text style={{color:this.props.theme,marginLeft: 20}}>¥{item.price}</Text>
                                                            </View>
                                                            <View style={CommonStyle.flexEnd}>
                                                                <Text style={{color:'#A4A4A4',marginLeft: 15}}>删除</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                })
                                            }
                                        </View>
                                    </View>
                                :
                                    <View style={[CommonStyle.commonWidth]}>
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
                                                }}>套餐名称</Text>
                                                <View style={CommonStyle.flexEnd}>
                                                    <TextInput
                                                        placeholder="自由输入不超过10个字"
                                                        maxLength={10}
                                                        onChangeText={(text)=>this.setState({customePackageName:text})}
                                                        defaultValue={this.state.customePackageName}
                                                        style={{
                                                            width:200,
                                                            height:60,
                                                            backgroundColor: '#fff',
                                                            textAlign:'right',
                                                            marginRight: 3,
                                                            color:'#333',
                                                            fontSize: 14
                                                        }}
                                                    />
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
                                                }}>人数</Text>
                                                <View style={CommonStyle.flexEnd}>
                                                    <TextInput
                                                        onChangeText={(text)=>this.setState({customePackagePeople:text})}
                                                        defaultValue={this.state.customePackagePeople}
                                                        keyboardType={"number-pad"}
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
                                                <View style={CommonStyle.flexEnd}>
                                                    <TextInput
                                                        onChangeText={(text)=>this.setState({customePackageTotalPrice:text})}
                                                        defaultValue={this.state.customePackageTotalPrice?JSON.stringify(parseFloat(this.state.customePackageTotalPrice)):''}
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
                                                    <Text style={{color:'#696969'}}>元</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            this.state.customePackageName && this.state.customePackagePeople && this.state.customePackageTotalPrice
                                                ?
                                                this.isEdit
                                                    ?
                                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                                        height:40,
                                                        marginTop: 45,
                                                        backgroundColor:this.props.theme,
                                                        borderRadius: 5
                                                    }]} onPress={()=>{this.saveChange()}}>
                                                        <Text style={{color:'#fff'}}>保存</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                                        height:40,
                                                        marginTop: 45,
                                                        backgroundColor:this.props.theme,
                                                        borderRadius: 5
                                                    }]} onPress={()=>{this.confirmPackage()}}>
                                                        <Text style={{color:'#fff'}}>确认添加</Text>
                                                    </TouchableOpacity>
                                                :
                                                this.isEdit
                                                    ?
                                                        <View style={[CommonStyle.flexCenter,{
                                                            height:40,
                                                            marginTop: 45,
                                                            backgroundColor:'#d5d5d5',
                                                            borderRadius: 5
                                                        }]}>
                                                            <Text style={{color:'#fff'}}>保存</Text>
                                                        </View>
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
                            }

                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                {
                    this.state.showBot
                    ?
                        <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                                <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                    backgroundColor:this.props.theme
                                }]}
                                onPress={() => {
                                    this.usePackage()
                                }}
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
const styles = StyleSheet.create({
    roll:{
        width: 18,
        height: 18,
        borderRadius: 9
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    customePackage: state.steps.customePackage,
    token: state.token.token,
    activity_id: state.steps.activity_id,
})
const mapDispatchToProps = dispatch => ({
    changeCustomePackage: data => dispatch(action.changeCustomePackage(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(CustomPackage)

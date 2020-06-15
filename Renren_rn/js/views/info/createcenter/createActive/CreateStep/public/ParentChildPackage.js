import React,{Component} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, SafeAreaView,Alert} from 'react-native';
import CommonStyle from '../../../../../../../assets/css/Common_css';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import {connect} from 'react-redux'
import action from '../../../../../../action'
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigatorUtils from '../../../../../../navigator/NavigatorUtils';
import Fetch from '../../../../../../expand/dao/Fetch';
import NewHttp from '../../../../../../utils/NewHttp';
const {width} = Dimensions.get('window');
const title = "";
const message = '套餐应用到'
class ParentChildPackage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showBot: false,
            isAdd: false,
            packageList: this.props.parenChildPackage,
            selectPackage: []
        }
        this.isEdit = this.props.navigation.state.params.isEdit?this.props.navigation.state.params.isEdit:false;
        this.data = this.props.navigation.state.params.data?this.props.navigation.state.params.data:false;
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
    componentDidMount(){
        this.getParentPackageList();
    }

    getParentPackageList() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('version', '2.0');
        formData.append('activity_id', this.props.activity_id);
        formData.append('type', 1);
        Fetch.post(NewHttp+'CombineUsedTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    packageList: res.data
                })
            }
        })
    }
    getRightButton(){
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
    _changeBot(val){
        this.setState({
            showBot: val
        })
    }
    usePackage() {
        const {changeParentChildPackage} = this.props;
        changeParentChildPackage(this.state.selectPackage);
        NavigatorUtils.goPage({ }, 'LongTime')
    }
    alertUse() {
        Alert.alert(
            title,
            message,
            [
                {text: '当前选择日期', onPress: () => {this.usePackage()}},
                {text: '所有日期', onPress: () => console.log('OK Pressed')},
                {text: '自定义日期', onPress: () => console.log('送伞')},
                {text: '取消', onPress: () => console.log('送伞'),style: 'cancel'},
            ],
            {
                cancelable: true,
                onDismiss: () => {

                }
            }
        )

    }
    render(){
        const {packageList} = this.state;
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: packageList.length>0?'#fff':"#f5f5f5"}}>
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
                            packageList.length > 0 && !this.isEdit && !this.state.isAdd
                            ?
                                <View style={{width:'100%'}}>
                                    <PackageList
                                        changeBot={(val)=>this._changeBot(val)}
                                        {...this.props}
                                        {...this.state}
                                        changePackage={(data) => {
                                            this.setState({
                                                selectPackage: data
                                            },() => {
                                                console.log(this.state.selectPackage)
                                            })
                                        }}
                                    />
                                </View>
                            :
                                <View style={CommonStyle.commonWidth}>
                                    <AddPCPackage {...this.props} data={this.data} isEdit={this.isEdit} {...this.state}/>
                                </View>
                        }

                    </View>
                </ScrollView>
                {
                    this.state.showBot
                    ?
                        <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                                {
                                    this.props.navigation.state.params.timeIndex
                                    ?
                                        <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                            backgroundColor:this.props.theme
                                        }]}
                                        onPress={() => {
                                            this.alertUse()
                                        }}
                                        >
                                            <Text style={{color:'#fff'}}>应用到</Text>
                                        </TouchableOpacity>
                                    :
                                        <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                            backgroundColor:this.props.theme
                                        }]}
                                          onPress={() => {
                                              this.usePackage()
                                          }}
                                        >
                                            <Text style={{color:'#fff'}}>应用到当前选择日期</Text>
                                        </TouchableOpacity>
                                }

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
    parenChildPackage: state.steps.parenChildPackage,
    token: state.token.token,
    activity_id: state.steps.activity_id,
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
    componentDidMount(){
        if(this.props.isEdit) {
            console.log(this.props.data)
            this.setState({
                adultNum:typeof(this.props.data.adult)=='string'?this.props.data.adult:JSON.stringify(this.props.data.adult),
                childNum:typeof(this.props.data.kids)=='string'?this.props.data.kids:JSON.stringify(this.props.data.kids),
                totalPrice: this.props.data.price
            })
        }
    }

    addPackage(){
        const {changeParentChildPackage, parenChildPackage} = this.props;
        let list = parenChildPackage;
        let data = {
            adult: this.state.adultNum,
            kids: this.state.childNum,
            price: this.state.totalPrice,
            name: '',
            type: 1,
            flag: 1,
            date: []
        };
        list.push(data);
        changeParentChildPackage(list);
        NavigatorUtils.goPage({}, 'LongTime')
    }
    saveChange() {
        const {parenChildPackage, changeParentChildPackage} = this.props;
        let data = parenChildPackage;
        let index = this.props.navigation.state.params.index;
        data[index] = {
            combine_id: data[index].combine_id,
            adult: this.state.adultNum,
            kids: this.state.childNum,
            price: this.state.totalPrice,
            name: '',
            type: 1,
            flag: 1,
            date: []
        }
        changeParentChildPackage(data);
        NavigatorUtils.goPage({ }, 'LongTime')
    }
    render(){
        const {isEdit} = this.props
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
                                defaultValue={this.state.adultNum}
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
                                defaultValue={this.state.childNum}
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
                        <TextInput
                            onChangeText={(text)=>this.setState({totalPrice:text})}
                            defaultValue={this.state.totalPrice?JSON.stringify(parseFloat(this.state.totalPrice)):''}
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

                {
                    this.state.adultNum && this.state.childNum && this.state.totalPrice
                        ?
                        isEdit
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
                            }]} onPress={()=>this.addPackage()}>
                                <Text style={{color:'#fff'}}>确认添加</Text>
                            </TouchableOpacity>
                        :
                        isEdit
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
        )
    }
}
class PackageList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            status: [],
        }
    }
    componentDidMount() {
        const {packageList} = this.props;
        let list = []
        for(let i=0; i<packageList.length; i++){
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
            let data = [];
            for(let i=0;i<list.length;i++) {
                if(list[i] === 1) {
                    data.push(this.props.packageList[i])
                }
            }
            if(list.indexOf(1) > -1){
                this.props.changeBot(true);
                this.props.changePackage(data)
            } else {
                this.props.changeBot(false)
            }
        })
    }
    render(){
        const {packageList} = this.props;
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
                    }}>创建过{packageList.length}个亲子套餐</Text>
                    {
                        packageList.map((item, index) => {
                            return <View key={index} style={[CommonStyle.spaceRow,{
                                marginTop: 20
                            }]} >
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
                                        <Text style={{color:'#333',fontWeight:'bold'}}>亲子</Text>
                                        <Text style={{marginLeft: 5}}>{item.adult}成人{item.kids}儿童</Text>
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

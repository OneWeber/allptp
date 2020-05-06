import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import LazyImage from 'animated-lazy-image';
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import action from '../../../../../action';
import NewHttp from '../../../../../utils/NewHttp';
const {width} = Dimensions.get('window')
class Accommodation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenning: false,
            tabIndex: 0,
            volTabIndex: 0,
            isLoading: false
        }
        this.tabNames = [
            {
                id: 0,
                title: '不提供'
            },
            {
                id: 1,
                title: '提供'
            },
            {
                id: 2,
                title: '包含住宿'
            }
        ]
        this.tabNamesVol = [
            {
                id: 0,
                title: '不提供'
            },
            {
                id: 1,
                title: '提供'
            }
        ]
    }
    componentDidMount() {
        const {activity_id} = this.props;
        if(activity_id === '') {
            return
        } else {
            this.initData()
        }
    }
    initData() {
        const {changeStatus} = this.props;
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            if(res.code === 1) {
                console.log(res)
            }
        })
    }
    changeIndex(index) {
        this.setState({
            tabIndex: index
        })
    }
    changeVolIndex(index) {
        this.setState({
            volTabIndex: index
        })
    }
    goNext() {
        if(this.state.tabIndex===2) {
            if(this.props.accommodation.length===0) {
                this.refs.toast.show('请添加住宿信息')
            }
        }else {
            this.saveAccommodation()
        }
    }
    saveAccommodation() {
        this.setState({
            isLoading: true
        });
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        formData.append("step",12);
        formData.append("issatay",this.state.tabIndex);
        formData.append("house_volunteen",this.state.volTabIndex);
        formData.append("house",JSON.stringify(this.props.accommodation));
        formData.append("house_image",JSON.stringify(this.props.acc_imageId));
        formData.append("isapp",1);
        Fetch.post(HttpUrl+'Activity/save_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    isLoading: false
                },()=>{
                    NavigatorUtils.goPage({}, 'Attention')
                })
            }

        })
    }
    render(){
        const {tabIndex, volTabIndex} = this.state;
        return(
            <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                <Toast ref="toast" position='center' positionValue={0}/>
                <CreateHeader title={'提供住宿'} navigation={this.props.navigation}/>
                <SiderMenu clickIcon={()=>{this.setState({
                    isOpenning:!this.state.isOpenning
                })}}/>
                <ScrollView>
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor:'#fff',
                        paddingTop:20,
                        paddingBottom: 20,
                        justifyContent:'flex-start'}]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.main_title}>是否为参与者提供住宿</Text>
                            {
                                this.tabNames.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                        marginTop: 20
                                    }]} onPress={()=>this.changeIndex(index)}>
                                        <View style={[CommonStyle.flexCenter,{
                                            height: 18,
                                            width: 18,
                                            borderRadius: 9,
                                            borderWidth: tabIndex===index?0:1,
                                            borderColor: '#ccc',
                                            backgroundColor: tabIndex===index?this.props.theme:'#fff'
                                        }]}>
                                            {
                                                tabIndex===index
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
                                        <Text style={{
                                            marginLeft: 11.5,
                                            color: '#333'
                                        }}>{item.title}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    </View>
                    {
                        tabIndex === 1
                        ?
                            <Provide {...this.props}/>
                        :
                        tabIndex === 2
                        ?
                            <Contains {...this.props}/>
                        :
                            null
                    }

                    {/*为志愿者提供住宿*/}
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor:'#fff',
                        paddingTop:20,
                        paddingBottom: 20,
                        marginTop: 10,
                        marginBottom: 100,
                        justifyContent:'flex-start'}]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={styles.main_title}>是否为志愿者提供住宿</Text>
                            {
                                this.tabNamesVol.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexStart,{
                                        marginTop: 20
                                    }]} onPress={()=>this.changeVolIndex(index)}>
                                        <View style={[CommonStyle.flexCenter,{
                                            height: 18,
                                            width: 18,
                                            borderRadius: 9,
                                            borderWidth: volTabIndex===index?0:1,
                                            borderColor: '#ccc',
                                            backgroundColor: volTabIndex===index?this.props.theme:'#fff'
                                        }]}>
                                            {
                                                volTabIndex===index
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
                                        <Text style={{
                                            marginLeft: 11.5,
                                            color: '#333'
                                        }}>{item.title}</Text>
                                    </TouchableOpacity>
                                })
                            }

                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                        <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                            backgroundColor:this.props.theme
                        }]}
                          onPress={()=>this.goNext()}
                        >
                            {
                                this.state.isLoading
                                    ?
                                    <ActivityIndicator size={'small'} color={'#f5f5f5'}/>
                                    :
                                    <Text style={{color:'#fff'}}>保存并继续</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
        lineHeight:20
    },
});
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    accommodation: state.steps.accommodation,
    activity_id: state.steps.activity_id,
    acc_imageId: state.steps.acc_imageId
})
const mapDispatchToProps = dispatch => ({
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Accommodation)
class Contains extends Component{
    render() {
        return (
            <View style={[CommonStyle.flexCenter,{
                backgroundColor:'#fff',
                paddingTop:20,
                paddingBottom: 20,
                marginTop: 10,
                justifyContent:'flex-start'}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={styles.main_title}>您提供的住宿图片</Text>
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        width: 130,
                        height: 108,
                        borderColor: '#dfe1e4',
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        borderRadius: 2,
                        marginTop: 22.5
                    }]}>
                        <AntDesign
                            name={'plus'}
                            size={22}
                            style={{color:'#666'}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
class Provide extends Component{
    render() {
        const {accommodation} = this.props;
        return (
            <View style={[CommonStyle.flexCenter,{
                backgroundColor:'#fff',
                paddingTop:20,
                paddingBottom: 20,
                marginTop: 10,
                justifyContent:'flex-start'}]}>
                <View style={CommonStyle.commonWidth}>
                   <View style={[CommonStyle.spaceRow]}>
                       <Text style={{
                           color:'#333',
                           fontSize: 16,
                           fontWeight: "bold"
                       }}>添加住宿</Text>
                       <TouchableOpacity style={[CommonStyle.flexCenter,{
                           width:50,
                           height:27,
                           backgroundColor: '#ecfeff',
                           borderRadius: 13.5
                       }]} onPress={()=>{
                           NavigatorUtils.goPage({}, 'AddAccommodation')
                       }}>
                           <Text style={{
                               color:this.props.theme,
                               fontSize: 13,
                               fontWeight: "bold"
                           }}>添加</Text>
                       </TouchableOpacity>
                   </View>
                    {
                        accommodation&&accommodation.length>0
                        ?
                            accommodation.map((item, index) => {
                                return <View key={index} style={[CommonStyle.spaceRow,{
                                    padding: 11,
                                    backgroundColor: '#f5f7fa',
                                    borderRadius: 5,
                                    marginTop: 10
                                }]}>
                                    <LazyImage
                                        source={{uri: accommodation[0].images[0].send.img}}
                                        style={{
                                            width:90,
                                            height:75,
                                            borderRadius: 4
                                        }}
                                    />
                                    <View style={[CommonStyle.spaceCol,{
                                        height:75,
                                        width: width*0.94-90-115,
                                        alignItems:'flex-start'
                                    }]}>
                                        <View>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 13
                                            }}>{item.flag===1?'露营':item.flag===2?'民宿':'酒店'}</Text>
                                            <Text style={{
                                                color:'#333',
                                                fontSize: 12,
                                                marginTop: 10
                                            }}>¥{item.price}/人</Text>
                                        </View>
                                        <View style={CommonStyle.flexStart}>
                                            <Text style={{
                                                color:'#666',
                                                fontSize: 12
                                            }}>房数:{item.num}间</Text>
                                            <Text style={{
                                                marginLeft: 15,
                                                color:'#666',
                                                fontSize: 12
                                            }}>每间可住{item.max_person}人</Text>
                                        </View>
                                    </View>
                                    <View style={[CommonStyle.flexStart,{
                                        height:75,
                                        alignItems:'flex-start'
                                    }]}>
                                        <Text style={{color:'#a4a4a4',fontSize: 13,marginRight: 15}}>编辑</Text>
                                        <Text style={{color:'#a4a4a4',fontSize: 13}}>删除</Text>
                                    </View>

                                </View>
                            })
                        :
                            null
                    }


                </View>
            </View>
        )
    }
}

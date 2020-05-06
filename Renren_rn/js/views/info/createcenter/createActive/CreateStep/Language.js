import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView,Dimensions, ActivityIndicator, Image} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import SiderMenu from '../../../../../common/SiderMenu';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Prompt from './common/Prompt';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import SideMenu from 'react-native-side-menu';
import Modal from 'react-native-modalbox';
import MenuContent from '../../../../../common/MenuContent';
import action from '../../../../../action'
import Fetch from '../../../../../expand/dao/Fetch';
import Toast, {DURATION} from 'react-native-easy-toast';
import NewHttp from '../../../../../utils/NewHttp';
import HttpUrl from '../../../../../utils/Http';
const {width, height} = Dimensions.get('window')
class Language extends Component{
    constructor(props) {
        super(props);
        this.prompts = [
            '您需要会用您选择的语言与参与者交流',
            '体验发布后，您还可以添加自己会说的其他语言'
        ];
        this.languages = [
            {
                title: '中文',
                val: 0
            },
            {
                title: 'English',
                val: 1
            },
            {
                title: '日本語',
                val: 2
            }
        ]
        this.state = {
            isOpenning: false,
            languageIndex: -1,
            isSingle: true,
            mainLanguge: [-1, -1, -1],
            selectOther: [],
            isLoading: false,
            isInit: false
        }
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
        const {changeStatus} = this.props
        this.setState({
            isInit: true
        })
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    languageIndex: res.data.main_laguage,
                    selectOther: res.data.other_laguage===''?[]:res.data.other_laguage.split(','),
                    isInit: false,
                }, () => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    goNext(){
        if(!this.state.isLoading) {
            this.saveActive()
        }
    }
    saveActive() {
        const {activity_id, changeActivityId} = this.props;
        if(this.state.languageIndex === -1) {
            this.refs.toast.show('请选择主要语言')
        } else {
            this.setState({
                isLoading: true
            })
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("main_laguage",this.state.languageIndex);
            formData.append("activity_id",activity_id);
            formData.append("other_laguage",JSON.stringify(this.state.selectOther));
            formData.append("step",0);
            formData.append("isapp",1);
            Fetch.post(NewHttp+'ActivitSaveTwo', formData).then(res => {
                if(res.code === 1) {
                    this.setState({
                        isLoading: false
                    },() => {
                        if(activity_id === '') {
                            changeActivityId(res.data)
                        }
                        this.initUncommitted()
                        NavigatorUtils.goPage({},'Type')
                    })
                }
            })
        }
    }
    initUncommitted() {
        const {onLoadUncommit} = this.props;
        this.storeName = 'uncommit';
        let formData=new FormData();
        formData.append('token', this.props.token);
        formData.append('flag',1);
        onLoadUncommit(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    chanegMainLanguage(val) {
        if(this.state.isSingle) {
            this.setState({
                languageIndex: val
            },() => {
                this.refs.language.close()
            })
        } else {
            let list = this.state.mainLanguge;
            let select = [];
            for(let i=0;i<list.length;i++) {
                if(i === val) {
                    if(list[i] === -1) {
                        list[i] = 1
                    } else {
                        list[i] = -1
                    }
                }
                if(list[i] === 1) {
                    select.push(i)
                }
            }
            this.setState({
                mainLanguge: list,
                selectOther: select
            })
        }

    }
    render(){
        const {theme} = this.props;
        const {isOpenning, languageIndex, mainLanguge, isSingle, selectOther, isInit} = this.state;
        const menu = <MenuContent navigation={this.props.navigation}/>
        return(
            <SideMenu
                menu={menu}
                isOpen={isOpenning}
                openMenuOffset={width*2/3}
                hiddenMenuOffset={0}
                edgeHitWidth={50}
                disableGestures={false}
                onChange={
                    (isOpen) => {
                        isOpen ?
                            this.setState({
                                isOpenning:true
                            })
                            :
                            this.setState({
                                isOpenning:false
                            })

                    }}
                menuPosition={'right'}     //抽屉在左侧还是右侧
                autoClosing={true}         //默认为true 如果为true 一有事件发生抽屉就会关闭
            >
                <View style={{flex: 1,position:'relative',backgroundColor: "#f5f5f5"}}>
                    <Toast ref="toast" position='center' positionValue={0}/>
                    <CreateHeader title={'语言'} navigation={this.props.navigation}/>
                    <SiderMenu clickIcon={()=>{this.setState({
                        isOpenning:!this.state.isOpenning
                    })}}/>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{backgroundColor:'#fff'}]}>
                            <View style={CommonStyle.commonWidth}>
                                <View style={{
                                    paddingTop:20,
                                    paddingBottom: 20,
                                }}>
                                    <Text style={{
                                        color:'#333',
                                        fontSize: 16,
                                        fontWeight: "bold"
                                    }}>请选择体验显示语言</Text>
                                    <Text style={{
                                        color:'#333',
                                        lineHeight: 20,
                                        marginTop: 15
                                    }}>
                                        该语言将是您得体验页面得显示的语言，也是您开展体
                                        验时所用的语言，它也将作为参与者搜索体验时使用的
                                        筛选条件之一
                                    </Text>
                                    <Text style={{
                                        color:theme,
                                        fontWeight:'bold',
                                        fontSize:16.8,
                                        marginTop:25
                                    }}>小贴士</Text>
                                    <Prompt data={this.prompts}/>
                                </View>
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>主要语言</Text>
                                {
                                    isInit
                                    ?
                                        <Image
                                            source={require('../../../../../../assets/images/jz.gif')}
                                            style={{width:20,height:20}}
                                        />
                                    :
                                    languageIndex === -1
                                    ?
                                        <TouchableOpacity
                                            style={[CommonStyle.flexCenter,styles.select_btn]}
                                            onPress={()=>{this.setState({
                                                isSingle: true
                                            },() => {
                                                this.refs.language.open()
                                            })}}
                                        >
                                            <Text style={{
                                                color:theme,
                                                fontWeight:'bold',
                                                fontSize: 13
                                            }}>选择</Text>
                                        </TouchableOpacity>
                                    :
                                        <Text style={{
                                            color:this.props.theme,
                                            fontWeight: 'bold'
                                        }}
                                          onPress={()=>{this.setState({
                                              isSingle: true
                                          },() => {
                                              this.refs.language.open()
                                          })}}
                                        >{this.languages[languageIndex].title}</Text>
                                }

                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            backgroundColor:'#fff',
                            height:64,
                            marginTop:10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                height:64
                            }]}>
                                <Text style={[styles.main_title]}>其他语言</Text>
                                {
                                    isInit
                                    ?
                                    <Image
                                        source={require('../../../../../../assets/images/jz.gif')}
                                        style={{width:20,height:20}}
                                    />
                                    :
                                    selectOther.length > 0
                                    ?
                                        <TouchableOpacity
                                            style={CommonStyle.flexEnd}
                                            onPress={() => {
                                                this.setState({
                                                    isSingle: false
                                                },() => {
                                                    this.refs.language.open()
                                                })
                                            }}
                                        >
                                            {
                                                selectOther.map((item, index) => {
                                                    return <Text key={index} style={{
                                                        color:this.props.theme,
                                                        marginLeft: 5,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {this.languages[item].title}
                                                    </Text>
                                                })
                                            }
                                        </TouchableOpacity>
                                    :
                                        <TouchableOpacity
                                            style={[CommonStyle.flexCenter,styles.select_btn]}
                                            onPress={() => {
                                                this.setState({
                                                    isSingle: false
                                                },() => {
                                                    this.refs.language.open()
                                                })
                                            }}
                                        >
                                            <Text style={{
                                                color:theme,
                                                fontWeight:'bold',
                                                fontSize: 13
                                            }}>选择</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <Modal
                            style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                            ref={"language"}
                            animationDuration={200}
                            position={"bottom"}
                            backdropColor={'rgba(0,0,0,0.9)'}
                            swipeToClose={true}
                            backdropPressToClose={true}
                            coverScreen={true}>
                            <View style={{
                                height: 180,
                                backgroundColor:'#fff'
                            }}>
                                {
                                    this.languages.map((item, index) => {
                                        return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                            height:60,
                                            borderBottomColor: '#f5f5f5',
                                            borderBottomWidth: index===2?0:1
                                        }]} onPress={() => {
                                            this.chanegMainLanguage(item.val)
                                        }}>
                                            <Text style={{
                                                color:isSingle?'#333':mainLanguge[index]===1?this.props.theme:'#333'
                                            }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </Modal>
                    </ScrollView>
                    <SafeAreaView style={[CommonStyle.bot_btn,CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{height:49}]}>
                            <TouchableOpacity style={[CommonStyle.btn,CommonStyle.flexCenter,{
                                backgroundColor:theme
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
            </SideMenu>
        )
    }
}
const styles = StyleSheet.create({
    main_title:{
        color:'#333',
        fontSize: 16,
        fontWeight:'bold',
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },

})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    activity_id: state.steps.activity_id
});
const mapDispatchToProps = dispatch => ({
    changeLanguage: data => dispatch(action.changeLanguage(data)),
    changeOtherLanguage: data => dispatch(action.changeOtherLanguage(data)),
    changeActivityId: id => dispatch(action.changeActivityId(id)),
    onLoadUncommit:(storeName, url, data) => dispatch(action.onLoadUncommit(storeName, url, data)),
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Language)

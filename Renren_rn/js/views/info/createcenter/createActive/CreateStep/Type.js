import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import CreateHeader from '../../../../../common/CreateHeader';
import CommonStyle from '../../../../../../assets/css/Common_css';
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox';
import Fetch from '../../../../../expand/dao/Fetch';
import HttpUrl from '../../../../../utils/Http';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import SideMenu from 'react-native-side-menu';
import MenuContent from '../../../../../common/MenuContent';
import SiderMenu from '../../../../../common/SiderMenu';
import Toast, {DURATION} from 'react-native-easy-toast';
import NewHttp from '../../../../../utils/NewHttp';
import action from '../../../../../action';
const {width, height} = Dimensions.get('window')
class Type extends Component{
    constructor(props) {
        super(props);
        this.state = {
            typeList: [],
            isOpenning: false,
            typeIndex: 0,
            isLoading: false,
            isInit: false
        }
    }
    componentDidMount() {
        this.getAllType()
        const {activity_id} = this.props;
        if(activity_id === '') {
            return
        } else {
            this.initData()
        }
    }
    initData() {
        const {changeStatus} = this.props;
        this.setState({
            isInit: true
        });
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append("activity_id",this.props.activity_id);
        Fetch.post(NewHttp+'ActivityETwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    typeIndex: res.data.kind_id,
                    isInit: false,
                }, () => {
                    changeStatus(res.data.step.split(','))
                })
            }
        })
    }
    getAllType() {
        let formData = new FormData();
        formData.append("token",this.props.token);
        formData.append('top_id','');
        Fetch.post(HttpUrl+'Story/get_kind', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    typeList: res.data
                })
            }
        })
    }
    changeType(kind_id) {
        this.setState({
            typeIndex: kind_id
        },() => {
            this.refs.type.close()
        })
    }
    goNext() {
        if(!this.state.isLoading) {
            this.saveType()
        }

    }
    saveType() {
        const {activity_id} = this.props;
        if(!this.state.typeIndex) {
            this.refs.toast.show('请选择体验类型')
        } else {
            this.setState({
                isLoading: true
            });
            let formData = new FormData();
            formData.append("token",this.props.token);
            formData.append("kind_id",this.state.typeIndex);
            formData.append("activity_id",activity_id);
            formData.append("question",JSON.stringify([]));
            formData.append("step",1);
            formData.append("isapp",1);
            Fetch.post(NewHttp+'ActivitSaveTwo', formData).then(res => {
                if(res.code === 1) {
                    this.setState({
                        isLoading: false
                    })
                    NavigatorUtils.goPage({}, 'Introduce')
                }
            })
        }
    }
    render(){
        const {theme} = this.props;
        const {typeList, isOpenning, typeIndex, isInit} = this.state;
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
                <CreateHeader title={'类型'} navigation={this.props.navigation}/>
                <SiderMenu clickIcon={()=>{this.setState({
                    isOpenning:!this.state.isOpenning
                })}}/>
                <ScrollView>
                    <View style={[CommonStyle.flexCenter,{
                        backgroundColor:'#fff',
                        paddingTop:20,
                        paddingBottom: 20,
                    }]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                color:'#333',
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>你提供的体验是什么类型的？</Text>
                        </View>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            marginTop: 20
                        }]}>
                            <Text style={[styles.main_title]}>体验类型</Text>
                            {
                                isInit
                                ?
                                    <Image
                                        source={require('../../../../../../assets/images/jz.gif')}
                                        style={{width:20,height:20}}
                                    />
                                :
                                typeIndex
                                ?
                                    <View>
                                        <Text style={{
                                            color:theme,
                                            fontWeight: 'bold'
                                        }} onPress={()=>{
                                            this.refs.type.open()
                                        }}>{typeList[typeIndex-1].kind_name}</Text>
                                    </View>
                                :
                                    <TouchableOpacity
                                        style={[CommonStyle.flexCenter,styles.select_btn]}
                                        onPress={()=>this.refs.type.open()}
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
                        ref={"type"}
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
                                typeList.map((item, index) => {
                                    return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                        height:60,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: index===2?0:1
                                    }]} onPress={() => {
                                        this.changeType(item.kind_id)
                                    }}>
                                        <Text style={{
                                            color:'#333'
                                        }}>{item.kind_name}</Text>
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
    changeStatus: arr => dispatch(action.changeStatus(arr))
})
export default connect(mapStateToProps, mapDispatchToProps)(Type)

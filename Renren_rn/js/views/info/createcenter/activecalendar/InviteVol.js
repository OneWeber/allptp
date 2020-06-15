import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Dimensions, ScrollView, TouchableHighlight, Image,
} from 'react-native';
import {connect} from 'react-redux'
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../../assets/css/Common_css';
import action from '../../../../action';
import HttpUrl from '../../../../utils/Http';
import NoData from '../../../../common/NoData';
import LazyImage from 'animated-lazy-image';
import Modal from 'react-native-modalbox';
import Toast, {DURATION} from 'react-native-easy-toast';
import Fetch from '../../../../expand/dao/Fetch';
import NewHttp from '../../../../utils/NewHttp';
const {width, height} = Dimensions.get('window')
class InviteVol extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            slot: [],
            long_day: '',
            singleState: [],
            manyState: [],
            sendSingle: [],
            sendMany: [],
            isAll: false
        }
    }
    componentDidMount(){
        this.loadData();
        this.getSlot();
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
    loadData(val){
        const {token, onLoadVolunteer,volunteer} = this.props
        this.storeName='volunteer'
        let store = volunteer[this.storeName]
        this.step = 1
        let refreshType = false;
        if(val) {
            refreshType = true
        } else {
            refreshType = false
        }
        let formData=new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort', "");
        formData.append('page',1);
        formData.append('country','');
        formData.append('province', "");
        formData.append('city', "");
        formData.append('region', "");
        formData.append('language', "");
        formData.append('score', "");
        if(val){
            onLoadVolunteer(this.storeName, HttpUrl + 'User/user_list', formData, refreshType, store.items.data.data.total, callback => {
            })
            return
        }
        onLoadVolunteer(this.storeName, HttpUrl + 'User/user_list', formData, refreshType, 0)
    }
    onLoadMore(){
        const {token, onLoadMoreVolunteer, volunteer} = this.props
        let store = volunteer[this.storeName]
        this.step ++;
        let formData = new FormData();
        formData.append('token', token);
        formData.append('keywords','');
        formData.append('sort', "");
        formData.append('page',this.step);
        formData.append('country','');
        formData.append('province', "");
        formData.append('city', "");
        formData.append('region', "");
        formData.append('language', "");
        formData.append('score', "");
        onLoadMoreVolunteer(this.storeName, HttpUrl + 'User/user_list', formData , store.items, callback => {
        })
    }
    genIndicator(){
        const {volunteer} = this.props
        let store = volunteer[this.storeName]
        return store.hideMoreshow || store.hideMoreshow === undefined ?null:
            <View style={[CommonStyle.flexCenter, {width: '100%',marginTop: 10,marginBottom: 10}]}>
                <ActivityIndicator size={'small'} color={'#999'}/>
            </View>
    }
    showInviteModal(user_id) {
        this.setState({
            user_id: user_id
        },() => {
            this.refs.time.open()
        })

    }
    getSlot() {
        let formData = new FormData();
        formData.append('token',this.props.token);
        formData.append('activity_id',this.props.navigation.state.params.activity_id);
        formData.append('visit',0);
        Fetch.post(HttpUrl+'Activity/get_activity', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    slot: res.data.slot,
                    long_day:res.data.long_day//为1是单天的活动，为0是长时间段的活动
                },() => {
                    if(this.state.long_day==1){
                        let arr=[]
                        for(let i=0;i<this.state.slot.length;i++){
                            let child=[];
                            for(let k=0;k<this.state.slot[i].list.length;k++){
                                child.push({
                                    status:0,
                                    slot_id:this.state.slot[i].list[k].slot_id
                                })
                            }
                            arr.push({
                                day:this.state.slot[i].day,
                                id:i,
                                list:child
                            })
                        }
                        this.setState({
                            singleState:arr
                        })
                    }else{
                        let arr=[]
                        for(let i=0;i<this.state.slot.length;i++){
                            arr.push(0)
                        }
                        this.setState({
                            manyState:arr
                        })
                    }
                })
            }
        })
    }
    renderItem(data) {
        return <View style={[CommonStyle.flexCenter,{
            width: (width*0.94-15) /2,
            marginLeft: data.index%2===0?0:15,
            marginTop: 15
        }]}>
            <LazyImage
                source={data.item.headimage?{uri:data.item.headimage.domain + data.item.headimage.image_url}:
                    require('../../../../../assets/images/touxiang.png')}
                style={{
                    width:(width*0.94-15) /2,
                    height:180,
                    borderRadius: 5,
                }}
            />
            <Text style={{color:'#333',fontWeight:'bold',fontSize:15,width:'100%',marginTop: 8.5}}>{
                data.item.family_name||data.item.middle_name||data.item.name
                    ?
                    data.item.family_name+data.item.middle_name+data.item.name
                    :
                    '匿名用户'
            }</Text>
            <Text style={{
                width:'100%',
                marginTop: 10,
                color:'#333',
                fontSize: 12
            }}>主要语言:{data.item.language===0?'中文':data.item.language===1?'English':'日本語'}</Text>
            <TouchableOpacity style={[CommonStyle.flexCenter,{
                height:35,
                width: '100%',
                marginTop: 10,
                backgroundColor: this.props.theme,
                borderRadius: 3
            }]}
            onPress={() => {
                this.showInviteModal(data.item.user_id)
            }}
            >
                <Text style={{color:'#fff'}}>邀请</Text>
            </TouchableOpacity>
        </View>
    }
    addSingleTime(ci,index) {
        let arr=this.state.singleState;
        for(let i=0;i<arr.length;i++){
            if(ci==arr[i].id){
                if(arr[i].list[index].status==0){
                    arr[i].list[index].status=1
                }else{
                    arr[i].list[index].status=0
                }
            }
        }
        this.setState({
            singleState:arr
        },()=>{
            let slotid=[];
            let endArr=this.state.singleState;
            for(let i=0;i<endArr.length;i++){
                for(let k=0;k<endArr[i].list.length;k++){
                    if(endArr[i].list[k].status==1){
                        slotid.push(endArr[i].list[k].slot_id)
                    }
                }
            }
            this.setState({
                sendSingle:slotid
            })
        })
    }
    removeDuplicatedItem(arr) {
        for(let i = 0; i < arr.length-1; i++){
            for(let j = i+1; j < arr.length; j++){
                if(arr[i]==arr[j]){
                    arr.splice(j,1);//console.log(arr[j]);
                    j--;
                }
            }
        }
        return arr;
    }
    addTimeMany(index) {
        let arr=this.state.manyState;
        let sendArr=this.state.sendMany;
        for(let i=0;i<arr.length;i++){
            if(i==index){
                if(arr[i]==0){
                    arr[i]=1;
                    sendArr.push(this.state.slot[i].slot_id)
                    sendArr=this.removeDuplicatedItem(sendArr)
                }else{
                    arr[i]=0;
                    for(let k=0;k<sendArr.length;k++){
                        if(sendArr[k]==this.state.slot[i].slot_id){
                            sendArr.splice(k,1)
                        }
                    }

                }
            }
        }
        this.setState({
            manyState:arr,
            sendMany:sendArr
        },()=>{
            if(this.state.sendMany.length==this.state.slot.length){
                this.setState({
                    isAll:true
                })
            }else if(this.state.sendMany.length<this.state.slot.length){
                this.setState({
                    isAll:false
                })
            }
        })
    }
    renderItemSlot(data) {
        const {singleState, manyState} = this.state;
        return <View>
            <Text style={{
                color:'#333333',
                marginTop:15,
                fontSize:16
            }}>
                {data.item.day}
            </Text>
            {
                data.item.list.map((item,index)=>{
                    return <TouchableOpacity
                        style={{justifyContent:'center',alignItems:'center',width:'100%'}}
                        underlayColor='rgba(255,255,255,.9)'
                        key={index}
                        onPress={() =>{this.addSingleTime(data.index,index,item.time[0],item.time[1])}}
                    >
                        <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',marginTop:15}}>
                            <Text style={{color:"#999999"}}>{item.time[0]} -- {item.time[1]}</Text>
                            <View style={[CommonStyle.flexCenter,{
                                width:18,
                                height:18,
                                borderRadius:3,
                                borderColor: '#666',
                                borderWidth: singleState.length>0&&singleState[data.index].list[index].status === 1?0:1,
                                backgroundColor:singleState.length>0&&singleState[data.index].list[index].status === 1?this.props.theme: '#fff'
                            }]}>
                                {
                                    singleState.length>0&&singleState[data.index].list[index].status === 1
                                    ?
                                        <AntDesign
                                            name={'check'}
                                            size={14}
                                            style={{color: '#fff'}}
                                        />
                                    :
                                        null
                                }

                            </View>
                        </View>
                    </TouchableOpacity>
                })
            }

        </View>
    }
    renderItemSlotMany(data) {
        const {manyState} = this.state;
        return <TouchableOpacity
            style={{justifyContent:'center',alignItems:'center',width:'100%'}}
            underlayColor='rgba(255,255,255,.9)'
            onPress={() =>{this.addTimeMany(data.index)}}
            key={data.index}
        >
            <View style={{width:'100%',justifyContent:'space-between',alignItems:'center',flexDirection:'row',paddingLeft:10,paddingRight:10,marginTop:15,marginBottom:i==this.state.slot.length-1?10:0}}>
                <View><Text>{this.state.slot[i].begin_date} {this.state.slot[i].begin_time} -- {this.state.slot[i].end_date} {this.state.slot[i].end_time}</Text></View>
                <View style={{
                    width:18,
                    height:18,
                    borderRadius:3,
                    borderColor: '#666',
                    borderWidth: manyState[data.index]?0:1,
                    backgroundColor:manyState[data.index]?this.props.theme: '#fff'
                }}>
                    {
                        manyState[data.index]
                            ?
                            <AntDesign
                                name={'check'}
                                size={14}
                                style={{color: '#fff'}}
                            />
                            :
                            null
                    }

                </View>
            </View>
        </TouchableOpacity>
    }
    getAllBoth() {
        this.setState({
            isAll:!this.state.isAll
        },()=>{
            if(this.state.isAll){
                let arr=this.state.manyState;
                let sendArr=[];
                for(let i=0;i<this.state.slot.length;i++){
                    sendArr.push(this.state.slot[i].slot_id)
                }
                for(let i=0;i<arr.length;i++){
                    arr[i]=1
                }

                this.setState({
                    manyState:arr,
                    sendMany:sendArr
                })
            }else{
                let arr=this.state.manyState;
                for(let i=0;i<arr.length;i++){
                    arr[i]=0
                }
                this.setState({
                    manyState:arr,
                    sendMany:[]
                })
            }
        })
    }
    invitIng() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('user_id',this.state.user_id);
        formData.append('slot_id',this.state.long_day==1?JSON.stringify(this.state.sendSingle):JSON.stringify(this.state.sendMany));
        formData.append('isapp',1);
        Fetch.post(NewHttp+'Invites', formData).then(res => {
            if(res.code === 1) {
                this.refs.time.close();
                if(this.state.long_day === 1) {
                    let arr=[];
                    for(let i=0;i<this.state.slot.length;i++){
                        let child=[];
                        for(let k=0;k<this.state.slot[i].list.length;k++){
                            child.push({
                                status:0,
                                slot_id:this.state.slot[i].list[k].slot_id
                            })
                        }
                        arr.push({
                            day:this.state.slot[i].day,
                            id:i,
                            list:child
                        })
                    }
                    this.setState({
                        singleState:arr,
                        sendSingle:[]
                    })
                }
                this.refs.toast.show('邀请志愿者成功')
            }
        })
    }
    render() {
        const {volunteer, theme} = this.props;
        const {long_day ,sendSingle, sendMany, isAll} = this.state;
        let store=volunteer[this.storeName]
        if(!store){
            store={
                items: [],
                isLoading: false
            }
        }
        return(
            <SafeAreaView style={{backgroundColor: '#fff',flex: 1}}>
                <Toast ref="toast" position='center' positionValue={0} />
                <RNEasyTopNavBar
                    title={'邀请志愿者'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                        ?
                        <View style={[CommonStyle.commonWidth,{
                            marginLeft: width*0.03
                        }]}>
                            <FlatList
                                data={store.items.data.data.data}
                                horizontal={false}
                                numColumns={2}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                                // refreshControl={
                                //     <RefreshControl
                                //         title={'loading'}
                                //         titleColor={theme}
                                //         colors={[theme]}
                                //         refreshing={store.isLoading}
                                //         onRefresh={() => {this.loadData(true)}}
                                //         tintColor={theme}
                                //     />
                                // }
                                ListFooterComponent={() => this.genIndicator()}
                                onEndReachedThreshold={0.1}
                                onEndReached={() => {
                                    if(this.canLoadMore) {
                                        this.onLoadMore();
                                        this.canLoadMore = false;
                                    }
                                }}
                                onMomentumScrollBegin={() => {
                                    this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                                }}
                            />
                        </View>
                        :
                        <NoData></NoData>
                }
                <Modal
                    style={{height:height*0.5,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"time"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.1)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        width:'100%',
                        height: height*0.5,
                        backgroundColor: '#fff'
                    }}>
                        <View style={[CommonStyle.flexCenter]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <View style={[CommonStyle.spaceRow,{
                                    height: 50
                                }]}>
                                    <Text style={{
                                        color: '#333',
                                        fontSize: 15,
                                    }}>选择体验时间段</Text>
                                    <View style={[CommonStyle.flexEnd]}>
                                        {
                                            long_day
                                            ?
                                                sendSingle.length > 0
                                                ?
                                                    <Text style={{
                                                        marginRight: 15,
                                                        color: this.props.theme,
                                                        fontSize: 16,
                                                        fontWeight: 'bold'
                                                    }}
                                                    onPress={() => {
                                                        this.invitIng()
                                                    }}
                                                    >确定</Text>
                                                :
                                                    null

                                            :
                                                sendMany.length > 0
                                                ?
                                                <Text style={{
                                                    marginRight: 15,
                                                    color: this.props.theme,
                                                    fontSize: 16,
                                                    fontWeight: 'bold'
                                                }}
                                                onPress={() => {
                                                    this.invitIng()
                                                }}
                                                >确定</Text>
                                                :
                                                null
                                        }
                                        <AntDesign
                                            name={'close'}
                                            size={20}
                                            style={{color: '#333'}}
                                            onPress={()=>{
                                                this.refs.time.close()
                                            }}
                                        />
                                    </View>
                                </View>
                                {
                                    long_day
                                    ?
                                        null
                                    :
                                        <View style={[CommonStyle.flexEnd]}>
                                            <TouchableOpacity
                                                style={[CommonStyle.flexEnd]}
                                                onPress={()=>{
                                                    this.getAllBoth()
                                                }}
                                            >
                                                <View style={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: 3,
                                                    borderWidth: isAll?0:1,
                                                    borderColor: '#666',
                                                    backgroundColor: isAll?this.props.theme:'#fff'
                                                }}>
                                                    {
                                                        isAll
                                                        ?
                                                            <AntDesign
                                                                name={'check'}
                                                                size={14}
                                                                style={{color: '#fff'}}
                                                            />
                                                        :
                                                            null
                                                    }
                                                </View>
                                                <Text style={{
                                                    color:'#666',
                                                    marginLeft: 5
                                                }}>全选</Text>
                                            </TouchableOpacity>
                                        </View>
                                }

                                <View style={{
                                    maxHeight: height*0.5-100
                                }}>
                                    {
                                        long_day
                                        ?
                                            <FlatList
                                                data={this.state.slot}
                                                extraData={this.state.slot}
                                                horizontal={false}
                                                showsVerticalScrollIndicator = {false}
                                                renderItem={data=>this.renderItemSlot(data)}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        :
                                            <FlatList
                                                data={this.state.slot}
                                                extraData={this.state.slot}
                                                horizontal={false}
                                                showsVerticalScrollIndicator = {false}
                                                renderItem={data=>this.renderItemSlotMany(data)}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                    }

                                </View>

                            </View>
                        </View>

                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    volunteer: state.volunteer,
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    onLoadVolunteer: (storeName, url, data,refreshType, oNum, callback) => dispatch(action.onLoadVolunteer(storeName, url, data,refreshType, oNum, callback)),
    onLoadMoreVolunteer: (storeName, url, data, oItems, callback) => dispatch(action.onLoadMoreVolunteer(storeName, url, data, oItems, callback))
})
export default connect(mapStateToProps, mapDispatchToProps)(InviteVol)

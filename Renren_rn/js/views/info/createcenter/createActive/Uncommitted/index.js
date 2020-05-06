import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image} from 'react-native';
import {connect} from 'react-redux'
import action from '../../../../../action'
import HttpUrl from '../../../../../utils/Http';
import CommonStyle from '../../../../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
import NoData from '../../../../../common/NoData';
import NavigatorUtils from '../../../../../navigator/NavigatorUtils';
import Modal from 'react-native-modalbox';
import Fetch from '../../../../../expand/dao/Fetch';
const {width, height} = Dimensions.get('window')
class Uncommitted extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activity_id: ''
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadUncommit} = this.props;
        this.storeName = 'uncommit';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',1);
        onLoadUncommit(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    toActiveDetail(activity_id) {
        const {changeActivityId} = this.props;
        changeActivityId(activity_id);
        NavigatorUtils.goPage({},'Language')
    }
    delItem(activity_id) {
        this.setState({
            activity_id: activity_id
        },()=>{
            this.refs.del.open()
        })
    }
    renderItem(data){
        return <TouchableOpacity style={[CommonStyle.flexCenter,{padding: 10,
            borderBottomColor:'#f5f5f5',
            borderBottomWidth:5,
            paddingTop:15,
            paddingBottom:15
        }]} onPress={() => {this.toActiveDetail(data.item.activity_id)}}
        onLongPress={()=>this.delItem(data.item.activity_id)}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,]}>
                <LazyImage source={data.item.cover&&data.item.cover.domain&&data.item.cover.image_url?
                    {uri:data.item.cover.domain+data.item.cover.image_url}:
                require('../../../../../../assets/images/error.png')} style={{
                    width:110,
                    height:80,
                    borderRadius: 4
                }}/>
                <View style={[CommonStyle.spaceCol,{
                    width: width*0.94-120,
                    height:80,
                    alignItems:'flex-start'
                }]}>
                    <Text numberOfLines={2} ellipsizeMode={'tail'}
                          style={{color:'#333',fontWeight:'bold'}}>
                        {data.item.title}
                    </Text>
                    <View style={[CommonStyle.spaceRow,{width:'100%'}]}>
                        <Text style={{
                            color:'#666',
                            fontWeight:'bold',
                            fontSize:10
                        }}>{data.item.kind[0]&&data.item.kind[0].kind_name?data.item.kind[0].kind_name:null}</Text>
                        <Text style={{color:'#666',fontSize:10}}>创建时间:{data.item.create_time}</Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    }
    delActive() {
        const {token} = this.props;
        let formData=new FormData();
        formData.append('token', token);
        formData.append('activity_id', this.state.activity_id);
        Fetch.post(HttpUrl+'Activity/del_activity', formData).then(res=>{
            if(res.code === 1) {
                this.refs.del.close();
                this.loadData()
            }
        })
    }
    render(){
        const {uncommit} = this.props;
        let store = uncommit[this.storeName];
        if(!store){
            store={
                items:[],
                isLoading: false
            }
        }
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1}]}>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.length>0
                        ?
                        <View style={[CommonStyle.flexCenter,{flex: 1,justifyContent:'flex-start'}]}>
                            <FlatList
                                data={store.items.data.data}
                                showsVerticalScrollIndicator = {false}
                                renderItem={data=>this.renderItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <Image
                            source={require('../../../../../../assets/images/que/wdd.png')}
                            style={{width: 180,height: 180}}
                        />
                }
                <Modal
                    style={{height:80,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"del"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.5)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height:80
                    }}>
                        <TouchableOpacity
                            style={CommonStyle.flexCenter}
                            onPress={()=>this.delActive()}
                        >
                            <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                                height:50,
                                backgroundColor: '#fff',
                                borderRadius: 5
                            }]}>
                                <Text style={{color:'red'}}>删除</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    uncommit: state.uncommit
})
const mapDispatchToProps = dispatch => ({
    onLoadUncommit:(storeName, url, data) => dispatch(action.onLoadUncommit(storeName, url, data)),
    changeActivityId: id => dispatch(action.changeActivityId(id)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Uncommitted)

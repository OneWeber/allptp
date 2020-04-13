import React,{Component} from 'react';
import {StyleSheet, View, Text, RefreshControl, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import action from '../../../../../action'
import HttpUrl from '../../../../../utils/Http';
import NoData from '../../../../../common/NoData';
import CommonStyle from '../../../../../../assets/css/Common_css';
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window')
class ToAudit extends Component{
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadToAudit} = this.props;
        this.storeName = 'toaudit';
        let formData=new FormData();
        formData.append('token', token);
        formData.append('flag',2);
        onLoadToAudit(this.storeName, HttpUrl + 'Activity/complete', formData)
    }
    renderItem(data){
        return <TouchableOpacity style={[CommonStyle.flexCenter,{padding: 10,
            borderBottomColor:'#f5f5f5',
            borderBottomWidth:5,
            paddingTop:15,
            paddingBottom:15
        }]}>
            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,]}>
                <LazyImage source={data.item.cover&&data.item.cover.domain&&data.item.cover.image_url?
                    {uri:data.item.cover.domain+data.item.cover.image_url}:
                    require('../../../../../../assets/images/error.jpeg')} style={{
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
    render(){
        const {toaudit} = this.props;
        let store = toaudit[this.storeName];
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
                        <NoData></NoData>
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    toaudit: state.toaudit,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadToAudit: (storeName, url, data) => dispatch(action.onLoadToAudit(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(ToAudit)

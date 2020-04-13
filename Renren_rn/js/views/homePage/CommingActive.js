import React,{Component} from 'react';
import {StyleSheet, View, Text, RefreshControl, FlatList,Dimensions,Image,TouchableOpacity} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../action'
import NewHttp from '../../utils/NewHttp';
import LazyImage from 'animated-lazy-image';
import ActiveItem from '../../common/ActiveItem';
const {width, height} = Dimensions.get('window')
class CommingActive extends Component{
    componentDidMount(){
        this.loadData()
        this.tabs=['3折起','返差价','多套餐']
    }
    loadData(){
        const {token, onLoadComming} = this.props
        this.storeName='commingactive'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('version', '2.0');
        onLoadComming(this.storeName, NewHttp + 'SoonActTwo', formData)
    }
    renderItem(data){
        const {theme} = this.props
        return <ActiveItem isComming={true} data_a={data.item} data_index={data.index} {...this.props} style={{
                marginTop: 0,
                marginLeft: data.index==0?width*0.03:10,
                marginRight: data.index===4?width*0.03:0,
                width: 165}}/>
    }
    render(){
        const {comming} = this.props
        let store = comming[this.storeName]
        if(!store){
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{width: '100%'}}>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View >
                            <Text style={[this.props.styles.component_title,
                                styles.common_color,
                                styles.common_weight,
                                CommonStyle.commonWidth,{
                                marginLeft:width*0.03
                            }]}>
                                即将开展的体验
                            </Text>
                            <View style={{marginTop: 25}}>
                                <FlatList
                                    data={store.items.data.data.data.slice(0,5)}
                                    horizontal={true}
                                    showsVerticalScrollIndicator = {false}
                                    renderItem={data=>this.renderItem(data)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>
                    :
                        null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    common_color:{
        color:'#333'
    },
    common_weight:{
        fontWeight:'bold'
    },
    comming_img:{
        width: 165,
        height: 126,
        borderRadius: 4
    },
    tab_item:{
        padding: 3,
        marginRight: 15
    },
    time_shadow:{
        width:70,
        height:20,
        padding:3,
        backgroundColor:'rgba(0,0,0,0.5)',
        borderRadius: 3,
        margin: 5
    }
})
const mapStateToProps = state => ({
    comming: state.comming,
    token: state.token.token,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadComming: (storeName, url, data) => dispatch(action.onLoadComming(storeName, url, data))
})
export default connect(mapStateToProps,mapDispatchToProps)(CommingActive)

import React,{Component} from 'react';
import {StyleSheet, View, Text, FlatList, Dimensions,TouchableOpacity} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../action'
import HttpUrl from '../../utils/Http';
const {width, height } = Dimensions.get('window')
import ActiveItem from '../../common/ActiveItem';
import LazyImage from 'animated-lazy-image';
class History extends Component{
    constructor(props) {
        super(props);
        this.tabs=['3折起','返差价','多套餐']
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const {token, onLoadHistory} = this.props;

        this.storeName='history'
        let formData=new FormData();
        formData.append('token', token);
        formData.append('page',1);
        onLoadHistory(this.storeName, HttpUrl + 'Index/visit_lately', formData)
    }
    _renderHistory(data){
        const {history} = this.props
        let store = history[this.storeName]
        return data.item.flag === 1
            ?
            <ActiveItem
                data_a={data.item}
                data_index={data.index}
                {...this.props}
                style={{marginTop: 0}}
                history={true}
            />
            :
            <TouchableOpacity style={{
                width: 165,
                marginLeft:data.index==0?width*0.03:8,
                marginRight:data.index===store.items.data.data.data.length-1?width*0.03:0
            }}>
                <LazyImage
                    source={{uri:data.item.domain + data.item.image_url}}
                    style={{width:'100%',height: 126,borderRadius: 4}}
                />
                <Text numberOfLines={2} ellipsizeMode={'tail'}
                      style={[styles.common_weight,styles.common_color,{
                          marginTop: 4.5
                      }]}>{data.item.title}</Text>
            </TouchableOpacity>

    }
    render(){
        const {history} = this.props
        let store = history[this.storeName]
        if(!store){
            store={
                items:[],
                isLoading: false
            }
        }
        return(
            <View style={[CommonStyle.flexCenter,{width: '100%'}]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={[this.props.styles.component_title,
                        styles.common_color,
                        styles.common_weight,
                    ]}>
                        历史记录
                    </Text>
                </View>
                {
                    store.items && store.items.data && store.items.data.data && store.items.data.data.data && store.items.data.data.data.length > 0
                    ?
                        <View style={{width: '100%',marginTop: 23}}>
                            <FlatList
                                data={store.items.data.data.data}
                                horizontal={true}
                                renderItem={(data)=>this._renderHistory(data)}
                                showsHorizontalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}
                            />
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
})
const mapStateToProps = state => ({
    token: state.token.token,
    history: state.history,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onLoadHistory: (storeName, url, data) => dispatch(action.onLoadHistory(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(History)

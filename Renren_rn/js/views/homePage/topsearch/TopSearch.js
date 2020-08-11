import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, SafeAreaView, FlatList, TouchableHighlight, Dimensions} from 'react-native';
import LazyImage from 'animated-lazy-image';
import CommonStyle from '../../../../assets/css/Common_css';
import AntDesign from "react-native-vector-icons/AntDesign"
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import {connect} from 'react-redux';
import Fetch from '../../../expand/dao/Fetch';
import NewHttp from '../../../utils/NewHttp';
const widthScreen = Dimensions.get('window').width;
class TopSearch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            list: []
        }
    }
    _onScroll(e){
        let y = e.nativeEvent.contentOffset.y;
        let opacityPercent = y / 120;
        this.setState({
            opacity:opacityPercent
        })
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        Fetch.post(NewHttp+'PopularAct', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    list: res.data
                })
            }
        })
    }
    _renderItem(data) {
        return <View style={{height:50,width:'100%',borderBottomWidth:1,borderBottomColor:'#f5f5f5',justifyContent: 'center',alignItems: 'center'}}>
            <TouchableHighlight
                style={{width:'100%',height:50,justifyContent: 'center',alignItems: 'center'}}
                underlayColor='rgba(0,0,0,.1)'
                onPress={() =>{
                    NavigatorUtils.goPage({table_id: data.item.activity_id}, 'ActiveDetail')
                }}
            >
                <View style={{width:'94%',height:50,justifyContent: 'space-between',alignItems: 'center',flexDirection:'row'}}>
                    <View style={{width:30,justifyContent: 'flex-start',alignItems: 'center',flexDirection:'row'}}><Text style={{color:data.index+1==1||data.index+1==2||data.index+1==3?'#d81e06':'orange',fontWeight:data.index+1==1||data.index+1==2||data.index+1==3?'bold':'normal',fontSize:data.index+1==1||data.index+1==2||data.index+1==3?16:14}}>{data.index+1}</Text></View>
                    <View style={{width:widthScreen*0.94-30,justifyContent: 'flex-start',alignItems: 'center',flexDirection:'row'}}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'}>{data.item.title}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    }
    render(){
        const {opacity} = this.state
        return(
            <View style={{flex: 1,backgroundColor:'#fff'}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    scrollEventThrottle={16}
                    onScroll={(event)=>this._onScroll(event)}
                >
                    <LazyImage
                        source={require('../../../../assets/images/rsty.png')}
                        style={{width:'100%',height: 230}}
                    />
                    <View style={[CommonStyle.flexCenter,{
                        width:'100%',
                        height:30,
                        backgroundColor:'#f5f5f5'
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.flexStart,{height:30}]}>
                            <Text style={{color:'#666',fontSize: 12}}>实时热点,每一小时更新一次</Text>
                        </View>

                    </View>
                    {
                        this.state.list.length>0
                            ?
                            <View style={{width:'100%',marginBottom:60}}>
                                <FlatList
                                    data={this.state.list}
                                    horizontal={false}
                                    renderItem={(data)=>this._renderItem(data)}
                                    showsHorizontalScrollIndicator = {false}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            :
                            null
                    }
                </ScrollView>
                <SafeAreaView style={[styles.hot_navbar, CommonStyle.flexCenter,{
                    backgroundColor:'rgba(255,255,255,'+opacity+')',
                    borderBottomWidth: 1,
                    borderBottomColor:'rgba(245,245,245,'+opacity+')',
                }]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                        height: 50
                    }]}>
                        <AntDesign
                            name={'left'}
                            size={20}
                            style={{color: '#333',width:20}}
                            onPress={()=>{
                                NavigatorUtils.backToUp(this.props)
                            }}
                        />
                        <Text style={{
                            color:'rgba(0,0,0,'+opacity+')',
                            fontWeight:'bold',
                            fontSize: 16
                        }}>热搜体验</Text>
                        <View style={{width: 20}}></View>
                    </View>
                </SafeAreaView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    hot_navbar: {
        position:'absolute',
        left:0,
        top:0,
        right:0,
    }
});
const mapStateToProps = state => ({
    token: state.token.token
})
export default connect(mapStateToProps)(TopSearch)

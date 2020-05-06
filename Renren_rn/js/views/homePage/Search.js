import React,{Component} from 'react';
import {StyleSheet,
    View,
    Text,
    SafeAreaView,
    Dimensions,
    TextInput,
    ScrollView,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch'
import HttpUrl from '../../utils/Http';

const {width} = Dimensions.get('window')
class Search extends Component{
    render(){
        return(
            <View style={{flex: 1}}>
                <SearchHeader {...this.props}/>
                <ScrollView>
                    <SearchContent />
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({

})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(Search);
class SearchHeader extends Component{
    render(){
        return(
            <SafeAreaView style={[CommonStyle.flexCenter,{backgroundColor: '#fff'}]}>
                <View style={CommonStyle.commonWidth}>
                    <View style={[CommonStyle.spaceRow,{
                        height:60
                    }]}>
                        <View style={[CommonStyle.flexStart,{
                            height:40,
                            width:width*0.94-50,
                            backgroundColor:'#f5f5f5',
                            borderRadius: 5
                        }]}>
                            <AntDesign
                                name={'search1'}
                                size={16}
                                style={{color:'#999',width:20,marginLeft: 5}}
                            />
                            <Text
                                numberOfLines={1} ellipsizeMode={'tail'}
                                style={{
                                    color:this.props.theme,
                                    fontWeight:'bold',
                                    maxWidth: 60
                                }}>遂宁市</Text>
                            <TextInput
                                style={{
                                    width:width*0.94-50-5-20-70,
                                    height:40,
                                    marginLeft: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor:'#fff',
                                    paddingLeft:10,
                                    paddingRight: 10
                                }}
                                placeholder="地点/体验/故事"
                                autoFocus={true}
                            />
                        </View>
                        <Text
                            style={{color:'#666'}}
                            onPress={()=>{
                                this.props.closeSearch()
                            }}
                        >
                            取消
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
class SearchContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchList: []
        }
    }
    componentDidMount() {
       // this.loadData()
    }
    loadData() {
        let formData=new FormData();
        formData.append('token',this.props.token);
        Fetch.post(HttpUrl+'Index/search_lately', formData).then(res => {
            console.log('res', res)
            if(res.code === 1) {
                this.setState({
                    searchList: res.data
                })
            }
        })
    }
    render(){
        const {searchList} =this.state
        return(
            <View>
                <View style={[CommonStyle.flexStart,{
                    marginTop: 10,
                    paddingLeft: width*0.03
                }]}>
                    <AntDesign
                        name={'clockcircleo'}
                        size={14}
                        style={{color:'#333'}}
                    />
                    <Text style={{
                        color:'#333',
                        fontWeight: 'bold',
                        marginLeft: 10
                    }}>最近的搜索</Text>
                </View>
                <ScrollView
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {false}
                    pagingEnabled = {true}
                >
                    {
                        searchList.length>0
                            ?
                            searchList.map((item, index) => {
                                return <View key={index} style={{
                                    height:40,
                                    paddingLeft: 10,
                                    paddingRight: 10
                                }}>
                                    <Text>{item.keywords}</Text>
                                </View>
                            })
                            :
                            <Text>111</Text>
                    }
                </ScrollView>
            </View>
        )
    }
}

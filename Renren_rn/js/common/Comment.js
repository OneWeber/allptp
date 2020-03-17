import React,{Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux'
import HttpUrl from '../utils/Http';
import action from '../action'
import CommentItem from './CommentItem';
import CommonStyle from '../../assets/css/Common_css';
import Fetch from '../expand/dao/Fetch';
import AntDesign from 'react-native-vector-icons/AntDesign'
class Comment extends Component{
    constructor(props) {
        super(props);
        this.state={
            isLoading: false,
            commentsArr:[]
        }
    }
    componentDidMount(){
        this.setState({
            isLoading: true
        },() => {
            this.loadData()
        })

    }
    loadData() {
        const {table_id, flag, token} = this.props
        const {onLoadComments} = this.props
        this.storeName = 'comments'
        let formData=new FormData();
        formData.append('token',token);
        formData.append('table_id',table_id);
        formData.append('flag',flag);
        formData.append('order',1);
        formData.append('page',1);
        Fetch.post(HttpUrl + 'Comment/comment_list', formData).then(res => {
            this.setState({
                isLoading: false
            })
            if(res.code === 1){
                this.setState({
                    commentsArr: res.data.data
                })
            }
        })
    }
    render(){
        const {theme} = this.props
        const {commentsArr, isLoading} = this.state
        return(
            <View>
                {
                    isLoading
                    ?
                        <View style={[CommonStyle.flexCenter]}>
                            <ActivityIndicator
                                size={'small'}
                                style={{marginTop: 30,marginBottom: 15}}
                            />
                        </View>
                    :
                        commentsArr.length > 0
                        ?
                            this.props.type === 'detail'
                            ?
                                <DetailComments theme={this.props.theme} limit={3} {...this.state} />
                            :
                                <View></View>
                        :
                            <View style={[CommonStyle.flexCenter]}>
                                <Text style={{color:'#999',marginTop:20,marginBottom:10}}>暂无评论,<Text style={{
                                    color:theme,
                                    fontWeight:'bold'
                                }}>快去评论吧</Text></Text>
                            </View>
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme:state.theme.theme
})
export default connect(mapStateToProps)(Comment)
class DetailComments extends Component{
    render(){
        const {limit, commentsArr, theme} = this.props
        let data = commentsArr
        return(
            <View>
                {
                    data.slice(0,limit).map((item, index) => {
                        return <View key={index}>
                            <CommentItem data_c={item}/>
                        </View>
                    })
                }
                {
                    data.length > limit
                        ?
                        <View style={[CommonStyle.flexCenter,{marginTop:20}]}>
                            <View style={[CommonStyle.flexCenter,{
                                width: 139,
                                height:36,
                                flexDirection:'row',
                                backgroundColor:'#ECFEFF',
                                borderRadius: 20
                            }]}>
                                <Text style={{color:theme,fontWeight:'bold'}}>查看所有评价</Text>
                                <AntDesign
                                    name={'right'}
                                    size={15}
                                    style={{color: theme}}
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


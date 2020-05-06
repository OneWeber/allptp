import React,{Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator,Modal} from 'react-native';
import {connect} from 'react-redux'
import HttpUrl from '../utils/Http';
import action from '../action'
import CommentItem from './CommentItem';
import CommonStyle from '../../assets/css/Common_css';
import Fetch from '../expand/dao/Fetch';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NewHttp from '../utils/NewHttp';
import ImageViewer from 'react-native-image-zoom-viewer';
class Comment extends Component{
    constructor(props) {
        super(props);
        this.state={
            isLoading: false,
            commentsArr:[],
            modalVisible: false,
            images: [],
            index: 0
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
        this.storeName = 'comments'
        let formData=new FormData();
        formData.append('token',token);
        formData.append('table_id',table_id);
        formData.append('flag',flag);
        formData.append('order',1);
        formData.append('page',1);
        if(flag === 1) {
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
        } else {
            Fetch.post(NewHttp + 'LeaveL', formData).then(res => {
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

    }
    _showImg(arr, index){
        this.setState({
            images: arr,
            index: index
        },() => {
            this.setState({
                modalVisible: true
            })
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
                                <DetailComments showImg={(arr, index)=>this._showImg(arr, index)} theme={this.props.theme} limit={3} {...this.state} />
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
                <Modal
                    visible={this.state.modalVisible}
                    transparent={true}
                    style={{position:'relative'}}
                    renderFooter={()=>this.renderFooter()}
                    onRequestClose={() => this.setState({modalVisible: false})}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        onClick={()=>{this.setState({modalVisible:false})}}
                        imageUrls={this.state.images}
                        index={this.state.index}
                    />
                </Modal>
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
    showImg(arr, index){
        this.props.showImg(arr, index)
    }
    render(){
        const {limit, commentsArr, theme} = this.props
        let data = commentsArr
        return(
            <View>
                {
                    data.slice(0,limit).map((item, index) => {
                        return <View key={index}>
                            <CommentItem showImg={(arr, index)=>this.showImg(arr, index)} data_c={item}/>
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


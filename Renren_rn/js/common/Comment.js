import React,{Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Modal, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import HttpUrl from '../utils/Http';
import CommonStyle from '../../assets/css/Common_css';
import NewHttp from '../utils/NewHttp';
import action from '../action'
import ImageViewer from 'react-native-image-zoom-viewer';
import DetailComments from './DetailComments';
import NavigatorUtils from '../navigator/NavigatorUtils';
class Comment extends Component{
    constructor(props) {
        super(props);
        this.state={
            isLoading: false,
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
        const {table_id, flag, token, onLoadActiveComments, onLoadStoryComments} = this.props
        this.storeName = 'comments'
        let formData=new FormData();
        formData.append('token',token);
        formData.append('table_id',table_id);
        formData.append('flag',flag);
        formData.append('order',1);
        formData.append('page',1);
        if(flag === 1) {
            onLoadActiveComments(this.storeName, HttpUrl + 'Comment/comment_list', formData)
        }else if(flag===2){
            onLoadStoryComments(this.storeName, NewHttp + 'LeaveL', formData)
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
    checkLoginRoute(route, data){
        const {token, user} = this.props;
        if(token && user && user.username && user.userid){
            NavigatorUtils.goPage(data?data:{}, route)
        } else {
            NavigatorUtils.goPage({}, 'Login')
        }
    }
    render(){
        const {theme, comments} = this.props;
        let store = comments[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View>
                {
                    store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                    ?
                        this.props.type === 'detail'
                            ?
                            <DetailComments
                                showImg={(arr, index)=>this._showImg(arr, index)}
                                theme={this.props.theme}
                                limit={3}
                                {...this.props}
                                commentsArr={store.items.data.data.data}
                                {...this.state}
                                showBackModal={(data)=>{
                                    this.props.showBackModal(data)
                                }}
                            />
                            :
                            <View></View>
                    :
                        <View style={[CommonStyle.flexCenter]}>
                            <Text style={{color:'#999',marginTop:20,marginBottom:10}}>暂无评论,<Text style={{
                                color:theme,
                                fontWeight:'bold'
                            }}
                             onPress={()=>{
                                 this.checkLoginRoute('TextInput', {
                                     table_id: this.props.table_id,
                                     flag: this.props.flag,
                                     t_id: this.props.table_id,
                                 })
                             }}
                            >快去评论吧</Text></Text>
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
    theme:state.theme.theme,
    comments: state.comments,
    user: state.user.user
})
const mapDispatchToProps = dispatch => ({
    onLoadActiveComments: (storeName, url, data) => dispatch(action.onLoadActiveComments(storeName, url, data)),
    onLoadStoryComments: (storeName, url, data) => dispatch(action.onLoadStoryComments(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Comment)



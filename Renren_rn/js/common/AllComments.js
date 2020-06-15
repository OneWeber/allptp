import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, SafeAreaView} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux';
import action from '../action';
import HttpUrl from '../utils/Http';
import NewHttp from '../utils/NewHttp';
import DetailComments from './DetailComments';
import Modal from 'react-native-modalbox';
const {width, height} = Dimensions.get('window')
class AllComments extends Component{
    constructor(props) {
        super(props);
        this.flag = this.props.navigation.state.params.flag;
        this.table_id = this.props.navigation.state.params.table_id;
        this.table_flag = this.props.navigation.state.params.table_flag
        this.state = {
            table_id: ''
        }
    }
    getLeftButton() {
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
    componentDidMount() {
        const {onLoadActiveComments, onLoadStoryComments} = this.props;
        this.storeName = 'comments'
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('table_id',this.table_id);
        formData.append('flag',this.flag);
        formData.append('order',1);
        formData.append('page',1);
        if(this.flag === 1) {
            onLoadActiveComments(this.storeName, HttpUrl + 'Comment/comment_list', formData)
        }else{
            onLoadStoryComments(this.storeName, NewHttp + 'LeaveL', formData)
        }
    }
    _showBackModal(data) {
        this.setState({
            table_id: data.msg_id
        },() => {
            this.refs.content.open()
        })
    }
    commentsBack() {
        this.refs.content.close();
        NavigatorUtils.goPage({
            table_flag: this.table_flag,
            flag: this.table_flag===1?4:5,
            table_id: this.state.table_id,
            t_id: this.table_id
        }, 'TextInput')
    }
    render() {
        const {theme, comments} = this.props;
        let store = comments[this.storeName];
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={this.flag===1?'全部评论':'全部留言'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={[CommonStyle.commonWidth,{
                        marginLeft: width*0.03,
                        paddingBottom: 100
                    }]}>
                        {
                            store.items&&store.items.data&&store.items.data.data&&store.items.data.data.data&&store.items.data.data.data.length>0
                                ?
                                <DetailComments
                                    {...this.props}
                                    flag={this.flag}
                                    table_id={this.table_id}
                                    commentsArr={store.items.data.data.data}
                                    showBackModal={(data)=>{
                                        this._showBackModal(data)
                                    }}
                                />
                                :
                                null
                        }
                    </View>
                </ScrollView>
                <SafeAreaView style={[CommonStyle.flexCenter,{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor:'#fff',
                    shadowColor:'#C1C7CF',
                    shadowOffset:{width:1, height:1},
                    shadowOpacity: 0.6,
                    shadowRadius: 2,
                }]}>
                    <View style={[CommonStyle.flexCenter,{
                        height: 50
                    }]}>
                        <TouchableOpacity style={[CommonStyle.flexStart,CommonStyle.commonWidth,{
                            height:35,
                            backgroundColor:'#f5f5f5',
                            borderRadius: 3,
                            paddingLeft: 10
                        }]}
                          onPress={()=>{
                              NavigatorUtils.goPage({
                                  table_id: this.table_id,
                                  flag: this.flag,
                                  t_id: this.table_id
                              }, 'TextInput')
                          }}
                        >
                            <Text style={{color:'#999'}}>说点什么吧</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <Modal
                    style={{height:140,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"content"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{height: 120,alignItems:'center'}}>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 50,
                            backgroundColor: '#fff',
                            borderRadius: 5
                        }]}
                              onPress={()=>{
                                  this.commentsBack()
                              }}
                        >
                            <Text style={{color:'#333'}}>回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                            height: 50,
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            marginTop: 10,
                            marginBottom: 10
                        }]}>
                            <Text style={{color:'red'}}>举报</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        )
    }
}
const mapStateToProps = state => ({
    token: state.token.token,
    theme: state.theme.theme,
    comments: state.comments
});
const mapDispatchToProps = dispatch => ({
    onLoadActiveComments: (storeName, url, data) => dispatch(action.onLoadActiveComments(storeName, url, data)),
    onLoadStoryComments: (storeName, url, data) => dispatch(action.onLoadStoryComments(storeName, url, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(AllComments)

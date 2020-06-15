import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView, TextInput,
} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modalbox';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
const {width} = Dimensions.get('window');
class Translate extends Component{
    constructor(props) {
        super(props);
        this.language = [
            {
                title:'中文',
                val: 0
            },{
                title:'英语',
                val: 1
            },{
                title:'日语',
                val: 2
            }
        ]
        this.state = {
            languageIndex: 1,
            tOne:'',
            tIndex:1,
            tTwo:'',
            introduce:this.props.navigation.state.params.introduce,
            descripte:this.props.navigation.state.params.descripte,
            isLoading: false
        }
    }
    changeLanguage(index) {
        this.setState({
            languageIndex: index
        },()=>{
            this.refs.language.close()
        })
    }
    saveTranslate() {
        this.setState({
            isLoading: true
        })
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('activity_id',this.props.navigation.state.params.activity_id);
        formData.append('t_introduce',this.state.tOne);
        formData.append('t_descripte',this.state.tTwo);
        formData.append('user_id',this.props.user.userid);
        formData.append('language',this.state.languageIndex);
        Fetch.post(NewHttp+'TranslateS', formData).then(res => {
            this.setState({
                isLoading: false
            })
            if(res.code === 1) {
                NavigatorUtils.backToUp(this.props)
            }
        })
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative'}}>
                <SafeAreaView style={{backgroundColor: '#fff'}}>
                    <View style={[CommonStyle.spaceRow,{
                        height: 50
                    }]}>
                        <TouchableOpacity style={{
                            paddingLeft: width*0.03
                        }}
                        onPress={() => {
                            NavigatorUtils.backToUp(this.props)
                        }}
                        >
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#333'}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{justifyContent: 'center',alignItems: 'flex-start'}}
                            underlayColor='rgba(255,255,255,.1)'
                            onPress={()=>{
                                this.refs.language.open()
                            }}
                        >
                            <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <Text style={{fontSize:16,color:'#333333'}}>翻译成{this.language[this.state.languageIndex].title}</Text>
                                <AntDesign
                                    name="caretdown"
                                    size={12}
                                    style={{color:'#333333',marginLeft:3}}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            paddingRight: width*0.03
                        }}>
                            <AntDesign
                                name={'left'}
                                size={20}
                                style={{color:'#fff'}}
                            />
                        </View>
                    </View>
                </SafeAreaView>
                <View style={[CommonStyle.flexCenter,{height:45,backgroundColor:'#F4F4F4'}]}>
                    <Text style={{color:'#999999',fontSize:16.875}}>{this.state.tIndex} / 2</Text>
                </View>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={CommonStyle.flexCenter}>
                            <View style={CommonStyle.commonWidth}>
                                {
                                    this.state.tIndex==1
                                        ?
                                        <Text style={{marginTop:23,color:'#333',fontSize:16}}>体验策划者</Text>
                                        :
                                        <Text style={{marginTop:23,color:'#333',fontSize:16}}>体验内容</Text>
                                }
                                {
                                    this.state.tIndex==1
                                        ?
                                        <View style={{width:'100%',paddingLeft:12.375,paddingRight:12.375,paddingTop:12.375,paddingBottom:12.375,marginTop:20.25}}>
                                            <Text style={{color:'#333333',fontSize:15,lineHeight:22}}>{this.state.introduce}</Text>
                                        </View>
                                        :
                                        <View style={{width:'100%',paddingLeft:12.375,paddingRight:12.375,paddingTop:12.375,paddingBottom:12.375,marginTop:20.25}}>
                                            <Text style={{color:'#333333',fontSize:15,lineHeight:22}}>{this.state.descripte}</Text>
                                        </View>
                                }
                                {
                                    this.state.tIndex==1
                                        ?
                                        <View style={{width:'100%',marginTop:40.5}}>
                                            <TextInput
                                                multiline={true}
                                                placeholder='请输入翻译内容'
                                                editable={true}
                                                style={{minHeight:225,width:'100%',color:'#333333',textAlignVertical:'top'}}
                                                onChangeText={(text)=>{this.setState({tOne:text})}}
                                                defaultValue ={this.state.tOne}
                                            />
                                        </View>
                                        :
                                        <View style={{width:'100%',marginTop:40.5}}>
                                            <TextInput
                                                multiline={true}
                                                placeholder='请输入翻译内容'
                                                editable={true}
                                                style={{minHeight:225,width:'100%',color:'#333333',textAlignVertical:'top'}}
                                                onChangeText={(text)=>{this.setState({tTwo:text})}}
                                                defaultValue ={this.state.tTwo}
                                            />
                                        </View>
                                }
                            </View>
                            {
                                this.state.tIndex==1
                                    ?
                                    <View style={{width:'100%',height:54,marginTop:22.5,justifyContent:'center',alignItems:'center',marginBottom:90}}>
                                        <Text style={{color:'#008489',fontSize:18}} onPress={()=>this.setState({tIndex:2})}>翻译下一个</Text>
                                    </View>
                                    :
                                    <View style={{width:'100%',height:54,marginTop:22.5,justifyContent:'center',alignItems:'center',flexDirection:'row',marginBottom:90}}>
                                        <Text style={{color:'#008489',fontSize:18}} onPress={()=>this.setState({tIndex:1})}>查看上一个</Text>
                                        <Text style={{color:'#008489',fontSize:18,marginLeft:30}} onPress={()=>{this.saveTranslate()}}>提交</Text>
                                    </View>
                            }
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <Modal
                    style={{height:165,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"language"}
                    animationDuration={200}
                    position={"center"}
                    backdropColor={'rgba(0,0,0,.9)'}
                    swipeToClose={false}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        width:width*0.85,
                        height:165,
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        marginLeft: width*0.075,
                        overflow: 'hidden'
                    }}>
                        {
                            this.language.map((item, index) => {
                                return <TouchableOpacity key={index} style={[CommonStyle.spaceRow,{
                                    height:55,
                                    borderBottomWidth: index===2?0:1,
                                    borderBottomColor: '#f5f5f5',
                                    paddingRight: 15,
                                    paddingLeft: 15
                                }]}
                                onPress={()=>{
                                    this.changeLanguage(index)
                                }}
                                >
                                    <Text style={{color:this.state.languageIndex===index?this.props.theme:'#333'}}>{item.title}</Text>
                                    {
                                        this.state.languageIndex===index
                                        ?
                                            <AntDesign
                                                name={'check'}
                                                size={16}
                                                style={{color: this.props.theme}}
                                            />
                                        :
                                            null
                                    }
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </Modal>
                {
                    this.state.isLoading
                    ?
                        <View style={[CommonStyle.flexCenter,{
                            position: 'absolute',
                            left:0,
                            right:0,
                            top:0,
                            bottom:0,
                        }]}>
                            <ActivityIndicator size={'small'} color={'#666'}/>
                        </View>
                    :
                        null
                }
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    user:state.user.user
})
export default connect(mapStateToProps)(Translate)

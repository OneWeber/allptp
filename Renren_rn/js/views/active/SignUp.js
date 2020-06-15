import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput,ActivityIndicator} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux';
import Modal from 'react-native-modalbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fetch from '../../expand/dao/Fetch';
import NewHttp from '../../utils/NewHttp';
import Toast from 'react-native-easy-toast';
class SignUp extends Component{
    constructor(props) {
        super(props);
        this.languages = [
            {
                title: '中文',
                val: 0
            },
            {
                title: 'English',
                val: 1
            },
            {
                title: '日本語',
                val: 2
            }
        ]
        this.state = {
            languageIndex: -1,
            mainLanguge: [-1, -1, -1],
            selectOther: [],
            isSingle: true,
            skill: '',
            introduce: '',
            isLoading: false
        }
    }
    getLeftButton(){
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
    chanegMainLanguage(val) {
        if(this.state.isSingle) {
            this.setState({
                languageIndex: val
            },() => {
                this.refs.language.close()
            })
        } else {
            let list = this.state.mainLanguge;
            let select = [];
            for(let i=0;i<list.length;i++) {
                if(i === val) {
                    if(list[i] === -1) {
                        list[i] = 1
                    } else {
                        list[i] = -1
                    }
                }
                if(list[i] === 1) {
                    select.push(i)
                }
            }
            this.setState({
                mainLanguge: list,
                selectOther: select
            })
        }
    }
    toSignUp() {
        this.setState({
            isLoading: true
        });
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('main_language', this.state.languageIndex);
        formData.append('language', JSON.stringify(this.state.selectOther));
        formData.append('skill', this.state.skill);
        formData.append('introduce', this.state.introduce);
        formData.append('activity_id', this.props.navigation.state.params.activity_id);
        formData.append('slot_id', JSON.stringify([this.props.navigation.state.params.slot_id]));
        formData.append('free_time', JSON.stringify([]));
        formData.append('isapp', 1);
        console.log(formData)
        Fetch.post(NewHttp+'ErollS', formData).then(res => {
            this.setState({
                isLoading: false
            });
            if(res.code === 1) {
                NavigatorUtils.backToUp(this.props, true)
            }else{
                this.refs.toast.show(res.msg)
            }
        })
    }
    render(){
        const {isSingle, mainLanguge, languageIndex, selectOther} = this.state;
        return(
            <View style={{flex: 1,position:'relative'}}>
                <RNEasyTopNavBar
                    title={'志愿者要求'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <Toast ref="toast" position='center' positionValue={0}/>
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop:20,
                            paddingBottom:20,
                            backgroundColor: '#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <Text style={styles.main_title}>我的主要语言</Text>
                                {
                                    languageIndex === -1
                                    ?
                                        <TouchableOpacity
                                            style={[CommonStyle.flexCenter,styles.select_btn]}
                                            onPress={() => {
                                                this.refs.language.open()
                                            }}
                                        >
                                            <Text style={{
                                                color:this.props.theme,
                                                fontWeight:'bold',
                                                fontSize: 13
                                            }}>选择</Text>
                                        </TouchableOpacity>
                                    :
                                        <Text style={{
                                            color:this.props.theme,
                                            fontWeight: 'bold'
                                        }}
                                              onPress={()=>{this.setState({
                                                  isSingle: true
                                              },() => {
                                                  this.refs.language.open()
                                              })}}
                                        >{this.languages[languageIndex].title}</Text>
                                }

                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop:20,
                            paddingBottom:20,
                            backgroundColor: '#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow]}>
                                <Text style={styles.main_title}>我会的其他语言</Text>
                                {
                                    selectOther.length > 0
                                        ?
                                        <TouchableOpacity
                                            style={CommonStyle.flexEnd}
                                            onPress={() => {
                                                this.setState({
                                                    isSingle: false
                                                },() => {
                                                    this.refs.language.open()
                                                })
                                            }}
                                        >
                                            {
                                                selectOther.map((item, index) => {
                                                    return <Text key={index} style={{
                                                        color:this.props.theme,
                                                        marginLeft: 5,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {this.languages[item].title}
                                                    </Text>
                                                })
                                            }
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={[CommonStyle.flexCenter,styles.select_btn]}
                                            onPress={() => {
                                                this.setState({
                                                    isSingle: false
                                                },() => {
                                                    this.refs.language.open()
                                                })
                                            }}
                                        >
                                            <Text style={{
                                                color:this.props.theme,
                                                fontWeight:'bold',
                                                fontSize: 13
                                            }}>选择</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop:20,
                            paddingBottom:20,
                            backgroundColor: '#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <Text style={styles.main_title}>所会技能</Text>
                                <TextInput
                                    placeholder={'请填写技能'}
                                    defaultValue={this.state.skill}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            skill: text
                                        })
                                    }}
                                    style={{
                                        minHeight: 120,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: 1,
                                        textAlignVertical:'top',
                                        marginTop: 15
                                    }}
                                    multiline={true}
                                />
                            </View>
                        </View>
                        <View style={[CommonStyle.flexCenter,{
                            paddingTop:20,
                            paddingBottom:20,
                            backgroundColor: '#fff',
                            marginTop: 10
                        }]}>
                            <View style={[CommonStyle.commonWidth]}>
                                <Text style={styles.main_title}>自我介绍</Text>
                                <TextInput
                                    placeholder={'请简单介绍自己'}
                                    defaultValue={this.state.introduce}
                                    onChangeText={(text) => {
                                        this.setState({
                                            introduce: text
                                        })
                                    }}
                                    style={{
                                        minHeight: 120,
                                        borderBottomColor: '#f5f5f5',
                                        borderBottomWidth: 1,
                                        textAlignVertical:'top',
                                        marginTop: 15
                                    }}
                                    multiline={true}
                                />
                            </View>
                        </View>

                        <View style={[CommonStyle.flexCenter,{
                            marginTop: 25
                        }]}>
                            {
                                languageIndex===-1||!this.state.skill||!this.state.introduce
                                ?
                                    <View style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                                        height: 40,
                                        backgroundColor: '#dcdcdc',
                                        borderRadius: 4
                                    }]}>
                                        <Text style={{
                                            color:'#fff'
                                        }}>提交申请</Text>
                                    </View>
                                :
                                    <TouchableOpacity style={[CommonStyle.commonWidth,CommonStyle.flexCenter,{
                                        height: 40,
                                        backgroundColor: this.props.theme,
                                        borderRadius: 4
                                    }]}
                                    onPress={()=>{
                                        this.toSignUp()
                                    }}
                                    >
                                        <Text style={{
                                            color:'#fff'
                                        }}>提交申请</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <Modal
                    style={{height:180,width:'100%',backgroundColor:'rgba(0,0,0,0)'}}
                    ref={"language"}
                    animationDuration={200}
                    position={"bottom"}
                    backdropColor={'rgba(0,0,0,0.9)'}
                    swipeToClose={true}
                    backdropPressToClose={true}
                    coverScreen={true}>
                    <View style={{
                        height: 180,
                        backgroundColor:'#fff'
                    }}>
                        {
                            this.languages.map((item, index) => {
                                return <TouchableOpacity key={index} style={[CommonStyle.flexCenter,{
                                    height:60,
                                    borderBottomColor: '#f5f5f5',
                                    borderBottomWidth: index===2?0:1
                                }]}
                                 onPress={() => {
                                     this.chanegMainLanguage(item.val)
                                 }}
                                >
                                    <Text style={{
                                        color:isSingle?'#333':mainLanguge[index]===1?this.props.theme:'#333'
                                    }}>{item.title}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </Modal>
                {
                    this.state.isLoading
                    ?
                        <View style={[CommonStyle.flexCenter,{
                            position:'absolute',
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
const styles = StyleSheet.create({
    main_title: {
        color: '#333',
        fontWeight: 'bold'
    },
    select_btn:{
        width:50,
        height:27,
        backgroundColor:'#ECFEFF',
        borderRadius:13.5
    },
});
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(SignUp)

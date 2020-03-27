import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import action from '../../action';
const {width, height} = Dimensions.get('window')
class TouristsList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            touristsList: this.props.navigation.state.params.touristsList?this.props.navigation.state.params.touristsList:[]
        }
    }
    componentDidMount(){
        const {user} = this.props
        let data = this.state.touristsList
        data.push({
            name: JSON.parse(user.username),
            isMe: true
        })

        this.setState({
            touristsList: data
        })
    }
    getLeftButton(){
        return <TouchableOpacity
            style={styles.back_icon}
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
    toAdd(){
        NavigatorUtils.goPage({touristsList: this.state.touristsList},'AddTourists','navigate')
    }
    toNext(){
        const {join, initJoin} = this.props
        let datas = join
        datas.person = this.state.touristsList
        initJoin(datas)
        NavigatorUtils.goPage({},'SelectPackage', 'navigate')
    }
    render(){
        const {touristsList} = this.state
        const {theme} = this.props
        let touristsArr = [];
        for(let i=0;i<touristsList.length;i++){
            touristsArr.push(
                <View style={[CommonStyle.spaceRow,styles.tourists_item]} key={i}>
                    <View style={[CommonStyle.flexStart]}>
                        <Text
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{color: '#333',width: 65}}>{touristsList[i].name}</Text>
                        <Text style={{color: '#333',marginLeft: 10}}>{touristsList[i].tel?touristsList[i].tel:null}</Text>
                    </View>
                    <View>
                        {
                            touristsList[i].isMe
                            ?
                                <Text style={{color:theme}}>(我自己)</Text>
                            :
                                <View style={[CommonStyle.flexEnd]}>
                                    <Text style={{color: '#999'}}>编辑</Text>
                                    <Text style={{color: '#999',marginLeft: 10}}>删除</Text>
                                </View>
                        }
                    </View>
                </View>
            )
        }
        return(
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'添加游客信息'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={[CommonStyle.commonWidth,{marginLeft:width*0.03,}]}>
                        <View style={[styles.tourists_con]}>
                            <Text style={styles.t_title}>已添加{touristsList.length}位游客</Text>
                            <Text style={styles.t_prompt}>为保证您的安全以及策划人的统计，请务必填写真实信息</Text>
                            <View style={{marginTop: 10}}>
                                {touristsArr}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.next_btn,CommonStyle.flexCenter,{backgroundColor:theme}]}
                            onPress={()=>{this.toAdd()}}
                        >
                            <Text style={{color: '#fff',fontWeight: 'bold'}}>继续添加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.next_btn,CommonStyle.flexCenter,{backgroundColor:theme,marginTop: 20}]}
                            onPress={()=>{this.toNext()}}
                        >
                            <Text style={{color: '#fff',fontWeight: 'bold'}}>下一步</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    tourists_con:{
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 3,
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 20
    },
    t_title:{
        color: '#333',
        fontWeight: 'bold',
        fontSize:16
    },
    t_prompt:{
        color: '#999',
        fontSize: 12,
        marginTop: 10
    },
    tourists_item:{
        padding: 10,
        backgroundColor: '#F5F7FA',
        width: '100%',
        marginTop: 12.5,
        borderRadius: 3
    },
    next_btn:{
        marginTop: 30,
        height: 40,
        borderRadius: 3
    }
})
const mapStateToProps = state => ({
    user: state.user.user,
    theme: state.theme.theme,
    join: state.join.join
})
const mapDispatchToProps = dispatch => ({
    initJoin: join => dispatch(action.initJoin(join))
})
export default connect(mapStateToProps, mapDispatchToProps)(TouristsList)

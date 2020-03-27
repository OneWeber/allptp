import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions,ScrollView, TextInput} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
const {width, height} = Dimensions.get('window')
class AddTourists extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            tel: ''
        }
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
    addTourists(){
        let touristsArr = this.props.navigation.state.params.touristsList
        touristsArr.push({
            name: this.state.name,
            tel: this.state.tel
        })
        NavigatorUtils.goPage({touristsList: touristsArr}, 'TouristsList', 'navigate')
    }
    render(){
        const {name, tel} = this.state
        const {theme} = this.props
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
                            <Text style={styles.t_title}>添加游客</Text>
                            <Text style={styles.t_prompt}>为保证您的安全以及策划人的统计，请务必填写真实信息</Text>
                            <Text style={[styles.t_title,{fontSize: 15,marginTop: 20}]}>姓名</Text>
                            <TextInput
                                placeholder=""
                                style={styles.input_con}
                                defaultValue={name}
                                onChangeText={(text) => this.setState({name: text})}
                            />
                            <Text style={[styles.t_title,{fontSize: 15,marginTop: 20}]}>联系电话</Text>
                            <TextInput
                                placeholder=""
                                style={styles.input_con}
                                defaultValue={tel}
                                keyboardType={"number-pad"}
                                onChangeText={(text) => this.setState({tel: text})}
                            />
                        </View>
                        {
                            name && tel
                            ?
                                <TouchableOpacity
                                    style={[CommonStyle.flexCenter,{marginTop: 30,
                                        height: 40,
                                        borderRadius: 3,
                                        backgroundColor: theme}]}
                                    onPress={()=>this.addTourists()}
                                >
                                    <Text style={{color: '#fff'}}>确认添加</Text>
                                </TouchableOpacity>
                            :
                                <View style={[CommonStyle.flexCenter,{marginTop: 30,
                                    height: 40,
                                    borderRadius: 3,
                                    backgroundColor: "#D5D5D5"}]}>
                                    <Text style={{color: '#fff'}}>确认添加</Text>
                                </View>
                        }

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
    input_con:{
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        color: '#333'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(AddTourists)

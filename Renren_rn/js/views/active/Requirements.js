import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Dimensions} from 'react-native';
import {connect} from 'react-redux'
import {SafeAreaView} from 'react-native-safe-area-context';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
const {width, height} = Dimensions.get('window')
class Requirements extends Component{
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
    toNext(){
        NavigatorUtils.goPage({},'TouristsList', 'navigate')
    }
    render(){
        const {join, theme} = this.props
        return(
            <View style={[CommonStyle.flexCenter,{flex: 1,justifyContent: 'flex-start',position:'relative',backgroundColor: '#fff'}]}>
                <RNEasyTopNavBar
                    title={'参与的要求'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    style={{borderBottomColor: '#f5f5f5',borderBottomWidth: 1}}
                />
                <View style={CommonStyle.commonWidth}>
                    <Text style={styles.r_title}>年龄要求</Text>
                    <Text style={styles.r_prompt}>年满{join.age_limit}以上的可以参加</Text>
                    <TouchableOpacity
                        style={[styles.next_btn,CommonStyle.flexCenter,{backgroundColor:theme}]}
                        onPress={()=>this.toNext()}
                    >
                        <Text style={{color: '#fff',fontWeight: 'bold'}}>接受并前往下一步</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    r_title: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
        marginTop: 20
    },
    r_prompt:{
        marginTop: 15,
        fontSize: 16,
        color: '#666'
    },
    next_btn:{
        marginTop: 30,
        height: 40,
        borderRadius: 3
    }
})
const mapStateToProps = state => ({
    join: state.join.join,
    theme: state.theme.theme
})

export default connect(mapStateToProps)(Requirements)

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import CommonStyle from '../../../assets/css/Common_css';
import Radios from '../../model/Radios';
const widthScreen = Dimensions.get('window').width;
class AddWishList extends Component {
    constructor(props) {
        super(props);
        this.tabNames = [
            {label: '共享心愿单', val: 0},
            {label: '私密心愿单', val: 1},
        ]
    }
    getLeftButton() {
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
    getRightButton() {
        const {theme} = this.props
        return <TouchableOpacity
            style={styles.right_btn_con}
        >
            <Text style={[styles.right_btn_txt, {color: theme}]}>保存</Text>
        </TouchableOpacity>
    }
    render() {
        return (
            <View style={CommonStyle.flexCenter}>
                <RNEasyTopNavBar
                    title={'添加心愿单'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <TextInput
                    style={[CommonStyle.commonWidth, styles.input]}
                    placeholder={'请输入心愿单名称'}
                    placeholderTextColor={'#999'}
                />
                <View style={{marginTop: 15,width: '100%'}}>
                    <Radios
                        r_props={this.tabNames}
                        arrange_style={{width:'100%',flexDirection: 'row',justifyContent:'flex-start',alignItems:'center'}}
                        onPress={(label, val, index) => {

                        }}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: widthScreen * 0.03
    },
    right_btn_con:{
        paddingRight: widthScreen * 0.03,
    },
    right_btn_txt: {
        fontWeight: 'bold',
        fontSize: 16
    },
    input: {
        height: 45,
        backgroundColor: '#fff',
        marginTop:20,
        borderRadius: 3,
        padding: 10
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(AddWishList)

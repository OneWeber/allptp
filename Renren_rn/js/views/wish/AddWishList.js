import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
const widthScreen = Dimensions.get('window').width;
class AddWishList extends Component {
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
            <View>
                <RNEasyTopNavBar
                    title={'添加心愿单'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
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
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(AddWishList)

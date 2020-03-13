import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, UIManager, findNodeHandle} from 'react-native'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import action from '../../action'
import AsyncStorage from '@react-native-community/async-storage';
class MyPage extends Component{
    render(){
        const {token, user} = this.props
        const {initToken, initUser} = this.props
        return (
            <View style={styles.container}>
                {
                    token && user && user.username
                    ?
                        <Button
                            title={'退出'}
                            onPress={() => {
                                initToken('');
                                initUser({
                                    username: '',
                                    avatar: ''
                                });
                                AsyncStorage.setItem('username', '');
                                AsyncStorage.setItem('avatar', '');
                                AsyncStorage.setItem('token', '')
                            }}
                        />
                    :
                        <Button
                            title={'登录'}
                            onPress={() => {
                                NavigatorUtils.goPage({}, 'Login')
                            }}
                        />
                }
                <Text>
                    MyPage
                </Text>

                <Button
                    title={'我的订单'}
                    onPress={() => {
                        NavigatorUtils.goPage({}, 'OrderPage')
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
const mapStateToProps = state => ({
    token: state.token.token,
    user: state.user.user
})
const mapDispatchToProps = dispatch => ({
    initToken: token => dispatch(action.InitToken(token)),
    initUser: user => dispatch(action.InitUser(user))
})
export default connect(mapStateToProps, mapDispatchToProps)(MyPage)

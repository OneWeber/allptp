import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native'
import {connect} from 'react-redux'
class HomePage extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>
                    {JSON.stringify(this.props.user)}
                    {this.props.token}
                </Text>
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
    user: state.user.user,
    token: state.token.token
})
export default connect(mapStateToProps)(HomePage)

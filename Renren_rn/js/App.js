import React, {Component} from 'react';
import AppNavigator from './navigator/AppNavigator';
import {Provider} from 'react-redux'
import store from './store'

export default class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isConnected: null,
            connectionInfo: null
        }
    }
    render() {
        return <Provider store={store}>
            <AppNavigator />
        </Provider>
    }
}

import React, {Component} from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions, TouchableOpacity} from 'react-native';
import NavigatorUtils from '../navigator/NavigatorUtils';
import CommonStyle from '../../assets/css/Common_css';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import Fetch from '../expand/dao/Fetch';
import NewHttp from '../utils/NewHttp';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
class WelcomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            timer_number: 5,
            status: '',
            aIndex: 0,
            info: ''
        }
    }
    componentDidMount(){
        // this.loadData();
        AsyncStorage.getItem('status',(error,result)=>{
            this.setState({
                status: result
            },() => {
                const {timer_number, status} = this.state
                let num = timer_number
                this.timer = setInterval(() => {
                    num --;
                    this.setState({ 
                        timer_number: num
                    })
                    if(num === 0) {
                        NavigatorUtils.goPage({}, status=='true'?'Main':'Guide')
                    }
                }, 1000)
            })
        })
    }
    loadData() {
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('sort', 1);
        formData.append('page', 1);
        formData.append('price_low', '');
        formData.append('price_high','');
        formData.append('activ_begin_time', '');
        formData.append('activ_end_time', '');
        formData.append('kind_id','');
        formData.append('is_volunteen', '');
        formData.append('max_person_num', '');
        formData.append('per_page', 9);
        console.log('hahahah')
        Fetch.post(NewHttp+'ActivityListUserTwo', formData).then(res => {
            if(res.code === 1) {
                this.setState({
                    info: res.data.data[0]
                },() => {
                    console.log('info', info)
                })
            }else{
                console.log(res.msg)
            }
        })
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }

    render() {
        NavigatorUtils.navigation = this.props.navigation
        const {theme} = this.props
        const {timer_number, status, info} = this.state
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../assets/images/timg.jpeg')}
                    style={styles.img_back}
                >
                    <SafeAreaView>
                        <TouchableOpacity
                            style={[styles.wel_btn, CommonStyle.flexCenter, {flexDirection:'row'}]}
                            onPress={()=>{NavigatorUtils.goPage({}, status=='true'?'Main':'Guide')}}
                        >
                            <Text style={[styles.timer_num,{color:theme}]}>{timer_number}</Text>
                            <Text style={{marginLeft:5,color:'#999'}}>跳过</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </ImageBackground>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_back:{
        width:widthScreen,
        height:heightScreen,
        justifyContent: 'flex-end',
        alignItems: "flex-end"
    },
    wel_btn: {
        width: 65,
        height: 30,
        backgroundColor:'#fff',
        marginBottom: 10,
        marginRight: widthScreen*0.03,
        borderRadius: 15
    },
    timer_num:{
        fontWeight:'bold'
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token
})
export default connect(mapStateToProps)(WelcomePage)

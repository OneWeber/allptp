import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput,Switch} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import CommonStyle from '../../../assets/css/Common_css';
import Fetch from '../../expand/dao/Fetch';
import HttpUrl from '../../utils/Http';
import action from '../../action';
import languageType from '../../json/languageType'
const widthScreen = Dimensions.get('window').width;
class AddWishList extends Component {
    constructor(props) {
        super(props);
        this.state={
            name: '',
            isPrivate: false
        }
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
    sendCreate(){
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('group_name',this.state.name);
        formData.append('hide',this.state.isPrivate?1:0);
        Fetch.post(HttpUrl+'Comment/add_collegroup', formData).then(res => {
            if(res.code === 1) {
                this.initWish();
                if(this.props.navigation.state.params.flag) {
                    this.initDetailWish()
                }
                NavigatorUtils.backToUp(this.props)
            }
        })
    }
    initWish(){
        const {onLoadWish} = this.props;
        this.storeName = '心愿单';
        let formData = new FormData();
        formData.append('token', this.props.token);
        formData.append('flag',1);
        onLoadWish(this.storeName, HttpUrl + 'Comment/collegroup_list', formData);
    }
    initDetailWish(){
        const {onLoadColWish} = this.props;
        this.storeName = 'colwish';
        let formData=new FormData();
        formData.append('token',this.props.token);
        formData.append('flag',this.props.navigation.state.params.flag);
        formData.append('table_id',this.props.navigation.state.params.table_id);
        onLoadColWish(this.storeName, HttpUrl+'Comment/collegroup_list', formData)
    }
    getRightButton() {
        const {theme,language} = this.props
        return <TouchableOpacity
            style={styles.right_btn_con}
            onPress={()=>{this.state.name?this.sendCreate():null}}
        >
            <Text style={[styles.right_btn_txt, {color: this.state.name?theme:'#bcbcbc'}]}>
                {language===1?languageType.CH.favorites.add_list.save:language===2?languageType.EN.favorites.add_list.save:languageType.JA.favorites.add_list.save}
            </Text>
        </TouchableOpacity>
    }
    changeSwitch(val){
        this.setState({
            isPrivate: val
        })
    }
    render() {
        const {language} = this.props
        return (
            <View style={CommonStyle.flexCenter}>
                <RNEasyTopNavBar
                    title={language===1?languageType.CH.favorites.add_list.title:language===2?languageType.EN.favorites.add_list.title:languageType.JA.favorites.add_list.title}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                />
                <View style={[CommonStyle.flexCenter,{
                    marginTop:15,
                    paddingTop:20,
                    paddingBottom:20,
                    backgroundColor: '#fff',
                    width:'100%'
                }]}>
                    <View style={[CommonStyle.commonWidth]}>
                        <Text style={{
                            color:'#333',
                            fontWeight: 'bold'
                        }}>
                            {language===1?languageType.CH.favorites.add_list.name_title:language===2?languageType.EN.favorites.add_list.name_title:languageType.JA.favorites.add_list.name_title}
                        </Text>
                        <TextInput
                            style={[CommonStyle.commonWidth, styles.input]}
                            defaultValue={this.state.name}
                            onChangeText={(text)=>{this.setState({
                                name:text
                            })}}
                        />
                    </View>
                </View>
                <View style={[CommonStyle.flexCenter,{
                    marginTop:15,
                    height:50,
                    backgroundColor: '#fff',
                    width:'100%'
                }]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                    }]}>
                        <Text style={{
                            color:'#333',
                            fontWeight: 'bold'
                        }}>
                            {language===1?languageType.CH.favorites.add_list.private:language===2?languageType.EN.favorites.add_list.private:languageType.JA.favorites.add_list.private}
                        </Text>
                        <Switch
                            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9}] }}
                            onTintColor={this.props.theme}
                            onValueChange={(value) => this.changeSwitch(value)}
                            value={this.state.isPrivate} />
                    </View>
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
        borderBottomColor:'#f5f5f5',
        borderBottomWidth: 1
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme,
    token: state.token.token,
    language: state.language.language
});
const mapDispatchToProps = dispatch => ({
    onLoadWish:(storeName, url, data, callBack) => dispatch(action.onLoadWish(storeName, url, data, callBack)),
    onLoadColWish: (storeName, url, data) => dispatch(action.onLoadColWish(storeName, url, data))
})
export default connect(mapStateToProps, mapDispatchToProps)(AddWishList)

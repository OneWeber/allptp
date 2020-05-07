import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import action from '../../../action'
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('window')
class SettingLanguage extends Component{
    constructor(props) {
        super(props);
        this.languages = [
            {
                title: '中文',
                val: 0
            },
            {
                title: 'English',
                val: 1
            },
            {
                title: '日本語',
                val: 2
            }
        ]
        this.state = {
            languageIndex: this.props.language - 1
        }
    }
    getLeftButton() {
        return <TouchableOpacity
            style={CommonStyle.back_icon}
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
    changeLanguage(val) {
        const {changeMainLanguage} = this.props;
        this.setState({
            languageIndex: val
        },() => {
           // AsyncStorage.setItem('mainLanguage', JSON.stringify(val+1))
            changeMainLanguage(val+1)
        })
    }
    render(){
        const {languageIndex} = this.state;
        return(
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <RNEasyTopNavBar
                    title={'语言'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View>
                        {
                            this.languages.map((item ,index) => {
                                return <TouchableOpacity key={index} style={[CommonStyle.spaceRow,{
                                    height:60,
                                    paddingLeft:width*0.03,
                                    paddingRight:width*0.03,
                                    borderBottomColor: '#f5f5f5',
                                    borderBottomWidth: 1
                                }]} onPress={()=>{
                                    this.changeLanguage(item.val)
                                }}>
                                    <Text style={{
                                        color:languageIndex===index?this.props.theme:'#333'
                                    }}>{item.title}</Text>
                                    {
                                        languageIndex===index
                                        ?
                                            <AntDesign
                                                name={'checkcircle'}
                                                size={16}
                                                style={{color:this.props.theme}}
                                            />
                                        :
                                            null
                                    }
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    language: state.language.language
});
const mapDispatchToProps = dispatch => ({
    changeMainLanguage: status => dispatch(action.changeMainLanguage(status))
})
export default connect(mapStateToProps, mapDispatchToProps)(SettingLanguage)

import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput, ScrollView, Image} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNEasyAddressPicker from 'react-native-easy-address-picker';
const widthScreen = Dimensions.get('window').width;
class PublishStory extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            address: ''
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
    getRightButton(){
        const {theme} = this.props
        return <View style={{paddingRight:widthScreen*0.03}}>
            <Text style={{
                fontWeight:'bold',
                fontSize: 16,
                color:theme
            }}>
                发布
            </Text>
        </View>
    }
    render(){
        const {theme} = this.props
        return(
            <View style={styles.container}>
                <RNEasyTopNavBar
                    title={'发布故事'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    rightButton={this.getRightButton()}
                    style={{borderBottomWidth: 1,borderBottomColor: '#f5f5f5'}}
                />
                <ScrollView>
                    <View style={[CommonStyle.flexCenter]}>
                        <View style={[CommonStyle.commonWidth]}>
                            <TextInput
                                style={styles.title_input}
                                placeholder = '故事标题'
                                placeholderTextColor='#C9C9C9'
                                multiline={true}
                                onChangeText={(text)=>{this.setState({title:text})}}
                                defaultValue ={this.state.title}
                            />
                            <TextInput
                                style={styles.content_input}
                                placeholder = '尽情发挥吧'
                                placeholderTextColor='#B6B6B6'
                                multiline={true}
                                textAlignVertical='top'
                                onChangeText={(text)=>{this.setState({content:text})}}
                                defaultValue ={this.state.content}
                            />
                            <View style={[CommonStyle.flexStart,{
                                flexWrap: 'wrap',
                                marginTop: 20
                            }]}>
                                <TouchableOpacity style={[styles.addContent,CommonStyle.flexCenter]}>
                                    <AntDesign
                                        name="plus"
                                        size={35}
                                        style={{color:'#E8E8E8'}}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={{
                                color:theme,
                                marginTop: 10
                            }}>
                                (注：您上传的照片中，第一张照片将会成为该故事的封面照哦～)
                            </Text>
                            <TouchableOpacity style={[CommonStyle.spaceRow,{marginTop: 25}]}>
                                <Image
                                    source={require('../../../../assets/images/home/gushilx.png')}
                                    style={{width: 15, height: 18}}
                                />
                                <View style={[CommonStyle.flexStart,styles.lx_con]}>
                                    <Text style={styles.lx_contxt}>故事类型</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[CommonStyle.spaceRow,{marginTop: 5}]}
                                onPress={()=>{this.picker.showPicker()}}
                            >
                                <Image
                                    source={require('../../../../assets/images/home/gushidz.png')}
                                    style={{width: 15, height: 18}}
                                />
                                <View style={[CommonStyle.flexStart,styles.lx_con]}>
                                    <Text style={styles.lx_contxt}>故事地点</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={[CommonStyle.spaceRow,{marginTop: 20,alignItems:'flex-start',marginBottom: 30}]}>
                                <Image
                                    source={require('../../../../assets/images/home/xiangxidz.png')}
                                    style={{width: 15, height: 18}}
                                />
                                <View style={[CommonStyle.flexCenter,{
                                    alignItems: "flex-start",
                                    width:widthScreen*0.94 -30,

                                }]}>
                                    <Text style={styles.lx_contxt}>详细地址</Text>
                                    <TextInput
                                        style={styles.address_con}
                                        placeholder = '请输入详细地址'
                                        placeholderTextColor='#B6B6B6'
                                        multiline={true}
                                        textAlignVertical='top'
                                        onChangeText={(text)=>{this.setState({address:text})}}
                                        defaultValue ={this.state.address}
                                    />
                                </View>
                            </View>
                            <RNEasyAddressPicker
                                hasCountry={true}
                                ref={picker => this.picker = picker}
                                selectCountry={(index) => {}}
                                selectCity={(index) => {}}
                                clickConfirmBtn={(data) => {console.log(data)}}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    title_input:{
        width:'100%',
        fontSize:18,
        marginTop:15,
        color:"#333333",
        fontWeight:'bold'
    },
    content_input:{
        width:'100%',
        fontSize:16,
        minHeight:120,
        marginTop:15,
        color:"#666666",
        lineHeight: 22
    },
    addContent: {
        width:(widthScreen*0.94 - 30) /3,
        height: (widthScreen*0.94 - 30) /3,
        borderStyle:'dashed',
        borderColor:'#dcdcdc',
        borderWidth:1,
        borderRadius:0.1
    },
    lx_con:{
        width: widthScreen*0.94 -30,
        height: 50,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1
    },
    lx_contxt: {
        color:'#333',
        fontSize: 16.5
    },
    address_con:{
        fontSize:16,
        minHeight:100,
        marginTop:15,
        borderBottomWidth:1,
        borderBottomColor:'#f5f5f5',
        marginBottom:30,
        color:"#333",
        paddingBottom: 10,
    }
})
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(PublishStory)

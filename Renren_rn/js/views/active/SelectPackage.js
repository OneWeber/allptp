import React,{Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions,SafeAreaView} from 'react-native';
import {connect} from 'react-redux'
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../assets/css/Common_css';
const {width, height} = Dimensions.get('window')
class SelectPackage extends Component{
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
    render(){
        return(
            <View style={{flex: 1,position:'relative'}}>
                <RNEasyTopNavBar
                    title={'选择套餐和人数'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                    style={{borderBottomColor:'#f5f5f5',borderBottomWidth: 1}}
                />
                <ScrollView>
                    <Package {...this.props}/>
                    <Housing {...this.props}/>
                    <PeopleNum {...this.props}/>
                    <Tourists {...this.props}/>
                </ScrollView>
                <SafeAreaView style={[styles.select_bot,CommonStyle.flexCenter]}>
                    <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height: 60,borderTopWidth:1,borderTopColor:'#f5f5f5'}]}>
                        <Text style={{color:'#333',fontWeight:'bold',fontSize: 15}}>总额：<Text style={{color:this.props.theme}}>¥200</Text></Text>
                        <TouchableOpacity style={[CommonStyle.flexCenter,{width:120,height:40,backgroundColor:this.props.theme,borderRadius: 3}]}>
                            <Text style={{color:'#fff',fontSize: 15}}>去支付</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    back_icon: {
        paddingLeft: width*0.03
    },
    package_con:{
        marginTop:10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#fff'
    },
    package_item: {
        height: 40,
        width: (width*0.94-15) / 2,
        position: 'relative',
        backgroundColor: '#EAFEFF',
        borderRadius: 3,
        marginTop: 10,
        overflow:'hidden'
    },
    select_item:{
        width: 20,
        height: 20,
        borderRadius: 10,
        position:'absolute',
        right: -8,
        bottom:-8
    },
    add_btn:{
        width:50,
        height: 27,
        backgroundColor:'#ECFEFF',
        borderRadius: 13
    },
    add_con:{
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor:'#F5F7FA',
        marginTop: 15
    },
    p_roll:{
        width: 26,
        height:26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor:'#d6d6d6',
        backgroundColor:'#fff'
    },
    tourists_item:{
        padding: 10,
        backgroundColor: '#F5F7FA',
        width: '100%',
        marginTop: 12.5,
        borderRadius: 3
    },
    select_bot:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        backgroundColor:'#fff',
    }
})
const mapStateToProps = state => ({
    join: state.join.join,
    theme: state.theme.theme
})
export default connect(mapStateToProps)(SelectPackage)
//套餐
class Package extends Component{
    render(){
        const {theme} = this.props
        this.arr=[1,2,3]
        return(
            <View style={[styles.package_con, CommonStyle.flexCenter]}>
                <View style={CommonStyle.commonWidth}>
                    <Text style={{color: '#333',fontWeight:'bold',fontSize: 16}}>亲子价套餐</Text>
                    <View style={[CommonStyle.flexStart,{flexWrap: 'wrap',marginTop: 15}]}>
                        {
                            this.arr.map((item, index) => {
                                return <TouchableOpacity style={[styles.package_item,CommonStyle.flexCenter,{flexDirection:'row',marginLeft:(index+1)%2===0?10:0}]}>
                                    <Text style={{color:theme,fontSize: 12,fontWeight:'bold'}}>亲子2成人2儿童</Text>
                                    <Text style={{color:theme,fontSize: 12,fontWeight:'bold',marginLeft: 10}}>¥150</Text>
                                    <View style={[styles.select_item,{backgroundColor:theme}]}>
                                        <AntDesign
                                            name={'check'}
                                            size={10}
                                            style={{color:'#fff',position:'absolute',top:2,left:2}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <Text style={{color: '#333',fontWeight:'bold',fontSize: 16,marginTop: 20}}>综合套餐</Text>
                    <View style={[CommonStyle.flexStart,{flexWrap: 'wrap',marginTop: 15}]}>
                        {
                            this.arr.slice(0,2).map((item, index) => {
                                return <TouchableOpacity style={[styles.package_item,CommonStyle.flexCenter,{flexDirection:'row',marginLeft:(index+1)%2===0?10:0}]}>
                                    <Text style={{color:theme,fontSize: 12,fontWeight:'bold'}}>亲子2成人2儿童</Text>
                                    <Text style={{color:theme,fontSize: 12,fontWeight:'bold',marginLeft: 10}}>¥150</Text>
                                    <View style={[styles.select_item,{backgroundColor:theme}]}>
                                        <AntDesign
                                            name={'check'}
                                            size={10}
                                            style={{color:'#fff',position:'absolute',top:2,left:2}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            })
                        }
                    </View>

                </View>
            </View>
        )
    }
}
//住宿
class Housing extends Component{
    render(){
        return(
            <View style={[styles.package_con,CommonStyle.flexCenter]}>
                <View style={CommonStyle.commonWidth}>
                    <View style={CommonStyle.spaceRow}>
                        <Text style={{color: '#333',fontWeight:'bold',fontSize: 16}}>选择住宿</Text>
                        <View style={[CommonStyle.flexCenter,styles.add_btn]}>
                            <Text style={{color:this.props.theme,fontSize:12,fontWeight:'bold'}}>添加</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
//选择人数
class PeopleNum extends Component{
    render(){
        return(
            <View style={[styles.package_con,CommonStyle.flexCenter]}>
                <View style={CommonStyle.commonWidth}>
                    <View style={CommonStyle.flexStart}>
                        <View>
                            <Text style={{color: '#333',fontWeight:'bold',fontSize: 16}}>选择人数</Text>
                            <Text style={{color:'#999',fontSize:12,marginTop: 5}}>(除开套餐人数)</Text>
                        </View>
                    </View>
                    <View style={styles.add_con}>
                        <View style={[CommonStyle.spaceRow]}>
                            <View style={[CommonStyle.flexStart]}>
                                <Text style={{color: '#333'}}>成人</Text>
                                <Text style={{color: this.props.theme,fontWeight:'bold',fontSize:13,marginLeft:10}}>¥35/人</Text>
                            </View>
                            <View style={[CommonStyle.flexEnd]}>
                                <TouchableOpacity style={[styles.p_roll,CommonStyle.flexCenter]}>
                                    <AntDesign
                                        name={'minus'}
                                        size={14}
                                        style={{color:'#d6d6d6'}}
                                    />
                                </TouchableOpacity>
                                <Text style={{color:'#666',fontSize: 16,marginLeft: 15}}>0</Text>
                                <TouchableOpacity style={[styles.p_roll,CommonStyle.flexCenter,{marginLeft: 15}]}>
                                    <AntDesign
                                        name={'plus'}
                                        size={14}
                                        style={{color:'#d6d6d6'}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[CommonStyle.spaceRow,{marginTop: 15}]}>
                            <View style={[CommonStyle.flexStart]}>
                                <Text style={{color: '#333'}}>儿童</Text>
                                <Text style={{color: this.props.theme,fontWeight:'bold',fontSize:13,marginLeft:10}}>¥35/人</Text>
                            </View>
                            <View style={[CommonStyle.flexEnd]}>
                                <TouchableOpacity style={[styles.p_roll,CommonStyle.flexCenter]}>
                                    <AntDesign
                                        name={'minus'}
                                        size={14}
                                        style={{color:'#d6d6d6'}}
                                    />
                                </TouchableOpacity>
                                <Text style={{color:'#666',fontSize: 16,marginLeft: 15}}>0</Text>
                                <TouchableOpacity style={[styles.p_roll,CommonStyle.flexCenter,{marginLeft: 15}]}>
                                    <AntDesign
                                        name={'plus'}
                                        size={14}
                                        style={{color:'#d6d6d6'}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 15,paddingLeft: 10,paddingRight:10}}>
                        <Text style={{color:'#333',fontSize: 13,fontWeight:'bold'}}>儿童价标准</Text>
                        <Text style={{color:'#999',fontSize:12,marginTop:5}}>年龄3-12周岁，超过12岁请购买成人价</Text>
                    </View>
                </View>
            </View>
        )
    }
}
//添加游客信息
class Tourists extends Component{
    render(){
        return(
            <View style={[styles.package_con,CommonStyle.flexCenter,{marginBottom: 110}]}>
                <View style={CommonStyle.commonWidth}>
                    <View style={CommonStyle.spaceRow}>
                        <Text style={{color: '#333',fontWeight:'bold',fontSize: 16}}>添加游客信息</Text>
                        <View style={[CommonStyle.flexCenter,styles.add_btn]}>
                            <Text style={{color:this.props.theme,fontSize:12,fontWeight:'bold'}}>添加</Text>
                        </View>
                    </View>
                    {
                        this.props.join.person.map((item, index) => {
                            return <View style={[CommonStyle.spaceRow,styles.tourists_item]} key={index}>
                                <View style={[CommonStyle.flexStart]}>
                                    <Text
                                        numberOfLines={1} ellipsizeMode={'tail'}
                                        style={{color: '#333',width: 65}}>{item.name}</Text>
                                    <Text style={{color: '#333',marginLeft: 10}}>{item.tel?item.tel:null}</Text>
                                </View>
                                <View>
                                    {
                                        item.isMe
                                            ?
                                            <Text style={{color:this.props.theme}}>(我自己)</Text>
                                            :
                                            <View style={[CommonStyle.flexEnd]}>
                                                <Text style={{color: '#999'}}>编辑</Text>
                                                <Text style={{color: '#999',marginLeft: 10}}>删除</Text>
                                            </View>
                                    }
                                </View>
                            </View>
                        })
                    }

                </View>
            </View>
        )
    }
}


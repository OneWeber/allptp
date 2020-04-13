import React,{Component} from 'react';
import {TouchableOpacity, View, Text, Dimensions, ScrollView, SafeAreaView} from 'react-native';
import stepsList from '../json/steps';
import CommonStyle from '../../assets/css/Common_css';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
const {width, height} = Dimensions.get('window')
class MenuContent extends Component{
    goPage(path){
        if(path) {
            this.props.navigation.navigate(path)
        }
    }
    render(){
        const {theme, status} = this.props
        let router = this.props.navigation.state.routeName
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={[CommonStyle.flexCenter,{
                    height: 50
                }]}><Text style={{
                    fontWeight:'bold',
                    color:'#333'
                }}>创建体验步骤({stepsList.length}){this.props.routeName}</Text></View>
                <ScrollView>
                    <View>
                        {
                            stepsList.map((item, index) => {
                                return <TouchableOpacity key={index} style={[CommonStyle.spaceRow,{
                                    height: 40,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginTop: 10
                                }]}
                                   onPress={()=>{this.goPage(item.router)}}
                                >
                                    <Text style={{
                                        color:router==item.router?theme:'#333',
                                        fontWeight: router==item.router?'bold':'normal'
                                    }}>{item.title}</Text>
                                    {
                                        router==item.router
                                        ?
                                            <AntDesign
                                                name={status[index]?'check':'loading1'}
                                                size={18}
                                                style={{color:theme}}
                                            />
                                        :
                                            null
                                    }
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme.theme,
    status: state.steps.status
})
export default connect(mapStateToProps)(MenuContent)

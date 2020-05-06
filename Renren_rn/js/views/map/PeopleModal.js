import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
class PeopleModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adult: 0,
            child: 0
        }
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative'}}>
                <View style={[CommonStyle.spaceRow,{
                    paddingLeft:10,
                    paddingRight: 10,
                    height:45,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f5f5f5',
                }]}>
                    <Text style={{color:'#fff'}}>清楚全部</Text>
                    <Text style={{
                        color:'#333',
                        fontWeight: 'bold'
                    }}>体验人数</Text>
                    <Text style={{color:'#666'}}>清楚全部</Text>
                </View>
                <View style={{
                    paddingLeft:10,
                    paddingRight: 10,
                }}>
                    <View style={[CommonStyle.spaceRow,{
                        marginTop: 20
                    }]}>
                        <Text style={{color:'#333'}}>成人</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.roll_view,{
                                borderColor:this.props.theme
                            }]}>
                                <AntDesign
                                    name={'minus'}
                                    size={14}
                                    style={{color:this.props.theme}}
                                />
                            </TouchableOpacity>
                            <Text style={{
                                color:'#333',
                                marginLeft: 20
                            }}>
                                {this.state.adult}
                            </Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.roll_view,{
                                borderColor:this.props.theme,
                                marginLeft: 20
                            }]}>
                                <AntDesign
                                    name={'plus'}
                                    size={14}
                                    style={{color:this.props.theme}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[CommonStyle.spaceRow,{
                        marginTop: 20
                    }]}>
                        <Text style={{color:'#333'}}>儿童</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.roll_view,{
                                borderColor:this.props.theme
                            }]}>
                                <AntDesign
                                    name={'minus'}
                                    size={14}
                                    style={{color:this.props.theme}}
                                />
                            </TouchableOpacity>
                            <Text style={{
                                color:'#333',
                                marginLeft: 20
                            }}>
                                {this.state.child}
                            </Text>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.roll_view,{
                                borderColor:this.props.theme,
                                marginLeft: 20
                            }]}>
                                <AntDesign
                                    name={'plus'}
                                    size={14}
                                    style={{color:this.props.theme}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.people_bot,CommonStyle.flexCenter]}>
                    <Text style={{
                        color:this.props.theme,
                        fontWeight: 'bold'
                    }}>保存</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    roll_view: {
        width:30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1
    },
    people_bot: {
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        height:45,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5'
    }
});
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(PeopleModal)

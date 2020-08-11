import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
class PeopleModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            adult: this.props.num?this.props.num:0,
        }
    }
    delNum() {
        let num = this.state.adult;
        if(num>0) {
            num--
        }
        this.setState({
            adult: num
        },() => {
            this.props.changeNum(num)
        })
    }
    addNum() {
        let num = this.state.adult;
        num ++
        this.setState({
            adult: num
        },() => {
            this.props.changeNum(num)
        })
    }
    saveNum() {
        this.props.saveNum()
    }
    render(){
        return(
            <View style={{flex: 1,position:'relative'}}>
                <View style={[CommonStyle.flexCenter,{
                    paddingLeft:10,
                    paddingRight: 10,
                    height:45,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f5f5f5',
                }]}>
                    <Text style={{
                        color:'#333',
                        fontWeight: 'bold'
                    }}>体验人数</Text>
                </View>
                <View style={{
                    paddingLeft:10,
                    paddingRight: 10,
                }}>
                    <View style={[CommonStyle.spaceRow,{
                        marginTop: 20
                    }]}>
                        <Text style={{color:'#333'}}>人数</Text>
                        <View style={CommonStyle.flexEnd}>
                            <TouchableOpacity style={[CommonStyle.flexCenter,styles.roll_view,{
                                borderColor:this.props.theme
                            }]}
                            onPress={() => {
                                this.delNum()
                            }}
                            >
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
                            }]}
                            onPress={() => {
                                this.addNum()
                            }}
                            >
                                <AntDesign
                                    name={'plus'}
                                    size={14}
                                    style={{color:this.props.theme}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.people_bot,CommonStyle.flexCenter]}
                    onPress={() => {
                        this.saveNum()
                    }}
                >
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
        borderTopColor: '#f5f5f5',
    }
});
const mapStateToProps = state => ({
    theme: state.theme.theme
})
export default connect(mapStateToProps)(PeopleModal)

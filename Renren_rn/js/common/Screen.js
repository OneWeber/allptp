import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import CommonStyle from '../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modalbox';
const {width, height} = Dimensions.get('window')
export default class Screen extends Component{
    constructor(props) {
        super(props);
        this.tabNames=this.props.tabNames
        this.state = {
            topNum:0,
            screenHeight: 0,
            screenData: [],
            screenIndex: '',
            screenType: 0
        }
    }
    onClosingState(){

    }
    onClose(){

    }
    onOpen(){

    }
    layout(e){
        this.setState({
            topNum: parseInt(e.layout.y)
        })
    }
    layoutH(e){
        this.setState({
            topNum: this.state.topNum + parseInt(e.layout.height) + 19
        })
    }
    selectScreen(index){
        const {tabNames} = this.props
        this.setState({
            screenIndex: index,
            screenType: tabNames[index].screenType
        })
        if(tabNames[index].screenType === 1){
            this.setState({
                screenHeight: tabNames[index].data.length*50,
                screenData:tabNames[index].data
            },() => {
                this.refs.screen.open()
            })
        } else if(tabNames[index].screenType === 3){
            this.setState({
                screenHeight: height-(this.state.topNum> 110?this.state.topNum:138)
            })
            this.refs.screen.open()
        }
    }
    render(){
        const {screenHeight, screenData, screenType} = this.state
        return(
            <View onLayout={({nativeEvent:e})=> this.layout(e)} style={[CommonStyle.flexCenter,{
                width:width,
                borderBottomColor:'#f5f5f5',
                borderBottomWidth: 1,
                position:'relative'
            }]}>
                <View onLayout={({nativeEvent:e})=> this.layoutH(e)} style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                    marginTop: 18,
                    paddingBottom: 18,
                }]}>
                    {
                        this.tabNames.map((item, index) => {
                            return <TouchableOpacity style={CommonStyle.flexStart} onPress={()=>{
                                this.selectScreen(index);
                                this.props._selectScreen(index)
                            }}>
                                <Text style={{color:'3333',fontWeight:'bold',fontSize: 13}}>{item.title}</Text>
                                <AntDesign
                                    name={'caretdown'}
                                    size={8}
                                    style={{color:'#999',marginLeft: 3}}
                                />
                            </TouchableOpacity>
                        })
                    }
                </View>
                <Modal
                    style={{height:screenHeight,width:width,backgroundColor:'red'}}
                    ref={"screen"}
                    animationDuration={200}
                    position={"top"}
                    backdropColor={'rgba(0,0,0,0.3)'}
                    swipeToClose={false}
                    entry={'top'}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    backdropPressToClose={true}
                    coverScreen={true}
                    top={this.state.topNum}
                    onClosingState={this.onClosingState}>
                    <View style={{width:'100%',
                        height:screenHeight,
                        backgroundColor:'#fff',
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        {
                            screenType === 3
                            ?
                                this.props.children
                            :
                            screenData.map((item, index) => {
                                return <TouchableOpacity style={{
                                    width:width*0.94,
                                    height: 50,
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    flexDirection:'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f5f5f5'
                                }}
                                onPress={()=>{this.props.selectItem(this.state.screenIndex, index, item.value)}}>
                                    <Text style={{color:'#333',fontSize: 13}}>{item.title}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </Modal>
            </View>
        )
    }

    closeScreen(){
        this.refs.screen.close()
    }

}
const styles = StyleSheet.create({

})


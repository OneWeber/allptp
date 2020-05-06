import React,{Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import CommonStyle from '../../../../assets/css/Common_css';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux'
import action from '../../../action'
import getSameColor from '../../../utils/getSameColor';
const {width, height} = Dimensions.get('window')
class MainTheme extends Component{
    constructor(props) {
        super(props);
        this.color = [
            '#14c5ca',
            '#008489',
            '#CC3366',
            '#FF9933',
            '#996633',
            '#336633',
            '#1E90FF',
            '#4682B4',
            '#BDB76B',
            '#FF4500',
            '#800000',
            '#FFB6C1',
            '#C71585',
            '#4B0082',
            '#778899'
        ]
    }
    componentDidMount() {
        console.log('color', getSameColor('999999'))
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
    chanegColor(index) {
        const {changeTheme} = this.props
        changeTheme(this.color[index])
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <RNEasyTopNavBar
                    title={'主题颜色'}
                    backgroundTheme={'#fff'}
                    titleColor={'#333'}
                    leftButton={this.getLeftButton()}
                />
                <ScrollView>
                    <View style={[CommonStyle.flexStart,{
                        flexWrap: 'wrap'
                    }]}>
                        {
                            this.color.map((item, index) => {
                                return <TouchableOpacity style={{
                                    width: (width*0.94 - 40) / 3,
                                    marginLeft: index%3===0?width*0.03:20,
                                    marginTop: 20,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff'
                                }} key={index} onPress={()=>this.chanegColor(index)}>
                                    <View style={{
                                        height:100,
                                        backgroundColor: item
                                    }}></View>
                                    <View style={[CommonStyle.flexCenter,{
                                        height: 30
                                    }]}>
                                        <Text>{item}</Text>
                                    </View>
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
    theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
    changeTheme: theme => dispatch(action.changeTheme(theme))
})
export default connect(mapStateToProps, mapDispatchToProps)(MainTheme)

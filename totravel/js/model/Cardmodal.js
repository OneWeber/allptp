import React, {Component} from 'react';
import {
    Animated,
    ActivityIndicator,
    Dimensions,
    Easing,
    View,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Text,
    SafeAreaView,
    ImageBackground
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from "react-native-vector-icons/AntDesign"


const {width, height} = Dimensions.get('window');

export default class CardModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pressedStyle: {},

            org_width: width - 32,
            org_height: height / 5,

            top_width: new Animated.Value(width - 32),
            top_height: new Animated.Value(height / 5),
            bottom_width: new Animated.Value(width - 32),
            bottom_height: new Animated.Value(height / 6),
            content_height: new Animated.Value(0),

            top_pan: new Animated.ValueXY(),
            bottom_pan: new Animated.ValueXY(),
            content_pan: new Animated.ValueXY(),

            content_opac: new Animated.Value(0),
            button_opac: new Animated.Value(0),
            back_opac: new Animated.Value(0),
            plus: new Animated.Value(1),

            TopBorderRadius: 5,
            BottomBorderRadius: 0,

            activate: 'Activate',
            activated: false,

            offset: 0,



            pressed: false,
        };

        this._onPress = this._onPress.bind(this);
        this.calculateOffset = this.calculateOffset.bind(this);
        this.activate = this.activate.bind(this);

    }


    _onPress() {
        this.props.onClick();
        this.setState({pressed: !this.state.pressed});
        this.calculateOffset();
    }


    grow() {
        this.setState({TopBorderRadius: 0, BottomBorderRadius: 5});

        Animated.parallel([
            Animated.spring(
                this.state.top_width,
                {
                    toValue: width
                }
            ).start(),
            Animated.spring(
                this.state.top_height,
                {
                    toValue: height/2
                }
            ).start(),
            Animated.spring(
                this.state.bottom_height,
                {
                    toValue: height/6 + 50
                }
            ).start(),
            Animated.spring(
                this.state.content_height,
                {
                    toValue: height/2
                }
            ).start(),
            Animated.spring(
                this.state.top_pan,
                {
                    toValue: {
                        x: 0,
                        y: -this.state.offset
                    }
                }
            ).start(),
            Animated.spring(
                this.state.content_pan,
                {
                    toValue: {
                        x: 0,
                        y: -(height/8  + this.state.offset)
                    }
                }
            ).start(),
            Animated.spring(
                this.state.bottom_pan,
                {
                    toValue: {
                        x: 0,
                        y: -(50 + this.state.offset)
                    }
                }
            ).start(),

            Animated.timing(
                this.state.content_opac,
                {
                    toValue: 1
                }
            ).start(),
            Animated.timing(
                this.state.button_opac,
                {
                    toValue: 1
                }
            ).start(),
            Animated.timing(
                this.state.back_opac,
                {
                    toValue: 1
                }
            ).start(),
            Animated.timing(
                this.state.plus,
                {
                    toValue: 0
                }
            ).start(),

        ])
    }

    shrink() {

        this.setState({TopBorderRadius: 5, BottomBorderRadius: 0});
        Animated.parallel([
            Animated.spring(
                this.state.top_width,
                {
                    toValue: this.state.org_width
                }
            ).start(),
            Animated.spring(
                this.state.top_height,
                {
                    toValue: this.state.org_height
                }
            ).start(),
            Animated.spring(
                this.state.bottom_height,
                {
                    toValue: height/6
                }
            ).start(),
            Animated.spring(
                this.state.top_pan,
                {
                    toValue: {
                        x: 0,
                        y: 0
                    }
                }
            ).start(),
            Animated.spring(
                this.state.bottom_pan,
                {
                    toValue: {
                        x: 0,
                        y: 0
                    }
                }
            ).start(),
            Animated.spring(
                this.state.content_height,
                {
                    toValue: 0
                }
            ).start(),
            Animated.timing(
                this.state.content_opac,
                {
                    toValue: 0
                }
            ).start(),
            Animated.timing(
                this.state.button_opac,
                {
                    toValue: 0
                }
            ).start(),
            Animated.timing(
                this.state.back_opac,
                {
                    toValue: 0
                }
            ).start(),
            Animated.timing(
                this.state.plus,
                {
                    toValue: 1
                }
            ).start(),

        ])
    }


    calculateOffset() {
        if(this.refs.container) {
            this.refs.container.measure((fx, fy, width, height, px, py) => {
                this.setState({offset: py}, () => {
                    if(this.state.pressed) {
                        console.log('growing with offset', this.state.offset);
                        this.grow();
                    } else {
                        console.log('shrinking with offset', this.state.offset);
                        this.shrink();
                    }

                })
            });
        }
    }

    activate() {
        this.setState({activate: 'loading'});
        setTimeout(()=> {
            this.setState({activate: <Text>已关注  <Icon name='check'/></Text>, activated: true})
        }, 1500)

    }


    renderTop() {
        var back = this.state.pressed
            ?
            <TouchableOpacity style={[styles.backButton]} onPress={this._onPress}>
                <Animated.View style={{opacity: this.state.back_opac}}>
                    <AntDesign
                        name={'left'}
                        size={24}
                        style={{color:'#fff'}}
                    />
                </Animated.View>
            </TouchableOpacity>
            : <View/>;

        var borderStyles = !this.state.pressed ? {borderRadius: this.state.TopBorderRadius, borderBottomLeftRadius: 0} :
            {borderTopRightRadius: this.state.TopBorderRadius, borderTopLeftRadius: this.state.TopBorderRadius};
        return (
            <Animated.View
                            style={[styles.top, borderStyles, {
                                width: this.state.top_width,
                                height: this.state.top_height,
                                transform: this.state.top_pan.getTranslateTransform(),
                                position:'relative',

                            }]}>

                <ImageBackground source={this.props.image} style={{flex:1}}>
                    <View style={{position:'absolute',left:0,right:0,top:0,bottom: 0,zIndex:5}}>
                        {back}

                    </View>
                </ImageBackground>


            </Animated.View>
        )
    }

    renderBottom() {

        var loading = this.state.activate == 'loading' ?
            <ActivityIndicator animating={true} color='white'/>
            :<Text style={{color: 'white', fontWeight: '800', fontSize: 18}}>关注</Text>;

        var button = this.state.pressed
            ?
            <TouchableOpacity onPress={this.activate}>
                <Animated.View style={{opacity: this.state.button_opac, backgroundColor: this.props.color,
                    marginTop: 10, borderRadius: 10, width: width-64, height: 50,
                    alignItems: 'center', justifyContent: 'center'}}>
                    {loading}
                </Animated.View>

            </TouchableOpacity>
            :
            null;

        var plusButton = !this.state.activated
            ?
            <Animated.View style={{opacity: this.state.plus, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='plus-circle' style={{fontSize: 24, color: this.props.color}}/>
            </Animated.View>
            :
            <Animated.View style={{opacity: this.state.plus, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='check-circle' style={{fontSize: 24, color: this.props.color}}/>
            </Animated.View>

        return (
            <Animated.View style={[styles.bottom,
                {
                    width: this.state.bottom_width,
                    height: this.state.bottom_height,
                    borderRadius: this.state.BottomBorderRadius,
                    transform: this.state.bottom_pan.getTranslateTransform(),
                    shadowColor: '#000000',
                    shadowOffset: {width: 1, height: 0},
                    shadowRadius: 2,
                    shadowOpacity: 0.2,
                }]}>

                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 4}}>
                        <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.props.title}</Text>
                        <Text style={{fontSize: 12, fontWeight: '500', color: 'gray', paddingBottom: 10}}>{this.props.description}</Text>
                        <Text style={{fontSize: 12, fontWeight: '500', color: 'gray'}}> {this.props.time} </Text>
                    </View>

                    {plusButton}

                </View>
                {button}


            </Animated.View>
        )
    }

    renderContent() {
        if(!this.state.pressed) {
            return
        }
        return (
            <Animated.View style={{opacity: this.state.content_opac, marginTop: 40, width: width, height: this.state.content_height, zIndex: -1,
                backgroundColor: '#fff', transform: this.state.content_pan.getTranslateTransform()}}>

                <View style={{backgroundColor: 'white', width:'94%',marginLeft:'3%',marginTop:25}}>
                    <Text style={{fontSize: 24, fontWeight: '700', color: 'black'}}>故事内容</Text>
                    <Text style={{color: 'gray', paddingTop: 10,fontSize:16,lineHeight:20}}>{this.props.content}</Text>
                </View>


            </Animated.View>
        )
    }

    render() {

        return (

            <View style={[styles.container, this.state.pressedStyle]}>
                <TouchableWithoutFeedback
                    onPress={!this.state.pressed ? this._onPress : null}>
                    <View ref="container"
                          style={[{alignItems: 'center'}]}>
                        {this.renderTop()}
                        {this.renderBottom()}
                        {this.renderContent()}
                    </View>
                </TouchableWithoutFeedback>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
        marginTop: 16,
    },
    top: {
        marginBottom: 0,
        backgroundColor: '#fff'
    },
    bottom: {
        marginTop: 0,
        padding: 16,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'white'
    },
    backButton: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 100,
        left: 10,
        zIndex:10
    }
})

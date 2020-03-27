import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, FlatList,ImageBackground} from 'react-native';
import CommonStyle from '../../../assets/css/Common_css';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigatorUtils from '../../navigator/NavigatorUtils';
const {width, height} = Dimensions.get('window')
export default class Destination extends Component{
    constructor(props) {
        super(props);
        this.tabNames=['类型', '排序', '地区', '筛选']
    }
    render(){
        return(
            <SafeAreaView style={[styles.container, CommonStyle.flexCenter,{justifyContent:'flex-start'}]}>
                <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{height: 50}]}>
                    <AntDesign
                        name={'left'}
                        size={20}
                        style={{color: '#333'}}
                        onPress={()=>NavigatorUtils.backToUp(this.props)}
                    />
                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                        height: 36,
                        width:width*0.94-30,
                        backgroundColor: '#f5f7fa',
                        borderRadius: 4
                    }]}>
                        <Text style={{color:'#999',fontSize: 13}}>目的地或体验</Text>
                    </TouchableOpacity>
                </View>
               <ScrollView>
                   <View style={[CommonStyle.flexCenter,{justifyContent:'flex-start'}]}>
                        <View style={CommonStyle.commonWidth}>
                            <Text style={{
                                marginTop: 20,
                                color:'#333',
                                fontSize: 15,
                                fontWeight:'bold'
                            }}>为您推荐</Text>
                        </View>
                       <View>
                           <DestinationCity />
                       </View>

                       <View style={[CommonStyle.flexCenter,{
                           width:width,
                           borderBottomColor:'#f5f5f5',
                           borderBottomWidth: 1,
                           marginTop: 20
                       }]}>
                           <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                               marginTop: 18,
                               paddingBottom: 18,
                           }]}>
                               {
                                   this.tabNames.map((item, index) => {
                                       return <TouchableOpacity style={CommonStyle.flexStart}>
                                           <Text style={{color:'3333',fontWeight:'bold',fontSize: 13}}>{item}</Text>
                                           <AntDesign
                                               name={'caretdown'}
                                               size={8}
                                               style={{color:'#999',marginLeft: 3}}
                                           />
                                       </TouchableOpacity>
                                   })
                               }
                           </View>
                       </View>
                        <DestinationActive />
                   </View>
               </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    city_item: {
        width: 80,
        height:90,
        borderRadius: 4,
        overflow:'hidden',
    }
})
import city from '../../json/city'
class DestinationCity extends Component{
    constructor(props) {
        super(props);
        this.citys = city
    }
    _renderCity(data){
        return <View style={[styles.city_item,{
            marginLeft:data.index===0?width*0.03:10,
            marginRight:data.index===this.citys.length-1?width*0.03:0
        }]}>
            <ImageBackground
                source={data.item.url}
                style={styles.city_item}
            >
                <View style={[CommonStyle.flexCenter,styles.city_item,{backgroundColor:'rgba(0,0,0,.5)'}]}>
                    <Text style={{
                        color:'#fff',
                        fontSize: 13,
                        fontWeight:'bold'
                    }}>{data.item.title}</Text>
                </View>
            </ImageBackground>
        </View>
    }
    render(){
        return(
            <View style={{marginTop: 15, height:90}}>
                <FlatList
                    data={this.citys}
                    horizontal={true}
                    renderItem={(data)=>this._renderCity(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
import active from '../../json/active'
import Ractive from '../../common/Ractive';
class DestinationActive extends Component{
    constructor(props) {
        super(props);
        this.actives = active
    }
    _renderItem(data){
        return <Ractive data_r={data.item} data_index={data.index}/>
    }
    render(){
        return(
            <View style={[CommonStyle.flexCenter,{marginTop: 17}]}>
                <FlatList
                    data={this.actives}
                    renderItem={(data)=>this._renderItem(data)}
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

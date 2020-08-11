import React, {Component} from 'react';
import {
    View,
    FlatList,
    Dimensions,
    Modal,
    TouchableHighlight,
    Text,
    CameraRoll, Image,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import LazyImage from 'animated-lazy-image';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
type Props = {};
export  default  class Pic extends Component<Props>{
    constructor(props){
        super(props);
        this.state={
            index: 0,
            modalVisible: false,
            imgArr:[],
            img:this.props.picData,
            data:this.props.data,

        }
    }
    componentWillMount(){
        let pic=[];
        for(let i=0;i<this.state.img.length;i++){
            pic.unshift({
                url:this.state.img[i].domain+this.state.img[i].image_url
            })
        }
        this.setState({
            imgArr:pic.reverse(),
        })
    }
    componentDidMount(){
        //alert(JSON.stringify(this.state.img))
    }
    showImg(i){
        this.setState({
            index:i,
            modalVisible:true
        })
    }
    _renderItem(data){
        return <View style={{width:(widthScreen*0.94-15)/2,height:(widthScreen*0.94-15)/2-30,marginLeft:data.index%2==0?0:10,marginTop:15}}>
            <TouchableHighlight
                style={{justifyContent:'center',alignItems:'center',width:'100%',height:(widthScreen*0.94-15)/2-30}}
                underlayColor='rgba(0,0,0,.1)'
                onPress={()=>{this.showImg(data.index)}}
            >
                <LazyImage source={{uri:data.item.domain?data.item.domain+data.item.image_url:null}} style={{width:(widthScreen*0.94-15)/2,height:(widthScreen*0.94-15)/2-30,borderRadius:3}} />
            </TouchableHighlight>

        </View>
    }
    saveImg(img){
        var promise = CameraRoll.saveToCameraRoll(img);
        promise.then(function(result) {
            alert('保存成功！地址如下：\n' + result);
        }).catch(function(error) {
            alert('保存失败！\n' + error);
        });
    }
    render(){
        return(
            <View style={{flex:1}}>
                {
                    this.props.picData.length>0
                        ?
                        <View style={{width:"92%",justifyContent:'flex-start',alignItems:"flex-start",flexDirection:'row'}}>
                            <FlatList
                                data={this.props.picData}
                                horizontal={false}
                                numColumns={2}
                                renderItem={(data)=>this._renderItem(data)}
                                showsHorizontalScrollIndicator = {false}
                                showsVerticalScrollIndicator = {false}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        </View>
                        :
                        <View style={{flex:1,backgroundColor:'#ffffff',justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{color:'#666666',fontSize:14,marginTop:15}}>暂无图片</Text>
                        </View>
                }

                <Modal
                    visible={this.state.modalVisible}
                    transparent={true}
                    style={{position:'relative'}}
                    renderFooter={()=>this.renderFooter()}
                    onRequestClose={() => this.setState({modalVisible: false})}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        onClick={()=>{this.setState({modalVisible:false})}}
                        imageUrls={this.state.imgArr}
                        index={this.state.index}
                    />
                </Modal>

            </View>
        )
    }
}

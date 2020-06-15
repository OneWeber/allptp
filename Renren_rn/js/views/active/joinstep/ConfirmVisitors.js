import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions} from 'react-native';
import RNEasyTopNavBar from 'react-native-easy-top-nav-bar';
import NavigatorUtils from '../../../navigator/NavigatorUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyle from '../../../../assets/css/Common_css';
import {connect} from 'react-redux';
import action from '../../../action';
import {removeDuplicatedItem} from '../../../utils/auth'
import LazyImage from 'animated-lazy-image';
const {width, height} = Dimensions.get('window');
class ConfirmVisitors extends Component{
    constructor(props) {
        super(props);
        this.max_person_num = this.props.navigation.state.params.max_person_num;
        this.order_person_num = this.props.navigation.state.params.order_person_num;
        this.state = {
            combine: [],
            isEnjoy: false
        }
    }

    getLeftButton(){
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
    editVisitor(index) {
        NavigatorUtils.goPage({index: index, isEdit: true}, 'AddVistitors')
    }
    delVisitor(index) {
        const {join, initJoin} = this.props;
        let personList = join.person;
        personList.splice(index, 1)
        let data = {
            activity_id: join.activity_id,
            slot_id: join.slot_id,
            person: personList,
            house: join.house,
            houseid:[],
            adult_price_origin: join.adult_price_origin,
            adult_price:join.adult_price,
            kids_price_origin: join.kids_price_origin,
            kids_price: join.kids_price,
            age_limit: '',
            date: join.date,
            begin_time: join.begin_time,
            end_time: join.end_time,
            is_discount: join.is_discount,
            combine: join.combine,
            title: join.title,
            kids_stand_low: join.kids_stand_low,
            kids_stand_high: join.kids_stand_high,
            selectCombine: this.state.combine,
            longday: join.longday,
            begin_date: join.begin_date,
            end_date: join.end_date
        }
        initJoin(data)
    }

    clickItemCombine(index) {
        let combineData = this.state.combine;
        let cData = this.props.join.combine;
        if(combineData.length === 0) {
            combineData[index]=cData[index].combine_id;
            this.setState({
                isEnjoy: true
            })
        }else{
            console.log(index)
            if(combineData.indexOf(cData[index].combine_id) > -1) {
                combineData.splice(index, 1)
            }else{
                combineData[index]=cData[index].combine_id
            }
        }
        this.setState({
            combine: combineData
        },() => {
            if(this.state.combine.length===0) {
                this.setState({
                    isEnjoy: false
                })
            }
            const {join, initJoin} = this.props;
            let data = {
                activity_id: join.activity_id,
                slot_id: join.slot_id,
                person: join.person,
                house: join.house,
                houseid:join.houseid,
                adult_price_origin: join.adult_price_origin,
                adult_price:join.adult_price,
                kids_price_origin: join.kids_price_origin,
                kids_price: join.kids_price,
                age_limit: '',
                date: join.date,
                begin_time: join.begin_time,
                end_time: join.end_time,
                is_discount: join.is_discount,
                combine: join.combine,
                title: join.title,
                kids_stand_low: join.kids_stand_low,
                kids_stand_high: join.kids_stand_high,
                selectCombine: this.state.combine,
                longday: join.longday,
                begin_date: join.begin_date,
                end_date: join.end_date
            }
            initJoin(data)
        })
    }
     render() {
         const {user, join} = this.props;
         const {combine, isEnjoy} = this.state;
         let combinePrice = 0;
         // if(this.state.combine.length>0) {
         //     for(let j=0;j<this.state.combine.length;j++){
         //         combinePrice += parseFloat(join.combine[this.state.combine[j]].price)
         //     }
         // }
         for(let i=0;i<join.combine.length;i++) {
             for(let j=0;j<this.state.combine.length;j++) {
                 if(join.combine[i].combine_id === this.state.combine[j]) {
                     combinePrice += parseFloat(join.combine[i].price)
                 }
             }
         }
         let housePrice = 0;
         if(join.houseid.length>0) {
             for(let i=0;i<join.houseid.length;i++) {
                 housePrice += parseFloat(join.houseid[i].price)*join.houseid[i].choiceNum
             }
         }
         let personPrice = 0;
         for(let i=0;i<join.person.length; i++) {
             if(join.is_discount) {
                 if(join.person[i].type===1) {
                     personPrice+=parseFloat(join.adult_price)
                 }else{
                     personPrice+=parseFloat(join.kids_price)
                 }
             }else{
                 if(join.person[i].type===1) {
                     personPrice+=parseFloat(join.adult_price_origin)
                 }else{
                     personPrice+=parseFloat(join.kids_price_origin)
                 }
             }
         }
         let combinePerson = 0;
         for(let i=0;i<join.combine.length;i++) {
             for(let j=0;j<this.state.combine.length;j++) {
                 if(join.combine[i].combine_id === this.state.combine[j]) {
                     combinePerson += (join.combine[i].adult+join.combine[i].kids)
                     continue
                 }
             }
         }
         return(
             <View style={{flex: 1,position:'relative'}}>
                 <RNEasyTopNavBar
                     title={'确认游客/套餐/住宿'}
                     backgroundTheme={'#fff'}
                     titleColor={'#333'}
                     leftButton={this.getLeftButton()}
                 />
                 <ScrollView>
                     <View style={[CommonStyle.flexCenter,{
                         width: width
                     }]}>
                         {/*套餐*/}
                         {
                             join&&join.combine&&join.combine.length>0
                             ?
                                 <View style={{width: width}}>
                                     <View style={[CommonStyle.flexStart,{
                                         height: 40,
                                         paddingLeft: width*0.03,
                                         width: width
                                     }]}>
                                         <Text style={{
                                             color:'#999',
                                             fontSize: 12
                                         }}>套餐可叠加</Text>
                                     </View>
                                     <View style={{
                                         paddingTop: 24.5,
                                         paddingBottom: 24.5,
                                         paddingLeft: width*0.03,
                                         paddingRight: width*0.03,
                                         backgroundColor: '#fff',
                                     }}>
                                         <Text style={{
                                             color:'#333',
                                             fontSize: 15,
                                             fontWeight: 'bold'
                                         }}>
                                             亲子价套餐
                                         </Text>
                                         <View style={{marginTop: 5}}>
                                             {
                                                 join.combine.map((item, index) => {
                                                     return <View key={index}>
                                                         {
                                                             item.type === 1
                                                                 ?
                                                                 <TouchableOpacity  style={[CommonStyle.spaceRow,{
                                                                     height: 40,
                                                                     backgroundColor:combine.indexOf(item.combine_id)>-1?'#eafeff':'#f5f7fa',
                                                                     width: 250,
                                                                     marginTop: 10
                                                                 }]}
                                                                 onPress={()=>{
                                                                     this.clickItemCombine(index)
                                                                 }}
                                                                 >
                                                                     <Text style={{
                                                                         marginLeft: 15.5,
                                                                         fontSize: 13,
                                                                         color: combine.indexOf(item.combine_id)>-1?this.props.theme:'#333'
                                                                     }}>亲子{item.adult}成人{item.kids}儿童</Text>
                                                                     <Text style={{
                                                                         color:this.props.theme,
                                                                         fontSize: 13,
                                                                         marginRight: 20
                                                                     }}>¥{parseFloat(item.price)}</Text>
                                                                 </TouchableOpacity>
                                                                 :
                                                                 null
                                                         }
                                                     </View>
                                                 })
                                             }
                                         </View>
                                         <Text style={{
                                             color:'#333',
                                             fontSize: 15,
                                             fontWeight: 'bold',
                                             marginTop: 24
                                         }}>
                                             综合套餐
                                         </Text>
                                         <View style={{marginTop: 5}}>
                                             {
                                                 join.combine.map((item, index) => {
                                                     return <View key={index}>
                                                         {
                                                             item.type === 2
                                                                 ?
                                                                 <TouchableOpacity  style={[CommonStyle.spaceRow,{
                                                                     height: 40,
                                                                     backgroundColor:combine.indexOf(item.combine_id)>-1?'#eafeff':'#f5f7fa',
                                                                     width: 250,
                                                                     marginTop: 10
                                                                 }]}
                                                                 onPress={()=>{
                                                                     this.clickItemCombine(index)
                                                                 }}
                                                                 >
                                                                     <Text style={{
                                                                         marginLeft: 15.5,
                                                                         fontSize: 13,
                                                                         color: combine.indexOf(item.combine_id)>-1?this.props.theme:'#333'
                                                                     }}>{item.name}{item.adult}人</Text>
                                                                     <Text style={{
                                                                         color:this.props.theme,
                                                                         fontSize: 13,
                                                                         marginRight: 20
                                                                     }}>¥{parseFloat(item.price)}</Text>
                                                                 </TouchableOpacity>
                                                                 :
                                                                 null
                                                         }
                                                     </View>
                                                 })
                                             }
                                         </View>

                                     </View>
                                 </View>
                             :
                                null
                         }
                         {
                             this.state.combine.length>0
                             ?
                                 <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                     marginTop: 20,
                                     marginBottom: 10
                                 }]}>
                                     <Text style={{color:'#333'}}>
                                         <Text style={{color:'red'}}>*</Text>
                                         我是否享受套餐?
                                     </Text>
                                     <View style={CommonStyle.flexStart}>
                                         <TouchableOpacity
                                             style={CommonStyle.flexStart}
                                             onPress={()=>{
                                                 this.setState({
                                                     isEnjoy: true
                                                 })
                                             }}
                                         >
                                            <Text style={{color:isEnjoy?this.props.theme:'#333'}}>是</Text>
                                             <View style={[CommonStyle.flexCenter,{
                                                 width: 15,
                                                 height: 15,
                                                 borderWidth: isEnjoy?0:1,
                                                 borderColor: '#999',
                                                 borderRadius: 3,
                                                 marginLeft: 3,
                                                 backgroundColor:isEnjoy?this.props.theme:'#fff'
                                             }]}>
                                                 {
                                                     isEnjoy
                                                     ?
                                                         <AntDesign
                                                            name={'check'}
                                                            size={14}
                                                            style={{color:'#fff'}}
                                                         />
                                                     :
                                                        null
                                                 }
                                             </View>
                                         </TouchableOpacity>
                                         <TouchableOpacity style={[CommonStyle.flexStart,{
                                             marginLeft: 20
                                         }]}
                                           onPress={()=>{
                                               this.setState({
                                                   isEnjoy: false
                                               })
                                           }}
                                         >
                                             <Text style={{color:!isEnjoy?this.props.theme:'#333'}}>否</Text>
                                             <View style={[CommonStyle.flexCenter,{
                                                 width: 15,
                                                 height: 15,
                                                 borderWidth: !isEnjoy?0:1,
                                                 borderColor: '#999',
                                                 borderRadius: 3,
                                                 marginLeft: 3,
                                                 backgroundColor:!isEnjoy?this.props.theme:'#fff'
                                             }]}>
                                                 {
                                                     !isEnjoy
                                                         ?
                                                         <AntDesign
                                                             name={'check'}
                                                             size={14}
                                                             style={{color:'#fff'}}
                                                         />
                                                         :
                                                         null
                                                 }
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                 </View>
                             :
                                null
                         }


                         {
                             join&&join.house&&join.house.length>0
                             ?
                                 <View style={{
                                     marginTop: 10,
                                     backgroundColor: '#fff'
                                 }}>
                                     <TouchableOpacity
                                         style={[CommonStyle.spaceRow,{
                                             height: 63,
                                             backgroundColor: '#fff',

                                             paddingLeft: width*0.03,
                                             paddingRight: width*0.03,
                                             width: width
                                         }]}
                                         onPress={() => {
                                             NavigatorUtils.goPage({}, 'House')
                                         }}
                                     >
                                         <Text style={{
                                             color:'#333',
                                             fontSize: 15,
                                             fontWeight: 'bold'
                                         }}>选择住宿</Text>
                                         <AntDesign
                                            name={'right'}
                                            size={14}
                                            style={{color:'#666'}}
                                         />
                                     </TouchableOpacity>
                                     {
                                         join.houseid&&join.houseid.length>0
                                         ?
                                             <View style={[CommonStyle.flexCenter]}>
                                                 {
                                                     join.houseid.map((item, index) => {
                                                         return <View key={index} style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                                                             marginTop: index===0?0:15,
                                                             marginBottom: index===join.houseid.length-1?25:0
                                                         }]}>
                                                             <LazyImage
                                                                 source={item.image&&item.image.length>0&&item.image[0].domain&&item.image[0].image_url?{
                                                                     uri:item.image[0].domain + item.image[0].image_url
                                                                 }:require('../../../../assets/images/error.png')}
                                                                 style={{
                                                                     width: 80,
                                                                     height:60,
                                                                     borderRadius: 4
                                                                 }}
                                                             />
                                                             <View style={[CommonStyle.spaceRow,{
                                                                 width: width*0.94-90,
                                                                 height: 60
                                                             }]}>
                                                                 <View style={[CommonStyle.spaceCol,{
                                                                     height:60,
                                                                     alignItems: 'flex-start'
                                                                 }]}>
                                                                     <Text style={{
                                                                         color:'#333',
                                                                         fontSize: 13
                                                                     }}>{item.flag===1?'露营':item.flag===2?'民宿':'酒店'}</Text>
                                                                     <Text style={{
                                                                         color:'#999',
                                                                         fontSize: 12
                                                                     }}>
                                                                         房数x{item.choiceNum}
                                                                     </Text>
                                                                 </View>
                                                                 <Text style={{
                                                                     color:this.props.theme,
                                                                     fontSize: 13
                                                                 }}>¥{parseFloat(item.price)}</Text>
                                                             </View>
                                                         </View>
                                                     })
                                                 }
                                             </View>
                                         :
                                            null
                                     }
                                 </View>
                             :
                                null
                         }
                         <View style={[CommonStyle.commonWidth,{
                             marginTop: 20,
                             marginBottom: 10
                         }]}>
                             {
                                 isEnjoy
                                 ?
                                     <Text style={{color:'#333'}}>
                                         还可以邀请{parseFloat(this.max_person_num)-parseFloat(this.order_person_num) - parseFloat(combinePerson) - parseFloat(join.person.length)}位游客
                                     </Text>
                                 :
                                     parseFloat(this.max_person_num)-parseFloat(this.order_person_num)-parseFloat(combinePerson)- parseFloat(join.person.length)-1>=0
                                     ?
                                     <Text style={{color:'#333'}}>
                                         还可以邀请{parseFloat(this.max_person_num)-parseFloat(this.order_person_num)-parseFloat(combinePerson)- parseFloat(join.person.length)-1}位游客
                                     </Text>
                                     :
                                         <Text style={{color:'#ff5673'}}>
                                             当前人数已经超过该体验的人数限制，请去除多余人数
                                         </Text>
                             }

                         </View>


                         {
                             join&&join.person&&join.person.length>0
                             ?
                                 <View style={{width: width,marginBottom: 100}}>
                                     <View style={{
                                         marginTop: 10,
                                         paddingTop: 24.5,
                                         paddingBottom: 24.5,
                                         paddingLeft: width*0.03,
                                         paddingRight: width*0.03,
                                         backgroundColor: '#fff'
                                     }}>
                                         <Text style={{
                                             color:'#333',
                                             fontWeight: 'bold',
                                             fontSize: 15
                                         }}>
                                             除套餐外，已添加{join&&join.person?join.person.length:''}位游客
                                         </Text>
                                         <Text style={{
                                             color: '#999',
                                             fontSize: 12,
                                             marginTop: 15
                                         }}>
                                             为保证您的安全以及策划人的统计，请务必填写真实信息
                                         </Text>
                                         <View style={{
                                             marginTop: 15
                                         }}>
                                             <Text style={{
                                                 color:'#333',
                                                 fontSize: 13
                                             }}>
                                                 标准
                                                 {join.is_discount?' ¥'+join.adult_price+'/人':' ¥'+join.adult_price_origin+'/人'}
                                                 {join.is_discount?' 原价:'+join.adult_price_origin:null}
                                             </Text>
                                             <Text style={{
                                                 color:'#333',
                                                 marginTop: 10,
                                                 fontSize: 13
                                             }}>
                                                 儿童
                                                 {join.is_discount?' ¥'+join.kids_price+'/人':' ¥'+join.kids_price_origin+'/人'}
                                                 {join.is_discount?' 原价:'+join.kids_price_origin:null}
                                             </Text>
                                         </View>

                                         {
                                             join&&join.person&&join.person.length>0
                                                 ?
                                                 join.person.map((item, index) => {
                                                     return <View key={index} style={[CommonStyle.spaceRow,{
                                                         height: 40,
                                                         paddingLeft: 15.5,
                                                         paddingRight: 15.5,
                                                         backgroundColor: '#f5f5f5',
                                                         marginTop: index===0?15:10
                                                     }]}>
                                                         <View style={CommonStyle.flexStart}>
                                                             <Text numberOfLines={2} ellipsizeMode={'tail'}
                                                                   style={{
                                                                       color:'#333',
                                                                       maxWidth: 180
                                                                   }}>{item.name}</Text>
                                                             <Text numberOfLines={2} ellipsizeMode={'tail'}
                                                                   style={{
                                                                       color:'#333',
                                                                       marginLeft: 10,
                                                                       maxWidth: 180
                                                                   }}>{item.tel?item.tel:''}</Text>
                                                             <Text style={{
                                                                 color:this.props.theme,
                                                                 marginLeft: 10
                                                             }}>{item.type===1?'标准':'儿童'}</Text>
                                                         </View>
                                                         <View style={CommonStyle.flexStart}>
                                                             <Text style={{
                                                                 color:'#666',
                                                                 marginRight: 15
                                                             }}
                                                                   onPress={() => {
                                                                       this.editVisitor(index)
                                                                   }}
                                                             >编辑</Text>
                                                             <Text style={{
                                                                 color:'#666'
                                                             }}
                                                                   onPress={() => {
                                                                       this.delVisitor(index)
                                                                   }}
                                                             >删除</Text>
                                                         </View>
                                                     </View>
                                                 })
                                                 :
                                                 null
                                         }
                                         {
                                             isEnjoy
                                             ?
                                                 (parseFloat(this.order_person_num) + parseFloat(combinePerson) + parseFloat(join.person.length)) >= parseFloat(this.max_person_num)
                                                 ?
                                                    null
                                                 :
                                                     <TouchableOpacity style={[CommonStyle.flexCenter,CommonStyle.commonWidth,{
                                                         height: 40,
                                                         marginTop: 25,
                                                         backgroundColor: this.props.theme,
                                                         borderRadius: 6,
                                                     }]}
                                                       onPress={() => {
                                                           NavigatorUtils.goPage({}, 'AddVistitors')
                                                       }}
                                                     >
                                                         <Text style={{color:'#fff'}}>
                                                             {join&&join.person.length>0?'继续添加':'添加'}
                                                         </Text>
                                                     </TouchableOpacity>
                                            :
                                                 (parseFloat(this.order_person_num) + parseFloat(combinePerson) + parseFloat(join.person.length) + 1) >= parseFloat(this.max_person_num)
                                                     ?
                                                     null
                                                     :
                                                     <TouchableOpacity style={[CommonStyle.flexCenter,CommonStyle.commonWidth,{
                                                         height: 40,
                                                         marginTop: 25,
                                                         backgroundColor: this.props.theme,
                                                         borderRadius: 6,
                                                     }]}
                                                           onPress={() => {
                                                               NavigatorUtils.goPage({}, 'AddVistitors')
                                                           }}
                                                     >
                                                         <Text style={{color:'#fff'}}>
                                                             {join&&join.person.length>0?'继续添加':'添加'}
                                                         </Text>
                                                     </TouchableOpacity>
                                         }

                                     </View>


                                 </View>
                             :
                                <TouchableOpacity style={[CommonStyle.spaceRow,{
                                    height: 63,
                                    backgroundColor: '#fff',
                                    marginTop: 10,
                                    paddingLeft: width*0.03,
                                    paddingRight: width*0.03,
                                    width: width,
                                    marginBottom: 100
                                }]}>
                                    <Text style={{
                                        color:'#333',
                                        fontSize: 15,
                                        fontWeight: 'bold'
                                    }}>添加游客</Text>
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        width:50,
                                        height:27,
                                        borderRadius: 13.5,
                                        backgroundColor: '#ecfeff'
                                    }]}
                                      onPress={() => {
                                          NavigatorUtils.goPage({}, 'AddVistitors')
                                      }}
                                    >
                                        <Text style={{
                                            color: this.props.theme
                                        }}>添加</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                         }
                     </View>
                 </ScrollView>
                <SafeAreaView style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f5f5f5',
                }}>
                    <View style={[CommonStyle.flexCenter,{
                        height: 60
                    }]}>
                        <View style={[CommonStyle.commonWidth,CommonStyle.spaceRow,{
                            height: 40
                        }]}>
                            <Text style={{
                                color:'#333',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }}>
                                总额:
                                {
                                    isEnjoy
                                    ?
                                        <Text>¥{combinePrice+housePrice+personPrice}</Text>
                                    :
                                        <Text>¥{combinePrice+housePrice+personPrice+(join.is_discount?parseFloat(join.adult_price):parseFloat(join.adult_price_origin))}</Text>
                                }

                            </Text>
                            {
                                !isEnjoy && parseFloat(this.max_person_num)-parseFloat(this.order_person_num)-parseFloat(combinePerson)- parseFloat(join.person.length)-1<0
                                ?
                                    <View style={[CommonStyle.flexCenter,{
                                        height:40,
                                        width:120,
                                        borderRadius: 6,
                                        backgroundColor: '#ff5673'
                                    }]}
                                    >
                                        <Text style={{color:'#fff'}}>人数超限</Text>
                                    </View>
                                :
                                    <TouchableOpacity style={[CommonStyle.flexCenter,{
                                        height:40,
                                        width:120,
                                        borderRadius: 6,
                                        backgroundColor: this.props.theme
                                    }]}
                                      onPress={()=>{
                                          NavigatorUtils.goPage({isEnjoy: isEnjoy},'OrderPay')
                                      }}
                                    >
                                        <Text style={{color:'#fff'}}>去支付</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                    </View>
                </SafeAreaView>
             </View>
         )
     }
}
const mapStateToProps = state => ({
    user:state.user.user,
    theme: state.theme.theme,
    join: state.join.join,
});
const mapDispatchToProps = dispatch => ({
    initJoin: join => dispatch(action.initJoin(join))
});
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVisitors)

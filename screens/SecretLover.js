import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity,Alert } from 'react-native';
// import React,{useEffect} from 'react';
import { Icon } from 'native-base';
import { Shadow } from 'react-native-neomorph-shadows';
import AutoHeightImage from 'react-native-auto-height-image';
 import React, { Component } from 'react';
 import AsyncStorage from '@react-native-community/async-storage';

 

 
 export default class SecretLover extends Component {

    constructor(props) {
    super(props);
    this.state = {
        Feeling:[],
       isplanActive:false
        


    }


    }

    componentDidMount() {
        
    }

    
    checkPayment() {
        // this.props.navigation.navigate('Congrats');
    
        // this.setState({
        //   showLoader: true,
        // });
        // console.log('RegistrationCheck API: ' + host + 'RegistrationCheck' + params);
        // fetch('http://43.204.13.143/tieheart/WebService.asmx/RegistrationCheck' + params, {
        //   method: 'GET',
        // })
        //   .then((response) => response.json())
        //   .then((responseJson) => {
    
        //     console.log('RegistrationCheck API Response: ' + responseJson[0].paymentstatus + 'xjhxjhjjh' );
    
           
        //     if (responseJson[0].Mobile == undefined) {
            
        //     }
        //      else {
        //       console.log('PaymentStatus: ' + responseJson[0].PaymentExpiryDate);
        //       if (responseJson[0].paymentstatus == '' || responseJson[0].paymentstatus == null) {
        //         console.log("Response PaymentStatus"+responseJson[0].paymentstatus,'sjdhsdjhsdjs',responseJson[0].paymentstatus,'sjdhsdjsh' )
        //         if (navName == 'Premium') {
        //           this.setState({ showPremiumDialog: true });
        //         } else {
        //           this.props.navigation.navigate('Premium', { isPlanActive: false, totalLikeLove: this.state.totalLikeLove, });
        //         }
        //       }
        //        if(responseJson[0].plan_start_date !== null) {
        //         var timestamp_curr = responseJson[0].plan_start_date.slice(6, -10);
        //         var currentDate = moment(timestamp_curr * 1000).format('YYYY-MM-DD');
        //         var expiryDate = responseJson[0].PaymentExpiryDate.split('/');
        //         var expiryDateFormatted = expiryDate[2] + '-' + expiryDate[0] + '-' + expiryDate[1];
        //         var expiryDate_var = moment(expiryDateFormatted);
        //         var currentDate_var = moment(currentDate);
    
        //         console.log('Current Date: ' + currentDate);
        //         console.log('Expiry Date: ' + expiryDateFormatted);
    
        //         if (currentDate_var <= expiryDate_var) {
        //           console.log('plan is active');
        //           if (navName == 'Congrats') {
        //             this.props.navigation.navigate('Congrats',);
        //           } else {
        //             this.props.navigation.navigate('Congrats', 
        //             { isPlanActive: true, totalLikeLove: this.state.totalLikeLove, current:currentDate_var, expiredate:expiryDate_var });
        //           }
        //         } else {
        //           console.log('plan is expired');
        //           if (navName == 'Premium') {
        //             this.setState({ showPremiumDialog: true });
        //           } else {
        //             this.props.navigation.navigate('Premium', { isPlanActive: false, totalLikeLove: this.state.totalLikeLove });
        //           }
        //         }
        //       }
        //      }
        //   })
        var params = '?mobile=' + _mobile;

        fetch('http://43.204.13.143/tieheart/WebService.asmx/getactiveplan' + params , {
            method:'GET'
        })
        .then((response) => response.text() )
        .then((responseJson) => {
            var par = JSON.parse(responseJson)
            console.log(par[0].IsActive, 'plan is active ')
        //     this.setState({
        //         isplanActive:par[0].IsActive
        //     })
        //    console.log(this.isplanActive,'hsdjshdgsjdhsjdhjh')
        if (par[0].IsActive == true) {
            this.props.navigation.navigate('Congrats')
        } else {
           this.props.navigation.navigate('Premium')
            
        }
        })

         
      }

   
   render() {
    var { navigation } = this.props; 
    var activeplan = navigation.getParam('isPlanActive')
    var user_name = navigation.getParam('feeling');  
    var result = user_name.map(function(a) {return a.Feeling;});
    
     console.log(result[0],'jghghfhgffg',activeplan)
     return (
        <View style={styles.container} >
        <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}  >
            <View style={styles.main}>
                <View>
                    <Icon
                        type="AntDesign"
                        name="left"
                        style={styles.back}
                        onPress={() => navigation.goBack()}
                    />
                </View>
                <View style={styles.topSection}>
                    <Text style={styles.heading}>Know about this secret lover </Text>
                </View>

            </View>
            <View style={styles.triangleDown}></View>
            <View style={styles.boxes}>
                <Shadow style={styles.box1}
                 inner
                 useArt
                >
                    {_gender == 'Male' ? (
                     <View>
                      <Icon
                        type="Foundation"
                        name="male"
                        fontSize={28}
                        style={{ color: '#13BF43' }}
                        onPress={() => alert('hello')}/>
                        <Text>Male</Text>
                     </View>
                        
                      ) : (
                          <View style={{justifyContent:'center', alignItems:'center'}}>
                          <Icon
                        type="Foundation"
                        name="female"
                        fontSize={28}
                        style={{ color: '#13BF43',  }}
                        onPress={() => alert('hello')}/>
                        <Text style={{color:'#FFFFFF'}}>female</Text>
                          </View>
                       
                      )}
                
                </Shadow>
                <Shadow style={styles.box1}
                 inner
                 useArt
                >
                   {/* {user_name.map((item, key) => ( */}
                      <View
                        // style={
                        //   item.crushdelete ? css.chatItemRejected : css.chatItem
                        // }
                        // key={key}
                        >
                       
                         
                        {result == 'Love' ? (
                            <View>

                          <Icon
                            type="Ionicons"
                            name="ios-heart"
                            style={[styles.chatItemInfo, styles.itemLove]}
                          />
                    <Text style={{color:'#FFFFFF'}}>{result[0]}</Text>
                        
                         </View>
                          
                        ) : (
                            <View style={{justifyContent:'center', alignItems:'center'}}>

                          <Icon
                            type="Ionicons"
                            name="ios-heart"
                            style={[styles.chatItemInfo, styles.itemLike]}
                          />
                         <Text style={{color:'#FFFFFF'}}>{result[0]}</Text>
                         
                          </View>
                        )}
                      

                      </View>
                    {/* ))} */}
                    {/* <Text style={{ fontWeight: '500', fontFamily: 'Manrope', fontSize: 18, lineHeight: 24.59, color: '#13BF43' }}>Likes You</Text> */}
                </Shadow>
            </View>

            <Shadow style={styles.secretChat}
             inner
             useArt
            >
                <Text style={styles.secretChatText}>Secret Chat </Text>
                <Text style={{ fontSize: 30, color: '#FFFFFF' }}>+</Text>
                <Text style={styles.secretChatText}>Ask to reveal Identity</Text>
            </Shadow>

            <View style={styles.arrow}>

                <Image source={require('../assets/images/Mask.png')} style={{ width: 120, height: 60, }} />
                <Icon
                    type="AntDesign"
                    name="arrowdown"
                    fontSize={25}
                    style={{ color: '#FFFFFF', top: -5 }}
                    
                />
            </View>
            
            <TouchableOpacity style={styles.lock}
             onPress={() => this.checkPayment()}
            >
                <View style={styles.circle} onPress={() => this.checkPayment()} >
                    <Icon
                        type="EvilIcons"
                        name="lock"
                        style={{ color: '#FFFFFF', }}
                    />
                </View>
            </TouchableOpacity>
        </ImageBackground>
    </View>
     )
   }
 }




const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1A31'
    },
    bg: {
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    topSection: {
        width: 315,
        height: 73,
        top: 59,
        left: 10,
        borderRadius: 10,
        backgroundColor: '#1F1A31',
        justifyContent: 'center',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    heading: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 22.5,
        left: 20,
        fontFamily: 'Quicksand'
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

    },
    back: {
        color: '#FFFFFF',
        top: 40,
        width: 26,
        height: 23.88,

    },
    triangleDown: {
        transform: [{ rotate: "180deg" }],
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 26,
        borderRightWidth: 26,
        borderBottomWidth: 35,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#1F1A31",
        top: 45,
        right: 80,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 16,

    },
    boxes: {
        flexDirection: 'row',
        top: 140,
        justifyContent: 'space-evenly',
        width: '100%',
        height: 100,


    },
    box1: {
        shadowOpacity: 0.25,
        shadowColor: colorBlack30,
        shadowRadius: 10,
        backgroundColor: '#1F1A31',
        width: 127,
        height: 93,
        justifyContent: 'center',
        alignItems: 'center'
    },

    secretChat: {
        borderRadius:14,
        top: 200,
        left: 10,
        shadowOpacity: 0.25,
        shadowColor: colorBlack30,
        shadowRadius: 10,
        backgroundColor: '#1F1A31',
        width: 309,
        height: 143,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:10
    },
    secretChatText: {
        fontFamily: 'Manrope',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 24.59,
        color: '#FFFFFF',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    arrow: {
        top: 210,
        width: "100%",
        height: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#1F1A31'
    },
    lock: {
        top: 220,
        borderRadius: 30,
        backgroundColor: '#07F83C',
        width: 250,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circle: {
        height: 35,
        width: 35,
        backgroundColor:'#1F1A31',
        borderWidth: 1,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',

    },
    itemLike:{
    color:'red'
    },
    itemLove:{
        color:'#2196F3'
    },
    chatItemInfo:{
        // position:'absolute',
        // top:26,
        // right:15,
        fontSize:30
    }

})
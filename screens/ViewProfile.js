import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Linking,
  ImageBackground,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import styles from '../Style';
import { Shadow } from 'react-native-neomorph-shadows';
import AsyncStorage from '@react-native-community/async-storage';


 Data = [
  {
    id: 1,
    msg: 'I am in love',
    displaytype: require('../assets/images/emoji.png'),
  },
  {
    id: 2,
    msg: 'I am sad',
    displaytype: require('../assets/images/113.png')

  },
  {
    id: 3,
    msg: 'I am laughing',
    displaytype: require('../assets/images/114.png')
  },
  {
    id: 4,
    msg: 'I am angry',
    displaytype: require('../assets/images/001.png')
  },
  {
    id: 5,
    msg: 'I am in Love',
    displaytype: require('../assets/images/115.png'),

  },
  {
    id: 6,
    msg: "I am cool",
    displaytype: require('../assets/images/116.png'),

  },
  {
    id: 7,
    msg: "I am crying",
    displaytype: require('../assets/images/117.png'),

  },
  {
    id: 8,
    msg: 'I am not feeling well',
    displaytype: require('../assets/images/118.png'),

  },
  {
    id: 9,
    msg: "I am surprised",
    displaytype: require('../assets/images/119.png'),

  },
  {
    id: 10,
    msg: 'I feel sleepy',
    displaytype: require('../assets/images/211.png'),

  },
  {
    id: 11,
    msg: 'I want your kiss',
    displaytype: require('../assets/images/212.png'),

  },
  {
    id: 12,
    msg: "Thinking about you",
    displaytype: require('../assets/images/112.png'),

  },
  {
    id: 13,
    msg: "I am listening to Music",
    displaytype: require('../assets/images/213.png'),

  },
  {
    id: 14,
    msg: "I am Nervous",
    displaytype: require('../assets/images/214.png'),

  },
  {
    id: 15,
    msg: "I am Confused",
    displaytype: require('../assets/images/215.png'),

  },
  {
    id: 16,
    msg: "I am Calm",
    displaytype: require('../assets/images/216.png'),

  },
];


export default class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      crushMobile: props.navigation.state.params.crushMobile,
      crushName: null,
      crushNickname: null,
      crushEmail: null,
      crushGender: null,
      crushStatus: null,
      crushAbout: null,
      crushPhoto: null,
      isCrushPhoto: false,
      emoji:'',
      setData:'',
      setUserId:'',
      photoPlaceholder: require('../assets/images/noimg_other.png'),
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('ViewProfileResume');
      console.log('CrushMobile: ' + this.state.crushMobile);
      this.getProfile();
    });
  }

   getuser = async () => {
    try{  
      let user = await AsyncStorage.getItem('myId');  
      // let parsed2 = JSON.parse(user);  
      this.setState.setUserId(user)
      // console.warn( 'user form useerinfo ', user);  
    }  
    catch(error){  
      alert(error)  
    } 
  }
 
  

    img = require('../assets/images/emoji.png');

   params = '?mobile=' + this.setUserId + '&mood=' + this.emoji;



  componentDidMount() {
  
    
    fetch('http://43.204.13.143/tieheart/WebService.asmx/UpdateMood' + this.params ,   {
      method: 'GET',
     
      
    })
      .then((response) => response.json())
      .then((responseJson) => {
         
         let result = responseJson[0].mood
        // console.warn('Mood API Response userinfo: ' + result);
       

         this.setState.emoji(result)
         
      })
      .catch((error) => {
        // Alert.alert('Error', error.message);
        // console.log('Mood API Error: ' + error.message);
       
      });

      if ( this.state.emoji == '') {
        this.setState({
          setData:require('../assets/images/113.png')
        })
      }
        
       else if(this.state.emoji == 1) {
       
        this.setState({
          setData:require('../assets/images/emoji.png')
        })
      }
      else if(this.state.emoji == 2) {
       
        this.setState({
          setData:require('../assets/images/113.png')
        })
      }
      else if(this.state.emoji == 3) {
       
        this.setState({
          setData:require('../assets/images/114.png')
        })
      }
      else if(this.state.emoji == 4) {
       
        this.setState({
          setData:require('../assets/images/001.png')
        })
      }
      else if(this.state.emoji == 5) {
       
        this.setState({
          setData:require('../assets/images/115.png')
        })
      }
      else if(this.state.emoji == 6) {
       
        this.setState({
          setData:require('../assets/images/116.png')
        })
      }
      else if(this.state.emoji == 7) {
       
        this.setState({
          setData:require('../assets/images/117.png')
        })
      }
      else if(this.state.emoji == 8) {
       
        this.setState({
          setData:require('../assets/images/118.png')
        })
      }

      else if(this.state.emoji == 9) {
       
        this.setState({
          setData:require('../assets/images/119.png')
        })
      }
      else if(this.state.emoji == 10) {
       
        this.setState({
          setData:require('../assets/images/211.png')
        })
      }
      else if(this.state.emoji == 11) {
       
        this.setState({
          setData:require('../assets/images/212.png')
        })
      }
      else if(this.state.emoji == 12) {
       
        this.setState({
          setData:require('../assets/images/112.png')
        })
      }
      else if(this.state.emoji == 13) {
       
        this.setState({
          setData:require('../assets/images/213.png')
        })
      }
      else if(this.state.emoji == 14) {
       
        this.setState({
          setData:require('../assets/images/214.png')
        })
      }
      else if(this.state.emoji == 15) {
       
        this.setState({
          setData:require('../assets/images/215.png')
        })
      }
      else if(this.state.emoji == 16) {
       
        this.setState({
          setData:require('../assets/images/216.png')
        })
      }
      //  else if(this.state.emoji == 2) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
       
      // }
      // else if(this.state.emoji == 3) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      // }
      // else if(this.state.emoji  == 4) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      // }
      // else if(this.state.emoji == 5) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      //  }
      //  else if(this.state.emoji == 6) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      //  }
      //  else if(this.state.emoji == 7) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      //  }
      //  else if(this.state.emoji== 8) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      //  }
      //  else if(this.state.emoji == 9) {
      //   this.setState.setData(require('../assets/images/emoji.png'))
      //  }
      // else{
      //   this.setState.setData(require('../assets/images/emoji.png'))

      // }
    
   
  
  }

   
 

  getProfile() {
    this.setState({
      showLoader: true,
    });
    var params = '?crushnumber=' + this.state.crushMobile;
    console.log('Profile API: ' + host + 'CrushNumberProfile' + params);
    fetch(host + 'CrushNumberProfile' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('Profile API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          if (responseJson[0].Gender == 'Male') {
            this.setState({
              photoPlaceholder: require('../assets/images/noimg_male.png'),
            });
          } else if (responseJson[0].Gender == 'Female') {
            this.setState({
              photoPlaceholder: require('../assets/images/noimg_female.png'),
            });
          } else {
            this.setState({
              photoPlaceholder: require('../assets/images/noimg_other.png'),
            });
          }

          if (this.notNull(responseJson[0].vcimage).length > 4) {
            this.setState({
              photoPlaceholder: { uri: host_photo + responseJson[0].vcimage },
              isCrushPhoto: true,
            });
          }

          this.setState({
            crushName: responseJson[0].name,
            crushNickname: responseJson[0].nickname,
            crushEmail: responseJson[0].Emailid,
            crushGender: responseJson[0].Gender,
            crushStatus: responseJson[0].R_Status,
            crushAbout: responseJson[0].aboutme,
            crushPhoto: responseJson[0].vcimage,
          });
        } else {
          this.setState({
            showLoader: true,
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to establish connection.');
      });
  }

  dialNumber(mobile) {
    Linking.openURL(`tel:${mobile}`);
  }

  sendSMS(mobile) {
    Linking.openURL(`sms:${mobile}`);
  }

  notNull(val) {
    if (val == null) {
      return '';
    } else {
      return val;
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[colorPrimary, colorSecondary]}
          style={{ height: statusBarHeight }}>
          <StatusBar
            barStyle="light-content"
            translucent={true}
            backgroundColor={'transparent'}
          />
        </LinearGradient>



        <View style={css.mainWrap}>
          <ImageBackground
            source={require('../assets/images/bg.jpg')}
            style={css.bg}>



            <ScrollView bounces={false}>
              <View style={{ width: "90%", alignItems: "center", marginTop:60}}>
                <Image
                  source={this.state.photoPlaceholder}
                  style={!this.state.isCrushPhoto ? css.noPhoto : css.hasPhoto}
                />
                <View style={{
                  width: 80,
                  height: 65,
                  position: 'absolute',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
                }}>
                  <Image style={{ width: 22, height: 22, left: 8, top: 10 }}
                    source={  this.state.setData}
                  />
                </View>
                {this.state.crushName != null && this.state.crushName != '' ? (
                  <View style={css.infoRowProfile}>
                    <Text style={css.profileName}>{this.state.crushName}</Text>
                   
                  </View>
                ) : null}
              </View>
              <View style={css.infoWrap}>
              <Shadow
                        inner // <- enable inner shadow
                        useArt // <- set this prop to use non-native shadow on ios
                        style={{

                            shadowOpacity: 0.25,
                            shadowColor: 'rgba(102, 84, 84, 0.25)',
                            shadowRadius: 15,
                            backgroundColor: '#1F1A31',
                            width: 311,
                            height: 444,
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            borderRadius: 20,
                            marginVertical:20,
                            marginHorizontal:20,
                           

                            

                        }}

                    >
                <View style={css.infoRow}>
                  <Text style={css.infoLabel}>Phone No.</Text>
                  <Text style={css.infoValue}>{this.state.crushMobile}</Text>
                  <View style={css.actionRow}>
                    <TouchableOpacity
                      onPress={() => this.dialNumber(this.state.crushMobile)}>
                      <Icon type="Ionicons" name="call" style={css.actionIcon} />
                    </TouchableOpacity>
                    <Text style={css.actionDivider}></Text>
                    <TouchableOpacity
                      onPress={() => this.sendSMS(this.state.crushMobile)}>
                      <Icon
                        type="Ionicons"
                        name="chatbubble-sharp"
                        style={css.actionIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.crushEmail != null && this.state.crushEmail != '' ? (
                  <View style={css.infoRow}>
                    <Text style={css.infoLabel}>Email</Text>
                    <Text style={css.infoValue}>{this.state.crushEmail}</Text>
                  </View>
                ) : null}
                {this.state.crushGender != null && this.state.crushEmail != '' ? (
                  <View style={css.infoRow}>
                    <Text style={css.infoLabel}>Gender</Text>
                    <Text style={css.infoValue}>{this.state.crushGender}</Text>
                  </View>
                ) : null}
                {this.state.crushStatus != null &&
                  this.state.crushStatus != '' ? (
                  <View style={css.infoRow}>
                    <Text style={css.infoLabel}>Relationship Status</Text>
                    <Text style={css.infoValue}>{this.state.crushStatus}</Text>
                  </View>
                ) : null}
                {this.state.crushAbout != null && this.state.crushAbout != '' ? (
                  <View style={css.infoRow}>
                    <Text style={css.infoLabel}>Bio</Text>
                    <Text style={css.infoValue}>{this.state.crushAbout}</Text>
                    {/* <Text style={css.infoValue}>{this.state.crushAbout}</Text> */}

                  </View>
                ) : null}

                </Shadow>
              </View>
            </ScrollView>
          </ImageBackground>
        </View>

        {this.state.showLoader ? (
          <View style={styles.loader}>
            <ActivityIndicator
              animating={true}
              color={colorAccent}
              size="large"
            />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

const css = StyleSheet.create({
  mainWrap: {
    width: '100%',
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  bg: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    // alignItems:'center'
  },
  infoRowProfile: {
    paddingVertical: 20,
    borderBottomColor: colorBlack10,
    borderBottomWidth: 1,
    marginBottom: 10,
    // borderColor: "red",
    // borderWidth: 2
  },
  profileName: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 20,
  },
  profileNickname: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colorBlack20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  infoWrap: {
    // backgroundColor: colorWhite,
    // borderTopColor: colorBlack10,
    // borderTopWidth: 1,
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    // top: -25,
    // borderColor:"red",
    // borderWidth:1
  },
  infoRow: {
    paddingVertical: 15,
    position: 'relative',
    borderBottomColor:"#A3A3A3",
    borderBottomWidth:1,
    marginVertical:22,
    marginHorizontal:22
    
  },
  infoLabel: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  infoValue: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 16,
    // borderColor: "pink",
    // borderWidth: 4
    // marginVertical:10
    // borderBottomColor:"red",
    // borderBottomWidth:1
  },
  actionRow: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    flexDirection: 'row',
  },
  actionDivider: {
    marginHorizontal: 15,
    fontSize: 20,
    color: colorWhite,
    lineHeight: 22,
  },
  actionIcon: {
    fontSize: 22,
    color: '#06d098',
  },
  noPhoto: {
    // marginVertical: 20,
   
    width: 72,
    height: 71,
    borderRadius: 5,
    alignSelf: 'center',
    // borderColor: "red",
    // borderWidth: 4
    
  },
  hasPhoto: {
    width: 72,
    height: 71,
    borderRadius: 5,
    position: 'relative',
    // justifyContent:"center"
    alignSelf:'center',
    // marginLeft: 50,



  },
  imoji: {
    width: 72,
    height: 71,
    // borderColor: "red",
    // borderWidth: 4
  }
});
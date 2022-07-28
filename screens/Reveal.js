import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Alert,
  ImageBackground,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AutoHeightImage from 'react-native-auto-height-image';
import RadialGradient from 'react-native-radial-gradient';
import { Icon } from 'native-base';
import styles from '../Style';
import AsyncStorage from '@react-native-community/async-storage';


export default class Reveal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: '0',
      tabTitle: 'Revealed',
      isRevealed: false,
      isUnrevealed: false,
      msgRevealed: 'Please wait..',
      msgUnrevealed: 'Please wait..',
      itemsRevealed: [],
      itemsUnrevealed: [],
      // totalLikeLove: props.navigation.state.params.totalLikeLove,
      // isPlanActive: props.navigation.state.getParams('isPlanActive')
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('Reveal Focused');
      console.log('Total Hearts: ' + this.state.totalLikeLove);
      console.log('Is Plan Active: ' + this.state.isPlanActive);
      this.getRevealedList();
      this.getUnrevealedList();
    });
  }

  PressedItem = (itemId, itemName) => {
    console.log('Pressed Item ID: ' + itemId);
    console.log('Pressed Item Name: ' + itemName);
    this.setState({ tabIndex: itemId, tabTitle: itemName });
  };


   

  getRevealedList() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile;
    console.log('RevealedList API: ' + host + 'UserCrushList' + params);
    fetch(host + 'UserCrushList' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('RevealedList API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              bigid: responseJson[i].bigid,
              Photo: responseJson[i].Photo,
              crushmobile: responseJson[i].crushmobile,
              name: responseJson[i].name,
              Feeling: responseJson[i].Feeling,
              crushtoken: responseJson[i].crushtoken,
              crushdelete: responseJson[i].crushdelete,
            });
          }
          this.setState({
            itemsRevealed: tempDataArray,
            isRevealed: true,
          });
        } else {
          this.setState({
            isRevealed: false,
            msgRevealed: 'No Record',
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to get records. Please try again.');
        this.setState({
          showLoader: false,
          isRevealed: false,
          msgRevealed: 'No Record',
        });
      });
  }

  getUnrevealedList() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile;
    console.log(
      'UnrevealedList API: ' + host + 'UserCrushListUnreveal' + params,
    );
    fetch(host + 'UserCrushListUnreveal' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('UnrevealedList API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              bigid: responseJson[i].bigid,
              Photo: responseJson[i].Photo,
              crushmobile: responseJson[i].crushmobile,
              name: responseJson[i].name,
              Feeling: responseJson[i].Feeling,
              crushtoken: responseJson[i].crushtoken,
            });
          }
          this.setState({
            itemsUnrevealed: tempDataArray,
            isUnrevealed: true,
          });
        } else {
          this.setState({
            isUnrevealed: false,
            msgUnrevealed: 'No New Love/Like to Reveal',
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to get records. Please try again.');
        this.setState({
          showLoader: false,
          isUnrevealed: false,
          msgUnrevealed: 'No Record',
        });
      });
  }

  rejectRequest(crushNumber) {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile + '&crushnumber=' + crushNumber;
    console.log('RejectRequest API: ' + host + 'UserCrushDelete' + params);
    fetch(host + 'UserCrushDelete' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('RejectRequest API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson == 'Y') {
          this.getRevealedList();
        } else {
          Alert.alert('Error', 'Unable to reject request. Please try again.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to reject request. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  acceptRequest(crushName, crushNumber, crushfeeling) {
    this.setState({
      showLoader: true,
    });
    var params =
      '?usernumber=' +
      _mobile +
      '&crushnumber=' +
      crushNumber +
      '&crushfeeling=' +
      crushfeeling +
      '&code=' +
      _countryCode;
    console.log('AcceptRequest API: ' + host + 'SaveCrushNumber' + params);
    fetch(host + 'SaveCrushNumber' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('AcceptRequest API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson == 'N') {
          this.showAcceptMsg(responseJson, crushNumber, crushName);
        } else if (responseJson == 'M') {
          this.sendCrushNotification(crushNumber);
          this.showAcceptMsg(responseJson, crushNumber, crushName);
        } else {
          Alert.alert('Error', 'Unable to accept request. Please try again.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to accept request. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  sendCrushNotification(crushNumber) {
    var params = '?UserSendNumber=' + crushNumber;
    console.log(
      'MatchNotificationSend API: ' + host + 'MatchNotificationSend' + params,
    );
    fetch(host + 'MatchNotificationSend' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('MatchNotificationSend API Response: ' + responseJson);
      })
      .catch((error) => {
        console.log(
          'MatchNotificationSend API Error: Unable to send crush match notification',
        );
      });
  }

  showAcceptMsg(msgType, crushNumber, crushName) {
    var msg = '';
    if (msgType == 'N') {
      msg =
        'We have successfully locked your feelings for ' + crushNumber + '.';
    } else if (msgType == 'M') {
      msg =
        'Its "TieHearts" with (' +
        crushName +
        '). You both have same feelings!';
    }
    Alert.alert(
      'Congratulations!',
      msg,
      [{ text: 'OK', onPress: () => this.getRevealedList() }],
      { cancelable: false },
    );
  }

 
  purchasePlan() {
    this.props.navigation.navigate('SecretLover', { 
      isPlanActive: this.state.isPlanActive,
      totalLikeLove: this.state.itemsUnrevealed.length,
      feeling:this.state.itemsUnrevealed,
     
    });
  }

  render() {
    
    return (
      // <SafeAreaView style={styles.safeArea}>
      //   <LinearGradient
      //     start={{x: 0, y: 0}}
      //     end={{x: 1, y: 0}}
      //     colors={[colorPrimary, colorSecondary]}
      //     style={{height: statusBarHeight}}>
      //     <StatusBar
      //       barStyle="light-content"
      //       translucent={true}
      //       backgroundColor={'transparent'}
      //     />
      //   </LinearGradient>
      //   <View style={styles.headerPrimary}>
      //     <View style={styles.headerLeft}>
      //       <TouchableOpacity
      //         style={styles.navBtn}
      //         onPress={() => this.props.navigation.goBack()}>
      //         <Icon
      //           type="Ionicons"
      //           name="ios-arrow-back"
      //           style={styles.navBtnIcon}
      //         />
      //       </TouchableOpacity>
      //     </View>
      //     <Text style={styles.headerTitle}>People Love/Like You</Text>
      //   </View>
      //   <View style={css.tabsWrap}>
      //     <TouchableOpacity
      //       activeOpacity={0.8}
      //       onPress={() => {
      //         this.PressedItem('0', 'Revealed');
      //       }}
      //       style={[
      //         css.tab,
      //         this.state.tabIndex == '0' ? css.tabActive : null,
      //       ]}>
      //       <Text style={css.tabTitle}>
      //         Revealed ({this.state.itemsRevealed.length})
      //       </Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       activeOpacity={0.8}
      //       onPress={() => {
      //         this.PressedItem('1', 'Unrevealed');
      //       }}
      //       style={[
      //         css.tab,
      //         this.state.tabIndex == '1' ? css.tabActive : null,
      //       ]}>
      //       <Text style={css.tabTitle}>
      //         Unrevealed ({this.state.itemsUnrevealed.length})
      //       </Text>
      //     </TouchableOpacity>
      //   </View>
      //   <View style={css.mainWrap}>
      //     <ImageBackground
      //       source={require('../assets/images/bg.jpg')}
      //       style={css.bg}>
      //       {this.state.tabIndex == '0' ? (
      //         <View style={css.tabContent}>
      //           {this.state.isRevealed ? (
      //             <ScrollView bounces={false}>
      //               {this.state.itemsRevealed.map((item, key) => (
      //                 <View
      //                   style={
      //                     item.crushdelete ? css.chatItemRejected : css.chatItem
      //                   }
      //                   key={key}>
      //                   {item.Photo == '' || item.Photo == null ? (
      //                     <Image
      //                       source={require('../assets/images/noimg_other.png')}
      //                       style={css.chatItemPic}
      //                     />
      //                   ) : (
      //                     <Image
      //                       source={{uri: host_photo + item.Photo}}
      //                       style={css.chatItemPic}
      //                     />
      //                   )}
      //                   <View style={css.chatItemText}>
      //                     <Text style={css.chatItemTitle}>{item.name}</Text>
      //                     <Text style={css.chatItemSubtitle}>
      //                       {item.crushmobile}
      //                     </Text>
      //                     <View style={css.chatItemBtns}>
      //                       <TouchableOpacity
      //                         activeOpacity={0.5}
      //                         style={[css.chatItemBtn, css.chatItemBtnAccept]}
      //                         onPress={() => {
      //                           this.acceptRequest(
      //                             item.name,
      //                             item.crushmobile,
      //                             item.Feeling,
      //                           );
      //                         }}>
      //                         <Text
      //                           style={[
      //                             css.chatItemBtnText,
      //                             css.chatItemBtnTextActive,
      //                           ]}>
      //                           Accept
      //                         </Text>
      //                       </TouchableOpacity>
      //                       {item.crushdelete ? (
      //                         <TouchableOpacity
      //                           activeOpacity={0.5}
      //                           style={[css.chatItemBtn]}
      //                           disabled>
      //                           <Text style={[css.chatItemBtnText]}>
      //                             Rejected
      //                           </Text>
      //                         </TouchableOpacity>
      //                       ) : (
      //                         <TouchableOpacity
      //                           activeOpacity={0.5}
      //                           style={[css.chatItemBtn, css.chatItemBtnReject]}
      //                           onPress={() => {
      //                             this.rejectRequest(item.crushmobile);
      //                           }}>
      //                           <Text
      //                             style={[
      //                               css.chatItemBtnText,
      //                               css.chatItemBtnTextActive,
      //                             ]}>
      //                             Reject
      //                           </Text>
      //                         </TouchableOpacity>
      //                       )}
      //                     </View>
      //                   </View>
      //                   {item.Feeling == 'Love' ? (
      //                     <Icon
      //                       type="Ionicons"
      //                       name="ios-heart"
      //                       style={[css.chatItemInfo, css.itemLove]}
      //                     />
      //                   ) : (
      //                     <Icon
      //                       type="Ionicons"
      //                       name="ios-heart"
      //                       style={[css.chatItemInfo, css.itemLike]}
      //                     />
      //                   )}
      //                 </View>
      //               ))}
      //             </ScrollView>
      //           ) : (
      //             <View style={css.noContent}>
      //               <Icon
      //                 type="Ionicons"
      //                 name="heart-outline"
      //                 style={css.noContentIcon}
      //               />
      //               <Text style={css.noContentText}>
      //                 {this.state.msgRevealed}
      //               </Text>
      //             </View>
      //           )}
      //         </View>
      //       ) : (
      //         <View style={css.tabContent}>
      //           {this.state.isUnrevealed ? (
      //             <ScrollView bounces={false}>
      //               <View style={css.unrevealedContent}>
      //                 <Text style={css.titleBig}>Congratulations!</Text>
      //                 <Text style={css.subtitleSmall}>
      //                   You have new Love/Like.
      //                 </Text>
      //                 <Text style={css.subtitleInfo}>
      //                   With 'TieHearts Fortune' you can reveal the identity of
      //                   the person who submitted feelings for you, using your
      //                   contact number. ({_countryCode}-{_mobile})
      //                 </Text>
      //                 {_gender == 'Male' ? (
      //                   <AutoHeightImage
      //                     width={180}
      //                     source={require('../assets/images/b_female.png')}
      //                     style={css.iconBottom}
      //                   />
      //                 ) : (
      //                   <AutoHeightImage
      //                     width={180}
      //                     source={require('../assets/images/b_male.png')}
      //                     style={css.iconBottom}
      //                   />
      //                 )}
      //                 <Text style={css.subtitleBig}>
      //                   {this.state.itemsUnrevealed.length} new people like/love
      //                   you!
      //                 </Text>
      //                 <Text style={css.subtitleLabel}>
      //                   Click 'Reveal' to know who are they.
      //                 </Text>
      //                 <TouchableOpacity
      //                   activeOpacity={0.5}
      //                   onPress={() => {
      //                     this.purchasePlan();
      //                   }}
      //                   style={[styles.btn, styles.btnAccent, css.btnCustom]}>
      //                   <Text style={styles.btnText}>Reveal</Text>
      //                 </TouchableOpacity>
      //               </View>
      //             </ScrollView>
      //           ) : (
      //             <View style={css.noContent}>
      //               <Icon
      //                 type="Ionicons"
      //                 name="heart-outline"
      //                 style={css.noContentIcon}
      //               />
      //               <Text style={css.noContentText}>
      //                 No New Love/Like to Reveal
      //               </Text>
      //             </View>
      //           )}
      //         </View>
      //       )}
      //     </ImageBackground>
      //   </View>
      //   {this.state.showLoader ? (
      //     <View style={styles.loader}>
      //       <ActivityIndicator
      //         animating={true}
      //         color={colorAccent}
      //         size="large"
      //       />
      //     </View>
      //   ) : null}
      // </SafeAreaView>
      <View style={css.container}>
        <ImageBackground style={css.img} resizeMode='cover'
          source={require('../assets/images/bg.jpg')}
        >
          <ScrollView bounces={false} >
          <View style={css.people}>
            <Text style={{ fontFamily: 'Manrope', fontWeight: '700', fontSize: 51, lineHeight: 69.67, color: '#FAFF12', right: 10 }} >{this.state.itemsUnrevealed.length}</Text>
            <Text style={css.love}>People secretly Love/ {`\n`}Like You</Text>
            <Image source={require('../assets/images/likes.png')} style={css.like} />
          </View>
          <View style={css.box} >
          

            {this.state.isUnrevealed ? (
              // <ScrollView bounces={false}>
              // {this.state.itemsUnrevealed.map((item, key) => (
              <View style={css.unrevealedContent}

              >
                <FlatList data={this.state.itemsUnrevealed}
                  //  style={{flex:1,backgroundColor:'red'}}
                  // showsVerticalScrollIndicator={true}
                  //  contentContainerStyle={{flex:1}}
                  scrollEnabled={false}
                  numColumns={2}
                  keyExtractor={(item, key) => String(key)}
                  renderItem={(item) => (
                    <View style={{
                      width: 150, height: 178, backgroundColor: "#1F1A31", marginHorizontal: 10, marginVertical: 10, justifyContent: 'center', alignItems: 'center',
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 8,
                      },
                      shadowOpacity: 0.46,
                      shadowRadius: 11.14,

                      elevation: 17,
                    }}>
                      {item.Photo == '' || item.Photo == null ? (

                        <RadialGradient style={{ width: 107, height: 107, borderRadius: 50, justifyContent:'center', alignItems:'center', marginBottom:10 }}

                          colors={['#D8D4D4', '#C4C4C4',]}
                          stops={[0.24, 0.4,]}
                          center={[50, 50]}
                          radius={100}
                        >
                          <Image
                            source={require('../assets/images/noimg_other.png')}
                            style={css.chatItemPic}
                          />
                        </RadialGradient>
                      ) : (
                     
                        <RadialGradient style={{ width: 107, height: 107, borderRadius: 50, justifyContent:'center', alignItems:'center',marginBottom:10 }}

                        colors={['#D8D4D4', '#C4C4C4',]}
                        stops={[0.24, 0.4,]}
                        center={[50, 50]}
                        radius={100}
                      >

                          <Image
                            source={{ uri: host_photo + item.Photo }}
                            style={css.chatItemPic}
                          />
                        </RadialGradient>
                      )}


                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colorPrimarybtn, colorSecondarybtn]}
                        style={[css.btn1]}
                      >
                        <TouchableOpacity
                          style={{ width: '100%', height: 64, justifyContent: 'center', alignItems: 'center',  }}
                          onPress={() => {
                            this.purchasePlan();
                          }}
                        >
                          <Text style={{color:'white'}}>Reveal</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  )

                  }
                />

                {/* </FlatList> */}
              </View>
              //  ))} 
              // </ScrollView>
            ) : (
              <View style={css.noContent}>
                <Icon
                  type="Ionicons"
                  name="heart-outline"
                  style={css.noContentIcon}
                />
                <Text style={css.noContentText}>
                  No New Love/Like to Reveal
                </Text>
              </View>
            )}

          

          </View>
          </ScrollView>
        </ImageBackground >

      </View >
    );
  }
}

const css = StyleSheet.create({
  mainWrap: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bg: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  tabsWrap: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colorBlack30,
  },
  tab: {
    width: '50%',
    backgroundColor: colorPrimary,
    paddingVertical: 15,
  },
  tabActive: {
    borderBottomColor: colorWhite,
    borderBottomWidth: 4,
  },
  tabTitle: {
    textAlign: 'center',
    fontFamily: fontBold,
    fontSize: 14,
    color: colorWhite90,
    textTransform: 'uppercase',
  },
  tabContent: {
    width: '100%',
    flexDirection: 'column',
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colorBlack10,
    backgroundColor: colorWhite50,
  },
  chatItemRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colorBlack10,
    backgroundColor: 'rgba(179, 52, 50, 0.2)',
  },
  chatItemPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  chatItemText: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 5,
  },
  chatItemTitle: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 16,
    marginBottom: 5,
  },
  chatItemSubtitle: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 14,
  },
  chatItemBtns: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chatItemBtn: {
    backgroundColor: colorBlack20,
    width: 100,
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  chatItemBtnAccept: {
    backgroundColor: '#44ab97',
  },
  chatItemBtnReject: {
    backgroundColor: colorAccent,
  },
  chatItemBtnText: {
    fontFamily: fontRegular,
    color: colorBlack30,
    fontSize: 14,
    textAlign: 'center',
  },
  chatItemBtnTextActive: {
    color: colorWhite90,
  },
  chatItemInfo: {
    position: 'absolute',
    right: 15,
    top: 26,
    fontFamily: fontRegular,
    fontSize: 18,
  },
  itemLike: {
    color: '#2196F3',
  },
  itemLove: {
    color: colorAccent,
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    fontFamily: fontRegular,
    fontSize: 16,
    color: 'white',
  },
  noContentIcon: {
    fontSize: 40,
    color: "white",
    marginBottom: 10,
  },
  unrevealedContent: {
    flex: 1,
    alignItems: 'center',
    // paddingVertical: 30,
    justifyContent:'center'
  },
  titleBig: {
    fontFamily: fontBold,
    color: colorAccent,
    fontSize: 24,
  },
  subtitleSmall: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 17,
    marginTop: 8,
    marginBottom: 30,
  },
  subtitleInfo: {
    fontFamily: fontRegular,
    color: colorBlack80,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  iconBottom: {
    marginBottom: 20,
  },
  subtitleBig: {
    fontFamily: fontBold,
    color: colorPrimary,
    fontSize: 18,
    marginBottom: 20,
  },
  subtitleLabel: {
    fontFamily: fontRegular,
    color: colorBlack80,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  btnCustom: {
    width: 200,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1F1A31'
  },
  img: {
    flex: 1,
    width: '100%'
  },
  like: {
    width: 96,
    height: 165
  },
  love: {
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24.59,
    color: '#FFFFFF',
  },
  box: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',

  },
  people: {
    width: '100%',
    height: 380,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center'
  },
  btn1:{
    width:88,
    height:21,
    borderColor:'#07F83C',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10
  }
});

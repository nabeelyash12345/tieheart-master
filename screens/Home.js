import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import {
  StyleSheet,
  View,
  Share,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  AppState,
  Alert,
  ActivityIndicator,
  TextInput,
  Keyboard,
  ImageBackground,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import AutoHeightImage from 'react-native-auto-height-image';
import { SearchableFlatList } from 'react-native-searchable-list';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalStore from '../components/GlobalStore';
import { observer } from 'mobx-react';
import moment from 'moment';
import styles from '../Style';
import Chat from './Chat/Chat';
import withIncomingCallListener from './Call/IncomingCallListener';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { updateUserInfo, updateUserInfoSec } from '../src/redux/user-slice';


import { connect } from 'react-redux';
@observer
class Home extends Component {
  componentDidMount() {
    this.checkPermission();
    // AppState.addEventListener('change', this._handleAppStateChange);
  }
  async componentDidUpdate() {
    try {
      const value = await AsyncStorage.getItem('checkFinger');
      if (value !== null) {
        // We have data!!
        console.log(value, "asdghfsghgrfhf")

        const result = JSON.parse(value);
        if (this.state.checkFinger !== result.isVa) {
          this.setState({ checkFinger: result.isVa });
        }

      }
    } catch (error) {
      // Error retrieving data
    }
  }
  componentWillUnmount() {
    // this.notificationListener();
    // AppState.removeEventListener('change', this._handleAppStateChange);
    if (this.timer != undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  constructor(props) {
    super(props);
    this.navItemsBottom = [
      {
        id: '0',
        icon: 'user',
        title: 'Profile',
      },
      {
        id: '1',
        icon: 'heart',
        title: 'Match',
      },
      {
        id: '2',
        icon: 'bubble',
        title: 'Chats',
      },
      {
        id: '3',
        icon: 'settings',
        title: 'Settings',
      },
    ];
    this.state = {
      navItemIndex: '0',
      navItemTitle: 'Profile',
      gender: 'Male',
      photoPlaceholder: require('../assets/images/noimg_male.png'),
      isPhotoSelected: 'N',
      searchTerm: '',
      photo: _photo,
      mobile: null,
      countryCode: _countryCode,
      crushMobile: null,
      showPremiumDialog: false,
      totalLikeLove: 2,
      isChatListLoaded: false,
      isChatListMsg: 'Please wait..',
      itemsChat: [],
      itemSecratChat:[],
      checkFinger: false,
      isPhotoSelected: 'N',
      photoBase64: null,
      photoPath: null,
      isplanActive:false,
      photoPlaceholder: require('../assets/images/noimg_male.png'),
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('Home Focused');

      if (_gender == 'Male') {
        this.setState({
          photoPlaceholder: require('../assets/images/noimg_male.png'),
        });
      } else if (_gender == 'Female') {
        this.setState({
          photoPlaceholder: require('../assets/images/noimg_female.png'),
        });
      } else {
        this.setState({
          photoPlaceholder: require('../assets/images/noimg_other.png'),
        });
      }

      if (GlobalStore.photoBase64.indexOf('base64') >= 0) {
        this.setState({
          isPhotoSelected: 'Y',
        });
      } else {
        this.setState({
          isPhotoSelected: 'N',
        });
      }

      if (_photo != '') {
        this.setState({ photoPlaceholder: { uri: host_photo + this.state.photo } });
      }

      this.setState({
        crushMobile: GlobalStore.selectedContact,
        searchTerm: '',
      });
      console.log('Selected contact num: ' + GlobalStore.selectedContact);
      GlobalStore.setSelectedContact('');

      this.totalLikeLove();
      this.getChatList();
      this.getSecretChatList();
      this.updateChat();
    });

    this.createChatTable();
  }

  getRBSheetRef = () => this.RBSheet;

  openCamera() {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      let imagebase64 = image.path;
      let imagepath = image.path;
      if (Platform.OS === 'android') {
        imagebase64 = 'data:' + image.mime + ';base64,' + image.data;
        //imagepath = imagepath.replace('file://', '');
      }
      console.log(imagepath);
      this.setState({
        isPhotoSelected: 'Y',
        photoBase64: imagebase64,
        photoPath: imagepath,
      });
    });
  }

  openLibrary() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      let imagebase64 = image.path;
      let imagepath = image.path;
      if (Platform.OS === 'android') {
        imagebase64 = 'data:' + image.mime + ';base64,' + image.data;
        //imagepath = imagepath.replace('file://', '');
      }
      console.log(imagepath);
      this.setState({
        isPhotoSelected: 'Y',
        photoBase64: imagebase64,
        photoPath: imagepath,
      });
    });
  }

  removePhoto() {
    this.setState({
      isPhotoSelected: 'N',
      photoBase64: null,
      photoPath: null,
    });
  }
  // A funtion to subscribe to the notification recievers
  // async subscribeToNotificationListeners() {
  //   console.log('Subscribed to notifications listener');
  //   const channel = new firebase.notifications.Android.Channel(
  //     'tiehearts_global', // To be Replaced as per use
  //     'General', // To be Replaced as per use
  //     firebase.notifications.Android.Importance.Max,
  //   ).setDescription(
  //     'A channel to manage the notifications related to Application',
  //   );
  //   firebase.notifications().android.createChannel(channel);

  //   this.notificationListener = firebase
  //     .notifications()
  //     .onNotification((notification) => {
  //       console.log(
  //         'Triggered when a particular notification has been received in foreground',
  //       );
  //       if (notification.data.data != undefined) {
  //         console.log(
  //           'onNotification notification.data -->',
  //           notification.data.data,
  //         );
  //         var msg = JSON.parse(notification.data.data);
  //         console.log(
  //           'Title: ' +
  //             msg.title +
  //             ' Msg: ' +
  //             msg.message +
  //             ' Type: ' +
  //             msg.type,
  //         );
  //       }
  //     });

  //   this.notificationOpenedListener = firebase
  //     .notifications()
  //     .onNotificationOpened((notification) => {
  //       console.log(
  //         'If your app is in background, you can listen for when a notification is clicked / tapped / opened',
  //       );
  //       console.log(
  //         'onNotification notification.notification -->',
  //         notification.notification,
  //       );
  //       var msg = JSON.parse(notification.notification._data.data);
  //       console.log('Title: ' + msg.title + ' Msg: ' + msg.message);
  //     });

  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification()
  //     .then((initialMessage) => {
  //       if (initialMessage != null) {
  //         console.log(
  //           'If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened',
  //         );
  //         console.log(
  //           'Initial Message: ',
  //           initialMessage.notification._data.data,
  //         );
  //         var msg = JSON.parse(initialMessage.notification._data.data);
  //         console.log(
  //           'Title: ' +
  //             msg.title +
  //             ' Msg: ' +
  //             msg.message +
  //             ' Type: ' +
  //             msg.type,
  //         );
  //         this.actionForNotification(msg.title, msg.message, msg.type);
  //       }
  //     });

  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     //process data message
  //     console.log(JSON.stringify(message));
  //     console.log('Triggered for data only payload in foreground');
  //   });
  // }

  // displayNotification = (notification) => {
  //   if (Platform.OS === 'android') {
  //     const localNotification = new firebase.notifications.Notification({
  //       sound: 'default',
  //       show_in_foreground: false,
  //     })
  //       .setNotificationId(notification.notificationId)
  //       .setTitle('COOL')
  //       .setSubtitle(notification.subtitle)
  //       .setBody(notification.body)
  //       .setData(notification.data)
  //       .android.setChannelId('tiehearts_global') // e.g. the id you chose above
  //       //.android.setSmallIcon('ic_notification_icon') // create this icon in Android Studio
  //       //.android.setColor(colors.colorAccent) // you can set a color here
  //       .android.setPriority(firebase.notifications.Android.Priority.High);

  //     firebase
  //       .notifications()
  //       .displayNotification(localNotification)
  //       .catch((err) => console.error(err));
  //   }
  // };

  // _handleAppStateChange = (nextAppState) => {
  //   this.setState({appState: nextAppState});
  //   if (nextAppState === 'background') {
  //     console.log('App is in Background Mode.');
  //   }
  //   if (nextAppState === 'active') {
  //     console.log('App is in Active Foreground Mode.');
  //     if (Platform.OS == 'ios') {
  //       PushNotificationIOS.getApplicationIconBadgeNumber(function (count) {
  //         console.log('badge count : ' + count);
  //       });
  //       PushNotificationIOS.setApplicationIconBadgeNumber(0);
  //     }
  //     //PushNotification.cancelAllLocalNotifications();
  //     if (GlobalStore.isNotification) {
  //       //this.actionForNotification(this.state.notifTitle, this.state.notifMsg);
  //       GlobalStore.setIsNotification(false);
  //     }
  //   }
  //   if (nextAppState === 'inactive') {
  //     console.log('App is in inactive Mode.');
  //   }
  // };

  async checkPermission() {
    // if (Platform.OS === 'android') {
    //   this.subscribeToNotificationListeners();
    // } else if (Platform.OS === 'ios') {
    //   const enabled = await firebase.messaging().hasPermission();
    //   if (enabled) {
    //     this.subscribeToNotificationListeners();
    //   }
    // }
  }

  PressedNavItem = (itemId, itemName) => {
    Keyboard.dismiss();
    console.log('Source Item ID: ' + itemId);
    console.log('Source Item Name: ' + itemName);
    this.setState({ navItemIndex: itemId, navItemTitle: itemName });
  };

  fingerprint = (id) => {
    id === '2' && this.state.checkFinger && (
      this.props.navigation.navigate('FingerPrint')

    )
  };

  actionForNotification(title, msg, type) {
    if (type == 'chat') {
      this.PressedNavItem('2', 'Chats');
    }
  }

  howitworks_feelings() {
    Alert.alert(
      'How it works',
      'We will lock your feelings and ask the same question to your Crush.\nIts TieHearts if your Crush also locks feelings for you.',
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false },
    );
  }

  createChatTable() {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='" +
        table_chat +
        "'",
        [],
        function (tx, res) {
          console.log('chatItem:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ' + table_chat, []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
              table_chat +
              ' (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id VARCHAR(20), msg_text TEXT, msg_type VARCHAR(10), msg_content TEXT, msg_date VARCHAR(20), msg_status INT(1), msg_id NUMERIC, msg_self INT(1))',
              [],
            );
          }
        },
      );
    });
  }

  updateChat = () => {
    this.timer = setInterval(() => this.updateChatServer(), 5000);
  };

  async updateChatServer() {
    var params =
      'http://faizanansari.com/android/tiehearts/markMsgs.php?receiver_num=' +
      _mobile +
      '&status=received';
    fetch(params, {
      method: 'POST',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson == 'success') {
          db.transaction(function (tx) {
            tx.executeSql(
              'UPDATE ' +
              table_chat +
              ' SET msg_status = ? WHERE msg_status = ?',
              [1, 0],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('Msgs Received Updated: ' + results.rowsAffected);
                }
              },
            );
          });
        }
      })
      .catch((error) => {
        console.error('Error: ' + error);
      });
  }

  checkCrushNumber() {
    if (this.state.crushMobile < 1) {
      Alert.alert('Error', 'Please enter Mobile');
    } else if (
      this.state.crushMobile.length > 0 &&
      this.state.crushMobile.length < 10
    ) {
      Alert.alert('Error', 'Mobile should be in 10 digits');
    } else if (this.state.crushMobile == _mobile) {
      Alert.alert('Error', 'You cannot lock feelings to yourself.');
    } else {
      this.setState({
        showLoader: true,
      });
      var params =
        '?usernumber=' +
        _mobile +
        '&crushnumber=' +
        this.state.crushMobile +
        '&code=' +
        this.state.countryCode ;
      console.log('CheckCrush API: ' + host + 'CheckCrushNumber' + params);
      fetch(host + 'CheckCrushNumber' + params, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log('CheckCrush API Response: ' + responseJson);

          if (responseJson == 'N') {
            this.props.navigation.navigate('Feelings', {
              countryCode: this.state.countryCode,
              crushNumber: this.state.crushMobile,
            });
          } else if (responseJson == 'Y') {
            Alert.alert(
              'Already Registered',
              'This number is already registered. Please try other number.',
            );
          } else {
            Alert.alert('Error', 'User not found.');
          }

          this.setState({
            showLoader: false,
          });
        })
        .catch((error) => {
          Alert.alert('Error', 'Unable to establish connection.');
          this.setState({
            showLoader: false,
          });
        });
    }
  }

  totalLikeLove() {
    this.setState({
      showLoader: true,
    });
    var params = '?usernumber=' + _mobile;
    console.log('Totallikelove API: ' + host + 'Totallikelove' + params);
    fetch(host + 'Totallikelove' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('Totallikelove API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          this.setState({
            totalLikeLove: responseJson[0]._Count,
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to establish connection.');
        this.setState({
          showLoader: false,
        });
      });
  }

  getChatList() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile;
    console.log(
      'GetCrushMatchList API: ' + host + 'GetCrushMatchList' + params,
    );
    fetch(host + 'GetCrushMatchList' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          'GetCrushMatchList API Response: ' + JSON.stringify(responseJson),
        );
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              id: i,
              crushtoken: responseJson[i].crushtoken,
              uniquenumber: responseJson[i].uniquenumber,
              Photo: responseJson[i].Photo,
              name: responseJson[i].name,
              crushmobile: responseJson[i].crushmobile,
              Feeling: responseJson[i].Feeling,
            });
            const userId = responseJson[i].crushmobile;
            const userInfo = {
              name: responseJson[i].name,
              imgUrl:
                responseJson[i].Photo &&
                `${host_photo}/${responseJson[i].Photo}`,
            };
            this.props.dispatch(updateUserInfo({ userId, userInfo }));
          }
          this.setState({
            itemsChat: tempDataArray,
            isChatListLoaded: true,
            isChatList: true,
          });
        } else {
          this.setState({
            isChatListLoaded: true,
            isChatList: false,
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to establish connection.');
        this.setState({
          showLoader: false,
          isChatListLoaded: false,
          isChatList: false,
          isChatListMsg: 'Unable to load list',
        });
      }); 
  }


  getSecretChatList() {
    this.setState({
      showLoader: true,
    });
    var params = '?userMobileNo=' + _mobile;
    console.log(
      'GetSecretChatList API: ' + host + 'getSecretChatList' + params,
    );
    fetch(host + 'getSecretChatList' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          'GetSecretChatList API Response: dskdhsdk ' + (JSON.stringify(responseJson)),
        );

        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              id: i,
              crushtoken: responseJson[i].crushtoken,
              uniquenumber: responseJson[i].uniquenumber,
              Photo: responseJson[i].Photo,
              name: responseJson[i].name,
              crushmobile: responseJson[i].crushmobile,
              Feeling: responseJson[i].Feeling,
            });
            const userId = responseJson[i].crushmobile;
            const userInfo = {
              name: responseJson[i].name,
              imgUrl:
                responseJson[i].Photo &&
                `${host_photo}/${responseJson[i].Photo}`,
            };
            this.props.dispatch(updateUserInfoSec({ userId, userInfo }));
          }
          this.setState({
            itemSecratChat: tempDataArray,
            isChatListLoaded: true,
            isChatList: true,
          });
        }
         else {
          this.setState({
            isChatListLoaded: true,
            isChatList: false,
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to establish connection.');
        this.setState({
          showLoader: false,
          isChatListLoaded: false,
          isChatList: false,
          isChatListMsg: 'Unable to load list',
        });
      });
  }



  

  // checkPayment(navName) {
  //   this.props.navigation.navigate('FollowUp');

  //   this.setState({
  //     showLoader: true,
  //   });
  //   // var params = '?mobileno=' + _mobile;
  //   // console.log('RegistrationCheck API: ' + host + 'RegistrationCheck' + params);
  //   // fetch(host + 'RegistrationCheck' + params, {
  //   //   method: 'GET',
  //   // })
  //   //   .then((response) => response.json())
  //   //   .then((responseJson) => {

  //   //     console.log('RegistrationCheck API Response: ' + responseJson);

  //   //     this.setState({
  //   //       showLoader: false,
  //   //     });

  //   //     if (responseJson[0].Mobile == undefined) {
  //   //       Alert.alert('Error', 'Unable to verify. Please try again.');
  //   //     } else {
  //   //       console.log('Name: ' + responseJson[0].name);
  //   //       if (responseJson[0].paymentstatus == '' || responseJson[0].paymentstatus == null) {
  //   //         if (navName == 'premium') {
  //   //           this.setState({ showPremiumDialog: true });
  //   //         } else {
  //   //           this.props.navigation.navigate('Seewho', { isPlanActive: false, totalLikeLove: this.state.totalLikeLove });
  //   //         }
  //   //       } else {
  //   //         var timestamp_curr = responseJson[0].currentdate.slice(6, -10);
  //   //         var currentDate = moment(timestamp_curr * 1000).format('YYYY-MM-DD');
  //   //         var expiryDate = responseJson[0].PaymentExpiryDate.split('/');
  //   //         var expiryDateFormatted = expiryDate[2] + '-' + expiryDate[0] + '-' + expiryDate[1];
  //   //         var expiryDate_var = moment(expiryDateFormatted);
  //   //         var currentDate_var = moment(currentDate);

  //   //         console.log('Current Date: ' + currentDate);
  //   //         console.log('Expiry Date: ' + expiryDateFormatted);

  //   //         if (currentDate_var <= expiryDate_var) {
  //   //           console.log('plan is active');
  //   //           if (navName == 'premium') {
  //   //             this.props.navigation.navigate('FollowUp');
  //   //           } else {
  //   //             this.props.navigation.navigate('Reveal', { isPlanActive: true, totalLikeLove: this.state.totalLikeLove });
  //   //           }
  //   //         } else {
  //   //           console.log('plan is expired');
  //   //           if (navName == 'premium') {
  //   //             this.setState({ showPremiumDialog: true });
  //   //           } else {
  //   //             this.props.navigation.navigate('Seewho', { isPlanActive: false, totalLikeLove: this.state.totalLikeLove });
  //   //           }
  //   //         }
  //   //       }
  //   //     }
  //   //   })
  //   //   .catch((error) => {
  //   //     Alert.alert('Error', 'Unable to verify. Please try again.');
  //   //     this.setState({
  //   //       showLoader: false,
  //   //     });
  //   //   });
  // }

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
  onShare = async () => {
    try {
      await Share.share({
        message:
          "Take a look at TieHearts,the app that lets you lock your feelings for your real life Crush. If your Crush also locks feelings for you, then It's TieHearts and you get a free access to our secure couple messenger. Only for you two.😉 https://tiehearts.com/download",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  logout() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {
          text: 'Cancel',
        },
        { text: 'Logout', onPress: () => this.confirmLogout() },
      ],
      { cancelable: false },
    );
  }

  confirmLogout() {
    this.clearChatDB();
    AsyncStorage.clear();
    this.resetComponent();
  }

  clearChatDB() {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM ' + table_chat, [], (tx, results) => {
        console.log('Clear Chat DB: ' + results.rowsAffected);
      });
    });
  }

  resetComponent() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Splash' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <SafeAreaView style={[styles.safeArea]}>
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

        <View style={css.contentWrap}>
          <View style={css.contentWrapInner}>
            <ImageBackground
              source={require('../assets/images/bg.jpg')}
              style={css.bg}>
              <View
                style={[
                  css.contentWrapSection,
                  this.state.navItemTitle == 'Profile'
                    ? css.sectionActive
                    : null,
                ]}>
                <ScrollView
                  bounces={false}
                  style={css.contentWrapScroll}
                  contentContainerStyle={{ paddingBottom: 15 }}>
                  <TouchableOpacity style={css.profileHeader}
                   onPress={() => this.props.navigation.navigate('Profile')}
                  >

                    {/* <AutoHeightImage
                      width={160}
                      source={require('../assets/images/logo_title.png')}
                      style={css.logoTitle}
                    /> */}



                    <LinearGradient

                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1.1 }}
                      colors={[colorPrimary, colorSecondary]}
                      style={{ borderRadius: 100, width: 115, height: 115, justifyContent: "center", alignContent: 'center' }}>
                      {this.state.isPhotoSelected == 'N' ? (
                        <Image
                          source={this.state.photoPlaceholder}
                          style={css.profilePic}
                        />
                      ) : (
                        <Image
                          source={{ uri: GlobalStore.photoBase64 }}
                          style={css.profilePic}
                        />
                      )}

                    </LinearGradient>
                    <TouchableOpacity style={{ width: 31, height: 31, backgroundColor: '#1F1A31', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 90, marginTop: -60 }}
                      onPress={() => this.props.navigation.navigate('Profile')}
                    >
                      <Image
                        style={{ width: 14, height: 14 }}
                        source={require('../assets/images/camera.png')}
                      />

                    </TouchableOpacity>

                    <Text style={css.profileTitle}>
                      <Image
                        style={{ width: 24, height: 24, marginTop: 10 }}
                        source={require('../assets/images/Mass.png')}
                      />
                      {`\t`}
                      {GlobalStore.nickName}
                    </Text>

                    {/* <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        this.props.navigation.navigate('Profile');
                      }}>
                      <Text style={css.profileSubtitle}>
                        Tap to see your profile
                      </Text>
                    </TouchableOpacity> */}
                  </TouchableOpacity>
                  <View style={css.profileItems}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {


                        this.props.navigation.navigate('Reveal')
                      }}>
                      <View style={css.profileItem}>
                        <Icon
                          type="Ionicons"
                          name="person"
                          style={[
                            css.profileItemIcon,
                            { backgroundColor: '#0596FF' },
                          ]}
                        />
                        <Text style={css.profileItemTitle}>
                          See who all Like/Love you

                        </Text>
                        <View style={{ flexDirection: 'row', top: 20, right: 180 }} >
                          <Text style={css.profileItemCount}>
                            {this.state.totalLikeLove}
                          </Text>
                          <Icon
                            type="FontAwesome"
                            name="heart-o"
                            style={css.profileItemCountIcon}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        // this.checkPayment();
                        this.getSecretChatList()
                        // this.props.navigation.navigate('Premium')
                      }}>
                      <View style={css.profileItem}>
                        <Icon
                          type="FontAwesome"
                          name="diamond"
                          style={[
                            css.profileItemIcon,
                            { backgroundColor: '#635F05' },
                          ]}
                        />
                        <Text style={css.profileItemTitle}>
                          TieHearts Premium
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => this.onShare()}>

                      <View style={css.profileItem}>
                        <LinearGradient
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          colors={[colorPrimarybtn, colorSecondarybtn]}
                          style={[css.profileItemIcon]}
                        >
                          <Icon
                            type="FontAwesome"
                            name="plus"
                            style={[css.profileItemIcon1]}
                          />
                        </LinearGradient>
                        <Text style={css.profileItemTitle}>Invite Friends</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        this.checkPayment('seewho');
                      }}>
                      <View style={css.profileItem}>
                        <LinearGradient
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          colors={[colorPrimarybtn, colorSecondarybtn]}
                          style={[css.profileItemIcon]}
                        >
                          <Icon
                            type="MaterialIcons"
                            name="track-changes"
                            style={[
                              css.profileItemIcon1,

                            ]}
                          />
                        </LinearGradient>
                        <Text style={css.profileItemTitle}>Tracking</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        this.logout();
                      }}>
                      <View style={css.profileItem}>
                        <LinearGradient
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          colors={[colorPrimarybtn, colorSecondarybtn]}
                          style={[css.profileItemIcon]}
                        >
                          <Icon
                            type="FontAwesome"
                            name="power-off"
                            style={[
                              css.profileItemIcon1,

                            ]}
                          />
                        </LinearGradient>
                        <Text style={css.profileItemTitle}>Logout</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>

              <View
                style={[
                  css.contentWrapSection,
                  this.state.navItemTitle == 'Match' ? css.sectionActive : null,

                ]}>
                <ScrollView
                  bounces={false}
                  style={css.contentWrapScroll}
                  contentContainerStyle={{ paddingBottom: 15 }}>
                  <View style={css.matchHeader}>

                    <AutoHeightImage
                      // width={130}
                      source={require('../assets/images/love.png')}
                      style={css.matchPic}
                    />

                    {/* <Text style={css.matchTitle}>Tie Hearts</Text> */}
                    <Image
                      source={require('../assets/images/ell.png')}
                      style={css.matchTitle}
                    >

                    </Image>
                    <Text style={css.matchSubtitle}>
                      Enter the contact number{'\n'}of your Crush
                    </Text>
                    <View style={css.matchInputWrap}>
                      <TextInput
                        style={css.matchInputCode}
                        maxLength={5}
                        keyboardType="phone-pad"
                        onChangeText={(countryCode) =>
                          this.setState({ countryCode })
                        }
                        value={this.state.countryCode}
                      />
                      <TextInput
                        style={css.matchInputNumber}
                        placeholder={'Mobile No.'}
                        placeholderTextColor="white"

                        maxLength={10}
                        keyboardType="decimal-pad"
                        onChangeText={(crushMobile) =>
                          this.setState({ crushMobile })
                        }
                        value={this.state.crushMobile}
                      />
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          this.props.navigation.navigate('Contacts', {
                            viewType: 'match',
                          });
                        }}>
                        <Icon
                          type="AntDesign"
                          name="contacts"
                          style={css.matchContactIcon}
                        />
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={require('../assets/images/ell.png')}
                      style={css.matchTitle1}
                    >

                    </Image>
                    <Image
                      source={require('../assets/images/ell.png')}
                      style={css.matchTitle}
                    >

                    </Image>
                    <View style={css.matchButtonWrap}>
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colorPrimary, colorSecondary]}
                        style={[styles.btn, styles.btnAccent]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={{ width: '100%', height: 64, justifyContent: 'center', alignItems: 'center' }}
                          onPress={() => {
                            this.checkCrushNumber();
                          }}>
                          <Text style={styles.btnText}>Submit</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  </View>
                  <View activeOpacity={0.5} style={css.matchLinksWrap}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        this.howitworks_feelings();
                      }}>
                      <Text style={css.matchLinkUnderline}>Learn how</Text>
                    </TouchableOpacity>
                    <Text style={css.matchLink}> it works</Text>



                  </View>

                </ScrollView>
              </View>

              <View
                style={[
                  css.contentWrapSection,
                  this.state.navItemTitle == 'Chats' ? css.sectionActive : null,
                ]}>
                {/* {!this.state.isChatList ?
                  <View style={css.searchWrap}>
                    <TextInput style={css.searchInput} placeholder={'Search'} placeholderTextColor={colorWhite50} maxLength={100} keyboardType={'default'} returnKeyType="search" onChangeText={searchTerm => this.setState({ searchTerm })} value={this.state.searchTerm} multiline={false} numberOfLines={1} />
                    <Icon type="Ionicons" name="ios-search" style={css.searchIcon} />
                  </View> : null}
                {this.state.isChatListLoaded && this.state.isChatList ?
                  <SearchableFlatList
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={this.state.itemsChat}
                    searchTerm={this.state.searchTerm}
                    searchAttribute={"name"}
                    ignoreCase={true}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity activeOpacity={0.5} style={css.chatItem} onPress={() => { this.props.navigation.navigate('Chat', { crushName: item.name, crushMobile: item.crushmobile, crushPhoto: item.Photo, crushToken: item.crushtoken, uniqueNumber: item.uniquenumber }); }}>
                        {item.Photo == "" || item.Photo == null ?
                          <Image source={require('../assets/images/noimg_other.png')} style={css.chatItemPic} /> :
                          <Image source={{ uri: host_photo + item.Photo }} style={css.chatItemPic} />
                        }
                        <View style={css.chatItemText}>
                          <Text style={css.chatItemTitle}>{item.name}</Text>
                          <Text style={css.chatItemSubtitle}>{item.crushmobile}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()} /> : null}

                {!this.state.isChatListLoaded && !this.state.isChatList ?
                  <View style={css.noContent}>
                    <Icon type="Ionicons" name="heart-outline" style={css.noContentIcon} />
                    <Text style={css.noContentText}>{this.state.isChatListMsg}</Text>
                  </View> : null}

                {this.state.isChatListLoaded && !this.state.isChatList ?
                  <View style={css.noContent}>
                    <Icon type="Ionicons" name="heart-outline" style={css.noContentIcon} />
                    <Text style={css.noContentText}>You will see users here{"\n"}once you have got TieHearts.</Text>
                    <Text style={css.labelAlreadyPartner}>Already have a partner?</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('FollowProcess', { isNewUser: false }); }}>
                      <Text style={css.linkAlreadyPartner}>Tap Here</Text>
                    </TouchableOpacity>
                  </View> : null} */}
                <Chat navigation={this.props.navigation} />
              </View>

              <View
                style={[
                  css.contentWrapSection,
                  this.state.navItemTitle == 'Settings'
                    ? css.sectionActive
                    : null,
                ]}>
                <ScrollView bounces={false}>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.setState({
                        navItemIndex: '0',
                        navItemTitle: 'Profile',
                      });
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="user"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#81e5ab' },
                      ]}
                    />

                    <Text style={css.settingsItemTitle}>
                      Personal Information
                    </Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.props.navigation.navigate('PaymentHistory');
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="credit-card"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#55c8d3' },
                      ]}
                    />
                    <Text style={css.settingsItemTitle}>Payment History</Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.props.navigation.navigate('WebpageView', {
                        title: 'Privacy & Permission',
                        page: 'privacypermission.aspx',
                      });
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="hand-paper-o"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#899ae0' },
                      ]}
                    />
                    <Text style={css.settingsItemTitle}>
                      Privacy &amp; Permission
                    </Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.props.navigation.navigate('NotificationChat');
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="bell"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#b58ed4' },
                      ]}
                    />
                    <Text style={css.settingsItemTitle}>
                      Notification &amp; Chat
                    </Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.props.navigation.navigate('WebpageView', {
                        title: 'Account & Security',
                        page: 'accountsecurity.aspx',
                      });
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="lock"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#ea809a' },
                      ]}
                    />
                    <Text style={css.settingsItemTitle}>
                      Account &amp; Security
                    </Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                  <View style={css.settingsDivider} />
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.props.navigation.navigate('HelpFeedback');
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="commenting-o"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#f89d84' },
                      ]}
                    />
                    <Text style={css.settingsItemTitle}>
                      Help &amp; Feedback
                    </Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.settingsItem}
                    onPress={() => {
                      this.props.navigation.navigate('WebpageView', {
                        title: 'About TieHearts',
                        page: 'aboutus.aspx',
                      });
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="info-circle"
                      style={[
                        css.settingsItemPic,
                        { backgroundColor: '#dbdc95' },
                      ]}
                    />
                    <Text style={css.settingsItemTitle}>About TieHearts</Text>
                    <Icon
                      type="SimpleLineIcons"
                      name={'arrow-right'}
                      style={css.settingsItemIcon}
                    />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </ImageBackground>
          </View>
          <View style={css.bottomBar}>
            {this.navItemsBottom.map((item, key) => (
              <TouchableOpacity
                style={css.bottomBarCol}
                key={key}
                activeOpacity={0.5}
                onPress={() => {
                  this.fingerprint(item.id)
                  this.PressedNavItem(item.id, item.title);
                }}>
                <Text
                  style={[
                    css.bottomTitle,
                    this.state.navItemIndex == item.id
                      ? css.bottomTitleActive
                      : null,
                  ]}>
                  <Icon
                    type="SimpleLineIcons"
                    name={item.icon}
                    style={[
                      css.bottomIcon,
                      this.state.navItemIndex == item.id
                        ? css.bottomIconActive
                        : null,
                    ]}
                  />
                  {'\n'}
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
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

          <View
            style={[
              css.dialogBg,
              this.state.showPremiumDialog ? css.showDialog : null,
            ]}>
            <View style={css.dialogCustom}>
              <View style={css.dialogHeader}>
                <Text style={css.dialogTitle}>Finger Crossed (Follow Up)</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={css.dialogCloseBtn}
                  onPress={() => {
                    this.setState({ showPremiumDialog: false });
                  }}>
                  <Icon
                    type="SimpleLineIcons"
                    name="close"
                    style={css.dialogCloseIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={css.dialogBody}>
                <View style={css.contentBulletRow}>
                  <Text style={css.contentBullet}>•</Text>
                  <Text style={css.contentText}>
                    Track if your Crush has downloaded the 'TieHearts' App or
                    not.
                  </Text>
                </View>
                <View style={css.contentBulletRow}>
                  <Text style={css.contentBullet}>•</Text>
                  <Text style={css.contentText}>
                    Track if your Crush has locked his/her feelings.
                  </Text>
                </View>
              </View>
              <View style={css.dialogFooter}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[styles.btn, styles.btnAccent, css.dialogBtn]}
                  onPress={() => {
                    this.setState({ showPremiumDialog: false }),
                      this.props.navigation.navigate('Premium');
                  }}>
                  <Text style={styles.btnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default withIncomingCallListener(
  connect(null, (dispatch) => ({ dispatch }))(Home),
);

const css = StyleSheet.create({
  contentWrap: {
    flex: 1,
    width: '100%',
    position: 'relative',
    zIndex: 2,
    backgroundColor: colorOffWhite,
  },
  contentWrapInner: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  bg: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentWrapSection: {
    flex: 1,
    display: 'none',
  },
  dialogBg: {
    flex: 1,
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 3,
    backgroundColor: colorBlack50,
    padding: 20,
    opacity: 0,
  },
  dialogCustom: {
    width: '100%',
    backgroundColor: colorWhite,
    borderRadius: 5,
    shadowColor: colorBlack70,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  dialogHeader: {
    padding: 15,
    position: 'relative',
  },
  dialogTitle: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 18,
  },
  dialogCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  dialogCloseIcon: {
    fontSize: 24,
    color: colorSecondary,
  },
  dialogBody: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dialogFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  dialogBtn: {
    width: 200,
    marginBottom: 10,
  },
  showDialog: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  contentBulletRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  contentBullet: {
    marginEnd: 15,
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 16,
  },
  contentText: {
    flex: 1,
    fontFamily: fontRegular,
    color: colorBlack90,
    fontSize: 16,
  },
  sectionActive: {
    display: 'flex',
  },
  searchWrap: {
    backgroundColor: colorPrimary,
    paddingHorizontal: 50,
    paddingVertical: 5,
    position: 'relative',
  },
  searchInput: {
    color: colorWhite,
    fontSize: 16,
    height: 40,
  },
  searchIcon: {
    color: colorWhite80,
    fontSize: 20,
    position: 'absolute',
    left: 15,
    top: 14,
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    height: 300,
    width: "100%",
    // borderColor:"red",
    backgroundColor: '#1F1A31',
    borderTopWidth: 0,
    // backgroundColor:"red",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,


    // borderWidth:3,
    shadowColor: "#000",
    shadowOffset: {
      left: -10,
      right: -8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  },
  profilePic: {
    width: 91,
    height: 91,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colorWhite,
    backgroundColor: colorWhite,
    alignSelf: 'center'
  },
  profileTitle: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 14,
    marginVertical: 10,
    lineHeight: 19.12,
    fontFamily: 'Manrope',
    marginTop: 50,
  },
  profileSubtitle: {
    fontFamily: fontRegular,
    color: colorBlack70,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  profileItems: {
    padding: 15,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1F1A31",
    padding: 12,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    height: 85,
    borderColor: "#1F1A31",
    // borderColor: 'rgba(229, 12, 49, 0.1)',
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,



  },
  profileItemIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    color: colorWhite,
    fontSize: 20,
    backgroundColor: colorPrimary,
    padding: 10,
    borderRadius: 50,

  },
  profileItemIcon1: {
    width: 40,
    height: 40,
    color: colorWhite,
    fontSize: 20,

  },
  profileItemTitle: {
    fontSize: 15,
    fontFamily: fontBold,
    color: colorWhite70,
  },
  profileItemCountIcon: {
    fontSize: 18,
    color: colorAccent,
    marginLeft: 5,
  },
  profileItemCount: {
    fontSize: 18,
    fontFamily: fontBold,
    color: colorWhite,
    marginLeft: 15,
  },
  matchHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  matchPic: {
    width: 80,
    height: 80,
    // marginVertical: 30,
  },
  matchTitle: {
    fontFamily: fontBold,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32.78,
    fontWeight: "600",
    marginVertical: 15,
    alignSelf: "flex-end",
    marginRight: 20
  },
  matchTitle: {
    fontFamily: fontBold,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32.78,
    fontWeight: "600",
    marginVertical: 15,
    alignSelf: 'flex-end',
    marginRight: 20
  },
  matchTitle1: {
    fontFamily: fontBold,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32.78,
    fontWeight: "600",
    marginVertical: 15,
    alignSelf: 'flex-start',
    marginLeft: 20
  },





  matchSubtitle: {
    fontFamily: fontBold,
    fontWeight: "500",
    opacity: 99,
    color: colorWhite,
    fontSize: 18,
    lineHeight: 24.59,
    marginTop: 55,
    textAlign: 'center',
    // marginTop: 20,
  },
  matchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 30,
  },
  matchInputCode: {
    marginRight: 10,
    width: 50,
    height: 40,
    borderBottomColor: colorWhite60,
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: fontRegular,
    color: colorWhite,
    paddingVertical: 8,
    textAlign: 'center',
  },
  matchInputNumber: {
    marginRight: 10,
    width: 180,
    height: 40,
    borderBottomColor: colorWhite60,
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: fontRegular,
    color: colorWhite,
    paddingVertical: 8,
  },
  matchContactIcon: {
    fontSize: 28,
    marginTop: 2,
    color: colorWhite,
  },
  matchButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    width: 200,
  },
  matchLinksWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchLinkUnderline: {
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 16,
    // textDecorationLine: 'underline',
  },
  matchLink: {
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colorWhite10,
  },
  chatItemPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  chatItemText: {
    borderBottomWidth: 1,
    borderBottomColor: colorBlack10,
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
  chatItemInfo: {
    position: 'absolute',
    right: 10,
    top: 26,
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: 15,
  },
  settingsItemPic: {
    width: 36,
    height: 36,
    paddingVertical: 7,
    borderRadius: 30,
    fontSize: 20,
    color: colorWhite,
    backgroundColor: colorBlack20,
    textAlign: 'center',
  },
  settingsItemTitle: {
    fontFamily: fontBold,
    color: colorWhite80,
    fontSize: 16,
    flex: 1,
    marginLeft: 15,
  },
  settingsItemIcon: {
    position: 'absolute',
    right: 15,
    top: 25,
    fontSize: 16,
    color: colorBlack50,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colorBlack10,
    marginVertical: 10,
  },
  logoTitle: {
    marginBottom: 30,
  },
  bottomBar: {
    backgroundColor: "#130E25",
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    overflow: 'visible',
  },
  bottomBarGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
  },
  bottomBarCol: {
    height: '100%',
    width: '25%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  bottomTitle: {
    color: colorWhite60,
    fontSize: 11,
    textAlign: 'center',
  },
  bottomTitleActive: {
    color: colorWhite,
    fontWeight: 'bold',
    backgroundColor: "#201B32",
    width: 80,
    height: 39,
    borderRadius: 50,

  },
  bottomIcon: {
    color: colorWhite60,
    fontSize: 18,
    lineHeight: 26,
  },
  bottomIconActive: {
    color: colorWhite,
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    fontFamily: fontRegular,
    fontSize: 16,
    color: colorBlack50,
    textAlign: 'center',
  },
  noContentIcon: {
    fontSize: 40,
    color: colorBlack50,
    marginBottom: 10,
  },
  labelAlreadyPartner: {
    fontFamily: fontBold,
    fontSize: 16,
    color: colorBlack90,
    marginTop: 20,
  },
  linkAlreadyPartner: {
    fontFamily: fontRegular,
    color: colorAccent,
    fontSize: 15,
    padding: 10,
  },
});

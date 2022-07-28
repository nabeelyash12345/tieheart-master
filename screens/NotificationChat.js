import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AutoHeightImage from 'react-native-auto-height-image';
import {Icon} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../Style';

export default class NotificationChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      allNotif: false,
      chatNotif: false,
      matchNotif: false,
      checkFinger:false,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('NotificationChatResume');
      this.getSettings();
    });
  }
  async componentDidMount() {
    console.log("hello")
   try {
     const value = await AsyncStorage.getItem('checkFinger');
     if (value !== null) {
       // We have data!!
       const result = JSON.parse(value);
       this.setState({checkFinger:result.isVa});
     }
   } catch (error) {
     // Error retrieving data
   }
 }
  toggleAllNotif() {
    // if (this.state.allNotif) {
    //   this.setState({allNotif: false, chatNotif: false, matchNotif: false});
    //   this.setChatNotification(false);
    //   this.setMatchNotification(false);
    // } else {
    //   this.setState({allNotif: true, chatNotif: true, matchNotif: true});
    //   this.setChatNotification(true);
    //   this.setMatchNotification(true);
    // }
  }

  toggleChatNotif() {
    // if (this.state.chatNotif) {
    //   this.setState({chatNotif: false});
    //   this.checkToggle(false, this.state.matchNotif);
    //   this.setChatNotification(false);
    // } else {
    //   this.setState({chatNotif: true});
    //   this.checkToggle(true, this.state.matchNotif);
    //   this.setChatNotification(true);
    // }
  }
  
  async toggleFinger () {
    
    try {
     await AsyncStorage.setItem(
       'checkFinger', JSON.stringify({isVa: !this.state.checkFinger})
     );
     console.log(this.state.checkFinger)
     this.setState({checkFinger:!this.state.checkFinger});
   } catch (error) {
     // Error saving data
   }
 
}

  toggleMatchNotif() {
    // if (this.state.matchNotif) {
    //   this.setState({matchNotif: false});
    //   this.checkToggle(this.state.chatNotif, false);
    //   this.setMatchNotification(false);
    // } else {
    //   this.setState({matchNotif: true});
    //   this.checkToggle(this.state.chatNotif, true);
    //   this.setMatchNotification(true);
    // }
  }

  checkToggle(chatNotif, matchNotif) {
    // if (chatNotif && matchNotif) {
    //   this.setState({allNotif: true});
    // } else if (!chatNotif && matchNotif) {
    //   this.setState({allNotif: false});
    // } else if (chatNotif && !matchNotif) {
    //   this.setState({allNotif: false});
    // } else {
    //   this.setState({allNotif: false});
    // }
  }

  getSettings() {
    // this.setState({
    //   showLoader: true,
    // });
    // var params = '?mobilenumber=' + _mobile;
    // console.log('Settings API: ' + host + 'checknotification' + params);
    // fetch(host + 'checknotification' + params, {
    //   method: 'GET',
    // })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log('Settings API Response: ' + responseJson);
    //     this.setState({
    //       showLoader: false,
    //     });

    //     if (responseJson && responseJson.length) {
    //       this.setState({
    //         chatNotif: responseJson[0].Chatnotification,
    //         matchNotif: responseJson[0].matchnotification,
    //       });
    //       this.checkToggle(
    //         responseJson[0].Chatnotification,
    //         responseJson[0].matchnotification,
    //       );
    //     } else {
    //       Alert.alert(
    //         'Error',
    //         'Unable to get notification settings. Please try again.',
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('Catch Error: ' + error.message);
    //     Alert.alert(
    //       'Error',
    //       'Unable to get notification settings. Please try again.',
    //     );
    //     this.setState({
    //       showLoader: false,
    //     });
    //   });
  }

  setChatNotification(toggleChat) {
    // this.setState({
    //   showLoader: true,
    // });
    // var params = '?mobilenumber=' + _mobile + '&chat=' + toggleChat;
    // console.log('ChatSettings API: ' + host + 'Chatnotification' + params);
    // fetch(host + 'Chatnotification' + params, {
    //   method: 'GET',
    // })
    //   .then((response) => response.text())
    //   .then((responseJson) => {
    //     console.log('ChatSettings API Response: ' + responseJson);
    //     this.setState({
    //       showLoader: false,
    //     });

    //     if (responseJson == 'Y') {
    //       console.log('Chat Notification Updated');
    //     } else {
    //       Alert.alert(
    //         'Error',
    //         'Unable to set notification settings. Please try again.',
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('Catch Error: ' + error.message);
    //     Alert.alert(
    //       'Error',
    //       'Unable to set notification settings. Please try again.',
    //     );
    //     this.setState({
    //       showLoader: false,
    //     });
    //   });
  }

  setMatchNotification(toggleMatch) {
    // this.setState({
    //   showLoader: true,
    // });
    // var params = '?mobilenumber=' + _mobile + '&match=' + toggleMatch;
    // console.log('MatchSettings API: ' + host + 'matchnotification' + params);
    // fetch(host + 'matchnotification' + params, {
    //   method: 'GET',
    // })
    //   .then((response) => response.text())
    //   .then((responseJson) => {
    //     console.log('MatchSettings API Response: ' + responseJson);
    //     this.setState({
    //       showLoader: false,
    //     });

    //     if (responseJson == 'Y') {
    //       console.log('Match Notification Updated');
    //     } else {
    //       Alert.alert(
    //         'Error',
    //         'Unable to set notification settings. Please try again.',
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('Catch Error: ' + error.message);
    //     Alert.alert(
    //       'Error',
    //       'Unable to set notification settings. Please try again.',
    //     );
    //     this.setState({
    //       showLoader: false,
    //     });
    //   });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[colorPrimary, colorSecondary]}
          style={{height: statusBarHeight}}>
          <StatusBar
            barStyle="light-content"
            translucent={true}
            backgroundColor={'transparent'}
          />
        </LinearGradient>
        <View style={styles.headerPrimary}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => this.props.navigation.goBack()}>
              <Icon
                type="Ionicons"
                name="ios-arrow-back"
                style={styles.navBtnIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Notification &amp; Chat</Text>
        </View>
        <View style={css.mainWrap}>
          <ScrollView bounces={false}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={css.menuItem}
              onPress={() => {
                this.toggleAllNotif();
              }}>
              <View style={css.menuItemRow}>
                <View style={css.menuItemCol}>
                  <Text style={css.menuItemTitle}>All Notifications</Text>
                  <Text style={css.menuItemSubtitle}>
                    Never show notifications from this app
                  </Text>
                </View>
                {this.state.allNotif ? (
                  <Icon
                    type="FontAwesome"
                    name="toggle-on"
                    style={css.menuItemToggleActive}
                  />
                ) : (
                  <Icon
                    type="FontAwesome"
                    name="toggle-off"
                    style={css.menuItemToggle}
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={css.menuItem}
              onPress={() => {
                this.toggleChatNotif();
              }}>
              <View style={css.menuItemRow}>
                <View style={css.menuItemCol}>
                  <Text style={css.menuItemTitle}>Chat</Text>
                  <Text style={css.menuItemSubtitle}>
                    Notified when receiving chat message
                  </Text>
                </View>
                {this.state.chatNotif ? (
                  <Icon
                    type="FontAwesome"
                    name="toggle-on"
                    style={css.menuItemToggleActive}
                  />
                ) : (
                  <Icon
                    type="FontAwesome"
                    name="toggle-off"
                    style={css.menuItemToggle}
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={css.menuItem}
              onPress={() => {
                this.toggleMatchNotif();
              }}>
              <View style={css.menuItemRow}>
                <View style={css.menuItemCol}>
                  <Text style={css.menuItemTitle}>Match</Text>
                  <Text style={css.menuItemSubtitle}>
                    Notified when someone locks feeling
                  </Text>
                </View>
                {this.state.matchNotif ? (
                  <Icon
                    type="FontAwesome"
                    name="toggle-on"
                    style={css.menuItemToggleActive}
                  />
                ) : (
                  <Icon
                    type="FontAwesome"
                    name="toggle-off"
                    style={css.menuItemToggle}
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={css.menuItem}
              onPress={() => {
                this.toggleFinger()
                
              }}>
              <View style={css.menuItemRow}>
                <View style={css.menuItemCol}>
                  <Text style={css.menuItemTitle}>FingerPrint</Text>
                  <Text style={css.menuItemSubtitle}>
                    On Of
                  </Text>
                </View>
                {this.state.checkFinger ? (
                  <Icon
                    type="FontAwesome"
                    name="toggle-on"
                    style={css.menuItemToggleActive}
                  />
                ) : (
                  <Icon
                    type="FontAwesome"
                    name="toggle-off"
                    style={css.menuItemToggle}
                  />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
          <AutoHeightImage
            width={win.width}
            source={require('../assets/images/bg_notification.png')}
            style={css.bg}
          />
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
    opacity: 0.2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  menuItem: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colorBlack10,
    position: 'relative',
    zIndex: 1,
  },
  menuItemRow: {
    flexDirection: 'row',
  },
  menuItemCol: {
    flex: 1,
    paddingRight: 20,
  },
  menuItemTitle: {
    fontFamily: fontBold,
    color: colorBlack80,
    fontSize: 16,
    marginBottom: 5,
  },
  menuItemSubtitle: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 14,
  },
  menuItemToggle: {
    color: colorBlack30,
    fontSize: 30,
    alignSelf: 'center',
  },
  menuItemToggleActive: {
    color: colorAccent,
    fontSize: 30,
    alignSelf: 'center',
  },
});

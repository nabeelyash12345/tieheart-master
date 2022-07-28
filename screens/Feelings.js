import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import styles from '../Style';
import chatManager from '../src/firebase/chatManager';
import { connect } from 'react-redux';
import { getMyId } from '../src/firebase/firebase';
import { updateUserInfo } from '../src/redux/user-slice';
import { Shadow } from 'react-native-neomorph-shadows';
class Feelings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      itemIndex: '0',
      itemTitle: 'Love',
      notlocked: true,
      locked: false,
      matched: false,
      crushName: null,
      photoPlaceholder: require('../assets/images/noimg_male_lite.png'),
      countryCode: props.navigation.state.params.countryCode,
      crushNumber: props.navigation.state.params.crushNumber,
    };
  }

  PressedItem = (itemId, itemName) => {
    console.log('Pressed Item ID: ' + itemId);
    console.log('Pressed Item Name: ' + itemName);
    this.setState({ itemIndex: itemId, itemTitle: itemName });
  };

  saveCrushNumber() {
    this.setState({
      showLoader: true,
    });
    var params =
      '?usernumber=' +
      _mobile +
      '&crushnumber=' +
      this.state.crushNumber +
      '&code=' +
      this.state.countryCode +
      '&crushfeeling=' +
      this.state.itemTitle;
    console.log('SaveCrush API: ' + host + 'SaveCrushNumber' + params);
    fetch(host + 'SaveCrushNumber' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('SaveCrush API Response: ' + responseJson);

        this.setState({
          showLoader: false,
        });

        if (responseJson == 'N') {
          this.setState({
            notlocked: false,
            locked: true,
            matched: false,
          });
        } else if (responseJson == 'M') {
          this.crushNumberProfile();
        } else {
          Alert.alert('Error', 'User not found.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to establish connection.');
        this.setState({
          showLoader: false,
        });
      });
  }

  crushNumberProfile() {
    this.setState({
      showLoader: true,
    });
    var params = '?crushnumber=' + this.state.crushNumber;
    console.log(
      'CrushNumberProfile API: ' + host + 'CrushNumberProfile' + params,
    );
    fetch(host + 'CrushNumberProfile' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          'CrushNumberProfile API Response: ' + JSON.stringify(responseJson),
        );

        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          if (responseJson[0].Gender == 'Male') {
            this.setState({
              photoPlaceholder: require('../assets/images/noimg_male_lite.png'),
            });
          } else if (responseJson[0].Gender == 'Female') {
            this.setState({
              photoPlaceholder: require('../assets/images/noimg_female_lite.png'),
            });
          } else {
            this.setState({
              photoPlaceholder: require('../assets/images/noimg_other_lite.png'),
            });
          }

          if (this.notNull(responseJson[0].vcimage).length > 4) {
            this.setState({
              photoPlaceholder: { uri: host_photo + responseJson[0].vcimage },
            });
          }

          this.setState({
            notlocked: false,
            locked: false,
            matched: true,
            crushName: responseJson[0].name,
          });

          this.sendCrushNotification(this.state.crushNumber);
          chatManager.initiateChat(this.props.dispatch, {
            myId: getMyId(),
            otherId: responseJson[0].Mobile,
          });
          const userId = responseJson[0].Mobile;
          const imgUrl = responseJson[0].vcimage
            ? `${responseJson[0].vcimage}`
            : '';
          const userInfo = {
            name: responseJson[0].name,
            mobileNumber: responseJson[0].Mobile,
            imgUrl,
          };
          this.props.dispatch(updateUserInfo({ userId, userInfo }));
        } else {
          Alert.alert('Error', 'User not found.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to establish connection.');
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

  showNote() {
    Alert.alert(
      'Note',
      "Incase your Crush choose your some other contact number which is not registered with us then \"TieHearts\" will not happen and you won't be notified.\n\nIn order to link your other contact numbers with this account, go to 'Settings' and click 'Link Account' option.",
    );
  }

  notNull(val) {
    if (val == null) {
      return '';
    } else {
      return val;
    }
  }

  resetComponent() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });
    this.props.navigation.dispatch(resetAction);
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

        <ImageBackground
          source={require('../assets/images/bg.jpg')}
          style={css.bg}>
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
            <Text style={styles.headerTitle}>Lock Your Feelings</Text>
          </View>
          {this.state.notlocked ? (
            <View style={css.mainWrap}>
              <Text style={css.title}>
                Choose what you feel{'\n'}for your Crush.
              </Text>
              <Text style={css.subtitle}>({this.state.crushNumber})</Text>
              <View style={css.optionsWrap}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.PressedItem('0', 'Love');
                  }}>
                  <View
                    style={[
                      css.optionChoose,
                      this.state.itemIndex == '0' ? css.optionActive : null,
                    ]}>

                    <Shadow
                      inner // <- enable inner shadow
                      useArt // <- set this prop to use non-native shadow on ios
                      style={{

                        shadowOpacity: 0.25,
                        shadowColor: colorBlack30,
                        shadowRadius: 10,
                        backgroundColor: '#1F1A31',
                        width: 121,
                        height: 139,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        // borderWidth:1,
                        // borderColor:'red'

                      }}

                    >
                      <AutoHeightImage
                        width={70}
                        source={require('../assets/images/hrt.png')}
                      />
                      {this.state.itemIndex == '0' ? (
                        <Icon
                          type="FontAwesome"
                          name="check-circle"
                          style={css.optionIconCheck}
                        />
                      ) : null}
                      <Text style={css.optionChooseTitle}>Love</Text>
                    </Shadow>
                  </View>
                </TouchableOpacity>
                <Text style={css.or}>OR</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.PressedItem('1', 'Like');
                  }}>
                  <View
                    style={[
                      css.optionChoose,
                      this.state.itemIndex == '1' ? css.optionActive : null,
                    ]}>

                    <Shadow
                      inner // <- enable inner shadow
                      useArt // <- set this prop to use non-native shadow on ios
                      style={{

                        shadowOpacity: 0.25,
                        shadowColor: colorBlack30,
                        shadowRadius: 10,
                        backgroundColor: '#1F1A31',
                        width: 121,
                        height: 139,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        // borderWidth:1,
                        // borderColor:'red'

                      }}

                    >
                      <AutoHeightImage
                        width={70}
                        source={require('../assets/images/like_ic.png')}
                      />
                      {this.state.itemIndex == '1' ? (
                        <Icon
                          type="FontAwesome"
                          name="check-circle"
                          style={css.optionIconCheck}
                        />
                      ) : null}
                      <Text style={css.optionChooseTitle}>Like</Text>

                    </Shadow>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btn, styles.btnAccent, css.btnCustom]}
                onPress={() => this.saveCrushNumber()}>
                <Text style={styles.btnText}>Lock Feeling</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {this.state.locked ? (
            <View style={css.mainWrap}>
              {this.state.itemTitle == 'Love' ? (
                <AutoHeightImage
                  width={60}
                  source={require('../assets/images/h3.gif')}
                />
              ) : (
                <AutoHeightImage
                  width={60}
                  source={require('../assets/images/like_ic.png')}
                />
              )}
              <Text style={css.titleLarge}>Congratulations!</Text>
              <Text style={css.titleSmall}>
                We have successfully locked{'\n'}your feelings for{' '}
                {this.state.crushNumber}.
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.showNote()}>
                <Text style={css.noteLink}>Note</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btn, styles.btnAccent, css.btnCustom]}
                onPress={() => this.resetComponent()}>
                <Text style={styles.btnText}>Awesome</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {this.state.matched ? (
            <View style={css.mainWrap}>
              <Text style={css.titleLarge}>Congratulations!</Text>
              <Text style={css.titleSmall}>
                Its "TieHearts" with{'\n'}({this.state.crushName})
              </Text>
              <Image
                source={require('../assets/images/h3.gif')}
                style={css.heart1}
              />
              <Text style={css.infoSmall}>You both have same feelings!</Text>
              <Text style={css.infoBig}>
                You both get a free access to{'\n'}Couple Space.
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.btn, styles.btnAccent, css.btnCustom]}
                onPress={() => this.resetComponent()}>
                <Text style={styles.btnText}>Awesome</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ImageBackground>

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

export default connect(null, (dispatch) => ({ dispatch }))(Feelings);

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
  title: {
    textAlign: 'center',
    fontFamily: fontBold,
    color: colorWhite90,
    fontSize: 22,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  titleLarge: {
    textAlign: 'center',
    fontFamily: fontBold,
    color: colorWhite90,
    fontSize: 28,
    marginBottom: 20,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  titleSmall: {
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: fontRegular,
    color: colorWhite90,
    fontSize: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  infoSmall: {
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: fontRegular,
    color: colorWhite90,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  infoBig: {
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: fontBold,
    color: '#d1df64',
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: fontRegular,
    color: colorWhite80,
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  optionsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  optionChoose: {
    backgroundColor: '#1F1A31',
    // paddingVertical: 15,
    // paddingHorizontal: 18,
    // borderRadius: 10,
    // shadowColor: colorBlack70,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 1,
    // elevation: 3,
    // borderColor: 'green',
    // borderWidth: 3,
    position: 'relative',
  },
  optionActive: {
    backgroundColor: '#1F1A31',
  },
  optionIconCheck: {
    color: colorWhite90,
    fontSize: 26,
    position: 'absolute',
    top: 34,
    zIndex: 1,
    alignSelf: 'center',
  },
  optionChooseTitle: {
    textAlign: 'center',
    fontFamily: fontBold,
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  or: {
    textAlign: 'center',
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 18,
    marginHorizontal: 20,
  },
  btnCustom: {
    width: 200,
    marginTop: 10,
  },
  noteLink: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: fontRegular,
    color: colorWhite80,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  heart1: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },
});
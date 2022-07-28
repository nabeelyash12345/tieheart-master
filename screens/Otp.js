import React, {Component} from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import styles from '../Style';

export default class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: props.navigation.state.params.countryCode,
      mobile: props.navigation.state.params.mobile,
      fcmToken: props.navigation.state.params.fcmToken,
      name: null,
      nickName: null,
      dob: null,
      gender: null,
      rStatus: null,
      status: false,
      photo: null,
      aboutMe: null,
      email: null,
      paymentStatus: null,
      PaymentExpiryDate: null,
      allNotification: false,
      chatNotification: false,
      matchNotification: false,
      crush: null,
      paymentReavel: null,
      joiningDate: null,
      showLoader: false,
    };
  }

  checkOTP(otpInput) {
    console.log('OTP Entered ' + otpInput + '');
    if (otpInput == '123456') {
      Keyboard.dismiss();
      this.checkRegistration();
    }
  }

  checkRegistration() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobileno=' + this.state.mobile;
    console.log(
      'RegistrationCheck API: ' + host + 'RegistrationCheck' + params,
    );
    fetch(host + 'RegistrationCheck' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('RegistrationCheck API Response: ' + responseJson);

        if (responseJson[0].Mobile == undefined) {
          this.setState({
            showLoader: false,
          });
          this.props.navigation.navigate('Register', {
            countryCode: this.state.countryCode,
            mobile: this.state.mobile,
            fcmToken: this.state.fcmToken,
          });
        } else {
          console.log('Name: ' + responseJson[0].name);
          this.setState({
            countryCode: responseJson[0].Country_code,
            mobile: responseJson[0].Mobile,
            name: responseJson[0].name,
            nickName: responseJson[0].nickname,
            dob: responseJson[0].dateofbirth,
            gender: responseJson[0].Gender,
            rStatus: responseJson[0].R_Status,
            status: responseJson[0].status,
            photo: responseJson[0].vcimage,
            aboutMe: responseJson[0].aboutme,
            email: responseJson[0].Emailid,
            paymentStatus: responseJson[0].paymentstatus,
            PaymentExpiryDate: responseJson[0].PaymentExpiryDate,
            allNotification: responseJson[0].allnotification,
            chatNotification: responseJson[0].chatnotification,
            matchNotification: responseJson[0].matchnotification,
            crush: responseJson[0].crush,
            paymentReavel: responseJson[0].paymentreavel,
            joiningDate: responseJson[0].dateadded,
          });
          this.updateToken();
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to verify. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  updateToken() {
    this.setState({
      showLoader: true,
    });
    var params =
      '?mobile=' +
      this.state.mobile +
      '&refreshedToken=' +
      this.state.fcmToken +
      '&versionName=' +
      appVersion +
      '&versionCode=' +
      appBuild +
      '&osVersion=' +
      osVersion +
      '&platform=' +
      appPlatform +
      '&rnVersion=' +
      appRNVersion;
    console.log('UpdateToken API: ' + host + 'TokenUpdate' + params);
    fetch(host + 'TokenUpdate' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        this.setState({
          showLoader: false,
        });

        console.log('UpdateToken API Response: ' + responseJson);

        if (responseJson.indexOf('Y') >= 0) {
          AsyncStorage.setItem(
            '@countryCode',
            this.notNull(this.state.countryCode),
          );
          AsyncStorage.setItem('@mobile', this.notNull(this.state.mobile));
          AsyncStorage.setItem('@name', this.notNull(this.state.name));
          AsyncStorage.setItem('@nickName', this.notNull(this.state.nickName));
          AsyncStorage.setItem('@dob', this.notNull(this.state.dob));
          AsyncStorage.setItem('@gender', this.notNull(this.state.gender));
          AsyncStorage.setItem('@rStatus', this.notNull(this.state.rStatus));
          AsyncStorage.setItem('@status', this.checkBool(this.state.status));
          AsyncStorage.setItem('@photo', this.notNull(this.state.photo));
          AsyncStorage.setItem('@aboutMe', this.notNull(this.state.aboutMe));
          AsyncStorage.setItem('@email', this.notNull(this.state.email));
          AsyncStorage.setItem(
            '@paymentStatus',
            this.notNull(this.state.paymentStatus),
          );
          AsyncStorage.setItem(
            '@PaymentExpiryDate',
            this.notNull(this.state.PaymentExpiryDate),
          );
          AsyncStorage.setItem(
            '@allNotification',
            this.checkBool(this.state.allNotification),
          );
          AsyncStorage.setItem(
            '@chatNotification',
            this.checkBool(this.state.chatNotification),
          );
          AsyncStorage.setItem(
            '@matchNotification',
            this.checkBool(this.state.matchNotification),
          );
          AsyncStorage.setItem('@crush', this.state.crush.toString());
          AsyncStorage.setItem(
            '@paymentReavel',
            this.state.paymentReavel.toString(),
          );
          AsyncStorage.setItem(
            '@joiningDate',
            this.notNull(this.state.joiningDate),
          );
          AsyncStorage.setItem('@fcmToken', this.notNull(this.state.fcmToken));
          this.resetComponent();
        } else {
          Alert.alert('Error', 'Unable to verify. Please try again.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to verify. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  notNull(val) {
    if (val == null) {
      return '';
    } else {
      return val;
    }
  }

  checkBool(val) {
    if (val == false) {
      return '0';
    } else {
      return '1';
    }
  }

  resetComponent() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Splash'})],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const {navigate} = this.props.navigation;

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
        <View style={css.mainWrap}>
          <ImageBackground
            source={require('../assets/images/bg.jpg')}
            style={css.bg}>
            <Text style={css.title}>Activate your account</Text>
            <Text style={css.subtitle}>
              We have sent a text at{'\n'}
              <Text style={css.subtitleSpan}>
                {this.state.countryCode}-{this.state.mobile}
              </Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Text style={css.link}>Wrong number?</Text>
            </TouchableOpacity>
            <Text style={css.label}>Enter your 6-digit code below</Text>
            <OTPInputView
              style={css.otpInputWrap}
              pinCount={6}
              autoFocusOnLoad={false}
              secureTextEntry={false}
              codeInputFieldStyle={css.otpInput}
              codeInputHighlightStyle={css.otpInputHighLighted}
              onCodeFilled={(code) => {
                this.checkOTP(code);
              }}
            />
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
    alignItems: 'center',
  },
  title: {
    fontFamily: fontBold,
    color: 'white',
    fontSize: 28,
    paddingVertical: 40,
  },
  subtitle: {
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 18,
    textAlign: 'center',
  },
  subtitleSpan: {
    color: colorWhite,
  },
  link: {
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 18,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  btnCustom: {
    width: 200,
  },
  label: {
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  timer: {
    fontFamily: fontRegular,
    color: colorBlack60,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  resendText: {
    fontFamily: fontRegular,
    color: colorBlack60,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendLink: {
    textDecorationLine: 'underline',
    color: colorPrimary,
  },
  otpInputWrap: {
    width: 300,
    height: 46,
    marginBottom: 40,
  },
  otpInput: {
    borderColor: colorBlack20,
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: fontRegular,
    color: colorBlack90,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: 46,
    backgroundColor: "white",
  },
  otpInputHighLighted: {
    borderColor: colorPrimary,
  },
});
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'native-base';
import styles from '../Style';

export default class Login extends Component {
  componentDidMount () {
    this.checkPermission();
  }

  constructor (props) {
    super(props);
    this.state = {
      showLoader: false,
      countryList: [{ label: 'India', value: '+91' }],
      countryName: 'India',
      countryCode: '+91',
      fcmToken: '0',
      mobile: null,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('Login Focused');
      this.getCountryList();
    });
  }

  async checkPermission () {
    // const enabled = await firebase.messaging().hasPermission();
    // if (enabled) {
    //   this.getToken();
    // } else {
    //   this.requestPermission();
    // }
  }

  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem('fcmtoken');
  //   console.log('Saved FCM Token: ' + fcmToken);
  //   if (!fcmToken) {
  //     fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //       // user has a device token
  //       console.log('New FCM Token: ' + fcmToken);
  //       this.setState({
  //         fcmToken: fcmToken,
  //       });
  //     }
  //   }
  //   firebase
  //     .messaging()
  //     .subscribeToTopic('global')
  //     .then(() => console.log('Subscribed to global'));
  // }

  async requestPermission() {
    //   try {
    //     await firebase.messaging().requestPermission();
    //     // User has authorised
    //     // this.getToken();
    //   } catch (error) {
    //     // User has rejected permissions
    //     console.log('notification permission rejected');
    //   }
  }

  getCountryList() {
    this.setState({
      showLoader: true,
    });
    console.log('CountryList API: ' + host + 'GetCountry');
    fetch(host + 'GetCountry', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('CountryList API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson[0].Country_Name == undefined) {
          Alert.alert('Error', 'Unable to load country list.');
        } else {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              label: responseJson[i].Country_Name,
              value: this.notNull(responseJson[i].Code),
            });
          }
          this.setState({
            countryList: tempDataArray,
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error login', error.message);
        this.setState({
          showLoader: false,
        });
      });
  }

  notNull (val) {
    if (val == null) {
      return '';
    } else {
      return val;
    }
  }

  sendOtp () {
    if (this.state.mobile < 1) {
      Alert.alert('Error', 'Please enter Mobile');
    } else if (this.state.mobile.length > 0 && this.state.mobile.length < 10) {
      Alert.alert('Error', 'Mobile should be in 10 digits');
    } else {
      Keyboard.dismiss();
      this.props.navigation.navigate('Otp', {
        countryCode: this.state.countryCode,
        mobile: this.state.mobile,
        fcmToken: this.state.fcmToken,
      });
    }
  }

  render () {
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
            <Text style={css.title}>Verify your number</Text>
            <Text style={css.subtitle}>
              Please enter your mobile number{'\n'}to receive a veification
              code.
            </Text>
            <View style={css.fields}>
              <Picker
                selectedValue={this.state.countryCode}
                style={css.countrylist}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ countryCode: itemValue })
                }>
                {this.state.countryList.map((item, key) => (
                  <Picker.Item
                    label={item.label}
                    value={item.value}
                    
                    key={key}
                  />
                ))}
              </Picker>
              <View style={css.countrylistBorder} />
              <View style={css.fieldsRow}>
                <Text style={css.inputCode}>{this.state.countryCode}</Text>
                <TextInput
                  style={css.inputNumber}
                  placeholder={'Mobile No.'}
                  placeholderTextColor="white"
                  maxLength={10}
                  keyboardType="decimal-pad"
                  onChangeText={(mobile) => this.setState({ mobile })}
                />
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.sendOtp();
              }}
              style={[styles.btn, styles.btnAccent, css.btnCustom]}>
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
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
    color: colorWhite,
    fontSize: 28,
    paddingVertical: 40,
  },
  subtitle: {
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 18,
    textAlign: 'center',
  },
  fields: {
    paddingHorizontal: 40,
    width: '100%',
    marginVertical: 50,
  },
  countrylist: {
    fontFamily: fontRegular,
    fontSize: 18,
    paddingVertical: 6,
    paddingHorizontal: 0,
    height: 40,
    color:"white",
  
  },
  countrylistBorder: {
    backgroundColor: colorWhite,
    height: 1,
  },
  fieldsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  inputCode: {
    marginRight: 10,
    width: 60,
    height: 40,
    borderBottomColor: colorWhite,
    borderBottomWidth: 1,
    fontSize: 18,
    fontFamily: fontRegular,
    color: colorWhite,
    paddingVertical: 10,
    textAlign: 'center',
  },
  inputNumber: {
    flex: 1,
    height: 40,
    borderBottomColor: colorWhite,
    borderBottomWidth: 1,
    fontSize: 18,
    fontFamily: fontRegular,
    color: colorWhite,
    paddingVertical: 8,
  },
  btnCustom: {
    width: 200,
  },
  contentBoxSelect: {
    paddingBottom: 7,
    paddingTop: 3,
    borderBottomWidth: 1,
    borderBottomColor: colorWhite,
    position: 'relative',
  },
  contentBoxSelectText: {
    fontFamily: fontRegular,
    fontSize: 14,
    color: colorWhite,
  },
  contentBoxSelectIcon: {
    fontSize: 16,
    color: colorWhite,
    position: 'absolute',
    right: 0,
    top: 4,
  },
});
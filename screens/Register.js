import React, {Component} from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import {Icon} from 'native-base';
import moment from 'moment';
import styles from '../Style';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      genderList: [
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'},
        {label: 'Other', value: 'Other'},
      ],
      relationList: [
        {label: 'Single', value: 'Single'},
        {label: 'In a relationship', value: 'In a relationship'},
        {label: 'Crushing', value: 'Crushing'},
        {label: 'Married', value: 'Married'},
        {label: 'Confused', value: 'Confused'},
      ],
      gender: 'Male',
      relation: 'Single',
      dob: '2003-01-01',
      photoPlaceholder: require('../assets/images/noimg_male.png'),
      isPhotoSelected: 'N',
      photoBase64: null,
      photoPath: null,
      fullName: null,
      nickName: null,
      countryCode: props.navigation.state.params.countryCode,
      mobile: props.navigation.state.params.mobile,
      fcmToken: props.navigation.state.params.fcmToken,
    };
  }

  updatePlaceholder(val) {
    if (val == 'Male') {
      this.setState({
        photoPlaceholder: require('../assets/images/noimg_male.png'),
      });
    } else if (val == 'Female') {
      this.setState({
        photoPlaceholder: require('../assets/images/noimg_female.png'),
      });
    } else {
      this.setState({
        photoPlaceholder: require('../assets/images/noimg_other.png'),
      });
    }
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

  registerUser() {
    var dob = moment(this.state.dob);
    var currentDate = moment(this.formatCurrentDate());
    console.log('Age: ' + currentDate.diff(dob, 'years'));

    _age = currentDate.diff(dob, 'years').toString();

    if (this.state.fullName < 1) {
      Alert.alert('Error', 'Please enter Full Name');
    } else if (this.state.nickName < 1) {
      Alert.alert('Error', 'Please enter Nick Name');
    } else if (currentDate.diff(dob, 'years') < 18) {
      Alert.alert('Error', 'Your age should not be less than 18 years.');
    } else {
      Keyboard.dismiss();
      this.setState({
        showLoader: true,
      });

      var header = {
        fullname: this.state.fullName,
        nickname: this.state.nickName,
        mobile: this.state.mobile,
        token: this.state.fcmToken,
        gender: this.state.gender,
        Rstatus: this.state.relation,
        isimage: this.state.isPhotoSelected,
        code: this.state.countryCode,
        Dob: this.state.dob,
        versionName: appVersion,
        versionCode: appBuild,
        platform: appPlatform,
        rnVersion: appRNVersion,
        osVersion: osVersion,
      };
       
      var params =
        '?fullname=' +
        this.state.fullName +
        '&nickname=' +
        this.state.nickName +
        '&mobile=' +
        this.state.mobile +
        '&token=' +
        this.state.fcmToken +
        '&gender=' +
        this.state.gender +
        '&Rstatus=' +
        this.state.relation +
        '&isimage=' +
        this.state.isPhotoSelected +
        '&code=' +
        this.state.countryCode +
        '&Dob=' +
        this.state.dob +
        '&versionName=' +
        appVersion +
        '&versionCode=' +
        appBuild +
        '&platform=' +
        appPlatform +
        '&rnVersion=' +
        appRNVersion +
        '&osVersion=' +
        osVersion;

      console.log('Register API: ' + host_main + 'Registration' + params);

      const file = {
        uri: this.state.photoPath,
        name: new Date().getTime() + '.jpeg',
        type: 'image/jpeg',
      };
      const body = new FormData();
      if (this.state.isPhotoSelected == 'Y') {
        body.append('File', file);
      } else {
        body.append('File', '');
      }

      fetch(host_main + 'Registration' , {
        method: 'POST',
        headers: header,
        body: body,
      })
        .then((response) => response.text())
        .then((responseJson) => {
          
          this.setState({
            showLoader: false,
          });

          console.log('Register API Response: ' + responseJson);

          if (responseJson.indexOf('Success') >= 0) {
            this.checkRegistration();
          } else {
            Alert.alert('Error', 'Registration failed. Please try again.');
            
          }
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
          console.log('Register API Error: ' + error.message);
          this.setState({
            showLoader: false,
          });
        });
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

        this.setState({
          showLoader: false,
        });

        if (responseJson[0].Mobile == undefined) {
          Alert.alert('Error', 'Unable to register. Please try again.');
        } else {
          console.log('Name: ' + responseJson[0].name);
          AsyncStorage.setItem(
            '@countryCode',
            this.notNull(responseJson[0].Country_code),
          );
          AsyncStorage.setItem('@mobile', this.notNull(responseJson[0].Mobile));
          AsyncStorage.setItem('@name', this.notNull(responseJson[0].name));
          AsyncStorage.setItem(
            '@nickName',
            this.notNull(responseJson[0].nickname),
          );
          AsyncStorage.setItem(
            '@dob',
            this.notNull(responseJson[0].dateofbirth),
          );
          AsyncStorage.setItem('@gender', this.notNull(responseJson[0].Gender));
          AsyncStorage.setItem(
            '@rStatus',
            this.notNull(responseJson[0].R_Status),
          );
          AsyncStorage.setItem(
            '@status',
            this.checkBool(responseJson[0].status),
          );
          AsyncStorage.setItem('@photo', this.notNull(responseJson[0].vcimage));
          AsyncStorage.setItem(
            '@photoBase64',
            this.notNull(this.state.photoBase64),
          );
          AsyncStorage.setItem(
            '@aboutMe',
            this.notNull(responseJson[0].aboutme),
          );
          AsyncStorage.setItem('@email', this.notNull(responseJson[0].Emailid));
          AsyncStorage.setItem(
            '@paymentStatus',
            this.notNull(responseJson[0].paymentstatus),
          );
          AsyncStorage.setItem(
            '@PaymentExpiryDate',
            this.notNull(responseJson[0].PaymentExpiryDate),
          );
          AsyncStorage.setItem(
            '@allNotification',
            this.checkBool(responseJson[0].allnotification),
          );
          AsyncStorage.setItem(
            '@chatNotification',
            this.checkBool(responseJson[0].chatnotification),
          );
          AsyncStorage.setItem(
            '@matchNotification',
            this.checkBool(responseJson[0].matchnotification),
          );
          AsyncStorage.setItem('@crush', responseJson[0].crush.toString());
          AsyncStorage.setItem(
            '@paymentReavel',
            responseJson[0].paymentreavel.toString(),
          );
          AsyncStorage.setItem(
            '@joiningDate',
            this.notNull(responseJson[0].dateadded),
          );
          AsyncStorage.setItem('@fcmToken', this.notNull(this.state.fcmToken));
          AsyncStorage.setItem('@age', _age);
          //this.resetComponent();
          this.props.navigation.navigate('Onboarding');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to register. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  formatCurrentDate() {
    var newDate = moment(new Date()).format('YYYY-MM-DD');
    return newDate;
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
        <View style={{backgroundColor: '#1F1A31',
    // marginTop:12,
    height: 52,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999}}>
          <View style={{
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 5,
            flexDirection: 'row',


          }}>
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
          <Text style={styles.headerTitle}>Registration</Text>
        </View>
        <KeyboardAwareScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps="never"
          scrollEventThrottle={10}
          extraHeight={250}
          resetScrollToCoords={{x: 0, y: 0}}
          scrollEnabled>
          <View style={css.mainWrap}>
            <View style={css.profileHeader}>
              {this.state.isPhotoSelected == 'N' ? (
                <Image
                  source={this.state.photoPlaceholder}
                  style={css.profilePic}
                />
              ) : (
                <Image
                  source={{uri: this.state.photoBase64}}
                  style={css.profilePic}
                />
              )}
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.getRBSheetRef().open()}>
                <Text style={css.profilePicText}>Change Profile Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={css.fieldsWrap}>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Full Name</Text>
                <TextInput
                  style={css.inputField}
                  placeholder={'Enter Full Name'}
                  placeholderTextColor={'#FFFFFF'}
                  onChangeText={(fullName) => this.setState({fullName})}
                />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Nick Name</Text>
                <TextInput
                  style={css.inputField}
                  placeholder={'Enter Nick Name'}
                  placeholderTextColor={'#FFFFFF'}
                  onChangeText={(nickName) => this.setState({nickName})}
                />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Mobile</Text>
                <TextInput
                  style={css.inputField}
                  value={this.state.mobile}
                  editable={false}
                />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Date of Birth</Text>
                <DatePicker
                  style={{width: '100%'}}
                  placeholder={'Enter Date of Birth'}
                  date={this.state.dob}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate="1970-01-01"
                  confirmBtnText="OK"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  onDateChange={(dob) => {
                    this.setState({dob: dob});
                  }}
                  customStyles={{
                    dateInput: {
                      height: 40,
                      borderWidth: 0,
                      alignItems: 'flex-start',
                    },
                    dateTouchBody: {
                      borderBottomColor: '#FFFFFF',
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 5,
                    },
                    dateText: {
                      fontSize: 16,
                      fontFamily: fontRegular,
                      color: '#FFFFFF',
                      textAlign: 'left',
                    },
                  }}
                />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Gender</Text>
                <Picker
                  selectedValue={this.state.gender}
                  style={css.selectField}
                  onValueChange={(itemValue, itemIndex) => [
                    this.setState({gender: itemValue}),
                    this.updatePlaceholder(itemValue),
                  ]}>
                  {this.state.genderList.map((item, key) => (
                    <Picker.Item
                      label={item.label}
                      value={item.value}
                      key={key}
                    />
                  ))}
                </Picker>
                <View style={css.selectFieldBorder} />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Relationship Status</Text>
                <Picker
                  selectedValue={this.state.relation}
                  style={css.selectField}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({relation: itemValue})
                  }>
                  {this.state.relationList.map((item, key) => (
                    <Picker.Item
                      label={item.label}
                      value={item.value}
                      key={key}
                    />
                  ))}
                </Picker>
                <View style={css.selectFieldBorder} />
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.btn, styles.btnAccent, css.btnCustom]}
              onPress={() => this.registerUser()}>
              <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              height={210}
              openDuration={250}
              closeDuration={200}>
              <View style={css.sheetWrap}>
                <Text style={css.sheetTitle}>Change Profile Photo</Text>
                <View style={css.sheetBtnsWrap}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.sheetBtn}
                    onPress={() => [
                      this.getRBSheetRef().close(),
                      setTimeout(() => this.openCamera(), 300),
                    ]}>
                    <Icon
                      type="FontAwesome"
                      name="camera"
                      style={css.sheetBtnIcon}
                    />
                    <Text style={css.sheetBtnText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.sheetBtn}
                    onPress={() => [
                      this.getRBSheetRef().close(),
                      setTimeout(() => this.openLibrary(), 300),
                    ]}>
                    <Icon
                      type="FontAwesome"
                      name="image"
                      style={css.sheetBtnIcon}
                    />
                    <Text style={css.sheetBtnText}>Choose From Library</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.sheetBtn}
                    onPress={() => [
                      this.getRBSheetRef().close(),
                      setTimeout(() => this.removePhoto(), 300),
                    ]}>
                    <Icon
                      type="FontAwesome"
                      name="ban"
                      style={css.sheetBtnIcon}
                    />
                    <Text style={css.sheetBtnText}>Remove Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </RBSheet>
          </View>
        </KeyboardAwareScrollView>
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
    backgroundColor:'#1F1A31'
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  profilePicText: {
    fontFamily: fontRegular,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  fieldsWrap: {
    paddingHorizontal: 30,
    marginBottom: 10,
    flexDirection: 'column',
    width: '100%',
  },
  fields: {
    width: '100%',
    marginBottom: 35,
  },
  inputLabel: {
    fontFamily: fontBold,
    fontSize: 12,
    color: "#FFFFFF",
    textTransform: 'uppercase',
  },
  inputField: {
    height: 40,
    borderBottomColor:'#FFFFFF',
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: fontRegular,
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  selectField: {
    height: 40,
    fontSize: 16,
    fontFamily: fontRegular,
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  selectFieldBorder: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  inputFieldMultiline: {
    height: 40,
  },
  btnCustom: {
    width: 200,
    marginBottom: 30,
  },
  sheetWrap: {
    padding: 20,
  },
  sheetTitle: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  sheetBtnsWrap: {
    marginTop: 5,
  },
  sheetBtn: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  sheetBtnIcon: {
    fontSize: 22,
    color: colorAccent,
    width: 50,
  },
  sheetBtnText: {
    fontFamily: fontBold,
    color: colorBlack60,
  },
  
  header2:{

  }
});

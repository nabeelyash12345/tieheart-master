import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard, StatusBar, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker'
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import GlobalStore from '../components/GlobalStore';
import { observer } from 'mobx-react';
import { Icon } from 'native-base';
import moment from "moment";
import styles from '../Style';

@observer

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      nickName: null,
      email: null,
      aboutMe: null,
      relationList: [
        { "label": "Single", "value": "Single" },
        { "label": "In a relationship", "value": "In a relationship" },
        { "label": "Crushing", "value": "Crushing" },
        { "label": "Married", "value": "Married" },
        { "label": "Confused", "value": "Confused" }
      ],
      relation: 'Single',
      dob: '2003-01-01',
      gender: 'Male',
      photoPlaceholder: require('../assets/images/noimg_male.png'),
      isPhotoSelected: 'N',
      photo: _photo,
      photoBase64: null,
      photoPath: null,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('ProfileResume');
    });
    AsyncStorage.multiGet(["@nickName", "@dob", "@rStatus", "@email", "@aboutMe", "@photo", "@gender"]).then(response => {
      console.log(response[0][0]) // @nickName
      console.log(response[0][1]) // nickName value
      console.log(response[1][0]) // @dob
      console.log(response[1][1]) // dob value
      console.log(response[2][0]) // @rStatus
      console.log(response[2][1]) // rStatus value
      console.log(response[3][0]) // @email
      console.log(response[3][1]) // email value
      console.log(response[4][0]) // @aboutMe
      console.log(response[4][1]) // aboutMe value
      console.log(response[5][0]) // @photo
      console.log(response[5][1]) // photo value
      console.log(response[6][0]) // @gender
      console.log(response[6][1]) // gender value

      this.setState({
        nickName: response[0][1],
        dob: response[1][1],
        relation: response[2][1],
        email: response[3][1],
        aboutMe: response[4][1],
        photo: response[5][1],
        gender: response[6][1],
      });

      if (this.state.gender == 'Male') {
        this.setState({ photoPlaceholder: require('../assets/images/noimg_male.png') });
      } else if (this.state.gender == 'Female') {
        this.setState({ photoPlaceholder: require('../assets/images/noimg_female.png') });
      } else {
        this.setState({ photoPlaceholder: require('../assets/images/noimg_other.png') });
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

      if (this.state.photo != '') {
        this.setState({ photoPlaceholder: { uri: host_photo + this.state.photo } });
      }

    })
  }

  getRBSheetRef = () => this.RBSheet;

  openCamera() {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      let imagebase64 = image.path
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
      this.uploadPhoto();
    });
  }

  openLibrary() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      let imagebase64 = image.path
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
      this.uploadPhoto();
    });
  }

  uploadPhoto() {
    this.setState({
      showLoader: true,
    });

    var header = {
      'mobile': _mobile,
      'oldfile': GlobalStore.photo
    }

    var params = 'mobile=' + _mobile + '&oldfile=' + GlobalStore.photo;

    console.log('UploadPhoto API: ' + host_main + 'imageupload.ashx?' + params);

    const file = { uri: this.state.photoPath, name: new Date().getTime() + '.jpeg', type: 'image/jpeg' }
    const body = new FormData();
    body.append('File', file);

    fetch(host_main + 'imageupload.ashx', {
      method: 'POST',
      headers: header,
      body: body,
    })
      .then((response) => response.text())
      .then((responseJson) => {

        this.setState({
          showLoader: false,
        });

        console.log('UploadPhoto API Response: ' + responseJson);

        if (responseJson.indexOf('Success') >= 0) {
          var filename = (responseJson.split('::'));
          console.log('filename: ' + filename[1]);
          AsyncStorage.setItem('@photoBase64', this.state.photoBase64);
          AsyncStorage.setItem('@photo', filename[1]);
          GlobalStore.setPhoto(filename[1]);
          GlobalStore.setPhotoBase64(this.state.photoBase64);
          this.setState({
            isPhotoSelected: 'Y',
            photo: filename[1],
          });
        } else {
          Alert.alert('Error', 'Failed to upload photo. Please try again.');
          this.setState({
            isPhotoSelected: 'N',
          });
        }

      })
      .catch((error) => {
        Alert.alert('Error', error.message);
        console.log('UploadPhoto API Error: ' + error.message);
        this.setState({
          showLoader: false,
        });
      });
  }

  removePhoto() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile + '&oldfile=' + GlobalStore.photo;
    console.log('ProfilepicRemove API: ' + host + 'ProfilepicRemove' + params);
    fetch(host + 'ProfilepicRemove' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {

        console.log('ProfilepicRemove API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson.indexOf('Y') >= 0) {
          AsyncStorage.setItem('@photoBase64', '');
          AsyncStorage.setItem('@photo', '');
          GlobalStore.setPhoto('');
          GlobalStore.setPhotoBase64('');
          this.setState({
            isPhotoSelected: 'N',
            photoBase64: null,
            photoPath: null,
            photo: '',
          });
          _photo = '';
          if (this.state.gender == 'Male') {
            this.setState({ photoPlaceholder: require('../assets/images/noimg_male.png') });
          } else if (this.state.gender == 'Female') {
            this.setState({ photoPlaceholder: require('../assets/images/noimg_female.png') });
          } else {
            this.setState({ photoPlaceholder: require('../assets/images/noimg_other.png') });
          }
        } else {
          Alert.alert('Error', 'Unable to remove photo. Please try again.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to remove photo. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  updateProfile() {
    if (this.state.nickName < 1) {
      Alert.alert('Error', 'Please enter Nick Name');
      return false;
    }

    var dob = moment(this.state.dob);
    var currentDate = moment(this.formatCurrentDate());
    console.log('Age: ' + currentDate.diff(dob, 'years'));

    _age = currentDate.diff(dob, 'years').toString();

    if (currentDate.diff(dob, 'years') < 18) {
      Alert.alert('Error', 'Your age should not be less than 18 years.');
      return false;
    }

    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile + '&nickname=' + this.state.nickName + '&Rstatus=' + this.state.relation + '&Dob=' + this.state.dob + '&About=' + this.state.aboutMe + '&Emailid=' + this.state.email;
    console.log('UpdateProfile API: ' + host + 'UpdateProfile' + params);
    fetch(host + 'UpdateProfile' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log('UpdateProfile API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson[0].Mobile == undefined) {
          Alert.alert('Error', 'Unable to update profile. Please try again.');
        } else {
          Alert.alert('Success', 'Profile updated.');
          AsyncStorage.setItem('@nickName', this.notNull(this.state.nickName));
          AsyncStorage.setItem('@dob', this.notNull(this.state.dob));
          AsyncStorage.setItem('@rStatus', this.notNull(this.state.relation));
          AsyncStorage.setItem('@email', this.notNull(this.state.email));
          AsyncStorage.setItem('@aboutMe', this.notNull(this.state.aboutMe));
          AsyncStorage.setItem('@age', _age);
          GlobalStore.setNickName(this.state.nickName);
          GlobalStore.setAge(_age);
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to update profile. Please try again.');
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

  formatCurrentDate() {
    var newDate = moment(new Date()).format("YYYY-MM-DD")
    return newDate;
  }

 

  render() {
    return (
      <SafeAreaView style={css.safeArea12}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[colorPrimary, colorSecondary]} style={{ height: statusBarHeight }}>
          <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'} />
        </LinearGradient >
        <View style={styles.headerPrimary}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.navBtn} onPress={() => this.props.navigation.goBack()}>
              <Icon type="Ionicons" name="ios-arrow-back" style={styles.navBtnIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        <KeyboardAwareScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps='never'
          scrollEventThrottle={10}
          extraHeight={250}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled>
          <View style={css.mainWrap}>
            <View style={css.profileHeader}>
              {this.state.isPhotoSelected == 'N' ?
                <Image source={this.state.photoPlaceholder} style={css.profilePic} /> :
                <Image source={{ uri: GlobalStore.photoBase64 }} style={css.profilePic} />
              }
              <TouchableOpacity activeOpacity={0.5} onPress={() => this.getRBSheetRef().open()}>
                <Text style={css.profilePicText}>Change Profile Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={css.fieldsWrap}>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Nick Name</Text>
                <TextInput style={css.inputField} placeholder={'Enter Nick Name'} placeholderTextColor={'white'} onChangeText={(nickName) => this.setState({ nickName })} value={this.state.nickName} />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Date of Birth</Text>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={'Enter Date of Birth'}
                  placeholderTextColor={'#FFFFFF'}
                  date={this.state.dob}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate="1970-01-01"
                  confirmBtnText="OK"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  onDateChange={(dob) => { this.setState({ dob: dob }) }}
                  customStyles={{
                    dateInput: {
                      height: 40,
                      borderWidth: 0,
                      alignItems: 'flex-start',
                    },
                    dateTouchBody: {
                      borderBottomColor: colorWhite,
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 5,
                    },
                    dateText: {
                      fontSize: 16,
                      fontFamily: fontRegular,
                      color: colorWhite,
                      textAlign: 'left'
                    }
                  }}
                />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Relationship Status</Text>
                <Picker
                  selectedValue={this.state.relation}
                  style={{color:'#FFFFFF'}}
                  onValueChange={(itemValue, itemIndex) => this.setState({ relation: itemValue })}>
                  {this.state.relationList.map((item, key) => (
                    <Picker.Item label={item.label} value={item.value} key={key} />
                  ))}
                </Picker>
                <View style={css.selectFieldBorder}></View>
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>Email Address</Text>
                <TextInput style={css.inputField} placeholderTextColor={'#FFFFFF'} placeholder={'Enter Email Address'} onChangeText={(email) => this.setState({ email })} value={this.state.email} />
              </View>
              <View style={css.fields}>
                <Text style={css.inputLabel}>About Me</Text>
                <TextInput style={[css.inputField, css.inputFieldMultiline]} placeholderTextColor={'#FFFFFF'} placeholder={'Enter Something About You'} multiline={true} onChangeText={(aboutMe) => this.setState({ aboutMe })} value={this.state.aboutMe} />
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.5} style={[styles.btn, styles.btnAccent, css.btnCustom]} onPress={() => this.updateProfile()}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={210}
              openDuration={250}
              closeDuration={200}>
              <View style={css.sheetWrap}>
                <Text style={css.sheetTitle}>Change Profile Photo</Text>
                <View style={css.sheetBtnsWrap}>
                  <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetRef().close(), setTimeout(() => this.openCamera(), 300)]}>
                    <Icon type="FontAwesome" name="camera" style={css.sheetBtnIcon} />
                    <Text style={css.sheetBtnText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetRef().close(), setTimeout(() => this.openLibrary(), 300)]}>
                    <Icon type="FontAwesome" name="image" style={css.sheetBtnIcon} />
                    <Text style={css.sheetBtnText}>Choose From Library</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetRef().close(), setTimeout(() => this.removePhoto(), 300)]}>
                    <Icon type="FontAwesome" name="ban" style={css.sheetBtnIcon} />
                    <Text style={css.sheetBtnText}>Remove Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </RBSheet>
          </View>
        </KeyboardAwareScrollView>
        {this.state.showLoader ?
          <View style={styles.loader}>
            <ActivityIndicator animating={true} color={colorAccent} size="large" />
          </View> : null}
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
    zIndex: 1
  },
  safeArea12:{
    flex: 1,
    backgroundColor: "#1F1A31",
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
    borderColor: colorBlack10,
  },
  profilePicText: {
    fontFamily: fontRegular,
    fontSize: 14,
    color: colorAccent,
    textAlign: 'center',
    paddingVertical: 10,
    marginTop: 5
  },
  fieldsWrap: {
    paddingHorizontal: 30,
    marginBottom: 10,
    flexDirection: 'column',
    width: '100%'
  },
  fields: {
    width: '100%',
    marginBottom: 35
  },
  inputLabel: {
    fontFamily: fontBold,
    fontSize: 12,
    color: colorWhite,
    textTransform: 'uppercase',
  },
  inputField: {
    height: 40,
    borderBottomColor: colorWhite,
    borderBottomWidth: 1,
    fontSize: 18,
    fontFamily: fontRegular,
    color: colorWhite,
    paddingVertical: 8,
    paddingHorizontal: 5
  },
  selectFieldBorder: {
    borderBottomColor: colorWhite,
    borderBottomWidth: 1,
  },
  inputFieldMultiline: {
    height: 60,
  },
  btnCustom: {
    width: 200,
    marginBottom: 30
  },
  sheetWrap: {
    padding: 20,
  },
  sheetTitle: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left'
  },
  sheetBtnsWrap: {
    marginTop: 5
  },
  sheetBtn: {
    flexDirection: 'row',
    paddingVertical: 12
  },
  sheetBtnIcon: {
    fontSize: 22,
    color: colorWhite,
    width: 50
  },
  sheetBtnText: {
    fontFamily: fontBold,
    color: colorBlack60,
  }
});
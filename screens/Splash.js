import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalStore from '../components/GlobalStore';
import {observer} from 'mobx-react';
import moment from 'moment';
import styles from '../Style';
import {updateMyId} from './Chat/chat-slice';
import {connect} from 'react-redux';
import {manageMyId} from '../src/firebase/firebase';

@observer
class Splash extends Component {
  UNSAFE_componentWillMount() {
    this.checkLoggedin();
  }

  UNSAFE_componentWillUnmount() {
    //
  }

  constructor(props) {
    super(props);
    this.state = {
      notifIndicator: false,
      name: '',
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('SplashResume');
      //this.checkLoggedin();
    });
  }

  checkLoggedin() {
    AsyncStorage.multiGet([
      '@countryCode',
      '@mobile',
      '@name',
      '@nickName',
      '@dob',
      '@gender',
      '@rStatus',
      '@status',
      '@aboutMe',
      '@email',
      '@paymentStatus',
      '@PaymentExpiryDate',
      '@allNotification',
      '@chatNotification',
      '@matchNotification',
      '@crush',
      '@paymentReavel',
      '@joiningDate',
      '@photo',
      '@photoBase64',
      '@fcmToken',
    ]).then((response) => {
      console.log(response[0][0]); // @countryCode
      console.log(response[0][1]); // countryCode value
      console.log(response[1][0]); // @mobile
      console.log(response[1][1]); // mobile value
      console.log(response[2][0]); // @name
      console.log(response[2][1]); // name value
      console.log(response[3][0]); // @nickName
      console.log(response[3][1]); // nickName value
      console.log(response[4][0]); // @dob
      console.log(response[4][1]); // dob value
      console.log(response[5][0]); // @gender
      console.log(response[5][1]); // gender value
      console.log(response[6][0]); // @rStatus
      console.log(response[6][1]); // rStatus value
      console.log(response[7][0]); // @status
      console.log(response[7][1]); // status value
      console.log(response[8][0]); // @aboutMe
      console.log(response[8][1]); // aboutMe value
      console.log(response[9][0]); // @email
      console.log(response[9][1]); // email value
      console.log(response[10][0]); // @paymentStatus
      console.log(response[10][1]); // paymentStatus value
      console.log(response[11][0]); // @PaymentExpiryDate
      console.log(response[11][1]); // PaymentExpiryDate value
      console.log(response[12][0]); // @allNotification
      console.log(response[12][1]); // allNotification value
      console.log(response[13][0]); // @chatNotification
      console.log(response[13][1]); // chatNotification value
      console.log(response[14][0]); // @matchNotification
      console.log(response[14][1]); // matchNotification value
      console.log(response[15][0]); // @crush
      console.log(response[15][1]); // crush value
      console.log(response[16][0]); // @paymentReavel
      console.log(response[16][1]); // paymentReavel value
      console.log(response[17][0]); // @joiningDate
      console.log(response[17][1]); // joiningDate value
      console.log(response[18][0]); // @photo
      console.log(response[18][1]); // photo value
      //console.log(response[19][0]) // @photoBase64
      //console.log(response[19][1]) // photoBase64 value
      console.log(response[20][0]); // @fcmToken
      console.log(response[20][1]); // fcmToken value

      if (response[1][1]) {
        _countryCode = response[0][1];
        _mobile = response[1][1];
        manageMyId.updateMyId(_mobile);
        _name = response[2][1];
        _nickName = response[3][1];
        _dob = response[4][1];
        _gender = response[5][1];
        _rStatus = response[6][1];
        _status = response[7][1];
        _aboutMe = response[8][1];
        _email = response[9][1];
        _paymentStatus = response[10][1];
        _PaymentExpiryDate = response[11][1];
        _allNotification = response[12][1];
        _chatNotification = response[13][1];
        _matchNotification = response[14][1];
        _crush = response[15][1];
        _paymentReavel = response[16][1];
        _joiningDate = response[17][1];
        _photo = response[18][1];
        _photoBase64 = response[19][1];
        _fcmToken = response[20][1];

        var dob = moment(_dob);
        var currentDate = moment(this.formatCurrentDate());
        console.log('Age: ' + currentDate.diff(dob, 'years'));

        _age = currentDate.diff(dob, 'years').toString();

        GlobalStore.setNickName(_nickName);
        this.props.dispatch(updateMyId({id: _mobile}));
        GlobalStore.setPhoto(_photo);
        GlobalStore.setPhotoBase64(this.notNull(_photoBase64));
        GlobalStore.setAge(_age);

        this.navigateTo('Home');
      } else {
        this.navigateTo('Intro');
      }
    });
  }

  navigateTo(screenName) {
    //setTimeout(() => this.props.navigation.replace(screenName), 2000);
    this.props.navigation.replace(screenName);
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

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colorWhite} />
        <View style={css.splashWrap}>
          <AutoHeightImage
            width={160}
            source={require('../assets/images/SFHFFFS.png')}
            style={css.logo}
          />
          <ActivityIndicator
            animating={true}
            color={colorAccent}
            size="large"
            style={css.loading}
          />
          <View style={css.footer}>
            <Text style={css.versionName}>Version {appVersion}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(null, (dispatch) => ({dispatch}))(Splash);

const css = StyleSheet.create({
  splashWrap: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    marginBottom: 40,
  },
  versionName: {
    fontFamily: fontThin,
    fontSize: 14,
    color: colorBlack90,
    marginTop: 10,
  },
  loading: {
    marginTop: 40,
    marginBottom: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
});

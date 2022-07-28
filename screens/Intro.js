import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'react-native-paper';
import styles from '../Style';

export default class Intro extends Component {
  constructor(props) {
    super(props);
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
        <View style={css.mainWrap}>
          <Text style={css.title}>Default OTP for Sign In is</Text>
          <Text style={css.otpVal}>123456</Text>
          <Text style={css.subtitle}>Please use only this OTP for login.</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.btn, styles.btnPrimary, css.customBtn]}
            onPress={() => {
              this.props.navigation.replace('Login');
            }}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontFamily: fontRegular,
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 30,
  },
  otpVal: {
    fontFamily: fontBold,
    color: '#FFFFFF',
    fontSize: 30,
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: fontRegular,
    color:'#FFFFFF',
    fontSize: 16,
    marginBottom: 50,
  },
  customBtn: {
    width: 200,
    backgroundColor:'#07F83C'
  },
});

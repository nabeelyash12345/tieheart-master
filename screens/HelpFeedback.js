import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import AutoHeightImage from 'react-native-auto-height-image';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import styles from '../Style';

export default class HelpFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      feedback: null,
    };
  }

  sendFeedback() {
    if (this.state.feedback < 1) {
      Alert.alert('Error', 'Please enter Feedback');
      return false;
    }
    this.setState({
      showLoader: true,
    });
    var params = '?mobilenumber=' + _mobile + '&vcdesc=' + this.state.feedback;
    console.log('Feedback API: ' + host + 'Savefeedback' + params);
    fetch(host + 'Savefeedback' + params, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('Feedback API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson.indexOf('Y') >= 0) {
          Alert.alert(
            'Thank You',
            'Your feedback has been received.',
            [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
            {cancelable: false},
          );
        } else {
          Alert.alert('Error', 'Unable to send feedback. Please try again.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to send feedback. Please try again.');
        this.setState({
          showLoader: false,
        });
      });
  }

  sendMail() {
    Linking.openURL(`mailto:${emailCare}`);
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
          <Text style={styles.headerTitle}>Help &amp; Feedback</Text>
        </View>
        <KeyboardAwareScrollView
          style={{zIndex: 1}}
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps="never"
          scrollEventThrottle={10}
          extraHeight={250}
          resetScrollToCoords={{x: 0, y: 0}}
          scrollEnabled>
          <View style={css.mainWrap}>
            <Text style={css.headerTitle}>Send Feedback</Text>
            <Text style={css.headerSubitle}>
              Tell us what you love about the app, or what we could be doing
              better.
            </Text>
            <View style={css.fields}>
              <TextInput
                style={[css.inputField, css.inputFieldMultiline]}
                placeholder={'Enter your feedback'}
                multiline={true}
                onChangeText={(feedback) => this.setState({feedback})}
              />
            </View>
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => this.sendMail()}>
              <Text style={css.footerSubitle}>
                If you have more detailed feedback to share, good and bad, we
                want it all. Just drop in an email to{' '}
                <Text style={css.footerSubitleLink}>{emailCare}</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.btn, styles.btnAccent, css.btnCustom]}
              onPress={() => this.sendFeedback()}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <AutoHeightImage
          width={win.width}
          source={require('../assets/images/bg_feedback.png')}
          style={css.bg}
        />
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
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bg: {
    opacity: 0.4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  headerTitle: {
    fontFamily: fontBold,
    color: '#191036',
    fontSize: 24,
    marginTop: 30,
    paddingHorizontal: 30,
  },
  headerSubitle: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
    paddingHorizontal: 30,
  },
  footerSubitle: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 50,
    paddingHorizontal: 30,
  },
  footerSubitleLink: {
    fontFamily: fontRegular,
    color: colorSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  fields: {
    width: '100%',
    padding: 30,
  },
  inputLabel: {
    fontFamily: fontBold,
    fontSize: 12,
    color: colorBlack60,
    textTransform: 'uppercase',
  },
  inputField: {
    height: 40,
    borderColor: colorBlack60,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    fontFamily: fontRegular,
    color: colorBlack,
    paddingVertical: 10,
    paddingHorizontal: 14,
    textAlignVertical: 'top',
    backgroundColor: colorWhite50,
  },
  inputFieldMultiline: {
    height: 120,
  },
  btnCustom: {
    width: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

import React, {Component} from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import queryString from 'query-string';
import {Icon} from 'native-base';
import styles from '../Style';

export default class Payment extends Component {
  UNSAFE_componentWillMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick.bind(this),
    );
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  UNSAFE_componentWillUnmount() {
    this.backHandler.remove();
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      title: props.navigation.state.params.title,
      url: props.navigation.state.params.url,
      showResult: false,
      isPaymentSuccess: false,
      paymentTitle: null,
      paymentMsg: null,
      amount: null,
      transactionId: null,
    };
    this.backHandler = null;
    //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.props.navigation.addListener('willFocus', () => {
      console.log('PaymentResume');
      console.log(this.state.url);
    });
  }

  handleBackButtonClick() {
    if (this.state.showResult) {
      this.resetComponent();
    } else {
      this.confirmCancel();
    }
    return true;
  }

  _onNavigationStateChange(webViewState) {
    console.log(webViewState.url);
    var _url = webViewState.url;
    var _url_trim = _url.split('?');
    const query = queryString.parse(_url_trim[1]);
    console.log('Order No. ', query.orderno);
    console.log('Amount ', query.amount);

    if (true) {
      console.log('Payment Success');
      this.setState({
        showResult: true,
        isPaymentSuccess: true,
        paymentTitle: 'Payment Successful',
        paymentMsg:
          'Your payment has been processed.\nDetails of the transaction has been included below.',
        amount: 2,
        transactionId: '1',
      });
    } else if (_url.indexOf('payment-fail.aspx') >= 0) {
      console.log('Payment Failed');
      this.setState({
        showResult: true,
        isPaymentSuccess: false,
        paymentTitle: 'Payment Failed',
        paymentMsg:
          'Your payment has been failed.\nDetails of the transaction has been included below.',
        amount: query.amount,
        transactionId: query.orderno,
      });
    }
  }

  _onBackNav() {
    if (this.state.showResult) {
      this.resetComponent();
    } else {
      this.confirmCancel();
    }
  }

  confirmCancel() {
    Alert.alert(
      'Cancel Payment',
      'Are you sure?',
      [
        {text: 'No'},
        {
          text: 'Yes',
          onPress: () => {
            this.backHandler.remove(), this.props.navigation.goBack(null);
          },
        },
      ],
      {cancelable: false},
    );
  }

  resetComponent() {
    this.backHandler.remove();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Home'})],
    });
    this.props.navigation.dispatch(resetAction);
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
              onPress={() => this._onBackNav()}>
              <Icon
                type="Ionicons"
                name="ios-arrow-back"
                style={styles.navBtnIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>{this.state.title}</Text>
        </View>
        <View style={css.mainWrap}>
          <WebView
            source={{uri: this.state.url}}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            mediaPlaybackRequiresUserAction={true}
            ref={(ref) => (this.webview = ref)}
            onLoadStart={(syntheticEvent) => {
              this.setState({showLoader: true});
            }}
            onLoadEnd={(syntheticEvent) => {
              this.setState({showLoader: false});
            }}
            onError={(syntheticEvent) => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          />
          {this.state.showResult ? (
            <View style={css.viewWrap}>
              {this.state.isPaymentSuccess ? (
                <Icon
                  type="Ionicons"
                  name="checkmark-circle"
                  style={css.iconSuccess}
                />
              ) : (
                <Icon
                  type="Ionicons"
                  name="close-circle"
                  style={css.iconFailed}
                />
              )}
              <Text
                style={
                  this.state.isPaymentSuccess
                    ? css.titleSuccess
                    : css.titleFailed
                }>
                {this.state.paymentTitle}
              </Text>
              <Text style={css.paymentInfo}>{this.state.paymentMsg}</Text>
              <View style={css.infoBox}>
                <View style={css.infoBoxRow}>
                  <Text style={[css.infoBoxLabel, css.boldTxt]}>Amount</Text>
                  <Text style={[css.infoBoxValue, css.boldTxt]}>
                    ₹{this.state.amount}
                  </Text>
                </View>
                <View style={css.infoBoxRow}>
                  <Text style={css.infoBoxLabel}>Transaction ID</Text>
                  <Text style={css.infoBoxValue}>
                    {this.state.transactionId}
                  </Text>
                </View>
                <View style={css.infoBoxRow}>
                  <Text style={css.infoBoxLabel}>Mobile No.</Text>
                  <Text style={css.infoBoxValue}>{_mobile}</Text>
                </View>
              </View>
              <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={[colorPrimary, colorSecondary]}
                      style={[styles.btn, css.btnCustom]}
                    >
              <TouchableOpacity
                activeOpacity={0.5}
                style={{width:'100%', height:64, justifyContent:'center', alignItems:'center'}}
                onPress={() => this.resetComponent()}>
                <Text style={styles.btnText}>Back to Home</Text>
              </TouchableOpacity>
              </LinearGradient>
            </View>
          ) : null}
        </View>
        {this.state.showLoader ? (
          <View style={[styles.loader, css.loader_nobg]}>
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
  loader_nobg: {
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  viewWrap: {
    backgroundColor: '#eeeeee',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  iconSuccess: {
    fontSize: 80,
    color: '#44ab97',
    marginBottom: 10,
  },
  iconFailed: {
    fontSize: 80,
    color: '#b33432',
    marginBottom: 10,
  },
  titleSuccess: {
    fontFamily: fontBold,
    color: '#44ab97',
    fontSize: 22,
  },
  titleFailed: {
    fontFamily: fontBold,
    color: '#b33432',
    fontSize: 22,
  },
  paymentInfo: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  infoBox: {
    backgroundColor: colorWhite,
    marginTop: 40,
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 5,
    borderRadius: 5,
    borderTopColor: '#dc8f27',
    borderTopWidth: 3,
    borderBottomColor: colorBlack10,
    borderBottomWidth: 1,
  },
  infoBoxRow: {
    flexDirection: 'row',
    width: 270,
    marginBottom: 15,
  },
  infoBoxLabel: {
    flex: 1,
    fontFamily: fontRegular,
    color: colorBlack80,
    fontSize: 16,
  },
  infoBoxValue: {
    fontFamily: fontRegular,
    color: colorBlack80,
    fontSize: 16,
  },
  boldTxt: {
    fontFamily: fontBold,
  },
  btnCustom: {
    width: 200,
    marginTop: 40,
  },
});

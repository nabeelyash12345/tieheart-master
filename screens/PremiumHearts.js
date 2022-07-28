import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import styles from '../Style';

export default class PremiumHearts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBtn: true,
      heartCost: 99,
      minimumPlan: 199,
      totalLikeLove: props.navigation.state.params.totalLikeLove,
      isPlanActive: props.navigation.state.params.isPlanActive,
      paymentUrl: null,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('PremiumHearts Focused');
      console.log('Total Hearts: ' + this.state.totalLikeLove);
      console.log('Is Plan Active: ' + this.state.isPlanActive);
      if (!this.state.isPlanActive) {
        this.setState({
          paymentUrl:
            host_payment +
            '?plan=1&type1=heart&nohearts=' +
            this.state.totalLikeLove +
            '&mobile=' +
            _mobile,
        });
      } else {
        this.setState({
          paymentUrl:
            host_payment +
            '?plan=0&type1=heart&nohearts=' +
            this.state.totalLikeLove +
            '&mobile=' +
            _mobile,
        });
      }
    });
  }

  costToPay() {
    var total = this.state.heartCost * this.state.totalLikeLove;
    if (!this.state.isPlanActive) {
      total = total + this.state.minimumPlan;
    }
    return total;
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
          <Text style={styles.headerTitle}>TieHearts Premium</Text>
        </View>
        <ScrollView bounces={false} style={{backgroundColor: '#edf3f8'}}>
          <View style={css.mainWrap}>
            <Text style={css.titleInfo}>
              With this plan you can reveal the name and contact number of the
              person who has submitted Love/Like for you.{'\n'} You can Tie your
              Hearts if you feel the same.
            </Text>
            <View style={css.infoBoxCustom}>
              <View style={css.infoBoxRowCustom}>
                <Text style={css.infoTextCustom}>
                  Reveal {this.state.totalLikeLove}{' '}
                  <Icon
                    type="FontAwesome"
                    name="heart"
                    style={css.infoIconCustom}
                  />
                </Text>
                {!this.state.isPlanActive ? (
                  <View>
                    <Text style={css.infoTextCustom}>+</Text>
                    <Text style={css.infoTextCustomSmall}>
                      1 Month 'TieHearts Fortune' Subscription
                    </Text>
                  </View>
                ) : null}
                <Text style={css.infoTextCustomBig}>@ ₹{this.costToPay()}</Text>
              </View>
            </View>
            {!this.state.isPlanActive ? (
              <View>
                <Text style={css.title}>TieHearts Fortune</Text>
                <Text style={(css.titleInfo, {paddingTop: 10})}>
                  You can reveal all future Hearts at discounted price.
                </Text>
                <View style={css.infoBox}>
                  <View style={css.infoBoxRow}>
                    <Icon
                      type="Feather"
                      name="arrow-right"
                      style={css.infoIcon}
                    />
                    <Text style={css.infoText}>
                      Track if your Crush has downloaded the 'TieHearts' App or
                      not.
                    </Text>
                  </View>
                  <View style={css.infoBoxRow}>
                    <Icon
                      type="Feather"
                      name="arrow-right"
                      style={css.infoIcon}
                    />
                    <Text style={css.infoText}>
                      Track if your Crush has locked his/her feelings.
                    </Text>
                  </View>
                  <View style={css.infoBoxRow}>
                    <Icon
                      type="Feather"
                      name="arrow-right"
                      style={css.infoIcon}
                    />
                    <Text style={css.infoText}>
                      Reveal each Heart @ ₹{this.state.heartCost}.
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.btn, styles.btnAccent, css.btnCustom]}
              onPress={() =>
                this.props.navigation.navigate('Payment', {
                  title: 'Payment',
                  url: this.state.paymentUrl,
                })
              }>
              <Text style={styles.btnText}>
                Proceed to pay ₹{this.costToPay()}
              </Text>
            </TouchableOpacity>
            <View style={css.linksWrap}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('WebpageView', {
                    title: 'Privacy Policy',
                    page: 'privacypermission.aspx',
                  });
                }}>
                <Text style={css.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={css.linkDivider}> | </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('WebpageView', {
                    title: 'Terms of Service',
                    page: 'termsandconditions.aspx',
                  });
                }}>
                <Text style={css.linkText}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#edf3f8',
    paddingBottom: 20,
  },
  titleInfo: {
    fontFamily: fontRegular,
    color: colorBlack50,
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontFamily: fontBold,
    color: '#191036',
    fontSize: 22,
    paddingTop: 30,
  },
  titleSecondary: {
    fontFamily: fontBold,
    color: colorSecondary,
    fontSize: 22,
    paddingTop: 40,
  },
  infoBox: {
    backgroundColor: '#fff7d4',
    width: '85%',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    borderRadius: 10,
    borderColor: colorAccent,
    borderWidth: 2,
    shadowColor: colorBlack70,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoBoxCustom: {
    backgroundColor: '#ffd4d4',
    width: '85%',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    borderRadius: 10,
    borderColor: colorAccent,
    borderWidth: 2,
    shadowColor: colorBlack70,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoBoxRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoBoxRowCustom: {
    marginBottom: 15,
  },
  infoIcon: {
    fontSize: 18,
    color: colorSecondary,
    marginRight: 10,
  },
  infoIconCustom: {
    fontSize: 18,
    color: colorAccent,
  },
  infoText: {
    fontFamily: fontRegular,
    color: colorPrimary,
    fontSize: 16,
  },
  infoTextCustom: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
  },
  infoTextCustomSmall: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  infoTextCustomBig: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 20,
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
  btnCustom: {
    width: 220,
    marginTop: 30,
  },
  linksWrap: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  linkText: {
    fontFamily: fontRegular,
    color: colorAccent,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  linkDivider: {
    color: colorBlack20,
  },
});

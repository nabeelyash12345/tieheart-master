import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import styles from '../Style';

export default class Seewho extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      isPlanActive: props.navigation.state.params.isPlanActive,
      totalLikeLove: props.navigation.state.params.totalLikeLove,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('SeeWhoResume');
      if (this.state.isPlanActive) {
        console.log(
          'Plan is active, Total like/love: ' + this.state.totalLikeLove,
        );
      } else {
        console.log(
          'Plan is expired, Total like/love: ' + this.state.totalLikeLove,
        );
      }
    });
  }

  purchasePlan() {
    if (!this.state.isPlanActive && this.state.totalLikeLove == 0) {
      this.props.navigation.navigate('Premium');
    } else if (!this.state.isPlanActive && this.state.totalLikeLove != 0) {
      this.props.navigation.navigate('PremiumHearts', {
        isPlanActive: this.state.isPlanActive,
        totalLikeLove: this.state.totalLikeLove,
      });
    }
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
          <Text style={styles.headerTitle}>People Love/Like You</Text>
        </View>
        <ImageBackground
          source={require('../assets/images/bg_circles.png')}
          style={css.bg}>
          <ScrollView bounces={false}>
            <View style={css.mainWrap}>
              <AutoHeightImage
                width={120}
                source={require('../assets/images/logo.png')}
                style={css.iconHeader}
              />
              <Text style={css.title}>Find who all Love / Like you</Text>
              <Text style={css.subtitle}>
                With 'TieHearts Fortune' you can reveal the identity of the
                person who submitted feelings for you, using your contact
                number. ({_countryCode}-{_mobile})
              </Text>
              {_gender == 'Male' ? (
                <AutoHeightImage
                  width={180}
                  source={require('../assets/images/b_female.png')}
                  style={css.iconBottom}
                />
              ) : (
                <AutoHeightImage
                  width={180}
                  source={require('../assets/images/b_male.png')}
                  style={css.iconBottom}
                />
              )}
              <Text style={css.subtitle}>
                Click 'Reveal' to know who are they.
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.purchasePlan();
                }}
                style={[styles.btn, styles.btnAccent, css.btnCustom]}>
                <Text style={styles.btnText}>Reveal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
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
  },
  iconHeader: {
    marginTop: 50,
    marginBottom: 20,
  },
  iconBottom: {
    marginBottom: 20,
  },
  title: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontFamily: fontRegular,
    color: colorBlack80,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  btnCustom: {
    width: 200,
    marginBottom: 30,
  },
});

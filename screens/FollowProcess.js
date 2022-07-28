import React, {Component} from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import styles from '../Style';

export default class FollowProcess extends Component {
  UNSAFE_componentWillMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick.bind(this),
    );
  }

  UNSAFE_componentWillUnmount() {
    this.backHandler.remove();
  }

  constructor(props) {
    super(props);
    this.state = {
      isNewUser: props.navigation.state.params.isNewUser,
    };
    this.backHandler = null;
    this.props.navigation.addListener('willFocus', () => {
      console.log('FollowProcess Focused');
    });
  }

  handleBackButtonClick() {
    this.confirmGoBack();
    return true;
  }

  resetComponent() {
    this.backHandler.remove();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Splash'})],
    });
    this.props.navigation.dispatch(resetAction);
  }

  confirmGoBack() {
    if (this.state.isNewUser) {
      this.resetComponent();
    } else {
      this.backHandler.remove();
      this.props.navigation.goBack();
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
              onPress={() => this.confirmGoBack()}>
              <Icon
                type="Ionicons"
                name="ios-arrow-back"
                style={styles.navBtnIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Already have a partner?</Text>
        </View>
        <ImageBackground
          source={require('../assets/images/bg.jpg')}
          style={css.bg}
        />
        <ScrollView bounces={false}>
          <View style={css.mainWrap}>
            <Text style={css.headerTitle}>
              Follow an easy process to get a free access to 'Couple Space'.
            </Text>
            <View style={css.stepsWrap}>
              <View style={css.stepRow}>
                <Icon type="Ionicons" name="heart" style={css.stepIcon} />
                <Text style={css.stepCount}>1</Text>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Lock your feelings</Text>
                  <Text style={css.stepText}>
                    Select the contact number of your partner and lock your
                    feelings as 'Love'.
                  </Text>
                </View>
              </View>
              <View style={css.stepRow}>
                <Icon type="Ionicons" name="heart" style={css.stepIcon} />
                <Text style={css.stepCount}>2</Text>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Download the app</Text>
                  <Text style={css.stepText}>
                    Ask your partner to download 'TieHearts' app from Google
                    Play.
                  </Text>
                </View>
              </View>
              <View style={css.stepRow}>
                <Icon type="Ionicons" name="heart" style={css.stepIcon} />
                <Text style={css.stepCount}>3</Text>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Select contact as crush</Text>
                  <Text style={css.stepText}>
                    Ask your partner to select your phone number as crush and
                    submit feelings as 'Love'.
                  </Text>
                </View>
              </View>
              <View style={css.stepRow}>
                <Icon type="Ionicons" name="heart" style={css.stepIcon} />
                <Text style={css.stepCount}>4</Text>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Enjoy Couple Space</Text>
                  <Text style={css.stepText}>
                    Its 'TieHearts'. Enjoy the free access to 'Couple Space'.
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.btn, styles.btnAccent, css.btnCustom]}
              onPress={() => this.confirmGoBack()}>
              <Text style={styles.btnText}>Awesome</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    position: 'absolute',
    top: statusBarHeight,
    // opacity: 0.5,
  },
  btnCustom: {
    width: 200,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  stepsWrap: {
    paddingHorizontal: 20,
  },
  stepRow: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 20,
  },
  stepCount: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    top: 16,
    left: 5,
    zIndex: 1,
    width: 40,
  },
  stepIcon: {
    fontSize: 50,
    color: colorAccent,
  },
  stepCol: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  stepLabel: {
    fontFamily: fontBold,
    color: colorAccent,
    fontSize: 16,
    marginBottom: 10,
  },
  stepText: {
    fontFamily: fontRegular,
    color: '#FFFFFF',
    fontSize: 14,
  },
  headerTitle: {
    fontFamily: fontBold,
    color: '#FFFFFF',
    fontSize: 20,
    marginVertical: 30,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import styles from '../Style';

export default class WebpageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      title: props.navigation.state.params.title,
      page: props.navigation.state.params.page,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('WebpageResume');
      console.log(host_main + this.state.page);
    });
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
          <Text style={styles.headerTitle}>{this.state.title}</Text>
        </View>
        <View style={css.mainWrap}>
          <WebView
            source={{uri: host_main + this.state.page}}
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
          />
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
});

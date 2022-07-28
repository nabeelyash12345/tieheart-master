import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  BackHandler,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Icon} from 'native-base';
import styles from '../Style';

export default class MediaView extends Component {
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
      isPhoto: true,
      url: props.navigation.state.params.url,
      type: props.navigation.state.params.type,
      images: [
        {
          //url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
          url: props.navigation.state.params.url,
          props: {
            // headers: ...
          },
        },
      ],
    };
    this.backHandler = null;
    this.props.navigation.addListener('willFocus', () => {
      console.log('MediaResume');
      console.log(this.state.url + ' :: ' + this.state.type);
    });
  }

  onBuffer() {
    console.log('Buffering..');
  }

  videoError() {
    console.log('Error');
  }

  handleBackButtonClick() {
    console.log('BACK PRESSED!!!!');
    if (this.state.type == 'photo') {
      this.setState({
        isPhoto: false,
      });
      this.backHandler.remove(), this.props.navigation.goBack(null);
    } else {
      this.backHandler.remove(), this.props.navigation.goBack(null);
    }
    return true;
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
          <Text style={styles.headerTitle}>Media</Text>
        </View>
        <View style={css.mainWrap}>
          {this.state.type == 'video' ? (
            <Video
              source={{uri: this.state.url}}
              ref={(ref) => {
                this.player = ref;
              }}
              onBuffer={this.onBuffer}
              onError={this.videoError}
              controls={true}
              resizeMode={'contain'}
              style={css.backgroundVideo}
            />
          ) : (
            <Modal visible={this.state.isPhoto} transparent={true}>
              <ImageViewer imageUrls={this.state.images} />
            </Modal>
          )}
        </View>
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
    backgroundColor: colorBlack,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

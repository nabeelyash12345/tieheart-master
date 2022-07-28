import React, { Component, version } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AutoHeightImage from 'react-native-auto-height-image';
import GlobalStore from '../components/GlobalStore';
import { observer } from 'mobx-react';
import { Icon } from 'native-base';
import styles from '../Style';

@observer

export default class CustomSidebarMenu extends Component {

  constructor(props) {
    super(props);
    this.navItems1 = [
      {
        navOptionIcon: 'user',
        navOptionName: _profile[GlobalStore.lang],
        navOptionPage: 'Profile',
        navOptionType: null,
      },
    ];
    this.navItems2 = [
      {
        navOptionIcon: 'exit-to-app',
        navOptionName: _logout[GlobalStore.lang],
        navOptionPage: 'Login',
      }
    ];
    this.state = {
      navWidth: 0,
    };
  }

  measureView(event) {
    console.log('navWidth: ', event.nativeEvent.layout.width)
    this.setState({
      navWidth: event.nativeEvent.layout.width,
    });
  }

  openPage(link) {
    Linking.openURL(link);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View onLayout={(event) => this.measureView(event)} style={css.sideMenuContainer}>

        {/*HEADER*/}
        <View style={css.header}>
          <View style={GlobalStore.rtl ? css.headerContentRtl : css.headerContent}>
            <Icon type="FontAwesome" name="user-circle" style={css.userIcon} />
            <Text ellipsizeMode='tail' numberOfLines={1} style={css.userText}>{GlobalStore.name}</Text>
          </View>
        </View>

        <ScrollView style={css.menuList} contentContainerStyle={{ paddingBottom: 60 }}>

          <TouchableOpacity style={css.menuItem} onPress={() => { this.props.navigation.closeDrawer(); this.props.navigation.navigate("Profile", { type: null }); }}>
            <View style={GlobalStore.rtl ? css.menuItemWrapRtl : css.menuItemWrap}>
              <Icon type="FontAwesome" name="user" style={GlobalStore.rtl ? css.menuIconRtl : css.menuIcon} />
              <Text style={css.menuText}>{_profile[GlobalStore.lang]}</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>

        <View style={css.footer}>
          <Text style={GlobalStore.rtl ? css.footerTextRtl : css.footerText}>{_version[GlobalStore.lang]} {appVersion}</Text>
        </View>

        <AutoHeightImage width={this.state.navWidth} source={require('../assets/images/bg_navdrawer.png')} style={css.bgBottom} />

      </View>
    );
  }
}

const css = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    direction: 'ltr'
  },
  header: {
    width: '100%',
    backgroundColor: colorSecondary,
    paddingTop: statusBarHeight,
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerContentRtl: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  userIcon: {
    color: colorWhite,
    fontSize: 24,
  },
  userText: {
    color: colorWhite,
    fontFamily: fontBold,
    fontSize: 14,
    paddingLeft: 26,
    paddingRight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginTop: 7,
    marginBottom: 5,
    marginLeft: 64,
  },
  dividerRtl: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginTop: 7,
    marginBottom: 5,
    marginRight: 64,
  },
  menuList: {
    width: '100%',
    zIndex: 2,
  },
  menuItem: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  menuItemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemWrapRtl: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontFamily: fontBold,
    color: colorBlack60,
  },
  menuIcon: {
    marginRight: 30,
    fontSize: 20,
    color: colorPrimary,
    textAlign: 'center',
    width: 18,
  },
  menuIconRtl: {
    marginLeft: 30,
    fontSize: 20,
    color: colorPrimary,
    textAlign: 'center',
    width: 18,
  },
  footer: {
    height: 55,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: colorGreyLite,
    zIndex: 2
  },
  footerText: {
    fontSize: 12,
    fontFamily: fontRegular,
    color: colorBlack50,
    textAlign: 'left'
  },
  footerTextRtl: {
    fontSize: 12,
    fontFamily: fontRegular,
    color: colorBlack50,
    textAlign: 'right'
  },
  bgBottom: {
    position: 'absolute',
    bottom: 55,
    left: 0,
    zIndex: 1,
    opacity: 0.5
  }
});
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  StatusBar,
  ImageBackground,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SearchableFlatList} from 'react-native-searchable-list';
import LinearGradient from 'react-native-linear-gradient';
import GlobalStore from '../components/GlobalStore';
import Contacts from 'react-native-contacts';
import {Icon} from 'native-base';
import styles from '../Style';

export default class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: props.navigation.state.params.viewType,
      showLoader: true,
      searchTerm: '',
      contactList: [],
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('ContactsListResume');
      this.requestContactsPermission();
    });
  }

  requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app would like to view your contacts.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Contacts permission granted');
        this.getContacts();
      } else {
        console.log('Contacts permission denied');
        Alert.alert(
          'Error',
          'Please allow this app to access contacts on your device.',
        );
        this.setState({
          showLoader: false,
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  getContacts() {
    Contacts.getAll().then((contacts, andoidContactPermission) => {
      var tempDataArray = [];
      if (contacts && contacts.length) {
        //console.log(contacts[1].phoneNumbers[0].number);
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) {
            tempDataArray.push({
              id: i,
              name: contacts[i].displayName,
              number: this.formatNumber(contacts[i].phoneNumbers[0].number),
              thumbnail: contacts[i].thumbnailPath,
            });
            console.log(contacts[i].displayName);
            console.log(contacts[i].phoneNumbers[0].number);
            console.log(contacts[i].thumbnailPath);
          }
        }
      } else {
        Alert.alert('Information', 'There is no contact to select.');
      }
      this.setState({
        contactList: tempDataArray,
        showLoader: false,
      });
    });
  }

  selectContact(name, number) {
    console.log('Selected contact => Name: ' + name + ' Number: ' + number);
    if (this.state.viewType == 'chat') {
      GlobalStore.setSelectedContactDetails(name, number);
    } else {
      GlobalStore.setSelectedContact(number);
    }
    this.props.navigation.goBack();
  }

  formatNumber(val) {
    var num = val
      .replace(/\s/g, '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');
    var num_final = num.substr(num.length - 10);
    return num_final;
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
          <Text style={styles.headerTitle}>Select Contact</Text>
        </View>
        <View style={css.searchWrap}>
          <TextInput
            style={css.searchInput}
            placeholder={'Search'}
            placeholderTextColor={colorWhite50}
            maxLength={100}
            keyboardType={'default'}
            returnKeyType="search"
            onChangeText={(searchTerm) => this.setState({searchTerm})}
            multiline={false}
            numberOfLines={1}
          />
          <Icon type="Ionicons" name="ios-search" style={css.searchIcon} />
        </View>
        <View style={css.mainWrap}>
          <ImageBackground
            source={require('../assets/images/bg_circles.png')}
            style={css.bg}>
            <SearchableFlatList
              contentContainerStyle={{paddingBottom: 10}}
              data={this.state.contactList}
              searchTerm={this.state.searchTerm}
              searchAttribute={'name'}
              ignoreCase={true}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={css.listItem}
                  onPress={() => {
                    this.selectContact(item.name, item.number);
                  }}>
                  {item.thumbnail == '' ? (
                    <Image
                      source={require('../assets/images/th_def_icon.png')}
                      style={css.listItemPic}
                    />
                  ) : (
                    <Image
                      source={{uri: item.thumbnail}}
                      style={css.listItemPic}
                    />
                  )}
                  <View style={css.listItemText}>
                    <Text style={css.listItemTitle}>{item.name}</Text>
                    <Text style={css.listItemSubtitle}>{item.number}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </ImageBackground>
        </View>
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colorWhite50,
  },
  listItemPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  listItemText: {
    borderBottomWidth: 1,
    borderBottomColor: colorBlack10,
    flex: 1,
    paddingVertical: 15,
    marginLeft: 5,
  },
  listItemTitle: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 16,
    marginBottom: 5,
  },
  listItemSubtitle: {
    fontFamily: fontRegular,
    color: colorBlack50,
    fontSize: 14,
  },
  searchWrap: {
    backgroundColor: colorPrimaryDark,
    paddingHorizontal: 50,
    paddingVertical: 5,
    position: 'relative',
  },
  searchInput: {
    color: colorWhite,
    fontSize: 16,
    height: 40,
  },
  searchIcon: {
    color: colorWhite80,
    fontSize: 20,
    position: 'absolute',
    left: 15,
    top: 14,
  },
});

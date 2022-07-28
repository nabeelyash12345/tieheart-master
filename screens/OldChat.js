import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Alert, Image, Keyboard, PermissionsAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import GlobalStore from '../components/GlobalStore';
import RBSheet from "react-native-raw-bottom-sheet";
import Contacts from 'react-native-contacts';
import { observer } from 'mobx-react';
import { Icon } from 'native-base';
import moment from "moment";
import styles from '../Style';

var task = null;

@observer

export default class Chat extends Component {

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow());
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
    //this.startFetch();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    if (this.timer != undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      crushName: props.navigation.state.params.crushName,
      crushMobile: props.navigation.state.params.crushMobile,
      crushPhoto: props.navigation.state.params.crushPhoto,
      crushToken: props.navigation.state.params.crushToken,
      uniqueNumber: props.navigation.state.params.uniqueNumber,
      chatListItems: [],
      showEmpty: false,
      msg: null,
      showUploading: false,
      uploadType: null,
      uploadCounter: 0
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('Chat focused');
      this.loadChat();

      console.log('Selected contact name: ' + GlobalStore.selectedContactName);
      console.log('Selected contact number: ' + GlobalStore.selectedContactNumber);

      if (GlobalStore.selectedContactName != '') {
        var msg_contact = GlobalStore.selectedContactName + '|||' + GlobalStore.selectedContactNumber;
        this.sendMsg('Shared contact', 'contact', msg_contact, 0, this.state.uniqueNumber, 1);
        GlobalStore.setSelectedContactDetails('', '');
      }
    });
  }

  _keyboardDidShow() {
    console.log('Keyboard Shown');
    this.chatScrollView.scrollToEnd({ animated: true });
    //this.chatInput.clear();
  }

  _keyboardDidHide() {
    console.log('Keyboard Hidden');
  }

  getRBSheetAttach = () => this.RBSheetAttach;
  getRBSheetProfile = () => this.RBSheetProfile;

  startFetch = () => {
    this.timer = setInterval(() => this.loadChatFromServer(), 5000);
  }

  loadChat() {
    console.log('UID: ' + this.state.uniqueNumber);
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ' + table_chat + ' WHERE sender_id = ? ORDER BY id ASC', [this.state.uniqueNumber], (tx, results) => {
        var allItems = [];
        console.log('chat item count: ' + results.rows.length);
        if (results.rows.length > 0) {
          this.setState({
            showEmpty: false,
          });
        } else {
          this.setState({
            showEmpty: true,
          });
        }
        for (let i = 0; i < results.rows.length; ++i) {
          allItems.push(results.rows.item(i));
        }
        this.setState({
          chatListItems: allItems,
        });
        this.loadChatFromServer();
      });
    });
  }

  async loadChatFromServer() {

    var msg_id = 0;

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ' + table_chat + ' WHERE msg_id in (SELECT MAX(msg_id) FROM ' + table_chat + ' WHERE sender_id = ?)', [this.state.uniqueNumber], (tx, results) => {
        var len = results.rows.length;
        console.log('max msg id count: ' + len);
        if (len > 0) {
          let res = results.rows.item(0);
          msg_id = res.msg_id;
          console.log('max msg id: ' + msg_id);
        } else {
          msg_id = 0;
        }
        this.fetchMsgs(msg_id);
      });
    });
  }

  fetchMsgs(msg_id) {
    var params = 'http://faizanansari.com/android/tiehearts/getChat.php?sender_id=' + this.state.uniqueNumber + '&sender_num=' + this.state.crushMobile + '&msg_id=' + msg_id;
    console.log('loadChatFromServer API: ' + params);
    fetch(params, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('loadChatFromServer API Response: ' + responseJson);
        if (responseJson.chat && responseJson.chat.length) {

          console.log('total msgs: ' + responseJson.chat.length);
          //console.log('Last msg id: ' + responseJson[responseJson.chat.length - 1].id);
          var today = this.formatCurrentDateTime();

          db.transaction(function (tx) {
            for (let i = 0; i < responseJson.chat.length; i++) {
              console.log('MSG: ' + responseJson.chat[i].msg_text);
              tx.executeSql(
                'INSERT INTO ' + table_chat + ' (sender_id, msg_text, msg_type, msg_content, msg_date, msg_status, msg_id, msg_self) VALUES (?,?,?,?,?,?,?,?)',
                [responseJson.chat[i].sender_id, responseJson.chat[i].msg_text, responseJson.chat[i].msg_type, responseJson.chat[i].msg_content, today, 0, responseJson.chat[i].id, 0],
                (tx, results) => {
                  console.log('SQLResults', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('Rows affected: ' + results.rowsAffected);
                  } else {
                    console.log('SQL Failed');
                  }
                }
              );
            }
          })
          this.loadChat();
        }
        this.updateChatServer(this.state.uniqueNumber);
      })
      .catch((error) => {
        console.error('Error: ' + error);
      });
  }

  async updateChatServer(sender_id) {
    var params = 'http://faizanansari.com/android/tiehearts/markMsgs.php?receiver_num=' + _mobile + '&sender_id=' + sender_id + '&status=read';
    console.log('updateChatServer Read API: ' + params);
    fetch(params, {
      method: 'POST',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('updateChatServer Read API Response: ' + responseJson);
        if (responseJson.indexOf('success') >= 0) {
          db.transaction(function (tx) {
            tx.executeSql(
              'UPDATE ' + table_chat + ' SET msg_status = ? WHERE sender_id = ? AND msg_status = ?', [2, sender_id, 0],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('Msgs Read Updated: ' + results.rowsAffected);
                }
              }
            );
          });
          db.transaction(function (tx) {
            tx.executeSql(
              'UPDATE ' + table_chat + ' SET msg_status = ? WHERE sender_id = ? AND msg_status = ?', [2, sender_id, 1],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('Msgs Read Updated: ' + results.rowsAffected);
                }
              }
            );
          });
          this.loadChat();
        }
      })
      .catch((error) => {
        console.error('Error: ' + error);
      });
  }

  sendMsg(msg, msgtype, msgcontent, msgid, senderid, isSelf) {
    if (msg == null || msg.length < 1) {
      return false;
    }
    var today = this.formatCurrentDateTime();
    var msgFiltered = msg.replace(/\\'/g, "'");

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO ' + table_chat + ' (sender_id, msg_text, msg_type, msg_content, msg_date, msg_status, msg_id, msg_self) VALUES (?,?,?,?,?,?,?,?)',
        [senderid, msgFiltered, msgtype, msgcontent, today, 0, msgid, isSelf],
        (tx, results) => {
          console.log('SQLResults', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Rows affected: ' + results.rowsAffected);
          } else {
            console.log('SQL Failed');
          }
        }
      );
    });

    this.sendMsgToServer(msg, msgtype, msgcontent, isSelf, today, 0);
    this.chatInput.clear();
    this.loadChat();
    this.setState({
      msg: null,
    });
  }

  sendMsgToServer(msg, msgtype, msgcontent, isself, msgdate, status) {
    var msgContentFinal = msgcontent;
    if (msgtype == 'photo' || msgtype == 'video') {
      msgContentFinal = encodeURIComponent(msgcontent);
      console.log('EncodedURL: ' + msgContentFinal);
    }
    console.log(isself);
    var sender = null;
    if (isself == 1) {
      sender = _mobile;
    } else {
      sender = this.state.crushMobile;
    }
    var msgFiltered = msg.replace(/\'/g, "\\'");
    var params = 'http://faizanansari.com/android/tiehearts/sendChat.php?sender_id=' + this.state.uniqueNumber + '&sender_num=' + sender + '&receiver_num=' + this.state.crushMobile + '&msg_text=' + msgFiltered + '&msg_type=' + msgtype + '&msg_content=' + msgContentFinal + '&msg_date=' + msgdate + '&msg_status=' + status;
    console.log('SendMsg API: ' + params);
    fetch(params, {
      method: 'POST',
    })
      .then((response) => response.text())
      .then((responseJson) => {

        console.log('SendMsg API Response: ' + responseJson);

        if (responseJson.indexOf('success') >= 0) {
          console.log('Msg Sent');
          this.sendRemoteNotification(this.state.crushToken, msgFiltered);
        } else {
          console.log('Msg Not Sent');
        }

      })
      .catch((error) => {
        console.error('Error: ' + error);
      });
  }

  sendRemoteNotification(token, msg) {
    var params = 'http://faizanansari.com/android/tiehearts/firebase/SendtoOne.php?title=' + _name + '&message=' + msg + '&token=' + token + '&type=chat';
    console.log('FCM API: ' + params);
    fetch(params, {
      method: 'POST',
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log('FCM API Response: ' + responseJson);
      })
      .catch((error) => {
        console.error('Error: ' + error);
      });

  }

  confirmClearChat() {
    Alert.alert('Clear Chat', 'Entire conversation will be deleted for this user on your device. Continue?',
      [
        {
          text: 'No',
        },
        { text: 'Yes', onPress: () => this.clearChat() },
      ],
      { cancelable: false },
    );
  }

  clearChat() {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM ' + table_chat + ' WHERE sender_id = ?', [this.state.uniqueNumber],
        (tx, results) => {
          console.log('Clear chat: ' + results.rowsAffected);
        }
      );
    });
    this.loadChat();
  }

  formatCurrentDateTime() {
    var newDate = moment(new Date()).format("DD/MM/YYYY hh:mm A")
    return newDate;
  }

  chatMsgView(msg_self, msg_text, msg_content, msg_date, msg_status, msg_type, key) {

    console.log('MSGVIEW DATA::');
    console.log('msg_self: ' + msg_self);
    console.log('msg_text: ' + msg_text);
    console.log('msg_date: ' + msg_date);
    console.log('msg_status: ' + msg_status);
    console.log('msg_type: ' + msg_type);

    var con_namenum = '';
    if (msg_type == 'contact') {
      con_namenum = msg_content.split('|||');
    }

    if (msg_self == 1) {
      if (msg_type == 'text') {
        return <View style={css.chatItemRow} key={key}>
          <View style={css.chatItemReceiver}>
            <Text style={css.chatItemTitleReceiver}>{msg_text}</Text>
            <Text style={css.chatItemSubtitleReceiver}>{msg_date}</Text>
            {msg_status == 2 ?
              <Icon type="Ionicons" name="heart" style={[css.chatItemHeart, css.chatItemHeartActive]} /> : null}
            {msg_status == 1 ?
              <Icon type="Ionicons" name="heart-outline" style={[css.chatItemHeart, css.chatItemHeartActive]} /> : null}
            {msg_status == 0 ?
              <Icon type="Ionicons" name="heart-outline" style={css.chatItemHeart} /> : null}
          </View>
        </View>
      }
      if (msg_type == 'contact') {
        return <View style={css.chatItemRow} key={key}>
          <View style={css.chatItemReceiver}>
            <TouchableOpacity onPress={() => this.viewContact(con_namenum[0], con_namenum[1])}>
              <View style={css.msgContact}>
                <Icon type="FontAwesome" name="user-circle-o" style={css.msgContactIconReceiver} />
                <View style={css.msgContactCol}>
                  <Text style={css.msgContactNameReceiver}>{con_namenum[0]}</Text>
                  <Text style={css.msgContactNumberReceiver}>{con_namenum[1]}</Text>
                </View>
                <Icon type="Ionicons" name="chevron-forward" style={css.msgArrowReceiver} />
              </View>
            </TouchableOpacity>
            <Text style={css.chatItemSubtitleReceiver}>{msg_date}</Text>
            {msg_status == 2 ?
              <Icon type="Ionicons" name="heart" style={[css.chatItemHeart, css.chatItemHeartActive]} /> : null}
            {msg_status == 1 ?
              <Icon type="Ionicons" name="heart-outline" style={[css.chatItemHeart, css.chatItemHeartActive]} /> : null}
            {msg_status == 0 ?
              <Icon type="Ionicons" name="heart-outline" style={css.chatItemHeart} /> : null}
          </View>
        </View>
      }
      if (msg_type == 'photo' || msg_type == 'video') {
        return <View style={css.chatItemRow} key={key}>
          <View style={css.chatItemReceiver}>
            <TouchableOpacity onPress={() => this.viewMedia(msg_content, msg_type)}>
              <View style={css.msgMedia}>
                {msg_type == 'photo' ?
                  <Icon type="FontAwesome" name="photo" style={css.msgMediaIconReceiver} /> :
                  <Icon type="FontAwesome" name="video-camera" style={css.msgMediaIconReceiver} />
                }
                <View style={css.msgMediaCol}>
                  {msg_type == 'photo' ?
                    <Text style={css.msgMediaNameReceiver}>Photo</Text> :
                    <Text style={css.msgMediaNameReceiver}>Video</Text>
                  }
                  <Text style={css.msgMediaNumberReceiver}>Tap here to view</Text>
                </View>
                <Icon type="Ionicons" name="chevron-forward" style={css.msgArrowReceiver} />
              </View>
            </TouchableOpacity>
            <Text style={css.chatItemSubtitleReceiver}>{msg_date}</Text>
            {msg_status == 2 ?
              <Icon type="Ionicons" name="heart" style={[css.chatItemHeart, css.chatItemHeartActive]} /> : null}
            {msg_status == 1 ?
              <Icon type="Ionicons" name="heart-outline" style={[css.chatItemHeart, css.chatItemHeartActive]} /> : null}
            {msg_status == 0 ?
              <Icon type="Ionicons" name="heart-outline" style={css.chatItemHeart} /> : null}
          </View>
        </View>
      }
    } else {
      if (msg_type == 'text') {
        return <View style={css.chatItemRow} key={key}>
          <View style={css.chatItemSender}>
            <Text style={css.chatItemTitleSender}>{msg_text}</Text>
            <Text style={css.chatItemSubtitleSender}>{msg_date}</Text>
          </View>
        </View>
      }
      if (msg_type == 'contact') {
        return <View style={css.chatItemRow} key={key}>
          <View style={css.chatItemSender}>
            <TouchableOpacity onPress={() => this.viewContact(con_namenum[0], con_namenum[1])}>
              <View style={css.msgContact}>
                <Icon type="FontAwesome" name="user-circle-o" style={css.msgContactIconSender} />
                <View style={css.msgContactCol}>
                  <Text style={css.msgContactNameSender}>{con_namenum[0]}</Text>
                  <Text style={css.msgContactNumberSender}>{con_namenum[1]}</Text>
                </View>
                <Icon type="Ionicons" name="chevron-forward" style={css.msgArrowSender} />
              </View>
            </TouchableOpacity>
            <Text style={css.chatItemSubtitleSender}>{msg_date}</Text>
          </View>
        </View>
      }
      if (msg_type == 'photo' || msg_type == 'video') {
        return <View style={css.chatItemRow} key={key}>
          <View style={css.chatItemSender}>
            <TouchableOpacity onPress={() => this.viewMedia(msg_content, msg_type)}>
              <View style={css.msgMedia}>
                {msg_type == 'photo' ?
                  <Icon type="FontAwesome" name="photo" style={css.msgMediaIconSender} /> :
                  <Icon type="FontAwesome" name="video-camera" style={css.msgMediaIconSender} />
                }
                <View style={css.msgMediaCol}>
                  {msg_type == 'photo' ?
                    <Text style={css.msgMediaNameSender}>Photo</Text> :
                    <Text style={css.msgMediaNameSender}>Video</Text>
                  }
                  <Text style={css.msgMediaNumberSender}>Tap here to view</Text>
                </View>
                <Icon type="Ionicons" name="chevron-forward" style={css.msgArrowSender} />
              </View>
            </TouchableOpacity>
            <Text style={css.chatItemSubtitleSender}>{msg_date}</Text>
          </View>
        </View>
      }
    }
  }

  viewContact(name, num) {
    console.log(name + ' :: ' + num);
    Alert.alert(name, num,
      [
        {
          text: 'Save Contact', onPress: () => this.saveContact(name, num)
        },
        { text: 'Cancel' },
      ],
      { cancelable: false },
    );
  }

  saveContact(name, num) {
    this.requestContactsPermission(name, num)
  }

  requestContactsPermission = async (name, num) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: "Contacts Permission",
          message: "This app would like to read/write your contacts.",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Contacts permission granted");
        var newPerson = {
          firstName: name,
          familyName: name,
          givenName: name,
          phoneNumbers: [{
            label: 'mobile',
            number: num,
          }]
        }
        Contacts.openContactForm(newPerson).then(contact => {
          // contact has been saved
        })
      } else {
        console.log("Contacts permission denied");
        Alert.alert('Error', 'Please allow this app to access contacts on your device.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  viewMedia(url, type) {
    //console.log(url + ' :: ' + type);
    this.props.navigation.navigate('MediaView', { url: url, type: type })
  }

  selectMediaDialog(mediatype) {
    Alert.alert('Send Attachment', 'Select ' + mediatype + ' from:',
      [
        {
          text: 'Camera', onPress: () => this.openCamera(mediatype)
        },
        { text: 'Gallery', onPress: () => this.openLibrary(mediatype) },
      ],
      { cancelable: false },
    );
  }

  openCamera(mediatype) {
    if (mediatype == 'photo') {
      ImagePicker.openCamera({
        mediaType: 'photo',
        cropping: true,
        includeBase64: true,
      }).then(image => {
        let imagebase64 = image.path
        let imagepath = image.path;
        if (Platform.OS === 'android') {
          imagebase64 = 'data:' + image.mime + ';base64,' + image.data;
          //imagepath = imagepath.replace('file://', '');
        }
        this.uploadImage(imagepath);
      });
    } else {
      ImagePicker.openCamera({
        mediaType: 'video',
        cropping: false,
        includeBase64: false,
      }).then(video => {
        let videopath = video.path;
        this.uploadVideo(videopath);
      });
    }
  }

  openLibrary(mediatype) {
    if (mediatype == 'photo') {
      ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        includeBase64: true,
      }).then(image => {
        let imagebase64 = image.path
        let imagepath = image.path;
        if (Platform.OS === 'android') {
          imagebase64 = 'data:' + image.mime + ';base64,' + image.data;
          //imagepath = imagepath.replace('file://', '');
        }
        this.uploadImage(imagepath);
      });
    } else {
      ImagePicker.openPicker({
        mediaType: 'video',
        cropping: false,
        includeBase64: false,
      }).then(video => {
        let videopath = video.path;
        console.log(videopath);
        this.uploadVideo(videopath);
      });
    }
  }

  uploadImage(imagepath) {
    this.setState({
      uploadType: 'photo',
      showUploading: true,
    });
    console.log(imagepath);
    var filename = moment();
    const reference = storage().ref('/images/' + filename + '.jpg');
    task = reference.putFile(imagepath);
    task.on('state_changed', (taskSnapshot) => {
      console.log('file size : ' + taskSnapshot.totalBytes);
      console.log('file transferred : ' + taskSnapshot.bytesTransferred);
      var totalUploaded = ((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100).toFixed(0);
      console.log('Uploading: ' + totalUploaded);
      this.setState({
        uploadCounter: totalUploaded,
      });
    });
    task.then(async () => {
      const downloadURL = await reference.getDownloadURL();
      console.log('File URL: ' + downloadURL);
      this.setState({
        showUploading: false,
      });
      this.sendMsg('Shared photo', 'photo', downloadURL, 0, this.state.uniqueNumber, 1);
    });
    task.catch(error => {
      this.setState({
        showUploading: false,
      });
      console.log("Firebase upload failed: " + error);
      Alert.alert('Error', 'Upload failed. Please try again.');
    });
  }

  uploadVideo(videopath) {
    this.setState({
      uploadType: 'video',
      showUploading: true,
    });
    console.log(videopath);
    var filename = moment();
    const reference = storage().ref('/videos/' + filename + '.mp4');
    task = reference.putFile(videopath);
    task.on('state_changed', (taskSnapshot) => {
      console.log('file size : ' + taskSnapshot.totalBytes);
      console.log('file transferred : ' + taskSnapshot.bytesTransferred);
      var totalUploaded = ((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100).toFixed(0);
      console.log('Uploading: ' + totalUploaded);
      this.setState({
        uploadCounter: totalUploaded,
      });
    });
    task.then(async () => {
      const downloadURL = await reference.getDownloadURL();
      console.log('File URL: ' + downloadURL);
      this.setState({
        showUploading: false,
      });
      this.sendMsg('Shared photo', 'video', downloadURL, 0, this.state.uniqueNumber, 1);
    });
    task.catch(error => {
      this.setState({
        showUploading: false,
      });
      console.log("Firebase upload failed: " + error);
      Alert.alert('Error', 'Upload failed. Please try again.');
    });
  }

  cancelUpload() {
    task.cancel();
    this.setState({
      showUploading: false,
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[colorPrimary, colorSecondary]} style={{ height: statusBarHeight }}>
          <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'} />
        </LinearGradient>
        <View style={[styles.headerPrimary, css.headerCustom]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.navBtn} onPress={() => this.props.navigation.goBack()}>
              <Icon type="Ionicons" name="ios-arrow-back" style={styles.navBtnIcon} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerTitle, css.headerTitleCustom]}>{this.state.crushName}</Text>
          <Text style={css.headerSubtitle}>{this.state.crushMobile}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => this.getRBSheetProfile().open()}>
              {this.state.crushPhoto == "" || this.state.crushPhoto == null ?
                <Image source={require('../assets/images/noimg_other.png')} style={css.headerPic} /> :
                <Image source={{ uri: host_photo + this.state.crushPhoto }} style={css.headerPic} />
              }
            </TouchableOpacity>
          </View>
        </View>
        <View style={css.mainWrap}>
          <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 20 }} ref={scrollView => { this.chatScrollView = scrollView }} onContentSizeChange={() => this.chatScrollView.scrollToEnd({ animated: true })}>
            {this.state.chatListItems.map((item, key) => (
              this.chatMsgView(item.msg_self, item.msg_text, item.msg_content, item.msg_date, item.msg_status, item.msg_type, key)
            ))}
          </ScrollView>
          <View style={css.bottomWrap}>
            <View style={css.inputWrap}>
              <View style={css.inputColLeft}>
                <TextInput style={css.chatInput} placeholder={"Type message"} multiline={true} onChangeText={(msg) => this.setState({ msg })} ref={input => { this.chatInput = input }} />
              </View>
              <View style={css.inputColRight}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => this.getRBSheetAttach().open()}>
                  <Icon type="Ionicons" name="attach" style={css.attachIcon} />
                </TouchableOpacity>
              </View>
              <View style={css.inputColRight}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => this.sendMsg(this.state.msg, 'text', '', 0, this.state.uniqueNumber, 1)}>
                  <Icon type="Ionicons" name="send" style={css.sendIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <RBSheet
            ref={ref => {
              this.RBSheetProfile = ref;
            }}
            height={160}
            openDuration={250}
            closeDuration={200}>
            <View style={css.sheetWrap}>
              <Text style={css.sheetTitle}>Menu</Text>
              <View style={css.sheetBtnsWrap}>
                <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetProfile().close(), setTimeout(() => this.props.navigation.navigate('ViewProfile', { crushMobile: this.state.crushMobile }), 300)]}>
                  <Icon type="FontAwesome" name="user" style={css.sheetBtnIcon} />
                  <Text style={css.sheetBtnText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetProfile().close(), setTimeout(() => this.confirmClearChat(), 300)]}>
                  <Icon type="FontAwesome" name="trash" style={css.sheetBtnIcon} />
                  <Text style={css.sheetBtnText}>Clear Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </RBSheet>
          <RBSheet
            ref={ref => {
              this.RBSheetAttach = ref;
            }}
            height={210}
            openDuration={250}
            closeDuration={200}>
            <View style={css.sheetWrap}>
              <Text style={css.sheetTitle}>Send Attachment</Text>
              <View style={css.sheetBtnsWrap}>
                <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetAttach().close(), setTimeout(() => this.selectMediaDialog('photo'), 300)]}>
                  <Icon type="FontAwesome" name="photo" style={css.sheetBtnIcon} />
                  <Text style={css.sheetBtnText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetAttach().close(), setTimeout(() => this.selectMediaDialog('video'), 300)]}>
                  <Icon type="FontAwesome" name="video-camera" style={css.sheetBtnIcon} />
                  <Text style={css.sheetBtnText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={css.sheetBtn} onPress={() => [this.getRBSheetAttach().close(), setTimeout(() => this.props.navigation.navigate('Contacts', { viewType: 'chat' }), 300)]}>
                  <Icon type="FontAwesome" name="address-book-o" style={css.sheetBtnIcon} />
                  <Text style={css.sheetBtnText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </RBSheet>
        </View>
        {this.state.showUploading ?
          <View style={css.uploader}>
            <View style={css.uploaderDlog}>
              <View style={css.uploaderRow}>
                <View style={css.uploaderColLeft}>
                  {this.state.uploadType == 'photo' ?
                    <Icon type="FontAwesome" name="photo" style={css.uploaderFileIcon} /> :
                    <Icon type="FontAwesome" name="video-camera" style={css.uploaderFileIcon} />
                  }
                </View>
                <View style={css.uploaderColMiddle}>
                  <Text style={css.uploaderTitle}>{this.state.uploadCounter}% Uploaded</Text>
                </View>
                <View style={css.uploaderColRight}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => this.cancelUpload()}>
                    <Icon type="AntDesign" name="closecircleo" style={css.uploaderCloseIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View> : null}
      </SafeAreaView>
    );
  }

}

const css = StyleSheet.create({
  mainWrap: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1
  },
  headerCustom: {
    height: 60
  },
  headerTitleCustom: {
    fontSize: 16
  },
  headerSubtitle: {
    fontFamily: fontRegular,
    color: colorWhite50,
    fontSize: 12,
    marginTop: 5,
  },
  headerPic: {
    height: 40,
    width: 40,
    backgroundColor: colorWhite80,
    borderRadius: 50,
    marginTop: 10,
    marginRight: 10,
    borderColor: colorWhite50,
    borderWidth: 1,
  },
  bottomWrap: {
    left: 0,
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: '#f1f1f1'
  },
  inputWrap: {
    flexDirection: 'row',
    backgroundColor: colorWhite,
    borderRadius: 25,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: colorBlack10
  },
  inputColLeft: {
    flex: 1,
  },
  inputColRight: {
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingBottom: 5,
  },
  attachIcon: {
    color: colorBlack40,
    fontSize: 26,
    marginRight: 5,
    height: 40,
    paddingTop: 6,
  },
  sendIcon: {
    color: colorWhite,
    fontSize: 20,
    width: 40,
    height: 40,
    backgroundColor: colorAccent,
    borderRadius: 40,
    paddingTop: 9,
    paddingLeft: 12,
    marginRight: 5
  },
  chatInput: {
    fontFamily: fontRegular,
    color: colorBlack90,
    fontSize: 15,
    minHeight: 50,
    maxHeight: 100,
    paddingHorizontal: 10
  },
  chatItemRow: {
    paddingHorizontal: 10,
    paddingTop: 10,
    position: 'relative'
  },
  chatItemHeart: {
    fontSize: 18,
    color: colorBlack20,
    position: 'absolute',
    top: 0,
    right: -22,
  },
  chatItemHeartActive: {
    color: colorAccent,
  },
  chatItemReceiver: {
    backgroundColor: colorAccent,
    maxWidth: '80%',
    minWidth: 100,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 20,
  },
  chatItemSender: {
    backgroundColor: colorBlack10,
    maxWidth: '80%',
    minWidth: 100,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  chatItemTitleReceiver: {
    color: colorWhite,
    fontFamily: fontRegular,
    fontSize: 15,
  },
  chatItemTitleSender: {
    color: colorBlack80,
    fontFamily: fontRegular,
    fontSize: 15,
  },
  chatItemSubtitleReceiver: {
    color: colorWhite50,
    fontFamily: fontRegular,
    fontSize: 12,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  chatItemSubtitleSender: {
    color: colorBlack40,
    fontFamily: fontRegular,
    fontSize: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  sheetWrap: {
    padding: 20,
  },
  sheetTitle: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left'
  },
  sheetBtnsWrap: {
    marginTop: 5
  },
  sheetBtn: {
    flexDirection: 'row',
    paddingVertical: 12
  },
  sheetBtnIcon: {
    fontSize: 22,
    color: colorAccent,
    width: 50
  },
  sheetBtnText: {
    fontFamily: fontBold,
    color: colorBlack60,
  },
  msgContact: {
    flexDirection: 'row',
    backgroundColor: colorBlack10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colorWhite30,
  },
  msgMedia: {
    flexDirection: 'row',
    backgroundColor: colorBlack10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colorWhite30,
  },
  msgContactCol: {
    paddingLeft: 15
  },
  msgMediaCol: {
    paddingLeft: 15
  },
  msgContactIconSender: {
    color: colorAccent,
    fontSize: 35,
    alignSelf: 'center'
  },
  msgContactIconReceiver: {
    color: colorWhite80,
    fontSize: 35,
    alignSelf: 'center'
  },
  msgMediaIconSender: {
    color: colorAccent,
    fontSize: 35,
    alignSelf: 'center'
  },
  msgMediaIconReceiver: {
    color: colorWhite80,
    fontSize: 35,
    alignSelf: 'center'
  },
  msgArrowSender: {
    color: colorBlack40,
    fontSize: 30,
    alignSelf: 'center',
    marginLeft: 5
  },
  msgArrowReceiver: {
    color: colorWhite40,
    fontSize: 30,
    alignSelf: 'center',
    marginLeft: 5
  },
  msgContactNameSender: {
    fontFamily: fontBold,
    color: colorAccent,
    fontSize: 16,
    marginBottom: 3
  },
  msgContactNumberSender: {
    fontFamily: fontRegular,
    color: colorBlack70,
    fontSize: 12
  },
  msgContactNameReceiver: {
    fontFamily: fontBold,
    color: colorWhite90,
    fontSize: 16,
    marginBottom: 3
  },
  msgContactNumberReceiver: {
    fontFamily: fontRegular,
    color: colorWhite70,
    fontSize: 12
  },
  msgMediaNameSender: {
    fontFamily: fontBold,
    color: colorAccent,
    fontSize: 16,
    marginBottom: 3
  },
  msgMediaNumberSender: {
    fontFamily: fontRegular,
    color: colorBlack70,
    fontSize: 12
  },
  msgMediaNameReceiver: {
    fontFamily: fontBold,
    color: colorWhite90,
    fontSize: 16,
    marginBottom: 3
  },
  msgMediaNumberReceiver: {
    fontFamily: fontRegular,
    color: colorWhite70,
    fontSize: 12
  },
  uploader: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 99,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploaderDlog: {
    backgroundColor: colorWhite,
    width: '80%',
    borderRadius: 4,
    padding: 15,
  },
  uploaderRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  uploaderColLeft: {
    //
  },
  uploaderColMiddle: {
    flex: 1,
    paddingHorizontal: 15
  },
  uploaderColRight: {
    //
  },
  uploaderFileIcon: {
    fontSize: 30,
    color: colorBlack60
  },
  uploaderCloseIcon: {
    fontSize: 20,
    color: colorAccent
  },
  uploaderTitle: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 14,
  },
});
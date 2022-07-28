import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';
import {ref} from './firebase';
import {MSG_TYPE} from './chatManager';
import * as RootNavigation from '../RootNavigation';

const getOtherId = (ids, id1) => ids.filter((id) => id !== id1)[0] || '';

export const initNotification = () => {
  PushNotification.createChannel({
    channelId: 'message',
    channelName: 'message',
    channelDescription: 'For Incoming messages',
  });
  PushNotification.createChannel({
    channelId: 'call',
    channelName: 'call',
    channelDescription: 'For Incoming calls',
  });
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('incoming notification', remoteMessage);
    const {notification, data} = remoteMessage;
    const {messageInfo} = JSON.parse(data);
    const {type} = messageInfo;
    switch (type) {
      case MSG_TYPE.CALL:
        PushNotification.localNotification({
          message: notification.body,
          title: notification.title,
          channelId: 'message',
        });
        break;
      default:
        PushNotification.localNotification({
          message: notification.body,
          title: notification.title,
          channelId: 'call',
        });
        break;
    }
  });

  PushNotification.configure({
    onNotification: (notification) => {
      console.log(`opened by clicking on notification 
        ${JSON.stringify(notification.data.data)}`);
      setTimeout(() => {
        const {messageInfo, participants, createdBy} = JSON.parse(
          notification.data.data,
        );
        const {type} = messageInfo;
        switch (type) {
          case MSG_TYPE.CALL:
            RootNavigation.navigate('ChatList', {
              userId: getOtherId(participants, createdBy),
            });
            break;
          default:
            RootNavigation.navigate('ChatList', {
              userId: getOtherId(participants, createdBy),
            });
            break;
        }
      }, 10000);
    },
  });
};

const updateToken = async (fcmToken, myId) => {
  await AsyncStorage.setItem('fcmToken', fcmToken);
  await ref.myPrivate(myId).set({
    fcmToken,
  });
};

const getToken = async (myId) => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(`fcm token is ${fcmToken}`);
  if (!fcmToken) {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      // user has a device token
      updateToken(fcmToken, myId);
    }
  }
};

const requestPermission = async (myId) => {
  try {
    await messaging().requestPermission();
    // User has authorised
    getToken(myId);
  } catch (error) {
    // User has rejected permissions
    console.log('permission rejected');
  }
};

export const syncFcmToken = async (myId) => {
  const enabled = await messaging().hasPermission();
  if (enabled) {
    getToken(myId);
  } else {
    requestPermission(myId);
  }
};

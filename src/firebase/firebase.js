import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {v4 as uuid} from 'uuid';

let db = firestore();

const messageParentId = (id1, id2) => [id1, id2].sort().join('--');

const ref = {
  //TODO: check collectionGroup vs collection
  myChat: (myId) =>
    db
      .collectionGroup('message')
      .where('participants', 'array-contains', myId)
      .orderBy('createdAt'),
  sendChat: (myId, otherId) =>
    db
      .collection('Chat')
      .doc(messageParentId(myId, otherId))
      .collection('message'),
  assert: (myId, otherId, imgId = uuid()) =>
    storage().ref('Image').child(messageParentId(myId, otherId)).child(imgId),
  myPrivate: (myId) => firestore().collection('private').doc(myId),
};

export const serverTimeStampToLocalTimeStamp = (serverTimeStamp) =>
  `${serverTimeStamp?.toDate?.() ?? new Date()}`;

export function convertFirestoreTimestampToDate(
  firebaseData,
  timestampKey = ['createdAt', 'modifiedAt'],
) {
  let result = {
    ...firebaseData,
  };
  timestampKey.forEach((key) => {
    result[key] = serverTimeStampToLocalTimeStamp(result[key]);
  });
  return result;
}

export function getServerTimeStamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

class ManageMyId {
  id = '';
  updateMyId = (newId) => {
    this.id = newId;
  };
  getMyId = () => this.id;
}

const manageMyId = new ManageMyId();

export {manageMyId};
export function getMyId() {
  return manageMyId.getMyId();
}
export {firestore, ref};

export async function getDownloadUrl(storageRef) {
  return storage().ref(storageRef).getDownloadURL();
}

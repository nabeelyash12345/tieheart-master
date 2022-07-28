import {
  ref,
  convertFirestoreTimestampToDate,
  getServerTimeStamp,
} from './firebase';
import {
  updateIncomingMessage,
  updateOutgoingMessage,
} from '../../screens/Chat/chat-slice';
import {serverTimeStampToLocalTimeStamp} from './firebase';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '@react-native-firebase/storage';


export const MSG_TYPE = {
  TEXT: 'text',
  CALL: 'call',
  INITIATE: 'initiate',
  IMAGE: 'image',
  ONEVIEW:'oneview',
  GIF: 'gif',
  VIDEO: 'video',
  VOICES:'VOICES'
  
};

class ChatManager {
  updateRedux = (dispatch, {firestoreData, otherId, msgId}) => {
    dispatch(updateIncomingMessage({firestoreData, otherId, msgId}));
  };

  listenForIncomingMessage = (myId, dispatch) => {
    console.log('starting to listen for updates for', myId);
    this.removeIncomingListener = ref.myChat(myId).onSnapshot((querySnap) => {
      if (!querySnap) {
        return;
      }
      querySnap.docChanges().forEach((change) => {
        const firestoreData = {
          ...convertFirestoreTimestampToDate(change.doc.data()),
          id: change.doc.id,
        };
        const removeMyId = (id) => id !== myId;
        const [otherId] = firestoreData.participants.filter(removeMyId);
        const msgId = change.doc.id;
        console.log(
          `an update from ${otherId} and the update is: ${JSON.stringify(
            firestoreData,
          )}`,
        );
        this.updateRedux(dispatch, {firestoreData, otherId, msgId});
      });
    });
  };

  unSubscribeForIncomingMessage = () => {
    console.log('unsubscribing from firebase');
    return this.removeIncomingListener();
  };

  _sendMessage = (
    dispatch,
    {
      messageInfo,
      otherId,
      myId,
      messageId,
      mergeFields = [],
      isDeleted = false,
    },
  ) => {
    const snap = this.toFirestore({
      messageInfo,
      otherId,
      senderId: myId,
      isDeleted,
    });
    const msgRef = ref.sendChat(myId, otherId).doc(messageId);
    const reduxData = () => ({
      firestoreData: {
        ...snap,
        createdAt: serverTimeStampToLocalTimeStamp(snap.createdAt),
        modifiedAt: serverTimeStampToLocalTimeStamp(snap.modifiedAt),
        id: msgRef.id,
      },
      otherId,
      msgId: msgRef.id,
    });
    const toRedux = ({inFlight, error}) =>
      dispatch(updateOutgoingMessage({...reduxData(), inFlight, error}));
    toRedux({inFlight: true, error: null});
    const setOptions =
      messageId && messageInfo.type !== MSG_TYPE.CALL
        ? {
            mergeFields: messageId
              ? [
                  'readBy',
                  'isRead',
                  'modifiedAt',
                  'delivered',
                  'isDeleted',
                  'oneView',
                ].concat(mergeFields)
              : [],
          }
        : mergeFields?.length
        ? {mergeFields}
        : undefined;
    msgRef
      .set(snap, setOptions)
      .then(() => toRedux({inFlight: false, error: null}))
      .catch((error) => {
        console.log(
          `firebase data sending error to ${otherId} and err is ${error}`,
        );
        toRedux({inFlight: false, error});
      });
  };

  sendMessage = (dispatch, {message, otherId, myId, messageId}) => {
    this._sendMessage(dispatch, {
      messageInfo: {type: MSG_TYPE.TEXT, message},
      otherId,
      myId,
      messageId,
    });
  };

  toFirestore = ({
    messageInfo,
    createdAt = getServerTimeStamp(),
    senderId: createdBy,
    otherId,
    isDeleted,
  }) => {
    return {
      messageInfo,
      createdAt,
      createdBy,
      readBy: [createdBy],
      isRead: false,
      oneView:false,
      modifiedAt: getServerTimeStamp(),
      participants: [createdBy, otherId],
      delivered: [createdBy],
      isDeleted,
    };
  };

  updateCallStatus = (
    dispatch,
    {callId, state, otherId, myId, mergeFields = ['messageInfo.state']},
  ) => {
    this._sendMessage(dispatch, {
      messageInfo: {type: MSG_TYPE.CALL, state, callId},
      messageId: callId,
      otherId,
      myId,
      mergeFields,
    });
  };

  getTextFromMessageInfo = (messageInfo) => {
    switch (messageInfo.type) {
      case MSG_TYPE.TEXT:
        return messageInfo.message;
      case MSG_TYPE.CALL:
        return 'Had a call';
      case MSG_TYPE.INITIATE:
        return '';
      case MSG_TYPE.IMAGE:
        return 'Image';
        case MSG_TYPE.ONEVIEW:
        return 'Oneview';
      case MSG_TYPE.VIDEO:
        return 'Video';
        case MSG_TYPE.VOICES:
          return 'voices';
    }
  };

  initiateChat = (dispatch, {myId, otherId}) => {
    this._sendMessage(dispatch, {
      messageInfo: {
        type: MSG_TYPE.INITIATE,
        message: '',
      },
      otherId,
      myId,
    });
  };

  sendAssert = async (dispatch, {uri, otherId, myId, imageId, type,deleteMsg }) => {
    const uploadUri = await this.getPathForFirebaseStorage(uri, type);

    console.warn(uploadUri)
    const task = await ref.assert(myId, otherId, imageId,).putFile(uploadUri);
    const messageInfo = {type, path: task.metadata.fullPath,deleteMsg};
    this._sendMessage(dispatch, {
      messageInfo,
      otherId,
      myId,
      messageId: imageId,
     
    });
  };
  sendAssertVoices = async (dispatch, {uri, otherId, myId, voicesId, type}) => {
    const uploadUri = await this.getPathForFirebaseStorage(uri, type);
    let audioUrl = null;
    console.log("uploadUri => ",uploadUri);
   // alert(uploadUri)
    const storeRef = storage().ref(`recordings/Rec-AUD-${uploadUri}`);
    await storeRef.putFile(uploadUri);
    await storeRef.getDownloadURL().then(url => {
    //  alert(url)
      audioUrl = url;
       console.log(url," Voices")
    });
    // const task = await ref.assert(myId, otherId, imageId).putFile(uploadUri);
    // const messageInfo = {type, path: task.metadata.fullPath};
    const messageInfo = {type: MSG_TYPE.VOICES, audioUrl};

    this._sendMessage(dispatch,{
      messageInfo,
      otherId,
      myId,
      messageId:voicesId
    })
    // const task = await ref.assert( url,myId, otherId, voicesId).putFile(uploadUri);
    // const messageInfo = {type, path: task.metadata.fullPath};
    // this._sendMessage(dispatch, {
    //   messageInfo,
    //   otherId,
    //   myId,
    //   messageId: voicesId,
    // });

  };
  

  async getPathForFirebaseStorage(uri, type) {
    const isIos = Platform.OS === 'ios';
    if (type === MSG_TYPE.IMAGE) {
      return isIos ? uri.replace('file://', '') : uri;
    }
    if (isIos) return uri;
    const stat = await RNFetchBlob.fs.stat(uri);
    return stat.path;
  }

  sendGif = async (dispatch, {url, otherId, myId, imageId}) => {
    const messageInfo = {type: MSG_TYPE.GIF, url};
    this._sendMessage(dispatch, {
      messageInfo,
      otherId,
      myId,
      messageId: imageId,
    });
  };

  deleteMsg = (dispatch, {message, otherId, myId, messageId}) => {
    this._sendMessage(dispatch, {
      messageInfo: {type: MSG_TYPE.TEXT, message},
      otherId,
      myId,
      messageId,
      isDeleted: true,
    });
  };
}

export default new ChatManager();

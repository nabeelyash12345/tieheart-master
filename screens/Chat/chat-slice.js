import {createSlice} from '@reduxjs/toolkit';
import chatManager, {MSG_TYPE} from '../../src/firebase/chatManager';
import {CALL_STATE} from '../Call';

const initialState = {
  snap: {},
  msgIds: {},
  userListInfo: [], // https://codesandbox.io/s/object-in-same-reducer-226cl?file=/src/Counter.js having peers in different store doesn't improve performance
  incomingCallInfo: [],
  myId: 'hello',
};

const getUpdatedUserList = (state, otherId, messageInfo) => {
  const userListWithoutOtherId =
    state?.userListInfo?.filter((info) => info.id !== otherId) ?? [];
  const userInfo = {
    id: otherId,
    lastMessage: chatManager.getTextFromMessageInfo(messageInfo),
  };
  return [userInfo, ...userListWithoutOtherId];
};

const updateCallStatus = (state, payload) => {
  const {firestoreData} = payload;
  const {messageInfo, createdBy} = firestoreData;

  if (createdBy === state.myId) {
    return;
  }

  const {type, callId, state: callState} = messageInfo;
  if (type !== MSG_TYPE.CALL) {
    return;
  }

  const oldCallIndex = state.incomingCallInfo.findIndex((call) => {
    return call.messageInfo.callId === callId;
  });
  const isCallStated = CALL_STATE.STARTED === callState;
  if (isCallStated) {
    console.log('pushing to call state');
    state.incomingCallInfo.push(firestoreData);
    return;
  }

  const isCallEnded = CALL_STATE.ENDED === callState;
  const isExistInRedux = oldCallIndex !== -1;

  if (!isExistInRedux && isCallEnded) {
    return;
  }

  if (isExistInRedux && isCallEnded) {
    state.incomingCallInfo.splice(oldCallIndex, 1);
    return;
  }
};

const deleteFromRedux = (state, payload) => {
  const {firestoreData, otherId, msgId, inFlight, error} = payload;
  delete state?.snap[otherId][msgId];

  const msgIdx = state?.msgIds[otherId].indexOf(msgId);
  if (msgIdx === -1) return;
  state.msgIds[otherId].splice(msgIdx, 1);

};

const updateMessage = (state, payload) => {
  const {firestoreData, otherId, msgId, inFlight, error} = payload;
  if (firestoreData.isDeleted) {
    deleteFromRedux(state, payload);
    return;
  }
  if (!state.snap[otherId]) {
    state.snap[otherId] = {};
  }

  state.snap[otherId][msgId] = {...firestoreData, inFlight, error};
  if (!state.msgIds[otherId]) {
    state.msgIds[otherId] = [];
  }
  if (!state.msgIds[otherId].includes(msgId)) {
    state.msgIds[otherId].push(msgId);
  }
  state.userListInfo = getUpdatedUserList(
    state,
    otherId,
    firestoreData.messageInfo,
  );
  updateCallStatus(state, payload);
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateIncomingMessage(state, {payload}) {
      updateMessage(state, {...payload, inFlight: false, error: null});
    },

    updateOutgoingMessage(state, {payload}) {
      updateMessage(state, payload);
    },

    updateMyId(state, {payload}) {
      state.myId = payload.id;
    },

    updateReadRecipient(state, {payload}) {
      const {otherId, msgId} = payload;
      state.snap[otherId][msgId].isRead = true;
      state.snap[otherId][msgId].oneView = true;



    },

    updateLocalCallActionStatus(state, {payload}) {
      const {callId} = payload;
      const callIndex = state.incomingCallInfo.findIndex(
        (info) => info.messageInfo.callId === callId,
      );
      console.log(`callId ${callId} ${callIndex}`);
      if (callIndex === -1) return;
      state.incomingCallInfo.splice(callIndex, 1);
    },
  },
});

export const {
  updateIncomingMessage,
  updateOutgoingMessage,
  updateMyId,
  updateReadRecipient,
  updateLocalCallActionStatus,
} = chatSlice.actions;

export const userListSelector = (store) => store.chat.userListInfo;

export const userListSelectorSec = (store) => store.chat.userListInfoSec;
                        
export const chatIdSelector = (userId) => (store) => store.chat.msgIds[userId];
export const useMyId = (store) => store.chat.myId;
export const chatSelector =
  ({chatId, otherId}) =>
  (store) =>
    store.chat.snap?.[otherId]?.[chatId];

export const isChatContinued =
  ({chatId, otherId}) =>
  (store) => {
    const preChatInfo = getPreviousChat({chatId, otherId})(store);
    if (!preChatInfo) {
      return;
    }
    const chatInfo = store.chat.snap?.[otherId]?.[chatId];
    const chatSendBy = chatInfo.createdBy;
    const preChatSendBy = preChatInfo.createdBy;
    return preChatSendBy === chatSendBy;
  };

export const getPreviousChat =
  ({chatId, otherId}) =>
  (store) => {
    const chatInfo = store.chat.snap?.[otherId]?.[chatId];
    if (!chatInfo) {
      return;
    }
    const preChatIndex = store.chat.msgIds[otherId].indexOf(chatId) - 1;
    if (preChatIndex < 0) {
      return;
    }
    const preChatId = store.chat.msgIds[otherId][preChatIndex];
    const preChatInfo = store.chat.snap?.[otherId]?.[preChatId];

    if (!preChatInfo) {
      return;
    }
    return preChatInfo;
  };

export const getIncomingCallInfoSelector = (state) =>
  state.chat.incomingCallInfo[0];

export const getLastMessage = (otherId) => (store) => {
  const chatIds = store.chat.msgIds[otherId];
  const lastId = [...chatIds].reverse().find((id) => {
    return store.chat.snap?.[otherId]?.[id].createdBy === otherId;
  });
  return store.chat.snap[otherId][lastId];
};

export const getLastReadMsgId = (otherId) => (store) => {
  const msgIds = [...store.chat.msgIds[otherId]].reverse();
  
  for (let id of msgIds) {
    const isRead = store.chat.snap[otherId][id].isRead;
    
    if (isRead) {
      return id;
    }
  }
};
export const getLastReadMsgId1 = (otherId) => (store) => {
  const msgIds = [...store.chat.msgIds[otherId]].reverse();
  
  for (let id of msgIds) {
    const isRead = store.chat.snap[otherId][id].oneView;
    
    if (isRead) {
      return id;
    }
  }
};


export const getCallInfo = (callId, otherID) => (store) => {
  return store.chat.snap[otherID][callId];
};

export const getReadRecipient = (otherId, msgId) => (store) => {
  const msgIdx = store.chat.msgIds[otherId].lastIndexOf(msgId);
  if (msgIdx === -1) return;

  const postMsgIds = store.chat.msgIds[otherId].slice(msgIdx);
  const lastReadMsgId = getLastReadMsgId(otherId)(store);
  const lastReadMsgId1 = getLastReadMsgId1(otherId)(store);

  return postMsgIds.includes(lastReadMsgId,lastReadMsgId1);
};

export default chatSlice.reducer;

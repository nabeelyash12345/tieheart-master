import RtcEngine, {ChannelProfile, RtcEngineContext} from 'react-native-agora';
import React, {useEffect, useState, useRef} from 'react';
import requestAudioPermission from './permission';
import {Platform} from 'react-native';
import {RtcLocalView, RtcRemoteView} from 'react-native-agora';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import chatManager from '../../src/firebase/chatManager';
import {useDispatch, useSelector} from 'react-redux';
import {useMyId} from '../Chat/chat-slice';
import {IconButton, Colors} from 'react-native-paper';
import {getCallInfo} from '../Chat/chat-slice';
import {userById} from '../../src/redux/user-slice';
import { disable } from 'debug';
import {Icon} from 'native-base';

export const CALL_STATE = {
  STARTED: 'started',
  ONGOING: 'ongoing',
  ENDED: 'ended',
};

export default function Call({navigation, route}) {
  const {callId, userId: otherId, isCaller} = navigation.state.params;
  const [remoteUserInfo, setRemoteUserInfo] = useState({
    isJoined: false,
    agoraUserId: null,
  });
  const dispatch = useDispatch();
  const myId = useSelector(useMyId);
  const callInfo = useSelector(getCallInfo(callId, otherId));
  const userInfo = useSelector(userById)(otherId);

  const AgoraEngine = useRef();

  const endCall = async () => {
    chatManager.updateCallStatus(dispatch, {
      callId,
      myId,
      otherId,
      state: CALL_STATE.ENDED,
    });
    await AgoraEngine.current?.destroy();
  };
  
  useEffect(() => {
    if (callInfo?.messageInfo?.state !== CALL_STATE.ENDED) {
      return;
    }
    navigation.goBack();
  }, [callInfo, navigation]);

  useEffect(() => {
    const init = async () => {
      AgoraEngine.current = await RtcEngine.create(
        '44f5f6b401e74d7b95fe4f2b9f3fa9ef',
      );
      AgoraEngine.current.addListener('Error', (channel, uid, elapsed) => {
        console.log('Error', channel, uid, elapsed);
        
      });

      AgoraEngine.current.addListener(
        'JoinChannelSuccess',
        (channel, uid, elapsed) => {
          console.log('JoinChannelSuccess', channel, uid, elapsed);
          isCaller &&
            chatManager.updateCallStatus(dispatch, {
              callId,
              myId,
              otherId,
              state: CALL_STATE.STARTED,
              mergeFields: null,
            });
        },
      );
      AgoraEngine.current.addListener('UserJoined', (agoraUserId) => {
        console.log('UserJoined', agoraUserId);
        isCaller &&
          chatManager.updateCallStatus(dispatch, {
            callId,
            myId,
            otherId,
            state: CALL_STATE.ONGOING,
          });
        setRemoteUserInfo({
          isJoined: true,
          agoraUserId,
        });
      });
      AgoraEngine.current.addListener('UserOffline', endCall);

      await AgoraEngine.current.disableVideo();
      
      await AgoraEngine.current.setDefaultAudioRoutetoSpeakerphone(false);
    };

    const join = async () => {
      try {
        console.log('starting to join room', callId);
        return AgoraEngine.current.joinChannel(null, callId, null, 0);
      } catch (err) {
        console.log(err);
      }
    };

    if (Platform.OS !== 'android') {
      return;
    }

    requestAudioPermission().then(init).then(join).catch(console.log);
  

    return endCall;
  }, [dispatch, myId, otherId, callId, isCaller, navigation]);
    
  return (
    <View style={styles.root}>
      {!remoteUserInfo.isJoined ? (
        <View style={styles.loading}>
          <ActivityIndicator size={60} color="#222" />
          <Text style={styles.loadingText}>
            {callInfo?.messageInfo?.state === CALL_STATE.STARTED
              ? `Calling to ${userInfo?.name || 'Guest'}`
              : `Ringing on ${userInfo?.name || 'Guest'}`}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.center}>

            
              <Icon type='AntDesign' name='user' style={styles.user} />

              <Text>{userInfo.name}</Text>
          </View>
        
        </>
      )}
      <View style={styles.callActionWrapper}>
        <IconButton
          icon="phone-hangup"
          color={Colors.red500}
          size={20}
          style={styles.endCall}
          onPress={endCall}
        />
      </View>
    </View>
  );
}

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#bbb',
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  loading: {
    flex: 1,
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  remoteUser: {
    width: dimensions.width,
    aspectRatio: 1,
    color:'#FFFFFF'
  },
  callActionWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  user:{
    fontSize:120,

  }
});
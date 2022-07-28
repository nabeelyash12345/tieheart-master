import React, {useEffect} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, IconButton} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {CALL_STATE} from '.';
import chatManager from '../../src/firebase/chatManager';
import {useMyId, getIncomingCallInfoSelector} from '../Chat/chat-slice';
import {updateLocalCallActionStatus} from '../Chat/chat-slice';

export default function IncomingCall({navigation, route}) {
  const {
    callId,
    userId,
    imgUrl = 'https://picsum.photos/200',
  } = navigation.state.params || {};
  const dispatch = useDispatch();
  const myId = useSelector(useMyId);
  const incomingCallInfo = useSelector(getIncomingCallInfoSelector);

  useEffect(() => {
    if (!incomingCallInfo) {
      navigation.goBack();
    }
  }, [incomingCallInfo, navigation]);

  const onAccept = () => {
    dispatch(updateLocalCallActionStatus({callId}));
    navigation.replace('Call', {userId, callId, isCaller: false});
  };

  const onReject = () => {
    dispatch(updateLocalCallActionStatus({callId}));
    chatManager.updateCallStatus(dispatch, {
      callId,
      state: CALL_STATE.ENDED,
      myId,
      otherId: userId,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.userInfo}>
        <Image
          source={{uri: imgUrl, width: 70, height: 70}}
          style={styles.img}
        />
        <Text style={styles.name}>{userId}</Text>
      </View>
      <View style={styles.callControlWrapper}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.accept)}>
          <IconButton
            icon="phone"
            size={20}
            onPress={onAccept}
            color={Colors.green500}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.reject)}>
          <IconButton
            icon="phone-hangup"
            size={20}
            onPress={onReject}
            color={Colors.red500}
          />
        </TouchableOpacity>
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
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    height: '40%',
    alignItems: 'center',
  },
  img: {
    height: 150,
    width: 150,
    borderRadius: 75,
    margin: 25,
  },
  name: {
    fontSize: 25,
  },
  callControlWrapper: {
    width: dimensions.width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 50,
  },
  accept: {
    borderColor: Colors.green500,
  },
  reject: {
    borderColor: Colors.red500,
  },
});

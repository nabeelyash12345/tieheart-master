import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getIncomingCallInfoSelector} from '../Chat/chat-slice';
import {CALL_STATE} from '.';
import {userById} from '../../src/redux/user-slice';

export default function withIncomingCallListener(Component) {
  return (props) => {
    const incomingCallInfo = useSelector(getIncomingCallInfoSelector);
    const getUserById = useSelector(userById);
    const {navigation} = props;

    useEffect(() => {
      if (!incomingCallInfo) {
        return;
      }
      const {
        createdBy,
        messageInfo: {callId, state},
      } = incomingCallInfo;
      if (state !== CALL_STATE.STARTED) {
        return;
      }
      navigation.navigate('IncomingCall', {
        userId: createdBy,
        imgUrl:
          getUserById(createdBy)?.imgUrl || 'https://picsum.photos/200/200',
        callId,
        isCaller: false,
      });
    }, [getUserById, incomingCallInfo, navigation]);

    return <Component {...props} />;
  };
}

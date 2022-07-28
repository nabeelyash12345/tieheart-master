import React,{useEffect} from 'react';
import { MSG_TYPE } from '../../../../src/firebase/chatManager';
import ChatItemImage from './Image';
import { chatSelector, useMyId } from '../../chat-slice';
import { useSelector, useDispatch } from 'react-redux';
import ChatItemText from './Text';
import ChatItemGif from './Gif';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import chatManager from '../../../../src/firebase/chatManager';
import ChatItemCall from './Call';
import ChatItemVideo from './Video';
import ChatItemVoices from './Voices';
import AsyncStorage from '@react-native-community/async-storage';






export default function ChatItem(props) {
  const { id, userId } = props;
  const { messageInfo, createdBy, createdAt } = useSelector(
    chatSelector({ chatId: id, otherId: userId }),
  );

  const [showPop, _setShowPop] = React.useState(false);
  const dispatch = useDispatch();
  const myId = useSelector(useMyId);
  let timeout = null;

  useEffect(() => {
    
    var  res3 =   AsyncStorage.setItem('myId',userId);  
    
    // console.log('response from index item ', res3)
     
     return res3
  

 },[])

  useEffect(() => {
   
  
      return () => {
       clearTimeout(timeout)
      }

    
  }, [timeout]);

  const setShowPop = (val) => {
    if (createdBy !== myId) {
      return;
    }
    const isAbove30Mins = new Date() - new Date(createdAt) > 30 * 60 * 1000;
    if (isAbove30Mins) {
      return;
    }

    _setShowPop(val);
    if (val) {
      timeout = setTimeout(() => {
        _setShowPop(false);
      }, 4000);
    }
  };

  const onDelete = () => {
    chatManager.deleteMsg(dispatch, {
      otherId: userId,
      myId,
      messageId: id,
    });
    setShowPop(false);
  };
  const onDeleteMe = () => {
    chatManager.deleteMsg(dispatch, {
      otherId: userId,
      messageId: id,
    });
    setShowPop(false);
  };


  const { type } = messageInfo;
  let Component = ChatItemText;
  switch (type) {
    case MSG_TYPE.IMAGE:
      Component = ChatItemImage;
      break;
      case MSG_TYPE.VOICES:
        Component = ChatItemVoices;
        break;
    case MSG_TYPE.GIF:
      Component = ChatItemGif;
      break;
    case MSG_TYPE.ONEVIEW:
    Component=ChatItemImage
    break;
    case MSG_TYPE.CALL:
      Component = ChatItemCall;
      break;
    case MSG_TYPE.VIDEO:
      Component = ChatItemVideo;
      break;
    default:
      Component = ChatItemText;
      break;
  }

  return (
    <View style={styles.root}>
      {showPop && (
        <Text onPress={onDelete} style={styles.popover}>
          Delete for everyone
        </Text>
      )}
      <TouchableOpacity
        onLongPress={() => {
          setShowPop(true);
        }}
        onPress={() => {
          setShowPop(false);
        }}>
        <Component {...props} />
      </TouchableOpacity>
      {showPop && (
        <Text onPress={onDeleteMe} style={styles.popover}>
          Delete Me
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  popover: {
    position: 'absolute',
    top: 10,
    right: 0,
    padding: 15,
    borderRadius: 20,
    backgroundColor: 'black',
    color: 'white',
    zIndex: 10,
  },


});
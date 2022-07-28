import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions,Modal, Pressable } from 'react-native';
import 'react-native-get-random-values';
import { useSelector, useDispatch } from 'react-redux';
import {
  chatSelector,
  isChatContinued,
  useMyId,
  getReadRecipient,
} from '../../chat-slice';
import DateDivider from './DateDivider';
import { getDownloadUrl } from '../../../../src/firebase/firebase';
import chatManager, { MSG_TYPE } from '../../../../src/firebase/chatManager';
import { userById } from '../../../../src/redux/user-slice';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import Modal from "react-native-modal";
import { IconButton } from 'react-native-paper';

const dateToHoursMin = (dateStr) => {
  const date = new Date(dateStr);
  const isAm = date.getHours() % 12 === date.getHours();
  const hours = date.getHours() % 12;
  const mins = date.getMinutes();
  return `${hours}:${mins} ${isAm ? 'am' : 'pm'}`;
};

const changeServerTimeStampToRenderFormat = (data, timeKey = 'createdAt') => {
  return {
    ...data,
    [timeKey]: dateToHoursMin(data[timeKey]),
  };
};

const ChatItemImage = ({ id, userId }) => {
  const [url, setUrl] = useState();

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const chat = useSelector(chatSelector({ chatId: id, otherId: userId }));
  const isContinued = useSelector(
    isChatContinued({ chatId: id, otherId: userId }),
  );
  const myId = useSelector(useMyId);
  const isRead = useSelector(getReadRecipient(userId, id));
  const oneView = useSelector(getReadRecipient(userId, id));
  const dispatch = useDispatch();
  const { messageInfo, createdAt, createdBy } =
    changeServerTimeStampToRenderFormat(chat);

  const onDelete = () => {
    chatManager.deleteMsg(dispatch, {
      otherId: userId,
      myId,
      messageId: id,

    });
  };

  const msg = messageInfo.deleteMsg;
  const getUserById = useSelector(userById);

  const userInfo = getUserById(userId);


  useEffect(() => {

    console.log(
      `got chat for  ${id} is chat ${JSON.stringify({
        message: messageInfo,
        createdAt,
        createdBy,

      })}`,

    );
  }, [messageInfo, createdAt, createdBy, id]);

  useEffect(() => {
    getDownloadUrl(messageInfo.path).then(setUrl);
  }, [messageInfo.path]);

  useEffect(() => {

    if (isRead && msg === true) {
      setTimeout(() => {
        console.warn('settimeout called')
        onDelete()
      }, 10000)

    } else {
      return null
    }
  })

  let rootStyle = createdBy === myId ? styles.my : styles.their;
  rootStyle = isContinued
    ? StyleSheet.compose(rootStyle, styles.continued)
    : rootStyle;

  let root = createdBy === userId;
  let root2 = createdBy === myId;

 

  return (
    <>

      <DateDivider chatId={id} userId={userId} />
      <View style={rootStyle}>

        


          <Modal  onRequestClose={toggleModal} visible={isModalVisible}>
            <View style={{height:'100%',width:'110%', backgroundColor: 'black', }}>

            
              <Pressable onPress={toggleModal} style={{ margin:10}}><Text style={{color:'white'}} >Cancel</Text></Pressable>
              <Image
                source={{ uri: url, width: 70 }}
                style={{ width: '100%', height: '100%', }}
                resizeMode='center'
              />
            </View>
          </Modal>
      

        <TouchableOpacity onPress={toggleModal} >
          <Image
            source={{ uri: url, width: 70 }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {root ?
          <View style={{ width: 30, height: 30, position: 'absolute', marginLeft: -40, borderRadius: 50, justifyContent: 'center', alignItems: "center" }}>



            <Image
              source={{
                uri: userInfo?.imgUrl || 'https://picsum.photos/200',
                width: 30,
                height: 30,
              }}
              style={{ resizeMode: "cover", width: 30, height: 30, borderRadius: 50 }}
            />
          </View> : <></>
        }
        <Text style={styles.info}>{isRead && root2 && <Image style={{ width: 16, height: 16, resizeMode: "cover" }} source={require('../../../../assets/images/img81.png')} />}</Text>

      </View>


    </>
  );
};

export default ChatItemImage;

const styles = StyleSheet.create({
  my: {
    alignSelf: 'flex-end',
    marginTop: 3,
    maxWidth: '95%',
    marginRight: 40,
    // backgroundColor: '#155FCC',
    padding: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 40,
    marginVertical: 12
  },
  their: {
    alignSelf: 'flex-start',
    marginTop: 5,
    maxWidth: '95%',
    marginLeft: 40,

    // backgroundColor: '#283351',
    padding: 10,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 60,
    marginVertical: 12
  },
  msg: {
    fontSize: 13,
  },
  info: {
    position: 'absolute',
    right: -30,
    top: -10,
    fontSize: 10,
    width: 17,
    height: 30,
    // borderColor:'red',
    // borderWidth:3,
    paddingVertical: 4,
    color: '#FFFFFF',
    // position:"relative",
    // marginLeft:200,
    // marginRight:-30,
    zIndex: -1
  },
  continued: {},
  image: {
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 2,
    // Without height undefined it won't work
    height: undefined,
    // figure out your image aspect ratio
    aspectRatio: 135 / 96,
  },
});

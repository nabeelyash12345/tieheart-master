import React, {useEffect} from 'react';
import {StyleSheet, Text, View,Image} from 'react-native';
import 'react-native-get-random-values';
import {useSelector,useDispatch} from 'react-redux';
import { userById } from '../../../../src/redux/user-slice';

import {
  chatSelector,
  isChatContinued,
  useMyId,
  getReadRecipient,
} from '../../chat-slice';
import DateDivider from './DateDivider';
import chatManager from '../../../../src/firebase/chatManager';

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

const ChatItemText = ({id, userId}) => {
  const chat = useSelector(chatSelector({chatId: id, otherId: userId}));
 
  const isContinued = useSelector(
    isChatContinued({chatId: id, otherId: userId}),
  );
  const myId = useSelector(useMyId);
  const dispatch = useDispatch();
  const getUserById = useSelector(userById);
  const userInfo = getUserById(userId);
 

  const {messageInfo, createdAt, createdBy} =
    changeServerTimeStampToRenderFormat(chat);
  const isRead = useSelector(getReadRecipient(userId, id));

  useEffect(() => {
    console.log(
      `got chat for  ${id} is chat ${JSON.stringify({
        message: messageInfo,
        createdAt,
        createdBy,
      })}`,
  
    );
  }, [messageInfo, createdAt, createdBy, id]);

 

  const msgToRender = chatManager.getTextFromMessageInfo(messageInfo);
  if (msgToRender === '') {
    return null;
  }

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
         
        
        <Text style={styles.msg}>{msgToRender}</Text>
      
        {root?
       <View style={{width:30,height:30,position:'absolute',marginLeft:-40,borderRadius:50,justifyContent:'center',alignItems:"center"}}> 
       
       
       
        <Image
            source={{
              uri: userInfo?.imgUrl ||'https://picsum.photos/200',
              width: 30,
              height: 30,
            }}
            style={{resizeMode:"cover",width:30,height:30,borderRadius:50}}
          />
        </View>  :<></>
      }
      <Text style={styles.info}>{isRead && root2 && <Image  style={{width:16,height:16, resizeMode:"cover"}} source={require('../../../../assets/images/img81.png')} /> }</Text>

      </View>

      
    </>
  );
};

export default ChatItemText;

const styles = StyleSheet.create({
  my: {
    alignSelf: 'flex-end',
    marginTop: 3,
    maxWidth: '95%',
    marginRight:40,
    backgroundColor: '#155FCC',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 15,
    marginVertical:12
  },
  their: {
    alignSelf: 'flex-start',
    marginTop: 5,
    maxWidth: '95%',
    marginLeft:40,

    backgroundColor: '#283351',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 2,
    marginVertical:12
  },
  msg: {
    fontSize: 13,
    color:'#FFFFFF',
    
    
  },
  info: {
    position:'absolute',
    right:-30,
    top:-10,
    fontSize: 10,
    width:17,
    height:30,
    // borderColor:'red',
    // borderWidth:3,
    paddingVertical: 4,
    color:'#FFFFFF',
    // position:"relative",
    // marginLeft:200,
    // marginRight:-30,
    zIndex:-1
  
    
    
  },
  continued: {},
});

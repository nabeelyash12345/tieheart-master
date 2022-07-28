import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import 'react-native-get-random-values';
import {useSelector} from 'react-redux';
import {chatSelector} from '../../chat-slice';
import DateDivider from './DateDivider';

const dateToHoursMin = (dateStr) => {
  const date = new Date(dateStr);
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var monthName=months[date.getMonth()];
  const isAm = date.getHours() % 12 === date.getHours();
  const hours = date.getHours() % 12;
  const mins = date.getMinutes();
  const day = date.getDay();
  const year = date.getFullYear()
  return `  ${day} ${monthName} ${year}   
    \n ${hours}:${mins} ${isAm ? 'am' : 'pm'} `;
};

const changeServerTimeStampToRenderFormat = (data, timeKey = 'createdAt') => {
  return {
    ...data,
    [timeKey]: dateToHoursMin(data[timeKey]),
  };
};

const ChatItemCall = ({id, userId}) => {
  const chat = useSelector(chatSelector({chatId: id, otherId: userId}));

  const {messageInfo, createdAt, createdBy} =
    changeServerTimeStampToRenderFormat(chat);

  useEffect(() => {
    console.log(
      `got chat for  ${id} is chat ${JSON.stringify({
        message: messageInfo,
        createdAt,
        createdBy,
      })}`,
    );
  }, [messageInfo, createdAt, createdBy, id]);

  const msgToRender = `Had a call ${createdAt}`;

  return (
    <>
      <DateDivider chatId={id} userId={userId} />
      <View style={styles.call}>
        <Text style={styles.msg}>{msgToRender}</Text>
      </View>
    </>
  );
};

export default ChatItemCall;

const styles = StyleSheet.create({
  call: {
    alignSelf: 'center',
    marginTop: 3,
    maxWidth: '95%',
    // backgroundColor: '#6bfc03',
    padding: 10,
    // borderRadius: 25,
  },
  msg: {
    fontSize: 13,
    color:'#FFFFFF'
  },
  info: {
    textAlign: 'right',
    fontSize: 10,
    opacity: 0.5,
    margin: 0,
    paddingVertical: 3,
  },
  continued: {},
});

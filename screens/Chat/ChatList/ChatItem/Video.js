import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import 'react-native-get-random-values';
import {useSelector} from 'react-redux';
import {
  chatSelector,
  isChatContinued,
  useMyId,
  getReadRecipient,
} from '../../chat-slice';
import DateDivider from './DateDivider';
import {getDownloadUrl} from '../../../../src/firebase/firebase';
import Video from 'react-native-video';

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

const ChatItemVideo = ({id, userId}) => {
  const [url, setUrl] = useState();

  const chat = useSelector(chatSelector({chatId: id, otherId: userId}));
  const isContinued = useSelector(
    isChatContinued({chatId: id, otherId: userId}),
  );
  const myId = useSelector(useMyId);
  const isRead = useSelector(getReadRecipient(userId, id));

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

  useEffect(() => {
    getDownloadUrl(messageInfo.path).then(setUrl);
  }, [messageInfo.path]);

  let rootStyle = createdBy === myId ? styles.my : styles.their;
  rootStyle = isContinued
    ? StyleSheet.compose(rootStyle, styles.continued)
    : rootStyle;

  return (
    <>
      <DateDivider chatId={id} userId={userId} />
      <View style={rootStyle}>
        <Video
          source={{uri: url, width: 70}}
          style={styles.image}
          resizeMode="cover"
          controls
          allowsExternalPlayback
          paused
        />
        <Text style={styles.info}>
          {isRead && 'R'}
          {createdAt}
        </Text>
      </View>
    </>
  );
};

export default ChatItemVideo;

const styles = StyleSheet.create({
  my: {
    alignSelf: 'flex-end',
    marginTop: 3,
    maxWidth: '95%',
    backgroundColor: '#283351',
    padding: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  their: {
    alignSelf: 'flex-start',
    marginTop: 3,
    maxWidth: '95%',

    backgroundColor: '#155FCC',
    padding: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 25,
  },
  msg: {
    fontSize: 13,
  },
  info: {
    textAlign: 'right',
    fontSize: 10,
    opacity: 0.5,
    margin: 0,
    paddingVertical: 3,
  },
  continued: {},
  image: {
    width: '100%',
    // Without height undefined it won't work
    height: undefined,
    // figure out your image aspect ratio
    aspectRatio: 135 / 76,
  },
});

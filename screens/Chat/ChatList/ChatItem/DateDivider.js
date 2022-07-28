import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import 'react-native-get-random-values';
import {useSelector} from 'react-redux';
import {chatSelector, getPreviousChat} from '../../chat-slice';

const convertToMonthToStr = (number) => {
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return month[number];
};

const getDateStringForDateDivider = ({
  latestChatDateInStr,
  preChatDateInStr,
}) => {
  const latestChatDate = new Date(latestChatDateInStr);
  const previousChatDate = new Date(preChatDateInStr);
  const today = new Date();
  const isSameDate = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
  const isChatInSameDate = isSameDate(latestChatDate, previousChatDate);
  if (isChatInSameDate) {
    return;
  }
  const isLatestChatToday = isSameDate(today, latestChatDate);
  if (isLatestChatToday) {
    return 'Today';
  }
  const isChatsInSameYear =
    latestChatDate.getFullYear() === previousChatDate.getFullYear();
  if (isChatsInSameYear) {
    return `${latestChatDate.getDate()}/${convertToMonthToStr(
      latestChatDate.getMonth(),
    )}`;
  } else {
    return `${latestChatDate.getDate()}/${convertToMonthToStr(
      latestChatDate.getMonth(),
    )}/${latestChatDate.getFullYear()}`;
  }
};

const DateDivider = ({chatId, userId}) => {
  const curChat = useSelector(chatSelector({chatId, otherId: userId}));
  const preChat = useSelector(getPreviousChat({chatId, otherId: userId}));
  if (!preChat) {
    return null;
  }
  const dividerString = getDateStringForDateDivider({
    latestChatDateInStr: curChat.createdAt,
    preChatDateInStr: preChat.createdAt,
  });
  if (!dividerString) {
    return null;
  }
  return (
    <View style={styles.dateDivider}>
      <Text style={styles.msg}>{dividerString}</Text>
    </View>
  );
};

export default DateDivider;

const styles = StyleSheet.create({
  msg: {
    fontSize: 13,
    color:'#FFFFFF'
  },
  dateDivider: {
    alignSelf: 'center',
    padding: 10,
  },
});

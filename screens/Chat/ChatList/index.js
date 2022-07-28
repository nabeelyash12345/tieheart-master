import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import 'react-native-get-random-values';
import LinearGradient from 'react-native-linear-gradient';
import {Appbar} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {v4 as uuid} from 'uuid';
import withIncomingCallListener from '../../Call/IncomingCallListener';
import {chatIdSelector} from '../chat-slice';
import ChatItem from './ChatItem';
import SendMsg from './SendMsg';
import {userById} from '../../../src/redux/user-slice';
import {getLastMessage, useMyId} from '../chat-slice';
import setReadRecipient from '../../../src/firebase/readRecipient';
import { Shadow } from 'react-native-neomorph-shadows';
import { Icon } from 'native-base';
import { IconButton } from 'react-native-paper';


function ChatList({navigation}) {
  const {userId, name} = navigation.state.params;
  const chatIds = useSelector(chatIdSelector(userId));
  const getUserById = useSelector(userById);
  const lastMessage = useSelector(getLastMessage(userId));
  const userInfo = getUserById(userId);
  const listRef = useRef();
  const dispatch = useDispatch();
  const myId = useSelector(useMyId);

  const onCall = () =>
    navigation.navigate('Call', {userId, callId: uuid(), isCaller: true});
   
    const onVoiceCall = () => {
      navigation.navigate('VoiceCall',{userId, callId: uuid(), isCaller:true})
    }
  const jumpToProfile = () =>
    navigation.navigate('ViewProfile', {crushMobile: userId});

  
  useEffect(() => {
    if (!lastMessage) return;
    const {id: msgId} = lastMessage;
    console.log(`updating read status for ${msgId}`);
    setReadRecipient(dispatch, {msgId, myId, otherId: userId});
  }, [lastMessage, dispatch, userId, myId]);

  return (
    <View style={styles.root}>
      {/* <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colorPrimary, colorSecondary]}
        style={{height: statusBarHeight}}>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={'transparent'}
        />
      </LinearGradient> */}
      <Shadow
                        inner // <- enable inner shadow
                        useArt // <- set this prop to use non-native shadow on ios
                        style={

                           
                          
                             styles.appstyle
                        }

                    >
      <Appbar.Header style={styles.appstyle} >
        {/* <Appbar.BackAction onPress={() => navigation.goBack()} />
         */}
          <IconButton icon='chevron-left' size={30} color='#ffffff' onPress={() => navigation.goBack()} />
         
        <TouchableOpacity onPress={jumpToProfile}>
          <Image
            source={{
              uri: userInfo?.imgUrl || 'https://picsum.photos/200',
              width: 50,
              height: 50,
            }}
            style={styles.image}
          />
        </TouchableOpacity>
        <Appbar.Content
          style={styles.appBarUserInfo}
          title={name || userInfo.name || userId}
          subtitle={userId}
          onPress={jumpToProfile}
        />
        
        <Appbar.Action icon="video" color='#07F83C' onPress={onCall} />
        <Appbar.Action icon="phone" color='#07F83C' onPress={onVoiceCall}/>
      </Appbar.Header>
      </Shadow>

      {/* <ImageBackground
        source={require('../../../assets/images/bg_circles.png')}
        style={{
          flex: 1,
          width: null,
          height: null,
        }}> */}
        <View style={styles.mainContainer}>
          <SafeAreaView style={styles.container}>
            <FlatList
              ref={listRef}
              data={chatIds}
              renderItem={({item}) => <ChatItem id={item} userId={userId} />}
              keyExtractor={(item) => item}
              onContentSizeChange={() =>
                listRef.current.scrollToEnd({animated: true})
              }
            />
          </SafeAreaView>
          {/* <Image
            source={require('../../../assets/images/chatbuck_logo.png')}
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              width: 110,
              height: 40,
              bottom: 60,
            }}
          /> */}
          <SendMsg userId={userId} navigation={navigation}  onCall={onCall} />
        </View>
      {/* </ImageBackground> */}
    </View>
  );
}

export default withIncomingCallListener(ChatList);

const styles = StyleSheet.create({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#010C22',
  },
  appstyle: {
    
    shadowOpacity: 0.25,
    shadowColor: 'rgba(102, 84, 84, 0.25)',
    shadowRadius: 15,
    backgroundColor: '#1F1A31',
    height:90,
    marginTop:6
    
    
  
    
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    flex: 1,
  },
});

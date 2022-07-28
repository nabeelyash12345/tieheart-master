import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import 'react-native-get-random-values';

import { useSelector } from 'react-redux';
import {
  chatSelector,
  isChatContinued,
  useMyId,
  getReadRecipient,
} from '../../chat-slice';
import DateDivider from './DateDivider';
import { getDownloadUrl } from '../../../../src/firebase/firebase';
import Play from "react-native-vector-icons/Ionicons"
import Video from 'react-native-video';
import { State } from 'react-native-gesture-handler';
import { userById } from '../../../../src/redux/user-slice';

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

const ChatItemVoices = ({ id, userId }) => {
  const [url, setUrl] = useState();
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isClick, setIsClick] = useState(false)
  const getUserById = useSelector(userById);
  const userInfo = getUserById(userId);
  


  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0)


 
  const callPaused = () => {
    setPaused(!paused)
    setIsClick(true)
  }
  const chat = useSelector(chatSelector({ chatId: id, otherId: userId }));
  const isContinued = useSelector(
    isChatContinued({ chatId: id, otherId: userId }),
  );
  const myId = useSelector(useMyId);
  const isRead = useSelector(getReadRecipient(userId, id));

  const { messageInfo, createdAt, createdBy } =
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
    // getDownloadUrl(messageInfo.path).then(setUrl);
    setUrl(messageInfo.audioUrl)
  }, [messageInfo.path]);

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
        {/* <Image
          source={{uri: url, width: 20 ,height:2}}
          style={styles.Voices}
          resizeMode="cover"
        /> */}

        <Video
          source={{ uri: messageInfo.audioUrl }}
          style={styles.Voices}
          autoplay={false}
          paused={paused}
          // onPlaybackStalled
          //  play={play} 
          // onSeek={20} 
          // progressUpdateInterval={}              
          onBuffer={e => {
            console.log(`🚀 ~ file: ModalPlayer.js ~ line 80 ~ ModalPlayer ~ e`, e);
          }}
          onLoadStart={err => {

            console.log(`🚀 ~ file: ModalPlayer.js ~ line 65 ~ onLoadStart ~ e`, err);
          }}
          onLoad={err => {

            console.log(`🚀 ~ file: ModalPlayer.js ~ line 76 ~ onLoad ~ e`, err);
          }}
          onError={err => {
            alert("Unable to play this file.");
            console.log(`🚀 ~ file: ModalPlayer.js ~ line 68 ~ onError ~ err`, err);
          }}
          onEnd={err => {
              setPaused(true)
              setIsClick(false)

            console.log(`🚀 ~ file: ModalPlayer.js ~ line 79 ~ onEnd ~ e`, err);
          }}
          style={styles.backgroundVideo}
        />
        <View style={{ width: 300, flexDirection: "row", margin: -2 }}>

          <TouchableOpacity
            style={{ width: "15%", height: 40, justifyContent: "center", paddingtop: 10 }}
            onPress={callPaused}
          >
            <Play
              name={ paused? 'play-outline' : 'pause-outline'}
              size={20}
              paddingtop={10}

              color={"red"}
              backgroundColor={'white'}

            />

          </TouchableOpacity>
            
          {
            isClick?  
            <View style={{width:300,height:60,justifyContent:'center',backgroundColor: 'transparent',borderRadius:30,zIndex:1}} >
   
             <Image source={require('../../../../assets/images/ring.gif')} resizeMode='cover' style={{width:220,height:35,borderRadius:4}} />
             
            </View>
            :
          <View>

            {/* <Slider
              style={styles.progressContainer}
              value={10}
              minimumValue={0}
              maximumValue={1}
              thumbTintColor='red'
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="black"
            />
            <View style={styles.progresslabelContainer}>
              <Text>0:00</Text>
              <Text> 3.:34</Text>

            </View> */}

               <Image source={require('../../../../assets/images/muhsin1.png')} resizeMode='cover' style={{width:220,height:30,borderRadius:5,marginTop:10}} />

          </View>
}
          <View />

        </View>
        {/* <Text style={{fontSize:20,color:"red"}}>Hello world</Text> */}
        
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

export default ChatItemVoices;

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
  Voices: {
    width: '100%',
    // Without height undefined it won't work
    height: 100,
    // figure out your image aspect ratio
    aspectRatio: 135 / 76,
  },
  progressContainer: {
    width: 250,
    height: 60,
    flexDirection:"row"
  },
  progresslabelContainer:{
    width:300,
    flexDirection:"row",
    justifyContent:"space-around"

  },
});
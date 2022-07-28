import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, SafeAreaView, TouchableOpacity, Image, Text, Button, Dimensions } from 'react-native';
import 'react-native-get-random-values';
import { launchImageLibrary } from 'react-native-image-picker';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import chatManager, { MSG_TYPE } from '../../../src/firebase/chatManager';
import { useMyId } from '../chat-slice';
import { ImagePickerResponse } from 'react-native-image-picker';
import { GifSearch } from 'react-native-gif-search';
import EmojiBoard from 'react-native-emoji-board';
import CustomEmojiBoard from './CustomEmojiBoard';
import { Shadow } from 'react-native-neomorph-shadows';

import * as ImagePicker from 'react-native-image-picker';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Sound from 'react-native-sound';
import Modal from "react-native-modal";
import { GiphyDialog, GiphySDK, GiphyGridView } from '@giphy/react-native-sdk'

GiphySDK.configure({
  apiKey: 'RLhmRpEHwga672ZIMzeqGz71ZFA5CX9w',
})


let settings = {
  SampleRate: 22050,
  Channels: 1,
  AudioQuality: "Low",
  AudioEncoding: "aac",
  MeteringEnabled: true,
  IncludeBase64: true,
  AudioEncodingBitRate: 32000
}
const POPUP_STATE = {
  EMOJI: 'emoji',
  GIF: 'gif',
  NA: 'na',
};

const SendMsg = ({ userId, onCall, navigation, }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const myId = useSelector(useMyId);
  const [showPopup, setShowPopup] = useState(POPUP_STATE.NA);
  const [searchQuery, setSearchQuery] = useState('');
  const [media, setMedia] = useState(null);
  const [isClick, setIsClick] = useState(false)

  const [recording, setRecording] = useState(false);
  const [recordrdPath, setRecordedPath] = useState("")
  const [time, setTime] = useState(0)
  const [files, setFiles] = useState('')
  const [isModalVisible, setModalVisible] = useState(false);
  const [one, setOne] = useState(false)






  useEffect(() => {
  }, [])

  useEffect(() => {
    GiphyDialog.addListener('onMediaSelect', onSelect)

    return () => {
      GiphyDialog.removeAllListeners('onMediaSelect', onSelect)
    }
  }, [])

  const onSelect = (e) => {
    console.warn("gif url ", e.media.url)

    let type = MSG_TYPE.GIF
    chatManager.sendGif(dispatch, {
      url: e.media.url,
      myId,
      otherId: userId,
      type

    });
  }

  const handlechange = (text) => {
    setMessage(text)
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };




  const startVoiceRecording = async () => {
    setIsClick(!isClick)
    if (recording) {
      console.log("Already Recording");
      // return;
    }
    setRecording(true)
    try {
      AudioRecorder.prepareRecordingAtPath(`${AudioUtils.DocumentDirectoryPath}/${"Record"}.aac`, settings);
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error)
    }
  }

  const stopVoiceRecording = () => {

    setRecording(false);
    setIsClick(false)
    AudioRecorder.stopRecording().then((filePath) => {
      setRecordedPath(filePath)
      console.log(filePath, MSG_TYPE.VOICES, "PATH_______________");

      chatManager.sendAssertVoices(dispatch, {
        uri: filePath,
        myId,
        otherId: userId,
        type: MSG_TYPE.VOICES
      });

    });
  }
  const onSend = () => {
    if (!message) {
      return;
    }
    chatManager.sendMessage(dispatch, {
      message,
      myId,
      otherId: userId,
    });
    setMessage('');
  };

  /**
   *
   * @param {ImagePickerResponse} response
   */

  const options = {
    title: 'Select Avatar',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const open_picker = () => {
    ImagePicker.launchCamera(options, (response) => {

      if (response.didCancel || response.errorCode) {
        return;
      }

      response.assets.forEach((assert) => {
        const { uri, type: assertType } = assert;
        let type = MSG_TYPE.IMAGE;
        // console.log

        chatManager.sendAssert(dispatch, {
          uri,
          myId,
          otherId: userId,
          type,
        });
      });
    });

  }
  const onAssertAction = (response) => {
    if (response.didCancel || response.errorCode) {
      return;
    }
    response.assets.forEach((assert) => {
      const { uri, type: assertType } = assert;
      let type = MSG_TYPE.IMAGE;
      setFiles(uri)

      // if (assertType.toLowerCase().includes('video')) {
      //   type = MSG_TYPE.VIDEO;
      // }
      // chatManager.sendAssert(dispatch, {
      //   uri,
      //   myId,
      //   otherId: userId,
      //   type,
      // });
    });
    setModalVisible(!isModalVisible)
  };

  const onGifSelected = () => {

    let type = MSG_TYPE.GIF
    chatManager.sendGif(dispatch, {
      url,
      myId,
      otherId: userId,
      type,
    });
  };

  const rootStyle =
    showPopup !== POPUP_STATE.NA
      ? StyleSheet.compose(styles.msgWrapper, styles.showEmoji)
      : styles.msgWrapper;
  useEffect(() => {

    getVoicePermission()
    getGalleryPermission()

    AudioRecorder.onProgress = (data) => {
      setTime(parseInt(Math.floor(data.currentTime)))
    };

  }, [])

  const getVoicePermission = async () => {
    await request(PERMISSIONS.ANDROID.RECORD_AUDIO)
      .then((result) => {
        if (result == "granted") {
          // console.log("SoundRecording permission granted")   
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const getGalleryPermission = async () => {
    await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        if (result == "granted") {
          // console.log("Storage permission granted")
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }



  return (
    <View style={rootStyle}>
      <View style={styles.inputRoot}>
        {/* {
          isClick ?
            <View style={{ width: 200, height: 60, justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 30, zIndex: 1 }} >

              <Image source={require('../../../assets/images/wave.gif')} resizeMode='cover' style={{ width: 220, height: 35, alignSelf: 'center', }} />

            </View> */}
            
         
         
            <View style={styles.inputWrapper}>

               {
          isClick ?
            <View style={{ width: "90%", height: 60, justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 30, zIndex: 1 }} >

              <Image source={require('../../../assets/images/wave.gif')} resizeMode='cover' style={{ width: 220, height: 35, alignSelf: 'center', }} />

            </View>
            :
              <View style={{flexDirection:"row",width:"90%", justifyContent:"center",alignItems:"center"}}>
                
              <View style={styles.GifStyle}>
                <TouchableOpacity style={styles.camera}
                  onPress={() => GiphyDialog.show()}
                >
                  <Image source={require('../../../assets/images/dd.png')}></Image>
                </TouchableOpacity>
              </View>
            


              <TextInput
                multiline={true}
                onChangeText={handlechange}
                value={message}
                placeholderTextColor={"white"}
                
                placeholder="Message........"
                style={styles.textInputStyle}

              />


              {/* <IconButton
          icon="attachment"
          size={20}
          onPress={() =>
            launchImageLibrary(
              {
                selectionLimit: 10,
                mediaType: 'mixed',
                quality: 0.5,
                videoQuality: 'low',
              },
              onAssertAction,
            )
           
          }
        /> */}

              <View style={styles.EmStyle}>
              <TouchableOpacity
               
                onPress={(e) => {
                  e.stopPropagation();
                  setShowPopup(
                    showPopup === POPUP_STATE.NA
                      ? POPUP_STATE.EMOJI
                      : showPopup === POPUP_STATE.EMOJI
                        ? GiphyDialog.show()
                        : POPUP_STATE.NA,
                  );
                }}
              >
                  <Image source={require('../../../assets/images/ff.png')}></Image>

                
                </TouchableOpacity>
              </View>
              <View style={styles.camera}>
                <TouchableOpacity style={styles.camera}
                  onPress={() => navigation.navigate('Camera', { userId, myId })}
                >
                  <Image source={require('../../../assets/images/Camera.png')}></Image>
                </TouchableOpacity>
              </View>
              </View>
}
              <View style={{width:"15%",justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity style={styles.btn}
                  onPressIn={startVoiceRecording}
                  onPressOut={stopVoiceRecording}
                >

                  {message.trim() ? (
                    <IconButton icon="send-circle-outline" size={20} onPress={onSend} color="#07F83C" />

                  ) : (
                    <IconButton icon='microphone' size={22} color='#07F83C' />

                  )}

                </TouchableOpacity>
              </View>

              {/* <IconButton onPress={open_picker} style={{marginTop:10}} icon='camera' size={18}  /> */}
            </View>

      



     

      </View>
      <CustomEmojiBoard
        onClick={({ code }) => setMessage(`${message || ''}${code}`)}
        showBoard={showPopup === POPUP_STATE.EMOJI}
        numCols={4}
        onRemove={() => setMessage(message.slice(0, -1))}
      />
      {/* {showPopup === POPUP_STATE.GIF && (    )} */}



      <Modal isVisible={isModalVisible} backdropColor='red' deviceHeight={200} deviceWidth={1} >


        <Image source={{ uri: files }} resizeMode={'contain'} style={{ position: 'absolute', height: Dimensions.get('window').height, width: Dimensions.get('window').width, borderColor: 'black', borderWidth: 3 }} />


        <View style={styles.sentContainer}>
          <TouchableOpacity
            style={styles.goback}
            onPress={() => setModalVisible(!isModalVisible)}
          >

            <IconButton icon='cancel' size={22} color='white' />


          </TouchableOpacity>

          <TouchableOpacity
            style={styles.oneView}
            onPress={() => setOne(!one)}
          >
            <Text style={{ color: "red", fontSize: 25 }}>1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancel1}
            onPress={() => {
              setModalVisible(!isModalVisible)
              chatManager.sendAssert(dispatch, {
                uri: files,
                myId,
                otherId: userId,
                type: MSG_TYPE.IMAGE,
                deleteMsg: one
              });
            }}
          >

            <IconButton icon='send' size={22} color='white' />

          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

export default SendMsg;

const styles = StyleSheet.create({
  msgWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  showEmoji: {
    flex: 1,
  },
  inputRoot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    

  },
  textInputStyle: {
    borderWidth: 0,
    marginRight: 10,
    flexGrow: 1,
    width: '50%',
    color: 'white'
  },
  inputWrapper: {
    width: '100%',

    
    marginBottom: 10,
    padding:3,
    borderRadius: 25,
    backgroundColor:'#1F1A31',
    
    alignItems: 'center',

    //  borderWidth:1,
    //  borderColor:'red',
    paddingRight: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  simile: {
    alignSelf: 'center',
  },
  btn: {
    // position: 'absolute',
    // right: 5,
    // bottom: 5,

    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    backgroundColor: '#2A2639',
    borderRadius: 24,
    // shadowColor: "#2A2639",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,

    // elevation: 6,
  },
  oneView: {


    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dotted",
    borderWidth: 2,
    borderColor: "red"

  },
  GifStyle:{
    justifyContent: "center",
    marginHorizontal:8,
    alignItems: "center",
    width: 35,
    height: 35,
    backgroundColor: '#2A2639',
    borderRadius: 24,
    shadowColor: "#2A2639",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  EmStyle:{

    justifyContent: "center",
    
    alignItems: "center",
    width: 35,
    height: 35,
    backgroundColor: '#2A2639',
    borderRadius: 24,
    shadowColor: "#2A2639",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  camera: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal:8,
    width: 35,
    height: 35,
    backgroundColor: '#2A2639',
    borderRadius: 24,
    shadowColor: "#2A2639",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  sentContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: 'flex-end',
    flexDirection: "row",
    height: 80,
    bottom: 30,

  },
  cancel1: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: '#33FFBE',
    justifyContent: 'center',
    alignItems: 'center'
  },
  goback: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: '#33FFBE',
    alignItems: 'center',
    justifyContent: 'center'
  }

});

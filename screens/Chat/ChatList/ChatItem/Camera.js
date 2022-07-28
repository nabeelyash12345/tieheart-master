import React, { useState, useRef, useEffect } from 'react';
import { RNCamera as Camera } from 'react-native-camera';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, TouchableHighlight, Image } from 'react-native'
import chatManager, { MSG_TYPE } from '../../../../src/firebase/chatManager';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from 'react-native-paper';
import { useMyId, getReadRecipient } from '../../chat-slice';
import { times } from 'lodash';
import ChatItemImage from './Image'





export default function PictureScreen({ route, navigation, }) {


  // useEffect(() => {
  //  alert(read)
  // })

  const [path, setPath] = useState(null)
  const cameraRef = useRef();

  const myId = useSelector(useMyId);
  const { userId } = navigation.state.params;
  const [One, setOne] = useState(false)
  const dispatch = useDispatch();


  // useEffect(()=>{
  //   console.warn(isRead,'hgdghkdhk',myId)
  // })

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);

      console.log(data.uri);
      setPath(data.uri)
    }
  };
  const sendPicture = () => {

    chatManager.sendAssert(dispatch, {
      uri: path,
      myId,
      otherId: userId,
      type: MSG_TYPE.ONEVIEW,
      deleteMsg: One
    });


  }


  const renderCamera = () => {
    return (
      <Camera
        ref={cameraRef}
        style={styles.preview}
        flashMode={Camera.Constants.FlashMode.off}
        // permissionDialogTitle={'Permission to use camera'}
        // permissionDialogMessage={'We need your permission to use your camera phone'}
      >
        <TouchableHighlight
          style={styles.capture}
          onPress={takePicture}
          underlayColor="rgba(255, 255, 255, 0.5)"
        >
          <View />
        </TouchableHighlight>
      </Camera>
    );
  }

  const goback = () => {
    navigation.goBack()
    sendPicture()


  }
  const renderImage = () => {
    return (
      <View >
        <Image
          source={{ uri: path }}
          style={styles.preview}
        />

        <View style={styles.sentContainer}>
        <TouchableOpacity
          style={styles.cancel}
          onPress={() => setPath(!path)}
        >

      <IconButton icon='cancel' size={22} color='white' />
        

        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.oneView}
          onPress={() => setOne(!One)}
        >
          <Text style={{ color: "red", fontSize: 25 }}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancel1}
          onPress={goback}>
          
          <IconButton icon='send' size={22} color='white' />

        </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {path ? renderImage() : renderCamera() }

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  cancel: {
    height:40,
    width:40,
    borderRadius:100,
    backgroundColor:'#33FFBE',
    justifyContent:'center',
    alignItems:'center'
  },
  cancel1: {
    height:40,
    width:40,
    borderRadius:100,
    backgroundColor:'#33FFBE',
    justifyContent:'center',
    alignItems:'center'
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
  sentContainer:{
    flex:0.1,
    justifyContent:"space-around",
    alignItems:"center",
    flexDirection:"row",
    height:80,
    // borderColor:"red",
    // borderWidth:2
  }
});



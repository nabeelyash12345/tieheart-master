import React, { Component, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';

import styles from '../Style'
import { Shadow } from 'react-native-neomorph-shadows'
import { useMyId, getReadRecipient } from './Chat/chat-slice';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';



const Data = [
  {
    id: 1,
    msg: 'I am in love',
    displaytype: require('../assets/images/emoji.png'),
  },
  {
    id: 2,
    msg: 'I am sad',
    displaytype: require('../assets/images/113.png')

  },
  {
    id: 3,
    msg: 'I am laughing',
    displaytype: require('../assets/images/114.png')
  },
  {
    id: 4,
    msg: 'I am angry',
    displaytype: require('../assets/images/001.png')
  },
  {
    id: 5,
    msg: 'I am in Love',
    displaytype: require('../assets/images/115.png'),

  },
  {
    id: 6,
    msg: "I am cool",
    displaytype: require('../assets/images/116.png'),

  },
  {
    id: 7,
    msg: "I am crying",
    displaytype: require('../assets/images/117.png'),

  },
  {
    id: 8,
    msg: 'I am not feeling well',
    displaytype: require('../assets/images/118.png'),

  },
  {
    id: 9,
    msg: "I am surprised",
    displaytype: require('../assets/images/119.png'),

  },
  {
    id: 10,
    msg: 'I feel sleepy',
    displaytype: require('../assets/images/211.png'),

  },
  {
    id: 11,
    msg: 'I want your kiss',
    displaytype: require('../assets/images/212.png'),

  },
  {
    id: 12,
    msg: "Thinking about you",
    displaytype: require('../assets/images/112.png'),

  },
  {
    id: 13,
    msg: "I am listening to Music",
    displaytype: require('../assets/images/213.png'),

  },
  {
    id: 14,
    msg: "I am Nervous",
    displaytype: require('../assets/images/214.png'),

  },
  {
    id: 15,
    msg: "I am Confused",
    displaytype: require('../assets/images/215.png'),

  },
  {
    id: 16,
    msg: "I am Calm",
    displaytype: require('../assets/images/216.png'),

  },
];


function ChooseMood({ navigation }) {

  const first = require('../assets/images/emoji.png')
 const deftxt = 'I am in Love';
  const ref = useRef(null);
  const [itm, setItm] = useState(first)
  const [index, setIndex] = useState(0)
  const [Message, setMessage] = useState(deftxt)
  const [id, setId] = useState(first)
  const myId = useSelector(useMyId);

    

  // const  saveData = async () => {  
    
  //  var  res =  await AsyncStorage.setItem('image',JSON.stringify(itm));  
  //     console.log('response from image item ', res)
  //    return res
  // }  

  // const saveData2 = async () => {
  //   var  res2 =  await AsyncStorage.setItem('message',JSON.stringify(Message));  
  //   console.log('response from message item ', res2)
      
          
  //    return res2
  // }

  // const saveData3 = async () => {
  //   var  res3 = await  AsyncStorage.setItem('index',JSON.stringify(index));  
    
  //   console.log('response from index item ', res3)
     
  //    return res3
  // }

  
  

  // var params = '?mobile=' + myId + '&mood=' + id;
  
  //  const moodChange = () => {
  //    saveData()
  //    saveData2()
  //    saveData3()
    
  //   console.log(params)
  //   fetch(host + "UpdateMood" + params ,   {
  //   method: 'GET',
   
    
  // })
  //   .then((response) => response.json())
  //   .then((responseJson) => {
      
  //   //  var res = JSON.stringify(responseJson)
     
  //     console.log('Mood API Response: ' + responseJson);
  //     Alert.alert('Mood Change Done')
  //      navigation.goBack()
  //   })
  //   .catch((error) => {
  //     Alert.alert('Error in mood screen', error.message);
  //     console.log('Mood API Error: ' + error.message);
     
  //   });
  // }

 

  

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Image style={{ width: 25, height: 25 }} source={title} />
    </View>
  );

  const _color = {
    active: 'blue',
    inactive: 'white'
  }

  useEffect(() => {
    ref.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
    // console.log(index,'index of list')
  }, )

  const renderItem = ({ item, index: fIndex }) => (

    <Shadow style={css.headerImage}
      inner
      useArt
    >

      <TouchableOpacity onPress={() => setItm(item.displaytype)}
        onPressIn={() => {
          setMessage(item.msg)
         

        }}
        onPressOut={() => { 
          setId(item.id)
          console.log(item.id)
        }}
        style={{
          width: 50, height: 50, justifyContent: "center", alignItems: 'center',

        }} >

        <Item title={item.displaytype} />
      </TouchableOpacity>

    </Shadow>
  );
  return (
    <View style={css.container}>
      <View style={{
        // backgroundColor: colorPrimary,
        
        height: 80,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        marginVertical: 12
      }}>
        <View style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 5,
          flexDirection: 'row',
        }}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.goBack()}>
            <Icon
              type="AntDesign"
              name="left"
              style={styles.navBtnIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={css.Title}>Choose Your Mood</Text>
      </View>
      <View style={css.heroSection}>



        <View style={css.subSection}>

          <Image source={itm} />
         
        </View >

      </View>

      <View style={{ alignSelf: 'center' }}>
        <Text style={{ color: 'white', fontSize: 20, }} >{Message}</Text>

      </View>


      <View style={{
        width: "100%",
        height:200, backgroundColor: '#1F1A31', alignItems: 'center', flexDirection: 'row', padding: 20
      }}>
        <TouchableOpacity onPress={() => {

          if (index === 0) {
            return;
          }
          setIndex(index - 1);

        }}
          style={{ width: 30, }}
        >
          
          <Icon
            type="AntDesign"
            name="doubleleft"
            style={styles.navBtnIcon}
          />
        </TouchableOpacity>

        <View style={{ width: '70%', height: 80, justifyContent: 'center', marginLeft: 10 }}>

          <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal={true}
            ref={ref}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={index}
          />

        </View>
        <TouchableOpacity onPress={() => {


          if (index === Data.length - 1) {
            return;
          }
          setIndex(index + 1)

        }

        }

          style={{ marginLeft: 10 }}
        >
          <Icon
            type="AntDesign"
            name="doubleright"
            style={styles.navBtnIcon}
          />
        </TouchableOpacity>
       
      </View>
      <View style={{flex:1, alignItems:'center'}} >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[colorPrimary, colorSecondary]}
        style={[css.btn1]}
      >
        

        <TouchableOpacity
          style={{ width: '100%', height: 64, justifyContent: 'center', alignItems: 'center', }}
         onPress={moodChange}
        >
          <Text style={{ color: 'white' }}>Change Emoji</Text>

        </TouchableOpacity>
      </LinearGradient>
      </View>
    </View>

  );
}


export default ChooseMood

const css = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#1F1A31',



  },
  Title: {
    color: colorWhite90,
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 27.32

  },
  heroSection: {
    width: '100%',
    height: 360,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',


  },
  subSection: {
    width: '85%',
    height: 350,
    backgroundColor: '#1B782A',
    borderRadius: 60,
    shadowColor: "#1B782A",
    borderColor: '#26FF49',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',

    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,

  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 60,

    borderWidth: 2,
    borderColor: 'black',



  },
  title: {



  },
  headerImage: {
    height: 50,
    width: 50,
    shadowOpacity: 0.5,
    backgroundColor: '#1F1A31',

    margin: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: 'center',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,

  },
  btn1:{
    width:180,
    height:40,
    borderColor:'#07F83C',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
   
  }

});
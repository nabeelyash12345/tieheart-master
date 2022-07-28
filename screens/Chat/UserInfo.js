import React,{useEffect,useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity,Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


const Data = [
  {
    id: 1,
    msg: 'I am in love',
    displaytype: require('../../assets/images/emoji.png'),
  },
  {
    id: 2,
    msg: 'I am sad',
    displaytype: require('../../assets/images/113.png')

  },
  {
    id: 3,
    msg: 'I am laughing',
    displaytype: require('../../assets/images/114.png')
  },
  {
    id: 4,
    msg: 'I am angry',
    displaytype: require('../../assets/images/001.png')
  },
  {
    id: 5,
    msg: 'I am in Love',
    displaytype: require('../../assets/images/115.png'),

  },
  {
    id: 6,
    msg: "I am cool",
    displaytype: require('../../assets/images/116.png'),

  },
  {
    id: 7,
    msg: "I am crying",
    displaytype: require('../../assets/images/117.png'),

  },
  {
    id: 8,
    msg: 'I am not feeling well',
    displaytype: require('../../assets/images/118.png'),

  },
  {
    id: 9,
    msg: "I am surprised",
    displaytype: require('../../assets/images/119.png'),

  },
  {
    id: 10,
    msg: 'I feel sleepy',
    displaytype: require('../../assets/images/211.png'),

  },
  {
    id: 11,
    msg: 'I want your kiss',
    displaytype: require('../../assets/images/212.png'),

  },
  {
    id: 12,
    msg: "Thinking about you",
    displaytype: require('../../assets/images/112.png'),

  },
  {
    id: 13,
    msg: "I am listening to Music",
    displaytype: require('../../assets/images/213.png'),

  },
  {
    id: 14,
    msg: "I am Nervous",
    displaytype: require('../../assets/images/214.png'),

  },
  {
    id: 15,
    msg: "I am Confused",
    displaytype: require('../../assets/images/215.png'),

  },
  {
    id: 16,
    msg: "I am Calm",
    displaytype: require('../../assets/images/216.png'),

  },
];

export default function UserInfo({
  name,
  lastMessage,
  onPress = console.log,
  imgUrl = 'https://picsum.photos/200',
}) {

  const [data, setData] = useState('')
  const  imgdef = require('../../assets/images/emoji.png')
  const [emoji, setEmoji] = useState('')
  const [user,setUserId] = useState('')
 

  // const getuser = async () => {
  //   try{  
  //     let user = await AsyncStorage.getItem('myId');  
  //     // let parsed2 = JSON.parse(user);  
  //     setUserId(user)
  //     // console.warn( 'user form useerinfo ', user);  
  //   }  
  //   catch(error){  
  //     alert(error)  
  //   } 
  // }
  //  getuser()

    

    // var params = '?mobile=' + user + '&mood=' + emoji;
 
    
     
    
   
 
  // useEffect(() => {

  //   // console.log('emoji dataaaa', emoji)
  //   // console.log('data of emoji ', data)
   

  //   fetch('http://43.204.13.143/tieheart/WebService.asmx/UpdateMood' + params ,   {
  //     method: 'GET',
     
      
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
         
  //        let result = responseJson[0].mood
  //       // console.warn('Mood API Response userinfo: ' + result);
       

  //        setEmoji(result)
         
  //     })
  //     .catch((error) => {
  //       Alert.alert('Error in userINFO', error.message);
  //       console.log('Mood API Error: ' + error.message);
       
  //     });

  //     if ( emoji && user == '') {
  //       setData((Data[1].displaytype))
  //       // console.log(Data[0].id, 'index 0 data')
  //     } else if(emoji == 1) {
  //      setData(Data[1].displaytype)
        
  //     } else if(emoji  == 2) {
  //      setData(Data[2].displaytype)
       
  //     }
  //     else if(emoji == 3) {
  //      setData(Data[3].displaytype)
  //     }
  //     else if(emoji  == 4) {
  //      setData(Data[4].displaytype)
  //     }
  //     else if(emoji  == 5) {
  //       setData(Data[5].displaytype)
  //      }
  //      else if(emoji  == 6) {
  //       setData(Data[6].displaytype)
  //      }
  //      else if(emoji  == 7) {
  //       setData(Data[7].displaytype)
  //      }
  //      else if(emoji  == 8) {
  //       setData(Data[8].displaytype)
  //      }
  //      else if(emoji  == 9) {
  //       setData(Data[9].displaytype)
  //      }
  //     else{
  //      setData(Data[1].displaytype)

  //     }
    
   
  
       
  // })


  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.userInfo}>
        <View style={{flexDirection:'row',marginLeft:20,marginTop:10}}>
        <Image
          source={{uri: imgUrl, width: 70, height: 70,borderColor:"pink",borderWidth:2}}
          style={styles.image}
        />
        <View style={{width:25,height:25,backgroundColor:"#1F1A31" ,borderRadius:50,justifyContent:'center',alignItems:"center",marginTop:39,marginLeft:-15}}>
         <Image source={data} style={{width:17,height:17}}/>
          </View>
       
       </View>
        <View style={{marginLeft:5}}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.message}>
            {lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    // marginBottom: 2,
    padding: 3,
    marginTop:10
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 50 / 1,
    margin: 5,
  },
  name: {
    fontSize: 14,
    color:"#ffffff"
  },
  message: {
    fontSize: 10,
    color:"#ffffff",
    marginTop:8
    

  },
});

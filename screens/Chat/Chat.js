import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import UserInfo from './UserInfo';
import { useSelector, useDispatch } from 'react-redux';
import { userListSelector, useMyId, userListSelectorSec } from './chat-slice';
import chatManager from '../../src/firebase/chatManager';
import withIncomingCallListener from '../Call/IncomingCallListener';
import { userById } from '../../src/redux/user-slice';
import { syncFcmToken } from '../../src/firebase/notification';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { Shadow } from 'react-native-neomorph-shadows';
import AsyncStorage from '@react-native-community/async-storage';





function Chat({ navigation }) {


  
  const userList = useSelector(userListSelector);
  const userListSec = useSelector(userListSelectorSec);
  const getUserById = useSelector(userById);
  const dispatch = useDispatch();
  
  const [data, setData] = useState()
  const myId = useSelector(useMyId);
  const [customSelectedIndex, setCustomSelectedIndex] = React.useState(0);
  const updateCustomSegment = (index) => {
    setCustomSelectedIndex(index);
  };
//  const [data1,setData1] = useState('')
 const [data2,setData2] = useState('')
 
const imgdef = require('../../assets/images/emoji.png');
const txtdef = 'I am in Love';


 
    var  displayData = async ()=>{  
      try{  
        let user = await AsyncStorage.getItem('image');  
        let parsed = JSON.parse(user);  
        setData(parsed)
        // console.warn(parsed, 'value is the mood value one ', data);  
      }  
      catch(error){  
        alert(error)  
      }  
    }  
    var  displayData2 = async ()=>{  
      try{  
        let user = await AsyncStorage.getItem('message');  
        let parsed1 = JSON.parse(user);  
        setData2(parsed1)
        // console.warn(parsed1, 'love text value two ', data2);  
      }  
      catch(error){  
        alert(error)  
      }  
    }  
    
    
    
   
   useEffect(() => {
    displayData()
    displayData2()
   })

  


  useEffect(() => {
   
    if (!myId) {
      return;
    }
    chatManager.listenForIncomingMessage(myId, dispatch);
    syncFcmToken(myId);

    return chatManager.unSubscribeForIncomingMessage;
  }, [dispatch, myId]);

  

  return (
    <SafeAreaView style={styles.container}>


      <View style={{ width: "100%", height: '100%', marginTop:-29, position:'absolute'}}>
       
          <SegmentedControlTab
            borderRadius={0}
            values={['Match', 'Secreat Chats']}
            selectedIndex={customSelectedIndex}
            onTabPress={updateCustomSegment}
            tabsContainerStyle={{
              height: 75,
              backgroundColor: '#342E49'
            }}
            tabStyle={{
              backgroundColor: '#342E49',
              borderWidth: 0,
              borderColor: 'transparent',
            }}
            activeTabStyle={{ backgroundColor: '#342E49', marginTop: 2, borderBottomWidth: 5, borderBottomColor: "#07F83C",  }}
            tabTextStyle={{ color: '#ffffff', fontSize: 16 }}
            activeTabTextStyle={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}
          />
          {customSelectedIndex === 0 && (
            <View>
              <FlatList
                data={userList}
                renderItem={({ item }) => (
                  <UserInfo
                    name={getUserById(item.id)?.name ?? item.id}
                    imgUrl={
                      getUserById(item.id)?.imgUrl || 'https://picsum.photos/200/200'
                    }
                    lastMessage={item.lastMessage}
                    onPress={() =>
                      navigation.navigate('ChatList', {
                        name: getUserById(item.id)?.name ?? item.id,
                        userId: item.id,
                      })
                    }
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
          {customSelectedIndex === 1 && (
            <View>
              <FlatList
                data={userListSec}
                renderItem={({ item }) => (
                  <UserInfo
                    name={getUserById(item.id)?.name ?? item.id}
                    imgUrl={
                      getUserById(item.id)?.imgUrl || 'https://picsum.photos/200/200'
                    }
                    lastMessage={item.lastMessage}
                    onPress={() =>
                      navigation.navigate('ChatList', {
                        name: getUserById(item.id)?.name ?? item.id,
                        userId: item.id,
                      })
                    }
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

          )}



        </View>



              
        <View style={{ width: "100%",alignSelf:'flex-end',bottom:15, position:'absolute',
      
              borderRadius: 20,
              height:100,
              backgroundColor:'rgba(102, 84, 84, 0.25)',
      }}>
          <Shadow
            inner
            useArt 
            style={{
              
              borderRadius: 20,
              shadowOpacity: 1,
              shadowColor: 'rgba(102, 84, 84, 0.25)',
              shadowRadius: 10,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              
            }}
          >

            <TouchableOpacity style={{ width: "100%", height: 100, justifyContent: 'center', alignItems: 'center' }}
             onPress={() => navigation.navigate('ChooseMood')}
            >
              <Image style={{
                width: 42, height: 42, shadowColor: "red  ",
                shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,

                elevation: 24,
              }} source={data ? data : imgdef } />
              <Text style={{ color: 'white' }}>{data2 ? data2 : txtdef  }</Text>
            </TouchableOpacity>


          </Shadow>
        {/* </View> */}



      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    width: "100%",
    height: "100%",
    position:'absolute'
  },

});

export default withIncomingCallListener(Chat);
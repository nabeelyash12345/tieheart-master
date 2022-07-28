import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import { configureFonts, Title } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import {  useSelector } from 'react-redux';
import { useMyId, getReadRecipient } from './Chat/chat-slice';





function Congratulations({navigation}) {

  const myId = useSelector(useMyId);
  return (
    <View style={css.container}>

      <ImageBackground
        source={require('../assets/images/bg.jpg')}
        style={css.bgContainer}
      >
        <View style={css.mainContainer}>
            <Image
             source={require('../assets/images/h3.gif')}
             style={{width:127,height:116, marginVertical:10}}
            />
           <Text style={css.Title}>Congratulations!</Text>
            
           
            <View style={{marginVertical:40}}>
           <Text style={css.locked}>We hava successful locked</Text>
           <Text style={css.sublocked}>Your feelings for {myId}</Text>
           </View>
           <TouchableOpacity>
             <Text style={{color:"white",textDecorationLine:"underline"}}>Note</Text>
           </TouchableOpacity>
            
        <View style={css.matchButtonWrap}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={[ css.btn, css.btnAccent]}
                      >
                        <Text style={css.btnText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
        </View>
      </ImageBackground>

    </View>

  );
}


export default Congratulations

const css = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  bgContainer: {
    width: "100%",
    height: "100%",


  },
  mainContainer: {
    width: "100%",
    height: "100%",
  
    alignItems: 'center',
    justifyContent:"center"
    

  },
  Title:{
    

    color: "white",
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 30.05,
    fontFamily: "Manrope",
    // marginVertical: 57,
    // position:"absolute"
    
      
  },
  locked:{
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 19.12,
    fontFamily: "Manrope",
    
    marginVertical: 5
    
  },

  sublocked:{
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 19.12,
    fontFamily: "Manrope",
    // marginVertical: 30
  },
 
 
 
 
 
  matchButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    width: 234,
    // marginVertical:30
 

  },

  btn: {
    fontFamily: "Manrope",
    fontSize: 16,
    backgroundColor: "#07F83C",
    height: 51,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop:10,
    shadowColor: "#07F83C",
  
    
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.30,
shadowRadius: 4.65,

elevation: 8,
  },
  btnText: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 14,
    textTransform: 'uppercase',
  },

});
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






function LockedFeelings({navigation}) {


  return (
    <View style={css.container}>

      <ImageBackground
        source={require('../assets/images/bg.jpg')}
        style={css.bgContainer}
      >
        <View style={css.mainContainer}>
        <View style={css.header}>
                    <Icon
                        type="AntDesign"
                        name="left"
                        style={css.back}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={{ fontWeight: '600', fontFamily: 'Manrope', fontSize: 21, lineHeight: 28.69, color: '#FFFFFF' }}>
                        Lock locked Feelings
                    </Text>
            </View>

            <View style={css.mainBox}>
                <View style={css.userbox}>
                   <View style={css.ImageBox}> 
                     <Image
                     source={require('../assets/images/Ellipse.png')}
                     style={{width:65,height:65}}
                     />
                   </View>
                </View>
                <View style={css.userbox1}>
                      <Text style={css.Title}>4447474748</Text>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>App Download</Text>
                           <Image
                           source={require('../assets/images/Mask1.png')}
                          /> 
                      </View>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>Feelings locked</Text>
                           <Image
                           source={require('../assets/images/Mask1.png')}
                          /> 
                      </View>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>TieHearts</Text>
                           <Image
                           source={require('../assets/images/Mask1.png')}
                          /> 
                      </View>
                </View>

            </View>

            <View style={css.mainBox2}>
                <View style={css.userbox}>
                   <View style={css.ImageBox}> 
                     <Image
                     source={require('../assets/images/Ellipse1.png')}
                     style={{width:65,height:65}}
                     />
                   </View>
                </View>
                <View style={css.userbox1}>
                      <Text style={css.Title}>4447474748</Text>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>App Download</Text>
                           <Image
                           source={require('../assets/images/Mask1.png')}
                          /> 
                      </View>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>Feelings locked</Text>
                           <Image
                           source={require('../assets/images/Mask2.png')}
                          /> 
                      </View>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>TieHearts</Text>
                           <Image
                           source={require('../assets/images/im.png')}
                          /> 
                      </View>
                </View>

            </View>
        
            
            <View style={css.mainBox}>
                <View style={css.userbox}>
                   <View style={css.ImageBox}> 
                     <Image
                     source={require('../assets/images/Ellipse.png')}
                     style={{width:65,height:65}}
                     />
                   </View>
                </View>
                <View style={css.userbox1}>
                      <Text style={css.Title}>4447474748</Text>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>App Download</Text>
                           <Image
                           source={require('../assets/images/im1.png')}
                          /> 
                      </View>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>Feelings locked</Text>
                           <Image
                           source={require('../assets/images/im1.png')}
                          /> 
                      </View>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:9}}>
                        <Text style={css.Title}>TieHearts</Text>
                           <Image
                           source={require('../assets/images/im1.png')}
                          /> 
                      </View>
                </View>

            </View>
            

       
        </View>
      </ImageBackground>

    </View>

  );
}


export default LockedFeelings

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
  
    // alignItems: 'center',
    

  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 128,
    justifyContent: 'center',
    alignItems: 'center'
},
back: {
  color: '#FFFFFF',
  fontSize: 26,
  left: -40
},
  mainBox:{
     height:155,
     width:"100%",
    // backgroundColor:"",
     flexDirection:'row',
     backgroundColor: "rgba(0, 0, 0, 0.1)"
     
     
  },
  mainBox2:{
    marginVertical:47,
    height:155,
    width:"100%",
  //  backgroundColor:'#000000',
  backgroundColor: "rgba(0, 0, 0, 0.1)",
    flexDirection:'row'
    
    
 },
  userbox:{
    width:117,
    height:144,
  
    
  },
  ImageBox:{
    width:66,
    height:66,
    borderColor:'red',
    borderWidth:5,
    marginVertical:12,
    marginLeft:12,
    borderRadius:30,
    justifyContent:"center",
    alignItems:"center"
    
    
    
  },
  userbox1:{
    width:150,
    height:144,
    marginTop:12
    
  },
  Title:{
    
    // marginTop:9,
   
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 19.12,
    fontFamily: "Manrope",
    // marginVertical:9
    
  
    
      
  },
 
 
 


});
import React, { Component, useState,useRef, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Animated ,Pressable} from 'react-native';
// import Svg,{G, Circle} from 'react-native-svg';
// import Icons from 'react-native-vector-icons/MaterialIcons'
import { Icon } from 'native-base';

// create a component
const NextButton = ({percentage,scrollTo}) => {
    const size=128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius= size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation =useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);
    const animation=(toValue)=>{
        return Animated.timing(progressAnimation, {
            toValue,
            duration:250,
            useNativeDriver:true
        }).start
    }
     useEffect(()=>{
         progressAnimation.addListener((value) =>{

            const strokeDashoffset = circumference-(circumference * value.value)/100

            if(progressRef?.current){
                progressRef.current.setNativeProps({
                     strokeDashoffset
                });
            }
         },[percentage])
     })
    return (
        <View style={styles.container}>
             {/* <Svg width={size} height={size}> */}
               {/* <Circle stroke={'#E6E7E8'} cx={center} cy={center} r={radius} strokeWidth={strokeWidth}/> */}
               {/* <Circle 
               ref={progressRef}
            //    stroke={'#F4338F'} 
               cx={center} 
               cy={center} 
               r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                // strokeDashoffset={circumference-(circumference*25) / 100}
                /> */}
               
             {/* </Svg> */}

             
            <Pressable  
                onPress={scrollTo}
                
                style={{width:29,height:29,backgroundColor:'#07F83C', borderRadius:50,}}
                
                >
                     <Icon
            type="AntDesign"
            name="arrowright"
            style={{color:'#FFFFFF', width:29, height:29}}
        
          />
                    
                </Pressable>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
    button:{
        position:'absolute',
        backgroundColor:'red',
        borderRadius:100,
        padding:20
    }
});

//make this component available to the app
export default NextButton;
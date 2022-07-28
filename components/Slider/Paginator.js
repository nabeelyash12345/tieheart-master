import React, { Component } from 'react';
import { View, Text, StyleSheet,Animated,useWindowDimensions } from 'react-native';


const Paginator = ({data, scrollX}) => {
    const {width}= useWindowDimensions()
    return (
        <View style={{flexDirection:'row', height:64}}>
           {data.map((_, i)=>{
               const inputRange=[(i-1)*width, i *width,(i+1)*width];

               const dotWidth=scrollX.interpolate({
                   inputRange,
                   outputRange:[10,20,10],
                   extrapolate:'clamp'
               })
          
          return <Animated.View style={[styles.dot,{width:dotWidth}]} key={i.toString()}/>
            })}
           
        </View>
    );
};


const styles = StyleSheet.create({
    dot:{
        height:8,
        
        borderRadius:5,
        backgroundColor:'#07F83C',
        marginLeft:8,
        
        marginTop:20
    }
});


export default Paginator;
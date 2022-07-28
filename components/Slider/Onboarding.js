import React, { Component,useRef,useState } from 'react';
import { View, Text, StyleSheet , FlatList,Animated} from 'react-native';


import slides from '../Slider/slides'
import NextButton from '../../components/Slider/NextButton';
import PreviousButton from '../Slider/PreviousButton';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';

const Onboarding = ({navigation}) => {
    const scrollX=useRef(new Animated.Value(0)).current;
    const [currentIndex,setcurrentIndex]=useState(0);
    const slidesRef=useRef(null)

    const viewableItemsChanged=useRef(({viewableItems})=>{
        setcurrentIndex(viewableItems[0].index);
    }).current;

     
    const viewConfig=useRef({viewAreaCoveragePercentThreshold:50}).current;

    const scrollTo=()=>{
        if (currentIndex < slides.length-1){
            slidesRef.current.scrollToIndex({index:currentIndex +1})
        }else{
            
            navigation.navigate('FollowProcess', {isNewUser:true})
            
        }
    };
    const scrollBack=()=>{
        if (currentIndex >= slides.length -3){
            slidesRef.current.scrollToIndex({index:currentIndex -1})
        }else{
            navigation.goBack()

        }
    };
    return (
        <View style={styles.container}>

            <View style={{flex:5,}}>
         <FlatList data={slides} renderItem={({item})=><OnboardingItem item ={item}/>}
          horizontal
          
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}
          bounces={false}
          keyExtractor={(item)=>item.id} 
          onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollX}}}],
            {
                useNativeDriver:false
            }
            
            
            
            
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
         />
         </View>
         <View style={{flex:1,flexDirection:"row", justifyContent:'space-between'}}>
             <View style={{marginLeft:18}}>
         <Paginator   data={slides} scrollX={scrollX} />
         </View>
         
         <View style={{width:100,height:100,flexDirection:'row'}}>
         <PreviousButton  scrollBack={scrollBack} percentage={(currentIndex -1)*(100 / slides.length)}/>
        
        
         <NextButton  scrollTo={scrollTo} percentage={(currentIndex +1)*(100 / slides.length)}/>
         </View>
        </View>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width:"100%",
        height:"100%",
        
        backgroundColor: '#1F1A31',
       
        
        
    },
});

export default Onboarding;
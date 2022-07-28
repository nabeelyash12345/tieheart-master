import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, } from 'react-native';
import { Shadow } from 'react-native-neomorph-shadows';
import { color } from 'react-native-reanimated';



// create a component
const OnboardingItem = ({ item }) => {
    // const {width}=useWindowDimensions();
    return (
        <View style={styles.container}>
              <View style={{width :388}}>
            <Shadow style={styles.headerImage}
                inner
                useArt
            >
                <Image source={item.image}
                    style={styles.image}

                />

            </Shadow>
            </View>




            <View style={{ flex: 1,  marginVertical: 50 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subDes}>{item.Description}</Text>



            </View>

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems:"flex-end"
        // backgroundColor: 'red',
        // borderColor:"red",
        // borderWidth:2,
        
        // marginLeft:21,
        // alignItems:"flex-end",
        // width:"100%"

        // marginTop:30
        


    },
    image: {
        width: 328,
        height: 252,
        resizeMode: 'cover',






    },
    headerImage: {
        height: 370,
        width: 350,
        left: 30,
        marginTop: 44,
        borderRadius: 20,
        shadowOpacity: 0.5,
        shadowColor: '#665454',
        shadowRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
 
    },


    title: {
        fontFamily: 'Manrope', 
        color: '#FFFFFF', 
        fontWeight: '700', 
        fontSize: 22, 
        lineHeight: 30.05,
        marginLeft:20,
        

    },
    subDes: {

        color: "black",
        fontFamily: 'Manrope',
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 18,
        lineHeight: 24.59,
        marginTop:14,
        marginLeft:20,



    }
});


export default OnboardingItem;
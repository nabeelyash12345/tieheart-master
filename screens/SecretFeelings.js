import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, } from 'react-native';
import React,{useEffect} from 'react';
import { Icon } from 'native-base';
import { Shadow } from 'react-native-neomorph-shadows';
import {  useSelector } from 'react-redux';
import { useMyId, getReadRecipient } from './Chat/chat-slice';


export default function SecretFeelings({ navigation }) {
      
    const myId = useSelector(useMyId);
   
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}  >
                <View style={styles.header}>
                    <Icon
                        type="AntDesign"
                        name="left"
                        style={styles.back}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={{ fontWeight: '600', fontFamily: 'Manrope', fontSize: 21, lineHeight: 28.69, color: '#FFFFFF' }}>
                        Lock Your Secret Feelings
                    </Text>
                </View>
                <View style={styles.crush}>
                    <Text style={{ fontFamily: 'Manrope', fontWeight: '500', fontSize: 22, lineHeight: 30.05, color: '#FFFFFF' }}>Choose what you feel for </Text>
                    <Text style={{ fontFamily: 'Manrope', fontWeight: '500', fontSize: 22, lineHeight: 30.05, color: '#FFFFFF' }}>your crush</Text>
                    <Text style={{ fontFamily: 'Manrope', fontWeight: '500', fontSize: 16, lineHeight: 21.86, color: '#FFFFFF', top: 20 }}>( {myId} )</Text>
                </View>
                <View style={styles.hearts}>
                    <Shadow 
                    inner // <- enable inner shadow
                    useArt // <- set this prop to use non-native shadow on ios
                    style={{
                   
                      shadowOpacity: 0.25,
                      shadowColor: colorBlack30,
                      shadowRadius: 10,
                      backgroundColor: '#FFFFFF',
                      width: 121,
                      height: 139,
                      justifyContent:'center',
                      alignItems:'center',
                      borderRadius:10,
                      borderWidth:1,
                      borderColor:'#FFFFFF'
                     
                    }}
                    
                    >
                       <Image source={require('../assets/images/h2.gif')} style={{ width: 112, height: 130, position:'relative' }} />
                        <Text style={{ fontWeight: '500', fontFamily: 'Manrope', fontSize: 18, lineHeight: 24.59, color: '#000000', position:'absolute', bottom:8 }}>Love</Text>

                    </Shadow>
                    <View>
                        <Text style={{ color: '#FFFFFF' }}>OR</Text>
                    </View>
                    <Shadow
                     inner // <- enable inner shadow
                     useArt // <- set this prop to use non-native shadow on ios
                     style={{
                    
                       shadowOpacity: 0.25,
                       shadowColor: colorBlack30,
                       shadowRadius: 10,
                       backgroundColor: '#FFFFFF',
                       width: 121,
                       height: 139,
                       borderRadius:10,
                       justifyContent:'center',
                       alignItems:'center',
                       borderWidth:1,
                       borderColor:'#FFFFFF'
                      
                     }}
                    
                    >
                        <Image source={require('../assets/images/hh.gif')} style={{ width: 114, height: 133, position:'relative' }} />
                        <Text style={{ fontWeight: '500', fontFamily: 'Manrope', fontSize: 18, lineHeight: 24.59, color: '#000000', position:'absolute', bottom:8 }}>Like</Text>

                    </Shadow>
                </View>
                <View style={styles.btnview}>
                     <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('ContactNumber')}>
                        <Text style={{ fontFamily: 'Manrope', fontWeight: '600', fontSize: 18, lineHeight: 25, color: '#FFFFFF' }}>Lock Feeling</Text>
                    </TouchableOpacity> 
                    
                </View>
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1A31'
    },
    bg: {
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    back: {
        color: '#FFFFFF',
        fontSize: 26,
        left: -20
    },
    crush: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    hearts: {
        height: 230,
        width: '100%',
        backgroundColor: '#1F1A31',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    heart1: {
        height: 139,
        width: 121,
        backgroundColor: '#1F1A31',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    btnview: {
        flex: 1,
        justifyContent: 'center'

    },
    btn: {
        width: 243,
        height: 51,
        borderRadius: 60,
        backgroundColor: '#07F83C',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#60C181",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 12,
    }

})
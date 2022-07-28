import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-neomorph-shadows';
import { Icon } from 'native-base';



export default function PersonalInformation() {
    return (
        <View style={styles.container}


        >

            <ImageBackground style={styles.img} resizeMode='cover'
                source={require('../assets/images/bg.jpg')}
            >
                <View style={styles.proImage}>
                    <Image style={{ width: 71, height: 68 }}
                        source={require('../assets/images/girl.png')}
                    />
                    <View style={styles.imoji}>
                        <Image style={{ width: 22, height: 22 }}
                            source={require('../assets/images/imoji.png')}
                        />
                    </View>
                    <View style={{ top: 20 }}>
                        <Text style={styles.textItem}>Melissa John</Text>
                    </View>
                </View>
                <View style={styles.boxShadow}>
                    <Shadow
                        inner // <- enable inner shadow
                        useArt // <- set this prop to use non-native shadow on ios
                        style={{

                            shadowOpacity: 0.25,
                            shadowColor: 'rgba(102, 84, 84, 0.25)',
                            shadowRadius: 15,
                            backgroundColor: '#1F1A31',
                            width: 311,
                            height: 444,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20

                        }}

                    >



                        <View style={{ flexDirection: 'row', }}>

                            <View style={[styles.textInput1, styles.singleInput]}>
                                <Text style={styles.singleText}>Phone No</Text>
                                <TextInput placeholderTextColor={'#FFFFFF'} underlineColorAndroid={'#A3A3A3'} placeholder="45325234" style={{ color: 'white', lineHeight: 21,fontFamily:'Poppins',fontSize:14 }} />
                            </View>

                            <TouchableOpacity style={{left:-35}}>
                                <Icon
                                    type="FontAwesome"
                                    name="phone"
                                    style={styles.icon}
                                // onPress={() => navigation.goBack()}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{left:-20}}>
                                <Icon
                                    type="Ionicons"
                                    name="chatbox-ellipses-outline"
                                    style={styles.icon}
                                // onPress={() => navigation.goBack()}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.singleInput}>

                            <Text style={styles.singleText}>Gender</Text>
                            <View style={styles.textInput}>
                                <TextInput placeholderTextColor={'#FFFFFF'} underlineColorAndroid={'#A3A3A3'} placeholder="Female" style={{ color: 'white', lineHeight: 21,fontFamily:'Poppins',fontSize:14  }} />
                            </View>
                        </View>
                        <View style={styles.singleInput}>

                            <Text style={styles.singleText1}>Realtionship Status</Text>
                            <View style={styles.textInput}>
                                <TextInput placeholderTextColor={'#FFFFFF'} underlineColorAndroid={'#A3A3A3'} placeholder="Single" style={{ color: 'white', lineHeight: 21 ,fontFamily:'Poppins',fontSize:14 }} />
                            </View>
                        </View>
                        <View style={styles.singleInput}>

                            <Text style={styles.singleText1}>Bio</Text>
                            <View style={styles.textInput11}>
                                <TextInput underlineColorAndroid={'#A3A3A3'} style={{ color: 'white' }} />
                            </View>
                            <View style={styles.textInput11}>
                                <TextInput underlineColorAndroid={'#A3A3A3'} style={{ color: 'white' }} />
                            </View>
                            <View style={styles.textInput11}>
                                <TextInput underlineColorAndroid={'#A3A3A3'} style={{ color: 'white' }} />
                            </View>

                        </View>
                    </Shadow>
                </View>


            </ImageBackground>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#1F1A31'
    },
    img: {
        flex: 1,
        width: '100%',
    },
    proImage: {
        height: 220,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imoji: {
        width: 80,
        height: 65,
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'

    },
    textItem: {
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 30,
        color: '#ffffff'
    },
    boxShadow: {
        width: '100%',
        height: 480,
        justifyContent: 'center',
        alignItems: 'center',
        top: 15
    },
    textInput: {
        width: 227,
        height: 40,
        marginVertical:10   
    },
    textInput11: {
        width: 227,
        height: 40,
    },
    singleText: {
        color: '#939295',
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: 18,
        lineHeight: 27
    },
    icon: {
        color: '#07F83C',
        top: 50,
        fontSize:18
    },
    textInput1: {
        width: 227,
        left: 13,
        marginVertical:10

    },
    singleInput: {
        justifyContent:'center',
    },
    singleText1: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: 18,
        lineHeight: 27,
        color: '#FFFFFF'
    }
})

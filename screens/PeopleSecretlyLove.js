import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import React from 'react';
import RadialGradient from 'react-native-radial-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function PeopleSecretlyLove({navigation}) {
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.img} resizeMode='cover'
                source={require('../assets/images/bg.jpg')}
            >
                <View style={styles.people}>
                    <Text style={{ fontFamily: 'Manrope', fontWeight: '700', fontSize: 51, lineHeight: 69.67, color: '#FAFF12', right: 10 }} >4</Text>
                    <Text style={styles.love}>People secretly Love/ {`\n`}Like You</Text>
                    <Image source={require('../assets/images/likes.png')} style={styles.like} />
                </View>
                <View style={styles.box} >
                    <View style={styles.revealBox1} >
                        <View style={styles.box1} >

                            <RadialGradient style={{ width: 107, height: 107, borderRadius: 50 }}

                                colors={['#D8D4D4', '#C4C4C4',]}
                                stops={[0.24, 0.4,]}
                                center={[50, 50]}
                                radius={100}
                            >
                            </RadialGradient>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btntxt}>Reveal</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.box1}>
                            <RadialGradient style={{ width: 107, height: 107, borderRadius: 50 }}

                                colors={['#D8D4D4', '#C4C4C4',]}
                                stops={[0.24, 0.4,]}
                                center={[50, 50]}
                                radius={100}
                            >
                            </RadialGradient>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btntxt}>Reveal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.revealBox2}>
                        <View style={styles.box1}>
                            <RadialGradient style={{ width: 107, height: 107, borderRadius: 50 }}

                                colors={['#D8D4D4', '#C4C4C4',]}
                                stops={[0.24, 0.4,]}
                                center={[50, 50]}
                                radius={100}
                            >
                            </RadialGradient>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btntxt}>Reveal</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.box1}>
                            <RadialGradient style={{ width: 107, height: 107, borderRadius: 50 }}

                                colors={['#D8D4D4', '#C4C4C4',]}
                                stops={[0.24, 0.4,]}
                                center={[50, 50]}
                                radius={100}
                            >
                            </RadialGradient>
                            <TouchableOpacity style={styles.btn}
                             onPress={() => navigation.navigate('PersonalInformation')}
                            >
                                <Text style={styles.btntxt}>Reveal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ImageBackground >
        </View >
    );
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#1F1A31'
    },
    img: {
        flex: 1,
        width: '100%'
    },
    people: {
        width: '100%',
        height: 380,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    like: {
        width: 96,
        height: 165
    },
    love: {
        fontFamily: 'Manrope',
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 24.59,
        color: '#FFFFFF',
    },
    box: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    box1: {
        height: 178,
        width: 149,
        borderRadius: 13,
        backgroundColor: '#1F1A31',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.46,
        shadowRadius: 11.14,

        elevation: 17,

    },
    revealBox1: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    revealBox2: {
        flexDirection: 'row',

    },
    btn: {
        width: 88,
        height: 21,
        borderRadius: 60,
        backgroundColor: '#07F83C',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    btntxt: {
        fontFamily: 'Manrope',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 19.12,
        color: '#FFFFFF'
    }
})
import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import TouchID from "react-native-touch-id";
import Home from '../../Home';

export default class FingerPrint extends Component {
   constructor(props){
     super(props);
     this.state = {
       navItemIndex:'0'
     }
     
   }
     optionalConfigObject = {
    title: 'Authentication Required',
    imageColor: 'blue', 
    imageErrorColor: '#ff0000', 
    sensorDescription: 'Touch sensor',
    sensorErrorDescription: 'try again', 
    cancelText: '', 
    fallbackLabel: 'Show Passcode', 
    unifiedErrors: false, 
    passcodeFallback: false, 
    backgroundColor:'red'
  };

  _pressHandler() {
    TouchID.authenticate('', this.optionalConfigObject)
      .then(success => {
        // AlertIOS.alert('Authenticated Successfully');
        Alert.alert('Authenticated Successfully')
        this.props.navigation.navigate('Home')
      })
      .catch(error => {
        // AlertIOS.alert('Authentication Failed');
        Alert.alert('Authentication Failed');
        BackHandler.exitApp()
        // this.props.navigation.navigate('Contacts',{

        //   viewType:"match"
        // }
        // )
        
        

      });
  }

  render() {
    return (
      <View style={styles.container}>
          <Text >
          
          {this._pressHandler()}
          
        
          </Text>

      </View>
    );
  }
   
 
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
});
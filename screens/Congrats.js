import {
  View, Text, StyleSheet, useState, Image, ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';





export default class Congrats extends Component {

          constructor(props) {
             super(props)
             this.state={
               plansList:[]
             }
          }
          
        

  render() {

    // var { navigation } = this.props; 
    // var currentdate = navigation.getParam('current')
    // console.log(currentdate,'currentdate of the plan')
    var params = '?mobile=' + _mobile;

    fetch('http://43.204.13.143/tieheart/WebService.asmx/getactiveplan' + params , {
        method:'GET'
    })
    .then((response) => response.text() )
    .then((responseJson) => {
        var par = JSON.parse(responseJson)
        console.log(par[0].IsActive, 'plan is active ')

        this.setState({
            isplanActive:par[0].IsActive
        })
       console.log(this.isplanActive,'hsdjshdgsjdhsjdhjh')
    if (par && par.length) {
      var tempDataArray = [];
      for (var i = 0; i < par.length; i++) {
        tempDataArray.push({
          // PlanName: responseJson[i].PlanName,
          // OrderNo: responseJson[i].OrderNo,
          // TrackingId: responseJson[i].TrackingId,
          // Amount: responseJson[i].Amount,
          // PaymentMode: responseJson[i].PaymentMode,
          StartDate: par[i].StartDate,
          EndDate: par[i].EndDate,
          // PlanStatus: responseJson[i].PlanStatus,
          // statuscolor: responseJson[i].statuscolor,
        });
        // console.log('ejdkfjalk',par[i].StartDate);
      }
      this.setState({
        plansList: tempDataArray,
        noRecord: false,
      });
    } else {
      this.setState({
        plansList: tempDataArray,
        noRecord: true,
        noRecordText: 'No Record',
      });
    }
  })
  .catch((error) => {
    Alert.alert(
      'Error',
      'Unable to get payment history. Please try again.',
    );
    this.setState({
      showLoader: false,
      noRecord: true,
      noRecordText: 'No Record',
    });
    })
    
    return (
      <SafeAreaView style={css.Container}>

        <View style={css.headerPrimary}>



          <Text style={{ color: "white", marginTop: 20, fontSize: 18, fontWeight: "500" }}>My plan details</Text>


        </View>

        <View style={css.mainWrap}>

          <View style={css.stepsWrap}>
            <TouchableOpacity style={css.stepRow}>
              <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                <Image source={require('../assets/images/0001.png')} style={css.stepIcon} />
              </View>
              {/* <Text style={css.stepCount}>1</Text> */}
              <View style={css.stepCol}>
                <Text style={css.stepLabel}>Track the result of your all locked feelings.</Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity style={css.stepRow}>
              <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                <Image source={require('../assets/images/message.png')} style={css.stepIcon} />
              </View>
              <View style={css.stepCol}>
                <Text style={css.stepLabel}>Ask to reveal Identity of lover.</Text>

              </View>
            </TouchableOpacity>
            <TouchableOpacity style={css.stepRow}>
              <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                <Image source={require('../assets/images/010.png')} style={css.stepIcon} />
              </View>
              <View style={css.stepCol}>
                <Text style={css.stepLabel}>Chat with your crush without
                  revaling your identity</Text>

              </View>
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ width: "100%", height: 250, backgroundColor: "#1F1A31", justifyContent: 'center', alignItems: 'center' }}>
     {this.state.plansList.map((item, key) => ( 
      <View style={{ width: "95%", height: 300, backgroundColor: "#1A2A4B", borderTopLeftRadius: 10, borderTopRightRadius: 10 ,paddingLeft:15,paddingRight:25,paddingTop:40}} key={key}>
            <Text style={css.stepText}>My Plan Details</Text>
            <View style={{flexDirection:'row',marginTop:60,justifyContent:"space-between"}}>
              <Text style={css.stepText}>Plan Start Date   {item.StartDate}</Text>
              <Image  style={{width:28, height:28}} source={require('../assets/images/116.png')}/>
            </View>
            <View style={{flexDirection:'row',marginTop:40,justifyContent:"space-between"}}>
              <Text style={css.stepText}>Plan Start Date  {item.EndDate}</Text>
              <Image  style={{width:28, height:28}} source={require('../assets/images/214.png')}/>
            </View>
          </View>
     ))}
   
        </View>


      </SafeAreaView>
    );
  }
}

const css = StyleSheet.create({
  Container: {
    backgroundColor: '#1F1A31',
    width: '100%',
    height: "100%"

  },
  headerPrimary: {
    width: '100%',
    height: 100,
    marginVertical: 15,


    justifyContent: "space-around",
    alignItems: "center"
  },
  mainWrap: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,


  },
  bg: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    position: 'absolute',
    top: statusBarHeight,



  },
  btnCustom: {
    width: 200,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: "#07F83C",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  stepsWrap: {
    paddingHorizontal: 20,
  },
  stepRow: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 40,

  },
  stepCount: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 16,
    textAlign: 'center',
    position: 'absolute',
    // top: 16,
    // left: 5,
    zIndex: 1,
    width: 40,
  },
  stepIcon: {
    fontSize: 50,
    color: colorAccent,
    alignSelf: 'center',
    width: 22,
    height: 22

  },
  stepCol: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  stepLabel: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 6,
    marginLeft: 6
  },
  stepText: {
    fontFamily: fontRegular,
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
    // marginVertical:26
  },
  headerTitle: {
    fontFamily: fontBold,
    color: '#FFFFFF',
    fontSize: 20,
    marginVertical: 30,
    paddingHorizontal: 20,
    textAlign: 'center',
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
    marginTop: 10,
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
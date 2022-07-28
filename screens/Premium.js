import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Modal,
  Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import styles from '../Style';


export default class Premium extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      plans: [],
      plans2: [
        {
          id: '0',
          type: 'Best Deal',
          monthnum: '12',
          monthname: 'Months',
          discount: 'Save 62%',
          cost: '₹899',
          costpermonth: 'or ₹74.91/mo',
        },
        {
          id: '1',
          type: 'Most Popular',
          monthnum: '6',
          monthname: 'Months',
          discount: 'Save 58%',
          cost: '₹499',
          costpermonth: 'or ₹83.16/mo',
        },
        {
          id: '2',
          type: '',
          monthnum: '1',
          monthname: 'Month',
          discount: '',
          cost: '₹199',
          costpermonth: 'or ₹199/mo',
        },
      ],
      itemindexPlan: '2',
      showBtn: true,
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('Premium Focused');
      this.getPlans();
    });
  }

  PressedItem = (itemId) => {
    console.log('Plan Item ID: ' + itemId);
    this.setState({ itemindexPlan: itemId });
  };

  getPlans() {
    this.setState({
      showLoader: true,
      showBtn: false,
    });
    console.log('GetPlan API: ' + host + 'GetPlan');
    fetch(host + 'Getplansdetails?', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetPlan API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              bigid: responseJson[i].pid,
              Plan_Name: responseJson[i].title,
              plantype: responseJson[i].plantype,
              Price: responseJson[i].Price,
              Month: responseJson[i].validity/30,
              Status: responseJson[i].Status,
              dateadded: responseJson[i].dateadded,
              daysCount: responseJson[i].daysCount,
              Saveing: responseJson[i].subtitle,
              saveingcolor: responseJson[i].saveingcolor,
              symbol: responseJson[i].symbol,
              Amount: responseJson[i].Price,
            });
          }
          this.setState({
            plans: tempDataArray,
            showBtn: true,
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to get plans. Please try again.');
        this.setState({
          showLoader: false,
          showBtn: false,
        });
      });
  }

  calculatePlanPerMonth(price, months) {
    var number = 0;
    var price_int = parseInt(price);
    var months_int = parseInt(months);
       
    var cost_per_month = price_int / months_int;
    return 'or ₹' + Math.floor(cost_per_month ? cost_per_month : number ) + '/mo';
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

   callapi=( ) => {
    // this.props.navigation.navigate('Payment', {
    //   title: 'Payment',
    //   url:
    //  'http://43.204.13.143/tieheart/WebService.asmx?op=subscribe_user_plan' +
    //     this.state.itemindexPlan +
    //     '&mobile=' +
    //     _mobile,
    // })
    fetch('http://43.204.13.143/tieheart/WebService.asmx/subscribe_user_plan' +'?plan_id=' + this.state.itemindexPlan +'&mobile=' + _mobile +' &payment_id=' + Math.random(100),  {
          method: 'GET',
        }).
        then((response) => response.json()).
        then((responseJson) => {
         console.log(responseJson,  'ajsdhasjdahsdjasdha')
        })
        .catch((err) => {
          console.log(err, 'error from premium')
        })
        this.props.navigation.navigate('Home')
    this.setModalVisible(false)
  
   }


  render() {
    const { modalVisible } = this.state;
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[colorPrimary, colorSecondary]}
          style={{ height: statusBarHeight }}>
          <StatusBar
            barStyle="light-content"
            translucent={true}
            backgroundColor={'transparent'}
          />
        </LinearGradient>
        <View style={css.Container}>
          <View style={css.headerPrimary}>

            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[colorBlack50, "#172746"]}
              style={css.headerPrimary}
            >

              <Text style={{ color: "white", marginTop: 20, fontSize: 18, fontWeight: "500" }}>TieHearts premium</Text>
              <View
                style={{
                  height: 68,
                  width: 68,
                  borderRadius: 50,
                  backgroundColor: '#172746',
                  borderColor: '#172746',
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#172746",
                  shadowOffset: {
                    width: 0,
                    height: 12,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 16.00,

                  elevation: 24,



                }}>
                <Image style={{ height: 42, width: 42, }}
                  source={require('../assets/images/100.png')}
                />


              </View>
            </LinearGradient>


          </View>
          <View style={css.mainWrap}>

            <View style={css.stepsWrap}>
              <View style={css.stepRow}>
                <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                  {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                  <Image source={require('../assets/images/message.png')} style={css.stepIcon} />
                </View>
                {/* <Text style={css.stepCount}>1</Text> */}
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Anonyams chat</Text>
                  <Text style={css.stepText}>
                    Chat with your crush without
                    revaling your identity
                  </Text>
                </View>
              </View>
              <View style={css.stepRow}>
                <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                  {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                  <Image source={require('../assets/images/message.png')} style={css.stepIcon} />
                </View>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Anonyams chat</Text>
                  <Text style={css.stepText}>
                    Chat with your crush without
                    revaling your identity
                  </Text>
                </View>
              </View>
              <Pressable style={css.stepRow} onPress={() => this.props.navigation.navigate('Congrats') } >
                <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                  {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                  <Image source={require('../assets/images/message.png')} style={css.stepIcon} />
                </View>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Anonyams chat</Text>
                  <Text style={css.stepText}>
                    Chat with your crush without
                    revaling your identity
                  </Text>
                </View>
              </Pressable>
              <View style={css.stepRow}>
                <View style={{ width: 40, height: 40, backgroundColor: "#1A2A4B", justifyContent: 'center', alignItems: "center", borderRadius: 10 }}>
                  {/* <Icon type="Ionicons" name="heart" style={css.stepIcon} /> */}
                  <Image source={require('../assets/images/message.png')} style={css.stepIcon} />
                </View>
                <View style={css.stepCol}>
                  <Text style={css.stepLabel}>Anonyams chat</Text>
                  <Text style={css.stepText}>
                    Chat with your crush without
                    revaling your identity
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
            <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={[colorPrimarybtn, colorSecondarybtn]}
                      style={[styles.btn, css.btnCustom,styles.btnAccent]}
                    >
              <TouchableOpacity
               
                style={{width:'100%', height:64, justifyContent:'center', alignItems:'center'}}
                
                onPress={() => this.setModalVisible(true)}>
                <Text style={styles.btnText}>Buy Now</Text>
              </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>


          <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              this.setModalVisible(!modalVisible);
            }}
           >
            <View style={{ width: "100%", height: "100%", backgroundColor: colorBlack60 }}>
              <View style={{
                width: 314, height: 500, marginHorizontal: 30, marginVertical: 80, backgroundColor: "white", borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10
              }}>
                <View style={css.headerPrimaryTwo}>

                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={[colorBlack50, "#172746"]}
                    style={css.headerPrimaryTwo}
                  >

                    <Text style={{ color: "white", marginTop: 20, fontSize: 18, fontWeight: "500" }}>Get Tiehearts Premium</Text>
                    <View
                      style={{
                        height: 68,
                        width: 68,
                        borderRadius: 50,
                        backgroundColor: '#172746',
                        borderColor: '#172746',
                        borderWidth: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: "#172746",
                        shadowOffset: {
                          width: 0,
                          height: 12,
                        },
                        shadowOpacity: 0.58,
                        shadowRadius: 16.00,

                        elevation: 24,



                      }}>
                      <Image style={{ height: 42, width: 42, }}
                        source={require('../assets/images/100.png')}
                      />


                    </View>
                  </LinearGradient>
                </View>

                <View style={css.mainWrapTwo}>


                  {/* <Text style={css.titleSecondary}>TieHearts Fortune Plans</Text> */}
                  <View style={css.gridWrap}>
                    {this.state.plans.map((item, key) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          css.gridBox,
                          this.state.itemindexPlan == item.bigid
                            ? css.gridBoxActive
                            : null,
                        ]}
                        onPress={() => {
                          this.PressedItem(item.bigid);
                        }}
                        key={key}>

                        <Text style={css.gridBoxNum}>{item.Month}</Text>
                        {item.Month == '1' ? (
                          <Text style={css.gridBoxMo}>Month</Text>
                        ) : (
                          <Text style={css.gridBoxMo}>Months</Text>
                        )}
                        {item.Saveing != null ? (
                          <Text style={css.gridBoxDiscount}>Save {item.Saveing}</Text>
                        ) : (
                          <Text style={css.gridBoxDiscount} />
                        )}
                        <Text style={css.gridBoxCost}>₹{item.Amount}</Text>
                        <Text
                          style={[
                            css.gridBoxCostMo,
                            this.state.itemindexPlan == item.bigid
                              ? css.gridBoxCostMoActive
                              : null,
                          ]}>
                          {this.calculatePlanPerMonth(item.Price, item.Month)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {this.state.showBtn ? (
                    <View style={{ marginTop: 30 }}>
                       <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={[colorPrimarybtn, colorSecondarybtn]}
                      style={[styles.btn,styles.btnAccent, css.btnCustom]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={{width:'100%', height:64, justifyContent:'center', alignItems:'center'}}
                        onPress={
                         this.callapi
                          
                        }>
                        <Text style={styles.btnText}>Continue</Text>
                      </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  ) : null}
                </View>

                {this.state.showLoader ? (
                  <View style={styles.loader}>
                    <ActivityIndicator
                      animating={true}
                      color={colorAccent}
                      size="large"
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </Modal>
          {/* <Pressable
            style={[styles.btn, styles.btnAccent, css.btnCustom]}

            onPress={() => this.setModalVisible(true)}
          >
            <Text style={{ width: 10 }}>Show Modal</Text>
          </Pressable> */}
        </View>


      </SafeAreaView>
    );
  }
}

const css = StyleSheet.create({
  Container: {
    // backgroundColor: 'red',
    width: '100%',
    height: "100%"
  },
  mainWrapTwo: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,

    marginTop: -2,

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10




  },
  headerPrimary: {
    width: '100%',
    height: 194,
    marginVertical: 15,
   
  
    justifyContent: "space-around",
    alignItems: "center",
  
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
    paddingBottom: 20,
    marginTop: 8

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
    fontSize: 14,
    marginLeft: 8
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
  title: {
    fontFamily: fontBold,
    color: '#191036',
    fontSize: 22,
    paddingTop: 30,
  },
  titleSecondary: {
    fontFamily: fontBold,
    color: colorSecondary,
    fontSize: 22,
    paddingTop: 40,
  },
  infoBox: {
    backgroundColor: '#fff7d4',
    width: '85%',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    borderRadius: 10,
    borderColor: colorAccent,
    borderWidth: 2,
    shadowColor: colorBlack70,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoBoxRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoIcon: {
    fontSize: 18,
    color: colorSecondary,
    marginRight: 10,
  },
  infoText: {
    fontFamily: fontRegular,
    color: colorPrimary,
    fontSize: 16,
  },
  gridWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 40,
    paddingHorizontal: 10,

  },
  gridBox: {
    width: '35%',

    backgroundColor: "white",
    position: 'relative',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 3,
  },
  gridBoxActive: {
    borderColor: colorAccent,
    backgroundColor: "white",
  },
  gridBoxInfo: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: colorPrimary,
    fontFamily: fontRegular,
    color: colorWhite,
    fontSize: 10,
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  gridBoxNum: {
    fontFamily: fontBold,
    color: colorPrimary,
    fontSize: 26,
    textAlign: 'center',
    marginTop: 25,
  },
  gridBoxMo: {
    fontFamily: fontBold,
    color: colorPrimary,
    fontSize: 18,
    textAlign: 'center',
  },
  gridBoxDiscount: {
    fontFamily: fontRegular,
    color: colorAccent,
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 10,
  },
  gridBoxCost: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  gridBoxCostMo: {
    fontFamily: fontBold,
    color: colorBlack60,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
    marginTop: 10,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  gridBoxCostMoActive: {
    backgroundColor: "white",
    color: colorWhite,
  },
  btnCustom: {
    width: 200,
    marginTop: 20,
  },
  headerPrimaryTwo: {
    width: '100%',
    height: 188,

    backgroundColor: "#1A2A4B",

    justifyContent: "space-around",
    alignItems: "center",

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
});
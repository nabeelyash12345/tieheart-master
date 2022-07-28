import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import styles from '../Style';

export default class FollowUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      noRecord: false,
      noRecordText: 'Please wait..',
      itemsList: [],
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('FollowUpResume');
      this.getCrushList();
    });
  }

  getCrushList() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile;
    console.log('CrushList API: ' + host + 'UserCrushListpayment' + params);
    fetch(host + 'UserCrushListpayment' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('CrushList API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              id: responseJson[i].bigid,
              Photo: responseJson[i].Photo,
              crushmobile: responseJson[i].crushmobile,
              name: responseJson[i].name,
              Feeling: responseJson[i].Feeling,
              crushtoken: responseJson[i].crushtoken,
              match: responseJson[i].match,
              download: responseJson[i].download,
            });
          }
          this.setState({
            itemsList: tempDataArray,
            noRecord: false,
          });
        } else {
          this.setState({
            itemsList: tempDataArray,
            noRecord: true,
            noRecordText: 'No Record',
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Unable to get records. Please try again.');
        this.setState({
          showLoader: false,
          noRecord: true,
          noRecordText: 'No Record',
        });
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[colorPrimary, colorSecondary]}
          style={{height: statusBarHeight}}>
          <StatusBar
            barStyle="light-content"
            translucent={true}
            backgroundColor={'transparent'}
          />
        </LinearGradient> */}

        <View style={css.mainWrap}>
         
          <ImageBackground
            source={require('../assets/images/bg.jpg')}
            style={css.bg}>
               <View style={{
            // backgroundColor: colorPrimary,
            height: 52,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            marginVertical: 20
          }}>
            <View style={{
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 5,
              flexDirection: 'row',
            }}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => this.props.navigation.goBack()}>
                <Icon
                  type="AntDesign"
                  name="left"
                  style={styles.navBtnIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={css.Title}>Lock Locked Feelings</Text>
          </View>
            {this.state.noRecord ? (
              <View style={css.noData}>
                <Icon
                  type="FontAwesome"
                  name="heart-o"
                  style={css.noDataIcon}
                />
                <Text style={css.noDataTitle}>{this.state.noRecordText}</Text>
              </View>
            ) : (
              <ScrollView bounces={false}>
                {this.state.itemsList.map((item, key) => (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={css.listItem}
                    key={key}>
                    {item.Photo == '' || item.Photo == null ? (
                      <Image
                        source={require('../assets/images/noimg_other.png')}
                        style={css.listItemPic}
                      />
                    ) : (
                      <Image
                        source={{ uri: host_photo + item.Photo }}
                        style={css.listItemPic}
                      />
                    )}
                    <View style={css.listItemText}>
                      <Text style={css.listItemTitle}>{item.crushmobile}</Text>

                      {item.download == 'true' ? (

                        <View style={{ flexDirection: "row", justifyContent: 'space-between', width: 160}}>
                          <Text style={css.listItemSubtitle}>
                            App Downloaded


                          </Text>
                          <Icon
                            type="Ionicons"
                            name="checkmark-circle"
                            style={css.listItemIconYes}
                          />
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", justifyContent: 'space-between', width: 160 }}>

                          <Text style={css.listItemSubtitle}>
                            App Downloaded
                          
                          </Text>
                          <Icon
                            type="Ionicons"
                            name="close-circle"
                            style={css.listItemIconNo1}
                          />
                        </View>
                      )}

                      {item.match == 'true' ? (
                        <View style={{ flexDirection: "row", justifyContent: 'space-between', width: 160 }}>
                          <Text style={css.listItemSubtitle}>
                            Feeling Locked

                          </Text>
                          <Icon
                            type="Ionicons"
                            name="checkmark-circle"
                            style={css.listItemIconYes}
                          />

                        </View>
                      ) : (

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 160 }}>
                          <Text style={css.listItemSubtitle}>
                            Feeling Locked


                          </Text>
                          <Icon
                            type="Ionicons"
                            name="checkmark-circle"
                            style={css.listItemIconNo}
                          />
                        </View>
                      )}
                      {item.match == 'true' ? (
                        <View style={{ flexDirection: "row", justifyContent: 'space-between', width: 160 }}>
                          <Text style={css.listItemSubtitle}>

                            TieHearts
                          </Text>
                          <Icon
                            type="Ionicons"
                            name="checkmark-circle"
                            style={css.listItemIconYes}
                          />
                        </View>
                      ) : (

                        <View style={{ flexDirection: "row", justifyContent: 'space-between', width: 160 }}>
                          <Text style={css.listItemSubtitle}>

                            TieHearts
                          </Text>
                          <Icon
                            type="Ionicons"
                            name="close-circle"
                            style={css.listItemIconNo1}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </ImageBackground>
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
      </SafeAreaView>
    );
  }
}

const css = StyleSheet.create({
  mainWrap: {
    width: '100%',
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  bg: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 40,
  },
  versionName: {
    fontFamily: fontThin,
    fontSize: 14,
    color: colorBlack90,
    marginTop: 10,
  },
  loading: {
    marginTop: 40,
    marginBottom: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    // paddingLeft:20
  },
  listItemPic: {
    width: 64,
    height: 64,
    borderRadius: 100,
    // marginHorizontal: 10,
    marginTop:-19,
    borderColor: '#07F83C',
    borderWidth: 2,
    // backgroundColor:"red"
    // marginVertical: 20
    marginLeft:20

  },
  listItemText: {
    // borderBottomWidth: 3,
    // borderBottomColor: colorBlack10,
    flex: 1,
    paddingTop: 12,
    paddingBottom: 5,
    marginLeft: 32,
    // backgroundColor:"red"
    // borderColor:"red",
    // borderWidth:2,
  },
  listItemTitle: {
    fontFamily: "Manrope",
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 9,
    fontWeight:"400",
    lineHeight:19.12,
    marginTop:20,
    
    
  },
  listItemSubtitle: {
    fontFamily: "Manrope",
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 9,
    fontWeight:"400",
    lineHeight:19.12,
  },
  listItemIconYes: {
    fontSize: 15,
    color: '#07F83C',
    marginLeft: 30
  },
  listItemIconNo: {
    fontSize: 15,
    color: '#FFE923',
    marginLeft: 30

  },
  listItemIconNo1:{
    fontSize: 15,
    color: 'red',
    marginLeft: 30
  },
  searchWrap: {
    backgroundColor: colorPrimaryDark,
    paddingHorizontal: 50,
    paddingVertical: 5,
    position: 'relative',
  },
  searchInput: {
    color: colorWhite,
    fontSize: 16,
    height: 40,
  },
  searchIcon: {
    color: colorWhite80,
    fontSize: 20,
    position: 'absolute',
    left: 15,
    top: 14,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTitle: {
    fontFamily: fontBold,
    color: colorBlack50,
    fontSize: 14,
  },
  noDataIcon: {
    fontSize: 40,
    color: colorBlack50,
    marginBottom: 10,
  },
  headerPrimary1: {
    backgroundColor: "red",
    height: 52,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    marginVertical: 19

  },
  Title:{
    color: colorWhite90,
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight:"600",
    lineHeight:27.32

  }
});
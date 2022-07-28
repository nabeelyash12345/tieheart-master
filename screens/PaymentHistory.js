import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'native-base';
import styles from '../Style';

export default class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      noRecord: true,
      noRecordText: 'Please wait..',
      plansList: [],
    };
    this.props.navigation.addListener('willFocus', () => {
      console.log('PaymentHistoryResume');
      this.getPaymentDetails();
    });
  }

  getPaymentDetails() {
    this.setState({
      showLoader: true,
    });
    var params = '?mobile=' + _mobile;
    console.log('PaymentHistory API: ' + host + 'UserPlan' + params);
    fetch(host + 'UserPlan' + params, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('PaymentHistory API Response: ' + responseJson);
        this.setState({
          showLoader: false,
        });

        if (responseJson && responseJson.length) {
          var tempDataArray = [];
          for (var i = 0; i < responseJson.length; i++) {
            tempDataArray.push({
              PlanName: responseJson[i].PlanName,
              OrderNo: responseJson[i].OrderNo,
              TrackingId: responseJson[i].TrackingId,
              Amount: responseJson[i].Amount,
              PaymentMode: responseJson[i].PaymentMode,
              dateadded: responseJson[i].dateadded,
              Expiry: responseJson[i].Expiry,
              PlanStatus: responseJson[i].PlanStatus,
              statuscolor: responseJson[i].statuscolor,
            });
            console.log(responseJson[i].PlanName);
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
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[colorPrimary, colorSecondary]}
          style={{height: statusBarHeight}}>
          <StatusBar
            barStyle="light-content"
            translucent={true}
            backgroundColor={'transparent'}
          />
        </LinearGradient>
        <View style={styles.headerPrimary}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => this.props.navigation.goBack()}>
              <Icon
                type="Ionicons"
                name="ios-arrow-back"
                style={styles.navBtnIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Payment History</Text>
        </View>
        <View style={css.mainWrap}>
          {this.state.noRecord ? (
            <View style={css.noData}>
              <Icon
                type="FontAwesome"
                name="file-text-o"
                style={css.noDataIcon}
              />
              <Text style={css.noDataTitle}>{this.state.noRecordText}</Text>
            </View>
          ) : (
            <ScrollView
              bounces={false}
              contentContainerStyle={{paddingBottom: 15}}>
              {this.state.plansList.map((item, key) => (
                <View style={css.card} key={key}>
                  <View style={css.cardHeader}>
                    <Text style={css.cardTitle}>{item.PlanName} Plan</Text>
                    <Text style={css.cardSubtitle}>{item.Amount}</Text>
                  </View>
                  <View style={css.cardBody}>
                    <View style={css.cardBodyRow}>
                      <Text style={css.cardLabel}>Order No:</Text>
                      <Text style={css.cardValue}>{item.OrderNo}</Text>
                    </View>
                    <View style={css.cardBodyRow}>
                      <Text style={css.cardLabel}>Transaction No:</Text>
                      <Text style={css.cardValue}>{item.TrackingId}</Text>
                    </View>
                    <View style={css.cardBodyRow}>
                      <Text style={css.cardLabel}>Payment Mode:</Text>
                      <Text style={css.cardValue}>{item.PaymentMode}</Text>
                    </View>
                    <View style={css.cardBodyRow}>
                      <Text style={css.cardLabel}>Purchase Date:</Text>
                      <Text style={css.cardValue}>{item.dateadded}</Text>
                    </View>
                    <View style={css.cardBodyRow}>
                      <Text style={css.cardLabel}>Expiry Date:</Text>
                      <Text style={css.cardValue}>{item.Expiry}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      css.cardFooter,
                      item.statuscolor == 'Red' ? css.bgRed : css.bgGreen,
                    ]}>
                    <Text style={css.cardFooterText}>{item.PlanStatus}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
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
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    backgroundColor: colorBlack10,
  },
  card: {
    backgroundColor: colorWhite,
    padding: 15,
    borderRadius: 5,
    borderBottomColor: colorBlack20,
    borderBottomWidth: 1,
    marginTop: 15,
    marginHorizontal: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    position: 'relative',
    flexDirection: 'row',
    borderBottomColor: colorBlack10,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  cardTitle: {
    fontFamily: fontBold,
    color: colorBlack80,
    fontSize: 18,
    flex: 1,
  },
  cardSubtitle: {
    fontFamily: fontBold,
    color: colorBlack40,
    fontSize: 16,
  },
  cardBody: {
    marginTop: 15,
  },
  cardBodyRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  cardLabel: {
    fontFamily: fontRegular,
    color: colorBlack40,
    fontSize: 14,
    flex: 1,
  },
  cardValue: {
    fontFamily: fontBold,
    color: colorBlack90,
    fontSize: 14,
  },
  cardFooter: {
    backgroundColor: colorBlack30,
    marginHorizontal: -15,
    marginBottom: -15,
    marginTop: 10,
    padding: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooterText: {
    fontFamily: fontBold,
    color: colorWhite,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  bgRed: {
    backgroundColor: colorAccent,
  },
  bgGreen: {
    backgroundColor: '#00aa56',
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
});

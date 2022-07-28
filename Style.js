import {StyleSheet, Dimensions} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

global.footerNavHeight = 76;
global.statusBarHeight = getStatusBarHeight(false);
global.win = Dimensions.get('window');

// FONTS
global.fontThin = 'Lato-Light';
global.fontRegular = 'Lato-Regular';
global.fontBold = 'Lato-Bold';

// COLORS
global.colorTransparent = 'rgba(255,255,255,0.0)';
global.colorPrimary = '#0a315f';
global.colorPrimarybtn = '#e65c00';

global.colorPrimaryDark = '#061d38';

global.colorSecondary = '#650b15';
global.colorSecondarybtn = '#f9d423';

global.colorAccent = '#11EB41';
global.colorAccentDark = '#6b1f1d';
global.colorPlaceholder = '#929292';
global.colorOffWhite = '#faf9fe';
global.colorWhite = '#ffffff';
global.colorWhite10 = 'rgba(255,255,255,0.10)';
global.colorWhite20 = 'rgba(255,255,255,0.20)';
global.colorWhite30 = 'rgba(255,255,255,0.30)';
global.colorWhite40 = 'rgba(255,255,255,0.40)';
global.colorWhite50 = 'rgba(255,255,255,0.50)';
global.colorWhite60 = 'rgba(255,255,255,0.60)';
global.colorWhite70 = 'rgba(255,255,255,0.70)';
global.colorWhite80 = 'rgba(255,255,255,0.80)';
global.colorWhite90 = 'rgba(255,255,255,0.90)';
global.colorBlack = '#000000';
global.colorGreyLite = '#eff0f2';
global.colorBlack05 = 'rgba(0,0,0,0.05)';
global.colorBlack10 = 'rgba(0,0,0,0.10)';
global.colorBlack20 = 'rgba(0,0,0,0.20)';
global.colorBlack30 = 'rgba(0,0,0,0.30)';
global.colorBlack40 = 'rgba(0,0,0,0.40)';
global.colorBlack50 = 'rgba(0,0,0,0.50)';
global.colorBlack60 = 'rgba(0,0,0,0.60)';
global.colorBlack70 = 'rgba(0,0,0,0.70)';
global.colorBlack80 = 'rgba(0,0,0,0.80)';
global.colorBlack90 = 'rgba(0,0,0,0.90)';
global.colorBlooker1 = '#e65c00';
global.colorBlooker2 = '#F9D423';
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colorWhite,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1F1A31',
  },
  wrapKeyboardAvoid: {
    height: '100%',
    position: 'relative',
  },
  bgWhite: {
    backgroundColor: colorWhite,
  },
  mt1: {
    marginTop: 10,
  },
  mt2: {
    marginTop: 15,
  },
  mt3: {
    marginTop: 20,
  },
  mt4: {
    marginTop: 25,
  },
  mt5: {
    marginTop: 30,
  },
  mb1: {
    marginBottom: 10,
  },
  mb2: {
    marginBottom: 15,
  },
  mb3: {
    marginBottom: 20,
  },
  mb4: {
    marginBottom: 25,
  },
  nopadding: {
    padding: 0,
  },
  t_white: {
    color: colorWhite,
  },
  t_green: {
    color: '#92be3c',
  },
  t_primary: {
    color: colorPrimary,
  },
  t_accent: {
    color: colorAccent,
  },
  t_grey: {
    color: colorBlack50,
  },
  t_yellowish1:{
  color:colorBlooker1
  },
  t_yellowish2:{
    color:colorBlooker2
    },
  bg_green: {
    backgroundColor: '#92be3c',
  },
  t_purple: {
    color: '#9d7bc0',
  },
  bg_purple: {
    backgroundColor: '#9d7bc0',
  },
  t_red: {
    color: '#be3c3c',
  },
  bg_red: {
    backgroundColor: '#be3c3c',
  },
  t_yellow: {
    color: '#ebb022',
  },
  bg_yellow: {
    backgroundColor: '#ebb022',
  },
  t_bluenavy: {
    color: '#060582',
  },
  
  bg_bluenavy: {
    backgroundColor: '#060582',
  },
  t_blueocean: {
    color: '#0473b9',
  },
  bg_blueocean: {
    backgroundColor: '#0473b9',
  },
  t_bluenavylite: {
    color: '#4958a0',
  },
  bg_bluenavylite: {
    backgroundColor: '#4958a0',
  },
  t_purplelite: {
    color: '#7a6a9a',
  },
  bg_purplelite: {
    backgroundColor: '#7a6a9a',
  },
  t_redlite: {
    color: '#f85857',
  },
  bg_redlite: {
    backgroundColor: '#f85857',
  },
 
  loader: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 99,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPrimary: {
    backgroundColor: 'transparent',
    marginTop:15,
    height: 52,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  headerLeft: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 5,
    flexDirection: 'row',
     
  },
  headerRight: {
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 5,
    flexDirection: 'row',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colorWhite90,
    fontFamily: fontBold,
    fontSize: 18,
  },
  navBtn: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navBtnIcon: {
    color: colorWhite,
    fontSize: 22,
  },
  navBtnIndicator: {
    width: 10,
    height: 10,
    backgroundColor: '#ff0000',
    position: 'absolute',
    top: 14,
    right: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colorWhite,
  },
  btn: {
    fontFamily: fontBold,
    fontSize: 16,
    backgroundColor: colorWhite,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
   
    // shadowColor: "#11EB41",
    // shadowOffset: {
    //   width: 0,
    //   height: 8,
    // },
    // shadowOpacity: 0.46,
    // shadowRadius: 11.14,
    
    // elevation: 17,
  },
  btnPrimary: {
    backgroundColor: colorPrimary,
  },
  btnAccent: {
    backgroundColor: colorAccent,
  },
  btnAccentOutlined: {
    backgroundColor: colorTransparent,
    borderWidth: 2,
    borderColor: colorAccent,
  },
  btnPrimaryOutlined: {
    backgroundColor: colorTransparent,
    borderWidth: 2,
    borderColor: colorPrimary,
  },
  btnGreyOutlined: {
    backgroundColor: colorTransparent,
    borderWidth: 2,
    borderColor: colorBlack50,
  },
  btnText: {
    fontFamily: fontBold,
    color: colorWhite,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  btnLink: {
    fontFamily: fontBold,
    color: colorAccent,
    fontSize: 16,
  },
  btnWrap: {
    width: '100%',
  },
  inputWrap: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    fontFamily: fontRegular,
    color: colorBlack60,
    fontSize: 14,
    paddingLeft: 10,
    paddingBottom: 5,
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  inputLabelRtl: {
    fontFamily: fontRegular,
    color: colorBlack60,
    fontSize: 14,
    paddingRight: 10,
    paddingBottom: 5,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  inputField: {
    backgroundColor: colorWhite,
    borderColor: colorBlack20,
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: fontRegular,
    color: colorBlack90,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: 46,
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  inputFieldRtl: {
    backgroundColor: colorWhite,
    borderColor: colorBlack20,
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: fontRegular,
    color: colorBlack90,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: 46,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  inputFieldHasIcon: {
    paddingRight: 46,
  },
  inputBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 46,
    height: 46,
    justifyContent: 'center',
  },
  inputIcon: {
    color: colorPrimary,
    fontSize: 22,
    textAlign: 'center',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  viewRtl: {
    direction: 'rtl',
  },
  textRtl: {
    writingDirection: 'rtl',
  },
  textAlignRtl: {
    textAlign: 'left',
  },
  imgRtl: {
    transform: [{rotateY: '-180deg'}],
  },
});

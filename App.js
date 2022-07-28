import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import SplashScreen from './screens/Splash';
import IntroScreen from './screens/Intro';
import LoginScreen from './screens/Login';
import OtpScreen from './screens/Otp';
import HomeScreen from './screens/Home';
import RegisterScreen from './screens/Register';
import ProfileScreen from './screens/Profile';
import SeewhoScreen from './screens/Seewho';
import PremiumScreen from './screens/Premium';
import PremiumHeartsScreen from './screens/PremiumHearts';
import FeelingsScreen from './screens/Feelings';
import ChatScreen from './screens/OldChat';
import RevealScreen from './screens/Reveal';
import ContactsScreen from './screens/ContactList';
import PaymentHistoryScreen from './screens/PaymentHistory';
import NotificationChatScreen from './screens/NotificationChat';
import HelpFeedbackScreen from './screens/HelpFeedback';
import WebpageViewScreen from './screens/WebpageView';
import MediaViewScreen from './screens/MediaView';
import PaymentScreen from './screens/Payment';
import FollowUpScreen from './screens/FollowUp';
import FollowProcessScreen from './screens/FollowProcess';
import ViewProfileScreen from './screens/ViewProfile';
import DeviceInfo from 'react-native-device-info';
import packageJson from './package.json';
import Settings from './config/Settings';
import API from './config/API';
import {openDatabase} from 'react-native-sqlite-storage';
import ChatList from './screens/Chat/ChatList';
import Call from './screens/Call/index';
import IncomingCall from './screens/Call/IncomingCall';
import FingerPrint from './screens/Chat/ChatList/Fingerprint';
import VoiceCall from './screens/Call/VoiceCall';
import Camera  from './screens/Chat/ChatList/ChatItem/Camera';
import SecretLover from './screens/SecretLover';
import SecretFeelings from './screens/SecretFeelings' ;
import PeopleSecretlyLove from './screens/PeopleSecretlyLove';
import PersonalInformation from './screens/PersonalInformation';
import Congrats       from './screens/Congrats'
import Congratulations from './screens/Congratulations'
import LockedFeelings from './screens/LockedFeelings';
import Onboarding from './components/Slider/Onboarding';
import ChooseMood from './screens/ChooseMood'
global.db = openDatabase({name: 'TieHearts.db'});
global.table_chat = 'tbl_chat';
appVersion = DeviceInfo.getVersion();
appBuild = DeviceInfo.getBuildNumber();
appRNVersion = packageJson.dependencies['react-native'];
osVersion = DeviceInfo.getSystemVersion();
appPlatform = Platform.OS;

const PrimaryStack = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
    },
    Intro: {
      screen: IntroScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Otp: {
      screen: OtpScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    Camera: {
      screen: Camera,
    },
    ChooseMood:{
      screen: ChooseMood,
    },
    Seewho: {
      screen: SeewhoScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    Premium: {
      screen: PremiumScreen,
    },
    PremiumHearts: {
      screen: PremiumHeartsScreen,
    },
    Feelings: {
      screen: FeelingsScreen,
    },
    Chat: {
      screen: ChatScreen,
    },
    Reveal: {
      screen: RevealScreen,
    },
    PaymentHistory: {
      screen: PaymentHistoryScreen,
    },
    NotificationChat: {
      screen: NotificationChatScreen,
    },
    HelpFeedback: {
      screen: HelpFeedbackScreen,
    },
    Contacts: {
      screen: ContactsScreen,
    },
    WebpageView: {
      screen: WebpageViewScreen,
    },
    MediaView: {
      screen: MediaViewScreen,
    },
    Payment: {
      screen: PaymentScreen,
    },
    VoiceCall: {
      screen:VoiceCall
    },
    FingerPrint: {
      screen: FingerPrint,
    },
    FollowUp: {
      screen: FollowUpScreen,
    },
    FollowProcess: {
      screen: FollowProcessScreen,
    },
    ViewProfile: {
      screen: ViewProfileScreen,
    },
    ChatList: {
      screen: ChatList,
    },
    Call: {
      screen: Call,
    },
    IncomingCall: {
      screen: IncomingCall,
    },
    SecretLover:{
      screen:SecretLover,
    },
    SecretFeelings:{
      screen:SecretFeelings,
    },
  
    PeopleSecretlyLove:{
      screen:PeopleSecretlyLove,
    },
    PersonalInformation:{
      screen:PersonalInformation,
    },
    Congrats:{
      screen:Congrats
    },
    Congratulations:{
      screen:Congratulations
    },
    LockedFeelings:{
      screen:LockedFeelings
    },
    Onboarding:{
      screen:Onboarding
    }
  },
  {headerMode: 'none'},
  
);

const DrawerNavigator = createDrawerNavigator({
  //Drawer Optons and indexing
  
  Splash: {
    screen: PrimaryStack,
    drawerLockMode: 'locked-closed',
    navigationOptions: {
      drawerLockMode: 'locked-closed',
      disableGestures: true,
     
      
    },
    
  },
});

export default createAppContainer(DrawerNavigator);

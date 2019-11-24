import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import OtpScreen from './src/screen/OtpScreen';
import StartScreen from './src/screen/StartScreen';
import MainScreen from './src/screen/MainScreen';
import HomeScreen from './src/screen/HomeScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import DetailScreen from './src/screen/DetailScreen';
import Login from './src/screen/LoginScreens/Login';
import SignUp from './src/screen/LoginScreens/SignUp';
import BookingSuccess from './src/screen/BookingSuccess';
import Report from './src/bottomTab/Report';
import PopUpWindow from './src/screen/PopUpWindow';
import ProgressWindow from './src/screen/ProgressWindow';
import 'react-native-gesture-handler';
import FirstScreen from './src/screen/FirstScreen';

const Apps = createStackNavigator({
  
  FirstScreen: { screen: FirstScreen },

  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
    },
  },

  DetailScreen: { screen: DetailScreen },
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  StartScreen: { screen: StartScreen },
  ProgressWindow: { screen: ProgressWindow },
 
  
  OtpScreen: { screen: OtpScreen },
 
  
  PopUpWindow:{screen:PopUpWindow},
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Report: { screen: Report },
  BookingSuccess:{screen: BookingSuccess},
  
 
 
 
 
  
  
});
const App = createAppContainer(Apps);
export default App;
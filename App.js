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
const Apps = createStackNavigator({

  StartScreen: { screen: StartScreen },
  OtpScreen: { screen: OtpScreen },
  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
    },
  },
  
  
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Report: { screen: Report },
  BookingSuccess:{screen: BookingSuccess},
  
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
 
 
  DetailScreen: { screen: DetailScreen },
  
  
});
const App = createAppContainer(Apps);
export default App;
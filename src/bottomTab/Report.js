import React from 'react';
import {createAppContainer} from'react-navigation';
import {createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import FutureBooking from './FutureBooking';
import pastBooking from './pastBooking';

const TabScreen = createMaterialTopTabNavigator(
  {
    pastBooking: {
      screen: pastBooking,
      navigationOptions: {
        tabBarLabel: 'Past Booking',
        header: null,
      },
    },
    FutureBooking: {
      screen: FutureBooking,
      navigationOptions: {
        tabBarLabel: 'Future Booking',
        header: null,
      },
    },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    lazy: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: 'navy',
      inactiveTintColor: 'white',
      inactiveBackgroundColor: '#04abae',

      upperCaseLabel: true,
      showIcon: true,
      style: {
        backgroundColor: '#b2beb3',
        justifyContent: 'center',
      },
      labelStyle: {
        fontSize: 14,
        color: 'black',
        paddingHorizontal: 7,
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 3,
      },
    },
  }
);
const Report = createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      header: null,
    },
  },TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(Report);
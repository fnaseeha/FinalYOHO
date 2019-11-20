import React from 'react';
import {createAppContainer} from'react-navigation';
import {createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import City from '../tab/City';
import Date from '../tab/Date';
import Today from '../tab/Today';

const TabScreen = createMaterialTopTabNavigator(
  {
    Today: {
      screen: Today,
      navigationOptions: {
        tabBarLabel: 'Today',
        header: null,
      },
    },
    Date: {
      screen: Date,
      navigationOptions: {
        tabBarLabel: 'Date',
        header: null,
      },
    },
    City: {
      screen: City,
      navigationOptions: {
        tabBarLabel: 'City',
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
const HomeScreen = createStackNavigator({
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

export default createAppContainer(HomeScreen);
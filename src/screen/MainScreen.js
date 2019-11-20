import React from 'react';
import { Text, View, Alert, } from 'react-native';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './HomeScreen';
import Report from '../bottomTab/Report';
import { Icon } from 'react-native-elements';
import Login from '../screen/LoginScreens/Login';
import AsyncStorage from '@react-native-community/async-storage';

class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24 }}>
        <Icon name={name} size={size} color={color} />
      </View>
    );
  }
}

class Logout extends React.Component {

  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Logout!</Text>
      </View>
    );
  }
}


const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Icon;
  let iconName;
  if (routeName === 'Home') {
    iconName = `home`;
  } else if (routeName === 'Logout') {
    iconName = 'lock';
  } else if (routeName === 'Booking') {
    iconName = `book`;
  }

  // You can return any component that you like here!
  return <IconWithBadge name={iconName} color={tintColor} />;
};
const navBar = createBottomTabNavigator(
  {

    Home: { screen: HomeScreen },
    Booking: { screen: Report },
    Logout: {
      screen: Logout, navigationOptions: ({ navigation }) => ({
        tabBarOnPress: (scene, jumpToIndex) => {

          return Alert.alert(   // Shows up the alert without redirecting anywhere
            'Confirm'
            , 'Do you really want to logout?'
            , [
              {
                text: 'okay', onPress: () => {
                  AsyncStorage.setItem('loginDetails', null);
                  navigation.dispatch(NavigationActions.navigate({ routeName: 'login' }))
                }
              },
              { text: 'Cancel' }
            ]
          );
        },
      })
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor),
    }),

    tabBarOptions: {

      activeTintColor: 'white',
      activeBackgroundColor: '#04abae',
      inactiveTintColor: 'black',
      inactiveBackgroundColor: 'silver',
      upperCaseLabel: true,
      showIcon: true,
      style: {
        height: 50,
        justifyContent: 'center',
      },
    },
  }
);

//making a StackNavigator to export as default
const MainScreen = createStackNavigator({
  navBar: {
    screen: navBar,
    navigationOptions: {
      header: null,
    },
  },
  login: {
    screen: Login,
  },



});
export default createAppContainer(MainScreen);
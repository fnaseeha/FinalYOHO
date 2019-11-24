import React from 'react';
import { Text, View, Image, Dimensions, BackHandler } from 'react-native';
import { Card, CardItem, Body, Left, Right, Container, Content } from 'native-base';
import StartScreen from './StartScreen';
import MainScreen from './MainScreen';
import AsyncStorage from '@react-native-community/async-storage';

export default class FirstScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  handleBackButton = () => {
    console.log('back pressed');
   // BackHandler.exitApp();
    // try {

    //   let InitialDetails = await AsyncStorage.getItem('InitialDetails');
    //   let initials = JSON.parse(InitialDetails);

    //   initials != null
    //     ? this.props.navigation.navigate('MainScreen')
    //     : this.props.navigation.navigate('StartScreen')
    // } catch (e) {
    //   // handle error
    //   console.log(e);
    //  // this.props.navigation.navigate('StartScreen');
    // }
   //  BackHandler.exitApp();
    //  this.props.navigation.goBack(null);

  }
  componentDidMount = async () => {
  
    try {

      let InitialDetails = await AsyncStorage.getItem('InitialDetails');
      let initials = JSON.parse(InitialDetails);

      initials != null
        ? this.props.navigation.navigate('MainScreen')
        : this.props.navigation.navigate('StartScreen')
    } catch (e) {
      // handle error
      console.log(e);
     // this.props.navigation.navigate('StartScreen');
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  
  }

  render() {
    try {

      let InitialDetails =  AsyncStorage.getItem('InitialDetails');
      let initials = JSON.parse(InitialDetails);

      initials != null
        ? this.props.navigation.navigate('MainScreen')
        : this.props.navigation.navigate('StartScreen')
    } catch (e) {
      // handle error
      console.log(e);
     // this.props.navigation.navigate('StartScreen');
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../image/splash.png')}
          style={{
            height: Dimensions.get('window').height, width: Dimensions.get('window').width,
            flex: 1
          }} />
      </View>
    );
  }
}

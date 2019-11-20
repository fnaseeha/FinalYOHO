import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import OtpScreen from './OtpScreen';
import MainScreen from './MainScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default class StartScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      phone: '',
      servername:
        'http://core.yohobed.com/v1/general-api/public/api/mobile/send-ota-to-customer',
      isLoading: false,
      customerId: '',
      OtaCode: '',
      newUser: false,
    };
  }

  login = async () => {
  
    try {
     
    let InitialDetails = await AsyncStorage.getItem('InitialDetails');
    let initials = JSON.parse(InitialDetails);

   // const customerId = initials.customerId;
    initials != null
        ? this.props.navigation.navigate('MainScreen')
        : this.setState({ newUser: true })
    } catch (e) {
      // handle error
      console.log(e);
    }

    if (this.state.newUser == true) {

      if (this.state.phone.length == 9) {
       
        let mobile_ = '+94'+this.state.phone;
        console.log('mobile '+mobile_);
        let SendData =
          {
            mobile:mobile_,
            isIosphone: Platform.ios == "ios" ? true : false,
          };

        this.setState({
          isLoading: true,
        });

        axios
          .post(this.state.servername, SendData, {
            header: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
          .then(res => {
            console.log(res.data);
            if (res.data.status == 'success') {
              this.setState({
                isLoading: false,
                OtaCode: res.data.data.OTAcode,
                customerId: res.data.data.customerId,
              });
              console.log('OtaCode '+this.state.OtaCode+' customerId '+this.state.customerId);
            

              this.props.navigation.navigate('OtpScreen', {
                customerId: this.state.customerId,
                OtaCode: this.state.OtaCode,
                mobile:mobile_
              });
            } else {
              Alert.alert('Error while Login');

              this.setState({
                isLoading: false,
              });
            }

          })
          .catch(e=>{
              console.log(e);
              if (e.includes('Network')) {
                  alert('Please Check your Internet connection');
              }
          });
      } else {
        alert('Please type valid phone number')
      }
    }
  }
  render() {
    return (
      <View
        style={styles.backImg}>
        <View style={styles.back}>
          <View style={styles.RegHead1}>
            <Text
              style={{
                margin: 20,
                paddingTop: 50,
                alignSelf: 'center',
                fontWeight: 'bold',
                shadowColor: 'white',
                shadowOpacity: 5,
              }}>
              What's your phone Number ?
            </Text>
            <View style={{ flexDirection: 'row' }}>


              <View style={{ alignItems: 'center', flex: 4, margin: 20, marginTop: 2, flexDirection: 'row' }}>
                <TextInput
                  style={[styles.NameInputStyle, { flex: 1,fontSize:20 }]}
                  placeholder="+94"
                  value='+94'
                  underlineColorAndroid="transparent"
                  placeholderStyle={{ textAlign:'center' }}
                />
                <View>
                  <Text>{'        '}</Text>
                </View>
                <TextInput
                  style={[styles.NameInputStyle, { flex: 6, width: 30 ,fontSize:20}]}
                  placeholder="775556662"
                  value={this.state.phone}
                  keyboardType="phone-pad"
                  onChangeText={phone => this.setState({ phone })}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
          </View>

          <View style={styles.RegHead2}>
            <View style={styles.TextInputStyle2}>
              <TouchableOpacity onPress={() => this.login()}>
                <Text style={styles.ButtonloginText}>
                  Send Confirmation Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  backImg: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#04abae',
  },
  TextInputStyle: {
    backgroundColor: 'silver',
    paddingLeft: 20,
    flex: 1,
    paddingRight: 50,
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    width: '90%',
    height: 42,

    textAlign: 'center',
    alignSelf: 'center',
  },
  RegHead1: {
    flexDirection: 'column',
    margin: 10,
  },
  back: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    margin: 20,
    paddingBottom: 40,
    
  },
  RegHead2: {
    flexDirection: 'column',
  },
  ButtonloginText: {
    color: 'white',
    alignItems: 'center',
    fontSize: 16,
    justifyContent: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#04abae',
  },
  TextInputStyle2: {
    paddingTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },
  NameInputStyle: {
    height: 60,
    backgroundColor: 'rgba(246,241,248,0)',
    color: '#4db8ff',
    borderBottomWidth: 1,
    borderBottomColor: '#4db8ff',
  },
});


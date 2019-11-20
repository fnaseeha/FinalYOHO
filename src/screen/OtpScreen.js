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
import { Button, Card,Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import MainScreen from './MainScreen';

export default class OtpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      phone: '',
      v_code:'',
      phone_v_code:'',

    };
  }
   componentDidMount() {
     /**  AsyncStorage.setItem('customerId', res.data.data.customerId);
            //  AsyncStorage.setItem('mobile', this.state.phone_v_code); */
    console.log('componentDidMount');
   
      this.setState({
        phone_v_code: this.props.navigation.state.params.OtaCode,
        customerId:this.props.navigation.state.params.customerId,
        phone: this.props.navigation.state.params.mobile,
      });
   
  
  }

  login= async() => {
    console.log(this.state.phone_v_code);
    console.log(this.state.v_code);
    console.log(this.state.customerId);
    if(this.state.v_code == this.state.phone_v_code){

      let InitialDetails = {
        phone: this.state.phone,
        customerId: this.state.customerId,
      };
  
      AsyncStorage.setItem('InitialDetails', JSON.stringify(InitialDetails));

      this.props.navigation.navigate('MainScreen');
    }else{
      alert('OTA Code is invalid');
    }
  }

  render() {
    return (
      <View
        style={styles.backImg}>
        <View style={styles.back}>
          <View style={styles.RegHead1}>
            <Text style={styles.TextInputStyle}>
              What's your verification code ?
            </Text>
          
              <View style={{ flexDirection: 'row' }}>
              <TextInput
                  style={styles.NameInputStyle}
                  placeholder="OTA Code"
                  value={this.state.v_code}
                  keyboardType="phone-pad"
                  onChangeText={v_code => this.setState({ v_code })}
                  underlineColorAndroid="transparent"
                />
              </View>
          </View>

          <View style={styles.RegHead2}>
            <View style={styles.TextInputStyle2}>
              <TouchableOpacity onPress={() => this.login()}>
                <Text style={styles.ButtonloginText}>
                  Verify confirmation code
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
  back: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    margin: 20,
    paddingBottom:20,
  },
  TextInputStyle: {
    margin: 20,
    marginBottom:1,
    padding: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
    shadowColor: 'white',
    shadowOpacity: 5,
  },
  RegHead1: {
    flexDirection: 'column',
    margin: 10,
  },
  RegHead2: {
    marginTop: 10,
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
    backgroundColor: 'navy',
  },
  TextInputStyle2: {
    paddingTop: 2,
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  NameInputStyle: {
    flex:1,
    height: 60,
    backgroundColor: 'rgba(246,241,248,0)',
    color: '#4db8ff',
    borderBottomWidth: 1,
    borderBottomColor: '#4db8ff',
    fontSize:16,
    textAlign:'center',
    width: Dimensions.get('window').width-200,
  },
});

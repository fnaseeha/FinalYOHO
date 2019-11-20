import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Keyboard,
  Alert,
  Dimensions
} from 'react-native';
import { Card } from 'native-base';
import SignUp from './SignUp';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import MainScreen from '../MainScreen';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      EmailError: '',
      PasswordError: '',
      shift: new Animated.Value(0),
      hasFocus: false,
      canSubmit: 'no',
      servername: 'https://core.yohobed.com/v1/general-api/public/api/',
      newLogin: false,
      Animated,
      Keyboard,
    };
    this.ChangeEmail = this.ChangeEmail.bind(this);
    this.ChangePassword = this.ChangePassword.bind(this);

  }
  static navigationOptions = {
    header: null,
  };

  saveData = async () => {
    const { email, password } = this.state;

    if (email == '') {
      this.setState({
        EmailError: 'email is required',
        canSubmit: 'no',
      });
      // result = false;
    }
    if (password == '') {
      this.setState({
        PasswordError: 'Password is required',
        canSubmit: 'no',
      });
    }



    if (email != '' && password != '') {

      let SendData =
        {
          email: email,
          password: password,
        };

      this.setState({
        isLoading: true,
      });

      let url = this.state.servername + 'auth/login-for-mobile';
      axios
        .post(url, SendData, {
          header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          console.log(res.data);
          console.log(res.data.validation);
          if (res.data.validation == true) {

              let loginDetails = {
                email: email,
                password: password,
              };

              AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));
              console.log('set loginDetails');
              
              
              //this.props.navigation.navigate('MainScreen');
            Alert.alert('Successfully Log In');
          
s;
            
          } else {
            Alert.alert(res.data.validation_message);

            this.setState({
              isLoading: false,
            });
          }
        })
        .catch(e=>{
          if (e.includes('Network')) {
            alert('Please Check your Internet connection');
        }else{
          Alert.alert('Error');
        }
          
          console.log(e);
      });

    } else {

      Alert.alert(
        'Please Fill All Fields.',
      );
    }
  };
  LoginView() {
    console.log('login view');
    this.props.navigation.navigate('SignUp');
    //login() {

  }
  ChangePassword(text) {
    this.setState({ password: text });
    //,FirstnameError :'ERR'

    if (text == '' || !text) {
      this.setState({
        PasswordError: 'Password is required',
        canSubmit: 'no',
      });
    } else {

      this.setState({
        PasswordError: '',

      });
    }
  }
  showData = async () => {
    let loginDetails = await AsyncStorage.getItem('loginDetails');
    let ld = JSON.parse(loginDetails);
    alert('email: ' + ld.email + ' ' + 'password: ' + ld.password);
  };

  render() {
    const { shift } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Card style={{ padding: 20 }}>
          <View style={styles.YohoImgContainer}>
            <Image
              resizeMode="contain"
              style={styles.YohoImg}
              source={require('../../image/Logo.png')}
              fadeDuration={2}
            />
          </View>

          <Animated.View
            style={[
              styles.NotImgContainer,
              { transform: [{ translateY: shift }] },
            ]}>
            <TextInput
              style={styles.inputBox}
              onChangeText={this.ChangeEmail}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder="Email"
              placeholderTextColor="#04abae"
              selectionColor="#fff"
              keyboardType="email-address"
              onSubmitEditing={() => this.password.focus()}
            />
            <Text style={styles.errorTextStyle}>
              {this.state.EmailError}
            </Text>

            <TextInput
              style={styles.inputBox}
              onChangeText={this.ChangePassword}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="#04abae"
              ref={input => (this.password = input)}
            />

            <Text style={styles.errorTextStyle}>
              {this.state.PasswordError}
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={() => this.saveData()}>
                Sign In
          </Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 ,justifyContent:'center'}}>
            <Text style={{ paddingStart: 2 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={{ color: '#04abae', fontWeight: 'bold' }} >Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );

  }

  ChangeEmail(text) {
    this.setState({ email: text });
    //,FirstnameError :'ERR'

    if (text == '' || !text) {
      this.setState({
        EmailError: 'Email is required',
      });
    } else {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      this.setState({
        EmailError: '',
      });
      // if (re.test(this.state.email)) {
      //   this.setState({
      //     EmailError: '',
      //   });
      // } else {
      //   this.setState({
      //     EmailError: 'Invalid Email',
      //   });
      // }
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }
  UNSAFE_componentWillMount() {

    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHide
    );
  }

  setFocus(hasFocus) {
    this.setState({
      hasFocus,
    });
    handleKeyboardDidShow = event => {
      const { height: windowHeight } = Dimensions.get('window');
      const keyboardHeight = event.endCoordinates.height;
      const currentlyFocusedField = TextInputState.currentlyFocusedField();
      UIManager.measure(
        currentlyFocusedField,
        (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
          if (gap >= 0) {
            return;
          }
          Animated.timing(this.state.shift, {
            toValue: gap,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }
      );
    };

    handleKeyboardDidHide = () => {
      Animated.timing(this.state.shift, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#04abae',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  inputBox: {
    width: 300,
    backgroundColor: '#eeeeee',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#002f6c',
    marginVertical: 10,
    height: 38,
  },
  button: {
    width: 300,
    backgroundColor: '#04abae',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  YohoImgContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0,
  },
  YohoImg: {
    width: Dimensions.get('window').width-200,
    height: 50,
    alignItems: 'center',
  },
  errorTextStyle: {
    color: 'red',
    paddingStart: 20,
  },
});

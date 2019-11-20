import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  Dimensions,
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'native-base';
import Login from './Login';
import axios from 'axios';
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      c_password: '',
      ConfirmPasswordError: '',
      EmailError: '',
      PasswordError: '',
      NameError: '',
      isLoading: false,
      shift: new Animated.Value(0),
      hasFocus: false,
      Animated,
      Keyboard,
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/save-user-details',
    };
    this.ChangeName = this.ChangeName.bind(this);
    this.ChangePassword = this.ChangePassword.bind(this);
    this.ChangeConfirmPassword = this.ChangeConfirmPassword.bind(this);
    this.ChangeEmail = this.ChangeEmail.bind(this);
  }
  static navigationOptions = {
    header: null,
  };

  saveData = async () => {

    const { name, c_password, email, password } = this.state;
    Keyboard.dismiss();

    if (name != '' && password != '' && email != '' && c_password != '') {
    let customerId ='';
    try{
      let InitialDetails = await AsyncStorage.getItem('InitialDetails');
      let initials = JSON.parse(InitialDetails);
      
       customerId = initials.customerId;
       console.log('customerId '+customerId);
     } catch (e) {
        // handle error
        console.log(e);
      }

      let SendData =
      {
        name: name,
        email: email,
        password: password,
        customer_id: customerId
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

            let loginDetails = {
              name: name,
              email: email,
              password: password,
            };


            AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));
            //service call

            alert(
              'You successfully registered. '
            );

               this.props.navigation.navigate('Login');

          } else {
            Alert.alert('Error while Login');

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
    }else{
      alert('Please Fill All fields');
    }
    //save data with asyncstorage

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

  render() {
    const { shift } = this.state;
    return (
      <View style={styles.container}>
       <StatusBar barStyle="light-content" />
        <Card style={{ padding: 15}}>
          <View style={styles.YohoImgContainer}>
            <Image
              resizeMode="contain"
              style={styles.YohoImg}
              source={require('../../image/Logo.png')}
              fadeDuration={2}
            />
          </View>
          <ScrollView style={styles.EmptyContent1}>
          <Animated.View
           style={[
            styles.NotImgContainer,
            { transform: [{ translateY: shift }] },
          ]}
          >
          <View>
          <TextInput
            style={styles.inputBox}
            onChangeText={this.ChangeName}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Name"
            placeholderTextColor="#04abae"
            selectionColor="#fff"
          />
          <Text style={styles.errorTextStyle}>
            {this.state.NameError}
          </Text>
          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Email"
            placeholderTextColor="#04abae"
            selectionColor="#fff"
            keyboardType="email-address"
            onChangeText={this.ChangeEmail}
          />
          <Text style={styles.errorTextStyle}>
            {this.state.EmailError}
          </Text>
          
          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Password"
            onChangeText={this.ChangePassword}
            secureTextEntry={true}
            placeholderTextColor="#04abae"
          />
          <Text style={styles.errorTextStyle}>
            {this.state.PasswordError}
          </Text>
          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Confirm Password"
            onChangeText={this.ChangeConfirmPassword}
            secureTextEntry={true}
            placeholderTextColor="#04abae"
            returnKeyType="done"
          />
          <Text style={styles.errorTextStyle}>
            {this.state.ConfirmPasswordError}
          </Text>
          </View>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={this.saveData}>
              Sign Up
          </Text>
          </TouchableOpacity>

          
          <View style={{flexDirection:'row',alignItems:'center',margin:1,textAlign:'center',justifyContent:'center'}}>
            <Text style={{paddingStart:2}}>Already have an account? </Text>
            <TouchableOpacity onPress={() =>  this.props.navigation.navigate('Login')}>
            <Text style={{color:'#04abae',fontWeight:'bold'}} >Login here</Text>
            </TouchableOpacity>
          </View>
          </Animated.View>
          </ScrollView>
        
        </Card>
      </View>
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

  ChangeConfirmPassword(text) {
    this.setState({ c_password: text });
    //,NameError :'ERR'

    if (text == '' || !text) {
      this.setState({
        ConfirmPasswordError: 'Confirm Password is required',
      });
    } else {
      if (this.state.password != '') {
        if (this.state.password == text) {
          if (this.state.name == '') {
            this.setState({
              NameError: 'Name is required',
            });
          }
          this.setState({
            ConfirmPasswordError: '',
          });
        } else {
          this.setState({
            ConfirmPasswordError: 'Password is not Match',
          });
        }
      } else {
        this.setState({
          PasswordError: 'Password is required',
          c_password: '',
        });
      }
    }
  }

  ChangeName(text) {
    this.setState({ name: text });

    if (text == '' || !text) {
      this.setState({
        NameError: 'Name is required',
      });
    } else {
      if (this.state.password == '') {
        this.setState({
          PasswordError: 'Password is required',
        });
      }
      if (this.state.email == '') {
        this.setState({
          EmailError: 'Email is required',
        });
      }
      if (this.state.c_password == '') {
        this.setState({
          ConfirmPasswordError: 'Confirm Password is required',
        });
      }
      this.setState({
        NameError: '',
      });
    }
  }
  ChangePassword(text) {
    this.setState({ password: text });
    //,NameError :'ERR'

    if (text == '' || !text) {
      this.setState({
        PasswordError: 'Password is required',
      });
    } else {
      if (this.state.c_password == '') {
        this.setState({
          ConfirmPasswordError: 'Confirm Password is required',
        });
      }
      this.setState({
        PasswordError: '',
      });
    }
  }
  ChangeEmail(text) {
    this.setState({ email: text });
    //,NameError :'ERR'

    if (text == '' || !text) {
      this.setState({
        EmailError: 'Email is required',
      });
    }else{
      this.setState({
              EmailError: '',
            });
    }
    //  else {
    //   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //   if (re.test(this.state.email)) {
    //     this.setState({
    //       EmailError: '',
    //     });
    //   } else {
    //     this.setState({
    //       EmailError: 'Invalid Email',
    //     });
    //   }
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#04abae',
  },
  inputBox: {
    width: 300,
    backgroundColor: '#eeeeee',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#002f6c',
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
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0,
  },
  EmptyContent1:{
    flex:4,
  },
  YohoImg: {
    width: Dimensions.get('window').width-250,
    height: 50,
    alignItems: 'center',
  },
  errorTextStyle: {
    color: 'red',
    paddingStart: 20,
  },
});

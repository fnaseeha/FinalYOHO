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
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './Login';
import axios from 'axios';
import MainScreen from '../MainScreen';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import {
  Container, Header, Content, Card, CardItem, Thumbnail,
  Left, Body, Right, Picker, Item,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

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
      BookingSuccessDetail: null,
      defaultAnimationDialog: false,
      scaleAnimationDialog: false,
      slideAnimationDialog: false,
      Bookingdata: {
        name: 'Yoho Villa',
        CheckIn: '2019/10/15',
        CheckOut: '2019/10/15',
        BookingNumber: '115552244',
      },
      isLoading: false,
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
      let customerId = '';
      try {
        let InitialDetails = await AsyncStorage.getItem('InitialDetails');
        let initials = JSON.parse(InitialDetails);

        customerId = initials.customerId;
        console.log('customerId ' + customerId);
      } catch (e) {
        // handle error
        console.log(e);
      }

      try {
        let BookingSuccessDetails_ = await AsyncStorage.getItem('BookingSuccessDetails');
        let BookingSuccessDetails = JSON.parse(BookingSuccessDetails_);
        this.setState({
          BookingSuccessDetail: BookingSuccessDetails
        });

      } catch (e) {
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


            try {
              console.log('*******');
              console.log(this.state.BookingSuccessDetail);
              console.log('*******');
              // const customerId = initials.customerId;

              let SendDataBookingSuccessDetails =
                {
                  room_id: this.state.BookingSuccessDetail.room_id,
                  checkin: this.state.BookingSuccessDetail.checkin,
                  checkout: this.state.BookingSuccessDetail.checkout,
                  guests: 2,
                  country: "Srilanka",
                  rate_code: this.state.BookingSuccessDetail.rate_code,
                  rooms: this.state.BookingSuccessDetail.rooms,
                  mealplan: "Ro",
                  amount: this.state.BookingSuccessDetail.amount,
                  currency: "LKR",
                  deal_amount: 0,
                  customer_id: this.state.BookingSuccessDetail.customer_id
                };


              let url = 'http://core.yohobed.com/v1/general-api/public/api/mobile/add-mobile-reservation';
              axios
                .post(url, SendDataBookingSuccessDetails, {
                  header: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                })
                .then(res => {
                  console.log(res.data);
                  this.setState({
                    isLoading:false
                  });
                  if (res.data.status == 'success') {
                    console.log(res.data.data.booking.booking_no);
                    // console.log(res.data.encodedReference);
                    let BookingDetailsSuccess = {
                      order_id: res.data.data.booking.booking_no,
                      items: res.data.data.booking.hotel_code,
                      amount: this.state.BookingSuccessDetail.amount,
                      name: res.data.data.booking.guest_name,
                      email: res.data.data.booking.email_id,
                      phone: res.data.data.booking.mobile_no,
                    };

                    AsyncStorage.setItem('BookingDetailsSuccess', JSON.stringify(BookingDetailsSuccess));

                    this.setState({
                      Bookingdata: {
                        name:this.state.BookingSuccessDetail.hotel_name,
                        CheckIn: this.state.BookingSuccessDetail.checkin,
                        CheckOut: this.state.BookingSuccessDetail.checkout,
                        BookingNumber: res.data.data.booking.booking_no,
                      },
                      scaleAnimationDialog: true
                    });
                  } else {

                    Alert.alert('Booking Cancelled');

                  }
                })
                .catch(e => {
                  this.setState({
                    isLoading:false
                  });
                  console.log(e);
                  alert('Please Check your Internet connection');
                });
            } catch (e) {
              // handle error
              this.setState({
                isLoading:false
              });
              console.log(e);
            }

            //   this.props.navigation.navigate('Login');

          } else {
            Alert.alert('Error while Login');

            this.setState({
              isLoading: false,
            });
          }
        })
        .catch(e => {
          this.setState({
            isLoading: false,
          });
          Alert.alert('Please Check your Internet connection');
          console.log(e);
        });
    } else {
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
    const { Bookingdata } = this.state;
    //const {windowHeight } =Dimensions.get('window').height;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Card style={styles.cardViewStyle}>
          <View style={styles.YohoImgContainer}>
            <Image
              resizeMode="contain"
              style={styles.YohoImg}
              source={require('../../image/Logo.png')}
              fadeDuration={2}
            />
          </View>
          <ScrollView style={styles.EmptyContent1}>
            <View style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.5,
            }}>
              <Spinner
                visible={this.state.isLoading}
                textContent={'Loading...'}
                textStyle={{ color: 'white' }}
              />
            </View>

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


              <View style={{ flexDirection: 'row', alignItems: 'center', margin: 1, textAlign: 'center', justifyContent: 'center' }}>
                <Text style={{ paddingStart: 2 }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={{ color: '#04abae', fontWeight: 'bold' }} >Login here</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Dialog
              onTouchOutside={() => {
                this.setState({ scaleAnimationDialog: false });
              }}
              width={0.9}
              visible={this.state.scaleAnimationDialog}
              dialogAnimation={new ScaleAnimation()}
              onHardwareBackPress={() => {
                console.log('onHardwareBackPress');
                this.setState({ scaleAnimationDialog: false });
                return true;
              }}
              dialogTitle={
                <DialogTitle
                  title=" Confirm Booking "
                  hasTitleBar={false}
                />
              }
              actions={[
                <DialogButton
                  text="DISMISS"
                  onPress={() => {
                    this.setState({ scaleAnimationDialog: false });
                  }}
                  key="button-1"
                />,
              ]}>
              <DialogContent>
                <View>
                  <Card >
                    <CardItem>
                      <Left>
                        <Body>
                          
                          <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                            Hotel Name</Text>
                          <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                            Check In</Text>
                          <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                            Check Out</Text>
                          <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                            Booking Number</Text>
                        </Body>
                      </Left>
                      <Right>
                        <Body>
                          <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                            {Bookingdata.name}</Text>
                          <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                            {Bookingdata.CheckIn}</Text>
                          <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                            {Bookingdata.CheckOut}</Text>
                          <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                            {Bookingdata.BookingNumber}</Text>
                        </Body>
                      </Right>
                    </CardItem>
                  </Card>
                  <Button
                    style={{ paddingTop: 20 }}
                    title="Confim"
                    onPress={() => {
                      this.setState({ scaleAnimationDialog: false, defaultAnimationDialog: true });



                    }}
                    key="button-1"
                  />
                </View>
              </DialogContent>
            </Dialog>

            <Dialog
              onDismiss={() => {
                this.setState({ defaultAnimationDialog: false });
              }}
              width={0.9}
              visible={this.state.defaultAnimationDialog}
              rounded
              actionsBordered
              dialogTitle={
                <DialogTitle
                  title="Booking Success"
                  style={{
                    backgroundColor: '#F7F7F8',
                  }}
                  hasTitleBar={false}
                  align="left"
                />
              }
              footer={
                <DialogFooter>

                  <DialogButton
                    text="OK"
                    bordered
                    onPress={() => {
                      this.setState({ defaultAnimationDialog: false });
                      this.props.navigation.navigate('MainScreen');
                    }}
                    key="button-2"
                  />
                </DialogFooter>
              }>
              <DialogContent
                style={{
                  backgroundColor: '#F7F7F8',
                }}>

              </DialogContent>
            </Dialog>

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
    } else {
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
  cardViewStyle:{
     padding: 15 ,
     height:Dimensions.get('window').height-200
  },
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
  EmptyContent1: {
    flex: 1,
  },
  YohoImg: {
    width: Dimensions.get('window').width - 250,
    height: 50,
    alignItems: 'center',
  },
  errorTextStyle: {
    color: 'red',
    paddingStart: 20,
  },
});

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
import { Button } from 'react-native-elements';
import SignUp from './SignUp';
import AsyncStorage from '@react-native-community/async-storage';
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
      BookingSuccessDetail: null,
      defaultAnimationDialog: false,
      scaleAnimationDialog: false,
      slideAnimationDialog: false,
      Bookingdata: {
        name: 'Yoho Villa',
        CheckIn: '2019/10/15',
        CheckOut: '2019/10/15',
      },
      isLoading:false,
      BookingStatus:'Booking Success',
    };
    this.ChangeEmail = this.ChangeEmail.bind(this);
    this.ChangePassword = this.ChangePassword.bind(this);

  }
  static navigationOptions = {
    header: null,
  };

  
  removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      return false;
    }
  }

  saveData = async () => {
    const { email, password } = this.state;

    try {
      let BookingSuccessDetails_ = await AsyncStorage.getItem('BookingSuccessDetails');
      let BookingSuccessDetails = JSON.parse(BookingSuccessDetails_);
      console.log(BookingSuccessDetails);
      this.setState({
        BookingSuccessDetail: BookingSuccessDetails
      });

    } catch (e) {
      console.log(e);
    }
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
         
          this.setState({
            isLoading: false,
          });

          if (res.data.validation == true) {

            let loginDetails = {
              email: email,
              password: password,
            };

            AsyncStorage.setItem('loginDetails', JSON.stringify(loginDetails));
           
           if(this.state.BookingSuccessDetail == null){
            console.log('set MainScreen');
            this.props.navigation.pop();
          
            Alert.alert('Successfully Log In');
             
           }else{
            this.setState({
              scaleAnimationDialog: true,
              Bookingdata: {
                name:this.state.BookingSuccessDetail.hotel_name,
                CheckIn: this.state.BookingSuccessDetail.checkin,
                CheckOut: this.state.BookingSuccessDetail.checkout,
              },  
            });
           }

          } else {
            Alert.alert(res.data.validation_message);
          }
        })
        .catch(e => {
          
          this.setState({
            isLoading: false,
          });
            alert('Please Check your Internet connection');
          
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
  ConfirmBooking = () =>{
    console.log('confirm booking');
    try {
      console.log('*******');
      console.log(this.state.BookingSuccessDetail);
      console.log('*******');
      // const customerId = initials.customerId;

      this.setState({
        isLoading:true,
      });

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
            isLoading: false,
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
           
            this.removeItemValue('BookingSuccessDetails');
            
            this.setState({
               scaleAnimationDialog: false, 
               defaultAnimationDialog: true,
               BookingStatus:'Booking Success',
              });
           
          } else {
          
            this.removeItemValue('BookingSuccessDetails');
            this.setState({
              scaleAnimationDialog: false, 
              defaultAnimationDialog: true,
              BookingStatus:'Booking Failed',
             }); 
          }
        })
        .catch(e => {
          console.log(e);
          this.setState({
            isLoading:false
          })
          alert('Please Check your Internet connection');
        });
    } catch (e) {
      this.setState({
        isLoading:false
      })

      // handle error
      console.log(e);
    }
  }


  render() {
    const { shift } = this.state;
    const { navigate } = this.props.navigation;
    const { Bookingdata } = this.state;
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

          <Dialog
            onTouchOutside={() => {
              this.setState({ scaleAnimationDialog: true });
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
                       
                      </Body>
                    </Right>
                  </CardItem>
                </Card>
                <Button
                  style={{ paddingTop: 20 }}
                  title="Confim"
                  onPress={() => this.ConfirmBooking()}
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
                title={this.state.BookingStatus}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, justifyContent: 'center' }}>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    width: Dimensions.get('window').width - 200,
    height: 50,
    alignItems: 'center',
  },
  errorTextStyle: {
    color: 'red',
    paddingStart: 20,
  },
});

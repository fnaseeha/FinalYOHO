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
  Modal,
  BackHandler,
  TextInput,
} from 'react-native';
import {
  Button,
  Icon,
  Input, 
} from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { SliderBox } from 'react-native-image-slider-box';
import DatePicker from 'react-native-datepicker';
import CalendarPicker from 'react-native-calendar-picker';
import MyView from '../helper/MyView';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Login from './LoginScreens/Login';
import BookingSuccess from './BookingSuccess';
import MainScreen from './MainScreen';
import DialogBox from 'react-native-dialogbox';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Container, Header, Content, Card, CardItem, Thumbnail,
  Left, Body, Right, Picker, Item,
} from 'native-base';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  ScaleAnimation,
} from 'react-native-popup-dialog';

const MainColor = 'white';
const fonStyletColor = 'black';
const lableStyleColor = 'black';
const backgroundStyleColor = '#1d1717';//#142565 #2F4F4F
const secondcolor = '#372121';
export default class DetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image_array: [
        'https://source.unsplash.com/1024x768/?hotel',
        'https://source.unsplash.com/1024x768/?bed',
      ],


      isHidden: true,
      btnTitle: 'Select Date',

      roomType: '',
      ItemAllIdNew: [],
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/',

      rooms_array: [],
      data_array: {},
      aminities: [],
      RoomItems: [],
      hotel_price: '',
      property_ids: '',
      hotel_name: '',
      address: '',
      avilable_room: [],
      RoomError: '',
      newLogin: false,
      number_room_error: '',
      room_left: '',
      //dialog
      defaultAnimationDialog: false,
      scaleAnimationDialog: false,
      slideAnimationDialog: false,
      isVisible: false,
      isLoading: true,
      Bookingdata: {
        name: 'Yoho Villa',
        CheckIn: '2019/10/15',
        CheckOut: '2019/10/15'
      },
      customer_id:'',

      //send data
      room_id: '',
      rate_code: '',
      room_no: '1',
      total_price: '',
      CheckIndate: '',
      CheckOutdate: '',


    };

    this.openCalendar = this.openCalendar.bind(this);
    this.onChangeRoomType = this.onChangeRoomType.bind(this);
    this.onChangeRoom = this.onChangeRoom.bind(this);
    this.LoadViewAgain = this.LoadViewAgain.bind(this);

    //
  }


  onChangeRoomType(text) {

    this.state.RoomItems.map(data => {
      if (data.value == text) {
        if (data.count == 0) {
          this.setState({
            RoomError: 'No Room Available',
            roomType: '',
          });
        } else {

          this.setState({
            RoomError: '',
            roomType: text,
            room_id: data.id,
            rate_code: data.rate_id
          });
        }
      }
    });

  }

  onChangeRoom(text) {


    // if((inputtxt.value.match(phoneno))

    console.log(this.state.room_left < text);
    if (isNaN(text)) {
      this.setState({
        room_no: text,
        number_room_error: 'Invalid Room Number',
      });
    } else {
      if (this.state.room_left < text) {
        this.setState({
          room_no: text,
          number_room_error: 'Number of Room is more than availability',
        });
      } else {
        let tt = this.state.hotel_price * text
        this.setState({
          room_no: text,
          total_price: tt,
          number_room_error: '',
        });
      }
    }
  }



  openCalendar() {

    this.setState({
      isHidden: false,
    });
    //this.CalendarPicker && this.CalendarPicker.open();
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {

    console.log("getting data .... CheckInDate ..." + this.props.navigation.state.params.CheckInDate);
    //CheckOutdate:"city",
    if (this.props.navigation.state.params.CheckOutdate == "city") {

    } else {
      Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      }

      console.log("id " + this.props.navigation.state.params.id);


      this.setState({
        property_ids: this.props.navigation.state.params.id,
        CheckIndate: this.props.navigation.state.params.CheckInDate,
        room_left: this.props.navigation.state.params.room_left
      });

      console.log(this.props.navigation.state.params.room_left);
      var date_ = this.props.navigation.state.params.CheckInDate.split('-');
      var day_ = date_[2].length == 1 ? "0" + date_[2] : date_[2];
      var month_ = date_[1].length == 1 ? "0" + date_[1] : date_[1];
      var finaldate = date_[0] + "-" + month_ + '-' + day_;
      console.log('finaldate ' + finaldate);

      var selected_day = new Date(finaldate);
      var selected_day_tommorow_ = selected_day.addDays(1);
      console.log(selected_day_tommorow_);
      var selected_day_tommorow = selected_day_tommorow_.toISOString().substr(0, 10);
      console.log(selected_day_tommorow);
      this.setState({
        property_ids: this.props.navigation.state.params.id,
        CheckIndate: finaldate,
        CheckOutdate: selected_day_tommorow
      });
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      this.getData(this.props.navigation.state.params.id, this.props.navigation.state.params.CheckInDate, selected_day_tommorow);
    }
  }

  handleBackButton = () => {
    console.log('Back press');
    
     this.props.navigation.navigate('MainScreen');
  }
  getData = (text, checkin, checkout) => {
    console.log("id " + text);
    console.log("getData  CheckIndate " + checkin + " : CheckOutdate " + checkout);

    this.setState({
      isLoading: true,
    });
    let SendData = {
      property_id: text,
      checkin: checkin,
      checkout: checkout,
    };
    let url = this.state.servername + 'mg-property-view';
    axios
      .post(url, SendData, {
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
      .then(res => {
        console.log(res.data.data.roomsArray);
        this.setState({
          isLoading: false,
        });
        if (res.data.message == "Transaction success") {

          this.setState({
            rooms_array: res.data.data.roomsArray,
            data_array: res.data.data.data,
            aminities: res.data.data.aminities,
            hotel_name: res.data.data.property.actual_name,
            address: res.data.data.property.address,
          });

          res.data.data.roomsArray.map(room => {

            this.setState({
              hotel_price: room.pricelkr,
              total_price: room.pricelkr,
            });
          });

          if (res.data.data.image != null) {
            res.data.data.image.map(img => {

              this.state.image_array.push(
                'https://www.yohobed.com/images/property/' + img.image_name
              );
            })
          }

          if (this.state.rooms_array != null) {

            this.setState({
              RoomItems: [],
            });

            this.state.rooms_array.map(room => {
              let r_id = "0";
              room.ratecodes.map(r => {
                if (r.meal_plan == "RO") {
                  r_id = r.id;
                }
              });
              this.state.RoomItems.push({
                value: room.name,
                id: room.id,
                count: room.currently_available_room_count,
                rate_id: r_id
              });

            });
          }
          this.onChangeRoomType("Standard Double Room");
        } else {

          Alert.alert(res.data.message);
          console.log(res.data.message);
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
        console.error(error);
        Alert.alert('Please Check your Internet connection');
      });
  }
  onPressBack = () => {
    //this.props.navigation.pop();
    this.props.navigation.goBack();
  };

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
            room_id: this.state.room_id,
            checkin: this.state.CheckIndate,
            checkout: this.state.CheckOutdate,
            guests: 2,
            country: "Srilanka",
            rate_code: this.state.rate_code,
            rooms:  this.state.room_no,
            mealplan: "Ro",
            amount: this.state.total_price,
            currency: "LKR",
            deal_amount: 0,
            customer_id: this.state.customer_id
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
              amount: this.state.total_price,
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
  BookNow = async () => {

    let InitialDetails = await AsyncStorage.getItem('InitialDetails');

    let initials = JSON.parse(InitialDetails);
    let customerId = initials.customerId;
    let phone = initials.phone;
    console.log('cus ' + customerId + ' phone ' + phone);
    console.log('room id ' + this.state.room_id);
    // this.props.navigation.navigate('MainScreen');number_room_error
    if (this.state.RoomError == '' && this.state.number_room_error == '' && this.state.room_id != undefined && this.state.room_id != '') {

      let BookingDetails = {
        room_id: this.state.room_id,
        checkin: this.state.CheckIndate,
        checkout: this.state.CheckOutdate,
        rate_code: this.state.rate_code,
        rooms: this.state.room_no,
        amount: this.state.total_price,
        customer_id: customerId,
      };

      this.setState({
        customer_id:customerId,
      });
      AsyncStorage.setItem('BookingDetails', JSON.stringify(BookingDetails));

      let ld = null;
      try {
        let loginDetails = await AsyncStorage.getItem('loginDetails');
        ld = JSON.parse(loginDetails);

        console.log('ld ' + ld);

      } catch (e) {
        console.log(e);
      }
      if (ld == null) {

        let BookingSuccessDetails = {
          room_id: this.state.room_id,
          checkin: this.state.CheckIndate,
          checkout: this.state.CheckOutdate,
          rate_code: this.state.rate_code,
          rooms: this.state.room_no,
          amount: this.state.total_price,
          customer_id: customerId,
          hotel_name:this.state.hotel_name
        };

        console.log(BookingSuccessDetails);
        AsyncStorage.setItem('BookingSuccessDetails', JSON.stringify(BookingSuccessDetails));

        this.props.navigation.navigate('Login');
      } else {
        this.setState({
          scaleAnimationDialog: true,
          Bookingdata: {
            name:this.state.hotel_name,
            CheckIn: this.state.CheckIndate,
            CheckOut: this.state.CheckOutdate,
          },  
        });
      }

    } else {
      if (this.state.number_room_error != "") {
        alert(this.state.number_room_error);
      }
      if (this.state.RoomError != "") {
        alert(this.state.RoomError);
      }
      if (this.state.room_id == "") {
        alert('Please Select a room type');
      }

    }
  }

  //ClickDay = (text, dates) => {
  LoadViewAgain = (start, end) => {

    var x_start = new Date(start);
    var y_end = new Date(end);
    console.log("Load start " + start + " end :" + end);
    console.log(y_end > x_start);

    // if (y_end >= x_start) {

    this.getData(this.state.property_ids, x_start, y_end);

  }

  render() {

    const minDate = new Date(); // Today

    let aminities_display = this.state.aminities.map((emi, index) => {
      let img_url = 'https://www.yohobed.com/images/property/thumbnail/' + emi.icon
      let c = emi.icon;
      return (
        <TouchableOpacity style={styles.facility}>

          <Text>{emi.icon}</Text>
          <Text
            style={{ fontSize: 10, alignSelf: 'center', color: 'white' }}>
            {emi.name}
          </Text>
        </TouchableOpacity>
      );

    });
    const currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
    const { Bookingdata } = this.state;
    return (
      <View style={styles.backImg}>
        <ScrollView>
          <SliderBox
            images={this.state.image_array}
            style={{ flex: 6 }}
          />


          <Card style={{ flex: 6, padding: 10, marginBottom: 1, backgroundColor: MainColor }}>
            <Text style={{ fontSize: 16, color: fonStyletColor, paddingStart: 5 }}>
              {this.state.hotel_name}
            </Text>

            <Text style={{ fontSize: 14, color: fonStyletColor, paddingStart: 5 }}>
              {this.state.address}
            </Text>
          </Card>

          <View style={{ flex: 5, flexDirection: 'row', padding: 2 }}>
            <TouchableOpacity style={styles.facility}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAATlBMVEUAAACAcHB4eHh6dXV4dHR5dnZ6dXV6dXV5dnZ6dnZ6dnZ5dnZ6dXV6dXV5dnZ5dnZ6dXV5dXV5dXV6dXV5dnZ5dnZ6dXV6dXV5dnZ6dnazUne7AAAAGXRSTlMAECAwQFBgb3B/gI+Qn6CvsL/Az9Df4O/wFHRm4AAAAIZJREFUGNO1j0ESgyAUQ9/nAyJVEYoW7n/RLrSddty2Wb5MJgn8QjqmnG+D+UBu26OzNiwt6YkkVfuyQxsOdo+gc+6PPBpMnQHKhKQ9KGKXNiDVg07IFs+0KTNmBaBGCFvvySI1nL6FWhR884i+N/nl6Gzme77LSS6fmovrBXZxV+j7rvxRT3+yBLlk/kzPAAAAAElFTkSuQmCC' }}
              />
              <Text
                style={{ fontSize: 10, alignSelf: 'center', color: 'black', textAlign: 'center' }}>
                WIFI
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facility}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAMFBMVEUAAACAcHB4eHh6dXV4dHR6dXV5dnZ6dnZ6dnZ6dXV5dnZ5dXV5dXV5dnZ5dnZ6dXUgD9oAAAAAEHRSTlMAECAwQGBwf4CfoL/A0N/gtexwjQAAAFlJREFUCNdjYCAFdO8Gg50CDCxXXMDAo4GB5QBEkgU3s70cBExAzIwOEBBpYGD6DTFsXwADgwrEMGewDidGB1aofZ9YDvA6gFmsC1gOQI3kV2BZwHCICNcCAOLTJDpxLP2RAAAAAElFTkSuQmCC' }}
              />
              <Text
                style={{ fontSize: 10, alignSelf: 'center', color: 'black', textAlign: 'center' }}>
                AC Rooms
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facility}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAANlBMVEUAAACAcHB4eHh6dXV5dXV4dHR6dXV6dXV5dnZ6dnZ6dnZ6dXV6dXV5dnZ6dXV5dXV5dXV6dXUgz1GIAAAAEnRSTlMAECAwP0Bgb3B/gJCfoLC/wOCzPJIKAAAAYklEQVQY06XQ0QqAIAwF0M2a5tZq/f/PlqKSSBB4x14Osg0BJmOnH5Gf+o0YdgJaU1xDXkCcUoowVgQgKkOcVgxkWCd7Kotow7YOJaP1OTIO56RWfkUKdm/tGy12eEWd/eIbKj4EL8iJqVUAAAAASUVORK5CYII=' }}
              />
              <Text
                style={{ fontSize: 10, textAlign: 'center', color: 'black', textAlign: 'center' }}>
                Spotless linen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facility}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAATlBMVEUAAACAcHB4eHh6dXV5dXV4dHR5dnZ3dHR6dXV5dnZ6dnZ6dnZ6dXV6dXV5dnZ5dnZ6dXV5dXV5dXV6dXV5dnZ5dnZ6dXV6dXV5dnZ6dnYIefLeAAAAGXRSTlMAECAwP0BQWGBwf4CQn6CvsL/Az9Df4O/w5Bs4RwAAAHlJREFUGNOVkNEOgyAMRVsZHWzIUNlG//9HJWKU1ifPC8lJae4twA1w4e84WSlDwpzzT8r5bdjzU0ss7MgoCUTeGVQSYCAHF6mIrKAq+fUQfFKVXg2WLQaLbXaGq6RditghtmcZut//dhnsQ5WjQ8q2QaeDeNRWZXtWd1kIfdLJuR8AAAAASUVORK5CYII=' }}
              />
              <Text
                style={{ fontSize: 10, alignItems: 'center', color: 'black', textAlign: 'center' }}>
                Clean WashRoom
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facility}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAMFBMVEUAAACAcHB4eHh6dXV5dXV4dHR5dnZ6dXV5dnZ6dnZ6dXV5dXV5dXV6dXV6dXV6dnYoewtQAAAAD3RSTlMAECAwP0BQb3CAsL/Az+BiOuSgAAAAOUlEQVQI12NgIAR4/kPBBAZ+qBDrAXow+XZDwN4FDEyhoRH//4eGhgqA5Mz//3eCKptz5swxnC4HAOB0IOepIq1dAAAAAElFTkSuQmCC' }}
              />
              <Text
                style={{ fontSize: 10, alignSelf: 'center', color: 'black', textAlign: 'center' }}>
                TV
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 3, backgroundColor: backgroundStyleColor }}>

            <View>
              <Card style={{ flex: 3, padding: 10, marginBottom: 1, backgroundColor: MainColor }}>
                <Text style={{ color: fonStyletColor }}>
                  Stay with Yoho Bed to experience the best of local hospitality at affordable rates
                </Text>
              </Card>
            </View>

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
                  onPress={() => this.ConfirmBooking()}
                  key="button-1"
                />,
              ]}>
              <DialogContent>
                <View>
                  <Card >
                    <CardItem>
                      <Left>
                        <Body>
                          <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ flex: 1 }}>AAA</Text>
                            <Text style={{ flex: 1 }}>BBB</Text>
                          </View>
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


            <View style={styles.calenderContainer}>

              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Card style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 5, backgroundColor: secondcolor }}>
                  <Text style={styles.CheckInStyle}>Check In</Text>
                  <Card>
                    <DatePicker
                      style={{
                        width: (Dimensions.get('window').width / 2) - 13, alignItems: 'center',
                        padding: 10,
                        borderWidth: 0.1,
                      }}
                      date={this.state.CheckIndate} //initial date from state
                      mode="date"
                      placeholder="Check In Date"
                      format="YYYY-MM-DD"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      minDate={currentDate}
                      customStyles={{
                        dateIcon: { width: 0, height: 0 },

                      }}
                      onDateChange={date => {
                        this.setState({ CheckIndate: date });
                        this.LoadViewAgain(date, this.state.CheckOutdate);
                      }}
                    />
                  </Card>
                </Card>

                <Card style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 5, backgroundColor: secondcolor }}>
                  <Text style={styles.CheckInStyle}>Check Out</Text>
                  <Card>
                    <DatePicker
                      style={{
                        width: (Dimensions.get('window').width / 2) - 13, alignItems: 'center',
                        padding: 10,
                        borderWidth: 0.1,
                      }}
                      date={this.state.CheckOutdate} //initial date from state
                      mode="date"
                      placeholder="Check Out Date"
                      format="YYYY-MM-DD"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      minDate={this.state.CheckIndate}
                      customStyles={{
                        dateIcon: { width: 0, height: 0 },

                      }}
                      onDateChange={date => {
                        this.setState({ CheckOutdate: date });
                        this.LoadViewAgain(this.state.CheckIndate, date);
                      }}
                    />
                  </Card>
                </Card>
              </View>
            </View>

            <Card style={{ flex: 3, padding: 1, paddingLeft: 2, marginBottom: 10, backgroundColor: MainColor }}>
              <View>
                <Dropdown
                  label='Room Type'
                  data={this.state.RoomItems}
                  pickerStyle={styles.dropDownStyle}
                  containerStyle={styles.dropDownContainer}
                  onChangeText={this.onChangeRoomType}
                  value="Standard Double Room"
                  itemCount="10"
                  style={{ color: fonStyletColor }}
                  baseColor={lableStyleColor}
                />
                <Text style={{ color: 'red' }}>{this.state.RoomError}</Text>
              </View>

              <View>
                <Input
                  style={[
                    styles.NameInputStyle,
                    { height: 50, textAlign: 'left', paddingStart: 10, marginBottom: 10 },
                  ]}
                  labelStyle={lableStyleColor}
                  label="Number of rooms"
                  underlineColorAndroid="transparent"
                  errorStyle={{ color: 'red' }}
                  errorMessage={this.state.number_room_error}
                  value={this.state.room_no}
                  onChangeText={this.onChangeRoom}
                />
              </View>
            

            </Card>

          </View>

          <View style={{ flex: 4 }}>
            <Card style={{ flex: 3, padding: 10, marginBottom: 10, backgroundColor: MainColor }}>
              <Card style={{ flex: 3, padding: 2, marginBottom: 5, backgroundColor: secondcolor }} >

                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    padding: 20,
                    paddingStart: 5,
                    textAlign: 'center',
                    backgroundColor: 'white',
                    paddingLeft: 10, paddingRight: 10,
                    paddingTop: 4, paddingBottom: 4,
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}>
                  Pricing
            </Text>
              </Card>
              <View style={styles.pricingCont}>
                <View style={styles.detailCardAll}>
                  <Text style={styles.detailCard}>Check In</Text>
                  <Text style={styles.detailCard2}>{this.state.CheckIndate}</Text>
                </View>
              </View>

              <View style={styles.pricingCont}>
                <View style={styles.detailCardAll}>
                  <Text style={styles.detailCard}>Check Out</Text>
                  <Text style={styles.detailCard2}>
                    {this.state.CheckOutdate}
                  </Text>
                </View>
              </View>

              <View style={styles.pricingCont}>
                <View style={styles.detailCardAll}>
                  <Text style={styles.detailCard}>Room Type</Text>
                  <Text style={styles.detailCard2}>{this.state.roomType}</Text>
                </View>
              </View>

              <View style={styles.pricingCont}>
                <View style={styles.detailCardAll}>
                  <Text style={styles.detailCard}>No of Rooms</Text>
                  <View style={[styles.detailCard2, { flexDirection: 'row' }]}>

                    <Text style={{ fontSize: 12, color: fonStyletColor }}> {this.state.room_no} </Text>
                  </View>
                </View>
              </View>

              <View style={styles.pricingCont}>
                <View style={styles.detailCardAll}>
                  <Text style={[styles.detailCard, { fontSize: 16 }]}>Total</Text>
                  <View style={[styles.detailCard2, { flexDirection: 'row' }]}>
                    <Text style={{ fontSize: 16, color: fonStyletColor }}> Rs. {this.state.total_price == 0 ? this.state.hotel_price : this.state.total_price}</Text>
                  </View>
                </View>
              </View>

            </Card>
          </View>

          <View style={{ flex: 3, padding: 7 }}>
            <Button
              titleStyle={styles.dayText}
              title="Book Now"
              buttonStyle={styles.bottondd}
              onPress={this.BookNow}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  backImg: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch', //skyblue
    backgroundColor: backgroundStyleColor,
  },
  calenderContainer: {
    flex: 1,
    backgroundColor: backgroundStyleColor,
  },
  container: {
    flex: 1,
    backgroundColor: 'navy',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownStyle: {
    backgroundColor: 'white',
  },
  dropDownContainer: {
    backgroundColor: 'rgba(246,241,248,0)',
    width: Dimensions.get('window').width - 50,
    color: '#4db8ff',
    paddingStart: 10,
  },
  facility: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
  },
  detailCard: {
    justifyContent: 'flex-start',
    color: lableStyleColor,
    fontSize: 13,
  },
  detailCard2: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    color: fonStyletColor,
    fontSize: 13,
  },
  detailCardAll: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  txtbtn: {
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'navy',
    margin: '10',
    borderRadius: 15,
    fontSize: 18,
  },
  pricingCont: {
    flexDirection: 'row',
    flex: 1,
    padding: 2,
    paddingStart: 8,
    paddingEnd: 4,
  },
  txtDate: {
    textAlign: 'center',
    alignItems: 'center',
  },
  NameInputStyle: {
    width: Dimensions.get('window').width - 50,
    backgroundColor: 'rgba(246,241,248,0)',
    color: fonStyletColor,
    fontSize: 15,
    borderBottomWidth: 0.6,

  },
  CheckInStyle: {
    backgroundColor: 'white',
    paddingLeft: 10, paddingRight: 10,
    paddingTop: 4, paddingBottom: 4,
    borderRadius: 10,
    overflow: 'hidden',
  }
});

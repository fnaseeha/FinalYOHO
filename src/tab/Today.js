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
  ScrollView, BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import axios from 'axios';
import { Button, } from 'react-native-elements';
import {
  Container, Header, Content, Card, CardItem, Thumbnail,
  Icon, Left, Body, Right, Picker, Item
} from 'native-base';
import DetailScreen from '../screen/DetailScreen';
const isIos = Platform.OS === 'ios';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
export default class Today extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined,
      havaData: false,
      DATAS: [{
        bookings_count_lastMonth: 0,
        id: 1733,
        name: "YYYYYa",
        likes: 0,
        cityurl: "Dehiwala",
        city: "Dehiwala",
        latitude: 6.85136604309082,
        longitude: 79.87991333007812,
        thumbnai: "528d3-176122366.jpg",
        propertytype: "Hotel",
        propertycategory: "Standard",
        pricelkr: 999,
        old_pricelkr: 999,
        room_occupancy: true,
        rooms_left: 20,
        CheckIndate: '',
        CheckOutdate: '',
      },
      ],
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/get-featured-mg-properties',
      todayClicked: true,
      tommorrowClicked: false,
      _3rdDayClicked: false,
      _4thDayClicked: false,
      _5thDayClicked: false,
      isLoading: false,
      hasData:false,
    };
    this.getData = this.getData.bind(this);
    this.ClickDay = this.ClickDay.bind(this);
    this.PressCard = this.PressCard.bind(this);

  }

  handleBackButton = () => {
    console.log('back');
    return true;
    // BackHandler.exitApp();
  //  this.props.navigation.goBack(null);
  }

  

  ClickDay = async(text, dates) => {

   
    let today_ = new Date();
    const today_Date = today_.getFullYear() + '-' + (today_.getMonth() + 1) + '-' + (today_.getDate());

    console.log("strt " + text + " :  end " + dates);

    this.setState({
      isLoading:true
    });
    let SendData =
      {
        "checkin": dates,
      };

    axios
      .post(this.state.servername, SendData, {
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {

        this.setState({
          DATAS: res.data,
          isLoading:false,
          hasData:true,
        });
        if(res.data.length ==0){
          this.setState({
           hasData:false
          })
         }
      })
      .catch(e => {
        console.log(e);
        this.setState({
          isLoading:false
        });
          Alert.alert('Please Check your Internet connection');
        
      });
      
    switch (text) {

      case "Today": {
        this.setState({
          todayClicked: true,
          tommorrowClicked: false,
          _3rdDayClicked: false,
          _4thDayClicked: false,
          _5thDayClicked: false,
          CheckIndate: dates,
        });

      } break;
      case "Tommorrow": {

        this.setState({
          todayClicked: false,
          tommorrowClicked: true,
          _3rdDayClicked: false,
          _4thDayClicked: false,
          _5thDayClicked: false,
          CheckIndate: dates,
        })

      } break;
      case "3rd Day": {
        this.setState({
          _3rdDayClicked: true,
          todayClicked: false,
          tommorrowClicked: false,
          _4thDayClicked: false,
          _5thDayClicked: false,
          CheckIndate: dates,
        })
      } break;
      case "4th Day": {
        this.setState({
          _4thDayClicked: true,
          _3rdDayClicked: false,
          todayClicked: false,
          tommorrowClicked: false,
          _5thDayClicked: false,
          CheckIndate: dates,
        })
      } break;
      case "5th Day": {
        this.setState({
          _5thDayClicked: true,
          _4thDayClicked: false,
          _3rdDayClicked: false,
          todayClicked: false,
          tommorrowClicked: false,
          CheckIndate: dates,
        })
      } break;
    }

  }

  componentDidMount = async () => {

    
    // try {

    //   let InitialDetails = await AsyncStorage.getItem('InitialDetails');
    //   let initials = JSON.parse(InitialDetails);

    //  // console.log(initials.customerId);
    //   // const customerId = initials.customerId;
    //   initials.customerId != null
    //     ? this.getData()
    //     : this.props.navigation.navigate('StartScreen')
    // } catch (e) {
    //   // handle error
    //   console.log(e);
    //   this.props.navigation.navigate('StartScreen');
    // }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getData();
  }

  // componentDidMount() {
  //   console.log("getting data ....");
  //   this.getData();

  // }
  getData() {
    //today
    var today = new Date();
    var date_today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());

    console.log(date_today);
    this.setState({
      isLoading:true
    });

    axios
      .post(this.state.servername, {
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
        this.setState({
          DATAS: res.data,
          CheckIndate: date_today,
          hasData:true
        });
      })
      .catch(error => {
        this.setState({
          isLoading:false
        });
        alert('Please Check your Internet connection');
        console.error(error);
       
      });
      if(res.data.length ==0){
        this.setState({
         hasData:false
        })
       }
  }

  static navigationOptions = {
    header: null,
  };


  onPressBack = () => {
    this.props.navigation.pop();
    // this.props.navigation.goBack();
  };

  PressCard = (text, room_left) => {

    console.log("* id " + text + "room_left " + room_left);
    console.log("* CheckIndate " + this.state.CheckIndate);
    console.log("* CheckOutdate " + this.state.CheckOutdate);

    const currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
    if (room_left != "0") {

      if (this.state.CheckIndate == undefined) {
        this.setState({
          CheckIndate: currentDate
        });
      }
      this.props.navigation.navigate('DetailScreen', {
        id: text,
        CheckInDate: this.state.CheckIndate,
        room_left: room_left,
      });
    } else {
      alert('No Room Available');
    }
  };

  render() {


    let display = this.state.DATAS == undefined ? [] : this.state.DATAS.map((NewsData, index) => {

      let ss = NewsData.thumbnail
      let c = 'https://www.yohobed.com/images/property/thumbnail/' + ss
      let id = NewsData.id
      let room_left = NewsData.rooms_left
      let room_left_label = room_left + " Rooms left";
      if (room_left == "0") {
        room_left_label = "No Rooms Availbale";
      }
      return (

        <TouchableOpacity key={id} onPress={() => { this.PressCard(id, room_left) }}>
          <Card>
            <CardItem cardBody>
              <Image source={{ uri: c }} style={{ height: 200, width: null, flex: 1 }} />
            </CardItem>
            <CardItem>
              <Left>
                <Body>
                  <Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{NewsData.name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text note style={styles.boutique}>{NewsData.propertytype}</Text>
                    <Text note>{' '}</Text>
                    <Text note>{NewsData.city}</Text>
                  </View>
                </Body>
              </Left>
              <Right>
                <Body>
                  <Text style={{ fontSize: 18, marginBottom: 8 }}>LKR {NewsData.pricelkr}</Text>
                  <Text style={[styles.smallLinetext, { color: 'red' }]} note> {room_left_label} </Text>
                </Body>
              </Right>
            </CardItem>
          </Card>
        </TouchableOpacity>
      )
    });
    if(this.state.hasData==false){
      console.log('this.state.hasData');
      let DATAS2=  [{
        id: 1733,
      }];
       display = DATAS2.map((NewsData, index) => {

        let ss = NewsData.thumbnail
        let c = 'https://www.yohobed.com/images/property/thumbnail/' + ss;
  
        return (
  
          <TouchableOpacity key={NewsData.id}>
            <Card>
              {/* <CardItem cardBody>
              
                <Image source={require('../image/nodata.jpg')} style={{ height:  Dimensions.get('window').height-200, width: null, flex: 1 }} />
              </CardItem> */}
              
            </Card>
          </TouchableOpacity>
  
        )
      });
    }

    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }
    var today = new Date();
    var date_today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());
    var tommorow = today.addDays(1);
    var date_tommorow = tommorow.getFullYear() + '-' + (tommorow.getMonth() + 1) + '-' + (tommorow.getDate());
    var third = today.addDays(2);
    var date_third = third.getFullYear() + '-' + (third.getMonth() + 1) + '-' + (third.getDate());
    var forth_day = today.addDays(3);
    var date_forth_day = forth_day.getFullYear() + '-' + (forth_day.getMonth() + 1) + '-' + (forth_day.getDate());
    var fifth_day = today.addDays(4);
    var date_ffifth_day = fifth_day.getFullYear() + '-' + (fifth_day.getMonth() + 1) + '-' + (fifth_day.getDate());


    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    let third_formatted_date = third.getDate() + " " + months[third.getMonth()];
    let forth_formatted_date = forth_day.getDate() + " " + months[forth_day.getMonth()];
    let fifth_formatted_date = fifth_day.getDate() + " " + months[fifth_day.getMonth()];



    return (
      <View
        style={styles.backImg}>
        <View style={styles.container}>
          <View style={styles.container1}>
            <Button
              // icon={<Icon name="arrow-down" size={10} />}
              iconRight
              titleStyle={styles.dayText}
              title="Today"
              buttonStyle={[styles.bottondd, { backgroundColor: this.state.todayClicked ? 'green' : '#04abae' }]}
              onPress={() => { this.ClickDay("Today", date_today) }}
            />
          </View>
          <View style={styles.container1}>
            <Button
              // icon={<Icon name="arrow-down" size={10} />}
              iconRight
              titleStyle={styles.dayText}
              title="Tommorrow"
              buttonStyle={[styles.bottondd, { backgroundColor: this.state.tommorrowClicked ? 'green' : '#04abae' }]}
              onPress={() => { this.ClickDay("Tommorrow", date_tommorow) }}
            />
          </View>
          <View style={styles.container1}>
            <Button
              // icon={<Icon name="arrow-down" size={10} />}
              iconRight
              titleStyle={styles.dayText}
              title={third_formatted_date}
              buttonStyle={[styles.bottondd, { backgroundColor: this.state._3rdDayClicked ? 'green' : '#04abae' }]}
              onPress={() => { this.ClickDay("3rd Day", date_third) }}
            />
          </View>
          <View style={styles.container1}>
            <Button
              // icon={<Icon name="arrow-down" size={10} />}
              iconRight
              titleStyle={styles.dayText}
              title={forth_formatted_date}
              buttonStyle={[styles.bottondd, { backgroundColor: this.state._4thDayClicked ? 'green' : '#04abae' }]}
              onPress={() => { this.ClickDay("4th Day", date_forth_day) }}
            />
          </View>
          <View style={styles.container1}>
            <Button
              // icon={<Icon name="arrow-down" size={10} />}
              iconRight
              titleStyle={styles.dayText}
              title={fifth_formatted_date}
              buttonStyle={[styles.bottondd, { backgroundColor: this.state._5thDayClicked ? 'green' : '#04abae' }]}
              onPress={() => { this.ClickDay("5th Day", date_ffifth_day) }}
            />
          </View>
        </View>
        <View style={{ flex: 10 }}>
          <ScrollView>
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

            {display}
          </ScrollView>
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
    alignItems: 'stretch', //
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  container1: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  detailCardAll: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  detailCard: {
    justifyContent: 'flex-start',
  },
  detailCard2: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  dayText: {
    fontSize: 10,
    textAlign: 'center',
  },
  smallLinetext: {
    fontSize: 12,
  },
  smalltext: {
    fontSize: 12,
    shadowColor: 'white',
    shadowOpacity: 2,
  },
  bottondd: {
    borderRadius: 10,
  },
  boutique: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'green',
    borderRadius: 10,
    fontSize: 11,
    padding: 5,
    marginTop: -5,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#000066"
  },
  welcomePress: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#ffffff"
  },
});


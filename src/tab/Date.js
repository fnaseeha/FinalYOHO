import React from 'react'; import {
  Platform,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions, View, TouchableOpacity,
} from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail,
  Text, Button, Icon, Left, Body, Right, Picker, Item
} from 'native-base';
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from '@react-native-community/datetimepicker';
export default class Date extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);

    this.state = {
      selected2: undefined,
      
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/get-featured-mg-properties',
      DATAS: [{
        bookings_count_lastMonth: 0,
        id: 1733,
        name: "Yoho White Villa",
        likes: 0,
        cityurl: "Dehiwala",
        city: "Dehiwala",
        latitude: 6.85136604309082,
        longitude: 79.87991333007812,
        thumbnai: "d3a95-40371905.jpg",
        propertytype: "Hotel",
        propertycategory: "Standard",
        pricelkr: 999,
        old_pricelkr: 1999,
        room_occupancy: true,
        rooms_left: 20,
        date_today: '',
      }],
      CheckIndate: '',
      CheckOutdate: '',
      isLoading: false,
      hasData:false,
    };

    this.PressCard = this.PressCard.bind(this);
  }
  onValueChange2 = (value) => {
    this.setState({
      selected2: value
    });
  }
  onPressBack = () => {
    this.props.navigation.pop();
    // this.props.navigation.goBack();
  };

  PressCard = (text, room_left) => {
    // CheckOutdate +1
    console.log("* id " + text + "room_left " + room_left);
    if (room_left != "0") {
      if (this.state.CheckOutdate == undefined) {
        let today_date = new Date();
        let date_today_date = today_date.getFullYear() + '-' + (today_date.getMonth() + 1) + '-' + (today_date.getDate());
        console.log(date_today_date);
        this.setState({
          CheckOutdate: date_today_date
        })
      }

      this.props.navigation.navigate('DetailScreen', {
        id: text,
        CheckInDate: this.state.CheckOutdate,
        room_left: room_left
      });
    } else {
      alert('No Room Available');
    }
  };



  componentDidMount() {

    console.log("getting data ....");


    this.getData();
  }

  changeView = (data) => {
    console.log(data);
    this.setState({
      isLoading:true
    });
    let SendData =
      {
        "checkin": data,
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
      
     
  
    }

  getData() {

    var currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
    this.setState({
      CheckOutdate: currentDate,
      isLoading:true,
    })

    let SendData =
      {
        "checkin": this.state.CheckOutdate,
      };

    axios
      .post(this.state.servername, SendData, {
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        //console.log(res.data);

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
      .catch(error => {
        this.setState({
          isLoading:false
        });
        Alert.alert('Please Check your Internet connection');
        console.error(error);
       
      });
  }

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
      console.log(id);
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
              <CardItem cardBody>
              
                <Image source={require('../image/nodata.jpg')} style={{ height:  Dimensions.get('window').height-200, width: null, flex: 1 }} />
              </CardItem>
              
            </Card>
          </TouchableOpacity>
  
        )
      });
    }

    const currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
    //    const minDate = date_today;;

    return (

      <ImageBackground
        source={require('../image/background_1.jpg')}
        style={styles.backImg}>
        <Container>
          <DatePicker
            style={{
              width: Dimensions.get('window').width, alignItems: 'center', padding: 10,
              borderWidth: 2,
              borderColor: 'white',
            }}
            date={this.state.CheckOutdate} //initial date from state
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate={currentDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: { width: 0, height: 0 },
              dateInput: {
                width: Dimensions.get('window').width,
              },
            }}
            onDateChange={date => {
              this.setState({ CheckOutdate: date });
              this.changeView(date);
            }}

          />
          <Content>
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
          </Content>
        </Container>
      </ImageBackground>
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
    color: 'white',
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
    backgroundColor: 'blue',
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
});

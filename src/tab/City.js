import React from 'react'; import {
  Platform,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions, View,TouchableOpacity
} from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail,
  Text, Button, Icon, Left, Body, Right, Picker, Item
} from 'native-base';
import axios from 'axios';
import { Dropdown } from 'react-native-material-dropdown';
export default class City extends React.Component {
  static navigationOptions = {
    header: null,
  };

  //
//  var options =["Mount Lavinia","Colombo 03","Dehiwela","Colombo 13","Other"];


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
        old_pricelkr: 999,
        room_occupancy: true,
        rooms_left: 20
      }],
      Cities:
          [{value:"Mount Lavinia"},{value:"Colombo 03"},{value:"Dehiwela"},{value:"Colombo 13"},{value:"Other"}]
      
    };
    this.PressCard = this.PressCard.bind(this);
  }
  /**this.state.RoomItems.push({
                value: room.name,
                id: room.id,
                count: room.currently_available_room_count,
                rate_id: r_id
              }); */
  onValueChange2 = (value) => {

    this.setState({
      selected2: value
    });
    console.log(value);
    this.getData();
  }
  onPressBack = () => {
    this.props.navigation.pop();
    // this.props.navigation.goBack();
  };

  PressCard = (text) => {
   //selected2
    var today = new Date();
    let today_Date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());
   
    this.props.navigation.navigate('DetailScreen', {
      id: text,
      CheckIndate:this.state.selected2,
      CheckOutdate:"city",
    });

   

  }
  onPressProfile = () => {
    //   // Send Data
    //  this.props.navigation.push('LoginScreen',
    //   { height: "6'2", name: "Charlie Cheever" });
  }; //

  componentDidMount() {
    console.log("getting data ....");
    this.getData();
  }
  getData() {
    console.log('selected '+this.state.selected2)
    let city = this.state.selected2;
    console.log('city '+city);
    let SendData = {
      city: city,
    };
    axios
      .post(this.state.servername, SendData,{
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          DATAS: res.data,
        });
      })
      .catch(error => {
        console.log(error);
        //[Error:
        
      });
  }
  render() {

    let display = this.state.DATAS==undefined?[]:this.state.DATAS.map((NewsData, index) => {

      let ss = NewsData.thumbnail
      let c = 'https://www.yohobed.com/images/property/thumbnail/' + ss
      return (

        <TouchableOpacity key={NewsData.id}>
          <Card>
            <CardItem cardBody>
              <Image source={{ uri: c }} style={{ height: 200, width: null, flex: 1 }} />
            </CardItem>
            <CardItem>
              <Left>

                <Body>
                  <Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                  {NewsData.name}</Text>
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
                  <Text style={[styles.smallLinetext, { color: 'red' }]} note> {NewsData.rooms_left} Rooms left</Text>
                </Body>
              </Right>
            </CardItem>
          </Card>
        </TouchableOpacity>

      )
    });

    return (
      <ImageBackground
        source={require('../image/background_1.jpg')}
        style={styles.backImg}>
        <Container>
        <Dropdown
                  label=''
                  data={this.state.Cities}
                  pickerStyle={styles.dropDownStyle}
                  containerStyle={styles.dropDownContainer}
                  onChangeText={this.onValueChange2.bind(this)}
                  itemCount="10"
                  style={{ color: 'navy' }}
                  baseColor="navy"
                  placeholder='Select City'
                />
         
          <Content>
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
    backgroundColor: '#04abae',
  },
  boutique: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'green',
    borderRadius: 7,
    fontSize: 11,
    padding: 5,
  },
  dropDownStyle: {
    backgroundColor: 'white',
  },
  dropDownContainer: {
    backgroundColor: 'rgba(246,241,248,0)',
    width: Dimensions.get('window').width-50,
    margin:20,
    color: '#4db8ff',
  },
});

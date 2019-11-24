import React from 'react'; import {
  Platform,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions, View, TouchableOpacity, BackHandler
} from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail,
  Text, Button, Left, Body, Right, Picker, Item
} from 'native-base';
import axios from 'axios';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import StartScreen from '../screen/StartScreen';
import Spinner from 'react-native-loading-spinner-overlay';

export default class City extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined,
      isLoading: false,
      hasData:false,
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
        rooms_left: 20,
      }],
      Cities:
        [{ value: "Mount Lavinia" }, { value: "Colombo 03" }, { value: "Dehiwela" }, { value: "Colombo 13" }, { value: "Other" }]

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
    //this.props.navigation.pop();
    // this.props.navigation.goBack();
  };

  PressCard = (text) => {
    //selected2
    var today = new Date();
    let today_Date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());

    this.props.navigation.navigate('DetailScreen', {
      id: text,
      CheckIndate: this.state.selected2,
      CheckOutdate: "city",
    });



  }
  onPressProfile = () => {
    //   // Send Data
    //  this.props.navigation.push('LoginScreen',
    //   { height: "6'2", name: "Charlie Cheever" });
  }; //

  // handleBackButton = () => {
  //   //BackHandler.exitApp();
  //  // this.props.navigation.goBack(null);

  // }

  componentDidMount(){

    this.getData()
   

  }

  // componentDidMount() {
  //   console.log("getting data ....");

  //  // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  // }
  getData() {
    console.log('selected ' + this.state.selected2)
    let city = this.state.selected2;

    console.log('city ' + city);
    
    this.setState({
      isLoading:true
    });
    
    let SendData = {
      city: city,
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
      .catch(error => {
        this.setState({
          isLoading:false
        });
        alert('Please Check your Internet Connection');
        console.log(error);
        //[Error:

      });
  }
  render() {

    let display = this.state.DATAS.map((NewsData, index) => {

      let ss = NewsData.thumbnail
      let c = 'https://www.yohobed.com/images/property/thumbnail/' + ss;

      return (

        <TouchableOpacity key={NewsData.id}>
          <Card>
            <CardItem cardBody>
              <Image source={{ uri: c }} style={{ height: 200, width: null, flex: 1 }} />
            </CardItem>
            <CardItem>
              <Left>

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

                <Body>
                  <Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                    {NewsData.name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text note style={styles.boutique}>{NewsData.propertytype}</Text>
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
    

    return (
      <ImageBackground
        source={require('../image/background_1.jpg')}
        style={styles.backImg}>

        <Container>

          <Dropdown
            label='Select City'
            data={this.state.Cities}
            pickerStyle={styles.dropDownStyle}
            containerStyle={styles.dropDownContainer}
            onChangeText={this.onValueChange2.bind(this)}
            itemCount="10"
            style={{ color: 'black' }}
            baseColor="transparent"
            placeholder=' Select City'
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
 
});

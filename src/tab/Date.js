import React from 'react';import {
  Platform,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,View,TouchableOpacity,
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, 
  Text, Button, Icon, Left, Body ,Right,Picker,Item} from 'native-base';
  import axios from 'axios';
  import DatePicker from 'react-native-datepicker';
  import moment from 'moment'; 
export default class Date extends React.Component {
  static navigationOptions = {
    header: null,
  };


constructor(props) {
    super(props);
   
    this.state = {
      selected2: undefined,
      CheckIndate: '',
      CheckOutdate:'',
      
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/get-featured-mg-properties',
      DATAS:[{
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
        date_today:'',
        
    }],
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

  PressCard = (text) => {
    // CheckOutdate +1

    if(this.state.CheckOutdate == undefined){
      let today_date = new Date();
      let date_today_date = today_date.getFullYear() + '-' + (today_date.getMonth() + 1) + '-' + (today_date.getDate());
    console.log(date_today_date);
      this.setState({
        CheckOutdate:date_today_date
      })
    }
  
    this.props.navigation.navigate('DetailScreen', {
      id: text,
      CheckInDate:this.state.CheckOutdate,
    });

  };
 

  
  componentDidMount() {

    console.log("getting data ....");

  
    this.getData();
  }
 
  changeView =(data) =>{
    console.log(data);
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
        });
      })
      .catch(e=>{
        console.log(e);
        if (e.includes('Network')) {
          alert('Please Check your Internet connection');
      }else{
        Alert.alert('Error');
      }
    });
  }
  
  getData() {

    var currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
    this.setState({
      CheckOutdate:currentDate
    })

    let SendData =
    {
      "checkin": this.state.CheckOutdate,
    };

    axios
      .post(this.state.servername,SendData, {
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
        console.error(error);
        if (error.includes('Network')) {
          alert('Please Check your Internet connection');
      }else{
        Alert.alert('Error');
      }
      });
  }

  render() {

    let display = this.state.DATAS==undefined?[]:this.state.DATAS.map((NewsData, index) =>{

      let ss = NewsData.thumbnail
      let c = 'https://www.yohobed.com/images/property/thumbnail/' + ss
      let id = NewsData.id
      console.log(id);
      return (

        <TouchableOpacity key={id} onPress={() => { this.PressCard(id) }}>
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
                  <Text style={[styles.smallLinetext, { color: 'red' }]} note> {NewsData.rooms_left} Rooms left</Text>
                </Body>
              </Right>
            </CardItem>
          </Card>
        </TouchableOpacity>

      )
    });
    const currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
//    const minDate = date_today;;
   
    return (

      <ImageBackground
        source={require('../image/background_1.jpg')}
        style={styles.backImg}>
        <Container>
        <DatePicker
                style={{ width: Dimensions.get('window').width ,alignItems:'center',padding:10,
                borderWidth: 2,
                borderColor: 'white',}}
                date={this.state.CheckOutdate} //initial date from state
                mode="date" 
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate={currentDate}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: { width: 0, height: 0},
                  dateInput: {
                    width:Dimensions.get('window').width,
                  },
                }}
                onDateChange={date => {
                  this.setState({ CheckOutdate: date });
                  this.changeView(date);
                }}
                 
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
     marginTop:10,
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
    borderRadius: 7,
    fontSize: 11,
    padding: 5,
  },
});

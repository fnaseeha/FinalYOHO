import React from 'react';
import { Text, View, StatusBar, StyleSheet, Dimensions,Image,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Card, CardItem, Body, Left, Right, Container, Content } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class FutureBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/get-future-bookings',
      data: [],
      hasData:false,
      isLoading:false,

    };
  }
  componentDidMount = async() => {
    
    let InitialDetails = await AsyncStorage.getItem('InitialDetails');

    let initials = JSON.parse(InitialDetails);
    let customerId = initials.customerId;
    let SendData = {
      customer_id: customerId,
    }
    this.setState({
      isLoading:true
    });

    axios
      .post(this.state.servername, SendData, {
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
      .then(res => {
        this.setState({
          isLoading:false
        });
        console.log(res.data.data);
        if (res.data.message == "Transaction success") {
         
          this.setState({
            data: res.data.data,
            hasData:true
          });
          if(res.data.data.length ==0){
            this.setState({
             hasData:false
            });
           }
        }else{
          this.setState({
            hasData:false
           });
        }

      })
      .catch((e) => {
        console.log(e);
        this.setState({
          isLoading:false
        });
        Alert.alert('Please Check your Intenet Connection');
      });

  }

  render() {
    let itemdata = this.state.data.map((dt, index) => {
      return (
        <Card key={dt.id} >
          <CardItem><Text style={{ color: 'blue', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {dt.propertyName}
          </Text>
          </CardItem>

          <CardItem>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                name='calendar'
                type='evilicon'
                color='#517fa4'
              />
              <Text>Check In Date : </Text>
              <Text>{dt.checkinDate}</Text>
            </View>
          </CardItem>
          <CardItem>
            <View style={{ flexDirection: 'row' }}>
            <Icon
                name='calendar'
                type='evilicon'
                color='#517fa4'
              />
              <Text>Check Out Date : </Text>
              <Text>{dt.checkoutDate}</Text>
            </View>
          </CardItem>
          <CardItem>
            <View style={{ flexDirection: 'row' }}>
            <Icon
                name='tag'
                type='evilicon'
                color='#517fa4'
              />
              <Text>Rooms Count : </Text>
              <Text>{dt.roomsCount}</Text>
            </View>
          </CardItem>


        </Card>
      );
    });
    if(this.state.hasData==false){
      let DATAS2=  [{
        id: 1733,
      }];
      itemdata = DATAS2.map((NewsData, index) => {
  
        return (
  
          <TouchableOpacity key={NewsData.id}>
            <Card>
              <CardItem cardBody>
              
                <Image source={require('../image/nodata.jpg')} style={{ height:  Dimensions.get('window').height-100, width: null, flex: 1 }} />
              </CardItem>
              
            </Card>
          </TouchableOpacity>
        )
      });
    }
    return (
      <View
        style={styles.backImg}>
        <Container>
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
            {itemdata}
          </Content>
        </Container>
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
    backgroundColor:'cyan',
    justifyContent: 'center',
    alignItems: 'stretch', //
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
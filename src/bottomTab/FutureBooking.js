import React from 'react';
import { Text, View, StatusBar, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { Card, CardItem, Body, Left, Right, Container, Content } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class FutureBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/get-past-bookings',
      data: []
    };
  }
  componentDidMount = async() => {
    
    let InitialDetails = await AsyncStorage.getItem('InitialDetails');

    let initials = JSON.parse(InitialDetails);
    let customerId = initials.customerId;
    let SendData = {
      customer_id: customerId,
    }

    axios
      .post(this.state.servername, SendData, {
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
      .then(res => {
        console.log(res.data.data);
        if (res.data.message == "Transaction success") {
          this.setState({
            data: res.data.data,
          });
        }
      })
      .catch((e) => {
        console.log(e);
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
    return (
      <View
        style={styles.backImg}>
        <Container>
          <Content>
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
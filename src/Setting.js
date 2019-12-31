import React from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { Card } from 'react-native-paper';
export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardDetails: [],
    };
  }

  DeleteCard = async(index) => {

    let array = this.state.cardDetails;
    array.splice(index, 1);
    this.setState({cardDetails: array});
      try {
      await AsyncStorage.setItem('cardData', JSON.stringify(array));
    } catch (error) {
      console.log('Asyc store Error ' + error);
      // Error saving data
    }

  };
  _storeData = async () => {
    let cardDetails = [
      {
        CardNumber: '222xxx778',
        GuestName: 'Nasee',
        Expiry: '2025/12/04',
      },
      {
        CardNumber: '2211xxx246',
        GuestName: 'Hasee',
        Expiry: '2024/12/04',
      },
    ];

    try {
      await AsyncStorage.setItem('cardData', JSON.stringify(cardDetails));
    } catch (error) {
      console.log('Asyc store Error ' + error);
      // Error saving data
    }
  };

  componentDidMount = async () => {
    this._storeData();
    this._retrieveData();
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('cardData');
      if (value !== null) {
         let cardValue = JSON.parse(value);
       this.setState({ cardDetails: this.state.cardDetails.concat(cardValue) })
      }
    } catch (error) {
      console.log('Asyc retrieving Error ' + error);
      // Error retrieving data
    }
  };

  render() {
    console.log(this.state.cardDetails);
    let cardDisplay = this.state.cardDetails.map((cardData, index) => {
      return (
        <Card style={{ marginTop: 29 }}>
          <Text>Card Number : {cardData.CardNumber}</Text>
          <Text>Guest Name : {cardData.GuestName}</Text>
          <Text>Expiry Date : {cardData.Expiry}</Text>

          <TouchableOpacity
            style={{ marginTop: 10, alignItems: 'center' }}
            onPress={() => {
              this.DeleteCard(index);
            }}>
            <Text> Delete</Text>
          </TouchableOpacity>
        </Card>
      );
    });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {cardDisplay}
      </View>
    );
  }
}



import React from 'react';
import { Text, View,BackHandler,Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import HTML from 'react-native-render-html';
import md5 from 'js-md5';
import MainScreen from './MainScreen';
export default class BookingSuccess extends React.Component {

  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      phone: '',
      v_code: '',
      webString: '',
      servername: 'http://core.yohobed.com/v1/general-api/public/api/mobile/',
      order_id: '',
      items: '',
      amount: '',
      name: '',
      email: '',
      phone: '',

    };
    this.handleNavigate = this.handleNavigate.bind(this);

  }
  handleNavigate = (data)=>{
    console.log(data);
    // if(data.loading =="false"){
    //   console.log('write now');
    // }
  }

handleBackButton = () => {
  this.props.navigation.navigate('MainScreen');
}
  componentDidMount = async () => {

    //   AsyncStorage.setItem('BookingDetailsSuccess', JSON.stringify(BookingDetailsSuccess));
    let BookingSuccess = await AsyncStorage.getItem('BookingDetailsSuccess');
    let book = JSON.parse(BookingSuccess);

    console.log(book);
    this.setState({
      order_id: book.order_id,
      items: book.items,
      amount: book.amount,
      name: book.name,
      email: book.email,
      phone: book.phone,
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

  }

 

  render() {
    let url = this.state.servername + 'update-mobile-reservation-payment-success';
    
    let { name, email, phone, order_id, amount, items } = this.state;
    
    console.log('url ' + url);
    console.log('name ' + name);
    console.log('email ' + email);
    console.log('phone ' + phone);
    console.log('order_id ' + order_id);
    console.log('items ' + items);
    console.log('amount ' + amount);

    const HtmlCode = `
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title></title>
      </head>
      <body onload="submitData()">
      <script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>
      
      <script>
         
          payhere.onCompleted = function onCompleted(orderId) {
              console.log("Payment completed. OrderID:" + orderId);
              alert('Booking success');
             // window.location = 'yohobed_Copy/src/screen/MainScreen.js';
             this.props.navigation.navigate('MainScreen');
          };
      
          payhere.onDismissed = function onDismissed() {
              console.log("Payment dismissed");
            //   window.location.replace("http://stackoverflow.com");
          };
          
          payhere.onError = function onError(error) {
              console.log("Error:"  + error);
             // window.location.replace("http://stackoverflow.com");
          };
          var payment = {
            "sandbox": true,
            "merchant_id": "1213236",
            "return_url": "",
            "cancel_url": "",
            "notify_url": "`+url+`",
            "order_id": "`+order_id+`",
            "items": "`+items+`",
            "amount": "`+amount+`",
            "currency": "LKR",
            "first_name": "`+name+`",
            "last_name": "`+name+`",
            "email": "`+email+`",
            "phone": "`+phone+`",
            "address": "No.1, Galle Road",
            "city": "Colombo",
            "country": "Sri Lanka",
            "delivery_address": "No. 46, Galle road, Kalutara South",
            "delivery_city": "Kalutara",
            "delivery_country": "Sri Lanka",
            "custom_1": "",
            "custom_2": ""
        };
      
        document.getElementById('payhere-payment').onclick = function (e) {
          payhere.startPayment(payment);
        };

      function submitData() {
        payhere.startPayment(payment);
      }
      </script>
      </body>
    </html>`;


    return (
     
      <View style={{ flex: 1 }}>
         <WebView
          ref={ref => (this.webview = ref)}
          javaScriptEnabled={true}
          onError={console.error.bind(console, 'error')}
          bounces={false}
          onShouldStartLoadWithRequest={() => true}
          domStorageEnabled={true}
          scalesPageToFit={false}
          source={{ html: HtmlCode , baseUrl: "https://www.yohobed.com"}}
          style={{flex:1}}
          onNavigationStateChange = {this.handleNavigate}
          scrollEnabled={false} />

      </View>
    
      
  );
   
  }

}
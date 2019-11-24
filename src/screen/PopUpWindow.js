import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    ScaleAnimation,
} from 'react-native-popup-dialog';

import {
    Container, Header, Content, Card, CardItem, Thumbnail,
    Icon, Left, Body, Right, Picker, Item
} from 'native-base';
import MainScreen from './MainScreen';
export default class PopUpWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultAnimationDialog: false,
            scaleAnimationDialog: false,
            slideAnimationDialog: false,
            Bookingdata: {
                name: 'Yoho Villa',
                CheckIn: '2019/10/15',
                CheckOut: '2019/10/15',
                BookingNumber: '115552244',
            }
        };
    }


    render() {
        const { Bookingdata } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>

                    <Button
                        title="Scale Animation Dialog"
                        onPress={() => {
                            this.setState({
                                scaleAnimationDialog: true,
                            });
                        }}
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
                            onPress={() => {
                                this.setState({ scaleAnimationDialog: false });
                            }}
                            key="button-1"
                        />,
                    ]}>
                    <DialogContent>
                        <View>
                            <Card >
                                <CardItem>
                                    <Left>
                                        <Body>
                                            
                                            <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                                                Hotel Name</Text>
                                            <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                                                Check In</Text>
                                            <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                                                Check Out</Text>
                                            <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                                                Booking Number</Text>
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
                                            <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                                                {Bookingdata.BookingNumber}</Text>
                                        </Body>
                                    </Right>
                                </CardItem>
                            </Card>
                            <Button
                                style={{ paddingTop: 20 }}
                                title="Confim"
                                onPress={() => {
                                    this.setState({ scaleAnimationDialog: false ,defaultAnimationDialog:true});

                                    this.props.navigation.navigate('MainScreen');
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
                            title="Booking  Success"
                            style={{
                                backgroundColor: '#F7F7F8',
                            }}
                            hasTitleBar={false}
                            align="center"
                        />
                    }
                    footer={
                        <DialogFooter>
                          
                            <DialogButton
                                text="OK"
                                bordered
                                onPress={() => {
                                    this.setState({ defaultAnimationDialog: false });
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

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
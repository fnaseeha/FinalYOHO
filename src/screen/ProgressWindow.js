import React, { Component } from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Modal,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
export default class ProgressWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>


                <View>
                    <Spinner
                        //visibility of Overlay Loading Spinner
                        visible={true}
                        //Text with the Spinner 
                        textContent={'Loading...'}
                        //Text style of the Spinner Text
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})

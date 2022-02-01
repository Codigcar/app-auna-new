import React, { Component } from 'react'
import { View, StatusBar, ActivityIndicator, AsyncStorage, StyleSheet, Text } from 'react-native'

export default class AuthLoadingScreen extends Component {

    constructor() {
        super();
        this._init();
    }

    _init = async () => {
        // const userToken = await AsyncStorage.getItem('userToken');
        // this.props.navigation.navigate(userToken ? 'TabScreen' : 'Login');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
                <ActivityIndicator size="large" />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
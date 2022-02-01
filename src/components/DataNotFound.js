import React, { Component, memo } from 'react'
import { View, StatusBar, ActivityIndicator, AsyncStorage, StyleSheet, Text } from 'react-native'
import { css } from '../utils/css';

const DataNotFound = ({message}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.colorGrayOpaque} >{message}</Text>
            <ActivityIndicator size="large" />
            <StatusBar barStyle="default" />
        </View>
    )
}
export default memo(DataNotFound);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorGrayOpaque:{
        color:css.colors.gray_opaque
    }
});




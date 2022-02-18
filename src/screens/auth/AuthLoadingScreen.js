import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';

const AuthLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Cargando...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default React.memo(AuthLoadingScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

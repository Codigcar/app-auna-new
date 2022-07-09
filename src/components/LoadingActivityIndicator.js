import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const LoadingActivityIndicator = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={'red'} />
    </View>
  );
};

export default React.memo(LoadingActivityIndicator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

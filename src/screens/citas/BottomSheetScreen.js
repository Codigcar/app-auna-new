import React, { useCallback, useRef, useMemo, useState} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated'
import BottomSheet, { BottomSheetView, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const BottomSheetScreen = () => {
  const bottomSheetModalRef = React.useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);


  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
    backgroundColor:'gray'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BottomSheetScreen;
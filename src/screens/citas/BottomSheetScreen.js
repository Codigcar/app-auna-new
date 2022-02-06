import React, {useCallback, useRef, useMemo, useState,useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Modal,
  Animated,
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {css} from '../../utils/css';

const BottomSheetScreen = (
  navigation,
  route,
  isVisiblePopupCancel,
  setIsVisiblePopupCancel,
  citaBody,
  // bottomSheetModalRef
) => {

  useEffect(() => {
    console.log('useEffect: ', isVisiblePopupCancel);
    handlePresentModalPress()
  }, [isVisiblePopupCancel]);
  
  

  const bottomSheetModalRef = React.useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const [isVisible, setIsVisible] = useState(false);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    console.log('useCallback: ', isVisiblePopupCancel);
    if(isVisiblePopupCancel){
      bottomSheetModalRef.current?.present();
    }
  }, []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={{flex: 1, position:'absolute', top:0, left:0, right:0, bottom:0, zIndex:9}}>
      {/* <Button onPress={abiert} title="Present Modal" color="black" /> */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          backdropComponent={backdropProps => (
            <BottomSheetBackdrop
              {...backdropProps}
              enableTouchThrough={true}
              opacity={0.2}
            />
          )}>
          <Text>¿Quieres Cancelar la Solicitud?</Text>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
    // position:'absolute',
    // // top:0,
    // // left:0
    // backgroundColor: css.colors.shadowColorCard,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BottomSheetScreen;

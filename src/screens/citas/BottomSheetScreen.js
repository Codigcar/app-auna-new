import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
  memo,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import {Avatar, Divider, Icon, Button} from 'react-native-elements';
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
import CitaPopupConfirm from './CitaPopupConfirm';

const BottomSheetScreen = ({
  isVisiblePopup,
  setIsVisiblePopup,
  navigation,
  route,
  citaBody,
  type,
}) => {
  const bottomSheetModalRef = React.useRef(null);
  // variables
  const [sizeBottomSheetScreen, setSizeBottomSheetScreen] = useState(['1%', '42%']);
  const snapPoints = useMemo(() => sizeBottomSheetScreen, [sizeBottomSheetScreen]);

  useEffect(() => {
    if(type==='cancelCita'){
      setSizeBottomSheetScreen(['1%','30%'])
    }
    if( type === 'registerCita'){
      setSizeBottomSheetScreen(['1%', '42%'])
    }
    if(type==='cancelSolicitudInclusion'){
      setSizeBottomSheetScreen(['1%','30%'])
    }
  }, [])
  

  // const snapPoints = ['50%'];

  // callbacks
  const handlePresentModalPress = useCallback(index => {
    // if(isVisiblePopupCancel){
    // bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.snapToIndex(1);
    // }
  }, []);

  const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState(false);

  const handleModalClose = () => {
    // console.log('Cerrado');
    bottomSheetModalRef.current?.snapToIndex(-1);
    setIsVisiblePopup(false);
  };

  const handleSheetChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index == -1) {
      // console.log('Cerradov2');
      setIsVisiblePopup(false);
      bottomSheetModalRef.current?.snapToIndex(-1);
      // console.log('isVisiblePopup: ', isVisiblePopup);
    }
  }, []);


  const handleRegisterCita = () => {
    // setIsVisiblePopup(false);
    bottomSheetModalRef.current?.snapToIndex(-1);
    setIsVisiblePopupConfirm(true);
  }
  const handleCancelCitaConfirm = () => {
    // setIsVisiblePopup(false);
    bottomSheetModalRef.current?.snapToIndex(-1);
    setIsVisiblePopupConfirm(true);
  }
  const closeBottomSheet = () =>{
    setIsVisiblePopup(false);
    bottomSheetModalRef.current?.snapToIndex(-1);
  }

  const handleCancelSolicitudCitaConfirm = () => {
    bottomSheetModalRef.current?.snapToIndex(-1);
    setIsVisiblePopupConfirm(true);
  }
  
  const cancelCitaScreen = () => {
    return (
      <>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
          ¿Deseas cancelar la solicitud?
        </Text>
        <Button
          buttonStyle={css.buttonContainerOutline}
          title="Si, cancelar"
          titleStyle={{
            color: css.colors.primary_opaque,
            ...Platform.select({ios: {fontWeight: 'bold'}}),
          }}
          onPress={() => handleCancelCitaConfirm()}
        />
        <Button
          buttonStyle={css.buttonContainerOutline}
          title="No"
          titleStyle={{
            color: css.colors.primary_opaque,
            ...Platform.select({ios: {fontWeight: 'bold'}}),
          }}
          onPress={() => closeBottomSheet()}
        />
      </>
    );
  };

  const solicitudRegistrarCitaScreen = () => {
    return (
      <View style={{backgroundColor: 'transparent'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color:'black'}}>
          Resumen
        </Text>
        <View style={{marginHorizontal: 35, marginTop: 20}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              name="event-available"
              type="material-icon"
              size={20}
              color={css.colors.primary_opaque}
              style={{marginRight: 10}}
            />
            <View style={styles.flexSpaceBetween} >
              <Text style={styles.labeText}>Fecha:</Text>
              <Text style={styles.textBody}>{citaBody.fecha}</Text> 
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Icon
              name="schedule"
              type="material-icon"
              size={20}
              color={css.colors.primary_opaque}
              style={{marginRight: 10}}
            />
            <View style={styles.flexSpaceBetween} >
            <Text style={styles.labeText}>
              Horario: 
            </Text>
            <Text style={styles.textBody}>{citaBody.horario[0]} - {citaBody.horario[1]}</Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Icon
              name="medical-bag"
              type="material-community"
              size={20}
              color={css.colors.primary_opaque}
              style={{marginRight: 10}}
            />
            <View style={styles.flexSpaceBetween} >
              <Text style={styles.labeText}>Especialidad:</Text>
              <Text style={styles.textBody}>{citaBody.specialty_label}</Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Icon
              name="account-circle"
              type="material-community"
              size={20}
              color={css.colors.primary_opaque}
              style={{marginRight: 10}}
            />
            <View style={styles.flexSpaceBetween} >
            <Text style={styles.labeText}>Paciente:</Text>
            <Text style={styles.textBody}>{citaBody.patient_label}</Text>
            </View>
          </View>
        </View>
        {/* <Text>{ JSON.stringify(citaBody) } </Text> */}
        <Button
          buttonStyle={css.buttonContainerOutline}
          title="Aceptar"
          titleStyle={{
            color: css.colors.primary_opaque,
            ...Platform.select({ios: {fontWeight: 'bold'}}),
          }}
          onPress={() => handleRegisterCita()}
        />
      </View>
    );
  };

  const cancelarSolicitudInclusionScreen = () => {
    return (
      <>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
          ¿Deseas cancelar la solicitud?
        </Text>
        <Button
          buttonStyle={css.buttonContainerOutline}
          title="Sí, cancelar"
          titleStyle={{
            color: css.colors.primary_opaque,
            ...Platform.select({ios: {fontWeight: 'bold'}}),
          }}
          onPress={handleCancelSolicitudCitaConfirm}
        />
        <Button
          buttonStyle={css.buttonContainerOutline}
          title="No"
          titleStyle={{
            color: css.colors.primary_opaque,
            ...Platform.select({ios: {fontWeight: 'bold'}}),
          }}
          onPress={closeBottomSheet}
        />
      </>
    );
  };


  return (
    <>
 {
   isVisiblePopupConfirm ? (
    <CitaPopupConfirm
        isVisiblePopupConfirm={isVisiblePopupConfirm}
        setIsVisiblePopupConfirm={setIsVisiblePopupConfirm}
        citaBody={citaBody}
        navigation={navigation}
        route={route}
        setIsVisiblePopup={setIsVisiblePopup}
        type={type}
      /> 
   ) 
   :
   (<View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9,
      }}>
      {/* <Button onPress={abiert} title="Present Modal" color="black" /> */}
      {/* <BottomSheetModalProvider> */}
      <BottomSheet
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        onClose={handleModalClose}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop
            {...backdropProps}
            enableTouchThrough={true}
            opacity={0.2}
          />
        )}
      >
        <BottomSheetView>{
          type==='registerCita' && solicitudRegistrarCitaScreen() || 
          type==='cancelCita' && cancelCitaScreen() ||
          type==='cancelSolicitudInclusion' &&  cancelarSolicitudInclusionScreen()
        }</BottomSheetView>
      </BottomSheet>
      {/* </BottomSheetModalProvider> */}
    </View>)
  }
  </>
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
  labeText:{
    fontSize:15,
    color: 'black'
  },
  flexSpaceBetween:{
    display:'flex', flexDirection:'row', justifyContent:'space-between', backgroundColor:'transparent', flex:1
  },
  textBody:{
     color:css.colors.gray_opaque, fontSize:15
  },
 
});

export default memo(BottomSheetScreen);

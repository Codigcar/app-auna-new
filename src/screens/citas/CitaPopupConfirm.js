import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  // Button
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button, colors, Icon} from 'react-native-elements';

import {css} from '../../utils/css';
import Modal from 'react-native-modal';
import Constant from '../../utils/constants';
import {fetchWithToken} from '../../utils/fetchCustom';

const CitaPopupConfirm = ({
  navigation,
  route,
  isVisiblePopupConfirm,
  setIsVisiblePopupConfirm,
  citaBody,
  setIsVisiblePopup,
  type,
  realodingMisCitas,
  setRealodingMisCitas,
  refreshFetching,
  setRefreshFetching
}) => {
  //
  // console.log('[citaBody], ', citaBody);
  const [isVisible, setisVisible] = useState(false);
  useEffect(() => {
    setisVisible(isVisiblePopupConfirm);
  }, [isVisiblePopupConfirm]);

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      backdropColor="rgba(0,0,0, .7)"
      backdropOpacity={0.8}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}>
      <DefaultModalContent
        setIsVisiblePopupConfirm={setIsVisiblePopupConfirm}
        citaBody={citaBody}
        navigation={navigation}
        route={route}
        setIsVisiblePopup={setIsVisiblePopup}
        type={type}
        realodingMisCitas={realodingMisCitas}
        setRealodingMisCitas={setRealodingMisCitas}
        refreshFetching={refreshFetching}
        setRefreshFetching={setRefreshFetching}
      />
    </Modal>
  );
};
const DefaultModalContent = ({
  setIsVisiblePopupConfirm,
  citaBody,
  route,
  setIsVisiblePopup,
  type,
  realodingMisCitas,
  setRealodingMisCitas,
  refreshFetching,
  setRefreshFetching
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccessful, setFetchSuccessful] = useState(false);

  useEffect(() => {
    if (type === 'cancelCita') {
      cancelCitaAction();
    }
    if (type === 'registerCita') {
      acceptedRegisterCitaAction();
    }
    if (type === 'cancelSolicitudInclusion') {
      acceptedRemoveSolicitudInclusion();
    }
  }, []);

  const acceptedRegisterCitaAction = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
        IdEspecialidad: citaBody.specialty_value,
        I_idPersonaAsegurada: citaBody.patient_value,
        horaInicio: citaBody.horario[0],
        horaFin: citaBody.horario[1],
        fechaCita: citaBody.horario[2]
      });
      // console.log('[Log Input]: ', JSON.stringify(params));
      const response = await fetchWithToken(
        Constant.URI.POST_REGISTRAR_CITA,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      if (response.Result[0].CodigoMensaje === 100) {
        setIsLoading(false);
        setFetchSuccessful(true);
      } else {
        setIsLoading(false);
        setFetchSuccessful(false);
        console.error('[CitaPopupConfirm - cancelCitaAction]: ', response);
        Alert.alert('Error', response.Result[0].RespuestaMensaje, [
          {text: 'OK', onPress: handleMsgAccepted},
        ]);
      }
    } catch (error) {
      console.error('[CitaPopupConfirm - cancelCitaAction]: ', error);
    }
  };

  const cancelCitaAction = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
        Idcita: citaBody.idCita,
      });
      const response = await fetchWithToken(
        Constant.URI.PUT_CANCELAR_CITA,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      if (response.CodigoMensaje >= 100 && response.CodigoMensaje <= 199) {
        setIsLoading(false);
        setFetchSuccessful(true);
        setRealodingMisCitas(!realodingMisCitas);
      } else {
        setIsLoading(false);
        setFetchSuccessful(false);
        setRealodingMisCitas(!realodingMisCitas);
        console.error('[CitaPopupConfirm - cancelCitaAction]: ', response);
        Alert.alert('Error', 'Intentelo nuevamenta en unos minutos', [
          {text: 'OK', onPress: handleMsgAccepted},
        ]);
      }
    } catch (error) {
      console.error('[CitaPopupConfirm - cancelCitaAction]: ', error);
    }
  };

  const acceptedRemoveSolicitudInclusion = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
        IdSolicitud: citaBody.idSolicitud,
      });
      const response = await fetchWithToken(
        Constant.URI.PUT_CANCELAR_SOLICITUD_INCLUSION,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      console.warn('Response: ', response);
      if (response.CodigoMensaje === 100) {
        setIsLoading(false);
        setFetchSuccessful(true);
        setRefreshFetching(!refreshFetching);
      } else {
        setIsLoading(false);
        setFetchSuccessful(false);
        console.error(
          '[CitaPopupConfirm - acceptedRemoveSolicitudInclusion]: ',
          response,
        );
        Alert.alert('Error', 'Intentelo nuevamenta en unos minutos', [
          {text: 'OK', onPress: handleMsgAccepted},
        ]);
      }
    } catch (error) {
      console.error(
        '[CitaPopupConfirm - acceptedRemoveSolicitudInclusion]: ',
        error,
      );
    }
  };

  const handleMsgAccepted = () => {
    setIsVisiblePopupConfirm(false);
    setIsVisiblePopup(false);
  };

  const msgPopupTypeRegisterCitaShow = () => {
    return (
      <View style={styles.card}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 3,
            }}>
            <TouchableOpacity onPress={handleMsgAccepted}>
              <Icon
                name="close-outline"
                type="ionicon"
                size={35}
                color={'gray'}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
          <Icon
            name="checkmark-circle"
            type="ionicon"
            size={85}
            color={'#19D692'}
            style={{marginTop: 35}}
          />
          <Text
            style={{
              fontSize: 17,
              color: '#19D692',
              fontWeight: 'bold',
              textAlign: 'center',
              ...Platform.select({
                ios: {
                  marginHorizontal: 10,
                },
                android: {
                  marginHorizontal: 20,
                },
              }),
            }}>
            ¡Tu cita médica se registró con éxito!
          </Text>
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 40,
              marginTop: 20,
              color: css.colors.gray_opaque,
            }}>
            Minutos antes de tu fecha y hora elegida te llegará el link del meet
            por correo electrónico. Puedes visualizar tu nueva cita registrada
            en la sección 'Mis Citas Médicas'.
          </Text>
        </View>
      </View>
    );
  };

  const msgPopupTypeCancelCitaShow = () => {
    return (
      <View style={styles.card}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 3,
            }}>
            <TouchableOpacity onPress={handleMsgAccepted}>
              <Icon
                name="close-outline"
                type="ionicon"
                size={35}
                color={'gray'}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
          <Icon
            name="checkmark-circle"
            type="ionicon"
            size={85}
            color={'#11EE91'}
            style={{marginTop: 35}}
          />
          <Text
            style={{
              fontSize: 17,
              color: '#4CBDA1',
              fontWeight: 'bold',
              textAlign: 'center',
              ...Platform.select({
                ios: {
                  marginHorizontal: 10,
                },
                android: {
                  marginHorizontal: 20,
                },
              }),
            }}>
            ¡Tu cita médica se canceló con éxito!
          </Text>
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 40,
              marginTop: 20,
              color: css.colors.gray_opaque,
            }}>
            La cita cancelada no podrá ser visualizada en la lista de tus Citas
            Médicas.
          </Text>
        </View>
      </View>
    );
  };

  const msgPopupTypeCancelSolicitudInclusionShow = () => {
    return (
      <View style={styles.card}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 3,
            }}>
            <TouchableOpacity onPress={handleMsgAccepted}>
              <Icon
                name="close-outline"
                type="ionicon"
                size={35}
                color={'gray'}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
          <Icon
            name="checkmark-circle"
            type="ionicon"
            size={85}
            color={'#11EE91'}
            style={{marginTop: 35}}
          />
          <Text
            style={{
              fontSize: 17,
              color: '#4CBDA1',
              fontWeight: 'bold',
              textAlign: 'center',
              ...Platform.select({
                ios: {
                  marginHorizontal: 10,
                },
                android: {
                  marginHorizontal: 20,
                },
              }),
            }}>
            ¡Tu solicitud se canceló con éxito!
          </Text>
          <Text
            style={{
              marginHorizontal: 20,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 40,
              marginTop: 20,
              color: css.colors.gray_opaque,
            }}>
            Tu solicitud ha sido cancelada correctamente sin opción a retorno,
            ya no podrás visualizarlo en tu lista de tus solicitudes.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color={css.colors.primary} />
      ) : (
        fetchSuccessful && (
          <View
            style={{
              flex: 1,
              zIndex: 9999,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {(type === 'registerCita' && msgPopupTypeRegisterCitaShow()) ||
              (type === 'cancelCita' && msgPopupTypeCancelCitaShow()) ||
              (type === 'cancelSolicitudInclusion' &&
                msgPopupTypeCancelSolicitudInclusionShow())}
          </View>
        )
      )}
    </>
  );
};
export default React.memo(CitaPopupConfirm);
const styles = StyleSheet.create({
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  card: {
    width: '90%',
    position: 'relative',
    backgroundColor: '#FFF',
    borderRadius: 20,
    margin: 15,
    // padding: 7,
    borderWidth: 0,
    marginBottom: 14,
    borderColor: 'rgba(0, 0, 0, 0.14)',
    shadowOpacity: 0.39,
    shadowRadius: 13.97,
    borderWidth: 2,
    // borderColor: css.colors.primary,
    ...Platform.select({
      android: {
        elevation: 11,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  textCenter: {
    textAlign: 'center',
    fontSize: 15,
  },
  numTicket: {
    fontSize: 32,
  },
});

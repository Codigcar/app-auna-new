import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  // Button
  ActivityIndicator,
} from 'react-native';
import {Button, colors, Icon} from 'react-native-elements';

import {css} from '../../utils/css';
import Modal from 'react-native-modal';
import {Divider} from 'react-native-paper';
import Constant from '../../utils/constants';
import {fetchWithToken} from '../../utils/fetchCustom';

export default function SolicitudesPopupCancelScreen({
  navigation,
  route,
  isVisiblePopupCancel,
  setIsVisiblePopupCancel,
  citaBody,
}) {
  const [isVisible, setisVisible] = useState(false);
  useEffect(() => {
    setisVisible(isVisiblePopupCancel);
  }, [isVisiblePopupCancel]);

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
        setIsVisiblePopupCancel={setIsVisiblePopupCancel}
        navigation={navigation}
        route={route}
        citaBody={citaBody}
      />
    </Modal>
  );
}
const DefaultModalContent = ({setIsVisiblePopupCancel, route, citaBody}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [citaAccepted, setCitaAccepted] = useState(false);
  const [citaRegisterSuccess, setCitaRegisterSuccess] = useState(false);

  const handleAcceptedAction = async () => {
    setIsLoading(true);

    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
      IdSolicitud: citaBody.idSolicitud,
    });
    const response = await fetchWithToken(
      Constant.URI.PUT_CANCELAR_SOLICITUD_INCLUSION,
      'POST',
      params,
      route.params.userRoot.Token,
    );
    if (response.CodigoMensaje === 100) {
      setIsLoading(false);
      setCitaAccepted(true);
    } else {
      Alert.alert('Error', response.RespuestaMensaje);
    }
  };
  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color={css.colors.primary} />
      ) : (
        <View
          style={{
            flex: 1,
            zIndex: 9999,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.card}>
            {citaAccepted ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontWeight: 'bold',
                    marginTop: 20,
                  }}>
                  ¡Solicitud Cancelada!
                </Text>
                <Icon
                  name="checkmark-circle"
                  type="ionicon"
                  size={80}
                  color={'green'}
                  style={{marginVertical: 20}}
                />
                <Text
                  style={{
                    marginHorizontal: 20,
                    fontSize: 13,
                    textAlign: 'center',
                    color: css.colors.gray_opaque,
                  }}>
                  Tu solicitud ha sido cancelada correctamente sin opción a
                  retorno, ya no podrás visualizarlo en tu lista de tus
                  solicitudes.
                </Text>
                <View style={{width: '100%'}}>
                  <Button
                    onPress={() => setIsVisiblePopupCancel(false)}
                    title="Aceptar"
                    buttonStyle={{
                      backgroundColor: css.colors.primary_opaque,
                      borderRadius: -1,
                      borderBottomStartRadius: 18,
                      borderBottomEndRadius: 18,
                      shadowOpacity: 0.39,
                      shadowRadius: 13.97,
                      borderWidth: 1,
                      borderColor: css.colors.primary_opaque,
                      marginTop: 20,
                      ...Platform.select({
                        android: {
                          // elevation: 16,
                        },
                        default: {
                          shadowColor: 'rgba(0,0,0, .2)',
                          shadowOffset: {height: 0, width: 0},
                          shadowOpacity: 1,
                          shadowRadius: 1,
                        },
                      }),
                    }}
                    titleStyle={{color: css.colors.white}}
                  />
                </View>
              </View>
            ) : (
              <View style={{backgroundColor: 'transparent'}}>
                <Text
                  style={[
                    styles.textCenter,
                    {
                      color: 'black',
                      marginVertical: 15,
                      // fontWeight: 'bold',
                      marginTop: 20,
                      marginHorizontal: 10,
                      fontSize:16
                    },
                  ]}>
                  ¿Quieres{' '}
                  <Text
                    style={{
                      color: css.colors.primary_opaque,
                      fontWeight: 'bold',
                    }}>
                    CANCELAR{' '}
                  </Text>
                  tu cita médica?
                </Text>
                <Divider
                  style={{
                    borderColor: css.colors.primary_opaque,
                    backgroundColor: css.colors.primary_opaque,
                    borderWidth: 1,
                    width: '100%',
                  }}
                />
                <Text
                  style={[
                    styles.textCenter,
                    {
                      color: 'black',
                      marginTop: 15,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  Asegurado:{' '}
                  <Text style={{color: css.colors.gray_opaque}}>
                    {citaBody.asegurado_label}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.textCenter,
                    {
                      color: 'black',
                      marginTop: 15,
                      textTransform: 'capitalize',
                    },
                  ]}>
                  Solicitud:{' '}
                  {citaBody.tipo_label === 0 ? (
                    <Text style={{color: css.colors.gray_opaque}}>
                      Inclusion
                    </Text>
                  ) : (
                    <Text style={{color: css.colors.gray_opaque}}>
                      Exclusión
                    </Text>
                  )}
                </Text>
                <Text
                  style={[styles.textCenter, {color: 'black', marginTop: 15}]}>
                  Fecha de registro:{' '}
                  <Text style={{color: css.colors.gray_opaque}}>
                    {citaBody.fecha}
                  </Text>
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    marginTop: 30,
                  }}>
                  <View style={{width: '50%'}}>
                    <Button
                      onPress={() => setIsVisiblePopupCancel(false)}
                      title="Cancelar"
                      buttonStyle={{
                        backgroundColor: 'white',
                        borderRadius: -1,
                        borderBottomStartRadius: 18,
                        shadowOpacity: 0.39,
                        shadowRadius: 13.97,
                        // borderWidth: 1,
                        borderTopWidth:1,
                        borderColor: css.colors.primary_opaque,
                        // margin: 10,
                        ...Platform.select({
                          android: {
                            // elevation: 16,
                          },
                          default: {
                            shadowColor: 'rgba(0,0,0, .2)',
                            shadowOffset: {height: 0, width: 0},
                            shadowOpacity: 1,
                            shadowRadius: 1,
                          },
                        }),
                      }}
                      titleStyle={{color: css.colors.primary_opaque}}
                    />
                  </View>
                  <View style={{width: '50%'}}>
                    <Button
                      onPress={() => handleAcceptedAction()}
                      title="Confirmar"
                      buttonStyle={{
                        backgroundColor: css.colors.primary_opaque,
                        borderRadius: -1,
                        borderBottomEndRadius: 18,
                        shadowOpacity: 0.39,
                        shadowRadius: 13.97,
                        // borderWidth: 1,
                        borderTopWidth:1,
                        borderColor: css.colors.primary_opaque,
                        // margin: 10,
                        ...Platform.select({
                          android: {
                            // elevation: 16,
                          },
                          default: {
                            shadowColor: 'rgba(0,0,0, .2)',
                            shadowOffset: {height: 0, width: 0},
                            shadowOpacity: 1,
                            shadowRadius: 1,
                          },
                        }),
                      }}
                      titleStyle={{color: 'white'}}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  card: {
    width: '85%',
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

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, Divider, Icon, Button} from 'react-native-elements';

import {ButtonInitial} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import {fetchWithToken} from '../../utils/fetchCustom';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import BottomSheetScreen from './BottomSheetScreen';
import CitaNewScreen from './CitaNewScreen';
import CitaNotFound from './CitaNotFound';
import CitaPopupCancel from './CitaPopupCancel';

console.log('EJECUTIVOS-HOME: ');

export default function CitaScreen({navigation, route}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mis Citas Médicas',
      headerTitleStyle: css.titleScreen,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerRight: () => (
        //Botón Rojo parte superior
        <ButtonInitial
          navigation={navigation}
          nombre={route.params.userRoot.nombre}
          apellido={route.params.userRoot.apellidoPaterno}
          //dataScreen={'AgentHomeDatosPersonales'} //Llama al Stack.Screen
        />
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      initialParams={{
        userRoot: route.params.userRoot,
        policy: route.params.policy,
        riskGroup: route.params.riskGroup,
      }}
      tabBarOptions={{
        showIcon: true,
        activeTintColor: css.colors.primary,
        inactiveTintColor: css.colors.opaque,
        labelStyle: {fontSize: 12},
        indicatorStyle: {backgroundColor: css.colors.primary_opaque},
      }}
      style={{
        borderTopColor: 'transparent',
        borderTopWidth: 2,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: css.colors.opaque,
                fontSize: 9,
                maxWidth: 87,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              Mis Citas Médicas
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <Icon
              name="today"
              type="material-icon"
              size={24}
              color={css.colors.opaque}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CitaNewScreen"
        component={CitaNewScreen}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
        }}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: css.colors.opaque,
                fontSize: 9,
                maxWidth: 87,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              Registrar Nueva Cita
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <Icon
              name="local-hospital"
              type="material-icon"
              size={24}
              color={css.colors.opaque}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const HomeScreen = React.memo(({navigation, route}) => {
  // console.log('[HomeScreen CitaHome]');
  const isMounted = useRef(true);
  const [items, setItems] = useState('');
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [citaBody, setCitaBody] = useState({});
  const bottomSheetModalRef = React.useRef(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchDataCitasListar();
  }, [items]);

  const fetchDataCitasListar = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_LISTAR_CITA,
      'POST',
      params,
      route.params.userRoot.Token,
    );
    if (isMounted.current) {
      if (response.CodigoMensaje === 100) {
        setItems(response.Result.reverse());
      } else {
        Alert.alert('Error', response.RespuestaMensaje);
      }
    }
  };

  const handleVisiblePopupCancel = itemCita => {
    setCitaBody({
      patient_label: itemCita.nombrecompleto,
      specialty_label: itemCita.descripcion,
      fecha: itemCita.fechaCita,
      horario: itemCita.horaInicio + ' - ' + itemCita.horaFin,
      idCita: itemCita.idCita,
    });
    setIsVisiblePopup(true);
  };

  return (
    <SafeAreaView style={css.screen}>
      {isVisiblePopup && (
        <BottomSheetScreen
          isVisiblePopup={isVisiblePopup}
          setIsVisiblePopup={setIsVisiblePopup}
          navigation={navigation}
          route={route}
          citaBody={citaBody}
        />
      )}
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Mis citas médicas</Text>
        </View>
        <Divider style={css.dividerTitleLineRed} />
      </View>
      {typeof items === 'string' ? (
        <AuthLoadingScreen />
      ) : (
        <>
          {items.length === 0 ? (
            <CitaNotFound />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item, index) =>
                String.valueOf(item.idFuncionarioInternoDetalle) + `${index}`
              }
              renderItem={({item}) => (
                <View style={styles.card}>
                  <View style={{padding: 7}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                      }}>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          flex: 1,
                          flexGrow: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            textTransform: 'uppercase',
                            color: css.colors.gray_opaque,
                          }}>
                          {item.Mes.substring(0, 3)}
                        </Text>
                        <Text
                          style={{
                            color: css.colors.gray_opaque,
                            fontSize: 21,
                            fontWeight: 'bold',
                          }}>
                          {item.fechaCita.substring(0, 2)}
                        </Text>
                        <Text style={{color: css.colors.gray_opaque}}>
                          {item.fechaCita.substring(6, 10)}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          flex: 1,
                          flexGrow: 6,
                          marginHorizontal: 20,
                        }}>
                        <View style={[styles.flexRow]}>
                          <View>
                            <Text>{item.descripcion}</Text>
                            <Text
                              style={{fontSize: 11, color: css.colors.opaque}}>
                              {' '}
                              {item.Dia}, {item.Mes}{' '}
                              {item.fechaCita.substring(0, 2)},{' '}
                              {item.fechaCita.substring(6, 10)}
                            </Text>
                          </View>
                          <Icon
                            name="event-available"
                            type="material-icon"
                            size={24}
                            color={css.colors.opaque}
                          />
                        </View>
                        <View style={[styles.flexRow]}>
                          <Text>
                            {item.horaInicio} - {item.horaFin}
                          </Text>
                          <Icon
                            name="access-time"
                            type="material-icon"
                            size={24}
                            color={css.colors.opaque}
                          />
                        </View>
                        <View style={styles.flexRow}>
                          <Text style={{textTransform: 'capitalize'}}>
                            {item.nombrecompleto}
                          </Text>
                          <Icon
                            name="person-outline"
                            type="material-icon"
                            size={24}
                            color={css.colors.opaque}
                          />
                        </View>
                      </View>
                    </View>
                  </View>

                  <Button
                    onPress={() => handleVisiblePopupCancel(item)}
                    title="Cancelar"
                    buttonStyle={{
                      backgroundColor: css.colors.primary_opaque,
                      borderColor: 'rgba(0,0,0,0.5)',
                      // borderRadius: 10,
                      borderBottomEndRadius: 10,
                      borderBottomStartRadius: 10,
                      // height: 35,
                      marginTop: 15,
                      width: '100%',
                      ...Platform.select({
                        android: {
                          elevation: 16,
                          shadowOpacity: 0.39,
                          shadowRadius: 13.97,
                        },
                        default: {
                          shadowColor: 'rgba(0,0,0, .2)',
                          shadowOffset: {height: 0, width: 0},
                          shadowOpacity: 1,
                          shadowRadius: 1,
                        },
                      }),
                    }}
                    titleStyle={{
                      color: '#FFF',
                      ...Platform.select({
                        ios: {
                          fontSize: 16,
                          height: 24,
                          fontWeight: 'bold',
                        },
                      }),
                    }}
                  />
                </View>
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
});

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

//Styles
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFF',
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    height: 70,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  headerTitle: {
    fontSize: 26,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    marginBottom: 14,
    // borderColor: 'red',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      android: {
        shadowOpacity: 0.39,
        shadowRadius: 13.97,
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
  cardSection: {
    flexDirection: 'row',
    margin: 3,
    height: 24,
    alignItems: 'center',
  },
  cardSectionText: {
    color: 'rgba(166, 166, 172, 1)',
    marginLeft: 5,
  },
  cardIconDetails: {
    borderWidth: 1,
    borderColor: css.colors.opaque,
    padding: 3,
    borderRadius: Platform.select({
      android: Dimensions.get('window').width / 2,
      default: 10,
    }),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    margin: 10,
  },
  divider: {
    backgroundColor: css.colors.opaque,
    padding: 0.2,
    margin: 2,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  // Citas no encontradas
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrayOpaque: {
    color: css.colors.gray_opaque,
  },
});

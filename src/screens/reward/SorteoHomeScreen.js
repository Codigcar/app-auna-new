import {View} from 'native-base';
import React, {useState} from 'react';
import {FlatList, Image, Platform} from 'react-native';
import {Avatar, Icon, Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import constants from '../../utils/constants';
import {css} from '../../utils/css';

export const SorteoHomeScreen = () => {
  console.log('[SorteoHomeScreen]');
  const [items, setItems] = useState([
    {
      CodigoMensaje: 100,
      RespuestaMensaje: 'Ejecutivos encontrados.',
      idFuncionarioInternoDetalle: 205,
      nombre: 'Paola',
      apellidoPaterno: 'Sosa',
      cargo: 'EJECUTIVO DE CUENTA',
      telefonoMovil: '939175828',
      telefonoFijo: '',
      anexoTelefonoFijo: '',
      correoElectronico: 'psosa@laprotectora.com.pe',
      ocultarTelefonoFijo: 1,
      ocultarAnexo: 1,
      riesgos: [
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 5,
          nombreRiesgo: 'Ejemplo premio número 1',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/sctrsalud.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 6,
          nombreRiesgo: 'Ejemplo premio número 2',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/sctrpension.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 13,
          nombreRiesgo: 'Ejemplo premio número 3',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/asistenciamedica.png',
        },
      ],
    },
  ]);

  function Imagenes(props) {
    const items = props.items;
    return (
      <FlatList
        // persistentScrollbar={true}
        data={items}
        horizontal={true}
        keyExtractor={(item, index) =>
          String.valueOf(item.idRiesgo) + `${index}`
        }
        renderItem={({item, index}) => (
          <>
            {item.idRiesgo == 0 ? (
              <></>
            ) : (
              <View
                style={{
                  backgroundColor: 'transparent',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  //   elevation: 11,
                  marginRight: 0,
                  //   backgroundColor: 'transparent',
                  borderRadius: 10,
                  margin: 15,
                  //   padding: 0,
                  //   borderWidth: 1,
                  //   borderColor: 'rgba(0, 0, 0, 0.14)',
                  shadowOpacity: 0.39,
                  shadowRadius: 13.97,
                  paddingVertical: 20,
                  maxWidth: constants.DEVICE.WIDTH * 0.3,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    // marginBottom: 30,
                  }}>
                  <Avatar
                    size={70}
                    rounded
                    // source={{ uri: SV_RutaImagen }}
                    icon={{
                      name: 'gift-outline',
                      type: 'ionicon',
                      size: 40,
                      color: css.colors.primary_opaque,
                    }}
                    containerStyle={{
                      backgroundColor: 'white',
                      ...Platform.select({
                        ios: {
                          shadowColor: css.colors.primary_opaque,
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowOpacity: 1,
                          shadowRadius: 5,
                          // elevation: 4,
                        },
                        android: {
                          shadowColor: css.colors.primary_opaque,
                          elevation: 24,
                          shadowOffset: {
                            width: 0,
                            height: 12,
                          },
                          shadowOpacity: 0.58,
                          shadowRadius: 16.0,
                        },
                      }),
                    }}
                  />
                  <Text
                    style={{paddingTop: 10, textAlign: 'center', fontSize: 12}}>
                    {item.nombreRiesgo}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      />
    );
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <SvgXml
          xml={giftbox}
          height={150}
          width={'100%'}
          style={{
            backgroundColor: '#FAFAFA'
          }}
        /> */}
      <Image
        style={{height: 145, resizeMode: 'cover', width: '100%'}}
        source={require('../../assets/box.png')}
        PlaceholderContent={<Text></Text>}
      />
      <Text style={{textAlign: 'center', marginHorizontal: 20, marginTop: 15}}>
        <Text style={{fontSize: 17}}>¡Sé uno de los</Text>
        <Text style={{color: css.colors.primary_opaque, fontSize: 30}}>
          10 ganadores
        </Text>
        <Text style={{fontSize: 17}}>
          {' '}
          mensuales de nuestros super premios!
        </Text>
      </Text>
      <View>
        <Imagenes items={items[0].riesgos} />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View
          style={{
            borderWidth: 3,
            borderColor: '#DCDDE0',
            width: 200,
            borderStyle: 'dotted',
            borderRadius: 10,
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              textAlign: 'center',
              backgroundColor: 'transparent',
              marginRight: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 13,
                color: css.colors.gray_opaque,
              }}>
              Tu ticket
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 35,
                  color: css.colors.primary_opaque,
                  fontWeight: 'bold',
                }}></Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 32,
                  ...Platform.select({
                    ios: {
                      fontWeight: '600',
                    },
                    android: {
                      fontWeight: 'bold',
                    },
                  }),
                }}>
                N°321
              </Text>
            </View>
          </View>
          <View
            style={{
              textAlign: 'center',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Icon
              name="ticket"
              type="fontisto"
              size={40}
              color={css.colors.primary_opaque}
            />
          </View>
        </View>
      </View>
      <View style={{marginVertical: 30}}>
        <View
          style={{
            backgroundColor: '#FEF4E8',
            marginHorizontal: 20,
            borderRadius: 7,
            padding: 5,
          }}>
          <View style={{backgroundColor: 'white', padding: 5, borderRadius: 7}}>
            <View
              style={{
                backgroundColor: '#FEF4E8',
                borderRadius: 7,
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // paddingHorizontal:5
                  paddingRight: 10,
                }}>
                <Icon
                  name="warning"
                  type="ionicon"
                  size={30}
                  color={'#FFCA00'}
                />
              </View>
              <View style={{marginRight: 30}}>
                <Text>
                  Importante: Por cada mes que ingreses tendrás automáticamente
                  un número de ticket con el que podrás participar en nuestros
                  increibles sorteos mensuales.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{backgroundColor: 'transparent', marginBottom: 40}}>
        <Text style={{textAlign: 'center', textDecorationLine: 'underline'}}>
          Ver términos de uso
        </Text>
        <Text style={{textAlign: 'center', textDecorationLine: 'underline'}}>
          Ver Política de Privacidad
        </Text>
      </View>
    </ScrollView>
  );
};

export default SorteoHomeScreen;


/* 

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Divider, Icon, Avatar} from 'react-native-elements';
import {SvgXml} from 'react-native-svg';

import {ButtonInitial} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import RewardWinnersScreen from './RewardWinnersScreen';
import {height, width} from 'react-native-dimension';
import SorteoHomeScreen from './SorteoHomeScreen';
import giftbox from '../../assets/svg/giftbox';

export default function RewardHomeScreen({navigation, route}) {
  console.log('[Stack-SorteoScreen]');
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Sorteos',
      headerTitleStyle: css.titleScreen,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerRight: () => (
        <ButtonInitial
          navigation={navigation}
          nombre={route.params.userRoot.nombre}
          apellido={route.params.userRoot.apellidoPaterno}
        />
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      lazy={true}
      optimizationsEnabled={true}
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
              PREMIOS
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginTop: -4,
              }}
              source={Constant.GLOBAL.IMAGES.PREMIOS}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RewardWinnersScreen"
        component={RewardWinnersScreen}
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
              GANADORES
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginTop: -4,
              }}
              source={Constant.GLOBAL.IMAGES.GANADORES}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen({navigation, route}) {
  return (
    <SafeAreaView style={css.screen}>
      <View style={{marginTop: 30}}>
        <SvgXml
          xml={giftbox}
          height={130}
          width={'100%'}
          style={
            {
              // position: 'absolute',
              // top: -50,
              // flex: 1,
            }
          }
        />
        <Text style={{textAlign: 'center', marginTop: 20, fontSize:18, fontWeight:'300'}}>
          ¡Tú puedes ser el{' '}
          <Text style={{color: css.colors.primary_opaque, fontSize: 30, fontWeight:'bold'}}>
            {' '}
            GANADOR
          </Text>{' '}
          del mes!
        </Text>
      </View>

      <View>
        <View
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            marginTop: 40,
            marginHorizontal:20,
            borderStyle: 'dotted',
            borderWidth:3,
            borderRadius: 10,
            borderColor: '#DCDDE0',
            paddingVertical:15

          }}>
          <View style={{flex: 2, backgroundColor: 'transparent', paddingTop:10, paddingLeft:10}}>
            <Text style={{textAlign: 'justify', marginHorizontal:10 ,fontSize:12}}>
              Con este ticket estas participando en nuestros increibles sorteos mensuales.
            </Text>
            <View
              style={{
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  // borderWidth: 3,
                  // borderColor: '#DCDDE0',
                  width: 200,
                  borderStyle: 'dotted',
                  borderRadius: 10,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 13,
                      color: css.colors.gray_opaque,
                    }}>
                    Tu ticket
                  </Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 35,
                        color: css.colors.primary_opaque,
                        fontWeight: 'bold',
                      }}></Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 32,
                        ...Platform.select({
                          ios: {
                            fontWeight: '600',
                          },
                          android: {
                            fontWeight: 'bold',
                          },
                        }),
                      }}>
                      N°321
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name="ticket"
                    type="fontisto"
                    size={40}
                    color={css.colors.primary_opaque}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1, backgroundColor:'transparent', display:'flex', flexDirection:'column', justifyContent:'space-evenly'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="gift"
                type="ionicon"
                size={30}
                color={css.colors.primary_opaque}
              />
              <Text>Premio 1</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="time"
                type="ionicon"
                size={30}
                color={css.colors.primary_opaque}
              />
              <Text>Premio 1</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="calendar"
                type="ionicon"
                size={30}
                color={css.colors.primary_opaque}
              />
              <Text>Premio 1</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{marginVertical: 30, position:'absolute', bottom:40, left:1, right:1 }}>
        <View
          style={{
            backgroundColor: '#FEF4E8',
            marginHorizontal: 20,
            borderRadius: 7,
            padding: 5,
          }}>
          <View style={{backgroundColor: 'white', padding: 5, borderRadius: 7}}>
            <View
              style={{
                backgroundColor: '#FEF4E8',
                borderRadius: 7,
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // paddingHorizontal:5
                  paddingRight: 10,
                }}>
                <Icon
                  name="warning"
                  type="ionicon"
                  size={30}
                  color={'#FFCA00'}
                />
              </View>
              <View style={{marginRight: 30}}>
                <Text style={{color: css.colors.primary_opaque}}>
                  Importante:
                  <Text style={{color: 'black'}}>
                    En caso seas el ganador del mes, se te enviará un correo
                    electrónico con las indicaciones necesarias para recoger tu
                    premio.
                  </Text>{' '}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  // ----------------------- CARD
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
    // borderWidth: 1,
    // borderColor: css.colors.opaque,
    padding: 3,
    // borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:10}),
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
    display: 'flex',
    flexDirection: 'row',
  },
});
*/
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

import {ButtonInitial} from '../../components';

import Constant from '../../utils/constants';
import {css} from '../../utils/css';

import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import RewardWinnersScreen from './RewardWinnersScreen';

import {height, width} from 'react-native-dimension';
import SorteoHomeScreen from './SorteoHomeScreen';
// import moment from 'moment';
//SI "CLINICAS"
//SI "DEPENDIENTES"

console.log('LOG1   *********************** PolicyDetailScreen 1');

export default function RewardHomeScreen({navigation, route}) {
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
        component={SorteoHomeScreen}
        // initialParams={{
        //   userRoot: route.params.userRoot,
        //   policy: route.params.policy,
        //   riskGroup: route.params.riskGroup,
        // }}
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
              style={{width: 30, height: 30, resizeMode:'contain', marginTop:-4}}
              source={Constant.GLOBAL.IMAGES.PREMIOS} />
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
              style={{width: 30, height: 30, resizeMode:'contain', marginTop:-4}}
              source={Constant.GLOBAL.IMAGES.GANADORES} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen({navigation, route}) {
  console.log('SorteoHome');
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
          nombreRiesgo: 'Premio1',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/sctrsalud.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 6,
          nombreRiesgo: 'Premio2',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/sctrpension.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 13,
          nombreRiesgo: 'Premio3',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/asistenciamedica.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 75,
          nombreRiesgo: 'Premio4',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/vidaley.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 87,
          nombreRiesgo: 'Premio5',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/eps.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 93,
          nombreRiesgo: 'Premio6',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/fola.png',
        },
      ],
    },
  ]);

  function Imagenes(props) {
    const items = props.items;
    console.log(
      'PANTALLA EJECUTIVOSHomeScreen imagenes: ' + JSON.stringify(props.items),
    );
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
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // marginBottom: 10,
                  backgroundColor: 'green',
                  elevation: 11,
                  marginRight: 0,
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  margin: 15,
                  padding: 7,
                  borderWidth: 0,
                  // marginBottom: 14,
                  borderColor: 'rgba(0, 0, 0, 0.14)',
                  shadowOpacity: 0.39,
                  shadowRadius: 13.97,
                  paddingVertical: 20,
                }}>
                {/* <View style={{ backgroundColor:'red'}} >
                  <Icon
                    rounded
                    name="gift-outline"
                    type="ionicon"
                    color={'#fff'}
                    size={40}
                    iconStyle={styles.cardIconDetails}
                  />
                </View> */}
                <View
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    marginBottom: 30,
                  }}>
                  <Avatar
                    size={70}
                    rounded
                    // source={{ uri: SV_RutaImagen }}
                    icon={{name: 'gift-outline', type: 'ionicon', size: 40}}
                    containerStyle={{
                      backgroundColor: css.colors.primary_opaque,
                    }}
                  />
                  {/* <Text style={[Styles.textOpaque, { fontSize: 12, textAlign: "center", width: 80, height: 40, marginTop: 8 }]}>{SV_NombreServicio}</Text> */}
                  {/* <Text>{item.nombreRiesgo}</Text> */}
                  <Text style={{paddingTop: 20}}>{item.nombreRiesgo}</Text>
                </View>
              </View>
            )}
          </>
        )}
      />
    );
  }

  if (items.length === 0) {
    return <AuthLoadingScreen />;
  }
  return (
    <SafeAreaView style={css.screen}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>SORTEO DE VERANO</Text>
      </View>
      <Divider style={css.dividerTitleLineRed} />
      <ScrollView>
        <View
          style={{
            backgroundColor: css.colors.primary_opaque,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flex: 1,
            marginVertical: 30,
            marginHorizontal:20,
            borderRadius:40,
            elevation:20,
            paddingVertical: 20,
          }}>
          <View>
            <Icon
              name="ticket-alt"
              type="fontisto"
              size={124}
              color={'white'}
            />
          </View>
          <View style={{backgroundColor:'transparent'}}>
            <Text style={{color: 'white', fontSize: 30, fontWeight:'bold'}}>N° Ticket 421</Text>
            <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', marginVertical:5}} >
              <Text style={{color: 'white', fontSize: 17, marginRight:10}}>31/01/2022</Text>
              <Icon
                name="calendar"
                type="fontisto"
                size={25}
                color={css.colors.white}
              />
            </View>
            <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', marginVertical:0}} >
              <Text style={{color: 'white', fontSize: 17, marginRight:10}}>31/01/2022</Text>
              <Icon
                name="access-time"
                type="material-icon"
                size={25}
                color={css.colors.white}
              />
            </View>
          </View>
        </View>
        <Text
          style={{textAlign: 'center', marginHorizontal: 20}}>
          <Text style={{fontSize: 17}}>¡Sé uno de los</Text>
          <Text style={{color: css.colors.primary_opaque, fontSize: 30}}>
            10 ganadores
          </Text>
          <Text style={{fontSize: 17}}>
            {' '}
            mensuales de nuestros super premios!
          </Text>
        </Text>
        <View
          style={{
            marginVertical: 30,
            backgroundColor: css.colors.primary_opaque,
          }}>
          <View>
            <Imagenes items={items[0].riesgos} />
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'transparent',
            marginHorizontal: 25,
            // marginTop: 40,
          }}>
          <Text style={{textAlign: 'justify'}}>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32.
          </Text>
        </View>
      </ScrollView>
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
  // card: {
  //   backgroundColor: '#FFF',
  //   borderRadius: 10,
  //   margin: 15,
  //   padding: 7,
  //   borderWidth: 0,
  //   marginBottom: 14,
  //   borderColor: 'rgba(0, 0, 0, 0.14)',
  //   shadowOpacity: 0.39,
  //   shadowRadius: 13.97,
  //   ...Platform.select({
  //     android: {
  //       // elevation: 11,
  //       elevation: 0,
  //     },
  //     default: {
  //       shadowColor: 'rgba(0,0,0, .2)',
  //       shadowOffset: {height: 0, width: 0},
  //       shadowOpacity: 1,
  //       shadowRadius: 1,
  //     },
  //   }),
  // },
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
});

//--------------------

const Test5 = () => {
  return (
    <View style={{backgroundColor: 'red'}}>
      <View>
        <View
          style={{
            // flex: 1,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              alignSelf: 'center',
              height: height(27),
              width: width(80),
              borderRadius: width(4),
              backgroundColor: css.colors.primary_opaque,
            }}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View>
                <Text style={{fontWeight: 'bold', padding: 10}}>CODE200</Text>
              </View>
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginTop: height(7),
                  padding: 10,
                }}>
                <Text style={{textAlign: 'right'}}>Valid Till</Text>
                {/* <Text style={{textAlign: 'right'}}>
                  {moment().format('dddd, MMMM Do YYYY')}
                </Text> */}
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  height: height(4),
                  width: width(8),
                  borderRadius: width(10),
                  backgroundColor: 'white',
                }}
              />
              <Text style={{color: 'grey'}}>
                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                - - - - - -
              </Text>
              <View
                style={{
                  height: height(4),
                  width: width(8),
                  borderRadius: width(10),
                  backgroundColor: 'white',
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <View>
                <Text style={{textAlign: 'left'}}>APPLICABLE ON</Text>
                <Text style={{textAlign: 'left'}}>Today</Text>
              </View>
              <View style={{alignSelf: 'flex-end'}}>
                <Text style={{fontWeight: 'bold', textAlign: 'right'}}>
                  Rs: 200/-
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

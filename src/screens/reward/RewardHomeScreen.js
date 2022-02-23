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
import {Icon} from 'react-native-elements';
import {SvgXml} from 'react-native-svg';
import Svg, {Path} from 'react-native-svg';

import {ButtonInitial} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import RewardWinnersScreen from './RewardWinnersScreen';
import giftbox from '../../assets/svg/giftbox';
import {fetchWithToken} from '../../utils/fetchCustom';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';

export default function RewardHomeScreen({navigation, route}) {
  console.log('[Stack-SorteoScreen]');
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'SORTEOS',
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
                fontSize: 10,
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
                fontSize: 10,
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
  const [sorteo, setSorteo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSorteoDescripcion();
  }, []);

  const fetchSorteoDescripcion = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
      });
      const response = await fetchWithToken(
        Constant.URI.GET_INFO_SORTEO,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      console.log('[fetchSorteoDescripcion]: ', response);
      if (response.CodigoMensaje === 100) {
        setSorteo(response.Result[0]);
        setIsLoading(false);
      } else {
        Alert.alert('Error', response.RespuestaMensaje);
        console.error(
          '[RewardHome - fetchSorteoDescripcion]: ',
          response.RespuestaMensaje,
        );
      }
    } catch (error) {
      console.error(
        '[RewardHome - fetchSorteoDescripcion]: ',
        response.RespuestaMensaje,
      );
    }
  };

  return (
    <SafeAreaView style={css.screen}>
      <View style={{position: 'relative', flex: 1}}>
        {isLoading ? (
          <LoadingActivityIndicator />
        ) : (
          <>
            <View style={{marginTop: 20}}>
              <SvgXml xml={giftbox} height={120} width={'100%'} />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '300',
                  marginTop: 30,
                }}>
                ¡Tú puedes ser el{' '}
                <Text
                  style={{
                    color: css.colors.primary_opaque,
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
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
                  marginHorizontal: 20,
                  borderRadius: 10,
                  paddingVertical: 15,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                }}>
                <View
                  style={{
                    flex: 1.5,
                    backgroundColor: 'transparent',
                    paddingTop: 10,
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'justify',
                      marginHorizontal: 10,
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginBottom: 5,
                    }}>
                    TICKET N° {sorteo.CodigoTicket}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'left',
                      marginHorizontal: 10,
                      marginRight: 20,
                      color: css.colors.gray_opaque,
                    }}>
                    {sorteo.descripcionSorteo}
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
                        width: 200,
                        borderStyle: 'dotted',
                        borderRadius: 10,
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}></View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}>
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
                      style={{marginRight: 5}}
                    />
                    <Text>{sorteo.premio}</Text>
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
                      style={{marginRight: 5, marginVertical: 20}}
                    />
                    <Text>
                      {sorteo.fechaInicio} - {sorteo.fechaFin}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="ticket"
                      type="fontisto"
                      size={30}
                      color={css.colors.primary_opaque}
                      style={{marginRight: 5}}
                    />
                    <Text>N° {sorteo.CodigoTicket}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 40,
              }}>
              <View
                style={{
                  backgroundColor: '#FEF4E8',
                  marginHorizontal: 20,
                  borderRadius: 7,
                  padding: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderWidth: 3,
                  borderColor: '#FEF4E8',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: 7,
                  }}>
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
                          {' '}
                          {sorteo.descripcionSorteo2}
                        </Text>{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
        <Svg
          height="100"
          width="100%"
          viewBox="0 0 1440 320"
          style={{position: 'absolute', bottom: 0}}>
          <Path
            fill="#d41c1c"
            fill-opacity="1"
            d="M0,96L80,112C160,128,320,160,480,149.3C640,139,800,85,960,74.7C1120,64,1280,96,1360,112L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </Svg>
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

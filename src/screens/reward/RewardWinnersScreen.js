import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {SearchBar, Icon} from 'react-native-elements';
import {ButtonInitial} from '../../components';
import {css} from '../../utils/css';
import {fetchWithToken} from '../../utils/fetchCustom';
import Constant from '../../utils/constants';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import DataNotFound from '../../components/DataNotFound';

console.log('1 ConsoleLog - ASEGURADOS/DEPENDIENTES: ');

export default function RewardWinnersScreen({navigation, route}) {
  console.log('[Stack-SorteoGanadoresSreen');
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Solicitudes',
      headerTitleStyle: css.titleScreen,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerRight: () => (
        <ButtonInitial
          navigation={navigation}
          nombre={route.params.userRoot.nombre}
          apellido={route.params.userRoot.apellidoPaterno}
          dataScreen={'FuncDatosPersonales'}
        />
      ),
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={App}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
        }}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const App = ({route}) => {
  console.log('[SorteoGanadoresSreen');
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState('');
  const [masterDataSource, setMasterDataSource] = useState('');
  const [dateNextSorteo, setDateNextSorteo] = useState('');

  useEffect(() => {
    // setFilteredDataSource([
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ADELINDA  ALVINES YOVERA',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ROBERTO FUENTES META',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/02/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ESTEFANNY DIAZ MANSON',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ESTEFANNY DIAZ MANSON',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ESTEFANNY DIAZ MANSON',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    // ]);
    // setMasterDataSource([
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ADELINDA  ALVINES YOVERA',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'MARIO BROS BROS',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ESTEFANNY DIAZ MANSON',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ESTEFANNY DIAZ MANSON',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    //   {
    //     CodigoTicket: '1',
    //     NombreCompleto: 'ESTEFANNY DIAZ MANSON',
    //     codigoSorteo: '1',
    //     fechaInicio: '01/01/2022',
    //     fechaFin: '31/01/2022',
    //     Mes_Anio: 'Enero - 2022',
    //     NombreSorteo: 'SORTEO1',
    //     ProximoSorteo: '31/01/2022',
    //   },
    // ]);
  }, []);

  useEffect(() => {
    fetchDataProximoSorteo();
    fetchDataListarGanadores();
  }, []);

  const fetchDataProximoSorteo = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_FECHA_PROXIMO_SORTEO,
      'POST',
      params,
      route.params.userRoot.Token,
    );
    if (response.CodigoMensaje === 100) {
      setDateNextSorteo(response.Result[0].fechaUltimoSorteo);
    } else {
      Alert.alert('Error', response.RespuestaMensaje);
    }
  };

  const fetchDataListarGanadores = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_LISTAR_GANADORES_SORTEO,
      'POST',
      params,
      route.params.userRoot.Token,
    );
    // console.log('[Response]:: ', response);
    if (response.CodigoMensaje === 100) {
      setFilteredDataSource(response.Result);
      setMasterDataSource(response.Result);
    } else {
      Alert.alert('Error', response.RespuestaMensaje);
    }
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.NombreCompleto.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({item}) => {
    return (
      <View style={styles.card}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{flex: 1, paddingLeft: 10, backgroundColor: 'transparent'}}>
            <View
              style={{
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: css.colors.gray_opaque,
                  textTransform: 'uppercase',
                }}>
                {item.Mes_Anio}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: css.colors.gray_opaque,
                    // marginRight: 20,
                    // marginLeft: 5,
                  }}>
                  TICKET N° {item.CodigoTicket}
                </Text>
                <Icon
                  name="ticket"
                  type="fontisto"
                  size={20}
                  color={css.colors.opaque}
                  style={{marginRight: 20, marginLeft: 3}}
                />
              </View>
            </View>
            <View style={styles.cardSection}>
              <Text style={styles.textColorPrimary}>Sorteo:</Text>
              <Text style={styles.cardSectionText}>{item.NombreSorteo}</Text>
            </View>
            <View style={styles.cardSection}>
              <Text style={styles.textColorPrimary}>Ganador:</Text>
              <Text style={styles.cardSectionText}>{item.NombreCompleto}</Text>
            </View>
            <View style={styles.cardSection}>
              <Text style={styles.textColorPrimary}>F. del sorteo:</Text>
              <Text style={styles.cardSectionText}>{item.fechaGanador}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
        <View style={{backgroundColor: 'fff', marginTop:13}}>
          <Text
            style={[
              styles.textColorGray,
              {textAlign: 'center', fontSize: 24, marginVertical: 7},
            ]}>
            ¡Felicitaciones a los ganadores!
          </Text>
        </View>
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              backgroundColor: css.colors.primary_opaque,
              fontSize: 20,
              marginVertical: 10,
              paddingVertical: 5,
            }}>
            Próximo sorteo: {dateNextSorteo}
          </Text>
        </View>
        <View
          style={{
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
                marginHorizontal: 15,
              },
            }),
          }}>
          <SearchBar
            containerStyle={{
              backgroundColor: '#fff',
              borderTopColor: '#FFF',
              borderBottomColor: '#FFF',
              paddingHorizontal: 0,
              ...Platform.select({
                ios: {
                  paddingVertical: 0,
                  borderRadius: 10,
                },
              }),
            }}
            inputContainerStyle={
              styles.estiloBarraBusqueda
            }
            // styles.estiloBarraBusqueda
            onChangeText={text => searchFilterFunction(text)}
            onClear={() => searchFilterFunction('')}
            placeholder="Ganador"
            value={search}
          />
        </View>
        {typeof filteredDataSource === 'string' ? (
          <AuthLoadingScreen />
        ) : (
          <>
            {filteredDataSource.length === 0 ? (
              <DataNotFound message={'No se encontraron registros'} />
            ) : (
              <FlatList
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();
const styles = StyleSheet.create({
  headerContainer: {
    borderTopColor: '#d41c1c',
    borderTopWidth: 2,
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 0,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  textHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  estiloBusquedaCobertor_iPhone: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 1,
    borderWidth: 0,
    marginBottom: 5,
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
        elevation: 11,
        borderColor: '#0FF',
        borderTopWidth: 0,
        margin: 0,
      },
      default: {
        margin: 20,
        shadowOpacity: 0.39,
        shadowRadius: 13.97,
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
        borderColor: 'rgba(0,0,0,0.5)',
      },
    }),
  },
  estiloBarraBusqueda: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical:0,
    // borderColor: 'rgba(0,0,0,0.5)',
    ...Platform.select({
      ios: {
      },
      android: {
        marginLeft: 15,
        marginRight: 15,
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 15,
    padding: 7,
    marginBottom: 14,
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
    // color: 'rgba(166, 166, 172, 1)',
    color: 'black',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  cardIconDetails: {
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderRadius: Dimensions.get('window').width / 2,
  },
  // cardIconDetails2: {
  //   borderWidth: 3,
  //   borderColor: "#d41c1c",
  //   padding: 0,
  //   borderRadius: Dimensions.get('window').width / 2
  // },
  divider: {
    backgroundColor: css.colors.opaque,
    padding: 0.2,
    margin: 2,
  },
  dividerTitleLineRed: {
    borderColor: '#d41c1c',
    backgroundColor: '#d41c1c',
    borderWidth: 1,
    marginLeft: 20,
    width: 50,
  },
  searchBarArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  textColorPrimary: {
    color: css.colors.primary_opaque,
  },
  textColorGray: {
    color: 'rgba(166, 166, 172, 1)',
  },
});

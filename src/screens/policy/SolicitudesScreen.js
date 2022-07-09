import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';

import {SearchBar} from 'react-native-elements';
import {ButtonInitial, DataNotFound} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import {fetchWithToken} from '../../utils/fetchCustom';
import BottomSheetScreen from '../citas/BottomSheetScreen';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';

export default function SolicitudesScreen({navigation, route}) {
  console.log('[Stack-SolicitudesScreen - 5]');

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
  console.log('[SolicitudesScreen - 5]');
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState('');
  const [masterDataSource, setMasterDataSource] = useState('');
  const [solicitudBody, setSolicitudBody] = useState({});
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [refreshFetching, setRefreshFetching] = useState(false);

  useEffect(() => {
    fetchDataListSolicitudes();
  }, [refreshFetching]);

  const fetchDataListSolicitudes = async () => {
    try {
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
      });
      const response = await fetchWithToken(
        Constant.URI.GET_LISTAR_SOLICITUDES_INCLUSION,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      // console.log('[fetchDataListSolicitudes]: ', response);
      if (response.CodigoMensaje == 100) {
        setFilteredDataSource(response.Result);
        setMasterDataSource(response.Result);
      } else {
        Alert.alert('Error', response.RespuestaMensaje);
      }
    } catch (error) {
      console.log('[SolicitudesScreen] error*: ', error);
      Alert.alert('Error', error.toString());
    }
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = (
          item.nombres +
          ' ' +
          item.apellido_paterno +
          ' ' +
          item.apellido_materno
        ).toUpperCase();
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

  const handleVisiblePopupCancel = itemCita => {
    setSolicitudBody({
      asegurado_label: '',
      tipo_label: '',
      fecha: '',
      horario: '',
      idSolicitud: itemCita.id_solicitud,
    });
    // setIsVisiblePopupCancel(true);
    setIsVisiblePopup(true);
  };

  const ItemView = ({item}) => {
    // const fechaTemp = new Date();
    // const fechaInicio = convertDateDDMMYYYY('2022-01-20 22:37:18.147');

    return (
      <View style={[styles.card, css.designElevationCardiOS]}>
        <View
          style={{paddingLeft: 10, backgroundColor: 'transparent', flex: 1, marginBottom:10}}>
          <View style={{padding: 7}}>
            <View style={styles.cardSection}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{fontWeight:'bold', color:css.colors.primary_opaque}} >Estado:</Text>
                <Text style={{fontWeight:'bold', color: 'black',  marginLeft: 5,textTransform: 'capitalize'}}>
                {item.EstadoSolicitudDescripcion}
                </Text>
              </View>
            </View>
            <View style={styles.cardSection}>
              <Text>Tipo:</Text>
              <Text style={styles.cardSectionText}>
              {item.tipoSolicitud}
              </Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Asegurado:</Text>
              <Text style={styles.cardSectionText}>
                {item.nombres} {item.apellido_paterno} {item.apellido_materno}
              </Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Parentesco:</Text>
              <Text style={styles.cardSectionText}>{item.parentesco}</Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Fecha de registro:</Text>
              <Text style={styles.cardSectionText}>
                {item.fecha_inclusion.substring(0, 10)}
              </Text>
            </View>
          </View>
        </View>
        {item.estado_solicitud == "PE" && (
          <Button
            onPress={() => handleVisiblePopupCancel(item)}
            title="Cancelar"
            buttonStyle={{
              backgroundColor: css.colors.primary_opaque,
              borderColor: 'rgba(0,0,0,0.5)',
              borderBottomEndRadius: 10,
              borderBottomStartRadius: 10,
              // marginTop: 10,
              width: '100%',
              shadowOpacity: 0.39,
              shadowRadius: 13.97,
              ...Platform.select({
                android: {
                  elevation: 16,
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
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      {isVisiblePopup && (
        <BottomSheetScreen
          isVisiblePopup={isVisiblePopup}
          setIsVisiblePopup={setIsVisiblePopup}
          navigation={{}}
          route={route}
          citaBody={solicitudBody}
          type={'cancelSolicitudInclusion'}
          refreshFetching={refreshFetching}
          setRefreshFetching={setRefreshFetching}
        />
      )}
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        {typeof masterDataSource === 'string' ? (
          <AuthLoadingScreen />
        ) : (
          <>
            {masterDataSource.length === 0 ? (
              <DataNotFound message="No se encontraron solicitudes" />
            ) : (
              <>
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
                        marginTop: 15,
                      },
                    }),
                  }}>
                  <SearchBar
                    containerStyle={{
                      backgroundColor: '#FFF',
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
                    inputContainerStyle={styles.estiloBarraBusqueda}
                    onChangeText={text => searchFilterFunction(text)}
                    onClear={() => searchFilterFunction('')}
                    placeholder="Asegurado"
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
              </>
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
        //display: 'none',
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
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    borderColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.39,
    shadowRadius: 13.97,
    elevation: 11,
   
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 15,
    borderWidth: 0,
    marginBottom: 14,
    borderColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.39,
    shadowRadius: 13.97,
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
  cardSection: {
    flexDirection: 'row',
    margin: 3,
    height: 24,
    alignItems: 'center',
  },
  cardSectionText: {
    color: 'rgba(166, 166, 172, 1)',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  cardIconDetails: {
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderRadius: Dimensions.get('window').width / 2,
  },
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
  labelTipoExclusion: {
    fontWeight: 'bold',
    marginLeft: 0,
    color: css.colors.primary_opaque,
  },
  labelTipoInclusion: {
    fontWeight: 'bold',
    marginLeft: 0,
    color: 'green',
  },
});

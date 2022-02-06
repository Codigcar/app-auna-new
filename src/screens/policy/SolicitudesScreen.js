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
import {ButtonInitial} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import {fetchWithToken} from '../../utils/fetchCustom';
import SolicitudesPopupCancelScreen from './SolicitudesPopupCancelScreen';

export default function SolicitudesScreen({navigation, route}) {
  console.log('[SolicitudesScreen]');

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
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [isVisiblePopupCancel, setIsVisiblePopupCancel] = useState(false);
  const [solicitudBody, setSolicitudBody] = useState({});

  useEffect(() => {
    // console.log(
    //   '2 ConsoleLog - IDPOLIZA: ' +
    //     JSON.stringify(route.params.policy.idPoliza),
    // );
    // fetch(Constant.URI.PATH80 + Constant.URI.GET_SOLICITADUS_INCLUSION, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': route.params.userRoot.Token
    //   },
    //   body: JSON.stringify({
    //     "I_Sistema_IdSistema": route.params.userRoot.idSistema,
    //     "I_UsuarioExterno_IdUsuarioExterno": route.params.userRoot.idUsuarioExterno,
    //   })

    dataListSolicitudes();
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   setFilteredDataSource(responseJson);
    //   setMasterDataSource(responseJson);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }, []);

  const dataListSolicitudes = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
    });
    try {
      const response = await fetchWithToken(
        Constant.URI.GET_LISTAR_SOLICITUDES_INCLUSION,
        'POST',
        params,
        route.params.userRoot.Token,
      );

      // console.log(
      //   '3 ConsoleLog - SOLICITUD/DEPENDIENTES response: ' +
      //     JSON.stringify(response),
      // );
      if (response.CodigoMensaje == 100) {
        // console.log('CodigoMensaje ==== 10000000000000000');
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
        //const itemData = item.nombreAsegurado ? item.nombreAsegurado.toUpperCase() : ''.toUpperCase();
        const itemData = (
          item.apellidoPaternoAsegurado +
          ' ' +
          item.apellidoMaternoAsegurado +
          ' ' +
          item.nombreAsegurado
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
      asegurado_label: itemCita.Asegurado,
      tipo_label: itemCita.tipo,
      fecha: itemCita.fechaRegistro,
      horario: itemCita.fechaRegistro,
      idSolicitud: itemCita.idSolicitud,
    });
    setIsVisiblePopupCancel(true);
  };

  const ItemView = ({item}) => {
    // const fechaTemp = new Date();
    // const fechaInicio = convertDateDDMMYYYY('2022-01-20 22:37:18.147');

    return (
      // Flat List Item
      <View style={[styles.card, css.designElevationCardiOS]}>
        <View
          style={{paddingLeft: 10, backgroundColor: 'transparent', flex: 1}}>
          <View style={{padding: 7}}>
            <View style={styles.cardSection}>
              {item.tipo === '0' ? (
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginLeft: 0,
                    color: css.colors.primary_opaque,
                    textTransform: 'uppercase',
                  }}>
                  Solicitud Inclusión
                </Text>
              ) : (
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginLeft: 0,
                    color: css.colors.primary_opaque,
                    textTransform: 'uppercase',
                  }}>
                  Solicitud Exclusión
                </Text>
              )}
            </View>
            <View style={styles.cardSection}>
              <Text>Asegurado</Text>
              <Text style={styles.cardSectionText}>{item.Asegurado}</Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Parentesco</Text>
              <Text style={styles.cardSectionText}>{item.parentesco}</Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Estado</Text>
              <Text style={styles.cardSectionText}>{item.estado}</Text>
            </View>
            {item.observacion.length > 0 && (
              <View style={styles.cardSection}>
                <Text>Observación</Text>
                <Text style={styles.cardSectionText}>{item.observacion}</Text>
              </View>
            )}
            <View style={styles.cardSection}>
              <Text>Fecha de registro</Text>
              <Text style={styles.cardSectionText}>{item.fechaRegistro}</Text>
            </View>
          </View>
        </View>
        <Button
          onPress={() => handleVisiblePopupCancel(item)}
          title="Cancelar"
          buttonStyle={{
            backgroundColor: css.colors.primary_opaque,
            borderColor: 'rgba(0,0,0,0.5)',
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
            // height: 30,
            marginTop: 10,
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <SolicitudesPopupCancelScreen
        isVisiblePopupCancel={isVisiblePopupCancel}
        setIsVisiblePopupCancel={setIsVisiblePopupCancel}
        navigation={{}}
        route={route}
        citaBody={solicitudBody}
      />
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
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
                marginTop:15
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
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
        />
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
    // ...Platform.select({
    //   android: {
    //     elevation: 11,
    //   },
    //   default: {
    //     shadowColor: 'rgba(0,0,0, .2)',
    //     shadowOffset: { height: 0, width: 0 },
    //     shadowOpacity: 1,
    //     shadowRadius: 1,
    //   },
    // }),
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
});

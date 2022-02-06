import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, SearchBar, Icon} from 'react-native-elements';
import {ButtonInitial} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';


export default function DependientesScreen({navigation, route}) {
  console.log('[ASEGURADOS/DEPENDIENTES] ');
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Dependientes',
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

  useEffect(() => {
    // console.log(
    //   '2 ConsoleLog - IDPOLIZA: ' +
    //     JSON.stringify(route.params.policy.idPoliza),
    // );
    fetch(Constant.URI.PATH + Constant.URI.GET_ASEGURADOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: route.params.userRoot.Token,
      },
      body: JSON.stringify({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
        I_Poliza_IdPoliza: route.params.policy.idPoliza,
        I_PersonaAsegurada_NombreCompleto: search,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(
        //   '3 ConsoleLog - ASEGURADOS/DEPENDIENTES response: ' +
        //     JSON.stringify(responseJson),
        // );
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
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

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <View style={[styles.card, css.designElevationCardiOS]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{paddingLeft: 10}}>
            <View style={styles.cardSection}>
              <Text style={{fontWeight: 'bold'}}>Asegurado</Text>
              <Text style={{fontWeight: 'bold', marginLeft: 8, color: 'black'}}>
                {item.apellidoPaternoAsegurado} {item.apellidoMaternoAsegurado}{' '}
                {item.nombreAsegurado}
              </Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Parentesco</Text>
              <Text style={styles.cardSectionText}>
                {item.nombreTipoDependiente}
              </Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Edad</Text>
              <Text style={styles.cardSectionText}>{item.edadAsegurado}</Text>
            </View>
            <View style={styles.cardSection}>
              <Text>Fecha de inclusión</Text>
              <Text style={styles.cardSectionText}>{item.fechaInclusion}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const openURL = (url, appname) => {
    if (url) {
      Linking.openURL(url)
        .then()
        .catch(() => {
          Alert.alert(
            'Error',
            'No tiene la aplicación ' + appname + ' instalada.',
          );
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <View style={{flex: 1}}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={styles.estiloBusquedaCobertor_iPhone}>
            <SearchBar
              containerStyle={{
                backgroundColor: '#FFF',
                borderTopColor: '#FFF',
                borderBottomColor: '#FFF',
              }}
              inputContainerStyle={styles.estiloBarraBusqueda}
              onChangeText={text => searchFilterFunction(text)}
              onClear={() => searchFilterFunction('')}
              placeholder="Asegurado"
              value={search}></SearchBar>
          </View>
          <View style={{backgroundColor: 'transparent'}}>
            <Button
              onPress={() => openURL('https://zonasegura.laprotectora.com.pe/')}
              title="Inclusión"
              buttonStyle={{
                backgroundColor: '#ff0000',
                borderColor: 'rgba(0,0,0,0.5)',
                borderRadius: 10,
                marginBottom: 0,
                width: 100,
                marginTop: 10,
                shadowOpacity: 0.39,
                shadowRadius: 13.97,
                height: 50,
                marginRight: 16,
                ...Platform.select({
                  android: {
                    elevation: 6,
                  },
                  default: {
                    shadowColor: 'rgba(0,0,0, .2)',
                    shadowOffset: {height: 0, width: 0},
                    shadowOpacity: 1,
                    shadowRadius: 1,
                  },
                }),
              }}
              titleStyle={{color: '#FFF', fontSize: 16}}></Button>
          </View>
        </View>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}></FlatList>
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
    // width:'100%',
    flex: 1,
    marginBottom: 5,
    ...Platform.select({
      android: {
        elevation: 0,
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
    marginLeft: 5,
    // marginRight: 15,
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
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    borderWidth: 0,
    margin: 15,
    marginBottom: 14,
    padding: 7,
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

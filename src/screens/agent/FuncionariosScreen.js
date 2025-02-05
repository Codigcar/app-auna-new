import { createStackNavigator } from '@react-navigation/stack';
import qs from 'qs' ;
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Linking, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { ButtonInitial } from '../../components';
import DataScreen from '../../screens/DataScreen';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';

console.log('FuncionariosScreen'); 

export default function FuncionariosScreen({ navigation, route }) {
  console.log('[Stack-FuncionariosScreen]');
  useLayoutEffect(() => {
    navigation.setOptions({
        title: 'Funcionarios',
        headerTitleStyle: css.titleScreen,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerRight: () => (
          //Botón Rojo parte superior
          <ButtonInitial
              navigation={navigation}
              nombre={route.params.userRoot.nombre}
              apellido={route.params.userRoot.apellidoPaterno}
              //dataScreen={'FuncDatosPersonales'} //Llama al Stack.Screen
          /> 
      ),
    });
  }, [navigation]);

  return (
    <Stack.Navigator >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userRoot: route.params.userRoot }}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
          headerShown: false
        }} /> 
        <Stack.Screen 
          name="FuncDatosPersonales"
          component={DataScreen}
          initialParams={{ userRoot: route.params.userRoot }}
        />
    </Stack.Navigator>
  );
  

}

function HomeScreen({ navigation, route }) {
  console.log('[FuncionariosScreen]');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (items.length === 0) {
      fetch(Constant.URI.PATH + Constant.URI.GET_FUNCIONARIOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        },
        body: JSON.stringify({
          "I_Sistema_IdSistema": route.params.userRoot.idSistema,
        })
      })
        .then((response) => response.json())
        .then((response) => {

          console.log('Funcionarios response: ' + JSON.stringify(response));

          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            setItems(response);
          }
        })
        .catch((error) => console.error(error));
    }
  });

  const sendWhatsapp = cellphone => {
    let countryCode = '+51';
    let message = '';
    Linking.openURL('whatsapp://send?text=' + message + '&phone=' + countryCode + cellphone).then().catch(() => {
      Alert.alert('Error', 'No tiene la aplicación WhatsApp instalada.');
    });
  }

  const callPhone = cellphone => {
    let url = '';
    let postalCode = '01';
    
    if(cellphone[0] == '9')
    {
        postalCode='';
    }
        
    if (Platform.OS === 'android') {
        url = `tel:${postalCode}${cellphone}`;
    } else {
        url = `telprompt:${postalCode}${cellphone}`;
    }
    Linking.openURL(url).then().catch(() => {
        Alert.alert('Error', 'No se pudo abrir la aplicación.');
    });
}

  const sendEmail = email => {
    let url = `mailto:${email}`;
    let subject = '';
    let body = '';

    const query = qs.stringify({
      subject: subject,
      body: body
    });

    if (query.length) {
      url += `?${query}`;
    }

    Linking.openURL(url).then().catch(() => {
      Alert.alert('Error', 'No tiene instalada ninguna aplicación de correo electrónico.');
    });
  }

  return (
    <SafeAreaView style={css.screen}>
      {items.length === 0
        ? <AuthLoadingScreen />
        :
        <FlatList
          data={items}
          keyExtractor={(item, index) => String.valueOf(item.idFuncionarioExternoPotencial) + `${index}`}
          renderItem={({ item }) =>
            <View style={styles.card}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ paddingLeft: 10 }}>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>{item.nombres} {item.apellidoPaterno} {item.apellidoMaterno}</Text>
                  <Text style={{ fontSize: 12, color: css.colors.opaque, marginBottom: 3, ...Platform.select({ios:{marginTop: 2}, android:{marginTop: 0}}) }}>{item.cargo}</Text>
                  
                  <View style={styles.cardSection}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={() => callPhone(item.telefonoMovil)} activeOpacity={0.7}>
                      <Icon rounded name='phone' type='material-community' color= {"#000"} size={12} iconStyle={styles.cardIconDetails}  />
                      <Text style={styles.cardSectionText}>{item.telefonoMovil}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardSection} display= {(item.ocultarTelefonoFijo == 1) ? "none" : "flex"}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={() => callPhone(item.telefonoFijo)} activeOpacity={0.7}>
                      <Icon rounded name='phone-classic' type='material-community' color= {"#000"} size={12} iconStyle={styles.cardIconDetails}  />
                      <Text style={styles.cardSectionText}>{item.telefonoFijo} {item.anexoTelefonoFijo != "" ? " -  anexo " + item.anexoTelefonoFijo : null}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.cardSection}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={() => sendEmail(item.correoElectronico)} activeOpacity={0.7}>
                      <Icon rounded name='email' type='material-community' color= {"#000"} size={12} iconStyle={styles.cardIconDetails}  />
                      <Text style={styles.cardSectionText}>{item.correoElectronico}</Text>
                    </TouchableOpacity>
                  </View>
                  
                </View>
              </View>

              <Divider style={styles.divider} />

            </View>
          }
        />
      }
    </ SafeAreaView>
  );


}

const Stack = createStackNavigator();
const styles = StyleSheet.create({
  headerContainer: {
    borderTopWidth: 0,
    height: 65, //Disminuir el tamaño para dejar ver la franja roja superior
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 0,
    marginTop: 8, //Empuja hacia abajo el divider
    
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 0,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    })
  },
  /*headerTitle: {
    fontSize: 26
  },*/
  textHeader: {
    fontSize: 18,
    fontWeight: "bold"
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 15,
    padding: 7,
    borderWidth: 0,
    marginBottom: 14,
    borderColor: "rgba(0, 0, 0, 0.14)",
    shadowOpacity: 0.39,
    shadowRadius: 13.97,
    ...Platform.select({
      android: {
        elevation: 11,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  cardSection: {
    flexDirection: "row",
    margin: 3,
    height: 24,
    alignItems: "center"
  },
  cardSectionText: {
    color: "rgba(166, 166, 172, 1)",
    marginLeft: 5
  },
  cardIconDetails: {
    borderWidth: 1,
    borderColor: css.colors.opaque,
    padding: 3,
    borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:10}),
    textAlignVertical:"center",
    textAlign:"center", 
  },
  divider: {
    backgroundColor: css.colors.opaque,
    padding: 0.2,
    margin: 2
  },
});

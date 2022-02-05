import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, FlatList, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonInitial } from '../../components';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';


export default function PolicyRiskGroupScreen({ navigation, route }) {
  console.log('[PolicyRiskGroupScreen]');
  
  // console.log('PolicyRiskGroupScreen:********** ', route);
  const [items, setItems] = useState([]);
  const [poliza, setPoliza] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pólizas',
      headerTitleStyle: css.titleScreen,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerRight: () => (
        <ButtonInitial
          navigation={navigation}
          nombre={route.params.userRoot.nombre}
          apellido={route.params.userRoot.apellidoPaterno}
        />
      )
    });
  }, [navigation]);

  useEffect(() => {
    if (items.length === 0)
    {
      fetch(Constant.URI.PATH + Constant.URI.POLIZA_POR_GRUPO_RIESGO_LISTAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        },
        body: JSON.stringify({
          "I_Sistema_IdSistema": route.params.userRoot.idSistema,
          "I_UsuarioExterno_IdUsuarioExterno": route.params.userRoot.idUsuarioExterno,
          "I_GrupoRiesgo_idGrupoRiesgo": route.params.riskGroup.idGrupoRiesgo
        }) 
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log('PolizaPorGrupoRiesgoListar: ' + JSON.stringify(response));
          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            setItems(response.Result);
          }
        })
        .catch((error) => console.error(error));

      //*********************** */

      fetch(Constant.URI.PATH + Constant.URI.GESTOR_VISUAL_POLIZA_OBTENER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        },
        body: JSON.stringify({
          "I_Sistema_IdSistema": route.params.userRoot.idSistema,
          "I_UsuarioExterno_IdUsuarioExterno": route.params.userRoot.idUsuarioExterno,
          "I_GrupoRiesgo_idGrupoRiesgo": route.params.riskGroup.idGrupoRiesgo
        }) 
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log('GestorVisualPolizaObtener: ' + JSON.stringify(response.Result));
          
          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            //console.log('nombreTitulo: ' + response.Result[0].nombreTitulo);
            setPoliza(response.Result[0].nombreTitulo);
          }
        })
        .catch((error) => console.error(error));


    }

    //fetch
  });

  
  //LLAMADA A TELEFONO
  const llamarTelefono = cellphone => {
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
  // FIN LLAMADA A TELEFONO
    

  return (
    <SafeAreaView style={css.screen}>
      <View>
        <View style={styles.headerContainer}>
          <View>
            <Image
              style={styles.headerImage}
              source={{ uri: route.params.riskGroup.rutaImagenGrupoRiesgo }}
              PlaceholderContent={<AuthLoadingScreen />} />
          </View>
          <View style={styles.headerSubContainer}>
            <Text style={styles.headerTitle}>{poliza}</Text>
            <Text style={styles.headerSubTitle}>Selecciona la póliza que deseas revisar</Text>
          </View>
        </View>
        <Divider style={StyleSheet.flatten([css.dividerTitleLineRed, { marginLeft: 105 }])} />
      </View>
      {items.length === 0
        ? <AuthLoadingScreen />
        :
        <FlatList
          style={{ backgroundColor: "#FFF" }}
          data={items}
          keyExtractor={(item, index) => String.valueOf(item.idPoliza) + `${index}`}
          renderItem={({ item }) =>
            <ScrollView>
              <TouchableOpacity
                style={styles.card} 
                //onPress={() => navigation.navigate('PolicyDetailScreen', { policy: item })}
                onPress={() => 
                      (route.params.riskGroup.idGrupoRiesgo == Constant.GLOBAL.CONSTANTE_idGrupoRiesgo && item.mostrarClinica == 1) ? navigation.navigate('PolicyDetailScreen',{policy:item})    
                    : (route.params.riskGroup.idGrupoRiesgo != Constant.GLOBAL.CONSTANTE_idGrupoRiesgo && item.mostrarClinica == 1) ? navigation.navigate('PolicyDetailScreen2',{policy:item}) 
                    : (route.params.riskGroup.idGrupoRiesgo == Constant.GLOBAL.CONSTANTE_idGrupoRiesgo && item.mostrarClinica == 0) ? navigation.navigate('PolicyDetailScreen3',{policy:item}) 
                    : navigation.navigate('PolicyDetailScreen4', { policy: item }) 
                        }>
                <View style={styles.viewSlot}>
                  <Text style={styles.itemPoliza}>N° Póliza:  {item.numeroPoliza}</Text>
                  <Text style={styles.itemPoliza}>ver detalle  <Icon name="ios-arrow-forward" size={18} /></Text>   
                </View>
                <Divider style={{ backgroundColor: css.colors.opaque }} />
                <View style={styles.viewSlot}>
                  <View style={{ alignItems:"center", flexDirection: "row", width: 200, ...Platform.select({ ios:{marginRight:3}, android:{marginRight:-8} }) }}>
                    <Text style={{ color: '#FF0000', fontSize:13, fontWeight: "bold" }}>{item.nombreCortoAseguradora}</Text>
                    <Text style={[ {
                      marginLeft: 10,
                      paddingLeft: 5, 
                      paddingRight: 5, 
                      borderRadius: 3 
                    }, item.idEstado === 1 ? styles.stateActive : styles.stateExpire ]}> {item.nombreEstadoPoliza} </Text>
                  </View>
                  <Text adjustsFontSizeToFit={true} minimumFontScale={0.6} numberOfLines={5} style={{ color: css.colors.opaque, flex:1,  marginLeft:30, marginRight:-7 , maxHeight:30, textAlignVertical:"center", textAlign:"center" }}>{item.nombreRiesgo}</Text>
                </View>
                <View style={styles.viewSlot} display= {(item.mostrarPlanAsegurado == 1) ? "flex" : "none"}>
                  <Text style={styles.itemPoliza}>
                    Plan: {item.nombrePlanAsegurado} 
                  </Text>
                </View>
                <View style={styles.viewSlot} >
                  <Text style={styles.itemPoliza}>
                    Razón Social: {item.razonSocial} 
                  </Text>
                </View>
                <Divider style={{ backgroundColor: css.colors.opaque }} />

                <View style={{ alignContent:"space-between", flexDirection: "row" }}>
                  
                  <View style={{ margin: 5, padding: 2, flexDirection: "row",  backgroundColor: "#FFF", width:"67%" }}>
                    <MaterialCommunityIcons name="face" size={16} color={css.colors.opaque} />
                    <Text style={{ marginLeft: 5, color: '#C0C0C0' }}> {item.nombresFuncionarioInterno}</Text>
                  </View>
                 
                  <TouchableOpacity onPress={() => llamarTelefono(item.telefonoMovilFuncionarioInterno)} style={{ width:"30%"}} >
                    <View style={{alignSelf:"flex-end", flexDirection: "row", margin: 5, padding: 2}}>
                        <MaterialCommunityIcons name="phone" size={16} color={css.colors.opaque} />
                        <Text style={{ marginLeft: 3, color: '#C0C0C0' }}> {item.telefonoMovilFuncionarioInterno}</Text>
                    </View>
                  </TouchableOpacity>
                  
                </View>
                
              </TouchableOpacity>
            </ScrollView>
          }
        />
      }
    </ SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopColor: "#FF0000",
    borderTopWidth: 2,
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    })
  },
  headerSubContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 5,
    width: Dimensions.get('window').width - 110
  },
  headerImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    margin: 10,
    borderRadius: Dimensions.get('window').width / 2
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },
  headerSubTitle: {
    fontSize: 14,
    color: css.colors.opaque
  },
  itemPoliza: {
    fontSize: 14,
    color: css.colors.opaque,
    fontWeight: "bold"
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 10,
    padding: 7,
    borderWidth: 1,
    marginBottom: 0,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  viewSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    padding: 2
  },
  stateActive: {
    backgroundColor: '#4BDEA8',
    color: '#FFF'
  },
  stateExpire: {
    backgroundColor: '#FABB5E',

  }
});
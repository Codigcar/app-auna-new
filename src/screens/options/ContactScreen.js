import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Icon } from 'react-native-elements';
import { ButtonInitial } from '../../components';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import qs from 'qs';
import DataScreen from '../../screens/DataScreen';
import { createStackNavigator } from '@react-navigation/stack';

console.log('ContactScreen');

export default function ContactScreen({ navigation, route }) {
  console.log('[Stack-ContactScreen]');
  useLayoutEffect(() => {
    navigation.setOptions({
        title: 'Central de Ayuda',
        headerTitleStyle: css.titleScreen,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerRight: () => (
          //Botón Rojo parte superior
          <ButtonInitial
              navigation={navigation}
              nombre={route.params.userRoot.nombre}
              apellido={route.params.userRoot.apellidoPaterno}
              dataScreen={'ContactsDatosPersonales'} //Llama al Stack.Screen
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
          headerStyle:styles.cardHeader, //Contenedor con línea roja en la parte superior
          headerBackTitleVisible: false,
          headerTitle: null,
          headerShown: false
        }} /> 
        <Stack.Screen 
          name="ContactsDatosPersonales"
          component={DataScreen}
          initialParams={{ userRoot: route.params.userRoot }}
        />
    </Stack.Navigator>
  );
  
}

function HomeScreen({ navigation, route }) {
    console.log('[ContactScreen]');
    const [items, setItems] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Contacto',
            headerTitleStyle: css.titleScreen,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
        });
    }, [navigation]);

    useEffect(() => {

        console.log('ContactScreen items: ' + JSON.stringify(items));

        if (items == null /*&& items.length === 0*/) {

            fetch(Constant.URI.PATH + Constant.URI.GESTOR_VISUAL_COMUNICACION_LISTAR +  '?I_Sistema_IdSistema='+route.params.userRoot.idSistema +
                                                                                        '&I_CategoriaMensajeria_IdCategoriaMensajeria='+Constant.GLOBAL.ID_CATEGORIA_MENSAJERIA, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': route.params.userRoot.Token
                }
            })
                .then((response) => response.json())
                .then((response) => {

                    //console.log('ContactScreen response: ' + JSON.stringify(response));
                    console.log('ContactScreen response.Result: ' + JSON.stringify(response.Result));

                    if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
                        Alert.alert('Error', response.RespuestaMensaje);
                    } else {
                        setItems(response.Result);
                    }
                })
                .catch((error) => console.error(error));
        }
    });

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

    const sendWhatsapp = cellphone => {
        let countryCode = '+51';
        let message = '';
        Linking.openURL('whatsapp://send?text=' + message + '&phone=' + countryCode + cellphone).then().catch(() => {
            Alert.alert('Error', 'No tiene la aplicación WhatsApp instalada.');
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

    /*if (!item) {
        return (
            <AuthLoadingScreen />
        );
    }*/
    return (
        <SafeAreaView style={css.screen}>

        {items == null //items.length === 0
        ? <AuthLoadingScreen />
        :

            <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                <View style={styles.cardHeader} >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={styles.textHeader}>Central de Ayuda</Text>
                        </View>
                        <View>
                            <Image
                                style={{ width: 120, height: 30, marginRight: 10 }}
                                source={Constant.GLOBAL.IMAGES.TITLE_LOGO}>
                            </Image>
                        </View>
                    </View>
                </View>
                <Divider style={css.dividerTitleLineRed} />


                <ScrollView>
                    <View>
                        <View style={styles.cardImageContainer}>
                            <Image
                                style={styles.cardImage}
                                source={Constant.GLOBAL.IMAGES.CONTACT_CONTACT}>
                            </Image>
                        </View>
                        <View>



                        <FlatList
                            data={items}
                            keyExtractor={(item, index) => String.valueOf(item.EnunciadoComunicacion) + `${index}`}
                            renderItem={({ item }) =>


                            <View>
                                <View style={item.usaRotuloHerramientaComunicacion==true?styles.cardCellTitle : {display:'none'}}>
                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.usaRotuloHerramientaComunicacion==true?item.rotuloHerramientaComunicacion:''}</Text>
                                </View>

                                <View style={styles.cardContactDetail}>
                                    <View style={styles.cardCellphoneText}>
                                        <Text style={{ fontSize: 16, fontWeight: "normal" }}>{item.usaSubRotuloHerramientaComunicacion==true?item.subRotuloHerramientaComunicacion:''} {item.EnunciadoComunicacion} {item.existeAmbosEnunciadosComunicacion==1?item.subEnunciadoComunicacion:''}</Text>
                                    </View>
                                    
                                    <Divider style={{ backgroundColor: css.colors.opaque, borderWidth: (item.idTipoComunicacion!=Constant.CONTACTO_TIPO_COMUNICACION_ICONO.OTRAS) ? 0.2 : 0, height: 55}} />
                                    

                                    <View style={styles.cardAvatar}>
                                        <View style={{ flexDirection: "row", justifyContent: item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.MOVILES ? "space-between" : "flex-end", paddingLeft: 5, width: 110 }}>
                                            <TouchableOpacity
                                                onPress={() => item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.CORREO ? sendEmail(item.EnunciadoComunicacion) : callPhone(item.EnunciadoComunicacion)} 
                                                activeOpacity={0.7}>
                                                <Icon rounded name={item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.CORREO?'email':item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.TELEFONO_FIJO?'phone':'cellphone-iphone'} 
                                                                    type='material-community' color= {"#000"} size={22} 
                                                                    iconStyle={{textAlignVertical:"center", textAlign:"center", borderColor:css.colors.opaque, display: item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.OTRAS? "none" : "flex",
                                                                                borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:22}), borderWidth: 1, padding:9}}  
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity  
                                                onPress={() => sendWhatsapp(item.EnunciadoComunicacion)} 
                                                activeOpacity={0.7}>
                                                <Icon name='whatsapp' type='font-awesome' color='#2CD44A' size={43} display= {(item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.MOVILES) ? "flex" : "none"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                            </View>

                        }
                        />
                           
                        </View>
                    </View>
                </ScrollView>

            </View>
       
      }
    </ SafeAreaView>
    );
}


/*

<View style={styles.cardContactDetail}>
    <View style={styles.cardCellphoneText}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.usaRotuloHerramientaComunicacion==true?item.rotuloHerramientaComunicacion:''}</Text>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>{item.usaSubRotuloHerramientaComunicacion==true?item.subRotuloHerramientaComunicacion:''} {item.EnunciadoComunicacion} {item.existeAmbosEnunciadosComunicacion==1?item.subEnunciadoComunicacion:''}</Text>
    </View>
    <Divider style={styles.divider} />
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, width: 110 }}>
        <TouchableOpacity
            activeOpacity={0.7}>
            <Icon rounded name={item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.CORREO?'email':item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.TELEFONO_FIJO?'phone':'cellphone-iphone'} type='material-community' color= {"#000"} size={22} iconStyle={{textAlignVertical:"center", textAlign:"center", borderColor:css.colors.opaque, borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:22}), borderWidth: 1, padding:9}}  />
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => sendWhatsapp(item.EnunciadoComunicacion)} activeOpacity={0.7}>
            <Icon name='whatsapp' type='font-awesome' color='#2CD44A' size={43} display= {(item.idTipoComunicacion==Constant.CONTACTO_TIPO_COMUNICACION_ICONO.MOVILES) ? "flex" : "none"} />
        </TouchableOpacity>
    </View>
</View>

*/



/*
<FlatList
          data={items}
          keyExtractor={(item, index) => String.valueOf(item.EnunciadoComunicacion) + `${index}`}
          renderItem={({ item }) =>

          }
        />

*/



const Stack = createStackNavigator();


const styles = StyleSheet.create({
    cardHeader: {
        backgroundColor: "#FFF",
        borderTopColor: "#FF0000",
        borderTopWidth: 2,
        height: 70,
        paddingLeft: 20,
        justifyContent: "center",
        marginBottom: 0,
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
    textHeader: {
        fontSize: 18,
        fontWeight: "bold"
    },
    cardImageContainer: {
        backgroundColor: 'white',
        borderWidth: 0,
        margin: 15,
        borderRadius: 20,
        ...Platform.select({
            android: {
                elevation: 1,
            },
            default: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
        }),
    },
    cardImage: {
        width: null,
        height: 150,
        borderRadius: 20
    },
    cardContactDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingRight: 20,
        backgroundColor: 'white',
        margin: 10,
        marginTop: 5,
        borderColor: css.colors.opaque,
        borderWidth: .1,
        borderRadius: 10,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            default: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
        }),
    },
    divider: {
        backgroundColor: css.colors.opaque,
        borderWidth: 0.2,
        height: 55
    },
    cardAvatar: {
        width: 110,
        alignItems: "flex-end",
        
    },
    cardCellTitle: {
        width: '100%',
        paddingLeft: 20,
        //display: 'none'
    },
    cardCellphoneText: {
        width: 210,
    }
});
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Dimensions, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { ButtonInitial } from '../../components';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import qs from 'qs';
import DataScreen from '../../screens/DataScreen';
import { createStackNavigator } from '@react-navigation/stack';

console.log('ContactScreen');

export default function ContactScreen({ navigation, route }) {

  useLayoutEffect(() => {
    navigation.setOptions({
        title: 'Contactos',
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

    const [item, setItem] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Contacto',
            headerTitleStyle: css.titleScreen,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
        });
    }, [navigation]);

    useEffect(() => {

        console.log('ContactScreen item: ' + JSON.stringify(item));

        if (!item) {
            fetch(Constant.URI.PATH + Constant.URI.GET_CONTACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': route.params.userRoot.Token
                },
                body: JSON.stringify({
                    "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                    "I_CategoriaMensajeria_IdCategoriaMensajeria": 1,
                })
            })
                .then((response) => response.json())
                .then((response) => {

                    console.log('ContactScreen response: ' + JSON.stringify(response));

                    if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
                        Alert.alert('Error', response.RespuestaMensaje);
                    } else {
                        setItem(response[0]);
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

    if (!item) {
        return (
            <AuthLoadingScreen />
        );
    }
    return (
        <SafeAreaView style={css.screen}>
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
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>+01 {item.telefonoFijo}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.cardAvatar}>
                                <TouchableOpacity
                                    onPress={() => callPhone(item.telefonoFijo)} 
                                    activeOpacity={0.7}>
                                    <Icon rounded name='phone' type='material-community' color= {"#000"} size={22} iconStyle={{textAlignVertical:"center", textAlign:"center", borderColor:css.colors.opaque, borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:22}), borderWidth: 1, padding:9}}  />
                                </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>+51 {item.telefonoMovil}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.cardAvatar}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, width: 110 }}>
                                        <TouchableOpacity
                                            onPress={() => callPhone(item.telefonoMovil)} 
                                            activeOpacity={0.7}>
                                            <Icon rounded name='cellphone-iphone' type='material-community' color= {"#000"} size={22} iconStyle={{textAlignVertical:"center", textAlign:"center", borderColor:css.colors.opaque, borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:22}), borderWidth: 1, padding:9}}  />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => sendWhatsapp(item.telefonoMovil)} activeOpacity={0.7}>
                                        <Icon name='whatsapp' type='material-community' color='#2CD44A' size={43} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>+51 {item.telefonoMovilSecundario}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.cardAvatar}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, width: 110 }}>
                                        <TouchableOpacity
                                            onPress={() => callPhone(item.telefonoMovilSecundario)} 
                                            activeOpacity={0.7}>
                                            <Icon rounded name='cellphone-iphone' type='material-community' color= {"#000"} size={22} iconStyle={{textAlignVertical:"center", textAlign:"center", borderColor:css.colors.opaque, borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:22}), borderWidth: 1, padding:9}}  />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => sendWhatsapp(item.telefonoMovilSecundario)} activeOpacity={0.7}>
                                            <Icon name='whatsapp' type='font-awesome' color='#2CD44A' size={43} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>{item.correoElectronico}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.cardAvatar}>
                                <TouchableOpacity
                                            onPress={() => sendEmail(item.correoElectronico)} 
                                            activeOpacity={0.7}>
                                            <Icon rounded name='email' type='material-community' color= {"#000"} size={22} iconStyle={{textAlignVertical:"center", textAlign:"center", borderColor:css.colors.opaque, borderRadius: Platform.select({android: Dimensions.get('window').width / 2, default:22}), borderWidth: 1, padding:9}}  />
                                </TouchableOpacity>
                                </View>
                            </View >
                            <View style={{ height: 80, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color: css.colors.opaque }}>Estamos aquí para ayudarte</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

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
        alignItems: "flex-end"
    },
    cardCellphoneText: {
        width: 210
    }
});
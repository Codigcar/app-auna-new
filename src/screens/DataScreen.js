import { createStackNavigator } from '@react-navigation/stack';
import { Collapse, CollapseBody, CollapseHeader } from "accordion-collapse-react-native";
import { validateAll } from 'indicative/validator';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import 'react-native-gesture-handler';
import Constant from '../utils/constants';
import { css } from '../utils/css';

const Stack = createStackNavigator();

export default function DataScreen({ navigation, route }) {
  console.log(['Stack-DatosPersonalesScreen']);
  
  useLayoutEffect(() => {
    navigation.setOptions({
        title: 'Datos Personales',
        headerTitleStyle: css.titleScreen,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false
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
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation, route }) {
  console.log(['DatosPersonalesScreen']);

  const [SignUpErrors, setSignUpErrors] = useState({});
  const [cellphone, setCellphone] = useState(route.params.userRoot.telefonoMovil);
  const [email, setEmail] = useState(route.params.userRoot.correoElectronico);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userUpdated, setUserUpdate] = useState(true);
  const [passUpdated, setPassUpdate] = useState(true);

  const handleSignIn = () => {
    const rules = {
      email: 'required|email',
      cellphone: 'required|min:7|max:9',
    };

    const data = {
      email: email,
      cellphone: cellphone,
    };

    if (oldPassword.length > 0) {
      rules.oldPassword = 'required|string|min:5|max:10';
      rules.password = 'required|string|min:5|max:10';
      data.oldPassword = oldPassword;
      data.password = password;
    }

    const messages = {
      required: 'Campo requerido',
      'email.email': 'Correo no valido',
      'min': 'Valor demasiado corto',
      'max': 'Valor demasiado largo',
    };
    validateAll(data, rules, messages)
      .then(() => {
        setSignUpErrors('');

        console.log('DataScreen route.params: ' + JSON.stringify(route.params));
 
        if (password.length > 5 && oldPassword.length > 5)
        {
          setPassUpdate(false);

          
          fetch(Constant.URI.PATH + Constant.URI.UPDATE_PASSWORD, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': route.params.userRoot.Token
            },
            body: JSON.stringify({
              "I_UsuarioExterno_id": route.params.userRoot.idUsuarioExterno,
              "I_UsuarioExterno_Usuario": route.params.userRoot.numeroDocumento,
              "I_UsuarioExterno_ClaveNueva": password,
              "I_UsuarioExterno_ClaveAnterior": oldPassword,
              "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
              "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
              "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
            })
          })
            .then((response) => response.json())
            .then((response) => {

              console.log(Constant.URI.UPDATE_PASSWORD + ': ' + JSON.stringify(response));

              setPassUpdate(true);
              if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199)
              {
                Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
              } 
              else
              {
                Alert.alert("Éxito", response.RespuestaMensaje, [{
                  text: "OK", onPress: () => {
                    setOldPassword("");
                    setPassword("");
                    setPasswordConfirm("");
                  }
                }], { cancelable: false });
              }
            })
            .catch((error) => console.error(error));
        }


        //else 
        if(route.params.userRoot.telefonoMovil != cellphone || route.params.userRoot.correoElectronico != email)
        {
          setUserUpdate(false);
          fetch(Constant.URI.PATH + Constant.URI.UPDATE_USER, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': route.params.userRoot.Token
            },
            body: JSON.stringify({
              "I_UsuarioExterno_id": route.params.userRoot.idUsuarioExterno,
              "I_UsuarioExterno_Usuario": route.params.userRoot.numeroDocumento,
              "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
              "I_UsuarioExterno_CorreoElectronico": email,
              "I_UsuarioExterno_TelefonoMovil": cellphone,
              "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
              "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
            })
          })
            .then((response) => response.json())
            .then((response) => {

              console.log(Constant.URI.UPDATE_USER + ': ' + JSON.stringify(response));

              setUserUpdate(true);
              if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199)
              {
                Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
              }
              else
              {
                route.params.userRoot.telefonoMovil = cellphone;
                route.params.userRoot.correoElectronico = email
                Alert.alert("Éxito", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
              }
            })
            .catch((error) => console.error(error));
        }

      })
      .catch(err => {
        const formatError = {};
        err.forEach(err => {
          formatError[err.field] = err.message;
        });
        setSignUpErrors(formatError);
      });
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
        <View style={styles.container}>

          <Collapse style={styles.collapse} isCollapsed={true} >
            <CollapseHeader style={styles.collapseHeader}>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Datos Personales</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{ marginTop: 10, marginBottom: 10 }}>
              <View>
                <View> 
                  <Input
                    label="Empresa"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    value={route.params.userRoot.nombreClientePotencial}
                    inputContainerStyle={css.inputContainer}
                    disabledInputStyle={{ backgroundColor: '#D1D1D1' }}
                    disabled={true}
                  />
                </View>
                <View>
                  <Input
                    label="DNI"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    value={route.params.userRoot.numeroDocumento}
                    inputContainerStyle={css.inputContainer}
                    disabledInputStyle={{ backgroundColor: '#D1D1D1' }}
                    disabled={true}
                  />
                </View>
                <View>
                  <Input
                    label="Nombres"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    value={route.params.userRoot.nombre}
                    inputContainerStyle={css.inputContainer}
                    disabledInputStyle={{ backgroundColor: '#D1D1D1' }}
                    disabled={true}
                  />
                </View>
                <View>
                  <Input
                    label="Apellidos"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    value={route.params.userRoot.apellidoPaterno + ' ' + route.params.userRoot.apellidoMaterno}
                    inputContainerStyle={css.inputContainer}
                    disabledInputStyle={{ backgroundColor: '#D1D1D1' }}
                    disabled={true}
                  />
                </View>
                <View>
                  <Input
                    label="Fecha de Nacimiento"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    value={route.params.userRoot.fechaNacimiento}
                    inputContainerStyle={css.inputContainer}
                    disabledInputStyle={{ backgroundColor: '#D1D1D1' }}
                    disabled={true}
                  />
                </View>
                <View>
                  <Input
                    label="Celular"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                    value={cellphone}
                    onChangeText={setCellphone}
                    inputContainerStyle={css.inputContainer}
                    errorStyle={css.inputErrorContainer}
                    errorMessage={SignUpErrors ? SignUpErrors.cellphone : null}
                    returnKeyType={"done"}
                  />
                </View>
                <View>
                  <Input
                    label="Correo"
                    labelStyle={styles.collapseBodyTextLabel}
                    inputStyle={styles.collapseInputText}
                    value={email}
                    onChangeText={setEmail}
                    inputContainerStyle={css.inputContainer}
                    errorStyle={css.inputErrorContainer}
                    errorMessage={SignUpErrors ? SignUpErrors.email : null}
                    returnKeyType={"done"}
                  />
                </View>
              </View>
            </CollapseBody>
          </Collapse>

          <Collapse style={styles.collapse}>
            <CollapseHeader style={styles.collapseHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Contraseña</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{ marginTop: 10, marginBottom: 10 }}>
              <View>
                <Input
                  placeholder="Ingresa tu contraseña anterior"
                  placeholderTextColor={css.colors.opaque}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  inputContainerStyle={styles.collapseInputContainer}
                  rightIcon={
                    <Icon name='lock-outline' type='material-community' size={25} color={css.colors.opaque} />
                  }
                  secureTextEntry
                  inputContainerStyle={css.inputContainer}
                  errorStyle={css.inputErrorContainer}
                  errorMessage={SignUpErrors ? SignUpErrors.oldPassword : null}
                  returnKeyType={"done"}
                />
                <Input
                  placeholder="Ingresa una nueva contraseña"
                  placeholderTextColor={css.colors.opaque}
                  value={password}
                  onChangeText={setPassword}
                  inputContainerStyle={styles.collapseInputContainer}
                  rightIcon={
                    <Icon name='lock-outline' type='material-community' size={25} color={css.colors.opaque} />
                  }
                  secureTextEntry
                  inputContainerStyle={css.inputContainer}
                  errorStyle={css.inputErrorContainer}
                  errorMessage={SignUpErrors ? SignUpErrors.password : null}
                  returnKeyType={"done"}
                />
                <Input
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor={css.colors.opaque}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  inputContainerStyle={styles.collapseInputContainer}
                  rightIcon={
                    <Icon name='lock-outline' type='material-community' size={25} color={css.colors.opaque} />
                  }
                  secureTextEntry
                  inputContainerStyle={css.inputContainer}
                  errorStyle={css.inputErrorContainer}
                  errorMessage={SignUpErrors ? SignUpErrors.passwordConfirm : null}
                  returnKeyType={"done"}
                />
              </View>
            </CollapseBody>
          </Collapse>

          <Button
            buttonStyle={css.buttonContainer}
            loading={!(userUpdated && passUpdated)}
            title="Guardar"
            onPress={() => handleSignIn()}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#FF0000",
    borderTopWidth: 2,
    backgroundColor: "#FFF"
  },
  collapse: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 1,
    backgroundColor: '#FFF'
  },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    padding: 10,
    backgroundColor: '#FFF',
  },
  collapseBodyTextLabel: {
    fontSize: 16
  },
  collapseInputText: {
    fontSize: 14,
    borderRadius: 5
  }
});
import AsyncStorage from '@react-native-community/async-storage';
import { validateAll } from 'indicative/validator';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Icon, Input } from 'react-native-elements';
import { Background } from '../components';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';
import { css } from '../utils/css';
import DeviceInfo from 'react-native-device-info';

async function clearAsyncStore() {
  await AsyncStorage.clear();
}

async function getDeviceInfo() {
  let promises = []; 
  promises.push(DeviceInfo.getIpAddress().then(ip => { return ip })); 
  promises.push(DeviceInfo.getMacAddress().then(mac => { return mac })); 

  try {
    let [ipAddress, macAddress] = await Promise.all(promises);
    Constant.GLOBAL.IP_ADDRESS = ipAddress;
    Constant.GLOBAL.MAC_ADDRESS = macAddress;
  } catch (error) {
    console.log(error);
  }
}

const LoginScreen = ({ navigation }) => {
  clearAsyncStore();
  const [loading, setLoading] = useState(false);
  const [dni, setdni] = useState('');
  const [password, setPassword] = useState('');
  const [SignUpErrors, setSignUpErrors] = useState({});

  const { signIn, signUp, forgotPassword, updatePersonalInfo } = useContext(AuthContext);
  useEffect(() => {
    getDeviceInfo();
  });

  const handleSignIn = () => {
    setLoading(true);
    const rules = {
      dni: 'required|min:0|max:8',
      password: 'required|string|min:0|max:10'
    };

   const data = {
      dni: dni,
      password: password
    };

    const messages = {
      required: 'Campo requerido',
      'min': 'Valor demasiado corto',
      'max': 'Valor demasiado largo',
      'password.min': '¿Olvidó la contraseña?'
    };
    

    validateAll(data, rules, messages)
      .then(() => {

        console.error(JSON.stringify({
          "I_Sistema_IdSistema": 100,
          "I_Usuario_Usuario": dni,
          "I_Usuario_Clave": password,
          "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
          "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
        }));

        fetch(Constant.URI.PATH + Constant.URI.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "I_Sistema_IdSistema": 100,
            "I_Usuario_Usuario": dni,
            "I_Usuario_Clave": password,
            "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
            "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
          })
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(Constant.URI.LOGIN + ': ' + JSON.stringify(response) );
            
            if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199)
            {
              Alert.alert('Error', response.RespuestaMensaje);
              setLoading(false);
            }
            else
            {
              if (response.correoElectronico !== "" && response.telefonoMovil !== "")
              {
                const _storeData = async () => {
                  try
                  {
                    await AsyncStorage.setItem('sessionToken', JSON.stringify(response));
                    signIn({ data: response });
                  }
                  catch (error)
                  {
                    console.error('Error: ' + error);
                    setLoading(false);
                  }
                };
                _storeData();
              }
              else
              {
                response.oldPassword = password;
                updatePersonalInfo({ data: response });
              }
            }
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      })
      .catch(err => {
        setLoading(false);
        const formatError = {};
        console.log('ERROR: ' + JSON.stringify(err));
        err.forEach(err => {
          formatError[err.field] = err.message;
        });
        setSignUpErrors(formatError);
      });
  };

  return (
    <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
      <Background>
        <View style={css.containerViewCard}>
          <Card
            title='Bienvenidos'
            titleStyle={{ fontSize: 23, color: "#737373", fontWeight: "bold" }}
            containerStyle={StyleSheet.flatten([css.containerCard, { height: '56%' }])}>
            <Input
              placeholder="DNI"
              placeholderTextColor={css.colors.opaque}
              value={dni}
              maxLength={8}
              onChangeText={setdni}
              keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
              leftIcon={
                <Icon name='account-outline' type='material-community' size={25} color={css.colors.opaque} />
              }
              inputContainerStyle={css.inputContainer}
              errorStyle={css.inputErrorContainer}
              errorMessage={SignUpErrors ? SignUpErrors.dni : null}
              returnKeyType={"done"}
            />
            <Input
              placeholder="Contraseña"
              placeholderTextColor={css.colors.opaque}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={
                <Icon name='lock-outline' type='material-community' size={25} color={css.colors.opaque} />
              }
              inputContainerStyle={css.inputContainer}
              errorStyle={css.inputErrorContainer}
              errorMessage={SignUpErrors ? SignUpErrors.password : null}
              returnKeyType={"done"}
            />

            <View style={{ alignItems: 'center', paddingTop: 15 }}>
              <TouchableOpacity onPress={() => forgotPassword()} >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "#737373" }}>No recuerdo mi contraseña</Text>
              </TouchableOpacity>
            </View>

            <Button
              buttonStyle={css.buttonContainer}
              title="Ingresar"
              onPress={() => handleSignIn()}
              loading={loading}
            />

            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => signUp()}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 15, fontWeight: "bold", color: "#737373" }}>Registrarme  </Text>
                  <Icon name='ios-arrow-forward' type='ionicon' size={18} color={css.colors.opaque} />
                </View>
              </TouchableOpacity>
            </View>
            
          </Card>
        </View>
      </Background>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

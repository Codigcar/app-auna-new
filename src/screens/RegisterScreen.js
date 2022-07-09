import { validateAll } from 'indicative/validator';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Input } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import { Background, TextInputMask, ToggleSwitch } from '../components';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';
import { css } from '../utils/css';

console.log('RegisterScreen');

const iconSize = 25;
let xToken='';


const RegisterScreen = () => {
    const [dni, setDni] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [SignUpErrors, setSignUpErrors] = useState({});

    //Toggle
    const [isEnabled, setIsEnabled] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [terms, setTerms] = useState(null);
    const toggleSwitch = () => setAcceptTerms(previousState => !previousState);

    const { signUp, signIn } = useContext(AuthContext);

    

    const searchDni = () => {
        validateAll({ birthdate: birthdate }, { birthdate: 'min:10|max:10' }, { 'min': 'Formato dd/MM/yyyy', 'max': 'Formato dd/MM/yyyy' })
            .then(() => {
                if (dni != '' && birthdate != '' && birthdate.length == 10) {
                    fetch(Constant.URI.PATH + Constant.URI.GET_USER_POR_DNI_Y_FECHA_NACIMIENTO, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                            "I_Persona_NumeroDocumento": dni,
                            "I_Persona_FechaNacimiento": birthdate,
                            "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
                            "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
                        })
                    })
                        .then((response) => response.json())
                        .then((response) => {
                            if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199)
                            {
                                Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
                            }
                            else
                            {
                                console.log('RegisterScreen('+Constant.URI.GET_USER_POR_DNI_Y_FECHA_NACIMIENTO+') response: ' + JSON.stringify(response));
                                xToken = response.Token;
                                console.log('xToken1: ' + xToken);
                                Keyboard.removeListener("keyboardDidHide", searchDni);
                                setName(response.nombre);
                                setLastname(response.apellidoPaterno + ' ' + response.apellidoMaterno);
                                setIsEnabled(true);
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
    }

    const handleSignUp = () => {
        const rules = {
            dni: 'required',
            email: 'required|email',
            password: 'required|string|min:6|max:10|confirmed'
        };

        const data = {
            dni: dni,
            birthdate: birthdate,
            email: email,
            password: password,
            password_confirmation: passwordConfirm
        };

        const messages = {
            required: 'Campo requerido',
            'email.email': 'Email no válido',
            'min': 'Valor demasiado corto',
            'max': 'Valor demasiado largo',
            'password.min': '6 caracteres como mínimo',
            'password.confirmed': 'Contraseña no coincide'
        };

        validateAll(data, rules, messages)
            .then(() => {
                console.log('xToken2: ' + xToken);
                data.Token = xToken;
                signUp(data);
            })
            .catch(err => {
                const formatError = {};
                err.forEach(err => {
                    formatError[err.field] = err.message;
                });
                setSignUpErrors(formatError);
            });
    };

    useEffect(() => {
        fetch(Constant.URI.PATH + Constant.URI.GET_TERMS_CONDITIONS + '?Id_Sistema=' + Constant.GLOBAL.ID_SISTEMA)
            .then((response) => response.json())
            .then((response) => {

                if (response.codigo < 100 || response.codigo > 199) {
                    Alert.alert('Error', response.mensaje);
                } else {
                    setTerms(response);
                }
            })
            .catch((error) => console.error(error));
    }, [SignUpErrors]);


    const checkPermission = async (url) => {
        if (!url) {
            Alert.alert('Error', 'Ponerse en contacto con el Administrador del sistema.');
        }
        url = validateUrl(url);

        if (Platform.OS === 'ios') {
            downloadImage(url);
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permiso de almacenamiento requerido',
                        message: 'Esta aplicación necesita acceso a su almacenamiento para descargar archivos',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    downloadImage(url);
                } else {
                    Alert.alert('Error', 'Permiso de almacenamiento no otorgado.');
                }
            } catch (e) {
                console.warn(e);
            }
        }
    };

    const validateUrl = (url) => {
        if (url.includes('http://') || url.includes('https://')) {
            return url;
        }
        return 'https://' + url;
    }

    const downloadImage = (url) => {
        let date = new Date();
        let ext = getExtention(url);
        ext = '.' + ext[0];

        const { config, fs, ios } = RNFetchBlob;
        let dir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            path: dir + '/la_protectora_tyc_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: dir + '/la_protectora_tyc_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
                description: 'La Protectora - Colaboradores Empresas'
            },
        };
        config(options)
            .fetch('GET', url)
            .then(res => {
                Alert.alert('Éxito', 'Archivo descargado con éxito en la siguiente ruta: \n' + res.path());
                if (Platform.OS === 'ios') {
                    ios.openDocument(res.path());
                }
            })
            .catch((e) => console.error(e));
    }

    const getExtention = filename => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    }

    return (
        <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
            <Background>
                <View style={css.containerViewCard}>
                    <Card
                        title="Regístrate"
                        titleStyle={{ fontSize: 26 }}
                        dividerStyle={{ borderTopWidth: 0.5 }}
                        containerStyle={styles.containerCard}
                    >
                        <ScrollView>

                            <Input
                                placeholder='Número de documento'
                                placeholderTextColor={css.colors.opaque}
                                value={dni}
                                keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                                onChangeText={setDni}
                                onBlur={() => searchDni()}
                                maxLength={8}
                                leftIcon={
                                    <MaterialCommunityIcons name="account-check" size={iconSize} color={css.colors.opaque} />
                                }
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.dni : null}
                                onSubmitEditing={() => searchDni()}
                                returnKeyType={"done"}
                                editable={!isEnabled}
                            />
                            <TextInputMask
                                placeholder='Fecha de nacimiento'
                                placeholderTextColor={css.colors.opaque}
                                value={birthdate}
                                onChangeText={setBirthdate}
                                onBlur={() => searchDni()}
                                leftIcon={
                                    <MaterialCommunityIcons name="calendar-check" size={iconSize} color={css.colors.opaque} />
                                }
                                type={'datetime'}
                                options={{
                                    format: 'DD/MM/YYYY'
                                }}
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.birthdate : null}
                                onSubmitEditing={() => searchDni()}
                                returnKeyType={"done"}
                                editable={!isEnabled}
                            />
                            <Input
                                placeholder='Nombre'
                                placeholderTextColor={css.colors.opaque}
                                value={name}
                                onChangeText={setName}
                                leftIcon={
                                    <MaterialCommunityIcons name="account-details" size={iconSize} color={css.colors.opaque} />
                                }
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.name : null}
                                editable={false}
                            />
                            <Input
                                placeholder='Apellidos'
                                placeholderTextColor={css.colors.opaque}
                                value={lastname}
                                onChangeText={setLastname}
                                leftIcon={
                                    <MaterialCommunityIcons name="account-details" size={iconSize} color={css.colors.opaque} />
                                }
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.lastname : null}
                                editable={false}
                            />
                            <Input
                                placeholder="Email"
                                placeholderTextColor={css.colors.opaque}
                                value={email}
                                onChangeText={setEmail}
                                leftIcon={
                                    <MaterialCommunityIcons name="email" size={iconSize} color={css.colors.opaque} />
                                }
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.email : null}
                                returnKeyType={"done"}
                                editable={isEnabled}
                            />
                            <Input
                                placeholder="Contraseña"
                                placeholderTextColor={css.colors.opaque}
                                value={password}
                                onChangeText={setPassword}
                                leftIcon={
                                    <MaterialCommunityIcons name="lock" size={iconSize} color={css.colors.opaque} />
                                }
                                secureTextEntry
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.password : null}
                                returnKeyType={"done"}
                                editable={isEnabled}
                            />
                            <Input
                                placeholder="Confirmar contraseña"
                                placeholderTextColor={css.colors.opaque}
                                value={passwordConfirm}
                                onChangeText={setPasswordConfirm}
                                leftIcon={
                                    <MaterialCommunityIcons name="lock" size={iconSize} color={css.colors.opaque} />
                                }
                                secureTextEntry
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.passwordConfirm : null}
                                returnKeyType={"done"}
                                editable={isEnabled}
                            />
                            <ToggleSwitch
                                isOn={acceptTerms}
                                label='ACEPTO: "ANTES DE DAR CLICK EN ACEPTAR. CONFÍRMANOS QUE ESTÁS DE ACUERDO Y NOS AUTORIZAS AL TRATAMIENTO DE TUS DATOS PERSONALES Y REMISIÓN DE PUBLICIDAD CONFORME A LAS CONDICIONES ADJUNTAS." '
                                labelLink="VER AQUI"
                                onTextLink={() => checkPermission(terms)}
                                size="large"
                                onToggle={toggleSwitch}
                            />
                            <Button
                                buttonStyle={css.buttonContainer}
                                title="Registrar"
                                onPress={() => handleSignUp()}
                                disabled={!acceptTerms || !isEnabled}
                            />

                            <TouchableOpacity onPress={() => signIn()}>
                                <Text style={{ textAlign: 'center' }} >¿Ya te has registrado? Ingresar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </Card>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    containerCard: css.containerCard,
    containerViewCard: css.containerViewCard,
    button: {
        margin: 20,
        marginLeft: 50,
        marginRight: 50,
        backgroundColor: css.colors.button
    }
});

export default RegisterScreen;

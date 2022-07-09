import AsyncStorage from '@react-native-community/async-storage';
import { Collapse, CollapseBody, CollapseHeader } from "accordion-collapse-react-native";
import { validateAll } from 'indicative/validator';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider, Input } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import { ToggleSwitch } from '../components';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';
import { css } from '../utils/css';
import normalize from '../utils/normalizeText';

const UpdatePersonalInfoScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [subTitle, setSetSubTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [SignUpErrors, setSignUpErrors] = useState({});

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [terms, setTerms] = useState(null);
    const toggleSwitch = () => setAcceptTerms(previousState => !previousState);

    const { signIn } = useContext(AuthContext);

    const handleSignIn = () => {
        setLoading(true);
        const rules = {
            phone: 'required|min:7|max:9',
            email: 'required|email',
            password: 'required|string|min:6|max:10|confirmed'
        };

        const data = {
            email: email,
            phone: phone,
            password: password,
            password_confirmation: passwordConfirm
        };

        const messages = {
            required: 'Campo requerido',
            'email.email': 'Email no válido',
            'min': 'Valor demasiado corto',
            'max': 'Valor demasiado largo',
            'password.confirmed': 'Contraseña no coincide'
        };

        validateAll(data, rules, messages)
            .then(() => {
                setSignUpErrors('');

                console.log('userRoot: ' + JSON.stringify(route.params.userRoot));
                fetch(Constant.URI.PATH + Constant.URI.UPDATE_USER, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': route.params.userRoot.Token
                    },
                    body: JSON.stringify({
                        "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                        "I_UsuarioExterno_id": route.params.userRoot.idUsuarioExterno,
                        "I_UsuarioExterno_Usuario": route.params.userRoot.numeroDocumento,
                        "I_UsuarioExterno_CorreoElectronico": email,
                        "I_UsuarioExterno_TelefonoMovil": phone,
                        "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
                        "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {

                        console.log(Constant.URI.UPDATE_USER + ': ' + JSON.stringify(response));

                        if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
                            Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
                            setLoading(false);
                        }
                        else
                        {
                            route.params.userRoot.email = email;
                            route.params.userRoot.telefono = phone;

                            fetch(Constant.URI.PATH + Constant.URI.UPDATE_PASSWORD, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': route.params.userRoot.Token
                                },
                                body: JSON.stringify({
                                    "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                                    "I_UsuarioExterno_id": route.params.userRoot.idUsuarioExterno,
                                    "I_UsuarioExterno_Usuario": route.params.userRoot.numeroDocumento,
                                    "I_UsuarioExterno_ClaveNueva": password,
                                    "I_UsuarioExterno_ClaveAnterior": route.params.userRoot.oldPassword,
                                    "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
                                    "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
                                })
                            })
                                .then((resp) => resp.json())
                                .then((resp) => {

                                    console.log(Constant.URI.UPDATE_PASSWORD + ': ' + JSON.stringify(resp));

                                    if (resp.CodigoMensaje < 100 || resp.CodigoMensaje > 199) {
                                        Alert.alert("", resp.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
                                    } else {
                                        const _storeData = async () => {
                                            try {
                                                await AsyncStorage.setItem('sessionToken', JSON.stringify(route.params.userRoot));
                                                signIn({ data: route.params.userRoot });
                                            } catch (error) {
                                                console.error('Error: ' + error);
                                                setLoading(false);
                                            }
                                        };
                                        _storeData();
                                    }
                                })
                                .catch((error) => console.error(error));

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
        fetch(Constant.URI.PATH + Constant.URI.GET_UPDATE_INFORMATION_MESSAGE)
            .then((response) => response.json())
            .then((response) => {
                setSetSubTitle(response);
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
        <View style={styles.container}>
  
                
            <Collapse style={styles.collapse} isCollapsed={true} disabled={true} >
                <CollapseHeader style={styles.collapseHeader}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Actualizar Información</Text>
                    </View>
                </CollapseHeader>
                <CollapseBody style={{ marginTop: 10, marginBottom: 10 }}>
                    <View>
                        {titleCard(subTitle)}
                    </View>
                    <View>
                        <Input
                            placeholder="Celular"
                            placeholderTextColor={css.colors.opaque}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                            leftIcon={
                                <MaterialCommunityIcons name="phone" size={25} color={css.colors.opaque} />
                            }
                            inputContainerStyle={css.inputContainer}
                            errorStyle={css.inputErrorContainer}
                            errorMessage={SignUpErrors ? SignUpErrors.phone : null}
                            returnKeyType={"done"}
                        />
                        <Input
                            placeholder="Email"
                            placeholderTextColor={css.colors.opaque}
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={
                                <MaterialCommunityIcons name="email-outline" size={25} color={css.colors.opaque} />
                            }
                            inputContainerStyle={css.inputContainer}
                            errorStyle={css.inputErrorContainer}
                            errorMessage={SignUpErrors ? SignUpErrors.email : null}
                            returnKeyType={"done"}
                        />
                        <Input
                            placeholder="Contraseña"
                            placeholderTextColor={css.colors.opaque}
                            value={password}
                            onChangeText={setPassword}
                            leftIcon={
                                <MaterialCommunityIcons name="lock" size={25} color={css.colors.opaque} />
                            }
                            secureTextEntry
                            inputContainerStyle={css.inputContainer}
                            errorStyle={css.inputErrorContainer}
                            errorMessage={SignUpErrors ? SignUpErrors.password : null}
                            returnKeyType={"done"}
                        />
                        <Input
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={css.colors.opaque}
                            value={passwordConfirm}
                            onChangeText={setPasswordConfirm}
                            leftIcon={
                                <MaterialCommunityIcons name="lock" size={25} color={css.colors.opaque} />
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

            <View style={StyleSheet.flatten([styles.collapse, { marginTop: 10, marginBottom: 10, justifyContent: "center" }])}>
                <ToggleSwitch
                    isOn={acceptTerms}
                    label='ANTES DE HACER CLICK EN GUARDAR, CONFÍRMENOS QUE ESTÁ DE ACUERDO CON LAS POLÍTICAS DE TRATAMIENTO DE SUS DATOS, CUYAS CONDICIONES PODRÁ '
                    labelLink="VER AQUI"
                    onTextLink={() => checkPermission(terms)}
                    size="large"
                    onToggle={toggleSwitch}
                />

                <Button
                    buttonStyle={css.buttonContainer}
                    title="Guardar"
                    onPress={() => handleSignIn()}
                    loading={loading}
                    disabled={!acceptTerms}
                />

                <TouchableOpacity onPress={() => signIn()}>
                    <Text style={{ textAlign: 'center' }} >Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
            </View>
        </KeyboardAvoidingView>
    );
};

function titleCard(subTitle) {
    return (
        <View>
            <View style={styles.cardTitleContainer}>
                <Text style={styles.subTitleStyle}>{subTitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardTitleContainer: {
        paddingBottom: 20
    },
    cardTitle: {
        fontSize: normalize(14),
        ...Platform.select({
            default: {
                fontWeight: 'bold',
            },
        }),
        textAlign: 'center',
        marginBottom: 15,
    },
    imageCardTitle: {
        marginTop: 15,
    },
    titleStyle: {
        fontSize: 26
    },
    subTitleStyle: {
        color: css.colors.opaque,
        textAlign: "left"
    },
    container: {
      borderTopColor: "#FF0000",
      borderTopWidth: 2,
      backgroundColor: "#FFF",
      height: '100%'
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
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FFF',
    },
    collapseInputText: {
        fontSize: 14,
        borderRadius: 5
    }
});

export default UpdatePersonalInfoScreen;

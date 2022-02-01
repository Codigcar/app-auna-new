import { validateAll } from 'indicative/validator';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, AsyncStorage, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider, Input, Overlay } from 'react-native-elements';
import VerifyCode from '../components/VerifyCode';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Background } from '../components';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';
import { css } from '../utils/css';
import normalize from '../utils/normalizeText';

console.log('SMSVerifyScreen');

const SMSVerifyScreen = ({ navigation, route }) => {
    const [codeSMSReceived, setCodeSMSReceived] = useState('');
    const [cel, setCel] = useState(route.params.userRoot.cellphone);
    const [countCodeVerification, setCountCodeVerification] = useState(1);
    const isForgotPassword = (typeof route.params.userRoot.cellphone !== "undefined");
    const [SignUpErrors, setSignUpErrors] = useState({});
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const { signIn } = useContext(AuthContext);

    //console.log('SMSVerifyScreen params : ' + JSON.stringify(route.params.userRoot));
    //console.log('SMSVerifyScreen params : ' + JSON.stringify(route.params));

    const getCode = () => {
        const rules = {
            cel: 'required|min:9|max:9',
        };

        const data = {
            cel: cel
        };

        if (isForgotPassword) {
            rules.password = 'required|string|min:6|max:10|confirmed';
            data.password = password;
            data.password_confirmation = passwordConfirm;
        }

        const messages = {
            required: 'Campo requerido',
            'min': 'Valor demasiado corto',
            'max': 'Valor demasiado largo',
            'password.confirmed': 'Contraseña no coincide'
        };

        validateAll(data, rules, messages)
            .then(() => {
                setSignUpErrors('');

                console.log('VerifySmsScreen response: ' + JSON.stringify(route.params.userRoot));

                fetch(Constant.URI.PATH + Constant.URI.GET_CODE_SMS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': route.params.userRoot.Token
                    },
                    body: JSON.stringify({
                        "id_sistema": Constant.GLOBAL.ID_SISTEMA,
                        "numero_telefono": cel,
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {
                        setCodeSMSReceived(response.sms);
                        toggleOverlay();
                    })
                    .catch((error) => console.error(error));
            })
            .catch(err => {
                const formatError = {};
                err.forEach(err => {
                    formatError[err.field] = err.message;
                });
                setSignUpErrors(formatError);
                console.log(formatError);
            });
    };

    //Overlay Verification Code
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState('');
    const toggleOverlay = () => {
        setCode('');
        setVisible(!visible);
        setCountCodeVerification(1);
    };
    const onInputCompletede = (text) => {
        setCode(text);
    };
    const validateCode = () => {
        console.log(codeSMSReceived + ' - ' + code);
        if (codeSMSReceived == code)
        {
            if (isForgotPassword)
            {
                fetch(Constant.URI.PATH + Constant.URI.RESET_PASSWORD, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': route.params.userRoot.Token
                    },
                    body: JSON.stringify({
                        "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                        "I_UsuarioExterno_Usuario": route.params.userRoot.dni,
                        "I_UsuarioExterno_id": route.params.userRoot.id_usuario_externo,
                        "I_UsuarioExterno_ClaveNueva": password,
                        "I_UsuarioExterno_TelefonoMovil": cel,
                        "I_UsuarioExternoLog_CodigoSMS": codeSMSReceived,
                        "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
                        "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS,
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
                            setVisible(false);
                            Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
                        } else {
                            Alert.alert("Éxito", response.RespuestaMensaje, [{ text: "OK", onPress: () => signIn() }], { cancelable: false });
                        }
                    })
                    .catch((error) => console.error(error));
            } 
            else
            {
                fetch(Constant.URI.PATH + Constant.URI.INSERT_USER, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                        "I_Usuario_Usuario": route.params.userRoot.dni,
                        "I_Persona_FechaNacimiento": route.params.userRoot.birthdate,
                        "I_Usuario_CorreoElectronico": route.params.userRoot.email,
                        "I_Usuario_Clave": route.params.userRoot.password,
                        "I_Usuario_TelefonoMovil": cel,
                        "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
                        "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS,
                        "I_UsuarioExternoLog_CodigoSMS": codeSMSReceived
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {

                        //console.log('PESTAÑA MÁS SOCIALES Screen response: ' + JSON.stringify(response));

                        if (response.codigo < 100 || response.codigo > 199) {
                            setVisible(false);
                            Alert.alert("", response.mensaje, [{ text: "OK" }], { cancelable: false });
                        } else {
                            login(route.params.userRoot.dni, route.params.userRoot.password);
                        }
                    })
                    .catch((error) => console.error(error));
            }
        } else {
            setCountCodeVerification(countCodeVerification + 1);
            Alert.alert("", "Código incorrecto", [{ text: "OK", onPress: () => { if (countCodeVerification > 2) { toggleOverlay() } } }], { cancelable: false });
        }
    };

    const login = (dni, pass) => {
        fetch(Constant.URI.PATH + Constant.URI.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                "I_Usuario_Usuario": dni,
                "I_Usuario_Clave": pass,
                "I_UsuarioExternoLog_DireccionMac": Constant.GLOBAL.MAC_ADDRESS,
                "I_UsuarioExternoLog_DireccionIP": Constant.GLOBAL.IP_ADDRESS
            })
        })
            .then((resp) => resp.json())
            .then((resp) => {
                const _storeData = async () => {
                    try {
                        await AsyncStorage.setItem('sessionToken', JSON.stringify(resp));
                        signIn({ data: resp });
                    } catch (error) {
                        console.error('Error: ' + error);
                        setLoading(false);
                    }
                };
                toggleOverlay();
                _storeData();
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }


    useEffect(() => { }, [SignUpErrors]);

    return (
        <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
            <Background>
                <View style={css.containerViewCard}>
                    <Card title={titleCard()}
                        containerStyle={styles.containerCard}>
                        {isForgotPassword
                            ? <View>
                                <Input
                                    value={route.params.userRoot.view_cellphone}
                                    containerStyle={{ paddingTop: 10 }}
                                    inputContainerStyle={css.inputContainer}
                                    editable={false}
                                />
                                <Input
                                    placeholder="Nueva Contraseña"
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
                            : <Input
                                placeholder="Ingresar teléfono"
                                placeholderTextColor={css.colors.opaque}
                                value={cel}
                                keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                                onChangeText={setCel}
                                containerStyle={{ paddingTop: 10 }}
                                inputContainerStyle={css.inputContainer}
                                errorStyle={css.inputErrorContainer}
                                errorMessage={SignUpErrors ? SignUpErrors.cel : null}
                                returnKeyType={"done"}
                            />
                        }

                        <Button
                            buttonStyle={css.buttonContainer}
                            title="Obtener código"
                            onPress={() => getCode()}
                        />

                        <TouchableOpacity onPress={() => signIn()}>
                            <Text style={{ textAlign: 'center' }} >Iniciar sesión</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                    <View style={styles.containerVerifyCode}>
                        <Text style={{ fontSize: 20, marginBottom: 5, marginTop: 20 }}>Ingresa el código de seguridad</Text>
                        <VerifyCode
                            verifyCodeLength={6}
                            containerPaddingVertical={5}
                            containerPaddingHorizontal={50}
                            codeViewBorderColor="#000000"
                            focusedCodeViewBorderColor={css.colors.primary}
                            codeViewBorderRadius={5}
                            onInputCompleted={onInputCompletede}
                        />
                        <Button
                            buttonStyle={css.buttonContainer}
                            title="Validar"
                            onPress={() => validateCode()}
                        />
                    </View>
                </Overlay>
            </Background>
        </KeyboardAvoidingView>
    );
};

function titleCard() {
    return (
        <View>
            <View style={styles.cardTitleContainer}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <MaterialCommunityIcons name="cellphone-message" size={60} color={css.colors.primary} />
                </View>
                <Text
                    style={StyleSheet.flatten([
                        styles.cardTitle,
                        styles.titleStyle, styles.imageCardTitle
                    ])}
                    numberOfLines={2}
                >Verificación SMS</Text>
                <Text style={styles.subTitleStyle}>La Protectora te enviará un código a través de un único mensaje SMS, para verificar tu número de celular.</Text>
            </View>
            <Divider style={css.divider} />
        </View>
    );
}

const styles = StyleSheet.create({
    containerCard: css.containerCard,
    containerViewCard: css.containerViewCard,
    containerVerifyCode: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
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
        textAlign: "center"
    }
});

export default SMSVerifyScreen;

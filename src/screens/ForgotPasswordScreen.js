import { validateAll } from 'indicative/validator';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider, Input } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Background } from '../components';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';
import { css } from '../utils/css';
import normalize from '../utils/normalizeText';

const ForgotPasswordScreen = ({ navigation }) => {
    const [dni, setDni] = useState('');
    const [SignUpErrors, setSignUpErrors] = useState({});

    const { signIn, forgotPassword } = useContext(AuthContext);

    const handleSignIn = () => {
        const rules = {
            dni: 'required|min:8|max:8',
        };

        const data = {
            dni: dni,
        };

        const messages = {
            required: 'Campo requerido',
            'min': 'Valor demasiado corto',
            'max': 'Valor demasiado largo',
        };

        validateAll(data, rules, messages)
            .then(() => {
                setSignUpErrors('');
                fetch(Constant.URI.PATH + Constant.URI.GET_CELxDNI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "I_Sistema_IdSistema": Constant.GLOBAL.ID_SISTEMA,
                        "i_usuario_usuario": dni
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {

                        console.log('ForgotPasswordScreen('+Constant.URI.GET_CELxDNI+') ==> ' + JSON.stringify(response));

                        if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
                            Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
                        } else {
                            forgotPassword({
                                dni,
                                cellphone: response.telefonoMovil,
                                id_usuario_externo: response.idUsuarioExterno,
                                view_cellphone: '******' + response.telefonoMovil.substring(6),
                                Token: response.Token,
                            });
                        }

                    })
                    .catch((error) => console.error(error));

            })
            .catch(err => {
                const formatError = {};
                err.forEach(err => {
                    formatError[err.field] = err.message;
                });
                setSignUpErrors(formatError);
            });
    };

    useEffect(() => { }, [SignUpErrors]);

    return (
        <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
            <Background>
                <View style={css.containerViewCard}>
                    <Card title={titleCard()}
                        containerStyle={styles.containerCard}>
                        <Input
                            placeholder="DNI"
                            placeholderTextColor={css.colors.opaque}
                            value={dni}
                            onChangeText={setDni}
                            keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                            leftIcon={
                                <MaterialCommunityIcons name="account-outline" size={25} color={css.colors.opaque} />
                            }
                            containerStyle={{ paddingTop: 10 }}
                            inputContainerStyle={css.inputContainer}
                            errorStyle={css.inputErrorContainer}
                            errorMessage={SignUpErrors ? SignUpErrors.dni : null}
                            returnKeyType={"done"}
                        />

                        <Button
                            buttonStyle={css.buttonContainer}
                            title="Solicitar contraseña"
                            onPress={() => handleSignIn()}
                        />

                        <TouchableOpacity onPress={() => signIn()}>
                            <Text style={{ textAlign: 'center' }} >Iniciar sesión</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

function titleCard() {
    return (
        <View>
            <View style={styles.cardTitleContainer}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <MaterialCommunityIcons name="lock-open-outline" size={60} color={css.colors.primary} />
                </View>
                <Text
                    style={StyleSheet.flatten([
                        styles.cardTitle,
                        styles.titleStyle, styles.imageCardTitle
                    ])}
                    numberOfLines={2}
                >A todos nos pasa</Text>
                <Text style={styles.subTitleStyle}>Para obtener una nueva contraseña, ingresa el DNI con el que te registraste.</Text>
            </View>
            <Divider style={css.divider} />
        </View>
    );
}

const styles = StyleSheet.create({
    containerCard: css.containerCard,
    containerViewCard: css.containerViewCard,
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

export default ForgotPasswordScreen;

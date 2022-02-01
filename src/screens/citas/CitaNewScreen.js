import {createStackNavigator} from '@react-navigation/stack';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import {validateAll} from 'indicative/validator';
import React, {useLayoutEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {Button, Icon, Divider} from 'react-native-elements';
import 'react-native-gesture-handler';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import {useEffect} from 'react';
import {fetchWithToken} from '../../utils/fetchCustom';

import {Styles} from '../../assets/css/Styles';
import {DropDownPicker, InputMask} from '../../components';
import {convertDateDDMMYYYY} from '../../utils/util';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CitaPopupConfirm from './CitaPopupConfirm';

const Stack = createStackNavigator();

export default function CitaNewScreen({navigation, route}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({navigation, route}) {
  console.log('[CitaNewScreen]:**********:  ', route.params);
  const [SignUpErrors, setSignUpErrors] = useState({});
  const [cellphone, setCellphone] = useState(
    route.params.userRoot.telefonoMovil,
  );
  const [email, setEmail] = useState(route.params.userRoot.correoElectronico);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userUpdated, setUserUpdate] = useState(true);
  const [passUpdated, setPassUpdate] = useState(true);
  console.log('[route]:: ', route.params);

  // data para DropDown Especialidad
  const [specialties, setSpecialties] = useState([{label: 'cargando...'}]);
  const [specialty, setSpecialty] = useState(2);

  // data para DropDown Paciente
  const [patients, setPatients] = useState([{label: 'cargando...'}]);
  const [patient, setPatient] = useState('');

  // datepicker

  //calendar
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const [birthdayFormatDDMMYYYY, setBirthdayFormatDDMMYYYY] = useState(
    convertDateDDMMYYYY(new Date()),
  );

  //horario
  const [horarios, setHorarios] = useState([{label: 'cargando...'}]);
  const [horario, setHorario] = useState('');
  const [saveListFechas, setSaveListFechas] = useState([]);
  const [isLoadingHora, setIsLoadingHora] = useState(false);

  //habilitar useEffect
  const [
    isUseEffectDataHorarioXFecha,
    setIsUseEffectDataHorarioXFecha,
  ] = useState(false);

  const [isVisiblePopupConfirm, setIsVisiblePopupConfirm] = useState(false);

  const [citaBody, setCitaBody] = useState({});

  const handleConfirm = value => {
    console.log('A date has been picked: ', value);
    console.log('A date has been picked: ', convertDateDDMMYYYY(value));
    setBirthday(value);
    console.log('[birthday]:: ', convertDateDDMMYYYY(value));
    setBirthdayFormatDDMMYYYY(convertDateDDMMYYYY(value));
    hideDatePicker();
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    console.log('[showDatePicker]:: ', isDatePickerVisible);
  };

  useEffect(() => {
    fetchDataEspecialidadListar();
    fetchDataPacientesListar();
  }, []);

  const fetchDataEspecialidadListar = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_ESPECIALIDADES_LISTAR_CITA,
      'POST',
      params,
      route.params.userRoot.Token,
    );

    const list = response.Result.map(e => {
      return {
        label: e['nombreEspecialidad'],
        value: e['idEspecialidad']
      };
    });
    setSpecialties(list);
    setSpecialty(list[0]['value']);
  };

  const fetchDataPacientesListar = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
      I_idClientePotencial: route.params.userRoot.idClientePotencial,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_PACIENTES_CITA,
      'POST',
      params,
      route.params.userRoot.Token,
    );

    console.log('[********response.CodigoMensaje]x:::, ',response);
    if (response.CodigoMensaje === 100) {
      if(response.Result[0].CodigoMensaje){
        if(response.Result[0].CodigoMensaje !== 100){
          setPatients([{label: 'No tiene dependientes'}]);
          setPatient('');
          Alert.alert('Error', response.Result[0].RespuestaMensaje);
        }else {
          const list = response.Result.map(e => {
            return {
              label: e['nombrecompleto'],
              value: e['idPersonaAsegurada'],
            };
          });
          setPatients(list);
          setPatient(list[0]['value']);
        }
    } else {
      const list = response.Result.map(e => {
        return {
          label: e['nombrecompleto'],
          value: e['idPersonaAsegurada'],
        };
      });
      setPatients(list);
      setPatient(list[0]['value']);
    }
  } else {
    Alert.alert('Error', response.RespuestaMensaje);
  }
}

  useEffect(() => {
    if (setIsUseEffectDataHorarioXFecha) {
      setIsLoadingHora(true);
      dataHorario_x_Fecha(saveListFechas);
    }
  }, [birthdayFormatDDMMYYYY]);

  useEffect(() => {
    dataHorarioListar(specialty);
    setIsUseEffectDataHorarioXFecha(true);
  }, [specialty]);

  const dataHorarioListar = async idEspecialidad => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
      IdEspecialidad: idEspecialidad,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_HORARIOS_LISTAR_X_ESPECIALIDAD,
      'POST',
      params,
      route.params.userRoot.Token,
    );
    if (response.CodigoMensaje === 100) {
      setSaveListFechas(response);
      dataHorario_x_Fecha(response);
    }
  };

  const dataHorario_x_Fecha = async response => {
    if (response.Result && response.Result.length > 0) {
      const listHorarioXFechaFiltrada = response.Result.filter(
        e => e['fechaDisponible'] === birthdayFormatDDMMYYYY,
      );
      if (listHorarioXFechaFiltrada.length > 0 && listHorarioXFechaFiltrada) {
        const listHorarios = listHorarioXFechaFiltrada.map(e => {
          return {
            label: e['horaInicio'] + ' - ' + e['horaFin'],
            value: [e['horaInicio'], e['horaFin'], e['fechaDisponible2']],
            value2: e['horaFin'],
          };
        });
        setHorarios(listHorarios);
        setHorario(listHorarios[0]['value']);
        setTimeout(() => {
          setIsLoadingHora(false);
        }, 1000);
      } else {
        setHorarios([
          {color: '#838383', label: 'No Disponible', value: 'No Disponible'},
        ]);
        setHorario('No Disponible');
        setTimeout(() => {
          setIsLoadingHora(false);
        }, 1000);
      }
      // console.log('[dataHorario_x_Fecha-listHorarioXFechaFiltrada***********]:****** ', listHorarioXFechaFiltrada);
      // console.log('[dataHorario_x_Fecha-listHorarios***********]:****** ', listHorarios);
    } else {
      setHorarios([
        {color: '#838383', label: 'No Disponible', value: 'No Disponible'},
      ]);
      setHorario('No Disponible');
      setTimeout(() => {
        setIsLoadingHora(false);
      }, 1000);
    }
  };

  const handleRegisterCita = () => {
    const patientFiltrado = patients.filter(e => e.value === patient);
    const specialtyFiltrado = specialties.filter(e => e.value === specialty);
    // console.log('[LIST]::::::, ','especialidad: ',specialty,', paciente:',patient,',patientes: ', patients,',horario:', horario,'typeOf Horario: ',typeof horario,', birthday',birthdayFormatDDMMYYYY,',filtrado: ', patientFiltrado[0].label);
    // console.log('[LIST2]::::: ', specialties);

    setCitaBody({
      patient_label: patientFiltrado[0].label,
      patient_value: patientFiltrado[0].value,
      specialty_label: specialtyFiltrado[0].label,
      specialty_value: specialtyFiltrado[0].value,
      fecha: birthdayFormatDDMMYYYY,
      horario: horario,
    });
    setIsVisiblePopupConfirm(true);
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>
      <CitaPopupConfirm
        isVisiblePopupConfirm={isVisiblePopupConfirm}
        setIsVisiblePopupConfirm={setIsVisiblePopupConfirm}
        citaBody={citaBody}
        navigation={navigation}
        route={route}
      />
      <KeyboardAvoidingView
        behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR}
        style={{flex: 1}}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Solicita tu cita médica</Text>
          </View>
          <Divider style={css.dividerTitleLineRed} />
        </View>
        <View style={[styles.container, {backgroundColor:'transparent'}]}>
          <Collapse style={styles.collapse} isCollapsed={true}>
            <CollapseHeader />
            <CollapseBody style={{}}>
              <View>
                <View style={{marginBottom: 12}}>
                  <Text style={styles.labelDesign}>Especialidad</Text>
                  <DropDownPicker
                    placeholder={{}}
                    items={specialties}
                    onValueChange={setSpecialty}
                    value={specialty}
                    style={{
                      inputAndroid: {
                        backgroundColor: 'transparent',
                        // width: Constant.DEVICE.WIDTH / 2 - 30,
                        // margin: -1,
                      },
                      // iconContainer: {top: 5, right: 30},
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{underlineColorAndroid: Styles.colors.gris}}
                    Icon={() => {
                      return (
                        <Icon
                          name="keyboard-arrow-down"
                          type="material"
                          size={30}
                          color={Styles.colors.gris}
                        />
                      );
                    }}
                  />
                </View>
                <View style={{marginBottom: 12}}>
                  <Text style={styles.labelDesign}>Paciente</Text>
                  <DropDownPicker
                    placeholder={{}}
                    items={patients}
                    onValueChange={setPatient}
                    value={patient}
                    style={{
                      inputAndroid: {
                        backgroundColor: 'transparent',
                        // width: Constant.DEVICE.WIDTH / 2 - 30,
                        // margin: -1,
                      },
                      // iconContainer: {top: 5, right: 30},
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{underlineColorAndroid: Styles.colors.gris}}
                    Icon={() => {
                      return (
                        <Icon
                          name="keyboard-arrow-down"
                          type="material"
                          size={30}
                          color={Styles.colors.gris}
                        />
                      );
                    }}
                  />
                </View>
                <View style={{width: '100%'}}>
                  <Pressable
                    activeOpacity={0.8}
                    onPress={showDatePicker}
                    style={{marginHorizontal: -5}}>
                    <InputMask
                      label="Fecha"
                      value={birthdayFormatDDMMYYYY}
                      onChangeText={setBirthday}
                      placeholder="--/--/----/"
                      rightIcon={
                        <Icon
                          name="calendar"
                          type="font-awesome"
                          size={20}
                          color={Styles.colors.gris}
                        />
                      }
                      errorMessage={SignUpErrors ? SignUpErrors.birthday : null}
                      type={'datetime'}
                      options={{
                        format: 'DD/MM/YYYY',
                      }}
                      disabled={true}
                    />
                  </Pressable>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    textColor="red"
                    date={birthday}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    minimumDate={new Date('2022-01-17')}
                  />
                </View>
                <View style={{marginBottom: 12}}>
                  <Text style={styles.labelDesign}>Hora</Text>
                  {isLoadingHora ? (
                    <ActivityIndicator
                      size="large"
                      color={css.colors.primary}
                    />
                  ) : (
                    <DropDownPicker
                      placeholder={{}}
                      items={horarios}
                      onValueChange={setHorario}
                      value={horario}
                      style={{
                        inputAndroid: {
                          backgroundColor: 'transparent',
                          // width: Constant.DEVICE.WIDTH / 2 - 30,
                          // margin: -1,
                        },
                        // iconContainer: {top: 5, right: 30},
                      }}
                      useNativeAndroidPickerStyle={false}
                      textInputProps={{
                        underlineColorAndroid: Styles.colors.gris,
                      }}
                      Icon={() => {
                        return (
                          <Icon
                            name="keyboard-arrow-down"
                            type="material"
                            size={30}
                            color={Styles.colors.gris}
                          />
                        );
                      }}
                    />
                  )}
                </View>
              </View>
            </CollapseBody>
          </Collapse>
          <Button
            buttonStyle={[
              css.buttonContainer,
              {backgroundColor: css.colors.primary_opaque},
            ]}
            loading={!(userUpdated && passUpdated)}
            title="Registrar Cita"
            onPress={() => handleRegisterCita()}
            disabled={
              typeof horario == 'string' ||
              typeof specialty == 'string' ||
              typeof patient == 'string'
                ? true
                : false
            }
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    backgroundColor: '#FFF',
    // height: '100%'
    // height: Constant.DEVICE.HEIGHT,
  },
  collapse: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 1,
    backgroundColor: '#FFF',
  },
  collapseHeader: {
    /* flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    padding: 10,
    backgroundColor: '#FFF', */
  },
  collapseBodyTextLabel: {
    fontSize: 16,
  },
  collapseInputText: {
    fontSize: 14,
    borderRadius: 5,
  },
  headerContainer: {
    backgroundColor: '#FFF',
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    height: 70,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  headerTitle: {
    fontSize: 26,
  },
  labelDesign: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

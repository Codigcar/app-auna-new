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
  Platform,
} from 'react-native';
import {Button, Icon, Divider} from 'react-native-elements';
import 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import {useEffect} from 'react';
import {fetchWithToken} from '../../utils/fetchCustom';
import {Styles} from '../../assets/css/Styles';
import {DropDownPicker, InputMask} from '../../components';
import {convertDateDDMMYYYY} from '../../utils/util';
import CitaPopupConfirm from './CitaPopupConfirm';
import BottomSheetScreen from './BottomSheetScreen';
import ElementDropDown from '../../components/ElementDropDown';

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
  console.log('[CitaNewScreen]');

  const [SignUpErrors, setSignUpErrors] = useState({});
  const [userUpdated, setUserUpdate] = useState(true);
  const [passUpdated, setPassUpdate] = useState(true);
  // console.log('[route]:: ', route.params);

  // data para DropDown Especialidad
  const [specialties, setSpecialties] = useState([]);
  const [specialty, setSpecialty] = useState(null);

  // data para DropDown Paciente
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  // datepicker

  //calendar
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const [birthdayFormatDDMMYYYY, setBirthdayFormatDDMMYYYY] = useState(
    convertDateDDMMYYYY(new Date()),
  );

  //horario
  const [horarios, setHorarios] = useState([{label: 'cargando...', value: ''}]);
  const [horario, setHorario] = useState('');
  const [saveListFechas, setSaveListFechas] = useState([]);
  const [isLoadingHora, setIsLoadingHora] = useState(false);

  //habilitar useEffect
  const [isUseEffectDataHorarioXFecha, setIsUseEffectDataHorarioXFecha] =
    useState(false);

  const [isVisiblePopup, setIsVisiblePopup] = useState(false);

  const [citaBody, setCitaBody] = useState({});

  const [isVisibleEspecialidad, setIsVisibleEspecialidad] = useState(false);
  // fechas disponibles
  const [listFechasDisponibles, setListFechasDisponibles] = useState([]);
  const [fechaDisponible, setFechaDisponible] = useState(null);

  /* Functions */

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
    console.log('useEffect');
    fetchDataEspecialidadListar();
    fetchDataPacientesListar();
  }, []);

  const fetchDataEspecialidadListar = async () => {
    try {
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
          value: e['idEspecialidad'],
        };
      });
      setSpecialties(list);
      // setSpecialty(list[0]['value']);
      setIsVisibleEspecialidad(true);
      console.log('isVisibleEspecialidad: ', isVisibleEspecialidad);
    } catch (error) {
      console.error('[CitaNewScreen - fetchDataEspecialidadListar]: ', error)
    }
  };

  const fetchDataPacientesListar = async () => {
    try {
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
  
      if (response.CodigoMensaje === 100) {
        if (response.Result[0].CodigoMensaje) {
          if (response.Result[0].CodigoMensaje !== 100) {
            setPatients([{label: 'No tiene dependientes'}]);
            setPatient('');
            Alert.alert('Error', response.Result[0].RespuestaMensaje);
          } else {
            const list = response.Result.map(e => {
              return {
                label: e['nombrecompleto'],
                value: e['idPersonaAsegurada'],
              };
            });
            setPatients(list);
            // setPatient(list[0]['value']);
          }
        } else {
          const list = response.Result.map(e => {
            return {
              label: e['nombrecompleto'],
              value: e['idPersonaAsegurada'],
            };
          });
          setPatients(list);
          // setPatient(list[0]['value']);
        }
      } else {
        Alert.alert('Error', response.RespuestaMensaje);
      }
    } catch (error) {
      console.error('[CitaNewScreen - fetchDataPacientesListar]: ',error)
    }
  };

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
    try{const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
      IdEspecialidad: 1,
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

      const listFechas = response.Result.map(e => {
        return {
          label: e['Fecha'],
          value: e['fechaDisponible2'],
        };
      });
      setListFechasDisponibles(listFechas);
    }}catch(error){
      console.error('[CitaNewScreen - dataHorarioListar]: ',error)
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
    setIsVisiblePopup(true);
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <ScrollView style={{flex: 1, backgroundColor: 'green'}}> */}
        {/* <CitaPopupConfirm
        isVisiblePopupConfirm={isVisiblePopupConfirm}
        setIsVisiblePopupConfirm={setIsVisiblePopupConfirm}
        citaBody={citaBody}
        navigation={navigation}
        route={route}
      /> */}
        {isVisiblePopup && (
          <BottomSheetScreen
            isVisiblePopup={isVisiblePopup}
            setIsVisiblePopup={setIsVisiblePopup}
            navigation={navigation}
            route={route}
            citaBody={citaBody}
          />
        )}

        <KeyboardAvoidingView
          behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR}
          style={{flex: 1, backgroundColor:'transparent' }}>
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Solicita tu cita médica</Text>
            </View>
            <Divider style={css.dividerTitleLineRed} />
          </View>
          <View style={[styles.container, {backgroundColor: 'transparent', flex:1}]}>
            <Collapse style={styles.collapse} isCollapsed={true}>
              <CollapseHeader />
              <CollapseBody style={{}}>
                <View>
                  <View style={{marginBottom: 12}}>
                    {
                      specialties.length > 0 && <ElementDropDown data={specialties} value={specialty} setValue={setSpecialty}
                         placeholder={'Seleccione la especialidad'} label={'Especialidad'} iconName={'shield-checkmark-outline'} />
                    }
                  </View>
                  <View style={{marginBottom: 12}}>
                    {
                      patients.length > 0 && <ElementDropDown data={patients} value={patient} setValue={setPatient}
                         placeholder={'Seleccione al paciente'} label={'Paciente'} iconName={'person-outline'}/>
                    }
                  </View>
                  <View style={{marginBottom: 12}}>
                  {
                    listFechasDisponibles.length > 0 && <ElementDropDown data={listFechasDisponibles} value={fechaDisponible} setValue={setFechaDisponible}
                         placeholder={'Seleccione la fecha'} label={'Fecha'} iconName={'calendar-outline'}/>
                    }
                  </View>
                  <View style={{marginBottom: 12}}>
                    {
                      horarios.length > 0 && <ElementDropDown data={horarios} value={horario} setValue={setHorario}
                         placeholder={'Seleccione la hora'} label={'Hora'} iconName={'alarm-outline'} />
                    }
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
              titleStyle={{...Platform.select({ios: {fontWeight: 'bold'}})}}
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
      {/* </ScrollView> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: 'transparent',
    borderTopWidth: 2,
    backgroundColor: '#FFF',
    // paddingHorizontal:5
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
  labelOfInputDropDownPicker: {
    ...Platform.select({
      ios: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold',
        marginBottom: 12,
      },
      android: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold',
        marginLeft: 4,
      },
    }),
  },
});

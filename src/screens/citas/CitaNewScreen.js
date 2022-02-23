import {createStackNavigator} from '@react-navigation/stack';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import {validateAll} from 'indicative/validator';
import React, {useLayoutEffect, useState, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Pressable,
  ActivityIndicator,
  Platform,
  ScrollView,
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

  const initiaState = [{label:'cargando...', value:''}]
  const [userUpdated, setUserUpdate] = useState(true);
  const [passUpdated, setPassUpdate] = useState(true);
  // console.log('[route]:: ', route.params);

  // data para DropDown Especialidad
  const [specialties, setSpecialties] = useState(initiaState);
  const [specialty, setSpecialty] = useState(null);

  // data para DropDown Paciente
  const [patients, setPatients] = useState(initiaState);
  const [patient, setPatient] = useState(null);

  // datepicker


  //horario
  const [horarios, setHorarios] = useState(initiaState);
  const [horario, setHorario] = useState(null);
  const [isLoadingHora, setIsLoadingHora] = useState(false);

  //habilitar useEffect
  const [isUseEffectDataHorarioXFecha, setIsUseEffectDataHorarioXFecha] =
    useState(false);

  const [isVisiblePopup, setIsVisiblePopup] = useState(false);

  const [citaBody, setCitaBody] = useState({});

  const [isVisibleEspecialidad, setIsVisibleEspecialidad] = useState(false);
  // fechas disponibles
  const [listFechasDisponibles, setListFechasDisponibles] = useState(initiaState);
  const [fechaDisponibleElegida, setFechaDisponibleElegida] = useState(null);
  const [saveAllFechasDisponibles, setSaveAllFechasDisponibles] = useState([]);

  const runUseEffects = useRef(false);

  useEffect(() => {
    runUseEffects.current && fetchListarFechasDisponibles();
  }, [specialty]);

  useEffect(() => {
    setHorario(null);
    runUseEffects.current && showHorariosDisponibles(fechaDisponibleElegida[0]);
  }, [fechaDisponibleElegida]); 



  useEffect(() => {
    fetchDataEspecialidadListar();
    fetchDataPacientesListar();
    runUseEffects.current = true;
    return () => {
      runUseEffects.current = false;
    };
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
      setIsVisibleEspecialidad(true);
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
          }
        } else {
          const list = response.Result.map(e => {
            return {
              label: e['nombrecompleto'],
              value: e['idPersonaAsegurada'],
            };
          });
          setPatients(list);
        }
      } else {
        Alert.alert('Error', response.RespuestaMensaje);
      }
    } catch (error) {
      console.error('[CitaNewScreen - fetchDataPacientesListar]: ',error)
    }
  };

  const filtrarFechasUnicas = (listFechas) => {
    const tabla = {};
    const listFechasUnicas = listFechas.filter((indice) => {
      return tabla.hasOwnProperty(indice.label) ? false : (tabla[indice.label] = true);
    });
    return listFechasUnicas;
  }

  const fetchListarFechasDisponibles = async() => {
    try{
      setIsLoadingHora(true);
      const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
      IdEspecialidad: specialty,
    });
    const response = await fetchWithToken(
      Constant.URI.GET_HORARIOS_LISTAR_X_ESPECIALIDAD,
      'POST',
      params,
      route.params.userRoot.Token,
    );
    if (response.CodigoMensaje === 100) {
      setSaveAllFechasDisponibles(response.Result);
      const listFechas = response.Result.map(e => {
        return {
          label: e['Fecha'],
          value: [e['fechaDisponible2'],e['fechaDisponible']],
        };
      });
      const listFechasUnicas = filtrarFechasUnicas(listFechas);
      setListFechasDisponibles(listFechasUnicas);

      // reset field 'Hora'
      setHorarios(initiaState);
      setHorario(null);

      setIsLoadingHora(false);
    }}catch(error){
      console.error('[CitaNewScreen - dataHorarioListar]: ',error)
    }
  };

  const handleRegisterCita = () => {
    const patientFiltrado = patients.filter(e => e.value === patient);
    const specialtyFiltrado = specialties.filter(e => e.value === specialty);

    setCitaBody({
      patient_label: patientFiltrado[0].label,
      patient_value: patientFiltrado[0].value,
      specialty_label: specialtyFiltrado[0].label,
      specialty_value: specialtyFiltrado[0].value,
      fecha: fechaDisponibleElegida[1],
      horario: horario,
    });
    setIsVisiblePopup(true);
  };

  const showHorariosDisponibles = (fechaElegida) => {
    saveAllFechasDisponibles.filter(
      e => {
        e['fechaDisponible2'] == fechaElegida;
      }
    );
    const listHorarioXFechaFiltrada = saveAllFechasDisponibles.filter(
      e => e['fechaDisponible2'] == fechaElegida,
    );
    const listHorarios = listHorarioXFechaFiltrada.map(e => {
      return {
        label: e['horaInicio'] + ' - ' + e['horaFin'],
        value: [e['horaInicio'], e['horaFin'], e['fechaDisponible2']],
        value2: e['horaFin'],
      };
    });
    setHorarios(listHorarios);
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        {isVisiblePopup && (
          <BottomSheetScreen
            isVisiblePopup={isVisiblePopup}
            setIsVisiblePopup={setIsVisiblePopup}
            navigation={navigation}
            route={route}
            citaBody={citaBody}
            type={'registerCita'}
          />
        )}
        <KeyboardAvoidingView
          behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR}
          style={{flex: 1, backgroundColor:'transparent' }}>
          <ScrollView style={{backgroundColor:'white'}}>
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
                         placeholder={'Selecciona una especialidad'} label={'Especialidad'} iconName={'shield-checkmark-outline'}  disable={false}/>
                    }
                  </View>
                  <View style={{marginBottom: 12}}>
                    {
                      patients.length > 0 && <ElementDropDown data={patients} value={patient} setValue={setPatient}
                         placeholder={'Selecciona un paciente'} label={'Paciente'} iconName={'person-outline'} disable={false}/>
                    }
                  </View>
                  { isLoadingHora ? <ActivityIndicator color={'red'} size="large" /> 
                    :
                    <View>
                      <View style={{marginBottom: 12}}>
                      {
                        listFechasDisponibles.length > 0 && <ElementDropDown data={listFechasDisponibles} value={fechaDisponibleElegida} setValue={setFechaDisponibleElegida}
                            placeholder={'Selecciona una fecha'} label={'Fecha'} iconName={'calendar-outline'} disable={true}/>
                        }
                      </View>
                      <View style={{marginBottom: 12}}>
                        {
                          horarios.length > 0 && <ElementDropDown data={horarios} value={horario} setValue={setHorario}
                            placeholder={'Selecciona una hora'} label={'Hora'} iconName={'alarm-outline'} disable={true} />
                        }
                      </View>
                    </View>
                  }
                </View>
              </CollapseBody>
            </Collapse>
            <Button
              buttonStyle={[
                {backgroundColor: css.colors.primary_opaque, marginHorizontal:20, borderRadius:10, paddingVertical:10, marginTop:30, marginBottom:30},
              ]}
              loading={!(userUpdated && passUpdated)}
              title="Registrar"
              titleStyle={{
                ...Platform.select({
                  ios: {
                    fontWeight: 'bold'
                  }}
              )}}
              onPress={() => handleRegisterCita()}
              disabled={
                 horario == null ||
                 typeof specialty == 'string' ||
                 typeof patient == 'string'
                  ? true
                  : false
              }
            />
           
          </View>
      </ScrollView>
        </KeyboardAvoidingView>
    </View>
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

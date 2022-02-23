import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import ElementDropDown from '../../components/ElementDropDown';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator'
import { AuthLoadingScreen } from '..';


export default function PolicyClinicaScreen({ navigation, route }) {
  console.log('[PolicyClinicaScreen - 4]');

  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(0);
  
  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState(0);
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
      let uri = Constant.URI.PATH + Constant.URI.GET_CATEGORIAS + '?I_Sistema_IdSistema=' + route.params.userRoot.idSistema + '&I_Riesgo_IdRiesgo=' + route.params.policy.idRiesgo + 
      '&I_PlanAsegurado_idPlanAsegurado=' + (route.params.policy.idPlanAsegurado==null ? 0 : route.params.policy.idPlanAsegurado) + 
      '&I_UsuarioExterno_IdUsuarioExterno=' + route.params.userRoot.idUsuarioExterno;
      fetch(uri, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        }
      }) 
        .then((response) => response.json())
        .then((response) =>
        {
          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199)
          {
            Alert.alert('', response.RespuestaMensaje);
          }
          else
          {
            let list = renderDropDownList(response.Result, 'nombreCategoriaClinica', 'idCategoriaClinicaSistemaRiesgoPlanAsegurado');
            setCategorias(list);

            if(response.Result.length > 0)
            {
              fetch(Constant.URI.PATH + Constant.URI.GET_DEPARTAMENTOS+ '?I_Sistema_IdSistema=' + route.params.userRoot.idSistema + '&I_UsuarioExterno_IdUsuarioExterno=' + route.params.userRoot.idUsuarioExterno, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': route.params.userRoot.Token
                }
              }) 
                .then((response) => response.json())
                .then((response) => {
                  if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199)
                  {
                    Alert.alert('', response.RespuestaMensaje);
                  } 
                  else
                  {
                    let list = renderDropDownList(response.Result, 'nombreDepartamento', 'idDepartamento');
                    setDepartamentos(list);
                  }
                })
                .catch((error) => console.error(error));
            }

          }
        })
        .catch((error) => console.error(error));  


  }, [])

  const renderDropDownList = (items, nameLabel, nameValue) => {
    return items.map((e) => {
      return { label: e[nameLabel], value: e[nameValue] }
    });
  }

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



  const onChangeCategorias = (idCategoriaClinicaSistemaRiesgoPlanAsegurado) => {

    var idDepartamento = departamento;
    var idProvincia = province;
    var idDistrito = district;

    if (idCategoriaClinicaSistemaRiesgoPlanAsegurado == 0 || idDistrito == 0)
    {
      setCategoria(idCategoriaClinicaSistemaRiesgoPlanAsegurado);
      setClinics([]);
    }
    else
    {
      setIsLoading(true);
      setCategoria(idCategoriaClinicaSistemaRiesgoPlanAsegurado);
        fetch(Constant.URI.PATH + Constant.URI.GET_CLINICAS + '?I_Sistema_IdSistema=' + route.params.userRoot.idSistema + '&I_UsuarioExterno_IdUsuarioExterno=' + route.params.userRoot.idUsuarioExterno + '&I_Poliza_IdPoliza=' + route.params.policy.idPoliza + '&I_CategoriaClinicaSistemaRiesgoPlanAsegurado_IdCategoriaClinicaSistemaRiesgoPlanAsegurado=' + idCategoriaClinicaSistemaRiesgoPlanAsegurado + '&I_Departamento_IdDepartamento=' + departamento + '&I_Provincia_IdProvincia=' + province + '&I_Distrito_IdDistrito=' + district,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': route.params.userRoot.Token
          }
        })
          .then((response) => response.json())
          .then((response) => {
            setIsLoading(false);
            if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
              Alert.alert('', response.mensaje);
             } else {
               setClinics(response.Result);
             }
           })
          .catch((error) => console.error(error));
    }
  }


  const onChangeDepartamentos = (idDepartamento) => {
  setDistrict(0);
  setProvince(0);
  if (idDepartamento == 0) {
    setClinics([]);
    setDistrict(0);
    setDistricts([]);
    setProvince(0);
    setProvinces([]);
    setDepartamento(idDepartamento);
  } else {
    setIsLoading(true);
    fetch(Constant.URI.PATH + Constant.URI.GET_PROVINCIAS + '?I_Sistema_IdSistema=' + route.params.userRoot.idSistema + '&I_UsuarioExterno_IdUsuarioExterno=' + route.params.userRoot.idUsuarioExterno + '&I_Departamento_IdDepartamento=' + idDepartamento, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': route.params.userRoot.Token
      }
    })
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
          Alert.alert('', response.mensaje);
        } else {
          let list = renderDropDownList(response.Result, 'nombreProvincia', 'idProvincia');
          setClinics([]);
          setDistrict(0);
          setDistricts([]);
          setProvince(0);
          setProvinces(list);
          setDepartamento(idDepartamento);
        }
      })
      .catch((error) => console.error(error));
      console.log('###################LOG ONCHNG DPTO-  ID_DPTO ES :        ' + idDepartamento );
  }
  }

  const onChangeProvinces = (idProvincia) => {
    setDistrict(0);
    var idDepartamento = departamento ;
    if (idDepartamento && idProvincia == 0) {
      setClinics([]);
      setDistrict(0);
      setDistricts([]);
      setProvince(idProvincia);
    } else {
      setIsLoading(true);
      fetch(Constant.URI.PATH + Constant.URI.GET_DISTRITOS + '?I_Sistema_IdSistema=' + route.params.userRoot.idSistema + '&I_UsuarioExterno_IdUsuarioExterno=' + route.params.userRoot.idUsuarioExterno + '&I_Departamento_IdDepartamento=' + idDepartamento + '&I_Provincia_IdProvincia=' + idProvincia,{
        method: 'POST',     
        headers: {
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        }
      })
        .then((response) => response.json())
        .then((response) => {
          setIsLoading(false);
          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('', response.mensaje);
          } else {
            let list = renderDropDownList(response.Result, 'nombreDistrito', 'idDistrito');
            setClinics([]);
            setDistrict(0);
            setDistricts(list);
            setProvince(idProvincia);
          }
        })
        .catch((error) => console.error(error));
        console.log('###################LOG ONCHNG PROVINC-  ID_DPTO ES :        ' + idDepartamento );
        console.log('###################LOG ONCHNG PROVINC-  ID_PROVN ES :        ' + idProvincia );
    }
  }

  const onChangeDistritos = (idDistrito ) => {
    var idCategoriaClinicaSistemaRiesgoPlanAsegurado = categoria ;
    var idDepartamento = departamento;
    var idProvincia = province;

    if (idCategoriaClinicaSistemaRiesgoPlanAsegurado == 0 || idDistrito == 0)
    {
      setCategoria(idCategoriaClinicaSistemaRiesgoPlanAsegurado);
      setClinics([]);
      setDistrict(0);
    }
    else
    {
      setIsLoading(true);
      setCategoria(idCategoriaClinicaSistemaRiesgoPlanAsegurado);
        fetch(Constant.URI.PATH + Constant.URI.GET_CLINICAS + '?I_Sistema_IdSistema=' + route.params.userRoot.idSistema + '&I_UsuarioExterno_IdUsuarioExterno=' + route.params.userRoot.idUsuarioExterno + '&I_Poliza_IdPoliza=' + route.params.policy.idPoliza + '&I_CategoriaClinicaSistemaRiesgoPlanAsegurado_IdCategoriaClinicaSistemaRiesgoPlanAsegurado=' + idCategoriaClinicaSistemaRiesgoPlanAsegurado + '&I_Departamento_IdDepartamento=' + departamento + '&I_Provincia_IdProvincia=' + province + '&I_Distrito_IdDistrito=' + idDistrito,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': route.params.userRoot.Token
          }
        })
          .then((response) => response.json())
          .then((response) => {
            setIsLoading(false);
            if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
              Alert.alert('', response.mensaje);
             } else {
              setClinics(response.Result);
              setDistrict(idDistrito);
             }
           })
          .catch((error) => console.error(error));
    }
  }

  /////////////////////////////////////////////////////////////
 
  if (categorias.length === 0) {
    return(
      <AuthLoadingScreen />
    )
  }
  

  const renderHeader = () => {
    return (
      <View style={styles.pickers_container}>
        <View style={{ width:"100%", marginBottom:Platform.select({ android:10, ios:10 }) }}>
        
          <ElementDropDown data={categorias} value={categoria} setValue={onChangeCategorias}
                         placeholder={'Selecciona una categoria'} label={'Categoría de clínicas'} iconName={'shield-checkmark-outline'}  disable={false}/>

        </View>
        <View style={{width:"100%", marginBottom:Platform.select({ android:10, ios:10 }) }}>

          <ElementDropDown data={departamentos} value={departamento} setValue={onChangeDepartamentos}
                         placeholder={'Selecciona un departamento'} label={'Departamento'} iconName={'shield-checkmark-outline'}  disable={false}/>
                         
        </View>
        {
          isLoading ? (<LoadingActivityIndicator />) :
          (
           <>
              <View style={{width:"100%", marginBottom:Platform.select({ android:10, ios:10 }) }}>
                {
                <ElementDropDown data={provinces} value={province} setValue={onChangeProvinces}
                                        placeholder={'Selecciona una provincia'} label={'Provincia'} iconName={'shield-checkmark-outline'}  disable={true}/>
                }
                            
            </View>
            <View style={{width:"100%", marginBottom:Platform.select({ android:10, ios:10 }) }}>
              {
                <ElementDropDown data={districts} value={district} setValue={onChangeDistritos}
                            placeholder={'Selecciona un distrito'} label={'Distrito'} iconName={'shield-checkmark-outline'}  disable={false}/>
              }
                
            </View>
           </>
          )
        }
      </View>
    )
  }

  const renderEmpty = () => {
    return (
      <View style={{ alignItems: "center", margin: 20 }}>
        <Text style={{ fontSize: 14, color: css.colors.opaque }}>No se encontraron clínicas cercanas</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={clinics}
      keyExtractor={(item, index) => String.valueOf(item.idClinicaDetalle) + `${index}`}
      style={{ backgroundColor: '#FFF' }}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      renderItem={({ item }) =>
        <View style={[styles.card_container, css.designElevationCardiOS]}>
          <View style={{ height: 80, width: '75%', backgroundColor: 'white', justifyContent: "space-between" }}>
            <Text style={[styles.card_text, { fontSize: 15, fontWeight: "bold" }]}> {item.nombreCortoClinicaDetalle}</Text>
            <View style={{ flexDirection: "row" }}>
              <Avatar size={20} rounded
                overlayContainerStyle={styles.card_icon}
                icon={{ name: 'map-marker', type: 'material-community', color: '#000' }}
              />
              <TouchableOpacity onPress={() => { Linking.openURL(item.enlaceGeolocalizacionDetalle) }} activeOpacity={0.7} style={{ marginLeft: 5 }}>
                <Text style={styles.card_text}>{item.direccionClinicaDetalle}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Avatar size={20} rounded
                overlayContainerStyle={styles.card_icon}
                icon={{ name: 'phone-classic', type: 'material-community', color: '#000' }}
              />
              <TouchableOpacity onPress={() => callPhone(item.telefonoFijoClinicaDetalle)} activeOpacity={0.7} style={{ marginLeft: 5 }}>
                <Text style={styles.card_text}>{item.telefonoFijoClinicaDetalle}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => callPhone(item.telefonoFijoClinicaDetalle)} activeOpacity={0.7} style={{ marginLeft: 5 }}>
                <Text style={styles.card_text}>{item.telefonoFijo != "" ? " -  anexo " + item.anexoTelefonoFijoClinicaDetalle : null}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginLeft:0, paddingLeft:0}}>
            <Avatar size={35} rounded
              avatarStyle={{ opacity: 1 }}
              source={Constant.GLOBAL.IMAGES.POLICY_CLINICA_MAPS}
              onPress={() => { Linking.openURL(item.enlaceGeolocalizacionDetalle)}}
            />
          </View>
        </View>

      }
    />
  );
}



const styles = StyleSheet.create({

  card_container: {
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
  pickers_container: {
    backgroundColor: 'white',
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingRight: 20,
    margin: 10,
    marginTop: 30,
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
  card_icon: {
    borderWidth: 1,
    borderColor: css.colors.opaque
  },
  card_text: {
    color: css.colors.opaque
  }, 
  divider: {
    backgroundColor: "black",
    padding: 3
  },

});
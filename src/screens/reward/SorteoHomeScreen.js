import {View} from 'native-base';
import React, {useState} from 'react';
import {FlatList, Image} from 'react-native';
import {Avatar, Icon, Text} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import giftbox from '../../assets/svg/giftbox';
import {css} from '../../utils/css';

export const SorteoHomeScreen = () => {
  console.log('[SorteoHomeScreen]');
  const [items, setItems] = useState([
    {
      CodigoMensaje: 100,
      RespuestaMensaje: 'Ejecutivos encontrados.',
      idFuncionarioInternoDetalle: 205,
      nombre: 'Paola',
      apellidoPaterno: 'Sosa',
      cargo: 'EJECUTIVO DE CUENTA',
      telefonoMovil: '939175828',
      telefonoFijo: '',
      anexoTelefonoFijo: '',
      correoElectronico: 'psosa@laprotectora.com.pe',
      ocultarTelefonoFijo: 1,
      ocultarAnexo: 1,
      riesgos: [
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 5,
          nombreRiesgo: 'Premio1',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/sctrsalud.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 6,
          nombreRiesgo: 'Premio2',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/sctrpension.png',
        },
        {
          CodigoMensaje: 100,
          RespuestaMensaje: 'RIESGO ENCONTRADO',
          idRiesgo: 13,
          nombreRiesgo: 'Premio3',
          rutaRiesgo:
            'https://app.laprotectora.com.pe/app_web_assets/app_laprotectora_movil/AppCE/asistenciamedica.png',
        },
      ],
    },
  ]);

  function Imagenes(props) {
    const items = props.items;
    console.log(
      'PANTALLA EJECUTIVOSHomeScreen imagenes: ' + JSON.stringify(props.items),
    );
    return (
      <FlatList
        // persistentScrollbar={true}
        data={items}
        horizontal={true}
        keyExtractor={(item, index) =>
          String.valueOf(item.idRiesgo) + `${index}`
        }
        renderItem={({item, index}) => (
          <>
            {item.idRiesgo == 0 ? (
              <></>
            ) : (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  //   elevation: 11,
                  marginRight: 0,
                  //   backgroundColor: 'transparent',
                  borderRadius: 10,
                  margin: 15,
                  //   padding: 0,
                  //   borderWidth: 1,
                  //   borderColor: 'rgba(0, 0, 0, 0.14)',
                  shadowOpacity: 0.39,
                  shadowRadius: 13.97,
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    // marginBottom: 30,
                  }}>
                  <Avatar
                    size={70}
                    rounded
                    // source={{ uri: SV_RutaImagen }}
                    icon={{name: 'gift-outline', type: 'ionicon', size: 40, color:css.colors.primary_opaque}}
                    containerStyle={{
                      backgroundColor: 'white',
                      shadowColor: css.colors.primary_opaque,
                      shadowOffset: {
                        width: 0,
                        height: 12,
                      },
                      shadowOpacity: 0.58,
                      shadowRadius: 16.0,

                      elevation: 24,
                    }}
                  />
                  <Text style={{paddingTop: 20}}>{item.nombreRiesgo}</Text>
                </View>
              </View>
            )}
          </>
        )}
      />
    );
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        {/* <SvgXml
          xml={giftbox}
          height={150}
          width={'100%'}
          style={{
            backgroundColor: '#FAFAFA'
          }}
        /> */}
        <Image
                style={{  height:140,resizeMode:'cover', width:'100%'}}
                source={require('../../assets/box.png')}
                PlaceholderContent={<Text></Text>}
              />
        <Text
          style={{textAlign: 'center', marginHorizontal: 20, marginTop:15}}>
          <Text style={{fontSize: 17}}>¡Sé uno de los</Text>
          <Text style={{color: css.colors.primary_opaque, fontSize: 30}}>
            10 ganadores
          </Text>
          <Text style={{fontSize: 17}}>
            {' '}
            mensuales de nuestros super premios!
          </Text>
        </Text>
        <View >
          <Imagenes items={items[0].riesgos} />
        </View>
        <View style={{ display:'flex', flexDirection:'row', justifyContent:'center'}} >
            <View style={{ borderWidth:.8, borderColor:'#DCDDE0', width:200,borderRadius:10, padding:10, display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center' }} >
                <View style={{textAlign:'center', backgroundColor:'transparent'}} >
                    <Text style={{textAlign:'center', fontSize:13}} >Tu ticket</Text>
                    <Text style={{textAlign:'center', fontSize:25, fontWeight:'bold'}} >N° 321</Text>
                </View>
               <View style={{textAlign:'center', backgroundColor:'transparent', display:'flex', flexDirection:'row', justifyContent:'center'}}>
                <Icon
                    name="ticket-alt"
                    type="fontisto"
                    size={40}
                    color={css.colors.primary_opaque}
                    />
               </View>
            </View>
        </View>
        <View style={{marginVertical:30}}>
            <View style={{backgroundColor:'#FEF4E8', marginHorizontal:20, borderRadius:7, padding:5}}>
                <View style={{backgroundColor:'white', padding:5,borderRadius:7,}}>
                    <View  style={{backgroundColor:'#FEF4E8',borderRadius:7, padding:10}}>
                        <Text>Importante: Por cada mes que ingreses tendrás automáticamente un número de ticket con el que podrás participar en nuestros increibles sorteos mensuales. Una vez ganador te llegará un mensaje a tu correo en menos de 24h</Text>
                    </View>
                </View>
            </View>
        </View>
        <View style={{backgroundColor:'transparent', marginBottom:40}} >
            <Text style={{textAlign:'center', textDecorationLine:'underline'}} >Ver términos de uso</Text>
            <Text style={{textAlign:'center', textDecorationLine:'underline'}}>Ver Política de Privacidad</Text>
        </View>
    </ScrollView>
  );
};

export default SorteoHomeScreen;

import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import FileViewer from 'react-native-file-viewer';
import { AuthLoadingScreen } from '..';



export default function PolicyDocumentScreen({ navigation, route }) {
  console.log('[PolicyDocumentScreen - 3]');
  
  const [items, setItems] = useState([]);

  useEffect(() => {

    if (items.length === 0) {

      fetch(Constant.URI.PATH + Constant.URI.GET_POLICY_DOCUMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        },
        body: JSON.stringify({
          "I_Sistema_IdSistema": route.params.userRoot.idSistema,
          "I_Poliza_IdPoliza": route.params.policy.idPoliza,
          "I_UsuarioExterno_IdUsuarioExterno": route.params.userRoot.idUsuarioExterno,
          "I_IdPlanAseguradoRiesgoSistema": route.params.policy.idPlanAseguradoRiesgoSistema
        })
      })
        .then((response) => response.json())
        .then((response) => {

          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            setItems(response);
          }
        })
        .catch((error) => console.error(error));
    }
  })

  const checkPermission = async (url, ext) => {
    if (!url || !ext) {
      Alert.alert('Error', 'Ponerse en contacto con el Administrador del sistema.');
    }
    url = validateUrl(url);
    
    if (Platform.OS === 'ios') {
      downloadImage(url, ext);
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
          downloadImage(url, ext);
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

  const downloadImage = (url, ext) => {
  try{
    let date = new Date();

    const { config, fs, ios } = RNFetchBlob;
    let dir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      path: dir + '/la_protectora_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: dir + '/la_protectora_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
        description: 'La Protectora - Colaboradores Empresas'
      },
    };
    
    
    config(options)
      .fetch('GET', url)
      .then(res => {
        Alert.alert('Éxito', 'Archivo descargado con éxito en la siguiente ruta: \n' + res.path());
        if (Platform.OS === 'ios') {
          ios.openDocument(res.path());
        }else{
          FileViewer.open(res.path());
        }
        //
      })
      .catch((e) => console.error(e));
    } catch (e) {
      Alert.alert('Error', 'Error al descargar archivo');
    }
  };

  if (items.length === 0) {
    return(
      <AuthLoadingScreen />
    )
  }


  return (
    <SafeAreaView style={css.screen}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => String.valueOf(item.idDocumentoPoliza) + `${index}`}
        renderItem={({ item }) =>
          <ScrollView>
            <View style={styles.container}>
              <Detail item={item} />
              <View style={{ justifyContent: "space-around", alignItems: "center" }}>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={Constant.GLOBAL.IMAGES.POLICY_DOCUMENTS}>
                </Image>

                <Button
                  onPress={() => checkPermission(item.ruta, item.extensionArchivo)}
                  title="Ver documento"
                  buttonStyle={{ width: 100, height: 30, backgroundColor: '#19D692' }}
                  titleStyle={{ fontSize: 11, color: '#FFF' }}
                />
              </View>
            </View>
          </ScrollView>
        }
      />
    </SafeAreaView>
  );
}

function Detail(props) {
  const item = props.item;
  return (
    <View style={{ flexDirection: "column", width: Dimensions.get('window').width - 150 }}>
      <View style={styles.viewSlot}>
        <Text style={StyleSheet.flatten([styles.labelText, { color: "#000", fontWeight: "bold" }])}>N° de documento</Text>
        <Text style={StyleSheet.flatten([styles.outputText, { color: "#000", fontWeight: "bold" }])}>{item.numeroDocumentoPoliza}</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewSlot}>
        <Text style={styles.labelText}>Tipo</Text>
        <View style={{ width: 150, alignItems: "flex-end" }}>
          <Text style={styles.outputText}>{item.nombreTipoArchivo}</Text>
        </View>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewSlot}>
        <Text style={styles.labelText}>Archivo</Text>
        <View style={{ width: 150, alignItems: "flex-end" }}>
          <Text style={styles.outputText}>{item.nombreArchivo}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 10,
    margin: 10,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 0,
    borderColor: '#C0C0C0',
    ...Platform.select({
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    })
  },
  viewSlot: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  labelText: {
    fontSize: 16,
    color: css.colors.opaque,
  },
  outputText: {
    fontSize: 16,
    marginLeft: 10,
    color: css.colors.opaque,
    textAlign: "right"
  },
  divider: {
    backgroundColor: css.colors.opaque,
    padding: 0.2,
    margin: 2
  },
});
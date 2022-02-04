import {CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image as RImage,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, Image} from 'react-native-elements';
import {ButtonInitial} from '../../components';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import PolicyDetailScreen from './PolicyDetailScreen';
import PolicyDetailScreen2 from './PolicyDetailScreen2';
import PolicyDetailScreen3 from './PolicyDetailScreen3';
import PolicyDetailScreen4 from './PolicyDetailScreen4';
import PolicyRiskGroupScreen from './PolicyRiskGroupScreen';
import PopupTicket from '../reward/PopupTicket';


export default function PolicyHomeScreen({navigation, route}) {
  console.log('PolicyHomeScreen');
  // console.log('[PolicyHomeScreen]: ',route);
  useEffect(
    () =>
      navigation.addListener('tabPress', e => {
        navigation.navigate('PolicyHome');
      }),
    [navigation],
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PolicyHome"
        component={HomeScreen}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
        options={{
          // headerShown:true,
          headerTintColor: 'royalblue',
          headerStyle: {
            // backgroundColor: 'rgba(0,0,0, .2)',
          },
          headerTitle: null,
          headerLeft: () => (
            <RImage
              style={{width: 120, height: 30, marginLeft: 10}}
              source={Constant.GLOBAL.IMAGES.TITLE_LOGO}
            />
          ),
          headerRight: () => (
            <ButtonInitial
              navigation={navigation}
              nombre={route.params.userRoot.nombre}
              apellido={route.params.userRoot.apellidoPaterno}
              dataScreen={'PolicyDataScreen'}
            />
          ),
        }}
      />
      <Stack.Screen
        name="PolicyRiskGroupScreen"
        component={PolicyRiskGroupScreen}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
      />
      <Stack.Screen
        name="PolicyDetailScreen"
        component={PolicyDetailScreen}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
      />
      <Stack.Screen
        name="PolicyDetailScreen2"
        component={PolicyDetailScreen2}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
      />
      <Stack.Screen
        name="PolicyDetailScreen3"
        component={PolicyDetailScreen3}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
      />
      <Stack.Screen
        name="PolicyDetailScreen4"
        component={PolicyDetailScreen4}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({navigation, route}) {
  const [items, setItems] = useState([]);
  const [isViewPopupTicket, setIsViewPopupTicket] = useState(true);
  const [messageTicket, setMessageTicket] = useState('');
  useEffect(() => {
    if (items.length === 0) {
      fetch(Constant.URI.PATH + Constant.URI.GET_POLICY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: route.params.userRoot.Token,
        },
        body: JSON.stringify({
          I_Sistema_IdSistema: route.params.userRoot.idSistema,
          I_UsuarioExterno_IdUsuarioExterno:
            route.params.userRoot.idUsuarioExterno,
        }),
      })
        .then(response => response.json())
        .then(response => {
          // console.log('PolicyHomeScreen response: ' + JSON.stringify(response));

          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            setItems(response);
          }
        })
        .catch(error => console.error(error));
    }
  }, []);

  if (items.length === 0) {
    return <AuthLoadingScreen />;
  }

  const fetchDataRegistrarSorteo = async () => {
    const params = new URLSearchParams({
      I_Sistema_IdSistema: route.params.userRoot.idSistema,
      I_UsuarioExterno_IdUsuarioExterno: route.params.userRoot.idUsuarioExterno,
    });
    const response = await fetchWithToken(
      Constant.URI.POST_REGISTRAR_USUARIO_SORTEO,
      'POST',
      params,
      route.params.userRoot.Token,
    );

    if (response.CodigoMensaje === 100) {
      if (response.Result[0].CodigoMensaje === 100) {
        setMessageTicket('');
      }
    } else {
      Alert.alert('Error', response.RespuestaMensaje);
    }
  };

  return (
    <Fragment>
    {isViewPopupTicket && <PopupTicket />}
      <SafeAreaView style={css.screen}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Tus Pólizas</Text>
            {route.params.userRoot.nombreClientePotencial === 'AUNA' ? (
              <Image
                style={[styles.cardImageAUNA, { resizeMode:'contain' }]}
                source={{uri: route.params.userRoot.imagenClientePotencial}}
                PlaceholderContent={<Text></Text>}
              />
            ) : (
              <Text
                style={StyleSheet.flatten([
                  styles.headerTitle,
                  {fontWeight: 'bold'},
                ])}>
                {route.params.userRoot.nombreClientePotencial}
              </Text>
            )}
          </View>
          <Divider style={css.dividerTitleLineRed} />
        </View>
        <FlatList
          contentContainerStyle={styles.container}
          snapToAlignment="center"
          data={items}
          numColumns={2}
          keyExtractor={(item, index) =>
            String.valueOf(item.idGrupoRiesgo) + `${index}`
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('PolicyRiskGroupScreen', {riskGroup: item})
              }>
              <Image
                style={styles.cardImage}
                source={{uri: item.rutaImagenGrupoRiesgo}}
                PlaceholderContent={<AuthLoadingScreen />}
              />
              <Text style={styles.cardText}>{item.nombreGrupoRiesgo}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Fragment>
  );
}

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFF',
    borderTopColor: '#d41c1c',
    borderTopWidth: 2,
    height: 70,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 22,
  },
  viewSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    marginBottom: 12,
    marginTop: 12,
    padding: 5,
  },
  container: {
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 40,
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 10,
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  cardImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    margin: 10,
    borderRadius: Dimensions.get('window').width / 2,
  },
  cardImageAUNA: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    // margin: 10,
    // borderRadius: Dimensions.get('window').width / 2,
  },
  cardText: {
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  popup: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
  },
});

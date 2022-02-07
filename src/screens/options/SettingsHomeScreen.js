import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, ListItem, SocialIcon} from 'react-native-elements';
import {ButtonInitial} from '../../components';
import {DataScreen} from '../../screens';
import Constant from '../../utils/constants';
import {css} from '../../utils/css';
import AgentHomeScreen from '../agent/AgentHomeScreen';
import FuncionariosScreen from '../../screens/agent/FuncionariosScreen';
import CitaScreen from '../../screens/citas/CitaScreen';
import RewardHomeScreen from '../../screens/reward/RewardHomeScreen';

console.log('SettingsHomeScreen');

const DATA = [
  {
    title: 'Datos personales',
    name: 'SettingsDataScreen',
    screen: DataScreen,
    icon: 'account-outline',
    icon_type: 'material-community',
  },
  {
    title: 'Ejecutivos',
    name: 'AgentHomeScreen',
    screen: AgentHomeScreen,
    icon: 'phone',
    icon_type: 'material-community',
  },
  {
    title: 'Funcionarios Auna',
    name: 'FuncionariosScreen',
    screen: FuncionariosScreen,
    icon: 'account-outline',
    icon_type: 'material-community',
  },
  {
    title: 'Mis Citas',
    name: 'CitaScreen',
    screen: CitaScreen,
    icon: 'medical-bag',
    icon_type: 'material-community',
  },
  {
    title: 'Sorteos',
    name: 'RewardHomeScreen',
    screen: RewardHomeScreen,
    icon: 'wallet-giftcard',
    icon_type: 'material-community',
  },
  {
    title: 'Cerrar sesión',
    name: 'Signout',
    icon: 'logout',
    icon_type: 'material-community',
  },
];

export default function SettingsHomeScreen({navigation, route}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(
    () =>
      navigation.addListener('tabPress', e => {
        navigation.navigate('SettingsHome');
      }),
    [navigation],
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsHome"
        component={HomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
        options={{
          headerTitle: null,
          headerLeft: () => (
            <Image
              style={{width: 120, height: 30, marginLeft: 10}}
              source={Constant.GLOBAL.IMAGES.TITLE_LOGO}
            />
          ),
          headerRight: () => (
            <ButtonInitial
              navigation={navigation}
              nombre={route.params.userRoot.nombre}
              apellido={route.params.userRoot.apellidoPaterno}
              dataScreen={'SettingsDataScreen'}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SettingsDataScreen"
        component={DataScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({navigation, route}) {
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (!network) {
      fetch(
        Constant.URI.PATH +
          Constant.URI.GET_SOCIAL_NETWORKS +
          '?I_Sistema_IdSistema=' +
          route.params.userRoot.idSistema,
        {
          headers: {
            Authorization: route.params.userRoot.Token,
          },
        },
      )
        .then(response => response.json())
        .then(response => {
          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            setNetwork(response);
          }
        })
        .catch(error => console.error(error));
    }
  });

  const renderItem = item => {

    if((item.title === "Citas" && route.params.userRoot.nombreClientePotencial !== "AUNA") || (item.title === "Citas" && route.params.userRoot.nombreClientePotencial !== "AUNA")){
      return (
        <></>
      )
    }

    return (
      <ListItem
        title={item.title}
        leftIcon={{name: item.icon, type: item.icon_type, size: 24}}
        onPress={() => navigation.navigate(item.name)}
        chevron={{size: 24}}
        containerStyle={{
          borderBottomColor: css.colors.opaque,
          borderBottomWidth: 1,
        }}
        bottomDivider
      />
    );
  };

  const openURL = (url, appname) => {
    if (url) {
      Linking.openURL(url)
        .then()
        .catch(() => {
          Alert.alert(
            'Error',
            'No tiene la aplicación ' + appname + ' instalada.',
          );
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <Avatar
            rounded
            size="large"
            title={`${route.params.userRoot.nombre.substring(
              0,
              1,
            )}${route.params.userRoot.apellidoPaterno.substring(0, 1)}`}
            containerStyle={{margin: 5, padding: 3}}
            overlayContainerStyle={{
              backgroundColor: '#DE0B21',
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
            }}
          />
          <View style={styles.headerSubContainer}>
            <Text style={styles.headerTitle}>
              {route.params.userRoot.nombre}
            </Text>
            <Text style={styles.headerSubTitle}>
              {route.params.userRoot.correoElectronico}
            </Text>
          </View>
        </View>
        <View>
          <FlatList
            data={DATA}
            renderItem={({item}) => { 
              return renderItem(item);
            }}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
      <View style={{padding: 10}}>
        <Text style={{fontSize: 14}}>Síguenos en: </Text>
        <View style={{flexDirection: 'row'}}>
          {network != null && network.facebook != null ? (
            <Avatar
              size={30}
              source={{uri: network.facebook_imagen}}
              onPress={() => openURL(network.facebook, 'Facebook')}
              activeOpacity={0.7}
              containerStyle={{margin: 5}}
            />
          ) : null}
          {network != null && network.twitter != null ? (
            <Avatar
              size={30}
              source={{uri: network.twitter_imagen}}
              onPress={() => openURL(network.twitter, 'Twitter')}
              activeOpacity={0.7}
              containerStyle={{margin: 5}}
            />
          ) : null}
          {network != null && network.linkedin != null ? (
            <Avatar
              size={30}
              source={{uri: network.linkedin_imagen}}
              onPress={() => openURL(network.linkedin, 'LinkedIn')}
              activeOpacity={0.7}
              containerStyle={{margin: 5}}
            />
          ) : null}
          {network != null && network.youtube != null ? (
            <Avatar
              size={30}
              source={{uri: network.youtube_imagen}}
              onPress={() => openURL(network.youtube, 'YouTube')}
              activeOpacity={0.7}
              containerStyle={{margin: 5}}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopColor: '#FF0000',
    borderTopWidth: 2,
    paddingTop: 5,
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
  headerSubContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  headerImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    margin: 10,
    borderRadius: Dimensions.get('window').width / 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubTitle: {
    fontSize: 14,
    color: css.colors.opaque,
  },
});

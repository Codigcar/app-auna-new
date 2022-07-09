import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Image, Icon} from 'react-native-elements';
import {
  Alert,
} from 'react-native';
import {AuthContext} from '../components/authContext';
import {
  AgentHomeScreen,
  PolicyHomeScreen,
  FuncionariosScreen,
  CitaScreen,
  CitaNewScreen,
  RewardHomeScreen,
} from '../screens';
import {css} from '../utils/css';
import AuthLoadingScreen from './auth/AuthLoadingScreen';
import SettingsHomeScreen from './options/SettingsHomeScreen';
import ContactScreen from './options/ContactScreen';
import CarouselScreen from './carousel/CarouselScreen';

import Constant from '../utils/constants';
import {fetchWithToken} from '../utils/fetchCustom';
import LoadingActivityIndicator from '../components/LoadingActivityIndicator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const sizeBottomIcon = 30;

export default function TabScreen({navigation, route}) {
  // console.log('route TabScreen: ' + JSON.stringify(route))
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
      <Stack.Screen
        name="AgentHomeScreen"
        component={AgentHomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
      <Stack.Screen
        headerShown="false"
        name="FuncionariosScreen"
        component={FuncionariosScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
      <Stack.Screen
        headerShown="false"
        name="CitaScreen"
        component={CitaScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
      <Stack.Screen
        headerShown="false"
        name="CitaNewScreen"
        component={CitaNewScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
      <Stack.Screen
        headerShown="false"
        name="RewardHomeScreen"
        component={RewardHomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
      />
      <Stack.Screen name="Signout" component={Logout} />
    </Stack.Navigator>
  );
}

function HomeScreen({navigation, route}) {
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBannerListar();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchBannerListar = async () => {
    try {
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
      });
      const response = await fetchWithToken(
        Constant.URI.GET_LISTAR_BANNERS,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      if (isMounted.current) {
        if (response.CodigoMensaje === 100) {
          setBanners(response.Result);
          setIsLoading(false);
        } else {
          console.error(
            '[CarouselScreen - fetchBannerListar error]: ',
            response,
          );
          setIsLoading(false);
          Alert.alert('Error', 'Intentelo nuevamente en unos minutos');
        }
      }
    } catch (error) {
      console.error('[CarouselScreen - fetchBannerListar error]: ', error);
      Alert.alert('Error', 'Intentelo nuevamente en unos minutos');
    }
  };

  if(isLoading){
    return <LoadingActivityIndicator />
  }

  {/* Solo para usuarios AUNA */}

  if(!isLoading)
  {
    return <Tab.Navigator
      lazy={true}
        initialRouteName="Inicio"
        tabBarOptions={{
          activeTintColor: css.colors.primary,
        }}>
        {
          (banners.length !== 0 )  ? 
          (<>
          <Tab.Screen
              name="Inicio"
              component={CarouselScreen}
              initialParams={{ userRoot: route.params.userRoot }}
              options={{
                tabBarLabel: 'Inicio',
                tabBarIcon: () => (
                  <Icon
                    name="home"
                    type="feather"
                    size={sizeBottomIcon}
                    color={css.colors.opaque} />
                ),
              }} /><Tab.Screen
                name="PolicyHomeScreen"
                component={PolicyHomeScreen}
                initialParams={{ userRoot: route.params.userRoot }}
                options={{
                  tabBarLabel: 'Pólizas',
                  tabBarIcon: () => (
                    <Icon
                      name="shield"
                      type="feather"
                      size={sizeBottomIcon}
                      color={css.colors.opaque} />
                  ),
                }} /><Tab.Screen
                name="ContactScreen"
                component={ContactScreen}
                initialParams={{ userRoot: route.params.userRoot }}
                options={{
                  tabBarLabel: 'Contactos',
                  tabBarIcon: () => (
                    <Icon
                      name="person-outline"
                      type="material-icon"
                      size={sizeBottomIcon}
                      color={css.colors.opaque} />
                  ),
                }} /><Tab.Screen
                name="SettingsHomeScreen"
                component={SettingsHomeScreen}
                initialParams={{ userRoot: route.params.userRoot }}
                options={{
                  tabBarLabel: 'Más',
                  tabBarIcon: () => (
                    <Icon
                      name="more-horizontal"
                      type="feather"
                      size={sizeBottomIcon}
                      color={css.colors.opaque} />
                  ),
                }} />
                </>
) : (

  <>
                <Tab.Screen
                name="PolicyHomeScreen"
                component={PolicyHomeScreen}
                initialParams={{ userRoot: route.params.userRoot }}
                options={{
                  tabBarLabel: 'Pólizas',
                  tabBarIcon: () => (
                    <Icon
                      name="shield"
                      type="feather"
                      size={sizeBottomIcon}
                      color={css.colors.opaque} />
                  ),
                }} /><Tab.Screen
                  name="ContactScreen"
                  component={ContactScreen}
                  initialParams={{ userRoot: route.params.userRoot }}
                  options={{
                    tabBarLabel: 'Contactos',
                    tabBarIcon: () => (
                      <Icon
                        name="person-outline"
                        type="material-icon"
                        size={sizeBottomIcon}
                        color={css.colors.opaque} />
                    ),
                  }} /><Tab.Screen
                  name="SettingsHomeScreen"
                  component={SettingsHomeScreen}
                  initialParams={{ userRoot: route.params.userRoot }}
                  options={{
                    tabBarLabel: 'Más',
                    tabBarIcon: () => (
                      <Icon
                        name="more-horizontal"
                        type="feather"
                        size={sizeBottomIcon}
                        color={css.colors.opaque} />
                    ),
                  }} />
      </>


)
        }
          </Tab.Navigator>
  }

}

function Logout({navigation}) {
  const {signOut} = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => navigation.addListener('focus', () => signOut()), []);

  return <AuthLoadingScreen />;
}

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {Image, Icon} from 'react-native-elements';
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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      tabBarOptions={{
        activeTintColor: css.colors.primary,
      }}>

      <Tab.Screen
        name="Inicio"
        component={CarouselScreen}
        initialParams={{userRoot: route.params.userRoot}}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: () => (
            <Icon
              name="home"
              type="feather"
              size={sizeBottomIcon}
              color={css.colors.opaque}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PolicyHomeScreen"
        component={PolicyHomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
        options={{
          tabBarLabel: 'Pólizas',
          tabBarIcon: () => (
            <Icon
              name="shield"
              type="feather"
              size={sizeBottomIcon}
              color={css.colors.opaque}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ContactScreen"
        component={ContactScreen}
        initialParams={{userRoot: route.params.userRoot}}
        options={{
          tabBarLabel: 'Contactos',
          tabBarIcon: () => (
            <Icon
              name="person-outline"
              type="material-icon"
              size={sizeBottomIcon}
              color={css.colors.opaque}
            />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsHomeScreen"
        component={SettingsHomeScreen}
        initialParams={{userRoot: route.params.userRoot}}
        options={{
          tabBarLabel: 'Más',
          tabBarIcon: () => (
            <Icon
              name="more-horizontal"
              type="feather"
              size={sizeBottomIcon}
              color={css.colors.opaque}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
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

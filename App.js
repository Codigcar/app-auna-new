import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Fragment, useEffect, useMemo, useReducer } from 'react';
import { SafeAreaView, Image, StatusBar, Platform } from 'react-native';
import 'react-native-gesture-handler';
import { AuthContext } from './src/components/authContext';
import {
  AuthLoadingScreen,
  ForgotPasswordScreen,
  LoginScreen,
  RegisterScreen,
  VerifySMSScreen,
  UpdatePersonalInfoScreen
} from './src/screens';
import TabScreen from './src/screens/TabScreen';
import Constant from './src/utils/constants';
import { initialState, reducer, stateConditionString } from './src/utils/helpers';
console.disableYellowBox = true;

const Stack = createStackNavigator();

const createLoginStack = (sessionToken) => {
  if (sessionToken != null) {
    return (
      <Stack.Screen
        name="TabScreen"
        component={TabScreen}
        initialParams={{ userRoot: JSON.parse(sessionToken) }}
      />
    );
  } else {
    return (
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    );
  }
};

export default App = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let sessionToken;

      try {
        sessionToken = await AsyncStorage.getItem('sessionToken');
      } catch (e) {
      }
      dispatch({ type: 'RESTORE_TOKEN', userRoot: sessionToken });
    };
    bootstrapAsync();
  }, []);

  const authContextValue = useMemo(
    () => ({
      signIn: async (data) => {
        if (data !== undefined) {
          dispatch({ type: 'SIGN_IN', userRoot: data });
        } else {
          dispatch({ type: 'TO_SIGNIN_PAGE' });
        }
      },
      signOut: async (data) => {
        await AsyncStorage.clear();
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        if (data !== undefined) {
          dispatch({ type: 'TO_VERIFY_SMS_PAGE', userRoot: data });
        } else {
          dispatch({ type: 'TO_SIGNUP_PAGE' });
        }
      },
      forgotPassword: async (data) => {
        if (data && data.dni !== undefined) {
          dispatch({ type: 'TO_VERIFY_SMS_PAGE', userRoot: data });
        } else {
          dispatch({ type: 'TO_FORGOT_PASS_PAGE' });
        }
      },
      updatePersonalInfo: async (data) => {
        if (data && data.phone !== undefined && data.email !== undefined) {
          dispatch({ type: 'SIGN_IN', userRoot: data })
        } else {
          dispatch({ type: 'TO_UPDATE_PERSONAL_INFO_PAGE', userRoot: data });
        }
      }
    }),
    [],
  );

  const chooseScreen = (state) => {
    let navigateTo = stateConditionString(state);
    let arr = [];

    switch (navigateTo) {
      case 'LOAD_LOADING':
        arr.push(<Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen}
          options={{ headerShown: false }} />);
        break;
      case 'LOAD_SIGNUP':
        arr.push(
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />,
        );
        break;
      case 'LOAD_SIGNIN':
        arr.push(createLoginStack(state.userRoot));
        break;
      case 'LOAD_APP':
        arr.push(
          <Stack.Screen
            name="TabScreen"
            component={TabScreen}
            initialParams={{ userRoot: state.userRoot }}
          />);
        break;
      case 'LOAD_FORGOT_PASSWORD':
        arr.push(
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />,
        );
        break;
      case 'LOAD_VERIFY_SMS':
        arr.push(
          <Stack.Screen
            name="VerifySMSScreen"
            initialParams={{ userRoot: state.userRoot }}
            component={VerifySMSScreen}
            options={{ headerShown: false }}
          />,
        );
        break;
      case 'LOAD_UPDATE_PERSONAL_INFO':
        arr.push(
          <Stack.Screen
            name="UpdatePersonalInfoScreen"
            initialParams={{ userRoot: state.userRoot }}
            component={UpdatePersonalInfoScreen}
            options={{
              headerTitle: null,
              headerLeft: () => (
                <Image
                  style={{ width: 120, height: 30, marginLeft: 10 }}
                  source={Constant.GLOBAL.IMAGES.TITLE_LOGO}>
                </Image>
              )
            }}
          />,
        );
        break;
      default:
        arr.push(createLoginStack(state.userRoot));
        break;
    }
    return arr[0];
  };

  return (
    <Fragment>
    <SafeAreaView style={{ flex: 0, backgroundColor:'white' }} />
    <SafeAreaView style={{ flex: 1, backgroundColor:'white' }}>
    {
      Platform.OS ==="android" && <StatusBar barStyle="dark-content" backgroundColor={'white'}/>
    }
      <AuthContext.Provider value={authContextValue}>
        <NavigationContainer>
          <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaView>
    </Fragment>
  );
};

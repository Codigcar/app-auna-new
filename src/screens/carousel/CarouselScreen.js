import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
  Fragment,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import {Button, Icon, Divider} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import Constant from '../../utils/constants';
import {ButtonInitial} from '../../components';
import {css} from '../../utils/css';
import {fetchWithToken} from '../../utils/fetchCustom';
import PopupTicket from '../reward/PopupTicket';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';
import {
  animatedStyles,
  scrollInterpolator,
} from '../../utils/animationsCarousel';

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

const CarouselScreen = ({navigation, route}) => {
  console.log('[Stack-CarouselScreen]');
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CarouselHome"
        component={CarouselHome}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
        options={{
          // headerShown:true,
          headerTintColor: 'royalblue',
          headerStyle: {
            // backgroundColor:'red'
          },
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
              dataScreen={'PolicyDataScreen'}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const Stack = createStackNavigator();

const CarouselHome = ({navigation, route}) => {
  console.log('[CarouselHomeScreen]');
  const [activeIndex, setActiveIndex] = useState(0);
  const isMounted = useRef(true);
  const [banners, setBanners] = useState([]);
  const [isViewPopupTicket, setIsViewPopupTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bodyTicket, setBodyTicket] = useState([]);
  const [isLoadingGoPronostik, setIsLoadingGoPronostik] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchBannerListar();
    fetchRegisterTicketSorteo();
  }, []);

  const fetchBannerListar = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      if (isMounted.current) {
        console.error('[banners]: ', response);
        if (response.CodigoMensaje === 100) {
          setBanners(response.Result);
        } else {
          console.error('[CarouselScreen - fetchBannerListar error]: ', response);
          Alert.alert('Error', 'Intentelo nuevamente en unos minutos');
        }
      }
    } catch (error) {
      console.error('[CarouselScreen - fetchBannerListar error]: ', error);
      Alert.alert('Error', 'Intentelo nuevamente en unos minutos');
    }
  };

  const fetchPronostikEncriptar = async () => {
    try {
      setIsLoadingGoPronostik(true);
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        TipoDocumento: '1',
        Documento: route.params.userRoot.numeroDocumento,
        Nombres:
          route.params.userRoot.nombre +
          route.params.userRoot.apellidoPaterno +
          route.params.userRoot.apellidoMaterno,
      });
      const response = await fetchWithToken(
        Constant.URI.POST_PRONOSTIK,
        'POST',
        params,
        route.params.userRoot.Token,
      );
        console.warn('responsePronostik: ',response);
        if (response.CodigoMensaje === '100') {
          openURL(response.Url);
        }
    } catch (error) {
      console.log('[CarouselScreen - fetchPronostikEncriptar error]: ', error);
      Alert.alert('Error', 'Intentelo nuevamente en unos minutos');
    }
  };

  const fetchRegisterTicketSorteo = async () => {
    try {
      const params = new URLSearchParams({
        I_Sistema_IdSistema: route.params.userRoot.idSistema,
        I_UsuarioExterno_IdUsuarioExterno:
          route.params.userRoot.idUsuarioExterno,
      });
      const response = await fetchWithToken(
        Constant.URI.POST_REGISTRAR_USUARIO_SORTEO,
        'POST',
        params,
        route.params.userRoot.Token,
      );
      if (response.CodigoMensaje === 100) {
        setIsViewPopupTicket(true);
      } else {
        Alert.alert('Error', response.RespuestaMensaje);
      }
    } catch (error) {
      console.error('[CarouselScreen - fetchRegisterTicketSorteo]: ', error);
      Alert.alert('Error', 'Intentelo nuevamente en unos minutos');
    }
  };

  const openURL = (url, appname) => {
    setIsLoadingGoPronostik(false);
    console.log('openIURL: ',url);
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

  const renderItem = banner => {
    return (
      <View>
        <Image
          source={{uri: banner.imagen}}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 80,
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: 'white',
                borderTopEndRadius: 20,
                borderBottomStartRadius: 20,
              }}>
              <View
                style={{
                  marginBottom: 10,
                  marginHorizontal: 40,
                  marginTop: 30,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {banner.texto}
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}></Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  borderBottomColor: css.colors.gray_opaque,
                  marginHorizontal: 10,
                }}></View>
              <View>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <Button
                    buttonStyle={{
                      backgroundColor: css.colors.primary_opaque,
                      paddingHorizontal: 20,
                      minWidth: '50%'
                    }}
                    title="Iniciar orientación"
                    titleStyle={{
                      fontSize: 14,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                    onPress={fetchPronostikEncriptar}
                    loading={isLoadingGoPronostik}
                  />
                </View>
              </View>
              <Pagination
                dotsLength={banners.length}
                activeDotIndex={activeIndex}
                dotStyle={{
                  width: 5,
                  height: 5,
                  borderRadius: 10,
                }}
                containerStyle={{paddingTop: 25, paddingBottom: 10}}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Fragment>
      {isLoading ? (
        <LoadingActivityIndicator />
      ) : (
        <>
          {isViewPopupTicket && <PopupTicket />}
          <SafeAreaView>
            <View style={styles.headerContainer}>
              <Carousel
                data={banners}
                renderItem={({item}) => renderItem(item)}
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                scrollInterpolator={scrollInterpolator}
                slideInterpolatedStyle={animatedStyles}
                onSnapToItem={index => {
                  setActiveIndex(index);
                }}
                // useScrollView={true}
              />
            </View>
          </SafeAreaView>
        </>
      )}
    </Fragment>
  );
};

export default CarouselScreen;

const styles = StyleSheet.create({
  headerContainer: {
    borderTopColor: '#d41c1c',
    borderTopWidth: 2,
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

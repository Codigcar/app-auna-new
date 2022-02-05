import React, {useCallback, useRef, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Button, Icon, Divider} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import Constant from '../../utils/constants';
import {ButtonInitial} from '../../components';
import {css} from '../../utils/css';

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

const items = [
  {
    title: 'Tus Pólizas siempre contigo',
    desc: 'Detalles, endoso, primas y mucho más',
    img: require('../../assets/mundo.png'),
  },
  {
    title:
      'El primero orientador médico, basado en inteligencia artificial en el Perú',
    desc: '',
    img: require('../../assets/doctor.gif'),
  },
  {
    title: 'Asegúralos sin perder los momentos en familia',
    desc: '',
    img: require('../../assets/mundo.png'),
  },
];

const CarouselScreen = ({navigation, route}) => {
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
            // backgroundColor: 'rgba(0,0,0, .2)',
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

const CarouselHome = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = item => {
    return (
      <View>
        <Image source={item.img} style={{width: '100%', height: '100%', backgroundColor:'transparent'}} />
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
                  marginBottom: 20,
                  marginHorizontal: 40,
                  marginTop: 30,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Tus Pólizas
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  siempre contigo
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  borderBottomColor: css.colors.gray_opaque,
                  marginHorizontal: 10,
                }}></View>
              <View>
                {item.desc.length > 0 ? (
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      color: css.colors.gray_opaque,
                      marginTop: 20,
                      marginHorizontal: 40,
                      marginBottom:20
                    }}>
                    {item.desc}
                  </Text>
                ) : (
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
                      }}
                      // loading={!(userUpdated && passUpdated)}
                      title="Iniciar orientación"
                      titleStyle={{
                        fontSize: 14,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                      onPress={() => {}}
                      // disabled={
                      //   typeof horario == 'string' ||
                      //   typeof specialty == 'string' ||
                      //   typeof patient == 'string'
                      //     ? true
                      //     : false
                      // }
                    />
                  </View>
                )}
              </View>
              <Pagination
                dotsLength={items.length}
                activeDotIndex={activeIndex}
                dotStyle={{
                  width: 5,
                  height: 5,
                  borderRadius: 10,
                }}
                containerStyle={{paddingTop:25, paddingBottom:10}}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, paddingTop: 50}}>
      <View style={styles.headerContainer}>
        <Carousel
          data={items}
          renderItem={({item}) => renderItem(item)}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          onSnapToItem={index => {
            setActiveIndex(index);
          }}
          style={{}}
        />
      </View>
    </SafeAreaView>
  );
};

export default CarouselScreen;

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: '#FFF',
    borderTopColor: '#d41c1c',
    borderTopWidth: 2,
    // height: 70,
    // paddingLeft: 20,
    // paddingRight: 20,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // marginBottom: 0,
    // borderColor: css.colors.opaque,
    // ...Platform.select({
    //   android: {
    //     elevation: 2,
    //   },
    //   default: {
    //     shadowColor: 'rgba(0,0,0, .2)',
    //     shadowOffset: {height: 0, width: 0},
    //     shadowOpacity: 1,
    //     shadowRadius: 1,
    //   },
    // }),
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

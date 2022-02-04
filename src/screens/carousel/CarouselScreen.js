import React, {useCallback, useRef, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Dimensions} from 'react-native';
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
        <Image source={item.img} style={{width: '100%', height: '100%'}} />
        <View style={{position: 'absolute',top: 0, left: 0, right: 0, bottom: 0, backgroundColor:'red',      }} >
          <View
            style={{
              
            //   width: '80%',
            backgroundColor: 'white',
              borderTopEndRadius: 20,
              borderBottomStartRadius: 20,
              position:'relative',
            //   justifyContent:'center',
              alignItems:'center',
            //   flex:1
            //   bottom: 70,
              // left:'50%',
              // right:'50%',
            }}>
            {/* <View style={{padding: 30,,}}> */}
              <Text>{item.title}</Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: css.colors.gray_opaque,
                }}></View>
              <Text>{item.desc}</Text>
            </View>
          {/* </View> */}
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
      {/* <Pagination
          dotsLength={items.length}
          activeDotIndex={activeIndex}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 10,
          }}
        /> */}
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

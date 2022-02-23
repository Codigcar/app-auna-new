import React, { useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  // Button
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {Button, Icon} from 'react-native-elements';

import {css} from '../../utils/css';
import giftbox from '../../assets/svg/giftbox';
import Modal from 'react-native-modal';

export default function PopupTicket({navigation, route}) {
  //
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      backdropColor="rgba(0,0,0, .9)"
      backdropOpacity={0.8}
      // animationIn="zoomInDown"
      // animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}>
      <DefaultModalContent setIsVisible={setIsVisible} />
    </Modal>
  );
}

const DefaultModalContent = ({setIsVisible}) => (
  <View
    style={{
      flex: 1,
      zIndex: 9999,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <View style={styles.card}>
      <SvgXml
        xml={giftbox}
        height={130}
        width={'100%'}
        style={{
          position: 'absolute',
          top: -50,
          flex: 1,
        }}
      />
      <View style={{height: 80, backgroundColor: 'transparent'}} />
      <View style={{backgroundColor: 'transparent'}}>
        <View>
          <Text style={(styles.textCenter, {textAlign: 'center', fontSize:15,marginHorizontal:10})}>
            Se te ha asignado un número aleatorio para participar en nuestros
            sorteos
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical:25
          }}>
          <View
            style={{
              borderWidth: 3,
              borderColor: css.colors.primary_opaque,
              borderStyle:'dotted',
              width: 150,
              borderRadius: 10,
              padding: 5,
              // paddingHorizontal:10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View style={{textAlign: 'center', backgroundColor: 'transparent', marginRight:0}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 11,
                  color: css.colors.gray_opaque,
                }}>
                Tu ticket N°
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 35,
                  color:css.colors.primary_opaque,
                  ...Platform.select({
                    ios: {
                      fontWeight: '600',
                    },
                    android: {
                      fontWeight: 'bold',
                    },
                  }),
                }}>
                321
              </Text>
            </View>
            <View>
              <Icon 
                name="ticket"
                type="fontisto"
                size={40}
                color={css.colors.primary_opaque}
                // style={{transform:[{rotate:"90deg"}]}}
              />
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.textCenter,
            {
              color: 'rgba(166, 166, 172, 1)',
              fontSize: 12,
              marginHorizontal: 10,
            },
          ]}>
          Ahora te encuentras participando en nuestros sorteos mensuales.
          Encuentra mayor información en la sección Más/Sorteos.
        </Text>
        <Button
          onPress={() => setIsVisible(false)}
          title="¡De acuerdo, gracias!"
          buttonStyle={{
            backgroundColor: '#d41c1c',
            // borderWidth: 1,
            // borderColor: 'red',
            borderRadius: 10,
            height: 40,
            marginVertical: 30,
            paddingVertical: 15,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '90%',
            shadowOpacity: 0.39,
            shadowRadius: 13.97,
            ...Platform.select({
              // ios:{
              //   height:55
              // },
              android: {
                elevation: 16,
              },
              default: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: {height: 0, width: 0},
                shadowOpacity: 1,
                shadowRadius: 1,
              },
            }),
          }}
          titleStyle={{
            // color: css.colors.primary_opaque,
            color: 'white',
            ...Platform.select({
              ios: {
                fontSize: 16,
                height: 24,
                fontWeight:'bold'
              },
              android: {
                fontSize: 16,
                height: 30,
                // color: 'red',
              },
            }),
          }}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  card: {
    width: '90%',
    position: 'relative',
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 15,
    padding: 7,
    borderWidth: 0,
    marginBottom: 14,
    borderColor: 'rgba(0, 0, 0, 0.14)',
    shadowOpacity: 0.39,
    shadowRadius: 13.97,
    borderWidth: 2,
    // borderColor: '#d41c1c',
    ...Platform.select({
      android: {
        elevation: 11,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  textCenter: {
    textAlign: 'center',
  },
  numTicket: {
    fontSize: 32,
  },
});

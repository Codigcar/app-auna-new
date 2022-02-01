import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  // Button
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {Button} from 'react-native-elements';

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
      backdropColor="rgba(0,0,0, .7)"
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
      <View style={{height: 90, backgroundColor: 'transparent'}} />
      <View style={{backgroundColor: 'transparent'}}>
        <View>
          <Text style={styles.textCenter}>
            Se te ha asignado un número aleatorio para participar en nuestros
            sorteos
          </Text>
        </View>
        <Text
          style={[
            styles.textCenter,
            styles.numTicket,
            {color: css.colors.primary, marginVertical: 20},
          ]}>
          N° Ticket: 321
        </Text>
        <Text style={[styles.textCenter, {color: 'rgba(166, 166, 172, 1)'}]}>
          Ahora te encuentras participando en nuestros sorteos mensuales. El
          próximo sorteo es el 01/01/2022. Encuentra mayor información en la
          sección Más/Sorteos.
        </Text>
        <Button
          onPress={() => setIsVisible(false)}
          title="Aceptar"
          buttonStyle={{
            backgroundColor: 'white',
            //   borderColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1,
            borderColor: 'red',
            borderRadius: 10,
            height: 40,
            marginVertical: 30,
            paddingVertical: 15,
            marginLeft: 'auto',
            marginRight: 'auto',
            //   marginBottom: 0,
            // marginRight: 16,
            // marginBottom: 36,
            width: '90%',
            shadowOpacity: 0.39,
            shadowRadius: 13.97,
            ...Platform.select({
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
          titleStyle={{color: css.colors.primary}}
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
    // borderColor: css.colors.primary,
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



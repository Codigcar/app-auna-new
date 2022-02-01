import React, { memo } from 'react';
import {
  Dimensions, Text,
  TouchableWithoutFeedback, View
} from 'react-native';
import { css } from '../utils/css';

const ButtonInitial = ({ navigation, nombre, apellido, dataScreen }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingRight: 10 }}>
    <TouchableWithoutFeedback
      onPress={() => {
        if (dataScreen != null) {
          navigation.navigate(dataScreen);
        }
      }}>
      <View style={{
        backgroundColor: "#DE0B21",
        marginRight: 10,
        padding: 4,
        marginBottom: 0,
        borderRadius: Dimensions.get('window').width / 2,
        borderColor: css.colors.opaque,
        ...Platform.select({
          android: {
            elevation: 5,
          },
          default: {
            shadowColor: 'rgba(0,0,0, .2)',
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 1,
          },
        }),
      }}>
        <Text style={{
          fontSize: 15,
          fontWeight: "bold",
          color: "#FFF",
        }}>
          {nombre.substring(0, 1)}{apellido.substring(0, 1)}
        </Text>
      </View>
    </TouchableWithoutFeedback>
    {/* <PopupMenu
      options={[
        {
          name: 'Contacto',
          onPress: () => navigation.navigate('ContactScreen')
        },
        {
          name: 'Desconectar',
          onPress: () => navigation.navigate('Signout')
        }
      ]}
      menustyle={{
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
    /> */}
  </View>
);


export default memo(ButtonInitial);

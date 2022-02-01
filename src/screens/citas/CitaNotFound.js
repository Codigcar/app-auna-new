import React, { memo } from 'react'
import { View, StatusBar, ActivityIndicator, StyleSheet, Text } from 'react-native'
import constants from '../../utils/constants';
import { css } from '../../utils/css';

export default function CitaNotFound (){
    return (
        <View style={styles.container}>
            <Text style={[styles.colorGrayOpaque, {marginBottom:10}]} >Registra tu primera cita en 3 simples pasos:</Text>
            <Text style={styles.colorGrayOpaque} >1. Elige el tipo Nutricional/Psicológica</Text>
            <Text style={styles.colorGrayOpaque} >2. Elige el paciente</Text>
            <Text style={styles.colorGrayOpaque} >3. Elige la fecha y hora preferida</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'flex-start',
        // backgroundColor:'red',
        // paddingTop:100
        // margin:0,
        height:constants.DEVICE.HEIGHT - (constants.DEVICE.HEIGHT*0.25),
        width:constants.DEVICE.WIDTH,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
    },
    colorGrayOpaque:{
        color:css.colors.gray_opaque,
    }
});




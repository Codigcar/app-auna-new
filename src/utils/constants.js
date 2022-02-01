import { Platform, Dimensions } from "react-native"

export default {
    GLOBAL: {
        ID_SISTEMA: 1,
        ID_CATEGORIA_MENSAJERIA:1,
        IMAGES: Platform.OS === 'android'
            ? {
                BACKGROUND: require('../assets/background.webp'),
                TITLE_LOGO: require('../assets/logo.webp'),
                CONTACT_CONTACT: require('../assets/contacto24x7.webp'),
                POLICY_DETAIL: require('../assets/polizas/detalle.webp'),
                POLICY_DOCUMENTS: require('../assets/polizas/documentos.webp'),
                POLICY_CLINICA: require('../assets/polizas/clinica.webp'),
                POLICY_CLINICA_MAPS: require('../assets/GoogleMaps/googlemaps512.webp'),
                DEPENDIENTES_AVATAR: require('../assets/polizas/dependientesAvatar.webp')
            }
            : {
                BACKGROUND: require('../assets/background.psd'),
                TITLE_LOGO: require('../assets/logo.psd'),
                CONTACT_CONTACT: require('../assets/contacto24x7.psd'),
                POLICY_DETAIL: require('../assets/polizas/detalle.psd'),
                POLICY_DOCUMENTS: require('../assets/polizas/documentos.psd'),
                POLICY_CLINICA: require('../assets/polizas/clinica.psd'),
                POLICY_CLINICA_MAPS: require('../assets/GoogleMaps/googlemaps512.psd'),
                DEPENDIENTES_AVATAR: require('../assets/polizas/dependientesAvatar.psd')
            },
        KEYBOARD_BEHAVIOR: Platform.OS == 'ios' ? "padding" : null,
        KEYBOARD_TYPE_NUMERIC: "numeric",
        IP_ADDRESS: "0.0.0.0",
        MAC_ADDRESS: "000:000:00.00000.0000",
        CONSTANTE_idGrupoRiesgo: 2,       //El valor 2 corresponde a "GRUPO RIESGO DE POLIZAS HUMANAS", en caso recibir un valor diferente  debería ocultarse la Tab ASEGURADOS    (En la pantalla "DetallePóliza") 
    }, 
    URI: {

        PATH: 'https://aws2.laprotectora.com.pe:443/ws_app_minsa_desarrollo/Operations/',
        PATH80: 'http://aws2.laprotectora.com.pe:80/ws_app_minsa_desarrollo/Operations/',
        //PATH: 'https://aws2.laprotectora.com.pe:443/ws_app_minsa/Operations/',

        LOGIN:                                  'UsuarioExternoLogear',
        GET_USER_POR_DNI_Y_FECHA_NACIMIENTO:    'AseguradoPolizaPotencialPorDniObtener',
        INSERT_USER:                            'UsuarioExternoRegistrar',
        UPDATE_USER:                            'UsuarioExternoBasicosActualizar',
        UPDATE_PASSWORD:                        'UsuarioExternoClaveActualizar',
        GET_CELxDNI:                            'UsuarioExternoTelefonoMovilResetearObtener',
        GET_CODE_SMS:                           'ObtenerSMS',
        RESET_PASSWORD:                         'UsuarioExternoClaveResetear',
        GET_POLICY:                             'GrupoRiesgoPorUsuarioListar',
        POLIZA_POR_GRUPO_RIESGO_LISTAR:         'PolizaPorGrupoRiesgoListar', 
        POLIZA_DETALLE_OBTENER:                 'PolizaDetalleObtener',
        GET_POLICY_DOCUMENTS:                   'PolizaObtenerDocumentos',
        GET_EJECUTIVOS:                         'EjecutivosConfiguracionPotencial_Listar',
        GET_CONTACT:                            'GestorVisualMensajeria_Listar',  
        GET_SOCIAL_NETWORKS:                    'RedesSociales',
        GET_TERMS_CONDITIONS:                   'GetTerminosyCondiciones',
        GET_UPDATE_INFORMATION_MESSAGE:         'ActualizarInformacionMensaje',
        GET_FUNCIONARIOS:                       'FuncionarioExternoPotencialListar',
        

        GET_ASEGURADOS:                         'Asegurado_Poliza_Listar',
        GET_CATEGORIAS:                         'CategoriaClinica_Listar',
        GET_DEPARTAMENTOS:                      'Departamento_Listar',
        GET_PROVINCIAS:                         'Provincia_Listar',
        GET_DISTRITOS:                          'Distrito_Listar',
        GET_CLINICAS:                           'PolizaClinicaDetalle_Listar',
        
        GESTOR_VISUAL_POLIZA_OBTENER:           'GestorVisualPolizaObtener',

        GESTOR_VISUAL_COMUNICACION_LISTAR:      'GestorVisualComunicacionListar',

        // GET FECHA PROXIMO SORTEO
        GET_FECHA_PROXIMO_SORTEO:                'Sorteo_Ultimo_Listar',
        // GET LISTAR GANDORES SORTEO
        GET_LISTAR_GANADORES_SORTEO:            'SorteoUsuario_Listar',
        // POST REGISTRAR USUARIO A SORTEO
        POST_REGISTRAR_USUARIO_SORTEO:          'SorteoUsuario_Registrar',

        //GET ESPECIALIDAD CITA
        GET_ESPECIALIDADES_LISTAR_CITA:         'Especialidad_Listar',
        //GET PACIENTES PARA REGISTRAR NUEVA CITA
        GET_PACIENTES_CITA:                      'Asegurado_Cita_Listar',
        // GET LISTAR CITAS
        GET_LISTAR_CITA:                         'Cita_Listar',
        // POST RESGITRAR CITA
        POST_REGISTRAR_CITA:                     'Cita_Registrar',
        // PUT CANCELAR CITA
        PUT_CANCELAR_CITA:                       'Cita_Actualizar',

        //Horario
        GET_HORARIOS_LISTAR_X_ESPECIALIDAD:      'HorarioDisponibleCita_Listar',

        //SOLICITUD DE INCLUSIÓN
        GET_LISTAR_SOLICITUDES_INCLUSION:         'Solicitud_Listar',
        //CANCELAR SOLICITUD INCLUSION
        PUT_CANCELAR_SOLICITUD_INCLUSION:        'Solicitud_Actualizar'
        
    },
    CONTACTO_TIPO_COMUNICACION_ICONO: {
        CORREO: 1,
        TELEFONO_FIJO:2,
        MOVILES:3,
        OTRAS: 4
        
    }, 
    DEVICE: {
        WIDTH: Dimensions.get("window").width,
        HEIGHT: Dimensions.get("window").height
    },


} 

      
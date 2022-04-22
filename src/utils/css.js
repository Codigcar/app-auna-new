import {Platform} from 'react-native';

export const css = {
  titleScreen: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  colors: {
    surface: '#1B2732',
    primary: '#ff0000',
    secondary: '#000000',
    error: '#ff0000',
    buttonBorder: '#D5D5D5',
    button: 'red',
    opaque: 'rgba(0,0,0,0.5)',
    primary_opaque: '#d41c1c',
    gray_opaque: 'rgba(166, 166, 172, 1)',
    gray_opaque_agua: 'rgba(166, 166, 172, .3)',
    white: '#fff',
    shadowColorCard: 'rgba(0, 0, 0, 0.14)',
  },
  containerCard: {
    margin: -5,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  containerViewCard: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  buttonContainer: {
    margin: 20,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#ff0000',
    borderRadius: 10,
  },
  buttonContainerOutline: {
    backgroundColor: 'white',
    borderWidth:1,
    borderColor: '#d41c1c',
    borderRadius: 10,
    marginHorizontal:30,
    marginTop:20,
  },
  inputContainer: {
    borderRadius: 5,
    marginBottom: -20,
    borderColor: 'rgba(0,0,0, .2)',
    ...Platform.select({
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  inputErrorContainer: {
    color: '#ff0000',
    textAlign: 'right',
    paddingRight: 2,
  },
  divider: {
    backgroundColor: 'rgba(0,0,0, .2)',
    padding: 0.2,
    margin: 2,
  },

  dividerTitleLineRed: {
    borderColor: '#d41c1c',
    backgroundColor: '#d41c1c',
    borderWidth: 2,
    marginLeft: 20,
    width: 50,
  },

  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  designElevationCardiOS: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
};

import { Dimensions } from 'react-native';

export const getScreenWidth = () => Dimensions.get('window').width;
export const getScreenHeight = () => Dimensions.get('window').height;

export const Colors = {
    containerBackgroundColor: '#FEFFFE',
    codeViewBorderColor: 'grey',
    focusedCodeViewBorderColor: '#1192F6',
    codeColor: '#222',
    coverColor: 'black',
};

export const Constants = {
    autoFocus: false,
    verifyCodeLength: 5,
    codeViewWidth: getScreenWidth() / ((3 * 5) + 1),
    codeViewBorderWidth: 1.5,
    codeViewBorderRadius: 5,
    codeFontSize: 16,
    secureTextEntry: false,
    warningTitle: 'Advertencia',
    warningContent: 'Solo ingresar números',
    warningButtonText: 'OK',
};

export function getCodeArray(codeArray, verifyCodeLength) {
    const codeArrayLength = codeArray.length;
    for (let i = 0; i < verifyCodeLength; i++) {
        if (i >= codeArrayLength) {
            codeArray[i] = '';
        }
    }
    return codeArray;
}

export function convertDateDDMMYYYY(date) {
    if (date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [(dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm,
        date.getFullYear(),
        ].join('/');
    }
};
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import { Icon } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { css } from '../utils/css';

// const data = [
//   {label: 'Item 1', value: '1'},
//   {label: 'Item 2', value: '2'},
//   {label: 'Item 3', value: '3'},
//   {label: 'Item 4', value: '4'},
//   {label: 'Item 5', value: '5tt'},
//   {label: 'Item 6', value: '6'},
//   {label: 'Item 7', value: '7'},
//   {label: 'Item 8', value: '8'},
// ];

const ElementDropDown = ({data, placeholder, label, value, setValue, iconName}) => {
  // console.log('[data]: ',data);
  // const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: css.colors.primary_opaque}]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor:css.colors.primary_opaque}, {}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        // search
        // searchPlaceholder="Search..."
        dropdownPosition={'bottom'}
        autoScroll={false}
        maxHeight={label === "Fecha" ? 300 : 120}
        // height={50}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          console.log('SetValue: ', item.value)
        }}
        renderLeftIcon={() => (
           <Icon
            name={iconName}
            type="ionicon"
            size={20}
            color={isFocus ? css.colors.primary_opaque : 'black'}
            style={{marginRight:8}}
          />
        )}
      />
    </View>
  );
}; 

export default ElementDropDown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    // padding: 16,
    paddingVertical:16
  },
  dropdown: {
    backgroundColor: 'transparent',
    height: 65,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 6,
    top: 4,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color:'black',

    ...Platform.select({
      ios: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold',
        marginBottom: 12,
      },
      android: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold',
        // marginLeft: 4,
      },
    }),
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
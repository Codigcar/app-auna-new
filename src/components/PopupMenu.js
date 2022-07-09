import React, { memo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuItem } from 'react-native-material-menu';

function PopupMenu({ options, menustyle }) {
    const [menu, setMenu] = useState(null);
    const setMenuRef = ref => {
        setMenu(ref);
    };
    const showMenu = () => {
        menu.show();
    };
    const hideMenu = () => {
        menu.hide();
    };
    const onPress = (method) => {
        hideMenu();
        if (method) {
            method();
        }
    };

    return (
        <View>
            <View style={menustyle}>
                <Menu
                    ref={setMenuRef}
                    button={
                        <TouchableOpacity onPress={() => showMenu()}>
                            <Icon
                                name='more-vert'
                                size={25}
                                color={'grey'} />
                        </TouchableOpacity>
                    }>
                    {
                        options.map((option) => {
                            return (
                                <MenuItem onPress={() => onPress(option.onPress)}>{option.name}</MenuItem>
                            );
                        })
                    }
                </Menu>
            </View>
        </View>
    );
}

export default memo(PopupMenu);
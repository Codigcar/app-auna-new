import React, { memo } from 'react';
import { ImageBackground } from 'react-native';
import Constant from '../utils/constants';

const Background = ({ children }) => (
  <ImageBackground
    source={Constant.GLOBAL.IMAGES.BACKGROUND}
    resizeMode="cover"
    style={{ width: '100%', height: '100%' }}
    imageStyle={{ height: '55%', width: '100%' }}
  >
    {children}
  </ImageBackground>
);

export default memo(Background);

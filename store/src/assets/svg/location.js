import React from 'react';
import Svg, {Path, Polyline,Line} from 'react-native-svg';

export const ComponentLocation = ({iHeight,iWidth,iColor}) => {
  let sWidth = 40;
  let sHeight = 40;
  let sColor = "#000";

  if(iHeight !== undefined && iHeight !== null){
    sHeight = iHeight;
  }

  if(iWidth !== undefined && iWidth !== null){
    sWidth = iWidth;
  }

  if(iColor !== undefined && iColor !== null){
    sColor = iColor;
  }

  return (
    <Svg width={sWidth} height={sHeight} viewBox="0 0 54 47" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M50.7603 46.26H3.24029C1.39029 46.26 0.0702842 44.47 0.610284 42.7L7.06029 21.83C7.42029 20.68 8.48028 19.89 9.69028 19.89H44.3003C45.5103 19.89 46.5703 20.68 46.9303 21.83L53.3803 42.7C53.9303 44.47 52.6003 46.26 50.7503 46.26H50.7603Z" fill="#4E5968"/>
    <Path d="M26.9998 35.57C32.1968 35.57 36.4098 33.9359 36.4098 31.92C36.4098 29.9042 32.1968 28.27 26.9998 28.27C21.8028 28.27 17.5898 29.9042 17.5898 31.92C17.5898 33.9359 21.8028 35.57 26.9998 35.57Z" fill="#3F474F"/>
    <Path d="M40.2705 13.3401C40.2705 18.1801 34.4805 25.5201 30.5505 29.9501C28.6605 32.0801 25.3505 32.0801 23.4505 29.9501C19.5205 25.5201 13.7305 18.1801 13.7305 13.3401C13.7305 6.01007 19.6705 0.0700684 27.0005 0.0700684C34.3305 0.0700684 40.2705 6.01007 40.2705 13.3401Z" fill="#15C07E"/>
    <Path d="M26.9998 17.9101C29.8496 17.9101 32.1598 15.5999 32.1598 12.7501C32.1598 9.9003 29.8496 7.59009 26.9998 7.59009C24.1501 7.59009 21.8398 9.9003 21.8398 12.7501C21.8398 15.5999 24.1501 17.9101 26.9998 17.9101Z" fill="white"/>
    </Svg>
  );
};

import React from 'react';
import Svg, {Path, Rect, G, LinearGradient, Stop, RadialGradient, ClipPath} from 'react-native-svg';

export const ComponentPhoneIcon = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M47.5 0H12.5C5.59644 0 0 5.59644 0 12.5V47.5C0 54.4036 5.59644 60 12.5 60H47.5C54.4036 60 60 54.4036 60 47.5V12.5C60 5.59644 54.4036 0 47.5 0Z" fill="#E8F3FF"/>
    <Path d="M37 15H23C21.3431 15 20 16.3431 20 18V42C20 43.6569 21.3431 45 23 45H37C38.6569 45 40 43.6569 40 42V18C40 16.3431 38.6569 15 37 15Z" fill="#353D4E"/>
    <Path d="M30.0008 35.5751C33.0798 35.5751 35.5758 33.079 35.5758 30C35.5758 26.9211 33.0798 24.425 30.0008 24.425C26.9218 24.425 24.4258 26.9211 24.4258 30C24.4258 33.079 26.9218 35.5751 30.0008 35.5751Z" fill="#1A7CFF"/>
    <Path d="M29.6652 32.1651C29.5352 32.1651 29.4102 32.1151 29.3102 32.0201L27.2752 29.9851C27.0802 29.7901 27.0802 29.4751 27.2752 29.2801C27.4702 29.0851 27.7852 29.0851 27.9802 29.2801L29.6602 30.9601L32.3252 28.2951C32.5202 28.1001 32.8352 28.1001 33.0302 28.2951C33.2252 28.4901 33.2252 28.8051 33.0302 29.0001L30.0102 32.0201C29.9102 32.1201 29.7852 32.1651 29.6552 32.1651H29.6652Z" fill="white"/>
    </Svg>
  );
};

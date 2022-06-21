import React from 'react';
import Svg, {Path, Rect, G, ClipPath } from 'react-native-svg';

export const ComponentIcGps = ({iHeight,iWidth,iColor}) => {
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
    <Svg height={sHeight} width={sWidth} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path fillRule="evenodd" clipRule="evenodd" d="M15.9999 6.66667C12.2343 6.66667 7.99992 9.48414 7.99992 14.8667C7.99992 18.1889 10.3971 22.0162 15.9999 26.3301L16.0014 26.329L16.0014 26.329C21.6014 22.0304 23.9999 18.1896 23.9999 14.8667C23.9999 9.48414 19.7656 6.66667 15.9999 6.66667ZM5.33325 14.8667C5.33325 7.74253 11.0456 4 15.9999 4C20.9543 4 26.6666 7.74253 26.6666 14.8667C26.6666 19.4897 23.3861 24.0215 17.6279 28.4422C16.6676 29.1862 15.3308 29.1859 14.3708 28.4413C8.61514 24.0092 5.33325 19.4905 5.33325 14.8667Z" fill={sColor} />
      <Path d="M13.3333 14.6667C13.3333 13.2 14.5333 12 15.9999 12C17.4666 12 18.6666 13.2 18.6666 14.6667C18.6666 16.1333 17.4666 17.3333 15.9999 17.3333C14.5333 17.3333 13.3333 16.1333 13.3333 14.6667Z" fill={sColor} />
    </Svg>
  );
};

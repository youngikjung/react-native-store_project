import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentIcImg = ({iHeight,iWidth,iColor}) => {
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
    <Path d="M25.3333 6.66667V25.3333H6.66667V6.66667H25.3333ZM25.3333 4H6.66667C5.2 4 4 5.2 4 6.66667V25.3333C4 26.8 5.2 28 6.66667 28H25.3333C26.8 28 28 26.8 28 25.3333V6.66667C28 5.2 26.8 4 25.3333 4ZM18.8533 15.8133L14.8533 20.9733L12 17.52L8 22.6667H24L18.8533 15.8133Z" fill="#DFDFDF"/>
    </Svg>
  );
};

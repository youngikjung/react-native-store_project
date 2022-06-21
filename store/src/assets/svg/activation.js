import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const ComponentActivation = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="20" cy="20" r="20" fill="#6490E7"/>
      <Path d="M18 25L29 14" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <Path d="M12 19L18 25" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    </Svg>
  );
};

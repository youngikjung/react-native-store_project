import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const ComponentDeleteTimeLine = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="10" cy="10" r="9.5" fill="#FAFAFB" stroke="#EF4452"/>
      <Path d="M13.5005 6.50195L6.50049 13.502" stroke="#EF4452" strokeLinecap="round"/>
      <Path d="M13.5005 13.502L6.50049 6.50195" stroke="#EF4452" strokeLinecap="round"/>
    </Svg>
  );
};

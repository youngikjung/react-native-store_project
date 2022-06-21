import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ComponentHomeLogo = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sHeight} height={sHeight} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M6 21H18C19.1046 21 20 20.1046 20 19V9.66365C20 9.0125 19.683 8.40212 19.1504 8.02759L13.1504 3.80884C12.4602 3.32359 11.5398 3.32359 10.8496 3.80884L4.84965 8.02759C4.31699 8.40212 4 9.0125 4 9.66365V19C4 20.1046 4.89543 21 6 21Z" stroke={sColor} strokeWidth="2"/>
      <Path d="M9.5 14C9.5 13.4477 9.94772 13 10.5 13H13.5C14.0523 13 14.5 13.4477 14.5 14V21H9.5V14Z" stroke={sColor} strokeWidth="2"/>
    </Svg>
  );
};

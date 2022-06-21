import React from 'react';
import Svg, {Circle, Line} from 'react-native-svg';

export const ComponentInfo = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-info">
      <Circle cx="12" cy="12" r="10"></Circle>
      <Line x1="12" y1="16" x2="12" y2="12"></Line>
      <Line x1="12" y1="8" x2="12.01" y2="8"></Line>
    </Svg>
  );
};

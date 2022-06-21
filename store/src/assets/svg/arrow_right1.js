import React from 'react';
import Svg, {Circle, Line, Polyline} from 'react-native-svg';

export const ComponentArrowRight1 = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-arrow-right-circle">
      <Circle cx="12" cy="12" r="10"></Circle>
      <Polyline points="12 16 16 12 12 8"></Polyline>
      <Line x1="8" y1="12" x2="16" y2="12"></Line>
    </Svg>
  );
};


import React from 'react';
import Svg, {Circle, Line} from 'react-native-svg';

export const ComponentSearch = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth={"3"} strokeLinecap="round" strokeLinejoin="round" class="feather feather-search">
      <Circle cx="11" cy="11" r="8"></Circle>
      <Line x1="21" y1="21" x2="16.65" y2="16.65"></Line>
    </Svg>
  );
};

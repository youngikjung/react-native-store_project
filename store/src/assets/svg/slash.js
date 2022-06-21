import React from 'react';
import Svg, {Line,Circle} from 'react-native-svg';

export const ComponentSlash = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-slash">
      <Circle cx="12" cy="12" r="10"></Circle>
      <Line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></Line>
    </Svg>
  );
};

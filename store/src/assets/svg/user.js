import React from 'react';
import Svg, {Path, Circle, Rect} from 'react-native-svg';

export const ComponentUser = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-users">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></Path>
      <Circle cx="9" cy="7" r="4"></Circle>
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87"></Path>
      <Path d="M16 3.13a4 4 0 0 1 0 7.75"></Path>
    </Svg>
  );
};

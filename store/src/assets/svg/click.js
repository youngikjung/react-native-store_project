import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export const ComponentClick = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-mouse-pointer">
      <Path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></Path>
      <Path d="M13 13l6 6"></Path>
    </Svg>
  );
};

import React from 'react';
import Svg, {Path, Ellipse} from 'react-native-svg';

export const ComponentDatabase = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-database">
      <Ellipse cx="12" cy="5" rx="9" ry="3"></Ellipse>
      <Path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></Path>
      <Path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></Path>
    </Svg>
  );
};

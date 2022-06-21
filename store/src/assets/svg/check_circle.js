import React from 'react';
import Svg, {Path, Polyline} from 'react-native-svg';

export const ComponentCheckCircle = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-check-circle">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></Path>
      <Polyline points="22 4 12 14.01 9 11.01"></Polyline>
    </Svg>
  );
};

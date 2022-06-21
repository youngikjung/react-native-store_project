import React from 'react';
import Svg, {Path, Rect, G, Polyline, Stop, RadialGradient, ClipPath} from 'react-native-svg';

export const ComponentRepeat = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-repeat">
    <Polyline points="17 1 21 5 17 9"></Polyline>
    <Path d="M3 11V9a4 4 0 0 1 4-4h14"></Path>
    <Polyline points="7 23 3 19 7 15"></Polyline>
    <Path d="M21 13v2a4 4 0 0 1-4 4H3"></Path>
    </Svg>
  );
};

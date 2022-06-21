import React from 'react';
import Svg, {Path, Circle, Line} from 'react-native-svg';

export const ComponentPull = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-git-pull-request">
      <Circle cx="18" cy="18" r="3"></Circle>
      <Circle cx="6" cy="6" r="3"></Circle>
      <Path d="M13 6h3a2 2 0 0 1 2 2v7"></Path>
      <Line x1="6" y1="9" x2="6" y2="21"></Line>
    </Svg>
  );
};

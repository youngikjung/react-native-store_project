import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const ComponentMore = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={iColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-more-horizontal">
      <Circle cx="12" cy="12" r="1"></Circle>
      <Circle cx="19" cy="12" r="1"></Circle>
      <Circle cx="5" cy="12" r="1"></Circle>
    </Svg>
  );
};

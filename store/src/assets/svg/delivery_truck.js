import React from 'react';
import Svg, { Rect, Polygon, Circle } from 'react-native-svg';

export const ComponentDeliveryTruck = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-truck">
      <Rect x="1" y="3" width="15" height="13"></Rect>
      <Polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></Polygon>
      <Circle cx="5.5" cy="18.5" r="2.5"></Circle>
      <Circle cx="18.5" cy="18.5" r="2.5"></Circle>
    </Svg>
  );
};

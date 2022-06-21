import React from 'react';
import Svg, { Rect, G, Line } from "react-native-svg"

export const ComponentSidebar = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-sidebar">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2"></Rect>
    <Line x1="9" y1="3" x2="9" y2="21"></Line>
    </Svg>
  );
};

import React from 'react';
import Svg, {Rect, Line} from 'react-native-svg';

export const ComponentCalender = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-calendar">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2"></Rect>
    <Line x1="16" y1="2" x2="16" y2="6"></Line>
    <Line x1="8" y1="2" x2="8" y2="6"></Line>
    <Line x1="3" y1="10" x2="21" y2="10"></Line>
    </Svg>
  );
};

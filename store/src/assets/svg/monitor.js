import React from 'react';
import Svg, {Rect, Line} from 'react-native-svg';

export const ComponentMonitor = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg"  width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-monitor">
      <Rect x="2" y="3" width="20" height="14" rx="2" ry="2"></Rect>
      <Line x1="8" y1="21" x2="16" y2="21"></Line>
      <Line x1="12" y1="17" x2="12" y2="21"></Line>
    </Svg>
  );
};

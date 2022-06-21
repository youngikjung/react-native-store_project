import React from 'react';
import Svg, {Rect, Line, Polyline} from 'react-native-svg';

export const ComponentCreditCard = ({iHeight,iWidth,iColor}) => {
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
    <Svg xmlns="http://www.w3.org/2000/svg" width={sWidth} height={sHeight} viewBox="0 0 24 24" fill="none" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-credit-card">
    <Rect x="1" y="4" width="22" height="16" rx="2" ry="2"></Rect>
    <Line x1="1" y1="10" x2="23" y2="10"></Line>
    </Svg>
  );
};


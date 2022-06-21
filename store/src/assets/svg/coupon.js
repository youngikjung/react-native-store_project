import React from 'react';
import Svg, {Path, Rect, Circle, LinearGradient, Stop, RadialGradient, ClipPath} from 'react-native-svg';

export const ComponentCoupon = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Rect width="20" height="14" rx="1.66667" fill="#14C17F"/>
    <Circle cx="7.5" cy="4.5" r="1.14277" transform="rotate(-45 7.5 4.5)" stroke="white" stroke-width="1.25"/>
    <Circle cx="12.5" cy="9.5" r="1.14277" transform="rotate(-45 12.5 9.5)" stroke="white" stroke-width="1.25"/>
    <Path d="M6.875 10.125L13.125 3.875" stroke="white" stroke-width="1.25" stroke-linecap="round"/>
    </Svg>
  );
};

import React from 'react';
import Svg, {Circle, Rect, Polyline} from 'react-native-svg';

export const ComponentSelectedCircle = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="10" cy="10" r="10" fill="#6490E7"/>
      <Circle cx="10" cy="10" r="5" fill="white"/>
    </Svg>
  );
};

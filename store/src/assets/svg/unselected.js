import React from 'react';
import Svg, {Circle, Rect, Polyline} from 'react-native-svg';

export const ComponentUnSelected = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="10.5" cy="10.5" r="10.5" fill="#90939A"/>
    <Circle cx="5.5" cy="10.5" r="1.5" fill="white"/>
    <Circle cx="10.5" cy="10.5" r="1.5" fill="white"/>
    <Circle cx="15.5" cy="10.5" r="1.5" fill="white"/>
    </Svg>
  );
};

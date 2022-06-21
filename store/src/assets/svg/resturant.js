import React from 'react';
import Svg, {Path, Rect, Polyline} from 'react-native-svg';

export const ComponentResturant = ({iHeight,iWidth,iColor}) => {
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
    <Svg width={sWidth} height={sHeight} viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M13 2C6.92487 2 2 6.92487 2 13H24C24 6.92487 19.0751 2 13 2Z" fill="#8EC1FE"/>
    <Rect y="12" width="26" height="4" rx="2" fill="#CAE2FF"/>
    <Rect x="11" width="4" height="4" rx="2" fill="#8EC1FE"/>
    </Svg>
  );
};

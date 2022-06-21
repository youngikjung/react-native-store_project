import React from 'react';
import Svg, {Path, Circle, Polyline} from 'react-native-svg';

export const ComponentDeleteImage = ({iHeight,iWidth,iColor}) => {
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
    <Circle cx="10" cy="10" r="10" fill="#B0B8C3"/>
    <Path d="M13.6001 6.39941L6.4001 13.5994" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <Path d="M13.6001 13.5996L6.4001 6.39961" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </Svg>
  );
};
